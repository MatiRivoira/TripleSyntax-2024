import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioClientePageRoutingModule } from './inicio-cliente-routing.module';

import { InicioClientePage } from './inicio-cliente.page';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpinnerModule,
    InicioClientePageRoutingModule
  ],
  providers: [Vibration],
  declarations: [InicioClientePage]
})
export class InicioClientePageModule {}
