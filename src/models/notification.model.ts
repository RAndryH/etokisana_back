import { model, Schema } from "mongoose";

export interface INotification{
    userId  : string;
    title   : string;
    message : string ;
    state  : string ;
}
export const NotificationSchema = new Schema<INotification>({
    userId  : { type : String,required:true},
    title   : { type : String, required : true},
    message : { type : String},
    state  : { type : String, required : true},
},{
    timestamps : true,
    toJSON : {
        virtuals : true
    },
    toObject : {
        virtuals : true
    }
})
export const NotificationModel = model<INotification>('notification',NotificationSchema)