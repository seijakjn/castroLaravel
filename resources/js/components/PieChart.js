import React from 'react';

const PieChart = ({ data, size = 120, title = "Distribution" }) => {
  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.students, 0);

  // If no data, show empty state
  if (!data || data.length === 0 || total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: '#f0f0f0',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '12px'
          }}
        >
          No Data
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>No students found</div>
      </div>
    );
  }

  // Calculate angles for each segment
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.students / total) * 100;
    const angle = (item.students / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
      startAngle,
      endAngle: currentAngle,
      angle
    };
  });

  // Generate conic-gradient string
  const generateGradient = () => {
    if (segments.length === 1) {
      return `conic-gradient(${segments[0].color} 0deg 360deg)`;
    }

    let gradientString = 'conic-gradient(';
    segments.forEach((segment, index) => {
      if (index === 0) {
        gradientString += `${segment.color} 0deg ${segment.endAngle}deg`;
      } else {
        gradientString += `, ${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`;
      }
    });
    gradientString += ')';

    return gradientString;
  };

  const styles = {
    container: {
      textAlign: 'center'
    },
    chartWrapper: {
      position: 'relative',
      display: 'inline-block',
      margin: '0 auto 20px'
    },
    pieChart: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: generateGradient(),
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    },
    centerLabel: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      borderRadius: '50%',
      width: size * 0.4,
      height: size * 0.4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: '600',
      color: '#2c5530',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    totalNumber: {
      fontSize: Math.max(size * 0.1, 12),
      fontWeight: '700',
      color: '#2c5530',
      marginBottom: '2px'
    },
    totalLabel: {
      fontSize: Math.max(size * 0.06, 8),
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    legend: {
      textAlign: 'left',
      marginTop: '15px'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '12px',
      padding: '4px 0'
    },
    legendLeft: {
      display: 'flex',
      alignItems: 'center'
    },
    legendColor: {
      width: '12px',
      height: '12px',
      borderRadius: '2px',
      marginRight: '8px',
      flexShrink: 0
    },
    legendName: {
      fontWeight: '500',
      color: '#333'
    },
    legendValue: {
      fontWeight: '600',
      color: '#666'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#2c5530',
      marginBottom: '15px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      {title && <h4 style={styles.title}>{title}</h4>}

      <div style={styles.chartWrapper}>
        <div
          style={styles.pieChart}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        ></div>

        {/* Center label showing total */}
        <div style={styles.centerLabel}>
          <div style={styles.totalNumber}>{total}</div>
          <div style={styles.totalLabel}>Total</div>
        </div>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {segments.map((segment, index) => (
          <div key={index} style={styles.legendItem}>
            <div style={styles.legendLeft}>
              <div style={{
                ...styles.legendColor,
                backgroundColor: segment.color
              }}></div>
              <span style={styles.legendName}>{segment.name}</span>
            </div>
            <div style={styles.legendValue}>
              {segment.students} ({segment.percentage}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;