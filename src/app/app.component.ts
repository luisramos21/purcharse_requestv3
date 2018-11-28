import { Component, Input } from '@angular/core';
import { MenuInterface } from './views/menu/menu-interface';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'purch-req-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  _Title = "Inicio";
  title = this._Title;
  @Input() progress: number = 0;
  _component: Component;
  /* 
    @onActivate if change component
  */
  onActivate(component) {
    //console.log("onActivate", component);
    this._component = component;
    if (component.Title) {
      this.title = component.Title;
    } else {
      this.title = this._Title;
    }
  }

  download() {
    let doc = new jsPDF();

    doc.text("TEXTO DE PRUEBA", 10, 10);
    doc.save('Test.pdf');
  }

  /**
   * 
   * @param progress 
   * return none
   */
  setProgress(progress: number): void {
    if (progress + this.progress > 100) {
      progress = 0;
    }
    this.progress = progress;
  }

  test() {
    console.log("Accediendo a APP")
  }
  onDeactivate(component) {
    this.setProgress(0);
    //console.log("onDeactivate",component)
  }

  routes: MenuInterface[] = [
    {
      link: "/",
      title: "Inicio",
      icon: 'home'
    },
    {
      title: "Consultas",
      icon: 'search',
      items: [
        {
          link: "/ordenes_pendientes",
          title: "Ordenes Pendientes",
        },
        {
          link: "/ordenes_aprobadas",
          title: "Ordenes Aprobadas",
        },
        {
          link: "/ordenes_procesadas",
          title: "Ordenes Procesadas",
        },
        {
          link: "/ordenes_pendientes_entrada",
          title: "Ordenes Pendientes Entradas",
        },
        {
          link: "/ordenes_completas",
          title: "Ordenes Completas",
        },
        {
          link: "/ordenes_canceladas",
          title: "Ordenes Canceladas",
        },
        {
          link: "/productos_borrados",
          title: "Productos Borrados",
        }
        ,
        {
          link: "/consultar_productos",
          title: "Consultar Productos",
        }
      ]
    },
    {
      title: "Ordenes de Compra",
      icon: 'reorder',
      items: [
        {
          link: "/ordenes",
          title: "Mis Ordenes",
        },
        {
          link: "/entradas",
          title: "Entradas",
        },
        {
          link: "/pendientes_aprobacion",
          title: "Pendientes por Aprobación",
        },
        {
          link: "/pendientes_procesar",
          title: "Pendientes por Procesar",
        },
        {
          link: "/ordenes_borradas",
          title: "Ordenes Borradas",
        }
      ]
    },
    {
      link: "/administration",
      title: "Administración",
      icon: 'build',
      items: [
        {
          link: "/usuarios",
          title: "Usuarios",
          icon: 'person'
        },
        {
          link: "/permisos",
          title: "Permisos",
          icon: 'person'
        },
        {
          link: "/perfiles",
          title: "Perfiles",
          icon: 'people'
        }, {
          link: "/prioridades",
          title: "Prioridades",
          icon: 'compare_arrows'
        }
      ]
    },
    {
      link: "/configuration",
      title: "Configuracion",
      icon: 'settings_applications'
    }
  ];

}
