import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuMesaPageRoutingModule } from './menu-mesa-routing.module';

import { MenuMesaPage } from './menu-mesa.page';

import { MenuComponent } from 'src/app/componentes/menu/menu.component';

import { DiferenciaMinutosPipe } from 'src/app/pipes/diferencia-minutos.pipe';

import { PagarComponent } from 'src/app/componentes/pagar/pagar.component';

import { QrPropinaComponent } from 'src/app/componentes/qr-propina/qr-propina.component';

import { Juego10Component } from 'src/app/juegos/juego10/juego10.component';
import { Juego15Component } from 'src/app/juegos/juego15/juego15.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuMesaPageRoutingModule
  ],
  declarations: [MenuMesaPage, MenuComponent,DiferenciaMinutosPipe, PagarComponent,QrPropinaComponent,Juego10Component, Juego15Component]
})
export class MenuMesaPageModule {}
