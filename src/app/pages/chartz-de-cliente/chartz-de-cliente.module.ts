import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChartzDeClientePageRoutingModule } from './chartz-de-cliente-routing.module';

import { ChartzDeClientePage } from './chartz-de-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartzDeClientePageRoutingModule
  ],
  declarations: [ 
  ]
})
export class ChartzDeClientePageModule {}
