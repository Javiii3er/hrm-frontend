// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@core/contexts/AuthContext'
import AppRoutes from './AppRoutes.tsx'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>

          <Route path="/*" element={<AppRoutes />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App