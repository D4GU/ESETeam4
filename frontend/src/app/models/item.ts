export class Item {

  constructor(
    public itemId: number,
    public title: string,
    public description: string,
    public location: string,
    public price: number,
    public transactionType: string,
    public delivery: boolean,
    public date: Date



    ) { }
}
