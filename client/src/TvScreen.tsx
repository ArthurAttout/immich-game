import './App.css'
import { useEffect, useState } from 'react';


function TvScreen() {
  const hostname = import.meta.env.VITE_BACKEND_HOSTNAME
  const [websocket, setWebsocket] = useState<WebSocket|null>(null)


  useEffect(() => {
    const ws = new WebSocket(`ws://${hostname}`);
    ws.addEventListener('open', () => {
      console.log('Connected to backend')
      console.log(websocket)
    });
    setWebsocket(ws)
  },[])
  
  return (
    <div>I am the TV</div>
  )
}

export default TvScreen
