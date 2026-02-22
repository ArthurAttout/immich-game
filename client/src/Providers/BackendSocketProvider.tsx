import { useEffect, useState, createContext, useContext } from 'react';
import type { Player, Room } from '../../../common/Room';
import type { WebsocketPayload, WebsocketRegisterPayload, KickPayload } from "../../../common/Datagrams";


export type BackendSocketContextValue = {
	ws:	WebSocket|null, 
	listenToNewPlayerEvent: (cb:(p:Player[]) => void) => void,
	listenToKickPlayerEvent: (cb:() => void) => void,
	registerWebsocket: (room:string, player:string) => void,
	unlisten: () => void
}
export const BackendSocketContext = createContext<BackendSocketContextValue>({
	ws:null, 
	listenToNewPlayerEvent: () => null,
	listenToKickPlayerEvent: () => null,
	registerWebsocket: () => null,
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

	const listenToKickPlayerEvent = (cb:() => void) => {
		addEventListener((msg) => {
			const data = JSON.parse(msg.data) as KickPayload
			if(data.type === 'kick_payload'){
				cb()
			}
		})
	}

	const registerWebsocket = (room:string, player:string) => {
		const payload:WebsocketRegisterPayload = {
			playerName: player,
			roomName: room,
			type: 'websocket_register_payload'
		}
		ws?.send(JSON.stringify(payload))
	}

	const unlisten = () => {
		for(const listener of listeners){
			ws?.removeEventListener('message', listener)
		}
	}
	return (
		<BackendSocketContext.Provider value={{ws, 
			listenToNewPlayerEvent, 
			listenToKickPlayerEvent,
			registerWebsocket,
			unlisten
		}}>
			{children}
		</BackendSocketContext.Provider>
	)
}