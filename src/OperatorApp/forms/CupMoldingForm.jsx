import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebaseConfig'
import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    Timestamp
} from 'firebase/firestore'
import { deleteDoc } from 'firebase/firestore'

const CupMoldingForm = () => {
    const [cupShift, setCupShift] = useState('')
    const [cupOperator, setCupOperator] = useState('')
    const [cavity, setCavity] = useState('')
    const [sheetUsed, setSheetUsed] = useState('')
    const [sheetConsumed, setSheetConsumed] = useState('')
    const [cupsProduced, setCupsProduced] = useState('')
    const [rejectedCups, setRejectedCups] = useState('')
    const [availableSheets, setAvailableSheets] = useState([])
    const [showConfirm, setShowConfirm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [showCavityEditor, setShowCavityEditor] = useState(false)
    const [editableSpecs, setEditableSpecs] = useState({})

    useEffect(() => {
        const fetchSheets = async () => {
            const snapshot = await getDocs(collection(db, 'sheet_stock'))
            const options = []
            snapshot.forEach(doc => {
                const data = doc.data()
                options.push({ id: doc.id, label: `${data.size} - ${data.thickness}mm` })
            })
            setAvailableSheets(options)
        }
        const fetchCavitySpecs = async () => {
            const snapshot = await getDocs(collection(db, 'cavity_specs'))
            const specs = {}
            snapshot.forEach(doc => {
                specs[doc.id] = doc.data()
            })
            setEditableSpecs(specs)
        }

        fetchCavitySpecs()
        fetchSheets()
    }, [])

    const handleInitialSubmit = (e) => {
        e.preventDefault()
        setShowConfirm(true)
    }

    const handleConfirm = async () => {
        setSubmitting(true)

        const timestamp = Timestamp.now()
        const consumed = parseFloat(sheetConsumed)
        const produced = parseInt(cupsProduced)
        const rejected = parseInt(rejectedCups)
        const cavityData = editableSpecs[cavity] || {}

        try {
            const sheetRef = doc(db, 'sheet_stock', sheetUsed)
            const sheetSnap = await getDoc(sheetRef)

            if (!sheetSnap.exists()) {
                alert('Selected sheet not found in stock.')
                setShowConfirm(false)
                setSubmitting(false)
                return
            }

            const sheetData = sheetSnap.data()
            const availableQty = sheetData.quantity || 0

            if (consumed > availableQty) {
                alert(`Not enough sheet stock available.\nAvailable: ${availableQty} kg\nTried: ${consumed} kg`)
                setShowConfirm(false)
                setSubmitting(false)
                return
            }

            await setDoc(sheetRef, {
                ...sheetData,
                quantity: availableQty - consumed,
                last_updated: timestamp
            })

            await addDoc(collection(db, 'cup_molding_logs'), {
                timestamp,
                shift: cupShift,
                operator: cupOperator,
                cavity: parseInt(cavity),
                specs: cavityData,
                sheet_used: sheetUsed,
                sheet_consumed: consumed,
                cups_produced: produced,
                rejected_cups: rejected
            })

            const cupKey = `Cavity-${cavity}`
            const cupStockRef = doc(db, 'cups_stock', cupKey)
            const cupStockSnap = await getDoc(cupStockRef)
            const currentCupQty = cupStockSnap.exists() ? cupStockSnap.data().quantity : 0

            await setDoc(cupStockRef, {
                cavity: parseInt(cavity),
                specs: cavityData,
                quantity: currentCupQty + produced,
                last_updated: timestamp
            })

            alert("✅ Cup Molding Log saved and sheet stock updated.")
            resetForm()
        } catch (err) {
            console.error(err)
            alert("❌ Error saving cup molding log.")
        } finally {
            setSubmitting(false)
            setShowConfirm(false)
        }
    }

    const resetForm = () => {
        setCupShift('')
        setCupOperator('')
        setCavity('')
        setSheetUsed('')
        setSheetConsumed('')
        setCupsProduced('')
        setRejectedCups('')
    }

    return (
        <>
            <form onSubmit={handleInitialSubmit} style={formStyle}>
                <label style={labelStyle}>Shift</label>
                <select value={cupShift} onChange={(e) => setCupShift(e.target.value)} required style={inputStyle}>
                    <option value="" disabled>Select Shift</option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                </select>

                <label style={labelStyle}>Operator</label>
                <select value={cupOperator} onChange={(e) => setCupOperator(e.target.value)} required style={inputStyle}>
                    <option value="" disabled>Select Operator</option>
                    <option value="Operator A">Operator A</option>
                    <option value="Operator B">Operator B</option>
                </select>

                <label style={labelStyle}>Cavity</label>
                <select value={cavity} onChange={(e) => setCavity(e.target.value)} required style={inputStyle}>
                    <option value="" disabled>Select Cavity</option>
                    {Object.keys(editableSpecs).map(id => (
                        <option key={id} value={id}>Cavity {id}</option>
                    ))}
                </select>



                <label style={labelStyle}>Sheet Used</label>
                <select value={sheetUsed} onChange={(e) => setSheetUsed(e.target.value)} required style={inputStyle}>
                    <option value="" disabled>Select Sheet</option>
                    {availableSheets.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                </select>

                <label style={labelStyle}>Sheet Consumed (kg)</label>
                <input
                    type="number"
                    value={sheetConsumed}
                    onChange={(e) => setSheetConsumed(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Cups Produced</label>
                <input
                    type="number"
                    value={cupsProduced}
                    onChange={(e) => setCupsProduced(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Rejected Cups</label>
                <input
                    type="number"
                    value={rejectedCups}
                    onChange={(e) => setRejectedCups(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    required
                    style={inputStyle}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
                    <button
                        onClick={() => setShowCavityEditor(true)}
                        type="button"
                        style={{
                            backgroundColor: '#97BC62',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        🛠 Edit Cavity Specs
                    </button>

                    <button type="submit" style={submitBtnStyle}>Submit</button>
                </div>
            </form>

            {showConfirm && (
                <div style={overlayStyle}>
                    <div style={confirmCardStyle}>
                        <h3 style={{ color: '#2C5F2D', fontSize: '1.5rem', marginBottom: '1rem' }}>Confirm Entry</h3>
                        <p><b>Shift:</b> {cupShift}</p>
                        <p><b>Operator:</b> {cupOperator}</p>
                        <p><b>Cavity:</b> {cavity}</p>
                        <p><b>Sheet Used:</b> {sheetUsed}</p>
                        <p><b>Sheet Consumed:</b> {sheetConsumed} kg</p>
                        <p><b>Cups Produced:</b> {cupsProduced}</p>
                        <p><b>Rejected Cups:</b> {rejectedCups}</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                            <button onClick={() => setShowConfirm(false)} style={cancelBtn}>Cancel</button>
                            <button onClick={handleConfirm} disabled={submitting} style={confirmBtn}>
                                {submitting ? 'Saving...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showCavityEditor && (
                <div style={overlayStyle}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '2rem',
                        width: '95%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ color: '#2C5F2D', marginBottom: '1rem' }}>Edit Cavity Specs</h2>

                        {Object.entries(editableSpecs).map(([id, spec], idx) => (
                            <div key={id} style={{
                                marginBottom: '1.5rem',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid #ddd',
                                position: 'relative'
                            }}>
                                <h4 style={{ marginBottom: '0.5rem', color: '#2C5F2D' }}>
                                    Cavity {id}
                                </h4>

                                <button
                                    onClick={async () => {
                                        try {
                                            const updated = { ...editableSpecs }
                                            delete updated[id]
                                            setEditableSpecs(updated)
                                            await deleteDoc(doc(db, 'cavity_specs', id))
                                            alert(`🗑️ Deleted Cavity ${id} from Firestore.`)
                                        } catch (err) {
                                            console.error(err)
                                            alert("❌ Failed to delete cavity spec.")
                                        }
                                    }}

                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        right: '0',
                                        backgroundColor: '#e74c3c',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    🗑 Delete
                                </button>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                    gap: '12px',
                                    marginTop: '1rem'
                                }}>
                                    {['diameter', 'ml', 'lip', 'collar', 'height', 'bottom', 'weight'].map(key => (
                                        <div key={key}>
                                            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </label>
                                            <input
                                                type="number"
                                                placeholder={key}
                                                value={spec[key] ?? ''}
                                                onChange={e => {
                                                    const updated = { ...editableSpecs }
                                                    updated[id][key] = parseFloat(e.target.value)
                                                    setEditableSpecs(updated)
                                                }}
                                                style={{ ...inputStyle, marginTop: '4px', width: '100%' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}



                        <button
                            onClick={() => {
                                const newId = String(Object.keys(editableSpecs).length + 1)
                                setEditableSpecs({
                                    ...editableSpecs,
                                    [newId]: {
                                        diameter: 0,
                                        ml: 0,
                                        lip: 0,
                                        collar: 0,
                                        height: 0,
                                        bottom: 0,
                                        weight: 0
                                    }
                                })
                            }}
                            style={{ ...submitBtnStyle, marginTop: '1rem', backgroundColor: '#97BC62' }}
                        >
                            ➕ Add Cavity
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowCavityEditor(false)} style={cancelBtn}>Cancel</button>
                            <button
                                onClick={async () => {
                                    try {
                                        const promises = Object.entries(editableSpecs).map(([id, spec]) =>
                                            setDoc(doc(db, 'cavity_specs', id), spec)
                                        )
                                        await Promise.all(promises)
                                        alert("✅ All cavity specs saved to Firestore.")
                                        setShowCavityEditor(false)
                                    } catch (err) {
                                        console.error(err)
                                        alert("❌ Error saving cavity specs.")
                                    }
                                }}
                                style={confirmBtn}
                            >
                                💾 Save Specs
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </>
    )
}

// === Styles ===
const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '900px'
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

export default CupMoldingForm
