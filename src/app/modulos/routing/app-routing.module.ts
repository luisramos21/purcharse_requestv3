import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundRouteComponent } from './../../views/errors/not-found-route/not-found-route.component';
import { HomeComponent } from './../../componentes/home/home.component';
import { UsuariosComponent } from './../../componentes/usuarios/usuarios.component';
import { OrdenesComponent } from './../../componentes/ordenes/ordenes.component';
import { ConsultasOrdenesComponent } from 'src/app/componentes/ordenes/consultas-ordenes/consultas-ordenes.component';
import { AddComponent } from 'src/app/componentes/ordenes/add/add.component';


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
    component: OrdenesComponent,    
  },
  {
    path: "ordenes/add",
    component: AddComponent,    
  },
  {
    path: "ordenes_pendientes",
    component: ConsultasOrdenesComponent
  },
  {
    path: "ordenes_aprobadas",
    component: ConsultasOrdenesComponent
  },

  {
    path: "ordenes_aprobadas",
    component: ConsultasOrdenesComponent
  },
  {
    path: "ordenes_pendientes_entrada",
    component: ConsultasOrdenesComponent
  },

  {
    path: "ordenes_completas",
    component: ConsultasOrdenesComponent
  },
  {
    path: "ordenes_canceladas",
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
