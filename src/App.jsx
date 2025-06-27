import { Routes, Route } from 'react-router-dom'
import RoleSelector from './pages/RoleSelector'
import Login from './pages/Login'
import OperatorApp from './OperatorApp/App'
import ManagerApp from './ManagerApp/App'
import { useState } from 'react'

function App() {
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <Routes>
      <Route path="/" element={<RoleSelector />} />
      <Route path="/operator" element={<OperatorApp />} />
      <Route
        path="/manager"
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
