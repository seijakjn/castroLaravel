import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Icons } from './SvgIcons';

function CourseEnrollment() {
    const [user, setUser] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            firstName: urlParams.get('firstName') || 'John',
            lastName: urlParams.get('lastName') || 'Doe',
            userType: urlParams.get('userType') || 'student',
            email: urlParams.get('email') || 'user@example.com'
        };
    });

    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [students, setStudents] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedYearLevel, setSelectedYearLevel] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentStudent, setCurrentStudent] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Apply global styles to ensure full-width
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'course-enrollment-reset';
        style.textContent = `
            html, body {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
                background-color: #f8f9fa !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                box-sizing: border-box !important;
            }
            #app, #course-enrollment {
                width: 100% !important;
                height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .container, .container-fluid {
                margin: 0 !important;
                padding: 0 !important;
                max-width: none !important;
                width: 100% !important;
            }
        `;

        document.head.appendChild(style);

        return () => {
            const existingStyle = document.getElementById('course-enrollment-reset');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [departmentsRes, studentsRes] = await Promise.all([
                    fetch('/api/departments'),
                    fetch('/api/students')
                ]);

                const [departmentsData, studentsData] = await Promise.all([
                    departmentsRes.json(),
                    studentsRes.json()
                ]);

                setDepartments(departmentsData);
                setStudents(studentsData);

                // Find current student by email
                const student = studentsData.find(s => s.email === user.email);
                if (student) {
                    setCurrentStudent(student);
                    setSelectedDepartment(student.department_id.toString());
                    setSelectedYearLevel(student.year_level.toString());

                    // Fetch available courses for this student
                    const coursesRes = await fetch(`/api/courses/available?department_id=${student.department_id}&year_level=${student.year_level}&student_id=${student.id}`);
                    const coursesData = await coursesRes.json();
                    setCourses(coursesData);

                    // Fetch current enrollments
                    const enrollmentsRes = await fetch(`/api/students/${student.id}/enrollments`);
                    const enrollmentsData = await enrollmentsRes.json();
                    setEnrollments(enrollmentsData);
                } else {
                    // Fallback: fetch all courses if student not found
                    const coursesRes = await fetch('/api/courses');
                    const coursesData = await coursesRes.json();
                    setCourses(coursesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.email]);

    // Filter courses based on selected criteria
    const filteredCourses = courses.filter(course => {
        const matchesDepartment = selectedDepartment === '' || course.department_id.toString() === selectedDepartment;
        const matchesYearLevel = selectedYearLevel === '' || course.year_level.toString() === selectedYearLevel;
        const matchesSearch = searchTerm === '' ||
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesDepartment && matchesYearLevel && matchesSearch;
    });

    const handleLogout = () => {
        window.location.href = '/';
    };

    const goBackToHome = () => {
        const params = new URLSearchParams({
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
            email: user.email
        });
        window.location.href = `/home?${params.toString()}`;
    };

    // Handle course enrollment
    const handleEnrollment = async (courseId) => {
        if (!currentStudent) {
            alert('Student information not found. Please refresh the page and try again.');
            return;
        }

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const semester = currentMonth >= 9 || currentMonth <= 1 ? 'Fall' : currentMonth <= 5 ? 'Spring' : 'Summer';

        try {
            const response = await fetch('/api/enrollments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    student_id: currentStudent.id,
                    course_id: courseId,
                    semester: semester,
                    academic_year: currentYear,
                    section: 'A' // Default section
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                // Refresh courses and enrollments
                const coursesRes = await fetch(`/api/courses/available?department_id=${currentStudent.department_id}&year_level=${currentStudent.year_level}&student_id=${currentStudent.id}`);
                const coursesData = await coursesRes.json();
                setCourses(coursesData);

                const enrollmentsRes = await fetch(`/api/students/${currentStudent.id}/enrollments`);
                const enrollmentsData = await enrollmentsRes.json();
                setEnrollments(enrollmentsData);
            } else {
                alert(data.message || 'Failed to enroll in course');
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
            alert('Failed to enroll in course. Please try again.');
        }
    };

    // Handle course unenrollment
    const handleUnenrollment = async (courseId) => {
        if (!currentStudent) {
            alert('Student information not found. Please refresh the page and try again.');
            return;
        }

        const enrollment = enrollments.find(e => e.course_id === courseId);
        if (!enrollment) {
            alert('Enrollment record not found.');
            return;
        }

        const confirmUnenroll = confirm('Are you sure you want to unenroll from this course?');
        if (!confirmUnenroll) return;

        try {
            const response = await fetch(`/api/enrollments/${enrollment.id}/unenroll`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    student_id: currentStudent.id
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                // Refresh courses and enrollments
                const coursesRes = await fetch(`/api/courses/available?department_id=${currentStudent.department_id}&year_level=${currentStudent.year_level}&student_id=${currentStudent.id}`);
                const coursesData = await coursesRes.json();
                setCourses(coursesData);

                const enrollmentsRes = await fetch(`/api/students/${currentStudent.id}/enrollments`);
                const enrollmentsData = await enrollmentsRes.json();
                setEnrollments(enrollmentsData);
            } else {
                alert(data.message || 'Failed to unenroll from course');
            }
        } catch (error) {
            console.error('Error unenrolling from course:', error);
            alert('Failed to unenroll from course. Please try again.');
        }
    };

    const getDepartmentName = (departmentId) => {
        const department = departments.find(d => d.id === departmentId);
        return department ? department.name : 'Unknown Department';
    };

    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        sidebar: {
            width: isMobile ? (isMobileMenuOpen ? '250px' : '0') : '250px',
            backgroundColor: '#2c5530',
            color: 'white',
            padding: '0',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto',
            transition: 'width 0.3s ease',
            zIndex: 1000,
            overflow: 'hidden'
        },
        logoSection: {
            padding: '30px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
        },
        logoPlaceholder: {
            width: '80px',
            height: '80px',
            backgroundColor: '#4CAF50',
            borderRadius: '10px',
            margin: '0 auto 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        },
        logoText: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            margin: 0
        },
        nav: {
            padding: '20px 0'
        },
        navItem: {
            display: 'flex',
            alignItems: 'center',
            padding: '15px 25px',
            color: 'white',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            borderLeft: '4px solid transparent',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
        },
        navItemActive: {
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderLeftColor: '#4CAF50',
            color: '#4CAF50'
        },
        navIcon: {
            marginRight: '15px',
            fontSize: '18px',
            width: '20px'
        },
        content: {
            marginLeft: isMobile ? '0' : '250px',
            flex: 1,
            padding: '0',
            transition: 'margin-left 0.3s ease',
            width: isMobile ? '100vw' : 'calc(100vw - 250px)',
            height: '100vh',
            overflow: 'auto',
            position: 'relative'
        },
        header: {
            backgroundColor: '#2c5530',
            color: 'white',
            padding: isMobile ? '15px 20px' : '20px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? '10px' : '0',
            boxSizing: 'border-box'
        },
        headerLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
        },
        pageTitle: {
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            margin: 0
        },
        mainContent: {
            padding: isMobile ? '20px 15px' : '30px',
            width: '100%',
            maxWidth: 'none',
            boxSizing: 'border-box'
        },
        filterSection: {
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        },
        filterGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '20px'
        },
        filterGroup: {
            display: 'flex',
            flexDirection: 'column'
        },
        filterLabel: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#2c5530',
            marginBottom: '8px'
        },
        filterSelect: {
            padding: '12px 15px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
        },
        filterInput: {
            padding: '12px 15px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
        },
        coursesGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
        },
        courseCard: {
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        },
        courseHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '15px'
        },
        courseCode: {
            fontSize: '16px',
            fontWeight: '700',
            color: '#2c5530'
        },
        courseCredits: {
            fontSize: '12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontWeight: '600'
        },
        courseName: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '10px'
        },
        courseDescription: {
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '15px'
        },
        courseDetails: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #f0f0f0'
        },
        courseInstructor: {
            fontSize: '12px',
            color: '#666'
        },
        courseYearLevel: {
            fontSize: '12px',
            backgroundColor: '#f8f9fa',
            color: '#2c5530',
            padding: '4px 8px',
            borderRadius: '8px',
            fontWeight: '500'
        },
        enrollButton: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '10px',
            width: '100%'
        },
        backButton: {
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '25px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(255, 152, 0, 0.3)'
        },
        logoutBtn: {
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '25px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(244, 67, 54, 0.3)'
        },
        mobileMenuButton: {
            display: isMobile ? 'block' : 'none',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            color: 'white',
            cursor: 'pointer',
            padding: '5px',
            marginRight: '15px'
        },
        mobileOverlay: {
            display: isMobile && isMobileMenuOpen ? 'block' : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
        },
        headerLogoPlaceholder: {
            width: '40px',
            height: '40px',
            backgroundColor: '#4CAF50',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white'
        }
    };

    return (
        <div style={styles.container}>
            {/* Mobile Overlay */}
            <div
                style={styles.mobileOverlay}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.logoSection}>
                    <div style={styles.logoPlaceholder}>
                        <Icons.Student size={24} color="white" />
                    </div>
                    <p style={styles.logoText}>JX University</p>
                </div>
                <nav style={styles.nav}>
                    <div onClick={goBackToHome} style={styles.navItem}>
                        <span style={styles.navIcon}><Icons.Home size={18} color="currentColor" /></span>
                        HOME
                    </div>
                    <div style={{...styles.navItem, ...styles.navItemActive}}>
                        <span style={styles.navIcon}><Icons.Course size={18} color="currentColor" /></span>
                        COURSES
                    </div>
                    <a href="/student-profile" style={styles.navItem}>
                        <span style={styles.navIcon}><Icons.Profile size={18} color="currentColor" /></span>
                        PROFILE
                    </a>
                    <div onClick={handleLogout} style={styles.navItem}>
                        <span style={styles.navIcon}><Icons.Logout size={18} color="currentColor" /></span>
                        LOG OUT
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={styles.content}>
                <header style={styles.header}>
                    <div style={styles.headerLeft}>
                        <button
                            style={styles.mobileMenuButton}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Icons.Menu size={24} color="white" />
                        </button>
                        <div style={styles.headerLogoPlaceholder}>
                            <Icons.Student size={16} color="white" />
                        </div>
                        <h1 style={styles.pageTitle}>
                            Course Enrollment
                        </h1>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span style={{fontSize: '14px', color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Icons.Student size={16} color="white" /> {user.firstName} {user.lastName}
                            </span>
                            <button
                                style={styles.backButton}
                                onClick={goBackToHome}
                            >
                                Back to Home
                            </button>
                            <button
                                style={styles.logoutBtn}
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </header>

                <div style={styles.mainContent}>
                    {loading ? (
                        <div style={{textAlign: 'center', padding: '60px', color: '#666', fontSize: '18px'}}>
                            Loading courses...
                        </div>
                    ) : (
                        <>
                            {/* Filter Section */}
                            <div style={styles.filterSection}>
                                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#2c5530', marginBottom: '5px'}}>
                                    Filter Courses
                                </h3>
                                <p style={{fontSize: '14px', color: '#666', margin: '0 0 15px 0'}}>
                                    {currentStudent && `Showing courses for ${currentStudent.first_name} ${currentStudent.last_name} - ${getDepartmentName(currentStudent.department_id)}, Year ${currentStudent.year_level}`}
                                </p>

                                <div style={styles.filterGrid}>
                                    <div style={styles.filterGroup}>
                                        <label style={styles.filterLabel}>Department</label>
                                        <select
                                            value={selectedDepartment}
                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                            style={styles.filterSelect}
                                        >
                                            <option value="">All Departments</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={styles.filterGroup}>
                                        <label style={styles.filterLabel}>Year Level</label>
                                        <select
                                            value={selectedYearLevel}
                                            onChange={(e) => setSelectedYearLevel(e.target.value)}
                                            style={styles.filterSelect}
                                        >
                                            <option value="">All Year Levels</option>
                                            <option value="1">Year 1</option>
                                            <option value="2">Year 2</option>
                                            <option value="3">Year 3</option>
                                            <option value="4">Year 4</option>
                                        </select>
                                    </div>

                                    <div style={styles.filterGroup}>
                                        <label style={styles.filterLabel}>Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search courses..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={styles.filterInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Courses Grid */}
                            <div>
                                <h3 style={{fontSize: '20px', fontWeight: '600', color: '#2c5530', marginBottom: '20px'}}>
                                    Available Courses ({filteredCourses.length})
                                </h3>

                                {filteredCourses.length === 0 ? (
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '15px',
                                        padding: '40px',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                    }}>
                                        <Icons.Course size={48} color="#ccc" />
                                        <h4 style={{color: '#666', margin: '20px 0 10px'}}>No courses found</h4>
                                        <p style={{color: '#999', margin: 0}}>Try adjusting your filters or search terms</p>
                                    </div>
                                ) : (
                                    <div style={styles.coursesGrid}>
                                        {filteredCourses.map(course => (
                                            <div
                                                key={course.id}
                                                style={styles.courseCard}
                                                onMouseEnter={(e) => {
                                                    e.target.closest('.course-card').style.transform = 'translateY(-4px)';
                                                    e.target.closest('.course-card').style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.closest('.course-card').style.transform = 'translateY(0)';
                                                    e.target.closest('.course-card').style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                                }}
                                                className="course-card"
                                            >
                                                <div style={styles.courseHeader}>
                                                    <div style={styles.courseCode}>{course.code}</div>
                                                    <div style={styles.courseCredits}>{course.credits} credits</div>
                                                </div>

                                                <div style={styles.courseName}>{course.name}</div>
                                                <div style={styles.courseDescription}>
                                                    {course.description || 'No description available'}
                                                </div>

                                                <div style={styles.courseDetails}>
                                                    <div>
                                                        <div style={styles.courseInstructor}>
                                                            Instructor: {course.instructor || 'TBA'}
                                                        </div>
                                                        <div style={{...styles.courseInstructor, marginTop: '4px'}}>
                                                            Department: {getDepartmentName(course.department_id)}
                                                        </div>
                                                    </div>
                                                    <div style={styles.courseYearLevel}>Year {course.year_level}</div>
                                                </div>

                                                <button
                                                    style={{
                                                        ...styles.enrollButton,
                                                        backgroundColor: course.is_enrolled ? '#f44336' : '#4CAF50'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = course.is_enrolled ? '#d32f2f' : '#45a049';
                                                        e.target.style.transform = 'translateY(-1px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = course.is_enrolled ? '#f44336' : '#4CAF50';
                                                        e.target.style.transform = 'translateY(0)';
                                                    }}
                                                    onClick={() => {
                                                        if (course.is_enrolled) {
                                                            handleUnenrollment(course.id);
                                                        } else {
                                                            handleEnrollment(course.id);
                                                        }
                                                    }}
                                                >
                                                    {course.is_enrolled ? 'Unenroll from Course' : 'Enroll in Course'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

if (document.getElementById('course-enrollment')) {
    ReactDOM.render(<CourseEnrollment />, document.getElementById('course-enrollment'));
}

export default CourseEnrollment;