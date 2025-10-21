import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function Admin() {
    // State for current section (students, departments, courses)
    const [currentSection, setCurrentSection] = useState('students');
    const [showArchived, setShowArchived] = useState(false);
    const [editId, setEditId] = useState(null);

    // Data states
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [archivedData, setArchivedData] = useState([]);

    // Form states for Student
    const [studentForm, setStudentForm] = useState({
        student_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: 'male',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        department_id: '',
        current_semester: 1,
        gpa: '',
        enrollment_date: '',
        status: 'active'
    });

    // Form states for Department
    const [departmentForm, setDepartmentForm] = useState({
        name: '',
        code: '',
        description: '',
        head_of_department: '',
        contact_email: '',
        contact_phone: ''
    });

    // Form states for Course
    const [courseForm, setCourseForm] = useState({
        name: '',
        code: '',
        description: '',
        credits: 1,
        semester: '1',
        department_id: '',
        instructor: '',
        max_students: 50,
        status: 'active'
    });

    // Load departments on component mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    // Generic fetch function
    const fetchData = async (endpoint, setter) => {
        try {
            const response = await fetch(endpoint);
            if (response.ok) {
                const result = await response.json();
                setter(result);
            } else {
                alert(`Failed to fetch data from ${endpoint}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching data.');
        }
    };

    // Fetch functions
    const fetchStudents = () => fetchData('/api/students', setStudents);
    const fetchDepartments = () => fetchData('/api/departments', setDepartments);
    const fetchCourses = () => fetchData('/api/courses', setCourses);

    const fetchArchivedData = async () => {
        const endpoints = {
            students: '/api/students/archived',
            departments: '/api/departments/archived',
            courses: '/api/courses/archived'
        };
        await fetchData(endpoints[currentSection], setArchivedData);
        setShowArchived(true);
    };

    // Submit handlers
    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoints = {
            students: '/api/students',
            departments: '/api/departments',
            courses: '/api/courses'
        };

        const forms = {
            students: studentForm,
            departments: departmentForm,
            courses: courseForm
        };

        const resetForms = {
            students: () => setStudentForm({
                student_id: '', first_name: '', last_name: '', email: '', phone: '',
                date_of_birth: '', gender: 'male', address: '', emergency_contact_name: '',
                emergency_contact_phone: '', department_id: '', current_semester: 1,
                gpa: '', enrollment_date: '', status: 'active'
            }),
            departments: () => setDepartmentForm({
                name: '', code: '', description: '', head_of_department: '',
                contact_email: '', contact_phone: ''
            }),
            courses: () => setCourseForm({
                name: '', code: '', description: '', credits: 1, semester: '1',
                department_id: '', instructor: '', max_students: 50, status: 'active'
            })
        };

        const refreshFunctions = {
            students: fetchStudents,
            departments: fetchDepartments,
            courses: fetchCourses
        };

        try {
            const url = editId ? `${endpoints[currentSection]}/${editId}` : endpoints[currentSection];
            const method = editId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify(forms[currentSection]),
            });

            if (response.ok) {
                alert(`${currentSection.slice(0, -1)} ${editId ? 'updated' : 'created'} successfully!`);
                resetForms[currentSection]();
                setEditId(null);
                refreshFunctions[currentSection]();
            } else {
                const errorData = await response.json();
                alert(`Failed to ${editId ? 'update' : 'create'} ${currentSection.slice(0, -1)}: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };

    // Edit handlers
    const handleEdit = (item) => {
        setEditId(item.id);

        if (currentSection === 'students') {
            setStudentForm({
                student_id: item.student_id || '',
                first_name: item.first_name || '',
                last_name: item.last_name || '',
                email: item.email || '',
                phone: item.phone || '',
                date_of_birth: item.date_of_birth || '',
                gender: item.gender || 'male',
                address: item.address || '',
                emergency_contact_name: item.emergency_contact_name || '',
                emergency_contact_phone: item.emergency_contact_phone || '',
                department_id: item.department_id || '',
                current_semester: item.current_semester || 1,
                gpa: item.gpa || '',
                enrollment_date: item.enrollment_date || '',
                status: item.status || 'active'
            });
        } else if (currentSection === 'departments') {
            setDepartmentForm({
                name: item.name || '',
                code: item.code || '',
                description: item.description || '',
                head_of_department: item.head_of_department || '',
                contact_email: item.contact_email || '',
                contact_phone: item.contact_phone || ''
            });
        } else if (currentSection === 'courses') {
            setCourseForm({
                name: item.name || '',
                code: item.code || '',
                description: item.description || '',
                credits: item.credits || 1,
                semester: item.semester || '1',
                department_id: item.department_id || '',
                instructor: item.instructor || '',
                max_students: item.max_students || 50,
                status: item.status || 'active'
            });
        }
    };

    // Archive handler
    const handleArchive = async (id) => {
        if (!window.confirm(`Are you sure you want to archive this ${currentSection.slice(0, -1)}?`)) return;

        const endpoints = {
            students: `/api/students/${id}/archive`,
            departments: `/api/departments/${id}/archive`,
            courses: `/api/courses/${id}/archive`
        };

        const refreshFunctions = {
            students: fetchStudents,
            departments: fetchDepartments,
            courses: fetchCourses
        };

        try {
            const response = await fetch(endpoints[currentSection], {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            if (response.ok) {
                alert(`${currentSection.slice(0, -1)} archived successfully!`);
                refreshFunctions[currentSection]();
            } else {
                alert(`Failed to archive ${currentSection.slice(0, -1)}.`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while archiving.');
        }
    };

    // Section change handler
    const handleSectionChange = (section) => {
        setCurrentSection(section);
        setShowArchived(false);
        setEditId(null);

        // Fetch data for the new section
        if (section === 'students') fetchStudents();
        else if (section === 'departments') fetchDepartments();
        else if (section === 'courses') fetchCourses();
    };

    const handleBackToHome = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const userParams = new URLSearchParams({
            firstName: urlParams.get('firstName') || 'User',
            lastName: urlParams.get('lastName') || '',
            userType: urlParams.get('userType') || 'employee',
            email: urlParams.get('email') || 'user@example.com'
        });
        window.location.href = `/home?${userParams.toString()}`;
    };

    // Get current data and form based on section
    const getCurrentData = () => {
        if (currentSection === 'students') return students;
        if (currentSection === 'departments') return departments;
        if (currentSection === 'courses') return courses;
        return [];
    };

    const getCurrentForm = () => {
        if (currentSection === 'students') return studentForm;
        if (currentSection === 'departments') return departmentForm;
        if (currentSection === 'courses') return courseForm;
        return {};
    };

    const handleFormChange = (field, value) => {
        if (currentSection === 'students') {
            setStudentForm(prev => ({ ...prev, [field]: value }));
        } else if (currentSection === 'departments') {
            setDepartmentForm(prev => ({ ...prev, [field]: value }));
        } else if (currentSection === 'courses') {
            setCourseForm(prev => ({ ...prev, [field]: value }));
        }
    };

    // Render form fields based on current section
    const renderFormFields = () => {
        const form = getCurrentForm();

        if (currentSection === 'students') {
            return (
                <>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Student ID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.student_id}
                                onChange={(e) => handleFormChange('student_id', e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Department</label>
                            <select
                                className="form-control"
                                value={form.department_id}
                                onChange={(e) => handleFormChange('department_id', e.target.value)}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.first_name}
                                onChange={(e) => handleFormChange('first_name', e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.last_name}
                                onChange={(e) => handleFormChange('last_name', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={form.email}
                                onChange={(e) => handleFormChange('email', e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.phone}
                                onChange={(e) => handleFormChange('phone', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                className="form-control"
                                value={form.date_of_birth}
                                onChange={(e) => handleFormChange('date_of_birth', e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Gender</label>
                            <select
                                className="form-control"
                                value={form.gender}
                                onChange={(e) => handleFormChange('gender', e.target.value)}
                                required
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Current Semester</label>
                            <select
                                className="form-control"
                                value={form.current_semester}
                                onChange={(e) => handleFormChange('current_semester', parseInt(e.target.value))}
                                required
                            >
                                {[1,2,3,4,5,6,7,8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">GPA</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="4"
                                className="form-control"
                                value={form.gpa}
                                onChange={(e) => handleFormChange('gpa', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Enrollment Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={form.enrollment_date}
                                onChange={(e) => handleFormChange('enrollment_date', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={form.address}
                            onChange={(e) => handleFormChange('address', e.target.value)}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Emergency Contact Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.emergency_contact_name}
                                onChange={(e) => handleFormChange('emergency_contact_name', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Emergency Contact Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.emergency_contact_phone}
                                onChange={(e) => handleFormChange('emergency_contact_phone', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                            className="form-control"
                            value={form.status}
                            onChange={(e) => handleFormChange('status', e.target.value)}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="graduated">Graduated</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </>
            );
        } else if (currentSection === 'departments') {
            return (
                <>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Department Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.name}
                                onChange={(e) => handleFormChange('name', e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Department Code</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.code}
                                onChange={(e) => handleFormChange('code', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={form.description}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Head of Department</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.head_of_department}
                                onChange={(e) => handleFormChange('head_of_department', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Contact Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={form.contact_email}
                                onChange={(e) => handleFormChange('contact_email', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Contact Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.contact_phone}
                                onChange={(e) => handleFormChange('contact_phone', e.target.value)}
                            />
                        </div>
                    </div>
                </>
            );
        } else if (currentSection === 'courses') {
            return (
                <>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Course Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.name}
                                onChange={(e) => handleFormChange('name', e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Course Code</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.code}
                                onChange={(e) => handleFormChange('code', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={form.description}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Credits</label>
                            <input
                                type="number"
                                min="1"
                                max="6"
                                className="form-control"
                                value={form.credits}
                                onChange={(e) => handleFormChange('credits', parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Semester</label>
                            <select
                                className="form-control"
                                value={form.semester}
                                onChange={(e) => handleFormChange('semester', e.target.value)}
                                required
                            >
                                {[1,2,3,4,5,6,7,8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Max Students</label>
                            <input
                                type="number"
                                min="1"
                                className="form-control"
                                value={form.max_students}
                                onChange={(e) => handleFormChange('max_students', parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Status</label>
                            <select
                                className="form-control"
                                value={form.status}
                                onChange={(e) => handleFormChange('status', e.target.value)}
                                required
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Department</label>
                            <select
                                className="form-control"
                                value={form.department_id}
                                onChange={(e) => handleFormChange('department_id', e.target.value)}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Instructor</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.instructor}
                                onChange={(e) => handleFormChange('instructor', e.target.value)}
                            />
                        </div>
                    </div>
                </>
            );
        }
    };

    // Render data table
    const renderDataTable = () => {
        const data = showArchived ? archivedData : getCurrentData();

        if (data.length === 0) {
            return (
                <div className="alert alert-info">
                    No {showArchived ? 'archived' : 'active'} {currentSection} found.
                </div>
            );
        }

        if (currentSection === 'students') {
            return (
                <table className="table table-bordered table-striped">
                    <thead className={showArchived ? "table-warning" : "table-primary"}>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Semester</th>
                            <th>GPA</th>
                            <th>Status</th>
                            {showArchived && <th>Archived At</th>}
                            {!showArchived && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(student => (
                            <tr key={student.id}>
                                <td>{student.student_id}</td>
                                <td>{student.first_name} {student.last_name}</td>
                                <td>{student.email}</td>
                                <td>{student.department?.name || 'N/A'}</td>
                                <td>{student.current_semester}</td>
                                <td>{student.gpa || 'N/A'}</td>
                                <td>
                                    <span className={`badge ${
                                        student.status === 'active' ? 'bg-success' :
                                        student.status === 'graduated' ? 'bg-primary' :
                                        student.status === 'suspended' ? 'bg-danger' : 'bg-secondary'
                                    }`}>
                                        {student.status}
                                    </span>
                                </td>
                                {showArchived && (
                                    <td>{student.archived_at ? new Date(student.archived_at).toLocaleString() : 'N/A'}</td>
                                )}
                                {!showArchived && (
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(student)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleArchive(student.id)}
                                        >
                                            Archive
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (currentSection === 'departments') {
            return (
                <table className="table table-bordered table-striped">
                    <thead className={showArchived ? "table-warning" : "table-primary"}>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Head</th>
                            <th>Contact</th>
                            <th>Students</th>
                            <th>Courses</th>
                            {showArchived && <th>Archived At</th>}
                            {!showArchived && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(dept => (
                            <tr key={dept.id}>
                                <td>{dept.code}</td>
                                <td>{dept.name}</td>
                                <td>{dept.head_of_department || 'N/A'}</td>
                                <td>{dept.contact_email || 'N/A'}</td>
                                <td>{dept.students_count || 0}</td>
                                <td>{dept.courses_count || 0}</td>
                                {showArchived && (
                                    <td>{dept.archived_at ? new Date(dept.archived_at).toLocaleString() : 'N/A'}</td>
                                )}
                                {!showArchived && (
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(dept)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleArchive(dept.id)}
                                        >
                                            Archive
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (currentSection === 'courses') {
            return (
                <table className="table table-bordered table-striped">
                    <thead className={showArchived ? "table-warning" : "table-primary"}>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Credits</th>
                            <th>Semester</th>
                            <th>Instructor</th>
                            <th>Max Students</th>
                            <th>Status</th>
                            {showArchived && <th>Archived At</th>}
                            {!showArchived && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(course => (
                            <tr key={course.id}>
                                <td>{course.code}</td>
                                <td>{course.name}</td>
                                <td>{course.department?.name || 'N/A'}</td>
                                <td>{course.credits}</td>
                                <td>{course.semester}</td>
                                <td>{course.instructor || 'TBA'}</td>
                                <td>{course.max_students}</td>
                                <td>
                                    <span className={`badge ${course.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                        {course.status}
                                    </span>
                                </td>
                                {showArchived && (
                                    <td>{course.archived_at ? new Date(course.archived_at).toLocaleString() : 'N/A'}</td>
                                )}
                                {!showArchived && (
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(course)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleArchive(course.id)}
                                        >
                                            Archive
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand ms-3" href="#">Castro University - Profile Management System</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto me-3">
                            <li className="nav-item">
                                <button
                                    className="nav-link btn btn-link text-white"
                                    onClick={handleBackToHome}
                                    style={{border: 'none', background: 'none'}}
                                >
                                    Back to Dashboard
                                </button>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="container-fluid" style={{ paddingTop: '80px' }}>
                <div className="row">
                    {/* Sidebar Navigation */}
                    <div className="col-md-3">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Management Sections</h5>
                            </div>
                            <div className="list-group list-group-flush">
                                <button
                                    className={`list-group-item list-group-item-action d-flex align-items-center ${currentSection === 'students' ? 'active' : ''}`}
                                    onClick={() => handleSectionChange('students')}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V6.5C15 5.67 14.33 5 13.5 5H10.5C9.67 5 9 5.67 9 6.5V7.5L3 7V9L9 8.5V21C9 21.55 9.45 22 10 22H11C11.55 22 12 21.55 12 21V16H12V21C12 21.55 12.45 22 13 22H14C14.55 22 15 21.55 15 21V8.5L21 9Z" fill="currentColor"/>
                                    </svg>
                                    Student Profiles
                                </button>
                                <button
                                    className={`list-group-item list-group-item-action d-flex align-items-center ${currentSection === 'departments' ? 'active' : ''}`}
                                    onClick={() => handleSectionChange('departments')}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                                        <path d="M12 3L2 12H5V20H19V12H22L12 3ZM12 8.75C12.69 8.75 13.25 9.31 13.25 10S12.69 11.25 12 11.25 10.75 10.69 10.75 10 11.31 8.75 12 8.75ZM7 19V17C7 15.9 9.79 15 12 15S17 15.9 17 17V19H7Z" fill="currentColor"/>
                                    </svg>
                                    Departments
                                </button>
                                <button
                                    className={`list-group-item list-group-item-action d-flex align-items-center ${currentSection === 'courses' ? 'active' : ''}`}
                                    onClick={() => handleSectionChange('courses')}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                                        <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20ZM7 19H9V17H7V19ZM11 19H13V17H11V19ZM15 19H17V17H15V19ZM7 15H9V13H7V15ZM11 15H13V13H11V15ZM15 15H17V13H15V15ZM7 11H9V9H7V11ZM11 11H13V9H11V11ZM15 11H17V9H15V11ZM7 7H17V5H7V7Z" fill="currentColor"/>
                                    </svg>
                                    Courses
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9">
                        <div className="card shadow">
                            <div className="card-header bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0">
                                        {editId ? `Edit ${currentSection.slice(0, -1)}` : `Add New ${currentSection.slice(0, -1)}`}
                                    </h4>
                                    <div className="badge bg-info text-dark px-3 py-2">
                                        University Profile Management
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {renderFormFields()}

                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-success">
                                            {editId ? 'Update' : 'Create'} {currentSection.slice(0, -1)}
                                        </button>
                                        {editId && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setEditId(null);
                                                    if (currentSection === 'students') {
                                                        setStudentForm({
                                                            student_id: '', first_name: '', last_name: '', email: '', phone: '',
                                                            date_of_birth: '', gender: 'male', address: '', emergency_contact_name: '',
                                                            emergency_contact_phone: '', department_id: '', current_semester: 1,
                                                            gpa: '', enrollment_date: '', status: 'active'
                                                        });
                                                    } else if (currentSection === 'departments') {
                                                        setDepartmentForm({
                                                            name: '', code: '', description: '', head_of_department: '',
                                                            contact_email: '', contact_phone: ''
                                                        });
                                                    } else if (currentSection === 'courses') {
                                                        setCourseForm({
                                                            name: '', code: '', description: '', credits: 1, semester: '1',
                                                            department_id: '', instructor: '', max_students: 50, status: 'active'
                                                        });
                                                    }
                                                }}
                                            >
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="card shadow mt-4">
                            <div className="card-header bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        {showArchived ? 'Archived' : 'Active'} {currentSection}
                                    </h5>
                                    <div className="d-flex gap-2">
                                        {!showArchived && (
                                            <button
                                                onClick={() => {
                                                    if (currentSection === 'students') fetchStudents();
                                                    else if (currentSection === 'departments') fetchDepartments();
                                                    else if (currentSection === 'courses') fetchCourses();
                                                }}
                                                className="btn btn-primary btn-sm"
                                            >
                                                Refresh Data
                                            </button>
                                        )}
                                        <button
                                            onClick={fetchArchivedData}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            View Archived
                                        </button>
                                        {showArchived && (
                                            <button
                                                onClick={() => setShowArchived(false)}
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                Hide Archived
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    {renderDataTable()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Admin;

console.log('Admin.js loaded');
const adminElement = document.getElementById('admin');
console.log('Admin element found:', adminElement);

if (adminElement) {
    console.log('Rendering Admin component');
    ReactDOM.render(<Admin />, adminElement);
} else {
    console.log('Admin element not found');
}