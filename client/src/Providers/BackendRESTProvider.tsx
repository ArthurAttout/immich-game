import { useEffect, useState, createContext, useContext } from 'react';
import type { Player, Room } from '../domain/Room';


export type BackendRESTContextValue = {
	fetchRooms: () => Promise<Room[]>,
	fetchPlayers: (r:Room) => Promise<Player[]>
}
export const BackendRESTContext = createContext<BackendRESTContextValue>({
	fetchRooms: async () => [],
	fetchPlayers: async () => []
})

export const useBackendREST = () => {
	return useContext(BackendRESTContext)
}
export default ({children}:{children:React.ReactNode}) => {
	const hostname = import.meta.env.VITE_BACKEND_HOSTNAME
	const fetchRooms = async () => {
		console.log('ah')
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
	return (
		<BackendRESTContext.Provider value={{fetchRooms, fetchPlayers}}>
			{children}
		</BackendRESTContext.Provider>
	)
}

type Endpoint = 
	|"get_rooms" 
	|"get_players"