import { model, Schema } from "mongoose";

export interface IOrder{
    orderType     :string;
    orderState    :string;
    orderMontant   :number;
    orderMethode  :string;
}
export const orderSchema = new Schema<IOrder>({
    orderType     :{type:String},
    orderMontant   :{type:Number},
    orderState    :{type:String},
    orderMethode  :{type:String}
},{
    timestamps : true,
    toJSON : {
        virtuals : true
    },
    toObject : {
        virtuals : true
    }
})

export const orderModel = model<IOrder>("order",orderSchema);