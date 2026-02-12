import { HttpClient } from "@angular/common/http";
import { DesignationCreate, DesignationResponse } from "../models/designation.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DesignationService {

    private apiUrl = 'http://localhost:8080/api/designations'

    constructor(private http: HttpClient) { }

    createDesignation(request: DesignationCreate): Observable<DesignationResponse> {
        return this.http.post<DesignationResponse>(this.apiUrl, request);
    }

    getAllDesignation(): Observable<DesignationResponse[]> {
        return this.http.get<DesignationResponse[]>(this.apiUrl);
    }

}