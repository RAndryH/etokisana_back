import { model, Schema } from "mongoose";

export interface IDepotItem{
    currentDepotId : string,
    productId : string,
    stock: number,
    prix   : number,
    lastUpdate : Date,
}
export const DepotItemSchema = new Schema<IDepotItem>({
    
    currentDepotId : {type : String,ref:'site'},
    productId : {type : String,ref:'product'},
    stock: {type : Number},
    prix   : {type : Number},
    lastUpdate : {type : Date},
},{
    timestamps : true,
    toJSON : {
        virtuals : true
    },
    toObject : {
        virtuals : true
    }
});

export const DepotItemModel = model<IDepotItem>('depotItem',DepotItemSchema)