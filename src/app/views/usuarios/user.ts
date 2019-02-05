export interface User {
    name: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    user_type_id: number;
    state: number;
    _id?:number;
    qr?:string;
} 
