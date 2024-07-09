import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMestrePage } from './home-mestre.page';

const routes: Routes = [
  {
    path: '',
    component: HomeMestrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeMestrePageRoutingModule {}
