import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebaseConfig'
import {
    getDocs,
    setDoc,
    deleteDoc,
    doc,
    collection
} from 'firebase/firestore'
import BackButton from '../../BackButton'

const specFields = [
    'Diameter (mm)',
    'Volume (ml)'
]

const EditCavitySpecs = () => {
    const [editableSpecs, setEditableSpecs] = useState({})

    useEffect(() => {
        const fetchCavitySpecs = async () => {
            const snapshot = await getDocs(collection(db, 'cavity_specs'))
            const specs = {}

            snapshot.forEach(docSnap => {
                const rawData = docSnap.data()
                // Only keep diameter and volume
                const cleaned = {}
                specFields.forEach(field => {
                    cleaned[field] = rawData[field] ?? 0
                })
                cleaned['Label'] = rawData['Label'] ?? ''
                specs[docSnap.id] = cleaned
            })

            setEditableSpecs(specs)
        }

        fetchCavitySpecs()
    }, [])

    const handleAddCavity = () => {
        const newSpec = {}
        specFields.forEach(field => (newSpec[field] = 0))
        newSpec['Label'] = ''
        setEditableSpecs(prev => ({ ...prev, ['']: newSpec })) // temp empty key for new spec
    }

    const handleSave = async () => {
        try {
            const promises = Object.entries(editableSpecs).map(([id, spec]) => {
                // Use Label and Volume as document ID
                const docId = spec['Label'] && spec['Volume (ml)']
                    ? `${spec['Label']} ${spec['Volume (ml)']}`
                    : id // fallback to id if missing

                const cleaned = {}
                specFields.forEach(field => {
                    cleaned[field] = spec[field] ?? 0
                })
                cleaned['Label'] = spec['Label'] ?? ''
                return setDoc(doc(db, 'cavity_specs', docId), cleaned, { merge: false })
            })
            await Promise.all(promises)
            alert("✅ All cavity specs saved cleanly to Firestore.")
        } catch (err) {
            console.error(err)
            alert("❌ Error saving cavity specs.")
        }
    }

    const handleDelete = async (id) => {
        try {
            const updated = { ...editableSpecs }
            delete updated[id]
            setEditableSpecs(updated)
            await deleteDoc(doc(db, 'cavity_specs', id))
            alert(`🗑️ Deleted Cavity ${id}`)
        } catch (err) {
            console.error(err)
            alert("❌ Failed to delete cavity spec.")
        }
    }

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#F2F5F1',
            overflowY: 'auto',
            padding: '3rem 1rem',
            boxSizing: 'border-box'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{
                    color: '#2C5F2D',
                    marginBottom: '2rem',
                    fontWeight: '700',
                    fontSize: '1.75rem',
                    textAlign: 'center'
                }}>
                    🛠 Edit Cavity Specs
                </h2>

                {Object.entries(editableSpecs).map(([id, spec]) => (
                    <div key={id} style={{
                        marginBottom: '2rem',
                        padding: '1.5rem',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        position: 'relative',
                        color: '#000'
                    }}>
                        <h4 style={{
                            color: '#2C5F2D',
                            fontWeight: '600',
                            fontSize: '1.2rem',
                            marginBottom: '1rem'
                        }}>
                            🧩 {spec['Label'] ? spec['Label'] : 'Cavity'} {spec['Volume (ml)'] ? spec['Volume (ml)'] : ''}
                        </h4>

                        <button
                            onClick={() => handleDelete(id)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            🗑 Delete
                        </button>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '1rem'
                        }}>
                            {specFields.map(field => (
                                <div key={field}>
                                    <label style={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: '#2C5F2D'
                                    }}>
                                        {field}
                                    </label>
                                    <input
                                        type="number"
                                        value={spec[field] ?? ''}
                                        onChange={(e) => {
                                            const updated = { ...editableSpecs }
                                            updated[id][field] = parseFloat(e.target.value)
                                            setEditableSpecs(updated)
                                        }}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: '1px solid #ccc',
                                            fontSize: '14px',
                                            width: '100%',
                                            backgroundColor: '#fdfdfd',
                                            color: '#000'
                                        }}
                                    />
                                </div>
                            ))}
                            <div>
                                <label style={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#2C5F2D'
                                }}>
                                    Label
                                </label>
                                <input
                                    type="text"
                                    value={spec['Label'] ?? ''}
                                    onChange={(e) => {
                                        const updated = { ...editableSpecs }
                                        updated[id]['Label'] = e.target.value
                                        setEditableSpecs(updated)
                                    }}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #ccc',
                                        fontSize: '14px',
                                        width: '100%',
                                        backgroundColor: '#fdfdfd',
                                        color: '#000'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '2rem'
                }}>
                    <button onClick={handleAddCavity} style={{
                        backgroundColor: '#97BC62',
                        color: 'white',
                        padding: '10px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}>
                        ➕ Add Cavity
                    </button>

                    <button onClick={handleSave} style={{
                        backgroundColor: '#2C5F2D',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}>
                        💾 Save Specs
                    </button>
                </div>
            </div>

            <BackButton />
        </div>
    )
}

export default EditCavitySpecs
