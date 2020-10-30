import { SafeUrl } from '@angular/platform-browser';
import { NumberSymbol } from '@angular/common';

export class EconomicStudyForm {

    //Datos de la persona
    idEconomicStudyForm: number;
    idBeneficiary: number;
    medicalService: number;
    haveDisability: boolean;
    causeDisability: string;
    disabilityTime: string;
    haveChronicDisease: boolean;
    chronicDiseaseType: number;
    other: string;

    //Domicilio
    colony: string;
    street: string;
    number: string;
    postalCode: string;
    references: string;

    //Vivienda
    typeHousing: number;
    numberRooms: number;
    numberBathrooms: number;
    numberBedrooms: number;
    housingConditions: number;
    floor: number;
    ceiling: number;
    termsFurniture: number;
    timeAtHome: number;
    haveStove: boolean;
    haveCar: boolean;
    haveFridge: boolean;
    haveMicrowave: boolean;
    haveWashingMachine: boolean;
    haveComputer: boolean;
    haveTelevision: boolean;
    haveAirConditioning: boolean;

    houseDescription: string; //añadir a interfaz
    diagnostic: string; //añadir a interfaz
    creationDate: Date;

    //nuevos 
    monthlyIncome: number;
    monthlyFamilyIncome: number;
    feeding : number;
    phone: number;
    internet: number;
    gasoline: number;
    rent: number;
    monthlyPasses: number;
    light: number;
    predial: number;
    education: number;
    transport: number;
    water: number;
    gas: number;
    medicalExpenses: number;
    cableTV: number;
    dress: number;
    others: number;


    family: FamilyBeneficiarys[];
    //No mandar este objeto
    images: EvidenceImages[];



    constructor() {
        //Datos de la persona
        this.idEconomicStudyForm = -1;
        this.idBeneficiary = -1;
        this.medicalService = -1;
        this.haveDisability = false;
        this.causeDisability = "";
        this.disabilityTime = "";
        this.haveChronicDisease = false;
        this.chronicDiseaseType = -1;
        this.other = "";

        //Domicilio
        this.colony = "";
        this.street = "";
        this.number = "";
        this.postalCode = "";
        this.references = "";


        //Vivienda
        this.typeHousing = -1;
        this.numberRooms = 0;
        this.numberBathrooms = 0;
        this.numberBedrooms = 0;
        this.housingConditions = -1;
        this.floor = -1;
        this.ceiling = -1;
        this.termsFurniture = -1;
        this.timeAtHome = -1;

        this.haveStove = false;
        this.haveCar = false;
        this.haveFridge = false;
        this.haveMicrowave = false;
        this.haveWashingMachine = false;
        this.haveComputer = false;
        this.haveTelevision = false;
        this.haveAirConditioning = false;

        this.houseDescription = ""; //añadir a interfaz
        this.diagnostic = ""; //añadir a interfaz
        this.creationDate = new Date();

        //nuevos 
        this.monthlyIncome = 0;
        this.monthlyFamilyIncome = 0;
        this.feeding = 0;
        this.phone = 0;
        this.internet = 0;
        this.gasoline = 0;
        this.rent = 0;
        this.monthlyPasses = 0;
        this.light = 0;
        this.predial = 0;
        this.education = 0;
        this.transport = 0;
        this.water = 0;
        this.gas = 0;
        this.medicalExpenses = 0;
        this.cableTV = 0;
        this.dress = 0;
        this.others = 0;

        this.family = [];
        this.images = [];
    }
}

export class FamilyBeneficiarys {
    idFamilyBeneficiarys: number;
    idEconomicStudyForm: number;
    name: string;
    lastName: string;
    motherLastName: string;
    gender: number;
    birthDay: Date;
    scholarship: number;
    occupation: string;
    civilState: number;
    relationship: number;
    input: number;

    constructor() {
        this.idFamilyBeneficiarys = -1;
        this.idEconomicStudyForm = -1;
        this.name = "";
        this.lastName = "";
        this.motherLastName = "";
        this.gender = 0;
        this.birthDay = new Date();
        this.scholarship = -1;
        this.occupation = "";
        this.civilState = -1;
        this.relationship = -1;
        this.input = -1;
    }
}

export class EvidenceImages {
    idEvidenceImages: number;
    idEconomicStudyForm: number;
    type: number; //hay cuatro

    //En este viene la imagen
    source: string = '';
    //Aqui viene el archivo que se sube
    selectedFile: any;
    //Esta es la imagen desde el servidor
    imageBlob: SafeUrl;

    constructor() {
        this.idEvidenceImages = -1;
        this.idEconomicStudyForm = -1;
        this.type = -1;

        this.source = "";
        this.imageBlob = "";
        this.selectedFile = "";
    }
}