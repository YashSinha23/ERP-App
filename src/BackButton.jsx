const BackButton = ({ label = "⬅Back" }) => {
    const handleClick = () => {
        if (window.history.length > 1) {
            window.history.back()
        } else {
            // Fallback: if no history, go to root (optional)
            window.location.href = '/'
        }
    }

    return (
        <button
            onClick={handleClick}
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 999,
                backgroundColor: '#97BC62',
                color: 'white',
                padding: '10px 18px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
        >
            {label}
        </button>
    )
}

export default BackButton
