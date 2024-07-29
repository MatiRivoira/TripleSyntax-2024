import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrearClientePage } from './crear-cliente.page';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: CrearClientePage
  }
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearClientePageRoutingModule {}
