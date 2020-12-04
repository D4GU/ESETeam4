import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Item} from "../models/item";
import {BuyComponent} from "../item-card/buy-dialog/buy-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-detailed-item',
  templateUrl: './detailed-item.component.html',
  styleUrls: ['./detailed-item.component.css']
})
export class DetailedItemComponent implements OnInit {
  itemId;
  item: Item = new Item(null,null,null,null,null,null,null,null, null,null, null);
  sellerId;
  seller;
  sellerRating;
  amountOfReviews = 'this seller has no review yet';
  otherArticles;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private httpClient: HttpClient, private router: Router) {
    this.route.params.subscribe( params => this.itemId = params.id);
  }

  ngOnInit(): void {
    this.httpClient.get(environment.endpointURL + 'item/getItem/' + this.itemId, {
    }).subscribe((data: any) => {
      this.sellerId = data.userId;
      this.item = new Item(data.itemId, data.title, data.description, data.location, data.price, data.productType,
        data.transactionType, data.delivery, data.createdAt, data.encodedPicture, data.labeljson);
      console.log(this.item);
      this.httpClient.get(environment.endpointURL + 'user/getSpecific/' + this.sellerId, {
      }).subscribe((res: any) => {
        console.log(res)
        this.seller = res;
      });

      this.httpClient.get(environment.endpointURL + 'item/getReviews/' + this.sellerId, {
      }).subscribe((res: any) => {
        console.log(res[0])
        if(res[0]>0){
          this.amountOfReviews = ' based on ' + res[1] + ' reviews';
        }
        this.sellerRating = res[0]  + 0.5;
      },(err: any) => {console.log('test')});

    }, (err: HttpErrorResponse) => {
      this.router.navigateByUrl('/pageNotFound', { skipLocationChange: true });
    });



  }
  openDialog(itemId): void {
    itemId = itemId
    const dialogRef = this.dialog.open(BuyComponent, {
      width: '250px',
      data: itemId
    });
  }
}