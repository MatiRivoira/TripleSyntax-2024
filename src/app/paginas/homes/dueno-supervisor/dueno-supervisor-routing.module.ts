import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DuenoSupervisorPage } from './dueno-supervisor.page';

const routes: Routes = [
  {
    path: '',
    component: DuenoSupervisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuenoSupervisorPageRoutingModule {}
