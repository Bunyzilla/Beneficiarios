import { SafeUrl } from '@angular/platform-browser';

export class User {
    idUser: Number;
    name: String;
    email: String;
    password: String;
    canCreateBen: boolean;
    canSeeExp: boolean;
    role: Number;
    haveImage: boolean;

    imageBlob: SafeUrl;

    constructor() {
        this.idUser = -1;
        this.name = "";
        this.email = "";
        this.password = "";
        this.canCreateBen = false;
        this.canSeeExp = false;
        this.role = 1;
        this.haveImage = false;

        this.imageBlob = "";
        
    }
}