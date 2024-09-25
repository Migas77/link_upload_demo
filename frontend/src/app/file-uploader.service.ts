import { Injectable } from '@angular/core';
import {FileUploadProgress} from "../../FileUploadProgress";
import {FileUploadResponse} from "../../FileUploadResponse";

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  private baseURL : string = "http://localhost:8000/";

  constructor() { }

  async uploadFile(link: string): Promise<FileUploadResponse>{
    const url = `${this.baseURL}upload/`
    const formData = new FormData();
    formData.append('link', link);
    const data = await fetch(url,{
      method: 'POST',
      body: formData
    });
    return await data.json() ?? undefined
  }

  async getUploadFileProgress(file_id: number): Promise<FileUploadProgress>{
    const url = `${this.baseURL}upload/status/${file_id}`
    const data = await fetch(url, {method: 'GET'})
    return await data.json() ?? undefined
  }
}
