import React, { useState, useEffect } from 'react';
import { Icons } from './SvgIcons';

function StudentReport() {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('');

    // Fetch students and departments data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [studentsRes, departmentsRes] = await Promise.all([
                    fetch('/api/students'),
                    fetch('/api/departments')
                ]);

                const [studentsData, departmentsData] = await Promise.all([
                    studentsRes.json(),
                    departmentsRes.json()
                ]);

                setStudents(studentsData);
                setDepartments(departmentsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter students based on search term and department
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDepartment = selectedDepartmentFilter === '' ||
            student.department_id === parseInt(selectedDepartmentFilter);

        return matchesSearch && matchesDepartment;
    });

    // Handle student card click
    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setShowDetailModal(true);
    };

    // Close detail modal
    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedStudent(null);
    };

    // Export student data to CSV
    const exportToCSV = () => {
        // Prepare CSV headers
        const headers = [
            'Student ID',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Date of Birth',
            'Age',
            'Gender',
            'Department',
            'Year Level',
            'GPA',
            'Status',
            'Enrollment Date',
            'Address',
            'Emergency Contact Name',
            'Emergency Contact Phone'
        ];

        // Prepare CSV rows
        const rows = filteredStudents.map(student => [
            student.student_id || '',
            student.first_name || '',
            student.last_name || '',
            student.email || '',
            student.phone || '',
            student.date_of_birth || '',
            calculateAge(student.date_of_birth),
            student.gender || '',
            student.department?.name || '',
            student.year_level || '',
            student.gpa || '',
            student.status || '',
            student.enrollment_date || '',
            student.address || '',
            student.emergency_contact_name || '',
            student.emergency_contact_phone || ''
        ]);

        // Create CSV content
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `student_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Get enrollment year
    const getEnrollmentYear = (enrollmentDate) => {
        if (!enrollmentDate) return 'N/A';
        return new Date(enrollmentDate).getFullYear();
    };

    // Get year level status color
    const getYearColor = (year) => {
        if (year <= 2) return '#4CAF50'; // Green for early years
        if (year <= 4) return '#FF9800'; // Orange for later years
        return '#9C27B0'; // Purple for graduate years
    };

    // Get GPA color
    const getGPAColor = (gpa) => {
        if (!gpa || gpa === 'N/A') return '#757575';
        const numGPA = parseFloat(gpa);
        if (numGPA >= 3.5) return '#4CAF50'; // Green for excellent
        if (numGPA >= 3.0) return '#FF9800'; // Orange for good
        if (numGPA >= 2.5) return '#2196F3'; // Blue for average
        return '#f44336'; // Red for below average
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Search and Filter Section */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">
                            <Icons.Search size={16} color="#666" />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search students by name, ID, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={selectedDepartmentFilter}
                        onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name} ({dept.code})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <button
                        type="button"
                        className="btn btn-success w-100"
                        onClick={exportToCSV}
                        disabled={filteredStudents.length === 0}
                    >
                        <Icons.Download size={16} className="me-2" />
                        Export CSV ({filteredStudents.length})
                    </button>
                </div>
            </div>

            {/* Results Summary */}
            <div className="row mb-3">
                <div className="col-12">
                    <div className="alert alert-info d-flex align-items-center">
                        <Icons.Student size={20} color="#0c5460" className="me-2" />
                        <span>
                            Showing {filteredStudents.length} of {students.length} students
                            {selectedDepartmentFilter && (
                                <span className="ms-2">
                                    • Filtered by: {departments.find(d => d.id === parseInt(selectedDepartmentFilter))?.name}
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Student Cards Grid */}
            <div className="row">
                {filteredStudents.map(student => (
                    <div key={student.id} className="col-lg-4 col-md-6 mb-4">
                        <div
                            className="card h-100 shadow-sm student-card"
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid #e0e0e0'
                            }}
                            onClick={() => handleStudentClick(student)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                            }}
                        >
                            <div className="card-body d-flex flex-column">
                                {/* Profile Image Placeholder */}
                                <div className="text-center mb-3">
                                    <div
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            backgroundColor: '#f0f0f0',
                                            border: '3px solid #4CAF50'
                                        }}
                                    >
                                        <Icons.Student size={40} color="#4CAF50" />
                                    </div>
                                </div>

                                {/* Student Name */}
                                <h5 className="card-title text-center mb-2" style={{ color: '#2c5530' }}>
                                    {student.first_name} {student.last_name}
                                </h5>

                                {/* Student ID */}
                                <p className="text-center text-muted mb-3" style={{ fontSize: '14px' }}>
                                    ID: {student.student_id}
                                </p>

                                {/* Basic Information */}
                                <div className="flex-grow-1">
                                    <div className="row mb-2">
                                        <div className="col-6">
                                            <small className="text-muted">Year:</small>
                                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                                {getEnrollmentYear(student.enrollment_date)}
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted">Year:</small>
                                            <div
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: getYearColor(student.year_level)
                                                }}
                                            >
                                                {student.year_level}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <small className="text-muted">Department:</small>
                                        <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                            {student.department?.name || 'N/A'}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-muted">GPA:</small>
                                        <div
                                            style={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                color: getGPAColor(student.gpa)
                                            }}
                                        >
                                            {student.gpa || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="text-center">
                                    <span className={`badge ${
                                        student.status === 'active' ? 'bg-success' :
                                        student.status === 'graduated' ? 'bg-primary' :
                                        student.status === 'suspended' ? 'bg-danger' : 'bg-secondary'
                                    }`}>
                                        {student.status?.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="card-footer bg-light text-center" style={{ fontSize: '12px', color: '#666' }}>
                                Click to view detailed report
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results Message */}
            {filteredStudents.length === 0 && (
                <div className="text-center py-5">
                    <Icons.Student size={64} color="#ccc" />
                    <h4 className="mt-3 text-muted">No students found</h4>
                    <p className="text-muted">
                        {searchTerm || selectedDepartmentFilter ?
                            'Try adjusting your search criteria or filters.' :
                            'No students are currently registered in the system.'
                        }
                    </p>
                </div>
            )}

            {/* Detailed Report Modal */}
            {showDetailModal && selectedStudent && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={closeDetailModal}
                >
                    <div
                        className="modal-dialog modal-lg modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: '#2c5530', color: 'white' }}>
                                <h5 className="modal-title">
                                    <Icons.Student size={20} color="white" className="me-2" />
                                    Student Detailed Report
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={closeDetailModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    {/* Profile Section */}
                                    <div className="col-md-4 text-center mb-4">
                                        <div
                                            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                backgroundColor: '#f0f0f0',
                                                border: '4px solid #4CAF50'
                                            }}
                                        >
                                            <Icons.Student size={60} color="#4CAF50" />
                                        </div>
                                        <h4 style={{ color: '#2c5530' }}>
                                            {selectedStudent.first_name} {selectedStudent.last_name}
                                        </h4>
                                        <p className="text-muted">ID: {selectedStudent.student_id}</p>
                                        <span className={`badge fs-6 ${
                                            selectedStudent.status === 'active' ? 'bg-success' :
                                            selectedStudent.status === 'graduated' ? 'bg-primary' :
                                            selectedStudent.status === 'suspended' ? 'bg-danger' : 'bg-secondary'
                                        }`}>
                                            {selectedStudent.status?.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Details Section */}
                                    <div className="col-md-8">
                                        <div className="row">
                                            <div className="col-12">
                                                <h6 className="border-bottom pb-2 mb-3" style={{ color: '#2c5530' }}>
                                                    Personal Information
                                                </h6>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>Email:</strong><br />
                                                <span className="text-muted">{selectedStudent.email}</span>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>Phone:</strong><br />
                                                <span className="text-muted">{selectedStudent.phone || 'N/A'}</span>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>Date of Birth:</strong><br />
                                                <span className="text-muted">
                                                    {selectedStudent.date_of_birth ?
                                                        new Date(selectedStudent.date_of_birth).toLocaleDateString() : 'N/A'
                                                    }
                                                </span>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>Age:</strong><br />
                                                <span className="text-muted">{calculateAge(selectedStudent.date_of_birth)} years</span>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>Gender:</strong><br />
                                                <span className="text-muted">
                                                    {selectedStudent.gender ?
                                                        selectedStudent.gender.charAt(0).toUpperCase() + selectedStudent.gender.slice(1) : 'N/A'
                                                    }
                                                </span>
                                            </div>
                                            <div className="col-12 mb-3">
                                                <strong>Address:</strong><br />
                                                <span className="text-muted">{selectedStudent.address || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-12">
                                                <h6 className="border-bottom pb-2 mb-3" style={{ color: '#2c5530' }}>
                                                    Academic Information
                                                </h6>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>Department:</strong><br />
                                                <span className="text-muted">{selectedStudent.department?.name || 'N/A'}</span>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>Current Year:</strong><br />
                                                <span
                                                    style={{
                                                        color: getYearColor(selectedStudent.year_level),
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Year {selectedStudent.year_level}
                                                </span>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>GPA:</strong><br />
                                                <span
                                                    style={{
                                                        color: getGPAColor(selectedStudent.gpa),
                                                        fontWeight: '600',
                                                        fontSize: '1.1em'
                                                    }}
                                                >
                                                    {selectedStudent.gpa || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>Enrollment Date:</strong><br />
                                                <span className="text-muted">
                                                    {selectedStudent.enrollment_date ?
                                                        new Date(selectedStudent.enrollment_date).toLocaleDateString() : 'N/A'
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-12">
                                                <h6 className="border-bottom pb-2 mb-3" style={{ color: '#2c5530' }}>
                                                    Emergency Contact
                                                </h6>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>Contact Name:</strong><br />
                                                <span className="text-muted">{selectedStudent.emergency_contact_name || 'N/A'}</span>
                                            </div>
                                            <div className="col-sm-6 mb-3">
                                                <strong>Contact Phone:</strong><br />
                                                <span className="text-muted">{selectedStudent.emergency_contact_phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeDetailModal}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ backgroundColor: '#4CAF50', color: 'white' }}
                                    onClick={() => {
                                        // Add functionality to edit student if needed
                                        console.log('Edit student:', selectedStudent.id);
                                    }}
                                >
                                    Edit Student
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentReport;