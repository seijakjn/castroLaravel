import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Icons } from './SvgIcons';
import PieChart from './PieChart';

function EmployeeHome() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        totalDepartments: 0,
        totalCourses: 0,
        totalInstructors: 0,
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
            firstName: urlParams.get('firstName') || 'Employee',
            lastName: urlParams.get('lastName') || 'User',
            userType: urlParams.get('userType') || 'employee',
            email: urlParams.get('email') || 'employee@example.com'
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

    // Fetch dashboard data from API
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [studentsRes, departmentsRes, coursesRes, instructorsRes, facultyRes] = await Promise.all([
                    fetch('/api/students'),
                    fetch('/api/departments'),
                    fetch('/api/courses'),
                    fetch('/api/instructors'),
                    fetch('/api/faculty')
                ]);

                const [students, departments, courses, instructors, faculty] = await Promise.all([
                    studentsRes.json(),
                    departmentsRes.json(),
                    coursesRes.json(),
                    instructorsRes.json(),
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

                const facultyByDepartment = departments.map((dept, index) => ({
                    name: dept.code || dept.name,
                    faculty: faculty.filter(fac => fac.department_id === dept.id).length,
                    color: departmentColors[index % departmentColors.length]
                }));

                const studentsByYearLevel = [1,2,3,4].map(sem => ({
                    yearLevel: sem,
                    count: students.filter(student => student.year_level === sem).length
                }));

                setDashboardData({
                    totalStudents: students.length,
                    totalDepartments: departments.length,
                    totalCourses: courses.length,
                    totalInstructors: instructors.length,
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
                    totalInstructors: 18,
                    totalFaculty: 15,
                    studentsByDepartment: [
                        { name: 'Computer Science', students: 85, color: '#4CAF50' },
                        { name: 'Mathematics', students: 62, color: '#2196F3' },
                        { name: 'Engineering', students: 73, color: '#FF9800' },
                        { name: 'Business', students: 25, color: '#9C27B0' }
                    ],
                    facultyByDepartment: [
                        { name: 'CS', faculty: 5, color: '#4CAF50' },
                        { name: 'MATH', faculty: 4, color: '#2196F3' },
                        { name: 'ENG', faculty: 4, color: '#FF9800' },
                        { name: 'BUS', faculty: 2, color: '#9C27B0' }
                    ],
                    studentsByYearLevel: [
                        { yearLevel: 1, count: 95 },
                        { yearLevel: 2, count: 80 },
                        { yearLevel: 3, count: 70 },
                        { yearLevel: 4, count: 60 }
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
            #app, #employee-home {
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
            backgroundColor: '#E65100',
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
            backgroundColor: '#FF9800',
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
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            borderLeftColor: '#FF9800',
            color: '#FF9800'
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
            backgroundColor: '#E65100',
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
        adminBtn: {
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
            backgroundColor: '#FF9800',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(255, 152, 0, 0.2)',
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
            backgroundColor: '#FF9800',
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
                        <Icons.Employee size={24} color="white" />
                    </div>
                    <p style={styles.logoText}>JX University</p>
                </div>
                <nav style={styles.nav}>
                    <div style={{...styles.navItem, ...styles.navItemActive}}>
                        <span style={styles.navIcon}><Icons.Home size={18} color="currentColor" /></span>
                        HOME
                    </div>
                    <div
                        style={styles.navItem}
                        onClick={() => {
                            const params = new URLSearchParams({
                                firstName: user.firstName,
                                lastName: user.lastName,
                                userType: user.userType,
                                email: user.email
                            });
                            window.location.href = `/admin?${params.toString()}`;
                        }}
                    >
                        <span style={styles.navIcon}><Icons.Settings size={18} color="currentColor" /></span>
                        ADMIN PANEL
                    </div>
                    <div style={styles.navItem}>
                        <span style={styles.navIcon}><Icons.Profile size={18} color="currentColor" /></span>
                        PROFILE
                    </div>
                    <div style={styles.navItem} onClick={handleLogout}>
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
                            <Icons.Employee size={16} color="white" />
                        </div>
                        <h1 style={styles.pageTitle}>
                            JX University - Staff Dashboard
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
                                <Icons.Employee size={16} color="white" /> {user.firstName} {user.lastName}
                            </span>
                            <button
                                style={styles.adminBtn}
                                onClick={() => {
                                    const params = new URLSearchParams({
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        userType: user.userType,
                                        email: user.email
                                    });
                                    window.location.href = `/admin?${params.toString()}`;
                                }}
                            >
                                Admin Panel
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
                    {/* Welcome Card */}
                    <div style={styles.welcomeCard}>
                        <h3 style={styles.welcomeTitle}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                Welcome Back, {user.firstName}! <Icons.Wave size={20} color="white" />
                            </span>
                        </h3>
                        <p style={styles.welcomeText}>
                            You are logged in as a staff member. Access your dashboard and manage administrative tasks, view university statistics, and oversee student progress.
                        </p>
                    </div>

                    {/* University Statistics */}
                    <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)', gap: '20px', marginBottom: '30px'}}>
                        <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                            <div style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>Total Students</div>
                            <div style={{fontSize: '32px', fontWeight: '700', color: '#4CAF50'}}>{loading ? '...' : dashboardData.totalStudents}</div>
                        </div>
                        <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                            <div style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>Faculty & Staff</div>
                            <div style={{fontSize: '32px', fontWeight: '700', color: '#FF9800'}}>{loading ? '...' : dashboardData.totalFaculty}</div>
                        </div>
                        <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                            <div style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>Departments</div>
                            <div style={{fontSize: '32px', fontWeight: '700', color: '#2196F3'}}>{loading ? '...' : dashboardData.totalDepartments}</div>
                        </div>
                        <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                            <div style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>Courses</div>
                            <div style={{fontSize: '32px', fontWeight: '700', color: '#9C27B0'}}>{loading ? '...' : dashboardData.totalCourses}</div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div style={styles.statsGrid}>
                        <div style={{display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: '20px'}}>
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
                                                <div style={{fontSize: '24px', fontWeight: '700', color: '#4CAF50'}}>{sem.count}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Students by Department Chart */}
                            <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none'}}>
                                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#2c5530', marginBottom: '15px'}}>Students by Department</h3>
                                {loading ? (
                                    <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Loading...</div>
                                ) : (
                                    <div style={{display: 'flex', alignItems: 'end', justifyContent: 'space-evenly', height: '200px', padding: '20px 10px', gap: '15px'}}>
                                        {dashboardData.studentsByDepartment.map((dept, index) => {
                                            const maxStudents = Math.max(...dashboardData.studentsByDepartment.map(d => d.students), 1);
                                            return (
                                                <div key={index} style={{
                                                    minWidth: '60px',
                                                    maxWidth: '80px',
                                                    flex: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    <div style={{fontSize: '11px', color: '#666', fontWeight: '500'}}>{dept.students}</div>
                                                    <div
                                                        style={{
                                                            width: '40px',
                                                            height: `${(dept.students / maxStudents) * 140}px`,
                                                            backgroundColor: dept.color || '#4CAF50',
                                                            borderRadius: '4px 4px 0 0',
                                                            margin: '0 auto'
                                                        }}
                                                    ></div>
                                                    <div style={{
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                        color: '#2c5530',
                                                        marginTop: '8px',
                                                        textAlign: 'center',
                                                        lineHeight: '1.2',
                                                        wordWrap: 'break-word'
                                                    }}>{dept.name}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Faculty by Department Chart */}
                            <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none'}}>
                                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#FF9800', marginBottom: '15px'}}>Faculty by Department</h3>
                                {loading ? (
                                    <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Loading...</div>
                                ) : (
                                    <div style={{display: 'flex', alignItems: 'end', justifyContent: 'space-evenly', height: '150px', padding: '20px 10px', gap: '15px'}}>
                                        {dashboardData.facultyByDepartment.map((dept, index) => {
                                            const maxFaculty = Math.max(...dashboardData.facultyByDepartment.map(d => d.faculty), 1);
                                            return (
                                                <div key={index} style={{
                                                    minWidth: '60px',
                                                    maxWidth: '80px',
                                                    flex: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    <div style={{fontSize: '11px', color: '#666', fontWeight: '500'}}>{dept.faculty}</div>
                                                    <div
                                                        style={{
                                                            width: '40px',
                                                            height: `${(dept.faculty / maxFaculty) * 100}px`,
                                                            backgroundColor: '#FF9800',
                                                            borderRadius: '4px 4px 0 0',
                                                            margin: '0 auto'
                                                        }}
                                                    ></div>
                                                    <div style={{
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                        color: '#2c5530',
                                                        marginTop: '8px',
                                                        textAlign: 'center',
                                                        lineHeight: '1.2',
                                                        wordWrap: 'break-word'
                                                    }}>{dept.name}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                            {/* Students Pie Chart */}
                            <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none', textAlign: 'center'}}>
                                {loading ? (
                                    <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Loading...</div>
                                ) : (
                                    <PieChart
                                        data={dashboardData.studentsByDepartment}
                                        size={160}
                                        title="Students Distribution"
                                    />
                                )}
                            </div>

                            {/* Faculty Pie Chart */}
                            <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none', textAlign: 'center'}}>
                                {loading ? (
                                    <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Loading...</div>
                                ) : (
                                    <PieChart
                                        data={dashboardData.facultyByDepartment.map((dept, index) => ({
                                            name: dept.name,
                                            students: dept.faculty,
                                            color: dept.color || `hsl(${(index * 60) % 360}, 70%, 50%)`
                                        }))}
                                        size={160}
                                        title="Faculty Distribution"
                                    />
                                )}
                            </div>

                            {/* Quick Actions Card */}
                            <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none', textAlign: 'center'}}>
                                <h4 style={{color: '#FF9800', marginBottom: '15px'}}>Quick Actions</h4>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                    <button
                                        style={{padding: '10px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer'}}
                                        onClick={() => {
                                            const params = new URLSearchParams({
                                                firstName: user.firstName,
                                                lastName: user.lastName,
                                                userType: user.userType,
                                                email: user.email
                                            });
                                            window.location.href = `/admin?${params.toString()}`;
                                        }}
                                    >
                                        Manage Students & Faculty
                                    </button>
                                    <button style={{padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer'}}>
                                        Generate Reports
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

if (document.getElementById('employee-home')) {
    ReactDOM.render(<EmployeeHome />, document.getElementById('employee-home'));
}

export default EmployeeHome;