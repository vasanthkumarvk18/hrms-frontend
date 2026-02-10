export interface Designations{
    id : number;
    name : string;
    level : number;
}

export interface DesignationCreate{
    name : string;
    level : number;
}

export interface DesignationResponse{
    id : number;
    name : string;
    level : number;
}