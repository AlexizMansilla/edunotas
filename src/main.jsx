import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import SistemaNotasEscolar from './app.jsx' // Assuming this is also a top-level component, if not, consider removing or integrating into App


import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Component names must start with an uppercase letter */}
        <App />
        {/* If SistemaNotasEscolar is a separate component also to be rendered */}
        <SistemaNotasEscolar />
    </React.StrictMode>,
)
