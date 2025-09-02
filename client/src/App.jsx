import { useState } from 'react'
import {Routes,Route,Link} from "react-router-dom";import { useAuth } from './Context/AuthContext';
import './App.css'
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import AddEditDoc from './components/AddEditDoc';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const { user, logout } = useAuth();

  return (
    <>
    
       <div>
      <nav className='flex px-[12px] py-[12px] border border-b-[1px] boder-[#ddd] gap-8' >
        <Link to="/">Dashboard</Link>
        <Link to="/search">Search</Link>
        <Link to="/add">Add Doc</Link>
        {!user ? <><Link to="/login">Login</Link><Link to="/register">Register</Link></> : <button onClick={logout}>Logout</button>}
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/add" element={<AddEditDoc/>} />
        <Route path="/edit/:id" element={<AddEditDoc/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </div>
    </>
  )
}

export default App
