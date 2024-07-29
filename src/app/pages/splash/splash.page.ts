import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';

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
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 6000);
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
