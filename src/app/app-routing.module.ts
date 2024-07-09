
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { QrPropinaComponent } from './componentes/qr-propina/qr-propina.component';
import { EncuestaEmpleadoGuard } from './guards/encuesta-empleado.guard';
import { MenuComponent } from './componentes/menu/menu.component';
import { Juego10Component } from './juegos/juego10/juego10.component';
import { Juego15Component } from './juegos/juego15/juego15.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'splash',
    loadChildren: () =>
      import('./pages/splash/splash.module').then((m) => m.SplashPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'register-empleado',
    loadChildren: () => import('./pages/register-empleado/register-empleado.module').then( m => m.RegisterEmpleadoPageModule)
  },
  {
    path: 'register-mesa',
    loadChildren: () => import('./pages/register-mesa/register-mesa.module').then( m => m.RegisterMesaPageModule)
  },
  {
    path: 'alta-cliente',
    loadChildren: () => import('./pages/alta-cliente/alta-cliente.module').then( m => m.AltaClientePageModule)
  },
  {
    path: 'alta-productos',
    loadChildren: () => import('./pages/alta-productos/alta-productos.module').then( m => m.AltaProductosPageModule)
  },
  {
    path: 'alta-supervisor',
    loadChildren: () => import('./pages/alta-supervisor/alta-supervisor.module').then( m => m.AltaSupervisorPageModule)
  },
  {
    path: 'menu-altas',
    loadChildren: () => import('./pages/menu-altas/menu-altas.module').then( m => m.MenuAltasPageModule)
  },
  {
    path: 'empleado-encuesta',
    loadChildren: () => import('./encuestas/empleado-encuesta/empleado-encuesta.module').then( m => m.EmpleadoEncuestaPageModule),
    canActivate: [EncuestaEmpleadoGuard],
    canDeactivate: [EncuestaEmpleadoGuard]
  },
     {
    path: 'encuesta-supervisor',
    loadChildren: () => import('./encuestas/encuesta-supervisor/encuesta-supervisor.module').then( m => m.EncuestaSupervisorPageModule)

  },
  {
    path: 'encuesta-cliente',
    loadChildren: () => import('./encuestas/encuesta-cliente/encuesta-cliente.module').then( m => m.EncuestaClientePageModule)
  },
  {
    path: 'empleado-graficos',
    loadChildren: () => import('./encuestas/empleado-graficos/empleado-graficos.module').then( m => m.EmpleadoGraficosPageModule)
  },
  {
    path: 'home-supervisor',
    loadChildren: () => import('./pages/home-supervisor/home-supervisor.module').then( m => m.HomeSupervisorPageModule)
  },
  {
    path:"qr-propina", component:QrPropinaComponent
  },
  {
    path: 'menu-mesa',
    loadChildren: () => import('./pages/menu-mesa/menu-mesa.module').then( m => m.MenuMesaPageModule)
  },
  {
    path: 'home-cliente',
    loadChildren: () => import('./pages/home-cliente/home-cliente.module').then( m => m.HomeClientePageModule)
  },
  {
    path: 'charts-encuesta-clientes',
    loadChildren: () => import('./pages/charts-encuesta-clientes/charts-encuesta-clientes.module').then( m => m.ChartsEncuestaClientesPageModule)
  },
  {
    path:"menu", component:MenuComponent
  },
  {
    path: 'home-mestre',
    loadChildren: () => import('./pages/home-mestre/home-mestre.module').then( m => m.HomeMestrePageModule)
  },
  {
    path: 'home-mozo',
    loadChildren: () => import('./pages/home-mozo/home-mozo.module').then( m => m.HomeMozoPageModule)
  },
  {
    path: 'juego10', component:Juego10Component
  },
  {
    path: 'juego15', component:Juego15Component
  },
  {
    path: 'home-cocinero',
    loadChildren: () => import('./pages/home-cocinero/home-cocinero.module').then( m => m.HomeCocineroPageModule)
  },
  {
    path: 'chat-consulta',
    loadChildren: () => import('./pages/chat-consulta/chat-consulta.module').then( m => m.ChatConsultaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
    

