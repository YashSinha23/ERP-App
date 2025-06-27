import { useState } from 'react'
import { FaUserTie } from 'react-icons/fa'


const Login = ({ onSuccess }) => {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password === 'admin123') {
            onSuccess()
        } else {
            setError('Incorrect password')
        }
    }

    return (
        <div style={outerWrapper}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <FaUserTie size={50} color="#f05d0e" />
                <h2 style={headingStyle}>Manager Login</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={inputStyle}
                />
                {error && <p style={errorStyle}>{error}</p>}
                <button type="submit" style={btnStyle}>Login</button>
            </form>
        </div>
    )
}

const outerWrapper = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f0',
}

const formStyle = {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    width: '320px'
}

const headingStyle = {
    color: '#f05d0e',
    fontSize: '1.8rem',
    fontWeight: 'bold',
}

const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc'
}

const btnStyle = {
    padding: '10px',
    backgroundColor: '#f05d0e',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%'
}

const errorStyle = {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
}

export default Login
