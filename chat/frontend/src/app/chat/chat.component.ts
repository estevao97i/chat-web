import { Component, OnInit } from '@angular/core';
import { ChatService } from '../service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  input: string = '';

  constructor(private service: ChatService) { }

  ngOnInit() {
    // this.service.connect()
  }

  loginWebPack(username: string) {

  }

}
