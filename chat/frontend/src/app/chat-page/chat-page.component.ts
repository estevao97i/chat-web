import { Component, OnInit } from '@angular/core';
import { ChatService } from '../service/chat.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  users: any[] = [];
  messages: any[] = [];

  constructor(private service: ChatService) { }

  ngOnInit() {
    this.service.content.subscribe({
      next: (value: any) => this.users = value.users
    })
    // this.service.content
  }

  sendMessage(message: string) {

  }

}
