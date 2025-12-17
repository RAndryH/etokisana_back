import { Schema, model } from "mongoose";

export interface Product{
    // _id                 : string,
    codeCPC             :string;
    productName         :string;
    productDescription  :string;
    productCategory     :string;
    productState        :string;
    productImage        :string[];
    productOwnerId      :string;
    productValidation   :boolean;
    productVolume       :string;
    productHauteur      :string;
    productLargeur      :string;
    productLongueur     :string;
    productPoids        :string;
    isStocker           :boolean;
}

export const ProductSchema = new Schema<Product>({
    // _id                 : {type : String},
    codeCPC             : {type : String},
    productName         : {type : String},
    productDescription  : {type : String},
    productCategory     : {type : String},
    productState        : {type : String},
    productImage        : {type : [String]},
    productOwnerId      : {type : String},
    productValidation   : {type : Boolean},
    productVolume       : {type : String},
    productHauteur      : {type : String},
    productLargeur      : {type : String},
    productLongueur     : {type : String},
    productPoids        : {type : String},
    isStocker           : {type : Boolean},
},{
    timestamps : true,
    toJSON : {
        virtuals : true
    },
    toObject : {
        virtuals : true
    }
});

export const ProductModel = model<Product>('product',ProductSchema)