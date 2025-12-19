import { Schema, model } from "mongoose";

export interface Token{
    userId                   : string,
    token                : string,
    // createdAt            : Date,
}

export interface ITokenResponse {
  _id: string;
  userId: string;
  userNickName: string;
  userEmail: string;
  userName: string;
  userFirstname: string;
  userPhone: string;
  userTotalSolde: number;
  userStatut?: boolean;
  raisonSocial?: string;
  type?: string;
  rcs?: string;
  nif?: string;
  managerName?: string;
  managerEmail?: string;
  token: string;
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