import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  isActive = true;

  constructor() { }

  playAudio(filePath: string) {
    if (this.isActive) {
      const audio = new Audio(filePath);
      audio.play();
    }
  }
}
