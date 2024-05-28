import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Stomp } from '@stomp/stompjs';
import * as socket from "sockjs-client/"

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: any = null;
  private stompClient: any;
  private messageSubject: Subject<string> = new Subject<string>();

  connect(): void {
    let sockjReturn = socket('http://localhost:8080/ws')
    this.stompClient = Stomp.over(sockjReturn);

    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe('/topic/messages', (message: any) => {
        _this.messageSubject.next(message.body);
      });
    });
  }

  loginUser(username: string) {
    this.stompClient.send('/app/join', {}, JSON.stringify(username))
  }

  sendMessage(message: string): void {
    this.stompClient.send('/app/send', {}, message);
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

}
