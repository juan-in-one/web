import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Retos from './pages/Retos'
import Coche from './pages/Coche'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coche" element={<Coche />} />
        <Route path="/retos" element={<Retos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
