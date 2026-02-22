import { useEffect, useState, createContext, useContext } from 'react';
import type { Player, Room } from '../../../common/Room';


export type BackendRESTContextValue = {
	fetchRooms: () => Promise<Room[]>,
	joinRoom:(room:string, player:string) => Promise<boolean>,
	createRoom: (roomName:string) => Promise<boolean>,
	
	fetchPlayers: (r:Room) => Promise<Player[]>,
	kickPlayer: (r:Room, p:Player) => Promise<boolean>,
}
export const BackendRESTContext = createContext<BackendRESTContextValue>({
	fetchRooms: async () => [],
	createRoom: async () => false,
	fetchPlayers: async () => [],
	joinRoom: async () => false,
	kickPlayer: async () => false,
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
		const res = await fetch(`http://${hostname}/rest/rooms/${room.name}/players`)
		return await res.json() as Player[]
	}

	const joinRoom = async (room:string, playerName:string) => {
		const payload = {
			nickname: playerName
		} as Player
		
		const res = await fetch(`http://${hostname}/rest/rooms/${room}/players`, {
			method:'POST',
			body: JSON.stringify(payload),
			headers:{
				'Content-Type':'application/json'
			}
		})
		return res.ok
	}

	const kickPlayer = async (room:Room, player:Player) => {
		const payload = {
			nickname: player.nickname
		} as Player

		const res = await fetch(`http://${hostname}/rest/rooms/${room.name}/players/`, {
			method:'DELETE',
			body: JSON.stringify(payload),
			headers:{
				'Content-Type':'application/json'
			}
		})
		return res.ok
	}

	const createRoom = async (roomName:string) => {	
		const res = await fetch(`http://${hostname}/rest/rooms/${roomName}`,{method:'POST'})
		return res.ok
	}
	return (
		<BackendRESTContext.Provider value={{fetchRooms, createRoom, fetchPlayers, joinRoom, kickPlayer}}>
			{children}
		</BackendRESTContext.Provider>
	)
}
