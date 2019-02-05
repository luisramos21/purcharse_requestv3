import { Component, AfterViewInit, OnInit, ViewChild, Input } from '@angular/core';
import { DatatableComponent } from '../datatable/datatable.component';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { Columns } from 'src/app/views/datatable/columns';
import { Usuarios } from 'src/app/views/usuarios/usuarios';
import { AppComponent } from 'src/app/app.component';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { MatSnackBar } from '@angular/material';
import { User } from 'src/app/views/usuarios/user';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, AfterViewInit, Usuarios {

  displayedColumns: string[] = [];
  Title: string = "Listado de Usuarios";

  CustomColumns: [Columns] = [
    {
      get() {
        return this.column;
      },
      mrender(data) {
        return data;
      }
    }];
  DefColumns: string[] = ["Nombres", "Apellidos", "Nombre usuario", "Email", "Tipo usuario", "Estado", "Acciones"];
  TableData: [{}] = [{}];
  actions: any = {
    "Id": {
      "action": true,
      "edit": true,
      "remove": true,
      "view": false,
      "all": true
    },
    "Estado": {
      mrender: function (data) {
        return data == 1 ? "Activado" : "Desactivado";
      }
    }
  };
  /*INSTANCE TO DATATABLE */

  @ViewChild("datatable") datatable: DatatableComponent;
  @ViewChild("dialog") dialog: DialogoComponent;

  @Input() UsuariosForm: any = [
    {
      "element": "id",
      "title": "Id",
      "value": "",
      "inputType": "hidden"
    },
    {
      "element": "name",
      "title": "Nombre",
      "value": ""
    }, {
      "element": "lastname",
      "title": "Apellidos",
      "value": ""
    }, {
      "element": "email",
      "title": "Email",
      "value": ""
    }, {
      "element": "state",
      "title": "Estado",
      "type": "checkbox",
      "value": ""
    }, {
      "element": "user_type_id",
      "title": "Tipo usuario",
      "value": "",
      "type": "select",
      "options": []
    }, {
      "element": "username",
      "title": "Nombre de usuario",
      "value": ""
    }, {
      "element": "password",
      "title": "Contraseña",
      "value": ""
    }
  ];
  User: {};
  /**
   * save all types users 
   */
  UsersTypes: [];

  /**
   * save all options of the types users 
   */
  TypeUsersOptions: any = [];

  constructor(private service: UsuariosService,
    private app_component: AppComponent, private snackBar: MatSnackBar) { }

  onNotify(options: {}): void {

    if (options['action'] == "edit") {

      this.getUser(options['data']);
    } else if (options['action'] == "EditUser") {

      this.PrepareUser(options);

    } else if (options['action'] == "remove") {

      this.removeUser(options['data']);

    } else if (options['action'] == "remove") {

      this.viewUser(options['data']);

    }


    console.log("onNotify : UsuariosComponent", options)
    //this.app_component.test();
  }

  /*Prepare Structure for save in table user */

  PrepareUser(options: {}): any {

    if (typeof options["data"] != 'undefined' &&  typeof options["data"]["form"] != 'undefined') {
      var tempUser: User = {
        _id: 0,
        name: "",
        lastname: "",
        username: "",
        password: "",
        email: "",
        user_type_id: 0,
        state: 0,
        qr: "save"
      };
      var data = options["data"]["form"];
      console.log(data)
      /** Save User interface */
      for (let i in data) {

        if (data[i]["element"] == 'state') {
          data[i]["value"] = data[i]["value"] == true ? 1 : 0;
        }

        if (data[i]["element"] == 'id') {
          data[i]["element"] = "_id";
        }
        if (typeof tempUser[`${data[i]["element"]}`] == 'undefined') {
          tempUser[`${data[i]["element"]}`] = "";
        }

        tempUser[`${data[i]["element"]}`] = data[i]["value"];
      }
      if (tempUser._id > 0) {
        tempUser.qr = "update";
      }

      /*send User to service */
      this.setUser(tempUser);
    }
  }

  getUser(user: number): void {

    this.service.getUsers(user)
      .subscribe(data => {
        this.service.cleanId();
        this._editUser(data, false);
      }
        , error => this._editUser([], true))

  }

  setUser(user: User): void {
    this.service.saveUser(user)
      .subscribe(data => {
        this.showMessaje("Usuario Guardado");
        this.listOfUsers();
      }, (error) => {
        this.showMessaje("No se pudo Guardar el Usuario");
      })
  }

  private showMessaje(message: string, clase?: string[] | string, duracion?: number, callback?: Function, new_messaje?: boolean) {

    let duration: number = 1000;
    let _clase: string | string[] = ['clase'];

    if (duracion) {
      duration = duracion;
    }

    if (clase) {
      _clase = clase;
    }
    let snackBar = this.snackBar;
    if (new_messaje) {
      //snackBar = MatSnackBar;
    }
    snackBar.open(message, "Aceptar", {
      duration: duration,
      panelClass: _clase
    });
    if (callback) {
      this.snackBar._openedSnackBarRef.afterDismissed().subscribe(() => {
        callback();
      });
    }

  }

  getTypesUsers(): void {

    if (!this.UsersTypes) {
      this.app_component.setProgress(30);
      this.service.getUserTypes()
        .subscribe((data => {
          this.app_component.setProgress(100)
          this.UsersTypes = data['data']
        })
          , error => {
            this.app_component.setProgress(50)
            this.UsersTypes = []
          })
    } else {
      console.log("Ya existen Tipo de Usuarios Cargados")
    }

  }

  _editUser(data: any, error: boolean): void {

    if (error || !data || data.length == 0) {
      alert("No se pudo consultar la Informacion del Usuario")
    } else {
      this.User = data['data'][0];
      let index: number = 0;
      this.UsuariosForm.forEach(ele => {
        if (this.User && this.User[ele.element]) {
          if (ele.element == "state") {
            this.User[ele.element] = this.User[ele.element] == 1 ? true : false;
          }
          if (ele.element == "user_type_id") {

            if (this.UsersTypes && !this.TypeUsersOptions || this.TypeUsersOptions && this.TypeUsersOptions.length == 0) {

              this.UsersTypes.forEach(item => {

                this.TypeUsersOptions.push({
                  option: item["Perfil"],
                  value: item["Id"]
                });

              });

              this.UsuariosForm[index].options = this.TypeUsersOptions;
            } else if (!this.UsersTypes) {
              console.error("this.UsersTypes is undefined");
            } else if (!this.TypeUsersOptions) {
              console.error("this.TypeUsersOptions is empty");
            }
          }
          this.UsuariosForm[index].value = this.User[ele.element];

        }
        index++;
      })

      this.dialog.OpenDialog(
        {
          'action': 'EditUser',
          form: this.UsuariosForm,
          title: "Editar Usuario"
        }
      );
      this.app_component.setProgress(100);
    }
  }

  public test(): void {
    alert("Test")
  }

  removeUser(user: number): void {
    /**
     * check if isset user
     */
    this.service.getUsers(user)
      .subscribe((data) => {

        data = data["data"][0]
        this.dialog.OpenDialog(
          {
            json: data,
            'action': 'RemoveUser',
            title:
              `Estas seguro de eliminar este usuario ${data['name']}`
          }, 1);
      }
        , (error) => {
          console.error("Ha habido error al intentar consultar el usuario #" + user)
        })
  }

  viewUser(user: number): void {

  }

  /* after loader view  */
  ngOnInit() {

  }

  ngAfterViewInit() {
    this.listOfUsers();
  }

  listOfUsers(): void {

    this.service.getUsers()
      .subscribe(data => {
        this.setDatatable(data, false)
      }
        , error => this.setDatatable([], true));
  }

  setDatatable(data: any, error: boolean): void {

    this.app_component.setProgress(30);
    this.datatable.options__setDataKey = {
      'data': data,
      'columns_header': this.DefColumns,
      'RemoveIndexs': [],
      'actions': this.actions,
      'error': error
    };

    this.datatable._setDataKey(this.datatable.options__setDataKey);
    
    /* GET ALL TYPE OF THE USERS */
    this.getTypesUsers();
  }

}
