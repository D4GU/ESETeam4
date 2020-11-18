import { UserWalletComponent } from './../user-overview/user-wallet/user-wallet.component';
import { environment } from './../../environments/environment.prod';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { HttpClient } from '@angular/common/http';
import { PrintSharp } from '@material-ui/icons';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit  {
  isLinear = true;
  panelOpenState = false;
  userToken;
  userName;
  userId;
  itemIds;
  data;
  notifier = false;
  price;
  disableAnimation = true;
  wallet;
  
  account = false;
  address: any;
  order: any;
  payment: any;

  shippingAddress: FormGroup;
  
  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder,public dialogRef: MatDialogRef<CheckoutComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any ) { }
  
  ngOnInit() {
    
    this.shippingAddress = this.formBuilder.group({
      userId: [localStorage.getItem("userId")],
      street: ["", Validators.required],
      zipCode: [0, Validators.required],
      city: ["", Validators.required],
      country: ["",Validators.required],
      
    })
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => this.disableAnimation = false);
  }
 
  getAddress(): void {
    this.httpClient.get(environment.endpointURL + 'user/getSpecific/'+localStorage.getItem("userId")).subscribe((res: any) => { 
      this.data = res
      if(this.shippingAddress.invalid){
        this.shippingAddress.patchValue(this.data)
      }
    });
    this.changeAddress()
  }


  changeAddress(): void {
    this.httpClient.put(environment.endpointURL + 'order/change/'+ localStorage.getItem("orderId"), this.shippingAddress.value).subscribe((res:any) =>{})
  }

  loggedInMethod(): string {
    return localStorage.getItem('userToken');
  }

  closeDialog(){
    this.dialogRef.close()
  }
  completeTransaction(){
    this.httpClient.get(environment.endpointURL + 'user/getSpecific/' + localStorage.getItem('userId'), {}).subscribe((res: any) =>{
      this.wallet = res.wallet;
    });
    this.httpClient.get(environment.endpointURL + 'order/getUserOrder/' + localStorage.getItem('userId'), {}).subscribe((res: any) =>{
      this.price = res.price
      if(this.wallet >= this.price){
        this.httpClient.put(environment.endpointURL + 'user/minusWallet/'+ localStorage.getItem('userId'), { "price": this.price}).subscribe((res:any) => {});
        
        this.httpClient.put(environment.endpointURL + 'order/change/'+ localStorage.getItem('orderId'), {status: "complete"}).subscribe((res: any) => {});
        this.httpClient.put(environment.endpointURL + 'item/completeTransaction/'+ localStorage.getItem('userId')+"/"+localStorage.getItem("orderId"), null).subscribe((res: any) => {

        });
       


        localStorage.removeItem("orderId")
        this.notifier = false;
        this.dialogRef.close()
      } else {
        this.notifier = true;
      }

    });
  }
  
}
