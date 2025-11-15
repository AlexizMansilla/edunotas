import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx '
import SistemaNotasEscolar from './app.jsx'


import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
        <SistemaNotasEscolar />
    </React.StrictMode>,
)