import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMestrePageRoutingModule } from './home-mestre-routing.module';

import { HomeMestrePage } from './home-mestre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMestrePageRoutingModule
  ],
  declarations: [HomeMestrePage]
})
export class HomeMestrePageModule {}
