import { Routes, Route } from 'react-router-dom'
import RoleSelector from './pages/RoleSelector'
import Login from './pages/Login'
import OperatorApp from './OperatorApp/App'
import ManagerApp from './ManagerApp/App'
import ManagerDashboard from './ManagerApp/pages/ManagerDashboard'
import ManagerLogsViewer from './ManagerApp/pages/ManagerLogsViewer'
import LiveInventory from './ManagerApp/pages/LiveInventory'
import EditCavitySpecs from './ManagerApp/pages/EditCavitySpecs'
import { useState } from 'react'

function App() {
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <Routes>
      <Route path="/" element={<RoleSelector />} />
      <Route path="/operator" element={<OperatorApp />} />

      {/* Manager Routes */}
      <Route
        path="/manager/*"
        element={
          authenticated
            ? <ManagerApp />
            : <Login onSuccess={() => setAuthenticated(true)} />
        }
      />
    </Routes>
  )
}

export default App
