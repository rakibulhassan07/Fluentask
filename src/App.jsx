import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Pages/Shared/Navbar/Navbar'
import HomePage from './HomePage/HomePage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<div className="pt-20 p-8"><h1>Menu Page</h1></div>} />
          <Route path="/contact" element={<div className="pt-20 p-8"><h1>Contact Page</h1></div>} />
          <Route path="/login" element={<div className="pt-20 p-8"><h1>Login Page</h1></div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App