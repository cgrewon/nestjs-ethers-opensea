export class MetaDataModel {
    id;
    address;
    quantity;
    schema;
  
    constructor(data) {
      if (data) {
        if (data.asset) {
          this.id = data.asset.id;
          this.address = data.asset.address;
          this.quantity = data.asset.quantity;
        }
  
        this.schema = data.schema;
      }
    }
  }