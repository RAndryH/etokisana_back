import { Schema, model } from "mongoose";

export interface Token{
    userId                   : string,
    token                : string,
    // createdAt            : Date,
}
export const TokenSchema = new Schema<Token>({
    userId                   : {type : String, required : true},
    token                : {type : String, required : true},
    // createdAt            : {type : Date, required : true, default: Date.now,expires:3600},
},{
    timestamps : true,
    expireAfterSeconds:3600,
    toJSON : {
        virtuals : true
    },
    toObject : {
        virtuals : true
    }
});
export const TokenModel = model<Token>('token',TokenSchema)