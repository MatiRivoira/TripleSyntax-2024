import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './servicios/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(
    private platform: Platform, private auth:AuthService
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
    });
  }
  ngOnInit(): void {
   this.auth.agregarListener();
  }
}