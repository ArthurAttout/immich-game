import { useEffect, useState } from 'react'
import './App.css'
import { useBackendSocket } from './Providers/BackendSocketProvider'
import type { Player } from '../../common/Room'
import { Box, Button, TextInput } from '@mantine/core'
import { useTranslation } from 'react-i18next';

function PlayerScreen() {
  
  const { listenToNewPlayerEvent, joinRoom, listenToWelcomeEvent, unlisten, ws} = useBackendSocket()
  const [players, setPlayers] = useState<Player[]>([])
  const [localPlayerName, setLocalPlayerName] = useState<undefined|string>(undefined)
  const [roomName, setRoomName] = useState('')
  const {t} = useTranslation()

  const playerRegistered = localPlayerName !== undefined

  useEffect(() => {
    listenToNewPlayerEvent(allPlayers => setPlayers(allPlayers))
    listenToWelcomeEvent(me => {
      setLocalPlayerName(me.nickname)
    })
    return unlisten
  },[ws])

  const join = () => {
    joinRoom(roomName)
  }

  const renderRoom = () => {
    return (
      <Box>
        <ul>
          { players.map(p => <li key={p.nickname}>{p.nickname}</li>)}
        </ul>
      </Box>
    )
  }

  const renderBox = () => {
    if(!playerRegistered){
      return (
        <>
          <TextInput placeholder={t('Room Name')} value={roomName} onChange={(e) => setRoomName(e.target.value)}/>
          <Button disabled={roomName.length === 0} variant="filled" color="orange" onClick={join}>Join</Button>
        </>
      )
    }
    return(
      <Box>
        <Box style={{display:'flex', gap:'.5em', width:'30em', flexDirection:'row'}}>
          <p>{t('Welcome, ')}</p>
          <p><strong>{localPlayerName}</strong></p>
        </Box>
        {
          players.length === 0 && <p>{t('Currently, you are alone in the room ...')}</p>
        }
        {
          players.length > 0 && renderRoom()
        }
      </Box>
    )
  }
  return (
    <Box style={{
        display:'flex', 
        flexDirection:'column', 
        alignItems:'center',
      }}>
        <Box style={{gap:'1em', width:'14em', display:'flex', flexDirection:'column'}}>
          { renderBox()}
        </Box>
    </Box>
  )
}

export default PlayerScreen
