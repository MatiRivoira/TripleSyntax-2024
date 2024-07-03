import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CocineroPageRoutingModule } from './cocinero-routing.module';

import { CocineroPage } from './cocinero.page';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpinnerModule,
    CocineroPageRoutingModule
  ],
  declarations: [CocineroPage]
})
export class CocineroPageModule {}
