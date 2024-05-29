import { Component, OnInit } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  version: string = '1.0.0';

  input: string = '';

  constructor(private service: ChatService, private router: Router) { }

  ngOnInit() {
    this.service.connect();
  }

  loginWebPack(username: string) {
    // this.service.loginUser(username);
    this.router.navigateByUrl('/chat-message');
  }

}
