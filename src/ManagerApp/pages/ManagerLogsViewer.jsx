import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebaseConfig'
import { collection, getDocs, query, orderBy } from 'firebase/firestore' // ✅ Add query, orderBy

import Filters from '../components/Filters'
import RawMaterialLogsTable from '../components/tables/RawMaterialLogsTable'
import SheetFormingLogsTable from '../components/tables/SheetFormingLogsTable'
import CupMoldingLogsTable from '../components/tables/CupMoldingLogsTable'
import PrintedCupsLogsTable from '../components/tables/PrintedCupsLogsTable'
import ExportButton from '../components/ExportButton'
import PrintButton from '../components/PrintButton'
import Sidebar from '../components/Sidebar'
import TopTabBar from '../components/TopTabBar'
import RawMaterialInventoryTable from '../components/tables/RawMaterialInventoryTable'
import SheetInventoryTable from '../components/tables/SheetInventoryTable'
import CupsInventoryTable from '../components/tables/CupsInventoryTable'
import PrintedCupsInventoryTable from '../components/tables/PrintedCupsInventoryTable'


function ManagerLogsViewer({ initialTab = 'logs' }) {
  const [topTab, setTopTab] = useState(initialTab)
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
        const colRef = collection(db, selectedCategory)

        // ✅ Only apply orderBy if the collection contains logs
        const isLog = selectedCategory.includes('logs')
        const q = isLog
          ? query(colRef, orderBy('timestamp', 'desc')) // 'desc' = latest first
          : colRef

        const snapshot = await getDocs(q)
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
    if (filteredData.length === 0) return <p style={{ color: '#000' }}>📭 No data available.</p>

    switch (selectedCategory) {
      case 'raw_material_logs':
        return <RawMaterialLogsTable data={filteredData} safeTimestamp={safeTimestamp} />
      case 'sheet_forming_logs':
        return <SheetFormingLogsTable data={filteredData} safeTimestamp={safeTimestamp} />
      case 'cup_molding_logs':
        return <CupMoldingLogsTable data={filteredData} safeTimestamp={safeTimestamp} />
      case 'printed_cups_logs':
        return <PrintedCupsLogsTable data={filteredData} safeTimestamp={safeTimestamp} />
      case 'raw_material_stock':
        return <RawMaterialInventoryTable data={filteredData} safeTimestamp={safeTimestamp} />
      case 'sheet_stock':
        return <SheetInventoryTable data={filteredData} safeTimestamp={safeTimestamp} />
      case 'cups_stock':
        return <CupsInventoryTable data={filteredData} safeTimestamp={safeTimestamp} />
      case 'printed_cups_stock':
        return <PrintedCupsInventoryTable data={filteredData} safeTimestamp={safeTimestamp} />
      default:
        return <p style={{ color: '#000' }}>🔧 Coming soon...</p>
    }
  }



  const sideBarCategories = topTab === 'logs' ? logCategories : inventoryCategories

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Arial' }}>
      {/* Sidebar */}
      <Sidebar
        topTab={topTab}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />


      {/* Main View */}
      <div style={{ marginLeft: '220px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Tabs */}
        <TopTabBar topTab={topTab} onTabSwitch={handleTabSwitch} />


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

export default ManagerLogsViewer