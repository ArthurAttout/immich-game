import { useEffect, useState, createContext, useContext } from 'react';
import type { Player, Room } from '../domain/Room';
import type { JoinRoomPayload, WebsocketPayload } from '../domain/Datagrams';


export type BackendSocketContextValue = {
	ws:	WebSocket|null, 
	listenToNewPlayerEvent: (cb:(p:Player) => void) => void,
	joinRoom: (roomName:string) => void
}
export const BackendSocketContext = createContext<BackendSocketContextValue>({
	ws:null, 
	listenToNewPlayerEvent: () => null,
	joinRoom: () => {}
})

export const useBackendSocket = () => {
	return useContext(BackendSocketContext)
}
export default ({children}:{children:React.ReactNode}) => {
	const hostname = import.meta.env.VITE_BACKEND_HOSTNAME
  	const [ws, setWebsocket] = useState<WebSocket|null>(null)

	useEffect(() => {
		const ws = new WebSocket(`ws://${hostname}`);
		ws.addEventListener('open', () => {
			console.log('Connected to backend')
		});
		setWebsocket(ws)
	},[])

	const listenToNewPlayerEvent = (cb:(p:Player) => void) => {
		ws?.addEventListener('message', (msg) => {
			const data = JSON.parse(msg.data) as WebsocketPayload
			if(data.type === 'new_player_payload'){
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
	return (
		<BackendSocketContext.Provider value={{ws, listenToNewPlayerEvent, joinRoom}}>
			{children}
		</BackendSocketContext.Provider>
	)
}