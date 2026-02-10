import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DesignationCreate, DesignationResponse } from "../models/designation.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DesignationService{

    private apiUrl ='http://localhost:8080/api/designations'

    constructor(private http:HttpClient){}

    createDesignation(request:DesignationCreate):Observable<DesignationResponse>{
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post<DesignationResponse>(this.apiUrl, request, { headers });
    }

    getAllDesignation():Observable<DesignationResponse[]>{
        const timestamp = new Date().getTime(); 
        const headers = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        return this.http.get<DesignationResponse[]>(`${this.apiUrl}?t=${timestamp}`, { headers });
    }

}