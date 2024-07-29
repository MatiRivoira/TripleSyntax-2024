import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartzDeEmpleadoPageRoutingModule } from './chartz-de-empleado-routing.module';
import { ChartzDeEmpleadoPage } from './chartz-de-empleado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartzDeEmpleadoPageRoutingModule
  ],
  declarations: [ChartzDeEmpleadoPage]
})
export class ChartzDeEmpleadoPageModule {}
