export class UserProfile {
    constructor(
        public id: string = null,
        public email: string = null,
        public emailConfirmed: boolean = false,
        public phoneNumber: string = null,
        public userName: string = null,
        public name: string = null,
        public photo: any = null,
        public phoneNumberConfirmed: boolean = false,
        public birthDate: any = null,
        public genderId: number = null
    ) {}
}
