import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeSupervisorPageRoutingModule } from './home-supervisor-routing.module';

import { HomeSupervisorPage } from './home-supervisor.page';
import { LoadingComponent } from 'src/app/componentes/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeSupervisorPageRoutingModule
  ],
  declarations: [HomeSupervisorPage, LoadingComponent]
})
export class HomeSupervisorPageModule {}
