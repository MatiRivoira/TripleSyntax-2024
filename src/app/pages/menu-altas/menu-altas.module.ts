import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuAltasPageRoutingModule } from './menu-altas-routing.module';

import { MenuAltasPage } from './menu-altas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuAltasPageRoutingModule
  ],
  declarations: [MenuAltasPage]
})
export class MenuAltasPageModule {}
