import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DevolucionDeEmpleadoPageRoutingModule } from './devolucion-de-empleado-routing.module';
import { DevolucionDeEmpleadoPage } from './devolucion-de-empleado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevolucionDeEmpleadoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DevolucionDeEmpleadoPage]
})
export class DevolucionDeEmpleadoPageModule {}
