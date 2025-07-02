import BackButton from '../../BackButton' // adjust path as needed

const Sidebar = ({ topTab, selectedCategory, onCategoryChange }) => {
    const logCategories = [
        { id: 'raw_material_logs', label: 'Raw Material Logs' },
        { id: 'sheet_forming_logs', label: 'Sheet Forming Logs' },
        { id: 'cup_molding_logs', label: 'Cup Molding Logs' },
        { id: 'printed_cups_logs', label: 'Printed Cups Logs' }
    ]

    const inventoryCategories = [
        { id: 'raw_material_stock', label: 'Raw Material Inventory' },
        { id: 'sheet_stock', label: 'Sheet Inventory' },
        { id: 'cups_stock', label: 'Cups Inventory' },
        { id: 'printed_cups_stock', label: 'Printed Cups Inventory' }
    ]

    const categories = topTab === 'logs' ? logCategories : inventoryCategories

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '220px',
            height: '100vh',
            backgroundColor: '#2C5F2D',
            color: 'white',
            padding: '1rem 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        style={{
                            all: 'unset',
                            display: 'block',
                            width: '100%',
                            boxSizing: 'border-box', // ✅ THIS FIXES THE OVERFLOW
                            padding: '15px 20px',
                            backgroundColor: selectedCategory === cat.id ? '#97BC62' : 'transparent',
                            color: selectedCategory === cat.id ? '#2C5F2D' : 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textAlign: 'left',
                            cursor: 'pointer'
                        }}

                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {(topTab === 'logs' || topTab === 'inventory') && (
                <div style={{ padding: '1rem' }}>
                    <BackButton label="⬅ Back" />
                </div>
            )}
        </div>
    )
}

export default Sidebar
