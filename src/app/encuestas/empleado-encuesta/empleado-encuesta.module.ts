import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpleadoEncuestaPageRoutingModule } from './empleado-encuesta-routing.module';

import { EmpleadoEncuestaPage } from './empleado-encuesta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpleadoEncuestaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EmpleadoEncuestaPage]
})
export class EmpleadoEncuestaPageModule {}
