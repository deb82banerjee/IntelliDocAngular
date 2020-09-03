import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer, CustomerService } from '../services/customer-service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  customer: Customer;
  constructor(public customerSvc: CustomerService) {

  }
  ngOnInit() {
    this.customer = this.customerSvc.customer;
    this.customerSvc.showInboxBadge = false;
  }
  ngOnDestroy() {
    this.customerSvc.customer = null;
  }
}
