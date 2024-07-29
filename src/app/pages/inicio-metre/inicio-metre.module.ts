import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InicioMetrePageRoutingModule } from './inicio-metre-routing.module';
import { InicioMetrePage } from './inicio-metre.page';
import { TimestampDatePipe } from 'src/app/pipes/timestamp-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioMetrePageRoutingModule
  ],
  declarations: [InicioMetrePage, TimestampDatePipe]
})
export class InicioMetrePageModule {}
