import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { CategoryModel } from "../models/category.model";
import { sample_categories } from "../data";

const router = Router();

router.post("/seed",expressAsyncHandler(async(req,res)=>{
    const productCounts = await CategoryModel.countDocuments();
        if(productCounts>0){
            res.send("Seed is already done !!");
            return;
        }
        await CategoryModel.create(sample_categories);
        res.send("Seed is done!!")
}))

router.post("/add",expressAsyncHandler(async(req,res)=>{
    const {
        CatMiniatureUrl,
        CatName,
        CatDescription
    } = req.body;
    const newCategory = {
        CatMiniatureUrl,
        CatName,
        CatDescription
    }
    await CategoryModel.create(newCategory);
    res.status(200)
}))
router.get("/", expressAsyncHandler(async(req,res)=>{
    const categories = await CategoryModel.find();
    res.send(categories).status(200);
    
}))
router.put("/update/:id",expressAsyncHandler(async(req,res)=>{
    const {
        CatMiniatureUrl,
        CatName,
        CatDescription
    } = req.body;
    await CategoryModel.updateOne({_id : req.params['id']},{
        CatMiniatureUrl,
        CatName,
        CatDescription
    })
}))
router.delete("/delete/:id",expressAsyncHandler(async(req,res)=>{
    res.status(200);
}))

export default router;