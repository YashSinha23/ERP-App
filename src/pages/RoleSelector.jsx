import { useNavigate } from 'react-router-dom'
import { FaUserCog, FaUserTie } from 'react-icons/fa'

const RoleSelector = () => {
    const navigate = useNavigate()

    const roles = [
        {
            label: 'Operator App',
            icon: <FaUserCog size={60} color="#2C5F2D" />,
            path: '/operator',
        },
        {
            label: 'Manager App',
            icon: <FaUserTie size={60} color="#2C5F2D" />,
            path: '/manager',
        },
    ]

    return (
        <div style={outerWrapper}>
            <div style={innerWrapper}>
                <h1 style={headingStyle}>Select Role</h1>
                <div style={cardWrapper}>
                    {roles.map((role) => (
                        <div
                            key={role.label}
                            style={cardStyle}
                            onClick={() => navigate(role.path)}
                        >
                            {role.icon}
                            <span style={labelStyle}>{role.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const outerWrapper = {
    margin: 0,
    padding: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f0f4f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

const innerWrapper = {
    width: '100%',
    maxWidth: '900px',
    textAlign: 'center',
    padding: '1rem',
}

const headingStyle = {
    fontSize: '2.8rem',
    marginBottom: '2rem',
    color: '#2C5F2D',
}

const cardWrapper = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3rem',
    flexWrap: 'wrap',
}

const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    width: '220px',
    height: '220px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    fontSize: '18px',
}

const labelStyle = {
    marginTop: '1rem',
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#2C5F2D',
}

export default RoleSelector
