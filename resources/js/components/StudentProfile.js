import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Icons } from './SvgIcons';

function StudentProfile() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Get user data from URL params or localStorage (for demo)
    const [user, setUser] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            firstName: urlParams.get('firstName') || 'John',
            lastName: urlParams.get('lastName') || 'Doe',
            userType: urlParams.get('userType') || 'student',
            email: urlParams.get('email') || 'user@example.com'
        };
    });

    // Profile form data
    const [profileData, setProfileData] = useState({
        student_id: '',
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: '',
        address: '',
        date_of_birth: '',
        year_level: 1,
        department_id: '',
        gpa: ''
    });

    const [departments, setDepartments] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [enrollmentLoading, setEnrollmentLoading] = useState(false);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch departments and current student data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch departments
                const deptResponse = await fetch('/api/departments');
                const departmentsData = await deptResponse.json();
                setDepartments(departmentsData);

                // Fetch current student data if student ID is available
                const urlParams = new URLSearchParams(window.location.search);
                const studentId = urlParams.get('studentId') || '123123'; // Default to existing student ID for demo

                const studentResponse = await fetch(`/api/student-profile/${studentId}`);
                if (studentResponse.ok) {
                    const studentData = await studentResponse.json();
                    setProfileData({
                        student_id: studentData.student_id || '',
                        first_name: studentData.first_name || '',
                        last_name: studentData.last_name || '',
                        email: studentData.email || '',
                        phone: studentData.phone || '',
                        address: studentData.address || '',
                        date_of_birth: studentData.date_of_birth || '',
                        year_level: studentData.year_level || 1,
                        department_id: studentData.department_id || '',
                        gpa: studentData.gpa || ''
                    });

                    // Fetch enrolled courses
                    await fetchEnrolledCourses(studentId);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('Failed to load profile data');
            }
        };

        fetchData();
    }, []);

    // Function to fetch enrolled courses
    const fetchEnrolledCourses = async (studentId) => {
        try {
            setEnrollmentLoading(true);
            const response = await fetch(`/api/students/${studentId}/enrollments`);
            if (response.ok) {
                const enrollments = await response.json();
                setEnrolledCourses(enrollments);
            }
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
        } finally {
            setEnrollmentLoading(false);
        }
    };

    // Apply global styles
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'profile-full-width-reset';
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
            #app, #student-profile {
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
            const existingStyle = document.getElementById('profile-full-width-reset');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const studentId = urlParams.get('studentId') || profileData.student_id || '123123';

            const response = await fetch(`/api/student-profile/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(profileData)
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage(result.message || 'Profile updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle back to home
    const handleBackToHome = () => {
        window.location.href = '/home';
    };

    // Handle logout
    const handleLogout = () => {
        window.location.href = '/';
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
        backBtn: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '25px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(76, 175, 80, 0.3)',
            marginRight: '10px'
        },
        mainContent: {
            padding: isMobile ? '20px 15px' : '30px',
            width: '100%',
            maxWidth: 'none',
            boxSizing: 'border-box'
        },
        profileCard: {
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none',
            boxSizing: 'border-box',
            maxWidth: '800px',
            margin: '0 auto'
        },
        profileTitle: {
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#2c5530',
            textAlign: 'center'
        },
        form: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '20px'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column'
        },
        label: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
        },
        input: {
            padding: '12px 15px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.3s ease',
            backgroundColor: 'white'
        },
        select: {
            padding: '12px 15px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.3s ease',
            backgroundColor: 'white',
            cursor: 'pointer'
        },
        submitBtn: {
            gridColumn: isMobile ? '1' : '1 / -1',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '20px',
            boxShadow: '0 2px 10px rgba(76, 175, 80, 0.3)'
        },
        alert: {
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500'
        },
        alertSuccess: {
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb'
        },
        alertError: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb'
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
                    <div onClick={handleBackToHome} style={styles.navItem}>
                        <span style={styles.navIcon}><Icons.Home size={18} color="currentColor" /></span>
                        HOME
                    </div>
                    <div style={{...styles.navItem, ...styles.navItemActive}}>
                        <span style={styles.navIcon}><Icons.Profile size={18} color="currentColor" /></span>
                        PROFILE
                    </div>
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
                            Student Profile
                        </h1>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span style={{fontSize: '14px', color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Icons.Student size={16} color="white" /> {user.firstName} {user.lastName}
                            </span>
                            <button
                                style={styles.backBtn}
                                onClick={handleBackToHome}
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
                    <div style={styles.profileCard}>
                        <h2 style={styles.profileTitle}>My Profile</h2>

                        {successMessage && (
                            <div style={{...styles.alert, ...styles.alertSuccess}}>
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div style={{...styles.alert, ...styles.alertError}}>
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Student ID</label>
                                <input
                                    type="text"
                                    name="student_id"
                                    value={profileData.student_id}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter student ID"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Year Level</label>
                                <select
                                    name="year_level"
                                    value={profileData.year_level}
                                    onChange={handleInputChange}
                                    style={styles.select}
                                >
                                    {[1,2,3,4].map(sem => (
                                        <option key={sem} value={sem}>Year {sem}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={profileData.first_name}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={profileData.last_name}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Date of Birth</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={profileData.date_of_birth}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Department</label>
                                <select
                                    name="department_id"
                                    value={profileData.department_id}
                                    onChange={handleInputChange}
                                    style={styles.select}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter address"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>GPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4.0"
                                    name="gpa"
                                    value={profileData.gpa}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter GPA (0.00 - 4.00)"
                                />
                            </div>

                            <button
                                type="submit"
                                style={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>

                    {/* Enrolled Courses Section */}
                    <div style={{...styles.profileCard, marginTop: '20px'}}>
                        <h2 style={styles.profileTitle}>My Enrolled Courses</h2>

                        {enrollmentLoading ? (
                            <div style={{textAlign: 'center', padding: '40px'}}>
                                <div style={{fontSize: '16px', color: '#666'}}>Loading courses...</div>
                            </div>
                        ) : enrolledCourses.length === 0 ? (
                            <div style={{textAlign: 'center', padding: '40px'}}>
                                <Icons.Course size={48} color="#ccc" />
                                <div style={{fontSize: '16px', color: '#666', marginTop: '15px'}}>
                                    You are not currently enrolled in any courses.
                                </div>
                            </div>
                        ) : (
                            <div style={{display: 'grid', gap: '15px'}}>
                                {enrolledCourses.map((enrollment, index) => (
                                    <div key={enrollment.id} style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '10px',
                                        padding: '20px',
                                        border: '1px solid #e0e0e0',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                                            <div>
                                                <h3 style={{
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    color: '#2c5530',
                                                    margin: '0 0 5px 0'
                                                }}>
                                                    {enrollment.course.name}
                                                </h3>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: '#666',
                                                    margin: '0 0 10px 0'
                                                }}>
                                                    {enrollment.course.code} • {enrollment.course.credits} Credits
                                                </p>
                                            </div>
                                            <div style={{
                                                backgroundColor: enrollment.status === 'enrolled' ? '#4CAF50' : '#FF9800',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                textTransform: 'uppercase'
                                            }}>
                                                {enrollment.status}
                                            </div>
                                        </div>

                                        <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '15px', fontSize: '14px'}}>
                                            <div>
                                                <strong>Department:</strong><br/>
                                                <span style={{color: '#666'}}>{enrollment.course.department?.name || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <strong>Semester:</strong><br/>
                                                <span style={{color: '#666'}}>{enrollment.semester} {enrollment.academic_year}</span>
                                            </div>
                                            <div>
                                                <strong>Section:</strong><br/>
                                                <span style={{color: '#666'}}>{enrollment.section || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {enrollment.course.description && (
                                            <div style={{marginTop: '15px', padding: '15px', backgroundColor: 'white', borderRadius: '8px'}}>
                                                <strong style={{fontSize: '14px'}}>Description:</strong>
                                                <p style={{margin: '8px 0 0 0', fontSize: '14px', color: '#666', lineHeight: '1.4'}}>
                                                    {enrollment.course.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

if (document.getElementById('student-profile')) {
    ReactDOM.render(<StudentProfile />, document.getElementById('student-profile'));
}

export default StudentProfile;