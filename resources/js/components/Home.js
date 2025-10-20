import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

    // Sample data - same as Example.js
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
            backgroundColor: user.userType === 'employee' ? '#FF9800' : '#4CAF50',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px',
            boxShadow: user.userType === 'employee'
                ? '0 4px 20px rgba(255, 152, 0, 0.2)'
                : '0 4px 20px rgba(76, 175, 80, 0.2)',
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
        // ... (copying other styles from Example.js)
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
                    {user.userType === 'employee' && (
                        <a href="#" style={styles.navItem} onClick={(e) => {
                            e.preventDefault();
                            const params = new URLSearchParams({
                                firstName: user.firstName,
                                lastName: user.lastName,
                                userType: user.userType,
                                email: user.email
                            });
                            window.location.href = `/admin?${params.toString()}`;
                        }}>
                            <span style={styles.navIcon}>⚙️</span>
                            ADMIN
                        </a>
                    )}
                    <a href="#" style={styles.navItem}>
                        <span style={styles.navIcon}>💬</span>
                        FORUM
                    </a>
                    <a href="#" style={styles.navItem}>
                        <span style={styles.navIcon}>👤</span>
                        PROFILE
                    </a>
                    <a href="#" style={styles.navItem} onClick={handleLogout}>
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
                            Dashboard - Welcome, {user.firstName}!
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
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span style={{fontSize: '14px', color: '#2c5530', fontWeight: '600'}}>
                                {user.userType === 'employee' ? '👔' : '🎓'} {user.firstName} {user.lastName}
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
                            Welcome Back, {user.firstName}! 👋
                        </h3>
                        <p style={styles.welcomeText}>
                            You are logged in as a {user.userType}. Access your dashboard and manage your {user.userType === 'employee' ? 'administrative tasks' : 'academic progress'}.
                        </p>
                    </div>

                    {/* Stats Grid - Same as Example.js but now shows user is logged in */}
                    <div style={styles.statsGrid}>
                        <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', gap: '20px'}}>
                            {/* Keep the same stats display */}
                            <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none', boxSizing: 'border-box'}}>
                                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#2c5530', marginBottom: '15px'}}>
                                    TOTAL STUDENTS: {studentStats.total}
                                </h3>
                                <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)', gap: isMobile ? '10px' : '15px', marginTop: '20px'}}>
                                    <div style={{textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px'}}>
                                        <div style={{fontSize: '12px', color: '#666', marginBottom: '5px', fontWeight: '500'}}>1st Year:</div>
                                        <div style={{fontSize: '24px', fontWeight: '700', color: '#2c5530'}}>{studentStats.firstYear}</div>
                                    </div>
                                    <div style={{textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px'}}>
                                        <div style={{fontSize: '12px', color: '#666', marginBottom: '5px', fontWeight: '500'}}>2nd Year:</div>
                                        <div style={{fontSize: '24px', fontWeight: '700', color: '#2c5530'}}>{studentStats.secondYear}</div>
                                    </div>
                                    <div style={{textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px'}}>
                                        <div style={{fontSize: '12px', color: '#666', marginBottom: '5px', fontWeight: '500'}}>3rd Year:</div>
                                        <div style={{fontSize: '24px', fontWeight: '700', color: '#2c5530'}}>{studentStats.thirdYear}</div>
                                    </div>
                                    <div style={{textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px'}}>
                                        <div style={{fontSize: '12px', color: '#666', marginBottom: '5px', fontWeight: '500'}}>4th Year:</div>
                                        <div style={{fontSize: '24px', fontWeight: '700', color: '#2c5530'}}>{studentStats.fourthYear}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                            {/* Quick Actions Card */}
                            <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none', textAlign: 'center'}}>
                                <h4 style={{color: '#2c5530', marginBottom: '15px'}}>Quick Actions</h4>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                    <button style={{padding: '10px', backgroundColor: user.userType === 'employee' ? '#FF9800' : '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer'}}>
                                        {user.userType === 'employee' ? 'Manage Students' : 'View Grades'}
                                    </button>
                                    <button style={{padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer'}}>
                                        {user.userType === 'employee' ? 'Generate Reports' : 'Course Schedule'}
                                    </button>
                                </div>
                            </div>

                            {/* Notice */}
                            <div style={{backgroundColor: '#f8f9fa', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none', textAlign: 'center', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <div style={{color: '#666', fontSize: '16px', fontWeight: '600'}}>NOTICE</div>
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