import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpleadoGraficosPageRoutingModule } from './empleado-graficos-routing.module';

import { EmpleadoGraficosPage } from './empleado-graficos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpleadoGraficosPageRoutingModule
  ],
  declarations: [EmpleadoGraficosPage]
})
export class EmpleadoGraficosPageModule {}
