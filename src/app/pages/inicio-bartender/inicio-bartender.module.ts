import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioBartenderPageRoutingModule } from './inicio-bartender-routing.module';

import { InicioBartenderPage } from './inicio-bartender.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioBartenderPageRoutingModule
  ],
  declarations: [InicioBartenderPage]
})
export class InicioBartenderPageModule {}
