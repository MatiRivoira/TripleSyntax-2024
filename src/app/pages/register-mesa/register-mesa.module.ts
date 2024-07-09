import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterMesaPageRoutingModule } from './register-mesa-routing.module';

import { RegisterMesaPage } from './register-mesa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterMesaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterMesaPage]
})
export class RegisterMesaPageModule {}
