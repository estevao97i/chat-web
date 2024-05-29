import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Stomp } from '@stomp/stompjs';
import * as socket from "sockjs-client/"

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: any = null;
  stompClient: any;
  private messageSubject: Subject<string> = new Subject<string>();
  content: BehaviorSubject<Object> = new BehaviorSubject({});

  connect(): void {
    let sockjReturn = socket('http://localhost:8080/ws')
    this.stompClient = Stomp.over(sockjReturn);

    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe('/topic/response', (message: any) => {
        _this.messageSubject.next(message.body);
      });
    });
  }

  loginUser(username: string) {
    this.stompClient.send('/app/join', {}, JSON.stringify(username))
    this.onConnected()
  }

  onConnected() {
    const _this = this;
    _this.stompClient.subscribe('/topic/response', (payload: any) => {
      console.log('received', payload);
        const message = JSON.parse(payload.body)
        const stateOfResponse = {
          users: Object.values(message.users),
          text: message.content || null,
          activity: message.activity
        }
        console.log(stateOfResponse)

        // const _this = this
        this.content.next(stateOfResponse);
        this.content.asObservable()

    })
  }

  onMessageReceived() {
    }

  sendMessage(message: string): void {
    this.stompClient.send('/app/send', {}, message);
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  getContent(): Observable<Object> {
    const _this = this;
    return this.content.asObservable();
  }

}
