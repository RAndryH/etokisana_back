import { Schema, model } from "mongoose";

export interface IEmailConfiamtion{
    userId                  : string;
    userToken               : string;
}

export const EmailConfirmationSchema = new Schema<IEmailConfiamtion>({
    userId                  : {type : String, required : true, unique : true},
    userToken               : {type : String, required : true, unique : true},
},{
    timestamps : true,
    toJSON : {
        virtuals : true
    },
    toObject : {
        virtuals : true
    }
});

export const EmailConfirmationModel = model<IEmailConfiamtion>('user',EmailConfirmationSchema)