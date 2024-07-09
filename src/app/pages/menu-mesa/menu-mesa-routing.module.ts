import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuMesaPage } from './menu-mesa.page';
import { MenuComponent } from 'src/app/componentes/menu/menu.component';


const routes: Routes = [
  {
    path: '',
    component: MenuMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuMesaPageRoutingModule {}
