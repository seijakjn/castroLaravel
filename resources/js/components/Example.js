import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';

function Example() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        totalDepartments: 0,
        totalCourses: 0,
        totalInstructors: 0,
        studentsByDepartment: [],
        studentsBySemester: []
    });
    const [loading, setLoading] = useState(true);

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
                const [studentsRes, departmentsRes, coursesRes, instructorsRes] = await Promise.all([
                    fetch('/api/students'),
                    fetch('/api/departments'),
                    fetch('/api/courses'),
                    fetch('/api/instructors')
                ]);

                const [students, departments, courses, instructors] = await Promise.all([
                    studentsRes.json(),
                    departmentsRes.json(),
                    coursesRes.json(),
                    instructorsRes.json()
                ]);

                // Process data for charts
                const studentsByDepartment = departments.map(dept => ({
                    name: dept.code || dept.name,
                    students: students.filter(student => student.department_id === dept.id).length,
                    color: `hsl(${Math.random() * 360}, 70%, 50%)`
                }));

                const studentsBySemester = [1,2,3,4,5,6,7,8].map(sem => ({
                    semester: sem,
                    count: students.filter(student => student.current_semester === sem).length
                }));

                setDashboardData({
                    totalStudents: students.length,
                    totalDepartments: departments.length,
                    totalCourses: courses.length,
                    totalInstructors: instructors.length,
                    studentsByDepartment,
                    studentsBySemester
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Fallback to sample data if API fails
                setDashboardData({
                    totalStudents: 0,
                    totalDepartments: 2,
                    totalCourses: 0,
                    totalInstructors: 0,
                    studentsByDepartment: [
                        { name: 'CS', students: 0, color: '#4CAF50' },
                        { name: 'MATH', students: 0, color: '#2196F3' }
                    ],
                    studentsBySemester: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Apply global styles to ensure full-width
    useEffect(() => {
        // Create and inject global CSS reset
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
            #app, #example {
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
            // Cleanup on unmount
            const existingStyle = document.getElementById('full-width-reset');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    // Handle login success
    const handleLoginSuccess = (userData) => {
        // Redirect to home page with user data
        const params = new URLSearchParams({
            firstName: userData.firstName,
            lastName: userData.lastName,
            userType: userData.userType,
            email: userData.email
        });
        window.location.href = `/home?${params.toString()}`;
    };

    // Handle logout
    const handleLogout = () => {
        setUser(null);
        // You can add more logout logic here
    };


    const styles = {
        body: {
            margin: 0,
            padding: 0,
            backgroundColor: '#f8f9fa',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            width: '100%',
            height: '100vh',
            overflow: 'hidden'
        },
        container: {
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0
        },
        logoPlaceholder: {
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
        },
        content: {
            width: '100%',
            minHeight: '100vh',
            padding: '0'
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
        loginBtn: {
            backgroundColor: '#FFC107',
            color: '#2c5530',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '25px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(255, 193, 7, 0.3)'
        },
        mainContent: {
            padding: isMobile ? '20px 15px' : '30px',
            width: '100%',
            maxWidth: 'none',
            boxSizing: 'border-box'
        },
        announcementCard: {
            backgroundColor: '#FFC107',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(255, 193, 7, 0.2)',
            border: 'none',
            boxSizing: 'border-box'
        },
        announcementTitle: {
            fontSize: '16px',
            fontWeight: '700',
            color: '#2c5530',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        announcementText: {
            fontSize: '14px',
            color: '#2c5530',
            margin: 0,
            lineHeight: '1.5'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
            gap: isMobile ? '20px' : '30px',
            marginBottom: isMobile ? '20px' : '30px'
        },
        statsLeft: {
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: '20px'
        },
        totalStudentsCard: {
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none',
            boxSizing: 'border-box'
        },
        totalStudentsTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c5530',
            marginBottom: '15px'
        },
        totalStudentsNumber: {
            fontSize: '36px',
            fontWeight: '700',
            color: '#4CAF50',
            margin: 0
        },
        yearStatsContainer: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? '10px' : '15px',
            marginTop: '20px'
        },
        yearStat: {
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px'
        },
        yearLabel: {
            fontSize: '12px',
            color: '#666',
            marginBottom: '5px',
            fontWeight: '500'
        },
        yearNumber: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c5530'
        },
        chartCard: {
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none',
            boxSizing: 'border-box'
        },
        chartTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c5530',
            marginBottom: '20px',
            textAlign: 'center'
        },
        chartContainer: {
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-around',
            height: isMobile ? '150px' : '200px',
            padding: '20px 0',
            overflowX: isMobile ? 'auto' : 'visible'
        },
        chartBar: {
            width: '40px',
            borderRadius: '4px 4px 0 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
        },
        barLabel: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#2c5530',
            marginTop: '10px'
        },
        barValue: {
            fontSize: '11px',
            color: '#666',
            fontWeight: '500'
        },
        rightSidebar: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        pieChartCard: {
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none',
            textAlign: 'center'
        },
        pieChart: {
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'conic-gradient(#4CAF50 0deg 130deg, #FF9800 130deg 200deg, #2196F3 200deg 260deg, #00BCD4 260deg 320deg, #9C27B0 320deg 360deg)',
            margin: '0 auto 20px'
        },
        legend: {
            textAlign: 'left',
            marginTop: '15px'
        },
        legendItem: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            fontSize: '12px'
        },
        legendColor: {
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            marginRight: '8px'
        },
        noticeCard: {
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none',
            textAlign: 'center',
            minHeight: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        forumCard: {
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none',
            textAlign: 'center',
            minHeight: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        placeholderText: {
            color: '#666',
            fontSize: '16px',
            fontWeight: '600'
        },
    };

    return (
        <div style={styles.container}>
            {/* Main Content */}
            <main style={styles.content}>
                    <header style={styles.header}>
                        <div style={styles.headerLeft}>
                            <div style={styles.logoPlaceholder}>
                                🎓
                            </div>
                            <h1 style={styles.pageTitle}>
                                Castro University - Landing Page
                            </h1>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                            <div style={styles.searchContainer}>
                                <span style={styles.searchIcon}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="SEARCH"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={styles.searchInput}
                                />
                            </div>
                            <div style={{...styles.logoPlaceholder, width: '40px', height: '40px', fontSize: '16px'}}>
                                🛡️
                            </div>
                            {user ? (
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <span style={{fontSize: '14px', color: '#2c5530', fontWeight: '600'}}>
                                        {user.userType === 'employee' ? '👔' : '🎓'} {user.firstName} {user.lastName}
                                    </span>
                                    <button
                                        style={{...styles.loginBtn, backgroundColor: '#f44336'}}
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <button
                                        style={styles.loginBtn}
                                        onClick={() => setShowLogin('student')}
                                    >
                                        Student Login
                                    </button>
                                    <button
                                        style={{...styles.loginBtn, backgroundColor: '#FF9800', boxShadow: '0 2px 10px rgba(255, 152, 0, 0.3)'}}
                                        onClick={() => setShowLogin('employee')}
                                    >
                                        Employee Login
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>

                    <div style={styles.mainContent}>
                        {/* Announcement Card */}
                        <div style={styles.announcementCard}>
                            <h3 style={styles.announcementTitle}>ANNOUNCEMENTS:</h3>
                            <p style={styles.announcementText}>
                                <strong>DESIGN</strong> PROTOTYPE BY JOANNES B. CASTRO JR. AND XEAN CORAL
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div style={styles.statsGrid}>
                            <div style={styles.statsLeft}>
                                {/* Total Students */}
                                <div style={styles.totalStudentsCard}>
                                    <h3 style={styles.totalStudentsTitle}>TOTAL STUDENTS: {loading ? '...' : dashboardData.totalStudents}</h3>
                                    <div style={styles.yearStatsContainer}>
                                        {loading ? (
                                            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Loading...</div>
                                        ) : (
                                            dashboardData.studentsBySemester.slice(0, 4).map((sem, index) => (
                                                <div key={index} style={styles.yearStat}>
                                                    <div style={styles.yearLabel}>{sem.semester === 1 ? '1st' : sem.semester === 2 ? '2nd' : sem.semester === 3 ? '3rd' : sem.semester + 'th'} Year:</div>
                                                    <div style={styles.yearNumber}>{sem.count}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Department Chart */}
                                <div style={styles.chartCard}>
                                    <h3 style={styles.chartTitle}>STUDENTS PER DEPARTMENT</h3>
                                    {loading ? (
                                        <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Loading...</div>
                                    ) : (
                                        <div style={styles.chartContainer}>
                                            {dashboardData.studentsByDepartment.map((dept, index) => {
                                                const maxStudents = Math.max(...dashboardData.studentsByDepartment.map(d => d.students), 1);
                                                return (
                                                    <div key={index} style={styles.chartBar}>
                                                        <div style={styles.barValue}>{dept.students}</div>
                                                        <div
                                                            style={{
                                                                width: '100%',
                                                                height: `${(dept.students / maxStudents) * 150}px`,
                                                                backgroundColor: dept.color,
                                                                borderRadius: '4px 4px 0 0'
                                                            }}
                                                        ></div>
                                                        <div style={styles.barLabel}>{dept.name}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={styles.rightSidebar}>
                                {/* Pie Chart */}
                                <div style={styles.pieChartCard}>
                                    {loading ? (
                                        <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Loading...</div>
                                    ) : (
                                        <>
                                            <div style={styles.pieChart}></div>
                                            <div style={styles.legend}>
                                                {dashboardData.studentsByDepartment.map((dept, index) => (
                                                    <div key={index} style={styles.legendItem}>
                                                        <div style={{...styles.legendColor, backgroundColor: dept.color}}></div>
                                                        <span>{dept.name}: {dept.students}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Notice */}
                                <div style={styles.noticeCard}>
                                    <div style={styles.placeholderText}>NOTICE</div>
                                </div>

                                {/* Forum */}
                                <div style={styles.forumCard}>
                                    <div style={styles.placeholderText}>FORUM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Login Modal */}
                {showLogin && (
                    <Login
                        onClose={() => setShowLogin(false)}
                        onLoginSuccess={handleLoginSuccess}
                        userType={showLogin}
                    />
                )}
        </div>
    );
}

export default Example;

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
