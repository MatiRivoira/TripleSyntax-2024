import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(private router: Router, private platform: Platform) {
    this.initializeApp();
  }

  ngOnInit() {
      this.router.navigate(['/login']);
  }
  ionViewDidEnter(){
    this.platform.ready().then(() => {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
    });

  }
  initializeApp() {
  }
}
