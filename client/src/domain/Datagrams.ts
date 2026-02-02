import type { Player, Room } from "./Room"

export type WebsocketPayload = 
	| NewPlayerPayload


export type NewPlayerPayload = {
	type:'new_player_payload',
	player: Player
}
