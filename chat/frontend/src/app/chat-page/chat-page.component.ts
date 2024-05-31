import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../service/chat.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPageComponent implements OnInit, AfterViewInit {
  @ViewChild('sectionMessages') sectionMessages!: ElementRef;

  users: any[] = [];
  messages: any[] = [];
  form!: FormGroup;
  selectedFile: File | null = null;
  images: any[] = [];
  fileContent: string | ArrayBuffer | null = null;

  constructor(
    private service: ChatService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = new FormGroup({
      inputMessage: new FormControl<string>(''),
    });
  }

  ngOnInit() {
    this.service.content.subscribe({
      next: (value: any) => {
        this.users = value.users;
        this.messages = value.activity;
      },
    });
    this.timeOutScroll();
  }

  ngAfterViewInit(): void {
    this.service.messages$.subscribe({
      next: (value: any) => {
        this.messages = value.activity;
      },
    });
    this.timeOutScroll();
  }

  sendMessage(message: string) {
    if (!message) return;
    this.service.sendMessage(
      message,
      this.messages[this.messages.length - 1].user.name
    );
    this.form.get('inputMessage')?.setValue(null);
    this.timeOutScroll();
  }

  leaveRoom() {
    const user = this.messages[this.messages.length - 1].user;
    this.service.removeUser(user);
    this.router.navigateByUrl('/');
  }

  timeOutScroll() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 10);
  }

  scrollToBottom(): void {
    try {
      this.sectionMessages.nativeElement.scrollTop =
        this.sectionMessages.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll failed', err);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.fileContent = reader.result;
        this.images.push({
          image: this.fileContent,
          description: this.selectedFile?.name
        })
      };
      reader.readAsDataURL(this.selectedFile)
    }
  }
}
