import React, { useState, useEffect } from 'react';
import { Icons } from './SvgIcons';

function Login({ onClose, onLoginSuccess, userType = 'student' }) {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        studentId: '',
        employeeId: '',
        department: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Apply overlay styles to prevent background scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Signup specific validations
        if (isSignup) {
            if (!formData.firstName) {
                newErrors.firstName = 'First name is required';
            }
            if (!formData.lastName) {
                newErrors.lastName = 'Last name is required';
            }

            // User type specific validations
            if (userType === 'student') {
                if (!formData.studentId) {
                    newErrors.studentId = 'Student ID is required';
                }
            } else if (userType === 'employee') {
                if (!formData.employeeId) {
                    newErrors.employeeId = 'Employee ID is required';
                }
                if (!formData.department) {
                    newErrors.department = 'Department is required';
                }
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const url = isSignup ? '/api/register' : '/api/login';
            const payload = isSignup ? {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                user_type: userType,
                student_id: formData.studentId,
                employee_id: formData.employeeId,
                department: formData.department
            } : {
                email: formData.email,
                password: formData.password
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                if (onLoginSuccess) {
                    onLoginSuccess(data.user);
                }
            } else {
                if (data.errors) {
                    // Handle validation errors
                    setErrors(data.errors);
                } else {
                    setErrors({ general: data.message || 'An error occurred. Please try again.' });
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            setErrors({ general: 'Network error. Please check your connection and try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            studentId: '',
            employeeId: '',
            department: ''
        });
        setErrors({});
    };

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
        },
        modal: {
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            width: '100%',
            maxWidth: isSignup ? '500px' : '400px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            animation: 'slideIn 0.3s ease-out'
        },
        closeButton: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            zIndex: 1,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
        },
        header: {
            padding: '40px 40px 20px',
            textAlign: 'center',
            background: userType === 'employee'
                ? 'linear-gradient(135deg, #E65100 0%, #FF9800 100%)'
                : 'linear-gradient(135deg, #2c5530 0%, #4CAF50 100%)',
            borderRadius: '20px 20px 0 0',
            color: 'white'
        },
        logo: {
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px',
            color: 'white'
        },
        subtitle: {
            fontSize: '16px',
            opacity: 0.9,
            margin: 0
        },
        form: {
            padding: '30px 40px 40px'
        },
        inputGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#2c5530'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.3s ease',
            backgroundColor: '#f8f9fa',
            boxSizing: 'border-box'
        },
        inputFocus: {
            borderColor: '#4CAF50',
            backgroundColor: 'white',
            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)'
        },
        inputError: {
            borderColor: '#f44336',
            backgroundColor: '#fff5f5'
        },
        error: {
            color: '#f44336',
            fontSize: '12px',
            marginTop: '4px',
            display: 'block'
        },
        submitButton: {
            width: '100%',
            padding: '14px',
            backgroundColor: userType === 'employee' ? '#FF9800' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '20px'
        },
        submitButtonHover: {
            backgroundColor: '#45a049',
            transform: 'translateY(-1px)'
        },
        submitButtonLoading: {
            backgroundColor: '#cccccc',
            cursor: 'not-allowed'
        },
        divider: {
            textAlign: 'center',
            margin: '20px 0',
            position: 'relative',
            color: '#666'
        },
        dividerLine: {
            height: '1px',
            backgroundColor: '#e0e0e0',
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            zIndex: 1
        },
        dividerText: {
            backgroundColor: 'white',
            padding: '0 15px',
            position: 'relative',
            zIndex: 2,
            fontSize: '14px'
        },
        toggleButton: {
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#4CAF50',
            border: '2px solid #4CAF50',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        toggleButtonHover: {
            backgroundColor: '#4CAF50',
            color: 'white'
        },
        row: {
            display: 'flex',
            gap: '15px'
        },
        column: {
            flex: 1
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <style>
                {`
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-20px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                `}
            </style>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button
                    style={styles.closeButton}
                    onClick={onClose}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    ×
                </button>

                <div style={styles.header}>
                    <div style={styles.logo}>
                        {userType === 'employee' ? <Icons.Employee size={24} color="white" /> : <Icons.Student size={24} color="white" />}
                    </div>
                    <h2 style={styles.title}>
                        {isSignup
                            ? `Join JX University${userType === 'employee' ? ' Staff' : ''}`
                            : 'Welcome Back'
                        }
                    </h2>
                    <p style={styles.subtitle}>
                        {isSignup
                            ? `Create your ${userType} account`
                            : `Sign in to your ${userType} account`
                        }
                    </p>
                </div>

                <form style={styles.form} onSubmit={handleSubmit}>
                    {errors.general && (
                        <div style={{...styles.error, marginBottom: '20px', textAlign: 'center'}}>
                            {errors.general}
                        </div>
                    )}

                    {isSignup && (
                        <>
                            <div style={styles.row}>
                                <div style={styles.column}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            style={{
                                                ...styles.input,
                                                ...(errors.firstName ? styles.inputError : {})
                                            }}
                                            placeholder="Enter your first name"
                                        />
                                        {errors.firstName && <span style={styles.error}>{errors.firstName}</span>}
                                    </div>
                                </div>
                                <div style={styles.column}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            style={{
                                                ...styles.input,
                                                ...(errors.lastName ? styles.inputError : {})
                                            }}
                                            placeholder="Enter your last name"
                                        />
                                        {errors.lastName && <span style={styles.error}>{errors.lastName}</span>}
                                    </div>
                                </div>
                            </div>

                            {userType === 'student' ? (
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Student ID</label>
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleInputChange}
                                        style={{
                                            ...styles.input,
                                            ...(errors.studentId ? styles.inputError : {})
                                        }}
                                        placeholder="Enter your student ID"
                                    />
                                    {errors.studentId && <span style={styles.error}>{errors.studentId}</span>}
                                </div>
                            ) : (
                                <>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Employee ID</label>
                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={formData.employeeId}
                                            onChange={handleInputChange}
                                            style={{
                                                ...styles.input,
                                                ...(errors.employeeId ? styles.inputError : {})
                                            }}
                                            placeholder="Enter your employee ID"
                                        />
                                        {errors.employeeId && <span style={styles.error}>{errors.employeeId}</span>}
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Department</label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            style={{
                                                ...styles.input,
                                                ...(errors.department ? styles.inputError : {})
                                            }}
                                        >
                                            <option value="">Select your department</option>
                                            <option value="administration">Administration</option>
                                            <option value="academic">Academic Affairs</option>
                                            <option value="student-affairs">Student Affairs</option>
                                            <option value="finance">Finance</option>
                                            <option value="hr">Human Resources</option>
                                            <option value="it">Information Technology</option>
                                            <option value="library">Library Services</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="security">Security</option>
                                        </select>
                                        {errors.department && <span style={styles.error}>{errors.department}</span>}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={{
                                ...styles.input,
                                ...(errors.email ? styles.inputError : {})
                            }}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span style={styles.error}>{errors.email}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={{
                                ...styles.input,
                                ...(errors.password ? styles.inputError : {})
                            }}
                            placeholder="Enter your password"
                        />
                        {errors.password && <span style={styles.error}>{errors.password}</span>}
                    </div>

                    {isSignup && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                style={{
                                    ...styles.input,
                                    ...(errors.confirmPassword ? styles.inputError : {})
                                }}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            ...styles.submitButton,
                            ...(isLoading ? styles.submitButtonLoading : {})
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.target.style.backgroundColor = userType === 'employee' ? '#F57C00' : '#45a049';
                                e.target.style.transform = 'translateY(-1px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isLoading) {
                                e.target.style.backgroundColor = userType === 'employee' ? '#FF9800' : '#4CAF50';
                                e.target.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        {isLoading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
                    </button>

                    <div style={styles.divider}>
                        <div style={styles.dividerLine}></div>
                        <span style={styles.dividerText}>OR</span>
                    </div>

                    <button
                        type="button"
                        onClick={toggleMode}
                        style={styles.toggleButton}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#4CAF50';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#4CAF50';
                        }}
                    >
                        {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;