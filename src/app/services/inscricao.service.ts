import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InscricaoConvidado } from '../models/inscricao.model';

@Injectable({
  providedIn: 'root'
})
export class InscricaoService {

  private apiUrl = 'http://localhost:21185/api'; // URL base da API

  constructor(private http: HttpClient) { }

  // Validar token da URL única
  validarToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/urls-unicas/token/${token}`);
  }

  // Enviar inscrição do convidado
  enviarInscricao(inscricao: InscricaoConvidado): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscricoes`, inscricao);
  }
}
