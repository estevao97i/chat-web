import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [ChatComponent],
  imports: [BrowserModule, MatCardModule, FormsModule, MatButtonModule, MatInputModule],
  exports: [ChatComponent],
})
export class ChatModule {}
