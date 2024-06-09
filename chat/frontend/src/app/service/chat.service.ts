import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Stomp } from '@stomp/stompjs';
import * as socket from 'sockjs-client/';

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
      _this.receiveAll();
      _this.imgResponse();
      _this.onMessageReceived();
    });
  }

  receiveAll() {
    this.stompClient.subscribe('/topic/response', (message: any) => {
      this.messageSubject.next(message.body);
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
      const message = JSON.parse(payload.body);
      const stateOfResponse = {
        users: Object.values(message.users),
        text: message.content || null,
        activity: message.activity,
      };

      this.content.next(stateOfResponse);
      this.content.asObservable();
    });
  }

  sendMessage(message: string): void {
    const sendMessage = {
      user: { name: this.client },
      content: message,
    };
    this.stompClient.send('/app/send', {}, JSON.stringify(sendMessage));
  }

  onMessageReceived() {
    const _this = this;
    _this.stompClient.subscribe('/topic/response', (payload: any) => {
      const message = JSON.parse(payload.body);
      const stateOfResponse = {
        activity: message.activity,
      };

      stateOfResponse.activity
        .filter((item: any) => item.type === 'CHAT')
        .map((element: any) => {
          if (element.user?.name === this.client) {
            return (element.sameUser = true);
          }
          return (element.sameUser = false);
        });

      this.messages$.next(stateOfResponse);
      this.messages$.asObservable();
    });
  }

  transformActivity(activityResponse: any) {
    if (activityResponse.activity) {
      return (
        activityResponse.activity
          .map((element: any) => {
            if (element.user?.name === this.client) {
              return (element.sameUser = true);
            }
            return (element.sameUser = false);
          })
      );
    }
    return null;
  }

  presentImage(file: any) {
    const formData: FormData = new FormData();
    formData.append('img', file, file.name);

    this.http
      .post('http://localhost:8080/upload', formData, { responseType: 'text' })
      .subscribe((data: any) => {
        this.callStompClientImg(data);
      });
  }

  callStompClientImg(data: any) {
    const request = {
      imgSrc: data,
      username: this.client,
    };
    this.stompClient.send('/app/img', {}, JSON.stringify(request));
  }

  imgResponse() {
    this.stompClient.subscribe('/topic/content', (payload: any) => {
      try {
        const response = JSON.parse(payload.body);
        const responseUserImg = response.activity[response.activity.length - 1];
        const userImg = responseUserImg.user.name;

        if (responseUserImg.imgSrc == 'stopShare') {
          const stateOfResponse = {
            img: null,
            user: userImg === this.client,
          };

          this.img$.next(stateOfResponse);
          this.img$.asObservable();
          return
        }

        const downloadFile = responseUserImg.imgSrc;
        this.downloadImage(downloadFile, userImg);
      } catch (error) {
        console.error(error);
      }
    });
  }

  downloadImage(url: string, user: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const blobURL = window.URL.createObjectURL(blob);
      const stateOfResponse = {
        img: blobURL,
        user: user === this.client,
      };

      this.img$.next(stateOfResponse);
      this.img$.asObservable();
    });
  }

  stopShare() {
    const request = {
      imgSrc: 'stopShare',
      user: this.client
    }

    this.stompClient.send('/app/stop-img', {}, JSON.stringify(request));
  }

  removeUser() {
    this.disconnect();
  }

  onDisConnected() {
    const _this = this;
    _this.stompClient.subscribe('/topic/leave', (payload: any) => {
      const message = JSON.parse(payload.body);
      const stateOfResponse = {
        users: Object.values(message.users),
        text: message.content || null,
        activity: message.activity,
      };

      this.content.next(stateOfResponse);
      this.content.asObservable();
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  getContent(): Observable<Object> {
    const _this = this;
    return this.content.asObservable();
  }
}
