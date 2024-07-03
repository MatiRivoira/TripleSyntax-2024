import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  spinner: boolean = false;
  modoRegistro: boolean = true;
  scannerActive: boolean = false;
  infoDni:any;
  popup:boolean = false;

  constructor(private vibration: Vibration, private router: Router) {}

  ngOnInit() {
  }

  cambiarModo() {
    this.modoRegistro = !this.modoRegistro;
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    this.scannerActive = true;
    const allowed = await this.checkPermission();
    if (allowed) {
      BarcodeScanner.hideBackground();
      const resultado = await BarcodeScanner.startScan();
      if (resultado.hasContent) {
        this.infoDni = resultado.content.split('@');
        this.vibration.vibrate(300);
        this.scannerActive = false;
      } else {
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }
  }

  stopScan()  {
    this.scannerActive = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }

  activarSpinner()
  {
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
      if(this.modoRegistro)
      {
        this.popup = true;
      }
    }, 3000);
  }

}
