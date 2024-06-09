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

interface Image {
  img: string | null;
  user: string | null;
}

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPageComponent implements OnInit, AfterViewInit {
  @ViewChild('sectionMessages') sectionMessages!: ElementRef;
  @ViewChild('btnMouse') btnMouse!: ElementRef;

  users: any[] = [];
  messages: any[] = [];
  form!: FormGroup;
  selectedFile: File | null = null;
  images: any[] = [];
  fileContent: string | ArrayBuffer | any = null;
  imagePresenting: any = null;
  binaryString: any;
  willBeDeleted: any;
  delete: any;
  animationImg!: Animation;
  animationText!: Animation;
  durationEffect: number = 650;
  sameUserPresenting: any;
  stopShareClicked: boolean = false;

  constructor(
    private service: ChatService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = new FormGroup({
      inputMessage: new FormControl<string>(''),
    });
  }

  ngOnInit(): void {
    this.service.content.subscribe({
      next: (value: any) => {
        this.users = value.users;
        if (value.activity) {
          const response = this.service.transformActivity(value.activity);
          if (response) {
            this.messages = response;
          }
        }
        this.timeOutScroll();
      },
    });
  }

  ngAfterViewInit(): void {
    this.service.messages$.subscribe({
      next: (value: any) => {
        if (value.activity) {
          this.messages = value.activity;
        }
        this.timeOutScroll();
      },
    });

    this.service.img$.subscribe({
      next: (value: any) => {
        if (value.hasOwnProperty('img')) {
          this.imagePresenting = value.img;
          this.sameUserPresenting = value.user;
        }
      },
    });
  }

  sendMessage(message: string) {
    if (!message) return;
    this.service.sendMessage(message);
    this.form.get('inputMessage')?.setValue(null);
    this.timeOutScroll();
  }

  leaveRoom() {
    const user = this.messages[this.messages.length - 1].user;
    this.service.removeUser();
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
          description: this.selectedFile?.name,
          inputFile: this.selectedFile,
        });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  insertImageContent(e: HTMLElement, img: HTMLElement, imagePresenting: HTMLElement) {
    const selected = this.images.find((obj) => {
      return obj.inputFile.name === e.innerText;
    });

    if (!this.imagePresenting) {
      this.service.presentImage(selected.inputFile);
      return;
    }

    if (this.sameUserPresenting) {
      this.service.presentImage(selected.inputFile);
      return;
    }
    this.animateSelectedCannotBeSelected(img, imagePresenting)
    // logica de tremer a imagem
  }

  animateSelectedCannotBeSelected(imgSelected: HTMLElement, imagePresenting: HTMLElement) {
    imgSelected.animate([
      { transform: 'translateX(15px)' }, { transform: 'translateX(0)' }, { transform: 'translateX(15px)' }, { transform: 'translateX(0)' },
    ], {
      duration: 200,
      fill: 'forwards'
    })

    imagePresenting.animate([
      { borderWidth: '4px', borderStyle: 'solid', borderColor: 'red' }, { border: 'none' }
    ], {duration: 1000, fill: 'forwards'})
  }

  onStopShare() {
    this.stopShareClicked = true;
  }

  stop() {
    this.service.stopShare();
    this.stopShareClicked = false;
  }

  onMouseDown(e: HTMLElement, img: HTMLImageElement) {
    this.willBeDeleted = e.innerText;
    this.animationText = e.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(0.9)', opacity: '0.2' }],
      {
        duration: this.durationEffect,
        fill: 'forwards',
      }
    );

    this.animationImg = img.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(0.9)', opacity: '0.2' }],
      {
        duration: this.durationEffect,
        fill: 'forwards',
      }
    );

    this.delete = setTimeout(() => {
      this.onHoldComplete();
    }, this.durationEffect);
  }

  onMouseLeave() {
    if (this.animationImg) {
      this.animationImg.cancel();
      this.animationText.cancel();
    }
    clearTimeout(this.delete);
  }

  onMouseUp() {
    if (this.animationImg) {
      this.animationImg.cancel();
      this.animationText.cancel();
    }
    clearTimeout(this.delete);
  }

  onHoldComplete() {
    const indexDelete = this.images.findIndex(
      (item) => item.description == this.willBeDeleted
    );
    this.images.splice(indexDelete, 1);
  }
}
