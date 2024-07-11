import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Task from './page/Task'
import AuthGuard from './middleware/AuthGuard'
import NotFound from './page/NotFound'
import Login from './page/Login'
import Register from './page/Resgister'

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<AuthGuard />}>
                    <Route path="/" element={<Task />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}

export default App
