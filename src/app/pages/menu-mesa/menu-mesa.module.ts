import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuMesaPageRoutingModule } from './menu-mesa-routing.module';

import { MenuMesaPage } from './menu-mesa.page';

import { MenuComponent } from 'src/app/componentes/menu/menu.component';

import { DiferenciaMinutosPipe } from 'src/app/pipes/diferencia-minutos.pipe';

import { PagarComponent } from 'src/app/componentes/pagar/pagar.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuMesaPageRoutingModule
  ],
  declarations: [MenuMesaPage, MenuComponent,DiferenciaMinutosPipe, PagarComponent]
})
export class MenuMesaPageModule {}
