import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeBartenderPageRoutingModule } from './home-bartender-routing.module';

import { HomeBartenderPage } from './home-bartender.page';
import { LoadingComponent } from 'src/app/componentes/loading/loading.component';
import { FilterProductByTypePipe } from 'src/app/pipes/filter-product-by-type.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeBartenderPageRoutingModule
  ],
  declarations: [HomeBartenderPage, LoadingComponent, FilterProductByTypePipe]
})
export class HomeBartenderPageModule {}
