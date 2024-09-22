import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {Button, ButtonModule} from 'primeng/button';
import {FileUploaderService} from "./file-uploader.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardModule, FormsModule, InputTextModule, Button, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  uploadFileForm!: FormGroup;

  constructor(private fb: FormBuilder, private fileUploaderService: FileUploaderService) {
    this.uploadFileForm = this.fb.group({link: ''})
  }

  onSubmitUploadFile() {
    this.fileUploaderService.uploadFile(this.uploadFileForm.value.link).then(r => console.log(r))
  }
}
