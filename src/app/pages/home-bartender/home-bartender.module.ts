import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeBartenderPageRoutingModule } from './home-bartender-routing.module';

import { HomeBartenderPage } from './home-bartender.page';
import { LoadingComponent } from 'src/app/componentes/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeBartenderPageRoutingModule
  ],
  declarations: [HomeBartenderPage, LoadingComponent]
})
export class HomeBartenderPageModule {}