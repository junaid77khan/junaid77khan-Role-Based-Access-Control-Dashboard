
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/roles" 
          element={
            <PrivateRoute>
              <Roles />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/permissions" 
          element={
            <PrivateRoute>
              <Permissions />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
