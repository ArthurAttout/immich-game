import type { Player, Room } from "./Room"

export type WebsocketPayload = 
	| NewPlayerPayload
	| JoinRoomPayload


export type NewPlayerPayload = {
	type:'new_player_payload',
	player: Player
}
export type JoinRoomPayload = {
	type:'join_room_payload',
	roomName: string,
}
