import { useEffect, useState } from 'react'
import { db } from '../firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import Filters from './Filters'
import ExportButton from './ExportButton'
import PrintButton from './PrintButton'

function App() {
  const [topTab, setTopTab] = useState('logs')
  const [selectedCategory, setSelectedCategory] = useState('raw_material_logs')
  const [data, setData] = useState([])
  const [filterOptions, setFilterOptions] = useState({})

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

  const handleTabSwitch = (nextTab) => {
    const logToInventoryMap = {
      raw_material_logs: 'raw_material_stock',
      sheet_forming_logs: 'sheet_stock',
      cup_molding_logs: 'cups_stock',
      printed_cups_logs: 'printed_cups_stock'
    }

    const inventoryToLogMap = {
      raw_material_stock: 'raw_material_logs',
      sheet_stock: 'sheet_forming_logs',
      cups_stock: 'cup_molding_logs',
      printed_cups_stock: 'printed_cups_logs'
    }

    if (nextTab === 'inventory') {
      const inventoryMatch = logToInventoryMap[selectedCategory]
      setSelectedCategory(inventoryMatch || 'raw_material_stock')
    } else if (nextTab === 'logs') {
      const logMatch = inventoryToLogMap[selectedCategory]
      setSelectedCategory(logMatch || 'raw_material_logs')
    }

    setTopTab(nextTab)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, selectedCategory))
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setData(fetched)
        localStorage.setItem('logs_data_cache', JSON.stringify({ [selectedCategory]: fetched }))
      } catch (err) {
        console.error('Error fetching data:', err)
        setData([])
      }
    }
    fetchData()
  }, [selectedCategory])

  const filteredData = data.filter(item => {
    const filters = filterOptions
    const itemDate = item.timestamp?.toDate?.() || new Date(item.timestamp?.seconds * 1000)

    if (filters.fromDate && new Date(filters.fromDate) > itemDate) return false
    if (filters.toDate && new Date(filters.toDate) < itemDate) return false

    for (let key in filters) {
      if (['fromDate', 'toDate'].includes(key)) continue
      if (filters[key] && item[key] !== filters[key]) return false
    }

    return true
  })

  const safeTimestamp = (ts) => {
    try {
      if (ts?.toDate) return ts.toDate().toLocaleString()
      if (ts?.seconds) return new Date(ts.seconds * 1000).toLocaleString()
    } catch (e) {
      console.warn('Invalid timestamp:', ts)
    }
    return '-'
  }

  const renderTable = () => {
    if (data === null) return <p style={{ color: '#000' }}>🔧 Coming soon...</p>
    if (data.length === 0) return <p style={{ color: '#000' }}>📭 No data available.</p>

    const isCupLog = selectedCategory === 'cup_molding_logs'
    const isSheetLog = selectedCategory === 'sheet_forming_logs'
    const isPrintedLog = selectedCategory === 'printed_cups_logs'
    const isCupStock = selectedCategory === 'cups_stock'
    const isPrintedStock = selectedCategory === 'printed_cups_stock'
    const isLog = selectedCategory.includes('logs')

    return (
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', color: '#000' }}>
        <thead style={{ backgroundColor: '#97BC62' }}>
          <tr>
            {isCupLog ? (
              <>
                <th>Timestamp</th>
                <th>Shift</th>
                <th>Operator</th>
                <th>Cavity</th>
                <th>Sheet Used</th>
                <th>Sheet Consumed</th>
                <th>Cups Produced</th>
                <th>Rejected Cups</th>
              </>
            ) : isSheetLog ? (
              <>
                <th>Timestamp</th>
                <th>Shift</th>
                <th>Operator</th>
                <th>Sheet Size</th>
                <th>Thickness</th>
                <th>Primary Material</th>
                <th>Additives</th>
                <th>Gola Scrap (kg)</th>
                <th>Sheet Scrap (kg)</th>
                <th>Usable Sheet (kg)</th>

              </>
            ) : isPrintedLog ? (
              <>
                <th>Timestamp</th>
                <th>Shift</th>
                <th>Operator</th>
                <th>Cup Type</th>
                <th>Cups Produced</th>
                <th>Rejected Cups</th>
                <th>Printing Label</th>
              </>
            ) : isCupStock || isPrintedStock ? (
              <>
                <th>{isPrintedStock ? 'Printed Cup Type' : 'Cup Type'}</th>
                <th>Quantity</th>
                {isPrintedStock && <th>Printing Label</th>}
                <th>Last Updated</th>

              </>
            ) : isLog ? (
              <>
                <th>Timestamp</th>
                <th>Material Type</th>
                <th>Quantity</th>
                <th>Operation</th>
              </>
            ) : (
              <>
                <th>Material Type</th>
                <th>Quantity</th>
                <th>Last Updated</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, i) => (
            <tr key={i}>
              {isCupLog ? (
                <>
                  <td>{safeTimestamp(item.timestamp)}</td>
                  <td>{item.shift || '-'}</td>
                  <td>{item.operator || '-'}</td>
                  <td>{item.cavity || '-'}</td>
                  <td>{item.sheet_used || '-'}</td>
                  <td>{item.sheet_consumed || '-'}</td>
                  <td>{item.cups_produced || '-'}</td>
                  <td>{item.rejected_cups || '-'}</td>
                </>
              ) : isSheetLog ? (
                <>
                  <td>{safeTimestamp(item.timestamp)}</td>
                  <td>{item.shift || '-'}</td>
                  <td>{item.operator || '-'}</td>
                  <td>{item.size || '-'}</td>
                  <td>{item.thickness || '-'}</td>
                  <td>{item.primary_material || '-'}</td>
                  <td>
                    {item.additives
                      ? Object.entries(item.additives).map(([k, v]) => `${k}: ${v}`).join(', ')
                      : '-'}
                  </td>
                  <td>{item.gola_scrap || '-'}</td>
                  <td>{item.sheet_scrap || '-'}</td>
                  <td>{item.sheet_usable || '-'}</td>
                </>
              ) : isPrintedLog ? (
                <>
                  <td>{safeTimestamp(item.timestamp)}</td>
                  <td>{item.shift || '-'}</td>
                  <td>{item.operator || '-'}</td>
                  <td>{item.cup_type || '-'}</td>
                  <td>{item.cups_produced || '-'}</td>
                  <td>{item.rejected_cups || '-'}</td>
                  <td>{item.printing_label || '-'}</td>
                </>
              ) : isCupStock || isPrintedStock ? (
                <>
                  <td>{item.id || '-'}</td>
                  <td>{item.quantity || '-'}</td>
                  {isPrintedStock && <td>{item.printing_label || '-'}</td>}
                  <td>{safeTimestamp(item.last_updated)}</td>

                </>
              ) : isLog ? (
                <>
                  <td>{safeTimestamp(item.timestamp)}</td>
                  <td>{item.material_type || '-'}</td>
                  <td>{item.quantity || '-'}</td>
                  <td>{item.operation || '-'}</td>
                </>
              ) : (
                <>
                  <td>{item.id || '-'}</td>
                  <td>{item.quantity || '-'}</td>
                  <td>{safeTimestamp(item.last_updated)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const sideBarCategories = topTab === 'logs' ? logCategories : inventoryCategories

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Arial' }}>
      {/* Sidebar */}
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
        zIndex: 1000
      }}>
        {sideBarCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={navBtnStyle(selectedCategory === cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main View */}
      <div style={{ marginLeft: '220px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#2C5F2D' }}>
          <div onClick={() => handleTabSwitch('logs')} style={topTabBtnStyle(topTab === 'logs')}>
            Log Entries
          </div>
          <div onClick={() => handleTabSwitch('inventory')} style={topTabBtnStyle(topTab === 'inventory')}>
            Live Inventory
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f5f5f5', padding: '2rem' }}>
          <h2 style={{ color: '#2C5F2D' }}>
            {sideBarCategories.find(cat => cat.id === selectedCategory)?.label}
          </h2>

          {topTab === 'logs' && (
            <Filters
              selectedCategory={selectedCategory}
              onFilterChange={(filters) => setFilterOptions(filters)}
            />
          )}

          {selectedCategory.includes('logs') && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <ExportButton data={filteredData} collectionName={selectedCategory} />
              <PrintButton data={filteredData} selectedCategory={selectedCategory} />
            </div>
          )}

          {renderTable()}
        </div>
      </div>
    </div>
  )
}

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

const navBtnStyle = (isActive) => ({
  backgroundColor: isActive ? '#97BC62' : 'transparent',
  color: isActive ? '#2C5F2D' : 'white',
  border: 'none',
  padding: '15px 20px',
  textAlign: 'left',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
})

export default App
