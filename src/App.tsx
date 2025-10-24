// ✅ src/App.tsx - VERSIÓN CORREGIDA

import { AuthProvider } from '@core/contexts/AuthContext';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;