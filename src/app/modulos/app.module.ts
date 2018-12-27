import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from '../app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './routing/app-routing.module';

import { MaterialModule } from './material/material/material.module';
import { NotFoundRouteComponent } from '../views/errors/not-found-route/not-found-route.component';
import { HomeComponent } from '../componentes/home/home.component';
import { MenuItemsComponent } from '../componentes/menu-items/menu-items.component';
import { DatatableComponent } from '../componentes/datatable/datatable.component';
import { UsuariosComponent } from '../componentes/usuarios/usuarios.component';
import { OrdenesComponent } from '../componentes/ordenes/ordenes.component';
import { DialogoComponent, DialogoOverview ,DialogoConfirm,DialogNewOrder} from '../componentes/dialogo/dialogo.component';
import { ConsultasOrdenesComponent } from '../componentes/ordenes/consultas-ordenes/consultas-ordenes.component'
import { AddComponent } from '../componentes/ordenes/add/add.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundRouteComponent,
    HomeComponent,
    MenuItemsComponent,
    DatatableComponent,
    UsuariosComponent,
    OrdenesComponent,
    DialogoComponent,
    DialogoOverview,
    DialogNewOrder,
    DialogoConfirm,
    ConsultasOrdenesComponent,
    AddComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule
  ],
  entryComponents: [DialogoOverview,DialogoConfirm,DialogNewOrder],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
