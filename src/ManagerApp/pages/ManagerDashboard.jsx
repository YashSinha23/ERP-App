import React from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../BackButton'
import { FaClipboardList, FaBoxes, FaCog, FaUsers, FaMoneyCheckAlt, FaShoppingCart } from 'react-icons/fa'

const menuItems = [
  {
    id: 'logs',
    label: 'Logs Entries',
    icon: <FaClipboardList size={60} color="#2C5F2D" />,
    path: 'logs'
  },
  {
    id: 'inventory',
    label: 'Live Inventory',
    icon: <FaBoxes size={60} color="#2C5F2D" />,
    path: 'inventory'
  },
  {
    id: 'cavity',
    label: 'Edit Cavity Specs',
    icon: <FaCog size={60} color="#2C5F2D" />,
    path: 'cavity'
  },
  {
    id: 'employees',
    label: 'Employee Database',
    icon: <FaUsers size={60} color="#2C5F2D" />,
    path: 'employees'
  },
  {
    id: 'payments',
    label: 'Payment Data',
    icon: <FaMoneyCheckAlt size={60} color="#2C5F2D" />,
    path: 'payments'
  },
  {
    id: 'sales',
    label: 'Sales Data',
    icon: <FaShoppingCart size={60} color="#2C5F2D" />,
    path: 'sales'
  }
]


const ManagerDashboard = () => {
  const navigate = useNavigate()

  return (
    <div style={outerWrapper}>
      <div style={innerWrapper}>
        <h1 style={headingStyle}>Manager Dashboard</h1>
        <div style={cardWrapper}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              style={cardStyle}
              onClick={() => navigate(`/manager/${item.path}`)}
            >
              {item.icon}
              <span style={labelStyle}>{item.label}</span>
            </div>
          ))}
        </div>

        <BackButton />

      </div>
    </div>
  )
}

const outerWrapper = {
  margin: 0,
  padding: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: '#F2F5F1',
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
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '2rem',
  justifyContent: 'center',
  padding: '0 1rem'
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

export default ManagerDashboard
