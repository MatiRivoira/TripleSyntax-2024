import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterEmpleadoPageRoutingModule } from './register-empleado-routing.module';

import { RegisterEmpleadoPage } from './register-empleado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterEmpleadoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterEmpleadoPage]
})
export class RegisterEmpleadoPageModule {}
