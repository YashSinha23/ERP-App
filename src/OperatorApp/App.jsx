import { useState } from 'react'
import Sidebar from './Layout/Sidebar'
import FormWrapper from './Layout/FormWrapper'

function App() {
  const [selectedCategory, setSelectedCategory] = useState('raw_material_form')

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar selected={selectedCategory} onSelect={setSelectedCategory} />
      <FormWrapper selected={selectedCategory} />
    </div>
  )
}

export default App
