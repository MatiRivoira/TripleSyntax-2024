import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevolucionDeSupervisorPage } from './devolucion-de-supervisor.page';

const routes: Routes = [
  {
    path: '',
    component: DevolucionDeSupervisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevolucionDeSupervisorPageRoutingModule {}
