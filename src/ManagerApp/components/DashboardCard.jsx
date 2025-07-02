const DashboardCard = ({ label, icon, color = '#2C5F2D', onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                cursor: 'pointer',
                width: '200px',
                height: '180px',
                backgroundColor: 'white',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
        >
            <div style={{ color, fontSize: '40px' }}>
                {icon}
            </div>
            <h3 style={{ marginTop: '1rem', color: '#2C5F2D', fontWeight: '600' }}>{label}</h3>
        </div>
    )
}

export default DashboardCard
