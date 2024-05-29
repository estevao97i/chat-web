import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { ChatPageComponent } from '../chat-page/chat-page.component';

@NgModule({
  declarations: [ChatPageComponent],
  imports: [BrowserModule, MatCardModule, FormsModule, MatButtonModule, MatInputModule],
  exports: [ChatPageComponent],
})
export class ChatPageModule {}
