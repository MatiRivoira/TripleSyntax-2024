import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeClientePageRoutingModule } from './home-cliente-routing.module';

import { HomeClientePage } from './home-cliente.page';
import { ChartsEncuestaClientesPage } from '../charts-encuesta-clientes/charts-encuesta-clientes.page';
import { LoadingComponent } from 'src/app/componentes/loading/loading.component';
import { ReservaComponent } from 'src/app/componentes/reserva/reserva.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeClientePageRoutingModule,
    
  ],
  declarations: [HomeClientePage, ChartsEncuestaClientesPage, LoadingComponent, ReservaComponent]
})
export class HomeClientePageModule {}
