import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/public/Home.tsx';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        {}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
