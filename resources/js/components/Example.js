import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';

function Example() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null);

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

    // Sample data - replace with real data
    const studentStats = {
        total: 2374,
        firstYear: 900,
        secondYear: 700,
        thirdYear: 624,
        fourthYear: 150
    };

    const departmentData = [
        { name: 'CCS', students: 600, color: '#4CAF50' },
        { name: 'COED', students: 520, color: '#2196F3' },
        { name: 'CBA', students: 480, color: '#FF9800' },
        { name: 'CCJE', students: 460, color: '#00BCD4' },
        { name: 'CAHS', students: 314, color: '#9C27B0' }
    ];

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
            backgroundColor: 'white',
            padding: isMobile ? '15px 20px' : '20px 30px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
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
            color: '#2c5530',
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
        mobileMenuButton: {
            display: isMobile ? 'block' : 'none',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            color: '#2c5530',
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
                            🎓
                        </div>
                        <p style={styles.logoText}>Castro University</p>
                    </div>
                    <nav style={styles.nav}>
                        <a href="#" style={{...styles.navItem, ...styles.navItemActive}}>
                            <span style={styles.navIcon}>🏠</span>
                            HOME
                        </a>
                        <a href="#" style={styles.navItem}>
                            <span style={styles.navIcon}>📅</span>
                            EVENTS
                        </a>
                        <a href="#" style={styles.navItem}>
                            <span style={styles.navIcon}>📁</span>
                            ARCHIVE
                        </a>
                        <a href="#" style={styles.navItem}>
                            <span style={styles.navIcon}>⚙️</span>
                            ADMIN
                        </a>
                        <a href="#" style={styles.navItem}>
                            <span style={styles.navIcon}>💬</span>
                            FORUM
                        </a>
                        <a href="#" style={styles.navItem}>
                            <span style={styles.navIcon}>👤</span>
                            PROFILE
                        </a>
                        <a href="#" style={styles.navItem}>
                            <span style={styles.navIcon}>🚪</span>
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
                                ☰
                            </button>
                            <h1 style={styles.pageTitle}>
                                Landing Page - {user ? `Welcome, ${user.firstName}` : 'logged out'}
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
                                    <h3 style={styles.totalStudentsTitle}>TOTAL STUDENTS: {studentStats.total}</h3>
                                    <div style={styles.yearStatsContainer}>
                                        <div style={styles.yearStat}>
                                            <div style={styles.yearLabel}>1st Year:</div>
                                            <div style={styles.yearNumber}>{studentStats.firstYear}</div>
                                        </div>
                                        <div style={styles.yearStat}>
                                            <div style={styles.yearLabel}>2nd Year:</div>
                                            <div style={styles.yearNumber}>{studentStats.secondYear}</div>
                                        </div>
                                        <div style={styles.yearStat}>
                                            <div style={styles.yearLabel}>3rd Year:</div>
                                            <div style={styles.yearNumber}>{studentStats.thirdYear}</div>
                                        </div>
                                        <div style={styles.yearStat}>
                                            <div style={styles.yearLabel}>4th Year:</div>
                                            <div style={styles.yearNumber}>{studentStats.fourthYear}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Department Chart */}
                                <div style={styles.chartCard}>
                                    <h3 style={styles.chartTitle}>STUDENTS PER DEPARTMENT</h3>
                                    <div style={styles.chartContainer}>
                                        {departmentData.map((dept, index) => (
                                            <div key={index} style={styles.chartBar}>
                                                <div style={styles.barValue}>{dept.students}</div>
                                                <div
                                                    style={{
                                                        width: '100%',
                                                        height: `${(dept.students / 600) * 150}px`,
                                                        backgroundColor: dept.color,
                                                        borderRadius: '4px 4px 0 0'
                                                    }}
                                                ></div>
                                                <div style={styles.barLabel}>{dept.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={styles.rightSidebar}>
                                {/* Pie Chart */}
                                <div style={styles.pieChartCard}>
                                    <div style={styles.pieChart}></div>
                                    <div style={styles.legend}>
                                        {departmentData.map((dept, index) => (
                                            <div key={index} style={styles.legendItem}>
                                                <div style={{...styles.legendColor, backgroundColor: dept.color}}></div>
                                                <span>{dept.name}: {dept.students}</span>
                                            </div>
                                        ))}
                                    </div>
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
