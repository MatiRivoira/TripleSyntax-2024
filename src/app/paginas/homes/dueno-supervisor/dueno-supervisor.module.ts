import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DuenoSupervisorPageRoutingModule } from './dueno-supervisor-routing.module';

import { DuenoSupervisorPage } from './dueno-supervisor.page';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SpinnerModule,
    DuenoSupervisorPageRoutingModule
  ],
  declarations: [DuenoSupervisorPage]
})
export class DuenoSupervisorPageModule {}
