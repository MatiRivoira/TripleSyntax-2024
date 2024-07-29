import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartzDeClientePage } from './chartz-de-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: ChartzDeClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartzDeClientePageRoutingModule {}
