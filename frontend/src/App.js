import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/purple-theme.css';

import PrivateRoute  from './components/common/PrivateRoute';
import MainLayout    from './components/layout/MainLayout';
import Login         from './pages/auth/Login';
import Dashboard     from './pages/dashboard/Dashboard';
import StateList     from './pages/states/StateList';
import StateFormPage from './pages/states/StateFormPage';
import CityList      from './pages/cities/CityList';
import CityFormPage  from './pages/cities/CityFormPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard"        element={<Dashboard />} />
              <Route path="/states"           element={<StateList />} />
              <Route path="/states/create"    element={<StateFormPage />} />
              <Route path="/states/:id/edit"  element={<StateFormPage />} />
              <Route path="/cities"           element={<CityList />} />
              <Route path="/cities/create"    element={<CityFormPage />} />
              <Route path="/cities/:id/edit"  element={<CityFormPage />} />
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
