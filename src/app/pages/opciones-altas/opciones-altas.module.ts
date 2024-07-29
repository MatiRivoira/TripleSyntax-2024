import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OpcionesAltasPageRoutingModule } from './opciones-altas-routing.module';
import { OpcionesAltasPage } from './opciones-altas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcionesAltasPageRoutingModule
  ],
  declarations: [OpcionesAltasPage]
})
export class OpcionesAltasPageModule {}
