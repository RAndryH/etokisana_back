import { Product } from "./product.model";

// import { model, Schema } from "mongoose";
export interface ICartItem{
    depotItem : string,
    quantity: number,
    price   : number,
    montant : number,
}