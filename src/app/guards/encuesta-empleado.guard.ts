import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth.service';
import { ToastController } from '@ionic/angular';
import { EncuestasService } from '../servicios/encuestas.service';

@Injectable({
  providedIn: 'root'
})
export class EncuestaEmpleadoGuard implements CanActivate, CanDeactivate<unknown> {

  constructor(private toastController: ToastController, private auth : AuthService, private encuesta : EncuestasService)
  {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("Guard canActivate")

    if(this.auth.UsuarioActivo.perfil = "empleado")
    {
      return true;
    } 
    this.presentToast('Solo disponible para empleados','danger','alert-circle-outline')
    return false;
  
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("Guard canDeactivate")
    console.log(this.encuesta.respondio)
    if(this.encuesta.respondio)
    {
      return true;
    }
    else
    {
      this.presentToast('Debe completar la encuesta antes de seguir','danger','alert-circle-outline')
      return false;
    }
    
  }

  async presentToast(mensaje:string, color:string, icono:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color:color
    });

    await toast.present();
  }
  
}
