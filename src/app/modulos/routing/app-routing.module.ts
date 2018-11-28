import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundRouteComponent } from './../../views/errors/not-found-route/not-found-route.component';
import { HomeComponent } from './../../componentes/home/home.component';
import { UsuariosComponent } from './../../componentes/usuarios/usuarios.component';
import { OrdenesComponent } from './../../componentes/ordenes/ordenes.component';
import { ConsultasOrdenesComponent } from 'src/app/componentes/ordenes/consultas-ordenes/consultas-ordenes.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/usuarios',
    pathMatch: 'full'
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "usuarios",
    component: UsuariosComponent
  },
  {
    path: "ordenes",
    component: OrdenesComponent
  },
  {
    path: "ordenes_pendientes",
    component: ConsultasOrdenesComponent
  },
  {
    path: "**",
    component: NotFoundRouteComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
