import { useEffect, useState, createContext, useContext } from 'react';
import type { Player, Room } from '../../../common/Room';
import type { JoinRoomPayload, WebsocketPayload } from "../../../common/Datagrams";


export type BackendSocketContextValue = {
	ws:	WebSocket|null, 
	listenToNewPlayerEvent: (cb:(p:Player[]) => void) => void,
	listenToWelcomeEvent: (cb:(p:Player) => void) => void,
	joinRoom: (roomName:string) => void
	unlisten: () => void
}
export const BackendSocketContext = createContext<BackendSocketContextValue>({
	ws:null, 
	listenToNewPlayerEvent: () => null,
	listenToWelcomeEvent: () => null,
	joinRoom: () => {},
	unlisten: () => {}
})

export const useBackendSocket = () => {
	return useContext(BackendSocketContext)
}

export default ({children}:{children:React.ReactNode}) => {
	const hostname = import.meta.env.VITE_BACKEND_HOSTNAME
  	const [ws, setWebsocket] = useState<WebSocket|null>(null)
	const [listeners, setListeners] = useState<any[]>([])
	
	useEffect(() => {
		const ws = new WebSocket(`ws://${hostname}`)
		ws.addEventListener('open', () => {
			console.log('Connected to backend')
		})
		setWebsocket(ws)
	},[])

	const addEventListener = (listener: (msg: MessageEvent<any>) => void) => {
		ws?.addEventListener('message', listener)
		setListeners(li => [...li, listener])
	}

	const listenToNewPlayerEvent = (cb:(p:Player[]) => void) => {
		addEventListener((msg) => {
			const data = JSON.parse(msg.data) as WebsocketPayload
			if(data.type === 'new_player_payload'){
				cb(data.allPlayers)
			}
		})
	}
	const listenToWelcomeEvent = (cb:(p:Player) => void) => {
		addEventListener((msg) => {
			console.log(msg.data)
			const data = JSON.parse(msg.data) as WebsocketPayload
			if(data.type === 'welcome_payload'){
				cb(data.player)
			}
		})
	}
	const joinRoom = (room:string) => {
		const joinRoom:JoinRoomPayload = {
			roomName: room,
			type: 'join_room_payload'
		}
		ws?.send(JSON.stringify(joinRoom))
	}
	const unlisten = () => {
		for(const listener of listeners){
			ws?.removeEventListener('message', listener)
		}
	}
	return (
		<BackendSocketContext.Provider value={{ws, listenToNewPlayerEvent, listenToWelcomeEvent,unlisten,joinRoom }}>
			{children}
		</BackendSocketContext.Provider>
	)
}