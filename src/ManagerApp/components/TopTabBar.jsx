const TopTabBar = ({ topTab, onTabSwitch }) => {
    const topTabBtnStyle = (isActive) => ({
        flex: 1,
        padding: '15px',
        textAlign: 'center',
        backgroundColor: isActive ? '#97BC62' : '#2C5F2D',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderBottom: isActive ? '4px solid white' : 'none'
    })

    return (
        <div style={{ display: 'flex', backgroundColor: '#2C5F2D' }}>
            <div onClick={() => onTabSwitch('logs')} style={topTabBtnStyle(topTab === 'logs')}>
                Log Entries
            </div>
            <div onClick={() => onTabSwitch('inventory')} style={topTabBtnStyle(topTab === 'inventory')}>
                Live Inventory
            </div>
        </div>
    )
}

export default TopTabBar
