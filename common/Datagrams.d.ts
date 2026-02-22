import type { Player, Room } from "./Room"

export type WebsocketPayload = 
	| NewPlayerPayload
	| WebsocketRegisterPayload
	| KickPayload


export type NewPlayerPayload = {
	type:'new_player_payload',
	allPlayers: Player[]
}
export type WebsocketRegisterPayload = {
	type:'websocket_register_payload',
	playerName: string,
	roomName: string
}

export type KickPayload = {
	type:'kick_payload'
}