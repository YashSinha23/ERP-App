import { Routes, Route } from 'react-router-dom'
import ManagerDashboard from './pages/ManagerDashboard'
import ManagerLogsViewer from './pages/ManagerLogsViewer'
import EditCavitySpecs from './pages/EditCavitySpecs'
import LiveInventory from './pages/LiveInventory' // If it's separate

function ManagerApp() {
    return (
        <Routes>
            <Route path="/" element={<ManagerDashboard />} />
            <Route path="logs" element={<ManagerLogsViewer initialTab="logs" />} />
            <Route path="inventory" element={<ManagerLogsViewer initialTab="inventory" />} />
            <Route path="cavity" element={<EditCavitySpecs />} />
        </Routes>
    )
}

export default ManagerApp
