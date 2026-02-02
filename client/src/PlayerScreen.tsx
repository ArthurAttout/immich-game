import { useEffect, useState } from 'react'
import './App.css'
import { useBackendSocket } from './Providers/BackendSocketProvider'
import type { Player } from './domain/Room'


function PlayerScreen() {
  
  const { listenToNewPlayerEvent } = useBackendSocket()
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    listenToNewPlayerEvent(newP => setPlayers(p => [...p, newP]))
  },[])
  return (
    <div>
      I am the player
    </div>
  )
}

export default PlayerScreen
