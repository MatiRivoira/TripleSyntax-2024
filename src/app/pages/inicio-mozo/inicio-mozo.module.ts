import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InicioMozoPageRoutingModule } from './inicio-mozo-routing.module';
import { InicioMozoPage } from './inicio-mozo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioMozoPageRoutingModule
  ],
  declarations: [InicioMozoPage]
})
export class InicioMozoPageModule {}
