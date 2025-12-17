import mongoose, { model, Schema } from "mongoose";
import { ICartItem } from "./cartItem.model";

export interface ITransaction{
    // _id         : string ;
    userId      : string ;
    siteDepartId: string ;
    siteArriveId: string ;
    typeES      : string ; 
    montantTotal: number ;
    statut      : string ;
    productList : [object] ;
}
export const TransactionSchema = new Schema<ITransaction>({
    // _id         : {type:String},
    userId      :{ type:String, required:true },
    siteDepartId:{ type:String,ref:'site'},
    siteArriveId:{ type:String, required:true,ref:'site'},
    typeES      :{ type:String, required : true },
    montantTotal:{ type:Number, required:true },
    statut      :{ type:String },
    productList :{ type: [Object] },
},{
    timestamps : true,
    toJSON : {
        virtuals : true
    },
    toObject : {
        virtuals : true
    }
})

export const TransactionModel = model<ITransaction>("transaction",TransactionSchema);