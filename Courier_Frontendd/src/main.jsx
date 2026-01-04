import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AddCostumer from './components/AddCustomer.jsx'
import AddMode from './components/AddMode.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AddCostumer />
  </StrictMode>,
)
