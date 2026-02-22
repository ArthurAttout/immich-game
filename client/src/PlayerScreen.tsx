import { useEffect, useState } from 'react'
import './App.css'
import { useBackendSocket } from './Providers/BackendSocketProvider'
import type { Player } from '../../common/Room'
import { Box, Button, TextInput, ActionIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next';
import "animate.css"
import { useBackendREST } from './Providers/BackendRESTProvider'
import { generateUsername } from "unique-username-generator";
import { FaDice } from "react-icons/fa6";

function PlayerScreen() {
  
  const { 
    listenToNewPlayerEvent,
    listenToKickPlayerEvent,
    registerWebsocket,
    unlisten, ws
  } = useBackendSocket()

  const {
    joinRoom
  } = useBackendREST()

  const [players, setPlayers] = useState<Player[]>([])
  const [localPlayerName, setLocalPlayerName] = useState<string>('')
  const [roomName, setRoomName] = useState<string>('')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [isInRoom, setIsInRoom] = useState(false)
  const {t} = useTranslation()

  const generateName = () => setLocalPlayerName(generateUsername(' '))

  useEffect(() => {
    listenToKickPlayerEvent(handleKick)
    listenToNewPlayerEvent(allPlayers => setPlayers(allPlayers))
    
    return unlisten
  },[ws])

  useEffect(generateName, [])

  const join = async () => {
    if(roomName && localPlayerName){
      const ok = await joinRoom(roomName, localPlayerName)
      if(!ok){
        return
      }
      setIsInRoom(true)
      registerWebsocket(roomName, localPlayerName)
    }
  }

  const handleKick = () => {
    // Player got kicked. Boo-hoo. 
    setLocalPlayerName('')
    setRoomName('')
    setPlayers([])
    setIsInRoom(false)
    setStatusMessage(t('You have been kicked of the room. Pack up your shit and fuck off.'))
    setTimeout(() => setStatusMessage(''), 5000)
  }

  const renderRoom = () => {
    return (
      <Box>
        <ul>
          { players.map(p => <li className="animate__animated animate__zoomInUp" key={p.nickname}>{p.nickname}</li>)}
        </ul>
      </Box>
    )
  }

  const renderBox = () => {
    if(!isInRoom){
      return (
        <>
          <Box style={{display:'flex', flexDirection:'row', gap:'.5em', alignItems:'center'}}>
            <TextInput placeholder={t('Player Name')} value={localPlayerName} onChange={(e) => setLocalPlayerName(e.target.value)}/>
            <ActionIcon onClick={generateName}>
              <FaDice/>
            </ActionIcon>
          </Box>
          <TextInput placeholder={t('Room Name')} value={roomName} onChange={(e) => setRoomName(e.target.value)}/>
          <Button disabled={roomName?.length === 0} variant="filled" color="orange" onClick={join}>Join</Button>
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
          { renderBox() }
        </Box>
        <p style={{color:'red'}}>{statusMessage}</p>
    </Box>
  )
}

export default PlayerScreen
