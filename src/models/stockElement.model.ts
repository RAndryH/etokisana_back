import { model, Schema } from "mongoose";

export interface IstockElement{
    depotId:string;
    productId:string;
    quantity:number;
}
export const StockElementSchema = new Schema<IstockElement>({
    depotId : { type : String,required : true},
    productId: { type : String , required : true},
    quantity : { type : Number},
},{
    timestamps:true,
    toJSON : {
        virtuals : true
    },
    toObject : {
        virtuals : true
    }
})

export const StockElementModel= model<IstockElement>("stockElement",StockElementSchema);