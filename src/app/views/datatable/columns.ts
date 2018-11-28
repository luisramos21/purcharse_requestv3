export interface Columns {
    column?:string;
    title?:string;
    html?:boolean;
    get();
    cell?: (element: any)=>string;
    mrender(data):string;
    action?:boolean;
    action_edit?:boolean;
    action_remove?:boolean;
    action_view?:boolean;
    action_all?:boolean;
}
