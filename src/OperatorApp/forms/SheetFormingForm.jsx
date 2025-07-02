import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { pink } from '@mui/material/colors'
import { db } from '../../firebase/firebaseConfig'
import {
    collection,
    addDoc,
    doc,
    getDoc,
    setDoc,
    Timestamp
} from 'firebase/firestore'
import dayjs from 'dayjs'
import DateTimeInput from '../../DateTimeInput'


const SheetFormingForm = () => {
    const [shift, setShift] = useState('')
    const [operator, setOperator] = useState('')
    const [size, setSize] = useState('')
    const [thickness, setThickness] = useState('')
    const [sheetUsable, setSheetUsable] = useState('')
    const [primary, setPrimary] = useState('')
    const [primaryQty, setPrimaryQty] = useState('')
    const [additives, setAdditives] = useState({})
    const [golaScrap, setGolaScrap] = useState('')
    const [sheetScrap, setSheetScrap] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [timestamp, setTimestamp] = useState(dayjs())



    const additiveOptions = ['Master Batch', 'Styrene', 'GPPS', 'Crush', 'JJ']

    const handleAdditiveChange = (name) => (e) => {
        setAdditives(prev => ({
            ...prev,
            [name]: {
                checked: e.target.checked,
                qty: prev[name]?.qty || ''
            }
        }))
    }

    const handleAdditiveQtyChange = (name) => (e) => {
        setAdditives(prev => ({
            ...prev,
            [name]: {
                ...prev[name],
                qty: e.target.value
            }
        }))
    }

    const handleConfirm = async () => {
        setSubmitting(true)

        const thicknessVal = parseFloat(thickness)
        const usable = parseFloat(sheetUsable) || 0
        const primaryQtyNum = parseFloat(primaryQty) || 0
        const gola = parseFloat(golaScrap) || 0
        const sheet = parseFloat(sheetScrap) || 0
        const scrap = gola + sheet

        const additivesUsed = {}
        for (const [name, data] of Object.entries(additives)) {
            if (data.checked && data.qty) {
                const qty = parseFloat(data.qty)
                if (!isNaN(qty)) {
                    additivesUsed[name] = qty
                }
            }
        }

        const expectedUsable = primaryQtyNum + Object.values(additivesUsed).reduce((sum, val) => sum + val, 0) - scrap
        const matchPercentage = (usable / expectedUsable) * 100
        const withinRange = matchPercentage >= 95 && matchPercentage <= 100

        if (!withinRange) {
            alert(`❌ Usable sheet (${usable} kg) is ${matchPercentage.toFixed(1)}% of expected (${expectedUsable.toFixed(2)} kg). Allowed range: 95% - 100%.`)
            setSubmitting(false)
            return
        }

        const convertedTimestamp = Timestamp.fromDate(new Date(timestamp))

        try {
            const sheetKey = `${size}_${thicknessVal}`
            const stockRef = doc(db, 'sheet_stock', sheetKey)
            const stockSnap = await getDoc(stockRef)
            const currentQty = stockSnap.exists() ? stockSnap.data().quantity : 0

            // 🔁 Check primary material
            const primaryRef = doc(db, 'raw_material_stock', primary)
            const primarySnap = await getDoc(primaryRef)
            const currentPrimaryQty = primarySnap.exists() ? primarySnap.data().quantity : 0

            if (primaryQtyNum > currentPrimaryQty) {
                alert(`❌ Not enough ${primary} in stock. Available: ${currentPrimaryQty} kg`)
                setSubmitting(false)
                return
            }

            // 🔁 Check each additive stock
            for (const [name, qty] of Object.entries(additivesUsed)) {
                const addRef = doc(db, 'raw_material_stock', name)
                const addSnap = await getDoc(addRef)
                const currentAddQty = addSnap.exists() ? addSnap.data().quantity : 0

                if (qty > currentAddQty) {
                    alert(`❌ Not enough ${name} in stock. Available: ${currentAddQty} kg`)
                    setSubmitting(false)
                    return
                }
            }

            // ✅ All validations passed → Log the sheet forming entry
            await addDoc(collection(db, 'sheet_forming_logs'), {
                shift,
                operator,
                size,
                thickness: thicknessVal,
                sheet_usable: usable,
                primary_material: primary,
                primary_quantity: primaryQtyNum,
                additives: additivesUsed,
                gola_scrap: gola,
                sheet_scrap: sheet,
                timestamp: convertedTimestamp
            })

            // ✅ Deduct primary material
            await setDoc(primaryRef, {
                quantity: currentPrimaryQty - primaryQtyNum,
                last_updated: convertedTimestamp
            })

            // ✅ Deduct additives
            for (const [name, qty] of Object.entries(additivesUsed)) {
                const addRef = doc(db, 'raw_material_stock', name)
                const addSnap = await getDoc(addRef)
                const currentAddQty = addSnap.exists() ? addSnap.data().quantity : 0

                await setDoc(addRef, {
                    quantity: currentAddQty - qty,
                    last_updated: convertedTimestamp
                })
            }

            // ✅ Update usable sheet stock
            await setDoc(stockRef, {
                size,
                thickness: thicknessVal,
                quantity: currentQty + usable,
                last_updated: convertedTimestamp
            })

            alert('✅ Log saved & stock updated!')
            resetForm()
        } catch (err) {
            console.error(err)
            alert('❌ Error saving to Firestore.')
        } finally {
            setSubmitting(false)
            setShowConfirm(false)
        }
    }



    const gola = parseFloat(golaScrap) || 0
    const sheet = parseFloat(sheetScrap) || 0
    const scrapTotal = gola + sheet
    const primaryNum = parseFloat(primaryQty) || 0
    const usableNum = parseFloat(sheetUsable) || 0
    const additivesTotal = Object.values(additives).reduce((sum, val) => {
        const q = parseFloat(val.qty)
        return sum + (val.checked && !isNaN(q) ? q : 0)
    }, 0)

    const totalUsed = primaryNum + additivesTotal + scrapTotal


    const expectedUsable = primaryNum + additivesTotal - scrapTotal
    const matchPercentage = expectedUsable > 0 && usableNum > 0
        ? (expectedUsable / usableNum) * 100
        : 0

    const withinRange = matchPercentage >= 95 && matchPercentage <= 100


    const resetForm = () => {
        setShift('')
        setOperator('')
        setSize('')
        setThickness('')
        setSheetUsable('')
        setPrimary('')
        setPrimaryQty('')
        setAdditives({})
        setGolaScrap('')
        setSheetScrap('')
    }

    return (
        <>
            {sheetUsable && (
                <div style={{
                    position: 'fixed', // ✅ makes it stick to screen
                    top: '2rem',
                    right: '2rem',
                    backgroundColor: '#fff',
                    padding: '1.5rem',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    width: '350px',
                    zIndex: 9999, // on top of all
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ color: '#2C5F2D', marginBottom: '1rem' }}>Production Summary</h3>
                    <p><b>Primary:</b> {primary}: {primaryNum} kg ({((primaryNum / totalUsed) * 100).toFixed(1)}%)</p>
                    <p><b>Additives:</b> {additivesTotal} kg ({((additivesTotal / totalUsed) * 100).toFixed(1)}%)</p>
                    <p><b>Scrap:</b> {scrapTotal} kg ({((scrapTotal / totalUsed) * 100).toFixed(1)}%)</p>
                    <hr />
                    <p><b>Total Production:</b> {totalUsed} kg (100%)</p>
                    <div style={{ backgroundColor: '#ffe6e6', padding: '0.5rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                        <p><b style={{ color: '#a00000' }}>Gola Scrap:</b> {gola} kg ({((gola / totalUsed) * 100).toFixed(1)}%)</p>
                        <p><b style={{ color: '#a00000' }}>Sheet Scrap:</b> {sheet} kg ({((sheet / totalUsed) * 100).toFixed(1)}%)</p>
                    </div>
                    <p style={{ marginTop: '0.5rem' }}>
                        <b>Usable Sheet:</b> {usableNum} kg<br />
                        <b>Match:</b> {matchPercentage.toFixed(1)}%{' '}
                        {withinRange ? <span style={{ color: 'green' }}>✅</span> : <span style={{ color: 'red' }}>❌</span>}
                    </p>
                </div>
            )}

            <form style={formStyle}>
                <DateTimeInput value={timestamp} onChange={setTimestamp} />
                <label style={labelStyle}>Shift</label>
                <select value={shift} onChange={e => setShift(e.target.value)} style={inputStyle} required>
                    <option value="" disabled>Select Shift</option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                </select>

                <label style={labelStyle}>Operator</label>
                <select value={operator} onChange={e => setOperator(e.target.value)} style={inputStyle} required>
                    <option value="" disabled>Select Operator</option>
                    <option value="Mr. Vakil Tiwari">Mr. Vakil Tiwari</option>
                    <option value="Mr. Hazari Lal">Mr. Hazari Lal</option>
                </select>

                <label style={labelStyle}>Sheet Size</label>
                <select value={size} onChange={e => setSize(e.target.value)} style={inputStyle} required>
                    <option value="" disabled>Select Size</option>
                    <option value="670">670</option>
                    <option value="470">470</option>
                </select>

                <label style={labelStyle}>Thickness (mm)</label>
                <input
                    type="number"
                    step="0.01"
                    min="0.35"
                    max="1.7"
                    value={thickness}
                    onChange={e => setThickness(e.target.value)}
                    style={inputStyle}
                    onWheel={(e) => e.target.blur()}
                    required
                />
                <input
                    type="range"
                    min="0.35"
                    max="1.7"
                    step="0.01"
                    value={thickness}
                    onChange={e => setThickness(e.target.value)}
                    style={{ width: '100%', marginBottom: '1rem', accentColor: '#2C5F2D' }}
                />

                <label style={labelStyle}>Usable Sheet Production (kg)</label>
                <input
                    type="number"
                    value={sheetUsable}
                    onChange={e => setSheetUsable(e.target.value)}
                    style={inputStyle}
                    onWheel={(e) => e.target.blur()}
                    required
                />

                <label style={labelStyle}>Primary Material</label>
                <select value={primary} onChange={e => setPrimary(e.target.value)} style={inputStyle} required>
                    <option value="" disabled>Select Primary Material</option>
                    <option value="HIPP">HIPP</option>
                    <option value="PP">PP</option>
                </select>

                {primary && (
                    <TextField
                        fullWidth
                        label="Primary Quantity (kg)"
                        type="number"
                        value={primaryQty}
                        onChange={e => setPrimaryQty(e.target.value)}
                        onWheel={(e) => e.target.blur()}
                        variant="outlined"
                        InputProps={{ style: inputStyle }}
                        InputLabelProps={{ style: { color: '#2C5F2D' } }}
                        required
                    />
                )}

                <label style={{ ...labelStyle, marginTop: '1rem' }}>Additives</label>
                {additiveOptions.map((add) => (
                    <div key={add} style={{ marginBottom: '0.5rem' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={additives[add]?.checked || false}
                                    onChange={handleAdditiveChange(add)}
                                    sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] }, padding: '4px' }}
                                />
                            }
                            label={add}
                        />
                        {additives[add]?.checked && (
                            <TextField
                                label={`Quantity of ${add} (kg)`}
                                type="number"
                                value={additives[add]?.qty || ''}
                                onChange={handleAdditiveQtyChange(add)}
                                onWheel={(e) => e.target.blur()}
                                fullWidth
                                variant="outlined"
                                InputProps={{ style: inputStyle }}
                                InputLabelProps={{ style: { color: '#2C5F2D' } }}
                            />
                        )}
                    </div>
                ))}
                {showConfirm && (
                    <div style={overlayStyle}>
                        <div style={confirmCardStyle}>
                            <h3 style={{ color: '#2C5F2D', fontSize: '1.5rem', marginBottom: '1rem' }}>Confirm Entry</h3>

                            <p><b>Shift:</b> {shift}</p>
                            <p><b>Operator:</b> {operator}</p>
                            <p><b>Sheet Size:</b> {size}</p>
                            <p><b>Thickness:</b> {thickness} mm</p>
                            <p><b>Primary:</b> {primary} - {primaryQty} kg</p>
                            <p><b>Sheet Usable:</b> {sheetUsable} kg</p>

                            <p><b>Additives:</b></p>
                            {Object.entries(additives).map(([key, val]) =>
                                val.checked && val.qty ? <p key={key}>➤ {key}: {val.qty} kg</p> : null
                            )}

                            <p><b>Gola Scrap:</b> {golaScrap} kg</p>
                            <p><b>Sheet Scrap:</b> {sheetScrap} kg</p>
                            <hr />
                            <p>
                                <b>Expected Usable = Primary + Additives - Scrap</b><br />
                                {primaryNum} + {additivesTotal} - {scrapTotal} = {expectedUsable.toFixed(2)} kg
                            </p>
                            <p>
                                <b>Entered Usable Sheet:</b> {sheetUsable} kg<br />
                                <b>Match:</b> {matchPercentage.toFixed(1)}%{' '}
                                {withinRange ? (
                                    <span style={{ color: 'green' }}>✅ Matched</span>
                                ) : (
                                    <span style={{ color: 'red' }}>❌ Mismatch</span>
                                )}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                                <button onClick={() => setShowConfirm(false)} style={cancelBtn}>Cancel</button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={submitting || !withinRange}
                                    style={confirmBtn}
                                >
                                    {submitting ? 'Saving...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                <label style={labelStyle}>Gola Scrap (kg)</label>
                <input
                    type="number"
                    value={golaScrap}
                    onChange={e => setGolaScrap(e.target.value)}
                    style={inputStyle}
                    onWheel={(e) => e.target.blur()}
                />

                <label style={labelStyle}>Sheet Scrap (kg)</label>
                <input
                    type="number"
                    value={sheetScrap}
                    onChange={e => setSheetScrap(e.target.value)}
                    style={inputStyle}
                    onWheel={(e) => e.target.blur()}
                />

                <button
                    type="button"
                    style={submitBtnStyle}
                    onClick={() => {
                        // Optional: Basic validation check before showing modal
                        if (!shift || !operator || !size || !thickness || !primary || !primaryQty || !sheetUsable) {
                            alert("Please fill all required fields.")
                            return
                        }
                        setShowConfirm(true)
                    }}
                >
                    Submit
                </button>

            </form>
        </>
    )
}

// === Styles ===
const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
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


const submitBtnStyle = {
    backgroundColor: '#1a73e8',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    alignSelf: 'flex-end'
}

export default SheetFormingForm
