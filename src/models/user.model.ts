import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT } from "../Utils/constant/constant";

export interface User {
    // _id              : string,
    userNickName: string;
    userName: string;
    userFirstname: string;
    userPassword: string;
    userEmail: string;
    userPhone: string;
    userType: string;
    userTotalSolde: number;
    userAccess: string;
    // userparrainID        : string;
    userValidated: boolean;
    userEmailVerified: boolean;
    userDateOfBirth: Date;
    userAddress: string;
    userMainLat: number;
    userMainLng: number
    userId: string;
    userImage: string;
    identityCardNumber: string;
    identityDocument: string[];
    documentType: string;
    raisonSocial: string;
    type: string;
    rcs: string;
    carteStat: string;
    nif: string;
    carteFiscal: string[];
    logo: string;
    managerName: string;
    managerEmail: string;
    parrain1ID: string;
    parrain2ID: string;
}

export const UserSchema = new Schema<User>({
    // _id                     : { type : String},
    userNickName: { type: String },
    userName: { type: String },
    userFirstname: { type: String },
    userPassword: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userPhone: { type: String },
    userType: { type: String, required: true },
    userTotalSolde: { type: Number },
    userAccess: { type: String, required: true },
    // userparrainID            : { type : String},
    userAddress: { type: String },
    userValidated: { type: Boolean },
    userEmailVerified: { type: Boolean },
    userMainLat: { type: Number },
    userMainLng: { type: Number },
    userId: { type: String, required: true, unique: true },
    userImage: { type: String },
    userDateOfBirth: { type: Date },
    identityCardNumber: { type: String },
    identityDocument: { type: [String] },
    documentType: { type: String },
    raisonSocial: { type: String },
    nif: { type: String },
    rcs: { type: String },
    type: { type: String },
    managerName: { type: String },
    managerEmail: { type: String },
    logo: { type: String },
    carteStat: { type: String },
    carteFiscal: { type: [String] },
    parrain1ID: { type: String },
    parrain2ID: { type: String },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('userPassword')) return next();
    this.userPassword = await bcrypt.hash(this.userPassword, BCRYPT_SALT);
    next();
});

// Comparaison du mot de passe
UserSchema.methods.comparePassword = async function(pw: any) {
  return bcrypt.compare(pw, this.password);
};

export const UserModel = model<User>('user', UserSchema)