import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CrearProductoPageRoutingModule } from './crear-producto-routing.module';
import { CrearProductoPage } from './crear-producto.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CrearProductoPageRoutingModule
  ],
  declarations: [CrearProductoPage]
})
export class CrearProductoPageModule {}
