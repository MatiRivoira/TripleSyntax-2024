import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMozoPageRoutingModule } from './home-mozo-routing.module';

import { HomeMozoPage } from './home-mozo.page';
import { LoadingComponent } from 'src/app/componentes/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMozoPageRoutingModule
  ],
  declarations: [HomeMozoPage, LoadingComponent]
})
export class HomeMozoPageModule {}
