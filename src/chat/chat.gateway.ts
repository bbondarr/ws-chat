import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: string): void {
    this.server.to('chatroom').emit('msgToClient', message);
  }

  @SubscribeMessage('isTyping')
  handleIsTyping(client: Socket, username: string): void {
    this.server.emit('isTypingToClient', username);
  }

  @SubscribeMessage('wentOnline')
  handleOnliners(client: Socket): void {
    this.server.emit(
      'loadOnliners',
      this.server.sockets.adapter.rooms['chatroom'].sockets,
    );
  }

  afterInit() {
    console.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.server.emit(
      'loadOnliners',
      this.server.sockets.adapter.rooms['chatroom'].sockets,
    );
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket): void {
    client.join('chatroom');
    // console.log(this.server.sockets.adapter.rooms['chatroom'])
    this.server.emit(
      'loadOnliners',
      this.server.sockets.adapter.rooms['chatroom'].sockets,
    );
    console.log(`Client connected: ${client.id}`);
  }
}
