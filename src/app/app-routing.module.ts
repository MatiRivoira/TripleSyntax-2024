import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./paginas/splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./paginas/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'dueno-supervisor',
    loadChildren: () => import('./paginas/homes/dueno-supervisor/dueno-supervisor.module').then( m => m.DuenoSupervisorPageModule)
  },
  {
    path: 'inicio-cliente',
    loadChildren: () => import('./paginas/homes/inicio-cliente/inicio-cliente.module').then( m => m.InicioClientePageModule)
  },
  {
    path: 'metre',
    loadChildren: () => import('./paginas/homes/metre/metre.module').then( m => m.MetrePageModule)
  },
  {
    path: 'inicio-cliente/mesa',
    loadChildren: () => import('./paginas/mesa/mesa.module').then( m => m.MesaPageModule)
  },
  {
    path: 'mozo',
    loadChildren: () => import('./paginas/homes/mozo/mozo.module').then( m => m.MozoPageModule)
  },
  {
    path: 'cocinero',
    loadChildren: () => import('./paginas/homes/cocinero/cocinero.module').then( m => m.CocineroPageModule)
  },
  {
    path: 'bartender',
    loadChildren: () => import('./paginas/homes/bartender/bartender.module').then( m => m.BartenderPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./paginas/chat/chat.module').then( m => m.ChatPageModule)
  },  {
    path: 'encuesta-cliente',
    loadChildren: () => import('./paginas/encuesta-cliente/encuesta-cliente.module').then( m => m.EncuestaClientePageModule)
  },
  {
    path: 'graficos',
    loadChildren: () => import('./paginas/graficos/graficos.module').then( m => m.GraficosPageModule)
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
