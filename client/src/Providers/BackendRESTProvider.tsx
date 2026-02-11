import { useEffect, useState, createContext, useContext } from 'react';
import type { Player, Room } from '../../../common/Room';


export type BackendRESTContextValue = {
	fetchRooms: () => Promise<Room[]>,
	createRoom: (roomName:string) => Promise<boolean>,
	fetchPlayers: (r:Room) => Promise<Player[]>
}
export const BackendRESTContext = createContext<BackendRESTContextValue>({
	fetchRooms: async () => [],
	createRoom: async () => false,
	fetchPlayers: async () => []
})

export const useBackendREST = () => {
	return useContext(BackendRESTContext)
}
export default ({children}:{children:React.ReactNode}) => {
	const hostname = import.meta.env.VITE_BACKEND_HOSTNAME
	const fetchRooms = async () => {
		const res = await fetch(`http://${hostname}/rest/rooms`)
		return await res.json() as Room[]
	}
	const fetchPlayers = async (room:Room) => {
		const body = JSON.stringify({
			roomName: room.name
		})
		const res = await fetch(`http://${hostname}/rest/players`,{method:'POST', body:body})
		return await res.json() as Player[]
	}
	const createRoom = async (roomName:string) => {
		const newRoom:Room = {name:roomName, players:[]}
		const res = await fetch(`http://${hostname}/rest/rooms`,{
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			body: JSON.stringify(newRoom)
		})
		return res.ok
	}
	return (
		<BackendRESTContext.Provider value={{fetchRooms, createRoom, fetchPlayers}}>
			{children}
		</BackendRESTContext.Provider>
	)
}

type Endpoint = 
	|"get_rooms" 
	|"get_players"