import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Task from './page/Task'

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Task />} />
            </Routes>
        </>
    )
}

export default App
