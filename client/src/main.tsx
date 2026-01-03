import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import AdminScreen from './AdminScreen';
import PlayerScreen from './PlayerScreen';
import TvScreen from './TvScreen';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
       <Route path="/player" element={<PlayerScreen />} />
       <Route path="/admin" element={<AdminScreen />} />
       <Route path="/tv" element={<TvScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
