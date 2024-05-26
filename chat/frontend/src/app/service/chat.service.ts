import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Stomp } from '@stomp/stompjs';
import * as io from "socket.io-client";
import * as socket from "sockjs-client/"
// import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: any = null;
  private stompClient: any;
  private messageSubject: Subject<string> = new Subject<string>();

  connect(): void {
    // let SockJS = require('sockjs-client');
    // SockJS = new SockJS('http://localhost:8080/ws');
    let sockjReturn = socket('http://localhost:8080/ws')
    // io('http://localhost:8080/ws');
    // this.socket = io.io('http://localhost:8080/ws')
    // this.stompClient = Stomp.over(function(){
      // return new WebSocket('http://localhost:8080/ws')
    // });
    this.stompClient = Stomp.over(sockjReturn);

    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe('/topic/messages', (message: any) => {
        _this.messageSubject.next(message.body);
      });
    });
  }

  sendMessage(message: string): void {
    this.stompClient.send('/app/send', {}, message);
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

}
