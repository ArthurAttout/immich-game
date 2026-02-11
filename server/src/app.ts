import { WebSocketServer } from 'ws'
import express from 'express'
import {createServer} from 'http'
import type { Request } from "express"
import { json } from 'express'
import { WebSocket } from 'ws'
import cors from 'cors'
import type {JoinRoomPayload, WelcomePayload, NewPlayerPayload} from "../../common/Datagrams.js"
import type { Room, Player } from '../../common/Room.js'
import { generateUsername } from "unique-username-generator";

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

app.post('/rest/rooms', (req, res) => {
  const data = req.body as Room 
  console.log(`Admin created new room ${data.name}`)
  if(roomsWebSockets.some(r => r.roomName === data.name)){
    res.status(400).send()
  }
  else{
    roomsWebSockets.push({
      connections:[],
      roomName: data.name
    })
    res.status(200).send()
  }
})

app.post('/rest/players', (req, res) => {
  const room = req.body.room
  res.send(JSON.stringify({
    room:room
  }))
})

wss.on('connection', (ws) => {
  ws.on('error', console.error)

  ws.on('message', (data) => {
    const payload = JSON.parse(data.toString()) as JoinRoomPayload
    const targetRoom = roomsWebSockets.find(r => r.roomName === payload.roomName)
    if(!targetRoom){
      // Attempted to join unexisting room
      return
    }
    if(targetRoom.connections.some(c => c.ws === ws)){
      // Already in room
      return
    }
    const name = generateUsername(' ')
    targetRoom.connections.push({
      playerName: name,
      ws: ws
    })
    console.log(`Welcoming new player <${name}> in room ${targetRoom.roomName} (${targetRoom.connections.length} in room)`)
    const welcome:WelcomePayload = {
      player:{ nickname: name },
      type:'welcome_payload'
    }
    const newPlayer:NewPlayerPayload = {
      allPlayers: targetRoom.connections.map<Player>(c => ({nickname: c.playerName})),
      type:'new_player_payload'
    }
    ws.send(JSON.stringify(welcome))
    targetRoom.connections.forEach(w => w.ws.send(JSON.stringify(newPlayer)))
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