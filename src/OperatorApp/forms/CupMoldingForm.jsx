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
import dayjs from 'dayjs'
import DateTimeInput from '../../DateTimeInput'


const CupMoldingForm = () => {
    const [cupShift, setCupShift] = useState('')
    const [cupOperator, setCupOperator] = useState('')
    const [cavity, setCavity] = useState('')
    const [sheetUsed, setSheetUsed] = useState('')
    const [sheetConsumed, setSheetConsumed] = useState('')
    const [cupsProduced, setCupsProduced] = useState('')
    const [rejectedCups, setRejectedCups] = useState('')
    const [totalCupsProduced, setTotalCupsProduced] = useState('')
    const [availableSheets, setAvailableSheets] = useState([])
    const [showConfirm, setShowConfirm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [cavitySpecs, setCavitySpecs] = useState({})
    const [timestamp, setTimestamp] = useState(dayjs())



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
            setCavitySpecs(specs)
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

        const convertedTimestamp = Timestamp.fromDate(new Date(timestamp))
        const consumed = parseFloat(sheetConsumed)
        const produced = parseInt(cupsProduced)
        const rejected = parseInt(rejectedCups)
        const totalProduced = parseInt(totalCupsProduced)
        const cavityData = cavitySpecs[cavity] || {}

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

            // ✅ Update sheet stock
            await setDoc(sheetRef, {
                ...sheetData,
                quantity: availableQty - consumed,
                last_updated: convertedTimestamp
            })

            // ✅ Log cup molding
            // Build cavity name as Label + Volume
            let cavityName = cavityData.Label ? cavityData.Label : `Cavity ${cavity}`;
            if (cavityData['Volume (ml)']) cavityName += ` ${cavityData['Volume (ml)']}`;
            await addDoc(collection(db, 'cup_molding_logs'), {
                timestamp: convertedTimestamp,
                shift: cupShift,
                operator: cupOperator,
                cavity: cavityName,
                specs: cavityData,
                sheet_used: sheetUsed,
                sheet_consumed: consumed,
                cups_produced: produced,
                rejected_cups: rejected,
                total_cups_produced: totalProduced // <-- Added field
            })

            // ✅ Update cups stock
            const cupKey = `Cavity-${cavity}`
            const cupStockRef = doc(db, 'cups_stock', cupKey)
            const cupStockSnap = await getDoc(cupStockRef)
            const currentCupQty = cupStockSnap.exists() ? cupStockSnap.data().quantity : 0

            await setDoc(cupStockRef, {
                cavity: parseInt(cavity),
                specs: cavityData,
                quantity: currentCupQty + produced,
                last_updated: convertedTimestamp
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
        setTotalCupsProduced('')
    }


    return (
        <>
            <form onSubmit={handleInitialSubmit} style={formStyle}>
                <DateTimeInput value={timestamp} onChange={setTimestamp} />
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
                    {Object.entries(cavitySpecs).map(([id, spec]) => (
                        <option key={id} value={id}>
                          {spec.Label ? spec.Label : 'Cavity'} {spec['Volume (ml)'] ? spec['Volume (ml)'] : ''}
                        </option>
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

                <label style={labelStyle}>Usable Cups Produced</label>
                <input
                    type="number"
                    value={cupsProduced}
                    onChange={(e) => setCupsProduced(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Total Cups Produced</label>
                <input
                    type="number"
                    value={totalCupsProduced}
                    onChange={(e) => setTotalCupsProduced(e.target.value)}
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
                        <p><b>Total Cups Produced:</b> {totalCupsProduced}</p>
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

export default CupMoldingForm
