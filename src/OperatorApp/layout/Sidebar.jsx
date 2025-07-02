import BackButton from '../../BackButton' // adjust path if needed

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
        justifyContent: 'space-between',
        zIndex: 100
    }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {formCategories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    style={{
                        all: 'unset', // ✅ Reset to avoid default browser button styling
                        display: 'block',
                        width: '100%',
                        padding: '15px 20px',
                        backgroundColor: selected === cat.id ? '#97BC62' : 'transparent',
                        color: selected === cat.id ? '#2C5F2D' : 'white',
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

        {selected && (
            <div style={{ padding: '1rem' }}>
                <BackButton label="⬅ Back" />
            </div>
        )}
    </div>
)

export default Sidebar
