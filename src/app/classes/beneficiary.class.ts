import { SafeUrl } from '@angular/platform-browser';

export class Beneficiary {
    idBeneficiary: number;
    name: string;
    lastName: string;
    motherLastName: string;
    gender: number;
    birthDay: Date;
    phone1: string;
    phone2: string;
    civilStatus: number;
    occupation: string;
    scholarship: number;
    curp: string;
    rfc: string;
    active : boolean;
    idUserRegister : number;
    createDate : Date;
    haveImage: boolean;


    imageBlob: SafeUrl;

    constructor() {
        this.idBeneficiary = -1;
        this.name = "";
        this.lastName = "";
        this.motherLastName = "";
        this.gender = 0;
        this.birthDay = new Date();
        this.phone1 = "";
        this.phone2 = "";
        this.civilStatus = -1;
        this.occupation = "";
        this.scholarship = -1;
        this.curp = "";
        this.rfc = "";
        this.active = true;
        this.createDate = new Date();
        this.idUserRegister = -1;
        this.haveImage = false;

        this.imageBlob = "";
        
    }
}