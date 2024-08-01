import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(
    private platform: Platform,
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
    });
  }
  ngOnInit(): void {
    window.screen.orientation.lock('portrait');
  }

  
}
