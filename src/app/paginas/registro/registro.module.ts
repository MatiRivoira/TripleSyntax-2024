import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistroPageRoutingModule } from './registro-routing.module';
import { RegistroPage } from './registro.page';

import { RegistroClienteComponent } from 'src/app/componentes/registro-cliente/registro-cliente.component';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';
import { ModoAnonimoComponent } from 'src/app/componentes/modo-anonimo/modo-anonimo.component';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpinnerModule,
    RegistroPageRoutingModule,
    ReactiveFormsModule 
  ],
  providers: [Vibration],
  declarations: [RegistroPage, RegistroClienteComponent, ModoAnonimoComponent]
})
export class RegistroPageModule {}
