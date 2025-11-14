import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Icons } from './SvgIcons';
import PieChart from './PieChart';

function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        totalDepartments: 0,
        totalCourses: 0,
        totalFaculty: 0,
        studentsByDepartment: [],
        facultyByDepartment: [],
        studentsByYearLevel: []
    });
    const [loading, setLoading] = useState(true);

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

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // fetch dashboard data from the API, yaaaahaallooooooo 
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [studentsRes, departmentsRes, coursesRes, facultyRes] = await Promise.all([
                    fetch('/api/students'),
                    fetch('/api/departments'),
                    fetch('/api/courses'),
                    fetch('/api/faculty')
                ]);

                const [students, departments, courses, faculty] = await Promise.all([
                    studentsRes.json(),
                    departmentsRes.json(),
                    coursesRes.json(),
                    facultyRes.json()
                ]);

                // Define consistent color palette for departments
                const departmentColors = [
                    '#4CAF50', // Green
                    '#FF9800', // Orange
                    '#2196F3', // Blue
                    '#9C27B0', // Purple
                    '#F44336', // Red
                    '#00BCD4', // Cyan
                    '#FF5722', // Deep Orange
                    '#795548', // Brown
                    '#607D8B', // Blue Grey
                    '#E91E63', // Pink
                ];

                // Process data for charts
                const studentsByDepartment = departments.map((dept, index) => ({
                    name: dept.code || dept.name,
                    students: students.filter(student => student.department_id === dept.id).length,
                    color: departmentColors[index % departmentColors.length]
                }));

                const facultyByDepartment = departments.map((dept, index) => {
                    const count = faculty.filter(member => member.department_id === dept.id).length;
                    console.log(`Department ${dept.code}: ${count} faculty members`);
                    return {
                        name: dept.code || dept.name,
                        students: count, // Keep 'students' property for PieChart compatibility
                        color: departmentColors[index % departmentColors.length]
                    };
                });

                const studentsByYearLevel = [1,2,3,4].map(sem => ({
                    yearLevel: sem,
                    count: students.filter(student => student.year_level === sem).length
                }));

                setDashboardData({
                    totalStudents: students.length,
                    totalDepartments: departments.length,
                    totalCourses: courses.length,
                    totalFaculty: faculty.length,
                    studentsByDepartment,
                    facultyByDepartment,
                    studentsByYearLevel
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Fallback to sample data if API fails
                setDashboardData({
                    totalStudents: 245,
                    totalDepartments: 4,
                    totalCourses: 32,
                    totalFaculty: 18,
                    studentsByDepartment: [
                        { name: 'Computer Science', students: 85, color: '#4CAF50' },
                        { name: 'Mathematics', students: 62, color: '#2196F3' },
                        { name: 'Engineering', students: 73, color: '#FF9800' },
                        { name: 'Business', students: 25, color: '#9C27B0' }
                    ],
                    facultyByDepartment: [
                        { name: 'Computer Science', students: 5, color: '#4CAF50' },
                        { name: 'Mathematics', students: 4, color: '#2196F3' },
                        { name: 'Engineering', students: 6, color: '#FF9800' },
                        { name: 'Business', students: 3, color: '#9C27B0' }
                    ],
                    studentsByYearLevel: [
                        { yearLevel: 1, count: 45 },
                        { yearLevel: 2, count: 38 },
                        { yearLevel: 3, count: 42 },
                        { yearLevel: 4, count: 35 },
                        { yearLevel: 5, count: 28 },
                        { yearLevel: 6, count: 22 },
                        { yearLevel: 7, count: 20 },
                        { yearLevel: 8, count: 15 }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Apply global styles to ensure full-width
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'full-width-reset';
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
            #app, #home {
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
            const existingStyle = document.getElementById('full-width-reset');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

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
            fontWeight: '500'
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
        searchContainer: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
        },
        searchInput: {
            padding: '10px 15px 10px 40px',
            border: '2px solid #e0e0e0',
            borderRadius: '25px',
            width: isMobile ? '200px' : '300px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
        },
        searchIcon: {
            position: 'absolute',
            left: '15px',
            color: '#666',
            fontSize: '16px'
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
        mainContent: {
            padding: isMobile ? '20px 15px' : '30px',
            width: '100%',
            maxWidth: 'none',
            boxSizing: 'border-box'
        },
        welcomeCard: {
            backgroundColor: '#4CAF50',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)',
            border: 'none',
            boxSizing: 'border-box',
            color: 'white'
        },
        welcomeTitle: {
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        welcomeText: {
            fontSize: '16px',
            margin: 0,
            lineHeight: '1.5',
            opacity: 0.9
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
            gap: isMobile ? '20px' : '30px',
            marginBottom: isMobile ? '20px' : '30px'
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
                    <a href="#" style={{...styles.navItem, ...styles.navItemActive}}>
                        <span style={styles.navIcon}><Icons.Home size={18} color="currentColor" /></span>
                        HOME
                    </a>
                    <a href="/student-profile" style={styles.navItem}>
                        <span style={styles.navIcon}><Icons.Profile size={18} color="currentColor" /></span>
                        PROFILE
                    </a>
                    <a href="#" style={styles.navItem}>
                        <span style={styles.navIcon}><Icons.Logout size={18} color="currentColor" /></span>
                        LOG OUT
                    </a>
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
                            JX University - Dashboard
                        </h1>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                        <div style={styles.searchContainer}>
                            <span style={styles.searchIcon}><Icons.Search size={16} color="#666" /></span>
                            <input
                                type="text"
                                placeholder="SEARCH"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span style={{fontSize: '14px', color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Icons.Student size={16} color="white" /> {user.firstName} {user.lastName}
                            </span>
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
                    {/* Welcome Card */}
                    <div style={styles.welcomeCard}>
                        <h3 style={styles.welcomeTitle}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                Welcome Back, {user.firstName}! <Icons.Wave size={20} color="white" />
                            </span>
                        </h3>
                        <p style={styles.welcomeText}>
                            You are logged in as a student. Access your dashboard and manage your academic progress.
                        </p>
                    </div>

                    {/* University Statistics */}
                    <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px'}}>
                        <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                            <div style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>Total Students</div>
                            <div style={{fontSize: '32px', fontWeight: '700', color: '#4CAF50'}}>{loading ? '...' : dashboardData.totalStudents}</div>
                        </div>
                        <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                            <div style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>Departments</div>
                            <div style={{fontSize: '32px', fontWeight: '700', color: '#2196F3'}}>{loading ? '...' : dashboardData.totalDepartments}</div>
                        </div>
                        <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                            <div style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>Courses</div>
                            <div style={{fontSize: '32px', fontWeight: '700', color: '#FF9800'}}>{loading ? '...' : dashboardData.totalCourses}</div>
                        </div>
                        <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                            <div style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>Faculty</div>
                            <div style={{fontSize: '32px', fontWeight: '700', color: '#9C27B0'}}>{loading ? '...' : dashboardData.totalFaculty}</div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div style={styles.statsGrid}>
                        <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', gap: '20px'}}>
                            {/* Students by Year Level */}
                            <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none', boxSizing: 'border-box'}}>
                                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#2c5530', marginBottom: '15px'}}>
                                    Students by Year Level
                                </h3>
                                {loading ? (
                                    <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Loading...</div>
                                ) : (
                                    <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '15px', marginTop: '20px'}}>
                                        {dashboardData.studentsByYearLevel.slice(0, 8).map((sem, index) => (
                                            <div key={index} style={{textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px'}}>
                                                <div style={{fontSize: '12px', color: '#666', marginBottom: '5px', fontWeight: '500'}}>Year {sem.yearLevel}:</div>
                                                <div style={{fontSize: '24px', fontWeight: '700', color: '#2c5530'}}>{sem.count}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                            {/* Students by Department */}
                            <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none'}}>
                                {loading ? (
                                    <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>Loading...</div>
                                ) : (
                                    <PieChart
                                        data={dashboardData.studentsByDepartment}
                                        size={160}
                                        title="Students by Department"
                                    />
                                )}
                            </div>

                            {/* Faculty by Department */}
                            <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none'}}>
                                {loading ? (
                                    <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>Loading...</div>
                                ) : (
                                    <PieChart
                                        data={dashboardData.facultyByDepartment}
                                        size={160}
                                        title="Faculty by Department"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Faculty Charts */}
                    <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '30px', border: '1px solid #e0e0e0'}}>
                        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#2c5530', marginBottom: '20px', textAlign: 'center'}}>
                            Faculty per Department
                        </h3>
                        {loading ? (
                            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Loading...</div>
                        ) : (
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'end', gap: '15px', height: '200px', padding: '20px'}}>
                                {dashboardData.facultyByDepartment.map((dept, index) => (
                                    <div key={index} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                                        <div style={{
                                            backgroundColor: dept.color,
                                            width: '60px',
                                            height: `${Math.max(dept.students * 40, 30)}px`,
                                            borderRadius: '4px 4px 0 0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '14px'
                                        }}>
                                            {dept.students}
                                        </div>
                                        <div style={{fontSize: '12px', color: '#666', fontWeight: '600', textAlign: 'center'}}>
                                            {dept.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Students per Department Bar Chart */}
                    <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '30px'}}>
                        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#2c5530', marginBottom: '20px', textAlign: 'center'}}>
                            Students per Department
                        </h3>
                        {loading ? (
                            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Loading...</div>
                        ) : (
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'end', gap: '15px', height: '200px', padding: '20px'}}>
                                {dashboardData.studentsByDepartment.map((dept, index) => (
                                    <div key={index} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                                        <div style={{
                                            backgroundColor: dept.color,
                                            width: '60px',
                                            height: `${Math.max(dept.students * 10, 20)}px`,
                                            borderRadius: '4px 4px 0 0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '14px'
                                        }}>
                                            {dept.students}
                                        </div>
                                        <div style={{fontSize: '12px', color: '#666', fontWeight: '600', textAlign: 'center'}}>
                                            {dept.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Course Enrollment Section */}
                    <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '30px'}}>
                        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#2c5530', marginBottom: '20px', textAlign: 'center'}}>
                            Course Enrollment
                        </h3>
                        <div style={{textAlign: 'center', marginBottom: '20px'}}>
                            <p style={{color: '#666', marginBottom: '15px'}}>
                                Browse and enroll in courses available for your department and year level
                            </p>
                            <button
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 30px',
                                    borderRadius: '25px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#45a049';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#4CAF50';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                                }}
                                onClick={() => {
                                    // Navigate to course enrollment page with student info
                                    const params = new URLSearchParams({
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        userType: user.userType,
                                        email: user.email
                                    });
                                    window.location.href = `/course-enrollment?${params.toString()}`;
                                }}
                            >
                                📚 Browse Available Courses
                            </button>
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '15px', marginTop: '20px'}}>
                            <div style={{backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center'}}>
                                <div style={{fontSize: '14px', color: '#666', marginBottom: '5px'}}>Your Department</div>
                                <div style={{fontSize: '16px', fontWeight: '600', color: '#2c5530'}}>Computer Science</div>
                            </div>
                            <div style={{backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center'}}>
                                <div style={{fontSize: '14px', color: '#666', marginBottom: '5px'}}>Your Year Level</div>
                                <div style={{fontSize: '16px', fontWeight: '600', color: '#2c5530'}}>Year 2</div>
                            </div>
                            <div style={{backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center'}}>
                                <div style={{fontSize: '14px', color: '#666', marginBottom: '5px'}}>Enrolled Courses</div>
                                <div style={{fontSize: '16px', fontWeight: '600', color: '#2c5530'}}>3</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

if (document.getElementById('home')) {
    ReactDOM.render(<Home />, document.getElementById('home'));
}

export default Home;