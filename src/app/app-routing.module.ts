
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SeleccionPropinaComponent } from './componentes/seleccion-propina/seleccion-propina.component';
import { MinutasComponent } from './componentes/minuta/minuta.component';
import { PreguntadosDiezComponent } from './juegos/preguntadosDiez/preguntadosDiez.component';
import { SimonQuinceComponent } from './juegos/simonQuince/simonQuince.component';

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
      import('./pages/iniciar-sesion/iniciar-sesion.module').then((m) => m.IniciarSesionPageModule),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'register-empleado',
    loadChildren: () => import('./pages/crear-empleado/crear-empleado.module').then(m => m.CrearEmpleadoPageModule)
  },
  {
    path: 'register-mesa',
    loadChildren: () => import('./pages/crear-mesa/crear-mesa.module').then(m => m.CrearMesaPageModule)
  },
  {
    path: 'alta-cliente',
    loadChildren: () => import('./pages/crear-cliente/crear-cliente-routing.module').then(m => m.CrearClientePageRoutingModule)
  },
  {
    path: 'alta-productos',
    loadChildren: () => import('./pages/crear-producto/crear-producto.module').then(m => m.CrearProductoPageModule)
  },
  {
    path: 'alta-supervisor',
    loadChildren: () => import('./pages/crear-supervisor/crear-supervisor.module').then(m => m.CrearSupervisorPageModule)
  },
  {
    path: 'menu-altas',
    loadChildren: () => import('./pages/opciones-altas/opciones-altas.module').then(m => m.OpcionesAltasPageModule)
  },
  {
    path: 'empleado-encuesta',
    loadChildren: () => import('./componentes/devoluciones/devolucion-de-empleado/devolucion-de-empleado.module').then(m => m.DevolucionDeEmpleadoPageModule)
  },
  {
    path: 'encuesta-supervisor',
    loadChildren: () => import('./componentes/devoluciones/devolucion-de-supervisor/devolucion-de-supervisor.module').then(m => m.DevolucionDeSupervisorPageModule)

  },
  {
    path: 'encuesta-cliente',
    loadChildren: () => import('./componentes/devoluciones/devolucion-de-cliente/devolucion-de-cliente.module').then(m => m.DevolucionDeClientePageModule)
  },
  {
    path: 'empleado-graficos',
    loadChildren: () => import('./componentes/devoluciones/chartz-de-empleado/chartz-de-empleado.module').then(m => m.ChartzDeEmpleadoPageModule)
  },
  {
    path: 'home-supervisor',
    loadChildren: () => import('./pages/inicio-supervisor/inicio-supervisor.module').then(m => m.InicioSupervisorPageModule)
  },
  {
    path: "qr-propina", component: SeleccionPropinaComponent
  },
  {
    path: 'menu-mesa',
    loadChildren: () => import('./pages/opciones-mesa/opciones-mesa.module').then(m => m.OpcionesMesaPageModule)
  },
  {
    path: 'home-cliente',
    loadChildren: () => import('./pages/inicio-cliente/inicio-cliente.module').then(m => m.InicioClientePageModule)
  },
  {
    path: 'charts-encuesta-clientes',
    loadChildren: () => import('./pages/chartz-de-cliente/chartz-de-cliente.module').then(m => m.ChartzDeClientePageModule)
  },
  {
    path: "menu", component: MinutasComponent
  },
  {
    path: 'home-mestre',
    loadChildren: () => import('./pages/inicio-metre/inicio-metre.module').then(m => m.InicioMetrePageModule)
  },
  {
    path: 'home-mozo',
    loadChildren: () => import('./pages/inicio-mozo/inicio-mozo.module').then(m => m.InicioMozoPageModule)
  },
  {
    path: 'juego10', component: PreguntadosDiezComponent
  },
  {
    path: 'juego15', component: SimonQuinceComponent
  },
  {
    path: 'home-cocinero',
    loadChildren: () => import('./pages/inicio-cocinero/inicio-cocinero.module').then(m => m.InicioCocineroPageModule)
  },
  {
    path: 'home-bartender',
    loadChildren: () => import('./pages/inicio-bartender/inicio-bartender.module').then(m => m.InicioBartenderPageModule)
  },
  {
    path: 'chat-consulta',
    loadChildren: () => import('./pages/consultas/consultas.module').then(m => m.ConsultasPageModule)
  },
  {
    path: 'crear-cliente',
    loadChildren: () => import('./pages/crear-cliente/crear-cliente.module').then( m => m.CrearClientePageModule)
  },
  {
    path: 'inicio-bartender',
    loadChildren: () => import('./pages/inicio-bartender/inicio-bartender.module').then( m => m.InicioBartenderPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }


