import { Beneficiary } from './beneficiary.class';
import { FamilyBeneficiarys as FamilyBeneficiary } from './economicStudyForm.class';
import { SafeUrl } from '@angular/platform-browser';

export class Registry {
    idRegistry: number;
    idBeneficiary: number;
    year: number; // opc table
    month: string; //opc table
    idFamilyBeneficiarys: number;
    pickUpPantry: boolean;
    justification: string;
    idUserRegister: number;
    createdAt: Date;

    personPickUpPantry: FamilyBeneficiary;

    constructor() {
        this.idRegistry = -1;
        this.idBeneficiary = -1;
        this.year = -1; // opc table
        this.month = "enero"; //opc table
        this.idFamilyBeneficiarys = -1;
        this.pickUpPantry = false;
        this.justification = "";
        this.idUserRegister = -1;

        this.personPickUpPantry = new FamilyBeneficiary();
    }
}

export class RegistryYear {
    idRegistry: number;
    fullName: string;
    haveImage: boolean;
    idBeneficiary: number;
    imageBlob: SafeUrl;

    records: {
        enero: Registry;
        febrero: Registry;
        marzo: Registry;
        abril: Registry;
        mayo: Registry;
        junio: Registry;
        julio: Registry;
        agosto: Registry;
        septiembre: Registry;
        octubre: Registry;
        noviembre: Registry;
        diciembre: Registry;
    };
    personPickUpPantry: FamilyBeneficiary;

    constructor() {
        this.idRegistry = -1;
        this.fullName = "";
        this.haveImage = false;
        this.idBeneficiary = -1;
        this.imageBlob = "";

        this.records = {
            enero: new Registry(),
            febrero: new Registry(),
            marzo: new Registry(),
            abril: new Registry(),
            mayo: new Registry(),
            junio: new Registry(),
            julio: new Registry(),
            agosto: new Registry(),
            septiembre: new Registry(),
            octubre: new Registry(),
            noviembre: new Registry(),
            diciembre: new Registry(),
        };

        this.personPickUpPantry = new FamilyBeneficiary();
    }
}