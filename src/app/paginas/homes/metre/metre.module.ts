import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetrePageRoutingModule } from './metre-routing.module';

import { MetrePage } from './metre.page';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetrePageRoutingModule,
    SpinnerModule,
  ],
  declarations: [MetrePage]
})
export class MetrePageModule {}
