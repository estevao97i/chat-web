import { Component, OnInit } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  users: any[] = [];

  constructor(private service: ChatService) { }

  ngOnInit() {
    this.service.loginUser('opa');
    this.service.content.subscribe({
      next: (value: any) => this.users = value.users
    })
    // this.service.content
  }

}
