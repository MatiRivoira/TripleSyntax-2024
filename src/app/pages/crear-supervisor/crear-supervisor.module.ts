import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CrearSupervisorPageRoutingModule } from './crear-supervisor-routing.module';
import { CrearSupervisorPage } from './crear-supervisor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CrearSupervisorPageRoutingModule
  ],
  declarations: [CrearSupervisorPage]
})
export class CrearSupervisorPageModule {}
