import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CrearClientePageRoutingModule } from './crear-cliente-routing.module';
import {  CrearClientePage } from './crear-cliente.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CrearClientePageRoutingModule,
  ],
  declarations: [CrearClientePage]
})
export class CrearClientePageModule {}
