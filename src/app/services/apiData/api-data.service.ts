import { Beneficiary } from './../../classes/beneficiary.class';
import { User } from './../../classes/user.class';
import { Injectable } from '@angular/core';
import { deployConf } from './../../utils/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ServerMessage } from '../../classes/serverMessage.class';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { EconomicStudyForm } from '../../classes/economicStudyForm.class';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  baseURL: string = deployConf.apiUrl;
  token: String;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  setToken(newToken: String) {
    this.token = newToken;
  }
  //TO DO : Implementacion Servidor
  //Las imágenes se deben de cargar cada que se quieren mostrar de la siguiente manera para que 
  //en caso de que cambien las imágenes las imagenes se cargan en variables y asi
  // estas no se carguen por la cache del navegador que renderiza el html porque el sanitizador de angular cambia la url cada
  //que lo generas
  getImage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.get(url, { headers: headers, responseType: 'blob' })
        .pipe(
          timeout(2000),
          catchError(e => {
            // do something on a timeout
            //reject(e);
            return of(null);
          })
        ).subscribe((imageBlob) => {
          let objectURL = "";
          if (imageBlob != null && imageBlob != undefined) {
            objectURL = URL.createObjectURL(imageBlob);
          }
          resolve(this.sanitizer.bypassSecurityTrustUrl(objectURL));
        }, (error: ServerMessage) => {
          reject(error)
        });
    })
  }

  //USER END-POINTS
  doLogin(email: String, password: String) {
    return new Promise((resolve, reject) => {
      const data = { email: email, password: password };

      this.http.post(this.baseURL + 'login', data, {}).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }

  getUserData(token: String) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })

      this.http.get(this.baseURL + 'login/validate-token', { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }



  getUsersData() {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })

      this.http.get(this.baseURL + 'user/user-list', { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }

  async createUser(user: User) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })

      this.http.post(this.baseURL + 'user/create-user', user, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }

  async updateUser(updatedUser: User) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.post(this.baseURL + 'user/update-user', updatedUser, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }

  async deleteUser(idUserForDelete : string) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.get(this.baseURL + 'user/delete-user/'+idUserForDelete, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }
  
    async changePasswordUser(idUser : Number,newPassword : String,){
      return new Promise((resolve,reject)=>{
        const data = {
          idUser : idUser,
          newPassword : newPassword,
        };
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+this.token,
        });
  
        this.http.post(this.baseURL + 'user/change-user-pass',data,{headers:headers}).subscribe((response : ServerMessage)=>{
          resolve(response);
        },(error)=>{
          reject(error)
        });
      })
    }
    
  async uploadImageUser(formData: FormData) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.post(this.baseURL + 'uploads/user-image/', formData, { headers: headers })
        .subscribe((res: ServerMessage) => {
          if (res.error == false) {
            resolve(res);
          } else if (res.error == undefined) {
            console.log("error no llego nada");
            reject(res);
          } else {
            resolve(res);
          }
        }, (error) => {
          reject(error);
        });
    });
  }

  deleteImageUser(idUser) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
      });
      this.http.get(this.baseURL + 'uploads/user-delete-image/' + idUser, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(new ServerMessage(true, "A ocurrido un error inesperado", error));
      });
    });
  }

  async createBeneficiary(newBeneficiary: Beneficiary) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.post(this.baseURL + 'beneficiary/create-beneficiary', newBeneficiary, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }

  async updateBeneficiary(updatedBeneficiary: Beneficiary) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.post(this.baseURL + 'beneficiary/update-beneficiary', updatedBeneficiary, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }

  async getBeneficiaryData( idBeneficiary : number ) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })

      this.http.get(this.baseURL + 'beneficiary/get-beneficiary/'+idBeneficiary, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }

  async deleteBeneficiaryData( idBeneficiary : number ) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })

      this.http.get(this.baseURL + 'beneficiary/delete-beneficiary/'+idBeneficiary, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }

  async getBeneficiaryList( ) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })

      this.http.get(this.baseURL + 'beneficiary/beneficiary-list/', { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }

  async uploadImageBeneficiary(formData: FormData) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.post(this.baseURL + 'uploads/beneficiary-image/', formData, { headers: headers })
        .subscribe((res: ServerMessage) => {
          if (res.error == false) {
            resolve(res);
          } else if (res.error == undefined) {
            console.log("error no llego nada");
            reject(res);
          } else {
            resolve(res);
          }
        }, (error) => {
          reject(error);
        });
    });
  }

  deleteImageBeneficiary(idBeneficiary) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
      });
      this.http.get(this.baseURL + 'uploads/beneficiary-delete-image/' + idBeneficiary, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(new ServerMessage(true, "A ocurrido un error inesperado", error));
      });
    });
  }

  //Expedientes o formularios

  async createEconomicStudyForm(newEconomicStudyForm: EconomicStudyForm) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.post(this.baseURL + 'economic-study-form/create-economic-study-form', newEconomicStudyForm, { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }

  async uploadEconomicStudyForm(formData: FormData) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
      });

      this.http.post(this.baseURL + 'uploads/form-image/', formData, { headers: headers })
        .subscribe((res: ServerMessage) => {
          if (res.error == false) {
            resolve(res);
          } else if (res.error == undefined) {
            console.log("error no llego nada");
            reject(res);
          } else {
            resolve(res);
          }
        }, (error) => {
          reject(error);
        });
    });
  }

  //EJEMPLO DE USO DEL METODO GET 
  /* async getRespuestas( entidad : string ) {
    return new Promise(async (resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.user.token
      })
       
      this.http.get(this.baseURL + 'user/obtener-respuestas',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    });
  } */

  //EJEMPLO DE USO DEL METODO POST 
  /* async saveRespuestas(respuestas : any){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.user.token
      });

      this.http.post(this.baseURL + 'user/save-respuestas',respuestas,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  } */
}
