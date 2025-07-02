import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import RawMaterialInventoryTable from '../components/tables/RawMaterialInventoryTable'
import SheetInventoryTable from '../components/tables/SheetInventoryTable'
import CupsInventoryTable from '../components/tables/CupsInventoryTable'
import PrintedCupsInventoryTable from '../components/tables/PrintedCupsInventoryTable'
import BackButton from '../../BackButton'

const LiveInventory = () => {
    const [selectedCategory, setSelectedCategory] = useState('raw_material_stock')

    const renderTable = () => {
        switch (selectedCategory) {
            case 'raw_material_stock':
                return <RawMaterialInventoryTable />
            case 'sheet_stock':
                return <SheetInventoryTable />
            case 'cups_stock':
                return <CupsInventoryTable />
            case 'printed_cups_stock':
                return <PrintedCupsInventoryTable />
            default:
                return <p style={{ padding: '2rem' }}>📭 No category selected.</p>
        }
    }

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F2F5F1' }}>
            <Sidebar
                topTab="inventory"
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <h2 style={{ color: '#2C5F2D', marginBottom: '1rem' }}>
                    📦 Live Inventory
                </h2>
                {renderTable()}
                <div style={{ marginTop: '2rem' }}>
                    <BackButton />
                </div>
            </div>
        </div>
    )
}

export default LiveInventory
