import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-menu-altas',
  templateUrl: './opciones-altas.page.html',
  styleUrls: ['./opciones-altas.page.scss'],
})
export class OpcionesAltasPage implements OnInit {


  constructor(public authService: AuthService, private notificacionesS: NotificacionesService) { }

  ngOnInit() { }

  cerrarSesion() {
    this.notificacionesS.showSpinner();
    try {
      this.authService.LogOut();

    } catch (error) {

    } finally {

      this.notificacionesS.hideSpinner();
    }
  }
}
