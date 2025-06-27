import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebaseConfig'
import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    setDoc,
    increment
} from 'firebase/firestore'

const PrintedCupsForm = () => {
    const [printShift, setPrintShift] = useState('')
    const [printOperator, setPrintOperator] = useState('')
    const [cupsUsed, setCupsUsed] = useState('')
    const [printedCupsProduced, setPrintedCupsProduced] = useState('')
    const [rejectedCups, setRejectedCups] = useState('')
    const [availableCups, setAvailableCups] = useState([])
    const [showConfirm, setShowConfirm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [printingLabel, setPrintingLabel] = useState('')


    useEffect(() => {
        const fetchCups = async () => {
            const snapshot = await getDocs(collection(db, 'cups_stock'))
            const options = []
            snapshot.forEach(doc => {
                const data = doc.data()
                options.push({ id: doc.id, label: `Cavity ${data.cavity} - ${data.quantity} pcs` })
            })
            setAvailableCups(options)
        }

        fetchCups()
    }, [])

    const handleInitialSubmit = (e) => {
        e.preventDefault()
        setShowConfirm(true)
    }

    const handleConfirm = async () => {
        setSubmitting(true)

        const produced = parseInt(printedCupsProduced)
        const rejected = parseInt(rejectedCups)

        try {
            const cupType = cupsUsed
            const cupsStockRef = doc(db, 'cups_stock', cupType)
            const cupsStockSnap = await getDoc(cupsStockRef)

            if (!cupsStockSnap.exists()) {
                alert("Cup stock not found.")
                setShowConfirm(false)
                setSubmitting(false)
                return
            }

            const currentCupQty = cupsStockSnap.data().quantity

            if (currentCupQty < produced) {
                alert(`Not enough cups in stock.\nAvailable: ${currentCupQty}, Tried: ${produced}`)
                setShowConfirm(false)
                setSubmitting(false)
                return
            }

            await updateDoc(cupsStockRef, {
                quantity: currentCupQty - produced
            })

            const printedStockRef = doc(db, 'printed_cups_stock', cupType)
            const printedStockSnap = await getDoc(printedStockRef)

            if (printedStockSnap.exists()) {
                await updateDoc(printedStockRef, {
                    quantity: increment(produced),
                    printing_label: printingLabel,
                    last_updated: new Date()
                })
            } else {
                await setDoc(printedStockRef, {
                    type: cupType,
                    quantity: produced,
                    printing_label: printingLabel,
                    last_updated: new Date()
                })
            }



            await addDoc(collection(db, 'printed_cups_logs'), {
                timestamp: new Date(),
                shift: printShift,
                operator: printOperator,
                cup_type: cupType,
                cups_produced: produced,
                rejected_cups: rejected,
                printing_label: printingLabel
            })



            alert("✅ Printed cup log submitted and inventory updated!")
            resetForm()
        } catch (error) {
            console.error("Submission error:", error)
            alert("❌ Something went wrong.")
        } finally {
            setShowConfirm(false)
            setSubmitting(false)
        }
    }

    const resetForm = () => {
        setPrintShift('')
        setPrintOperator('')
        setCupsUsed('')
        setPrintedCupsProduced('')
        setRejectedCups('')
    }

    return (
        <>
            <form onSubmit={handleInitialSubmit} style={formStyle}>
                <label style={labelStyle}>Shift</label>
                <select value={printShift} onChange={(e) => setPrintShift(e.target.value)} required style={inputStyle}>
                    <option value="" disabled>Select Shift</option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                </select>

                <label style={labelStyle}>Operator</label>
                <select value={printOperator} onChange={(e) => setPrintOperator(e.target.value)} required style={inputStyle}>
                    <option value="" disabled>Select Operator</option>
                    <option value="Operator A">Operator A</option>
                    <option value="Operator B">Operator B</option>
                </select>

                <label style={labelStyle}>Cups Used (Type)</label>
                <select value={cupsUsed} onChange={(e) => setCupsUsed(e.target.value)} required style={inputStyle}>
                    <option value="" disabled>Select Cup</option>
                    {availableCups.map(cup => (
                        <option key={cup.id} value={cup.id}>{cup.label}</option>
                    ))}
                </select>

                <label style={labelStyle}>Cups Produced</label>
                <input
                    type="number"
                    value={printedCupsProduced}
                    onChange={(e) => setPrintedCupsProduced(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    required
                    style={inputStyle}
                />
                <label style={labelStyle}>Printing Label</label>
                <input
                    type="text"
                    value={printingLabel}
                    onChange={(e) => setPrintingLabel(e.target.value)}
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

                <button type="submit" style={submitBtnStyle}>Submit</button>
            </form>

            {showConfirm && (
                <div style={overlayStyle}>
                    <div style={confirmCardStyle}>
                        <h3 style={{ color: '#2C5F2D', fontSize: '1.5rem', marginBottom: '1rem' }}>Confirm Entry</h3>
                        <p><b>Shift:</b> {printShift}</p>
                        <p><b>Operator:</b> {printOperator}</p>
                        <p><b>Cups Used:</b> {cupsUsed}</p>
                        <p><b>Cups Produced:</b> {printedCupsProduced}</p>
                        <p><b>Printing Label:</b> {printingLabel}</p>
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

export default PrintedCupsForm
