import './App.css'
import { useEffect, useState } from 'react';
import { useBackendREST } from './Providers/BackendRESTProvider';
import type { Player, Room } from '../../common/Room';
import { Box, Button, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';


function AdminScreen() {
  
  const {fetchRooms, createRoom} = useBackendREST()
  const [allRooms, setAllRooms] = useState<Room[]>([])
  const {t} = useTranslation()
  const [roomName, setRoomName] = useState('')
  const [roomCreationError, setRoomCreationError] = useState<boolean>(false)

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

  const clickCreateRoom = async () => {
    const success = await createRoom(roomName)
    setRoomCreationError(!success)
    fetchRooms().then(setAllRooms).catch(console.error)
  }
  
  return (
    <Box style={{width:'20em', gap:'1em', display:'flex', flexDirection:'column', textAlign:'left'}}>
      <Box style={{border:'1px solid gray', padding:'1em'}}>
        <p>{t('Open rooms')}</p>
        <ul>
        {
          allRooms.length === 0 && <p>{t('Empty as fuck here.')}</p>
        }
        {
          allRooms.length > 0 && allRooms.map(renderRoom)
        }
        </ul>
        </Box>
      <Box style={{display:'flex', flexDirection:'column', gap:'1em'}}>
        <TextInput placeholder={t('Room Name')} error={roomCreationError} value={roomName} onChange={(e) => setRoomName(e.target.value)}/>
        <Button onClick={clickCreateRoom}>{t('Create new room')}</Button>
      </Box>
    </Box>
  )
}

export default AdminScreen
