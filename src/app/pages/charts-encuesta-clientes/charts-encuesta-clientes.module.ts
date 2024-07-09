import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChartsEncuestaClientesPageRoutingModule } from './charts-encuesta-clientes-routing.module';

import { ChartsEncuestaClientesPage } from './charts-encuesta-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsEncuestaClientesPageRoutingModule
  ],
  declarations: [
    ChartsEncuestaClientesPage 
  ]
})
export class ChartsEncuestaClientesPageModule {}
