const formCategories = [
    { id: 'raw_material_form', label: 'Raw Material Form' },
    { id: 'sheet_forming_form', label: 'Sheet Forming Form' },
    { id: 'cup_molding_form', label: 'Cup Molding Form' },
    { id: 'printing_form', label: 'Printed Cups Form' }
]

const Sidebar = ({ selected, onSelect }) => (
    <div style={{
        width: '220px',
        backgroundColor: '#2C5F2D',
        color: 'white',
        padding: '1rem 0',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100
    }}>
        {formCategories.map(cat => (
            <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                style={{
                    backgroundColor: selected === cat.id ? '#97BC62' : 'transparent',
                    color: selected === cat.id ? '#2C5F2D' : 'white',
                    border: 'none',
                    padding: '15px 20px',
                    textAlign: 'left',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                {cat.label}
            </button>
        ))}
    </div>
)

export default Sidebar
