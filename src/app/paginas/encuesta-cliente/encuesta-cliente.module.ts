import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaClientePageRoutingModule } from './encuesta-cliente-routing.module';

import { EncuestaClientePage } from './encuesta-cliente.page';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SpinnerModule,
    EncuestaClientePageRoutingModule
  ],
  declarations: [EncuestaClientePage],
  providers: [Vibration]
})
export class EncuestaClientePageModule {}
