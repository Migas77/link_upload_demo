import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  private baseURL : string = "http://localhost:8000/";

  constructor() { }

  async uploadFile(link: string){
    const url = `${this.baseURL}upload/`
    const formData = new FormData();
    formData.append('link', link);
    return await fetch(url,{
      method: 'POST',
      body: formData
    });
  }
}
