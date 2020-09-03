import { Component } from '@angular/core';
import { CustomerService } from '../services/customer-service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(public customerSvc: CustomerService) {}

}
