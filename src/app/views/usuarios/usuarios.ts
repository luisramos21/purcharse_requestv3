export interface Usuarios {

    setDatatable(data: any, error: boolean): void;

    getUser(user: number): void;

    removeUser(user: number): void;

    viewUser(user: number): void;
    
    listOfUsers(): void
}
