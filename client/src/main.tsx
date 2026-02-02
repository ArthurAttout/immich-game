import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import AdminScreen from './AdminScreen';
import PlayerScreen from './PlayerScreen';
import TvScreen from './TvScreen';
import BackendSocketProvider from './Providers/BackendSocketProvider';
import BackendRESTProvider from './Providers/BackendRESTProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BackendSocketProvider>
      <BackendRESTProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/player" element={<PlayerScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="/tv" element={<TvScreen />} />
          </Routes>
        </BrowserRouter>
      </BackendRESTProvider>
    </BackendSocketProvider>
  </StrictMode>
)
