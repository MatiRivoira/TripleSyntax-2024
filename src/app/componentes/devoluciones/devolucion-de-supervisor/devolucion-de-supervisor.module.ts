import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DevolucionDeSupervisorPageRoutingModule } from './devolucion-de-supervisor-routing.module';
import { DevolucionDeSupervisorPage } from './devolucion-de-supervisor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevolucionDeSupervisorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DevolucionDeSupervisorPage]
})
export class DevolucionDeSupervisorPageModule {}
