import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(
    private toastController: ToastController,
    private vibration: Vibration,
    private spinner: NgxSpinnerService,
    private platform: Platform
  ) { }

  public async presentToast(mensaje: string, color: string, icono?: string) {
    let toast:any;
    if(icono)
    {   
      toast = await this.toastController.create({
        message: mensaje,
        duration: 1500,
        icon: icono,
        color: color,
      });
    }else{
      
      toast = await this.toastController.create({
        message: mensaje,
        duration: 1500,
        color: color,
      });
    }

    await toast.present();
  }

  public isAndroid(){
    return this.platform.is('android');
  }

  public async vibrarError(duration: number) {
    this.vibration.vibrate(duration);
  }

    ////Spinner
    showSpinner(){
      this.spinner.show();
    }
    hideSpinner(){
      this.spinner.hide();
    }
    
}
