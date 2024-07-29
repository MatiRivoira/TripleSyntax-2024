import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DevolucionDeClientePageRoutingModule } from './devolucion-de-cliente-routing.module';
import { DevolucionDeClientePage } from './devolucion-de-cliente.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevolucionDeClientePageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [DevolucionDeClientePage]
})
export class DevolucionDeClientePageModule {}
