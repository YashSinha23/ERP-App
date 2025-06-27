import { useState } from 'react'
import { db } from '../../firebase/firebaseConfig'
import {
    collection,
    addDoc,
    doc,
    getDoc,
    setDoc,
    Timestamp
} from 'firebase/firestore'

function RawMaterialForm() {
    const [material, setMaterial] = useState('')
    const [quantity, setQuantity] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleInitialSubmit = (e) => {
        e.preventDefault()
        const qty = parseFloat(quantity)
        if (!material || isNaN(qty) || qty <= 0) {
            alert('All fields are required and quantity must be valid.')
            return
        }
        setShowConfirm(true)
    }

    const handleConfirm = async () => {
        setSubmitting(true)
        const qty = parseFloat(quantity)
        const timestamp = Timestamp.now()

        try {
            const stockRef = doc(db, 'raw_material_stock', material)
            const stockSnap = await getDoc(stockRef)
            const currentQty = stockSnap.exists() ? stockSnap.data().quantity : 0

            // Log the entry
            await addDoc(collection(db, 'raw_material_logs'), {
                material_type: material,
                quantity: qty,
                operation: 'inward',
                timestamp
            })

            // Update stock
            await setDoc(stockRef, {
                quantity: currentQty + qty,
                last_updated: timestamp
            })

            alert('✅ Entry saved and stock updated.')
            setMaterial('')
            setQuantity('')
        } catch (err) {
            console.error(err)
            alert('❌ Something went wrong while saving.')
        } finally {
            setSubmitting(false)
            setShowConfirm(false)
        }
    }

    return (
        <>
            <form onSubmit={handleInitialSubmit} style={formStyle}>
                <label style={labelStyle}>Material Type</label>
                <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    required
                    style={inputStyle}
                >
                    <option value="" disabled>Select a material</option>
                    <option value="HIPP">HIPP</option>
                    <option value="PP">PP</option>
                    <option value="JJ">JJ</option>
                    <option value="Master Batch">Master Batch</option>
                    <option value="Styrene">Styrene</option>
                    <option value="GPPS">GPPS</option>
                    <option value="Blue">Blue</option>
                    <option value="Crush">Crush</option>
                </select>

                <label style={labelStyle}>Quantity (kg)</label>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    required
                    style={inputStyle}
                />

                <button type="submit" style={submitBtnStyle}>Submit</button>
            </form>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div style={overlayStyle}>
                    <div style={confirmCardStyle}>
                        <h3 style={{ color: '#2C5F2D', fontSize: '1.5rem', marginBottom: '1rem' }}>Confirm Entry</h3>
                        <p><b>Material:</b> {material}</p>
                        <p><b>Quantity:</b> {quantity} kg</p>
                        <p><b>Operation:</b> Inward</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                            <button onClick={() => setShowConfirm(false)} style={cancelBtn}>Cancel</button>
                            <button onClick={handleConfirm} disabled={submitting} style={confirmBtn}>
                                {submitting ? 'Saving...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// Styles (unchanged)
const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '800px'
}

const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px'
}

const labelStyle = {
    fontWeight: 'bold',
    color: '#2C5F2D',
    marginBottom: '4px'
}

const submitBtnStyle = {
    backgroundColor: '#1a73e8',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    alignSelf: 'flex-end',
    marginTop: '1rem'
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: '1rem'
}

const confirmCardStyle = {
    backgroundColor: '#fff',
    padding: '1.5rem',
    paddingTop: '1rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'left',
    maxHeight: '90vh',
    overflowY: 'auto'
}

const confirmBtn = {
    backgroundColor: '#2C5F2D',
    color: 'white',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
}

const cancelBtn = {
    backgroundColor: '#ccc',
    color: '#333',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
}

export default RawMaterialForm
