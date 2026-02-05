import { useEffect, useState } from 'react'
import './App.css'
import { useBackendSocket } from './Providers/BackendSocketProvider'
import type { Player } from './domain/Room'
import { Box, Button, TextInput } from '@mantine/core'
import { useTranslation } from 'react-i18next';

function PlayerScreen() {
  
  const { listenToNewPlayerEvent, joinRoom} = useBackendSocket()
  const [players, setPlayers] = useState<Player[]>([])
  const [roomName, setRoomName] = useState('')
  const {t} = useTranslation()

  useEffect(() => {
    listenToNewPlayerEvent(newP => setPlayers(p => [...p, newP]))
  },[])

  const join = () => {
    joinRoom(roomName)
  }
  return (
    <Box style={{
        display:'flex', 
        flexDirection:'column', 
        alignItems:'center',
      }}>
        <Box style={{gap:'1em', width:'14em', display:'flex', flexDirection:'column'}}>
          <TextInput placeholder={t('Room Name')} value={roomName} onChange={(e) => setRoomName(e.target.value)}/>
          <Button disabled={roomName.length === 0} variant="filled" color="orange" onClick={join}>Join</Button>
        </Box>
    </Box>
  )
}

export default PlayerScreen
