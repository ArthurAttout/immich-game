import { WebSocketServer } from 'ws';
import express from 'express'
import {createServer} from 'http'
import type { Request } from "express";
import cors from 'cors'

const server = createServer()
const wss = new WebSocketServer({ 
  perMessageDeflate: false,
  server: server
});
const app = express()
app.use(cors<Request>())
app.use(express.json())

app.get('/rest/rooms', (req, res) => {
  res.send(JSON.stringify([
    {name:'Room 1', players:[{
      nickname:'Tweedle Dee'
    },{
      nickname:'Tweedle Dumb'
    }]},
    {name:'Room 2', players:[{
      nickname:'Ron Swanson'
    },{
      nickname:'Dwight Shcrute'
    }]}
  ]))
})

app.post('/rest/players', (req, res) => {
  const room = req.body.room
  res.send(JSON.stringify({
    room:room
  }))
})

const roomsWebSockets:WsRoomEntry[] = []

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    
  });

  ws.send('something');
});
server.on('request', app)
server.listen(8080)

console.log("Server listening on port 8080");

type WsRoomEntry = {
  roomName:string,
  connections:WebSocket[]
}