import { Injectable } from '@angular/core';

export class Customer {
    address: string;
    dob: string;
    firstName: string;
    lastName: string;
    middleName: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
    constructor() { }
    customer: Customer;
    showInboxBadge = false;
}