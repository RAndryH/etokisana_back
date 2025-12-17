import { model, Schema } from "mongoose";

export interface ICategory{
    CatMiniatureUrl : string;
    CatName         : string;
    CatDescription  : string;
}

export const CategorySchema = new Schema<ICategory>({
    CatMiniatureUrl : { type : String},
    CatName         : { type : String,required:true},
    CatDescription  : { type : String}
},{
    timestamps : true,
    toJSON : {
        virtuals : true
    },
    toObject : {
        virtuals : true
    }
});

export const CategoryModel = model<ICategory>('category',CategorySchema)