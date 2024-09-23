import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {Button, ButtonModule} from 'primeng/button';
import {FileUploaderService} from "./file-uploader.service";
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import {MessagesModule} from "primeng/messages";
import {Message} from "primeng/api";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardModule, FormsModule, InputTextModule, Button, ReactiveFormsModule, DividerModule, DialogModule, MessagesModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'frontend';
  uploadFileForm!: FormGroup;
  dialogVisible: boolean = false;
  success: boolean = false;
  messages: Message[] = [];

  constructor(private fb: FormBuilder, private fileUploaderService: FileUploaderService) {
    this.uploadFileForm = this.fb.group({link: ''})

  }

  onSubmitUploadFile() {
    this.fileUploaderService.uploadFile(this.uploadFileForm.value.link)
      .then(r => {
        console.log(r)
        if (r.status == 201){
          this.messages = [{ severity: 'success', detail: 'Success Message' }]
        } else {
          this.messages = [{ severity: 'error', detail: 'Error Message' }]
        }
        this.dialogVisible = true;
      })
  }
}
