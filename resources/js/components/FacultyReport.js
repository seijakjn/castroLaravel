import React, { useState, useEffect } from 'react';
import { Icons } from './SvgIcons';

function FacultyReport() {
    const [faculty, setFaculty] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('');
    const [selectedPositionFilter, setSelectedPositionFilter] = useState('');

    // Fetch faculty and departments data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [facultyRes, departmentsRes] = await Promise.all([
                    fetch('/api/faculty'),
                    fetch('/api/departments')
                ]);

                const [facultyData, departmentsData] = await Promise.all([
                    facultyRes.json(),
                    departmentsRes.json()
                ]);

                setFaculty(facultyData);
                setDepartments(departmentsData);
            } catch (error) {
                console.error('Error fetching faculty data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter faculty based on search term, department, and position
    const filteredFaculty = faculty.filter(member => {
        const matchesSearch =
            member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            '';

        const matchesDepartment = selectedDepartmentFilter === '' ||
            member.department_id === parseInt(selectedDepartmentFilter);

        const matchesPosition = selectedPositionFilter === '' ||
            member.position === selectedPositionFilter;

        return matchesSearch && matchesDepartment && matchesPosition;
    });

    // Handle faculty card click
    const handleFacultyClick = (member) => {
        setSelectedFaculty(member);
        setShowDetailModal(true);
    };

    // Close detail modal
    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedFaculty(null);
    };

    // Export faculty data to CSV
    const exportToCSV = () => {
        // Prepare CSV headers
        const headers = [
            'Employee ID',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Date of Birth',
            'Age',
            'Gender',
            'Department',
            'Position',
            'Education Level',
            'Specialization',
            'Status',
            'Hire Date',
            'Years of Service',
            'Salary',
            'Office Location',
            'Address',
            'Emergency Contact Name'
        ];

        // Prepare CSV rows
        const rows = filteredFaculty.map(member => [
            member.employee_id || '',
            member.first_name || '',
            member.last_name || '',
            member.email || '',
            member.phone || '',
            member.date_of_birth || '',
            calculateAge(member.date_of_birth),
            member.gender || '',
            member.department?.name || '',
            formatPosition(member.position),
            member.education_level || '',
            member.specialization || '',
            member.status || '',
            member.hire_date || '',
            getYearsOfService(member.hire_date),
            member.salary || '',
            member.office_location || '',
            member.address || '',
            member.emergency_contact_name || ''
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
        link.setAttribute('download', `faculty_report_${new Date().toISOString().split('T')[0]}.csv`);
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

    // Get hire year
    const getHireYear = (hireDate) => {
        if (!hireDate) return 'N/A';
        return new Date(hireDate).getFullYear();
    };

    // Get years of service
    const getYearsOfService = (hireDate) => {
        if (!hireDate) return 'N/A';
        const today = new Date();
        const hire = new Date(hireDate);
        return today.getFullYear() - hire.getFullYear();
    };

    // Get position color
    const getPositionColor = (position) => {
        switch (position) {
            case 'department_head': return '#9C27B0'; // Purple for department heads
            case 'professor': return '#4CAF50'; // Green for professors
            case 'associate_professor': return '#2196F3'; // Blue for associate professors
            case 'assistant_professor': return '#FF9800'; // Orange for assistant professors
            case 'instructor': return '#795548'; // Brown for instructors
            case 'staff': return '#607D8B'; // Blue-grey for staff
            default: return '#757575'; // Grey for unknown
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#4CAF50'; // Green
            case 'on_leave': return '#FF9800'; // Orange
            case 'retired': return '#9E9E9E'; // Grey
            case 'terminated': return '#f44336'; // Red
            default: return '#757575'; // Default grey
        }
    };

    // Get education level color
    const getEducationColor = (level) => {
        switch (level) {
            case 'phd': return '#9C27B0'; // Purple for PhD
            case 'masters': return '#2196F3'; // Blue for Masters
            case 'bachelors': return '#4CAF50'; // Green for Bachelors
            default: return '#757575'; // Grey for other
        }
    };

    // Format position title
    const formatPosition = (position) => {
        return position.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Format salary
    const formatSalary = (salary) => {
        if (!salary) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(salary);
    };

    // Get unique positions for filter
    const uniquePositions = [...new Set(faculty.map(member => member.position))];

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                flexDirection: 'column'
            }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p style={{ marginTop: '20px', color: '#666', fontSize: '16px' }}>Loading faculty data...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            {/* Header and Filters */}
            <div style={{ marginBottom: '30px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icons.Faculty size={28} color="#2c5530" />
                        <h2 style={{
                            color: '#2c5530',
                            fontWeight: '700',
                            fontSize: '24px',
                            margin: 0
                        }}>
                            Faculty Report
                        </h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            {filteredFaculty.length} Faculty Members
                        </div>
                        <button
                            type="button"
                            onClick={exportToCSV}
                            disabled={filteredFaculty.length === 0}
                            style={{
                                backgroundColor: filteredFaculty.length === 0 ? '#ccc' : '#2196F3',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: filteredFaculty.length === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (filteredFaculty.length > 0) {
                                    e.target.style.backgroundColor = '#1976D2';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (filteredFaculty.length > 0) {
                                    e.target.style.backgroundColor = '#2196F3';
                                }
                            }}
                        >
                            <Icons.Download size={16} />
                            Export CSV ({filteredFaculty.length})
                        </button>
                    </div>
                </div>

                {/* Search and Filter Controls */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '15px',
                    marginBottom: '20px'
                }}>
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search by name, employee ID, email, or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 40px 10px 15px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '25px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                        <Icons.Search
                            size={18}
                            color="#666"
                            style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}
                        />
                    </div>

                    {/* Department Filter */}
                    <select
                        value={selectedDepartmentFilter}
                        onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
                        style={{
                            padding: '10px 15px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '25px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name} ({dept.code})
                            </option>
                        ))}
                    </select>

                    {/* Position Filter */}
                    <select
                        value={selectedPositionFilter}
                        onChange={(e) => setSelectedPositionFilter(e.target.value)}
                        style={{
                            padding: '10px 15px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '25px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="">All Positions</option>
                        {uniquePositions.map(position => (
                            <option key={position} value={position}>
                                {formatPosition(position)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Faculty Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
            }}>
                {filteredFaculty.map(member => (
                    <div
                        key={member.id}
                        onClick={() => handleFacultyClick(member)}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: '1px solid #f0f0f0'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-5px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div>
                                <h3 style={{
                                    color: '#2c5530',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    margin: '0 0 5px 0'
                                }}>
                                    {member.first_name} {member.last_name}
                                </h3>
                                <p style={{
                                    color: '#666',
                                    fontSize: '14px',
                                    margin: '0',
                                    fontWeight: '500'
                                }}>
                                    {member.employee_id}
                                </p>
                            </div>
                            <div style={{
                                backgroundColor: getStatusColor(member.status),
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'capitalize'
                            }}>
                                {member.status}
                            </div>
                        </div>

                        {/* Position and Department */}
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{
                                backgroundColor: getPositionColor(member.position),
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '15px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'inline-block',
                                marginBottom: '8px'
                            }}>
                                {formatPosition(member.position)}
                            </div>
                            <p style={{
                                color: '#666',
                                fontSize: '14px',
                                margin: '0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}>
                                <Icons.Department size={14} color="#666" />
                                {member.department?.name || 'No Department'}
                            </p>
                        </div>

                        {/* Specialization */}
                        {member.specialization && (
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{
                                    color: '#2c5530',
                                    fontSize: '14px',
                                    margin: '0',
                                    fontWeight: '500',
                                    fontStyle: 'italic'
                                }}>
                                    <Icons.Shield size={14} color="#2c5530" style={{ marginRight: '5px' }} />
                                    {member.specialization}
                                </p>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px',
                            fontSize: '12px',
                            color: '#666'
                        }}>
                            <div>
                                <strong>Education:</strong><br />
                                <span style={{
                                    color: getEducationColor(member.education_level),
                                    fontWeight: '600',
                                    textTransform: 'uppercase'
                                }}>
                                    {member.education_level || 'N/A'}
                                </span>
                            </div>
                            <div>
                                <strong>Experience:</strong><br />
                                <span style={{ color: '#2c5530', fontWeight: '600' }}>
                                    {getYearsOfService(member.hire_date)} years
                                </span>
                            </div>
                            <div>
                                <strong>Hired:</strong><br />
                                {getHireYear(member.hire_date)}
                            </div>
                            <div>
                                <strong>Salary:</strong><br />
                                <span style={{ color: '#4CAF50', fontWeight: '600' }}>
                                    {formatSalary(member.salary)}
                                </span>
                            </div>
                        </div>

                        {/* Office Location */}
                        {member.office_location && (
                            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f0f0f0' }}>
                                <p style={{
                                    color: '#666',
                                    fontSize: '12px',
                                    margin: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    <Icons.Home size={14} color="#666" />
                                    {member.office_location}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* No Results Message */}
            {filteredFaculty.length === 0 && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#666'
                }}>
                    <Icons.Faculty size={48} color="#ddd" />
                    <h3 style={{ color: '#999', marginTop: '20px', marginBottom: '10px' }}>No Faculty Members Found</h3>
                    <p style={{ color: '#999', fontSize: '14px' }}>
                        Try adjusting your search criteria or filters.
                    </p>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedFaculty && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={closeDetailModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '30px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeDetailModal}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#999',
                                padding: '5px',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f5f5f5';
                                e.target.style.color = '#333';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#999';
                            }}
                        >
                            ×
                        </button>

                        {/* Modal Header */}
                        <div style={{ marginBottom: '25px', paddingRight: '50px' }}>
                            <h2 style={{
                                color: '#2c5530',
                                fontSize: '24px',
                                fontWeight: '700',
                                margin: '0 0 5px 0'
                            }}>
                                {selectedFaculty.first_name} {selectedFaculty.last_name}
                            </h2>
                            <p style={{
                                color: '#666',
                                fontSize: '16px',
                                margin: '0 0 10px 0',
                                fontWeight: '500'
                            }}>
                                {selectedFaculty.employee_id} • {formatPosition(selectedFaculty.position)}
                            </p>
                            <div style={{
                                backgroundColor: getStatusColor(selectedFaculty.status),
                                color: 'white',
                                padding: '6px 15px',
                                borderRadius: '15px',
                                fontSize: '14px',
                                fontWeight: '600',
                                textTransform: 'capitalize',
                                display: 'inline-block'
                            }}>
                                {selectedFaculty.status}
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {/* Contact Information */}
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '15px'
                            }}>
                                <h4 style={{ color: '#2c5530', marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
                                    Contact Information
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                                    <div>
                                        <strong>Email:</strong><br />
                                        <a href={`mailto:${selectedFaculty.email}`} style={{ color: '#2196F3', textDecoration: 'none' }}>
                                            {selectedFaculty.email}
                                        </a>
                                    </div>
                                    <div>
                                        <strong>Phone:</strong><br />
                                        <a href={`tel:${selectedFaculty.phone}`} style={{ color: '#2196F3', textDecoration: 'none' }}>
                                            {selectedFaculty.phone || 'N/A'}
                                        </a>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <strong>Office:</strong><br />
                                        {selectedFaculty.office_location || 'No office assigned'}
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '15px'
                            }}>
                                <h4 style={{ color: '#2c5530', marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
                                    Academic Information
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                                    <div>
                                        <strong>Department:</strong><br />
                                        {selectedFaculty.department?.name || 'No department'}
                                    </div>
                                    <div>
                                        <strong>Position:</strong><br />
                                        <span style={{
                                            color: getPositionColor(selectedFaculty.position),
                                            fontWeight: '600'
                                        }}>
                                            {formatPosition(selectedFaculty.position)}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Education Level:</strong><br />
                                        <span style={{
                                            color: getEducationColor(selectedFaculty.education_level),
                                            fontWeight: '600',
                                            textTransform: 'uppercase'
                                        }}>
                                            {selectedFaculty.education_level || 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Specialization:</strong><br />
                                        {selectedFaculty.specialization || 'No specialization listed'}
                                    </div>
                                </div>
                            </div>

                            {/* Employment Information */}
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '15px'
                            }}>
                                <h4 style={{ color: '#2c5530', marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
                                    Employment Information
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                                    <div>
                                        <strong>Hire Date:</strong><br />
                                        {selectedFaculty.hire_date ? new Date(selectedFaculty.hire_date).toLocaleDateString() : 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Years of Service:</strong><br />
                                        <span style={{ color: '#2c5530', fontWeight: '600' }}>
                                            {getYearsOfService(selectedFaculty.hire_date)} years
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Salary:</strong><br />
                                        <span style={{ color: '#4CAF50', fontWeight: '600' }}>
                                            {formatSalary(selectedFaculty.salary)}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Status:</strong><br />
                                        <span style={{
                                            color: getStatusColor(selectedFaculty.status),
                                            fontWeight: '600',
                                            textTransform: 'capitalize'
                                        }}>
                                            {selectedFaculty.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '15px'
                            }}>
                                <h4 style={{ color: '#2c5530', marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
                                    Personal Information
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                                    <div>
                                        <strong>Date of Birth:</strong><br />
                                        {selectedFaculty.date_of_birth ? new Date(selectedFaculty.date_of_birth).toLocaleDateString() : 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Age:</strong><br />
                                        {calculateAge(selectedFaculty.date_of_birth)} years old
                                    </div>
                                    <div>
                                        <strong>Gender:</strong><br />
                                        {selectedFaculty.gender ? selectedFaculty.gender.charAt(0).toUpperCase() + selectedFaculty.gender.slice(1) : 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Emergency Contact:</strong><br />
                                        {selectedFaculty.emergency_contact_name || 'N/A'}
                                    </div>
                                    {selectedFaculty.address && (
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <strong>Address:</strong><br />
                                            {selectedFaculty.address}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FacultyReport;