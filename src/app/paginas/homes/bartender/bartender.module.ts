import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BartenderPageRoutingModule } from './bartender-routing.module';

import { BartenderPage } from './bartender.page';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpinnerModule,
    BartenderPageRoutingModule
  ],
  declarations: [BartenderPage]
})
export class BartenderPageModule {}
