import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import AdminScreen from './AdminScreen';
import PlayerScreen from './PlayerScreen';
import TvScreen from './TvScreen';
import BackendSocketProvider from './Providers/BackendSocketProvider';
import BackendRESTProvider from './Providers/BackendRESTProvider';
import '@mantine/core/styles.css';
import i18next from 'i18next';
import { MantineProvider, createTheme, Box } from '@mantine/core';

i18next.init({
  lng: 'en',
  debug: true,
})

const theme = createTheme({
  primaryColor:'orange',
  fontFamily: 'Open Sans, sans-serif',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme='dark' theme={theme}>
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
    </MantineProvider>
  </StrictMode>
)
