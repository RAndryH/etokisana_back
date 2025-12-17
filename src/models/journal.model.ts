import { model, Schema } from "mongoose";

export interface IJournal{
    userId : string;
    codeProduit         : string;
    destination  : string;
    valeur  :number;
    productId : string;
}

export const JournalSchema = new Schema<IJournal>({
    userId : { type : String},
    codeProduit         : { type : String,required:true},
    destination  : { type : String},
    valeur : { type : Number},
    productId : { type : String}
},{
    timestamps : true,
    toJSON : {
        virtuals : true
    },
    toObject : {
        virtuals : true
    }
});

export const JournalModel = model<IJournal>('category',JournalSchema)