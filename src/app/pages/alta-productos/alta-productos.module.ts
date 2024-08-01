import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AltaProductosPageRoutingModule } from './alta-productos-routing.module';

import { AltaProductosPage } from './alta-productos.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AltaProductosPageRoutingModule
  ],
  declarations: [AltaProductosPage]
})
export class AltaProductosPageModule {}
