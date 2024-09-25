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
import {ProgressBarModule} from "primeng/progressbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardModule, FormsModule, InputTextModule, Button, ReactiveFormsModule, DividerModule, DialogModule, MessagesModule, ProgressBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'frontend';
  uploadFileForm!: FormGroup;
  dialogVisible: boolean = false;
  success: boolean = false;
  messages: Message[] = [];
  file_id: number | undefined = undefined;
  progress: number = 0;


  constructor(private fb: FormBuilder, private fileUploaderService: FileUploaderService) {
    this.uploadFileForm = this.fb.group({link: ''})
  }

  onSubmitUploadFile(){
    const reference_to_this = this
    this.fileUploaderService.uploadFile(this.uploadFileForm.value.link)
      .then(r => {
        this.file_id = r.file_id
        if (r.file_id == undefined ) {
          this.messages = [{severity: 'error', detail: 'Error Message'}]
        } else {
          this.messages = [{severity: 'success', detail: 'Success Message'}]
          const interval_id = setInterval(function (){
            reference_to_this.fileUploaderService.getUploadFileProgress(r.file_id)
              .then(r => {
                console.log(r.progress)
                if (r.progress === 100){
                  clearInterval(interval_id)
                }
                reference_to_this.progress = r.progress
              })
          },2000)
        }
        this.dialogVisible = true;
      })
  }
}
