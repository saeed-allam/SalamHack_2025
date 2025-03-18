export class SystemConfigModel {
    constructor(
        public version: string = '',
        public production: boolean = false,
        public serverUrl: string = '',
        public domain: string = '',
        public subDomain: string = '',
    ) {}
}
