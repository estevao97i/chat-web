import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Stomp } from '@stomp/stompjs';
import * as socket from 'sockjs-client/';
import * as pako from 'pako';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  socket: any = null;
  stompClient: any;
  private messageSubject: Subject<string> = new Subject<string>();
  content: BehaviorSubject<Object> = new BehaviorSubject({});
  messages$: BehaviorSubject<Object> = new BehaviorSubject({});
  img$: BehaviorSubject<Object> = new BehaviorSubject({});
  client!: string;


  constructor(private http: HttpClient) {}

  connect(): void {
    let sockjReturn = socket('http://localhost:8080/ws');
    this.stompClient = Stomp.over(sockjReturn);

    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe('/topic/response', (message: any) => {
        _this.messageSubject.next(message.body);
      });
    });
  }

  loginUser(username: string) {
    this.client = username;
    this.stompClient.send('/app/join', {}, JSON.stringify(username));
    this.onConnected();
  }

  onConnected() {
    const _this = this;
    _this.stompClient.subscribe('/topic/response', (payload: any) => {
      console.log('received', payload);
      const message = JSON.parse(payload.body);
      const stateOfResponse = {
        users: Object.values(message.users),
        text: message.content || null,
        activity: message.activity,
      };
      console.log(stateOfResponse);

      this.content.next(stateOfResponse);
      this.content.asObservable();
    });
  }

  sendMessage(message: string, user: any): void {
    const sendMessage = {
      user: { name: this.client },
      content: message,
    };
    this.stompClient.send('/app/send', {}, JSON.stringify(sendMessage));
    this.onMessageReceived();
  }

  onMessageReceived() {
    const _this = this;
    _this.stompClient.subscribe('/topic/response', (payload: any) => {
      const message = JSON.parse(payload.body);
      const stateOfResponse = {
        user: message.activity.user?.name || null,
        text: message.activity.message || null,
        activity: message.activity,
      };
      console.log('mensagem recebida', stateOfResponse);

      this.messages$.next(stateOfResponse);
      this.messages$.asObservable();
    });
  }

  presentImage(file: any) {
    const formData: FormData = new FormData();
    formData.append('img', file, file.name)

    this.http.post('http://localhost:8080/upload', formData).subscribe((data) => {
      this.imgResponse()
      // console.log(data)
    });
  }

  imgResponse() {
    this.stompClient.subscribe('/topic/content', (payload: any) => {
      console.log('chegou aqui');

      try {
        // console.log(payload.body);
        const response = JSON.parse(payload.body);
        this.downloadImage(response.activity[response.activity.length - 1].img)
      } catch (error) {
        console.error(error);
      }
    });

  }

  downloadImage(url: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const blobURL = window.URL.createObjectURL(blob);
      const stateOfResponse = {
        img: blobURL,
      };
      console.log('img recebida', stateOfResponse);

      this.img$.next(stateOfResponse.img);
      this.img$.asObservable();
    });
  }

  callStompClientImg(data: Uint8Array) {
    const request = new Uint8Array();
    // request
    this.stompClient.send('/app/img', {}, data.buffer);
    // this.onImgReceived();
    this.imgResponse();
  }

  removeUser(user: Object) {
    this.disconnect();
    // this.stompClient.send('/app/remove', {}, JSON.stringify(user));
    // this.onDisConnected()
  }

  onDisConnected() {
    const _this = this;
    _this.stompClient.subscribe('/topic/leave', (payload: any) => {
      console.log('received', payload);
      const message = JSON.parse(payload.body);
      const stateOfResponse = {
        users: Object.values(message.users),
        text: message.content || null,
        activity: message.activity,
      };
      console.log(stateOfResponse);

      this.content.next(stateOfResponse);
      this.content.asObservable();
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  getContent(): Observable<Object> {
    const _this = this;
    return this.content.asObservable();
  }
}
