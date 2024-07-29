import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CrearMesaPageRoutingModule } from './crear-mesa-routing.module';
import { CrearMesaPage } from './crear-mesa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearMesaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrearMesaPage]
})
export class CrearMesaPageModule {}
