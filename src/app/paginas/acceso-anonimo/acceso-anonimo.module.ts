import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccesoAnonimoPageRoutingModule } from './acceso-anonimo-routing.module';

import { AccesoAnonimoPage } from './acceso-anonimo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccesoAnonimoPageRoutingModule
  ],
  declarations: [AccesoAnonimoPage]
})
export class AccesoAnonimoPageModule {}
