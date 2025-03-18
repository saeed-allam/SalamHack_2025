import { Subject } from 'rxjs';
import { HttpRequest } from '@angular/common/http';

export class PendingRequest {
    req: HttpRequest<any>;
    subscription: Subject<any>;

    constructor(req: HttpRequest<any>, subscription: Subject<any>) {
        this.req = req;
        this.subscription = subscription;
    }
}
