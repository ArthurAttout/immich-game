import type { Player, Room } from "./Room"

export type WebsocketPayload = 
	| NewPlayerPayload
	| JoinRoomPayload
	| WelcomePayload


export type NewPlayerPayload = {
	type:'new_player_payload',
	allPlayers: Player[]
}
export type WelcomePayload = {
	type:'welcome_payload',
	player: Player
}
export type JoinRoomPayload = {
	type:'join_room_payload',
	roomName: string,
}
