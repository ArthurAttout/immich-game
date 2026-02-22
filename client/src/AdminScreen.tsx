import './App.css'
import { useEffect, useState } from 'react';
import { useBackendREST } from './Providers/BackendRESTProvider';
import type { Player, Room } from '../../common/Room';
import { Box, Button, TextInput, ActionIcon, Tooltip, Paper } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaRegTrashCan, FaCircleXmark } from "react-icons/fa6";

function AdminScreen() {
  
  const {fetchRooms, createRoom, kickPlayer} = useBackendREST()
  const [allRooms, setAllRooms] = useState<Room[]>([])
  const {t} = useTranslation()
  const [roomName, setRoomName] = useState('')
  const [roomCreationError, setRoomCreationError] = useState<boolean>(false)

  const refreshRoomsList = async () => {
    const rooms = await fetchRooms()
    setAllRooms(rooms)
  }

  useEffect(() => {
    refreshRoomsList().catch(console.error)
  },[])

  useEffect(() => {
    const id = setInterval(refreshRoomsList, 1000)
    return () => clearInterval(id)
  })

  const renderRoom = (r:Room) => {
    return (
      <Paper key={r.name} style={{padding:'1.5em'}} shadow='lg' withBorder radius='lg'>
        <li>
          <b>{r.name}</b>
          <ul>
            {r.players.map((p) => renderPlayer(r,p))}
          </ul>
        </li>
        <Box style={{display:'flex', flexDirection:'column', gap:'1em', marginTop:'2em'}}>
          <b>{t('Actions')}</b>
          <Box style={{display:'flex', flexDirection:'row', gap:'1em'}}>
            <Tooltip label={t('Start Game')}>
              <ActionIcon>
                <FaCheck/>
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t('Delete Room')}>
              <ActionIcon color='red'>
                <FaRegTrashCan/>
              </ActionIcon>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    )
  }

  const renderPlayer = (r:Room, p:Player) => {
    return (
      <li key={p.nickname}>
        <Box style={{display:'flex', marginTop:'.5em', width:'15em', justifyContent:'space-between', flexDirection:'row'}}>
          {p.nickname}
          <Tooltip label={t('Kick Player')}>
            <ActionIcon onClick={() => kickPlayer(r,p)}>
              <FaCircleXmark/>
            </ActionIcon>
          </Tooltip>
        </Box>
      </li>
    )
  }

  const clickCreateRoom = async () => {
    const success = await createRoom(roomName)
    setRoomCreationError(!success)
    fetchRooms().then(setAllRooms).catch(console.error)
  }
  
  return (
    <Box style={{gap:'1em', display:'flex', flexDirection:'column', textAlign:'left'}}>
      <Box>
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
      <Box style={{width:'20em',display:'flex', flexDirection:'column', gap:'1em'}}>
        <TextInput placeholder={t('Room Name')} error={roomCreationError} value={roomName} onChange={(e) => setRoomName(e.target.value)}/>
        <Button onClick={clickCreateRoom}>{t('Create new room')}</Button>
      </Box>
    </Box>
  )
}

export default AdminScreen
