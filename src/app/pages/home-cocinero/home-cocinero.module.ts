import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeCocineroPageRoutingModule } from './home-cocinero-routing.module';

import { HomeCocineroPage } from './home-cocinero.page';
import { LoadingComponent } from 'src/app/componentes/loading/loading.component';
import { FilterProductByTypePipe } from 'src/app/pipes/filter-product-by-type.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeCocineroPageRoutingModule
  ],
  declarations: [HomeCocineroPage, LoadingComponent, FilterProductByTypePipe]
})
export class HomeCocineroPageModule {}
