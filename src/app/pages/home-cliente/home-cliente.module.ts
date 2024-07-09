import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeClientePageRoutingModule } from './home-cliente-routing.module';

import { HomeClientePage } from './home-cliente.page';
import { ChartsEncuestaClientesPage } from '../charts-encuesta-clientes/charts-encuesta-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeClientePageRoutingModule,
    
  ],
  declarations: [HomeClientePage,ChartsEncuestaClientesPage]
})
export class HomeClientePageModule {}
