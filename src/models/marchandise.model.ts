import { Product } from "./product.model";

// import { model, Schema } from "mongoose";
export interface IMarchandise{
    productId : Product,
    stock: number,
    prix   : number,
    montant : number,
    departId : string,
    destinationId : string,
}