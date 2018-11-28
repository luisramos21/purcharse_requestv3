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
import { DialogoComponent, DialogoOverview ,DialogoConfirm} from '../componentes/dialogo/dialogo.component';
import { ConsultasOrdenesComponent } from '../componentes/ordenes/consultas-ordenes/consultas-ordenes.component';

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
    DialogoConfirm,
    ConsultasOrdenesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule
  ],
  entryComponents: [DialogoOverview,DialogoConfirm],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
