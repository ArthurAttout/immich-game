import { WebSocketServer } from 'ws'
import express from 'express'
import {createServer} from 'http'
import type { Request } from "express"
import { json } from 'express'
import { WebSocket } from 'ws'
import cors from 'cors'
import type { KickPayload, NewPlayerPayload, WebsocketRegisterPayload } from "../../common/Datagrams.js"
import type { Room, Player } from '../../common/Room.js'

const roomsWebSockets:WsRoomEntry[] = []

const server = createServer()
const wss = new WebSocketServer({ 
  perMessageDeflate: false,
  server: server
})
const app = express()
app.use(cors<Request>())
app.use(express.json())

app.get('/rest/rooms', json(), (req, res) => {
  const data:Room[] = roomsWebSockets.map<Room>(r => ({
    name: r.roomName,
    players: r.connections.map<Player>(p => ({
      nickname: p.playerName
    }))
  }))
  res.send(JSON.stringify(data))
})

app.post('/rest/rooms/:roomName', (req, res) => {
  const roomName = req.params.roomName
  console.log(`Admin created new room ${roomName}`)
  if(roomsWebSockets.some(r => r.roomName === roomName)){
    res.status(400).send()
  }
  else{
    roomsWebSockets.push({
      connections:[],
      roomName: roomName
    })
    res.status(200).send()
  }
})

app.delete('/rest/rooms/:roomName', (req, res) => {
  const roomName = req.params.roomName
  console.log(`Request to delete room ${roomName}`)
  const roomIndex = roomsWebSockets.findIndex(r => r.roomName === roomName)
  if(roomIndex === -1){
    res.status(400).send()
  }
  else{
    roomsWebSockets.splice(roomIndex, 1)
    res.status(200).send()
  }
})

app.get('/rest/rooms/:roomName/players', (req, res) => {
  const room = req.params.roomName
  res.send(JSON.stringify({
    room:room
  }))
})

app.post('/rest/rooms/:roomName/players', (req, res) => {
  const roomName = req.params.roomName
  const payload = req.body as Player
  const playerName = payload.nickname

  const targetRoom = roomsWebSockets.find(r => r.roomName === roomName)
  if(!targetRoom){
    // Attempted to join unexisting room
    res.status(400).send()
    return
  }
  if(targetRoom.connections.some(c => c.playerName === playerName)){
    // Already in room
    res.status(400).send()
    return
  }
  
  res.status(201).send()
})

app.delete('/rest/rooms/:roomName/players/', (req, res) => {
  const room = req.params.roomName
  const playerName = (req.body as Player).nickname

  console.log(`Request to kick ${playerName} from ${room}`)
  const roomObject = roomsWebSockets.find(r => r.roomName === room)
  if(!roomObject){
    res.status(400).send()
    return
  }
  
  const playerIndex = roomObject.connections.findIndex(c => c.playerName === playerName)
  if(playerIndex === -1){
    res.status(400).send()
    return
  }

  const payload:KickPayload = {
    type:'kick_payload'
  }
  roomObject.connections[playerIndex]?.ws.send(JSON.stringify(payload))

  // Not sure why, but it feels safe to delay the deletion of the websocket a bit, after kicking
  setTimeout(() => roomObject.connections.splice(playerIndex, 1), 2000)

  const newPlayer:NewPlayerPayload = {
      allPlayers: roomObject.connections.map<Player>(c => ({nickname: c.playerName})),
      type:'new_player_payload'
    }
  roomObject.connections.forEach(c => c.ws.send(JSON.stringify(newPlayer)))

  res.status(200).send()
})

wss.on('connection', (ws) => {
  ws.on('error', console.error)

  ws.on('message', (data) => {
    const payload = JSON.parse(data.toString()) as WebsocketRegisterPayload
    if(payload.type !== 'websocket_register_payload'){
      return
    }
    const targetRoom = roomsWebSockets.find(r => r.roomName === payload.roomName)
    const playerName = payload.playerName

    if(!targetRoom){
      // Attempted to join unexisting room
      return
    }
    if(targetRoom.connections.some(c => c.playerName === playerName)){
      // Already in room
      return
    }
    
    targetRoom.connections.push({
      playerName: playerName,
      ws: ws
    })
    console.log(`Registered player websocket for <${playerName}> in room ${targetRoom.roomName} (${targetRoom.connections.length} in room)`)

    const newPlayer:NewPlayerPayload = {
      allPlayers: targetRoom.connections.map<Player>(c => ({nickname: c.playerName})),
      type:'new_player_payload'
    }
    targetRoom.connections.forEach(c => c.ws.send(JSON.stringify(newPlayer)))
  })

  ws.on('close', () => {
    for(const room of roomsWebSockets){
      const idx = room.connections.findIndex(p => p.ws === ws)
      if(idx !== -1){
        console.log(`Remove ${room.connections[idx]?.playerName} from room ${room.roomName}`)
        room.connections.splice(idx, 1)
      }
    }
  })
})
server.on('request', app)
server.listen(8080)

console.log("Server listening on port 8080")

type WsRoomEntry = {
  roomName:string,
  connections:WsPlayerEntry[]
}

type WsPlayerEntry = {
  ws: WebSocket,
  playerName: string
}