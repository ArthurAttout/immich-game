import './App.css'
import { useEffect, useState } from 'react';
import { useBackendREST } from './Providers/BackendRESTProvider';
import type { Player, Room } from './domain/Room';
import { Box } from '@mantine/core';


function AdminScreen() {
  
  const {fetchRooms} = useBackendREST()
  const [allRooms, setAllRooms] = useState<Room[]>([])


  useEffect(() => {
    fetchRooms().then(setAllRooms).catch(console.error)
  },[])

  const renderRoom = (r:Room) => {
    return (
      <li key={r.name}>
        {r.name}
        <ul>
          {r.players.map(renderPlayer)}
        </ul>
      </li>
    )
  }

  const renderPlayer = (p:Player) => {
    return (
      <li key={p.nickname}>{p.nickname}</li>
    )
  }
  
  return (
    <Box style={{width:'20em', height:'20em', display:'flex', border:'1px solid gray', flexDirection:'column', textAlign:'left'}}>
      <p>Rooms</p>
      <ul>
      {
        allRooms.map(renderRoom)
      }
      </ul>
    </Box>
  )
}

export default AdminScreen
