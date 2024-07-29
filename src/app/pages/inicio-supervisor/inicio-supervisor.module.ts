import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InicioSupervisorPageRoutingModule } from './inicio-supervisor-routing.module';
import { InicioSupervisorPage } from './inicio-supervisor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioSupervisorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [InicioSupervisorPage]
})
export class InicioSupervisorPageModule {}
