import { Router, Request,Response } from "express"
import expressAsyncHandler from "express-async-handler";
import { ProductModel } from "../models/product.model";
// import { StockElementModel } from "../models/stockElement.model";
// import { DepotItemModel } from "../models/DepotItem.model";
// import { SendEmail } from "../Utils/Emails/sendEmail";
// import { SiteModel } from "../models/site.model";
// import { UserModel } from "../models/user.model";
import { sample_products } from "../data";
import  ftp from "basic-ftp";
import multer from 'multer';
import fs from "fs";

const router = Router();
const upload = multer({dest:"uploads/"}); // stockage temporaire

//Interface pour multer afin de typer req.file
interface MulterRequest extends Request{
    file?:Express.Multer.File;
}



router.post('/upload-image',upload.single('file'),async(req:MulterRequest,res:Response)=>{
    if(!req.file){
        return res.status(400).json({success: false, error : "Aucun fichier fourni"})
    }
    const  localPath = req.file.path; // chemin temporaire
    // const newFileName = new Date()+"-"+req.file.originalname;
    const newFileName = req.file.originalname;
    // console.log(newFileName);
    const remotePath = `/httpdocs/images/${newFileName}`; // destination

    const client = new ftp.Client();
    client.ftp.verbose = true;

    try{
        //Connextion FTP
        await client.access({
            host : process.env.FTP_HOST,
            user : process.env.FTP_USER,
            password : process.env.FTP_PWD,
            secure : false // mettre true si FTPS
        });

        // Envoi du fichier
        await client.uploadFrom(localPath,remotePath);
        const imageUrl = `https://www.commercegestion.com/images/${newFileName}`

        //Supprimer le fichier local après upload
        fs.unlinkSync(localPath);
        
        const responseData = {
            succes: true,
            message : "Fichier uploadé avec succès !",
            originalFileName : req.file?.originalname,
            mimeType : req.file?.mimetype,
            sizeInBytes : req.file?.size,
            url : imageUrl
        } 
       return res.json({responseData});
    }catch(error){
        console.error("Erreur FTP:",error);
        return res.status(500).json({success : false, error: "Erreur lors de l'upload"});
    }finally{
        client.close();
        // return res.json({message: "Processus d'upload terminé"});
    }
  
});


router.post("/seed",expressAsyncHandler(async(req,res)=>{
        const productCounts = await ProductModel.countDocuments();
        if(productCounts>4){
            res.send("Seed is already done !!");
            return;
        }
        await ProductModel.create(sample_products);
        res.send("Seed is done!!")
}))
router.post("/add/",expressAsyncHandler(async(req,res)=>{
    const {
        codeCPC,
        productName,
        productDescription,
        productCategory,
        productState,
        productImage,
        productValidation,
        productVolume,
        productHauteur,
        productLargeur,
        productLongueur,
        productPoids,
        productOwnerId,
    }= req.body;
    const newProduct = {
        codeCPC,
        productName,
        productDescription,
        productCategory,
        productState,
        productImage,
        productValidation,
        productVolume,
        productHauteur,
        productLargeur,
        productLongueur,
        productPoids,
        productOwnerId,
    }
    const newProductData = req.body;
    console.log(newProductData);
    console.log(newProduct);
    console.log("produit créé");
    await ProductModel.create(newProduct);
    res.send(newProduct);
}))
router.patch("/update/:id",expressAsyncHandler(async(req,res)=>{
    const modifiedProduct = await ProductModel.updateOne({_id : req.params['id']},{$set : req.body});
    res.send(modifiedProduct);
}))
router.delete("/delete/:id",expressAsyncHandler(async(req,res)=>{
    await ProductModel.deleteOne({_id : req.params['id']})
    res.status(200).send("suppression réussie !");
}))

router.get("/",expressAsyncHandler(async(req,res)=>{
    const allProducts = await ProductModel.find();
    res.send(allProducts).status(200);
}))
router.get("/id/:id",expressAsyncHandler(async(req,res)=>{
    const productId = req.params['id'];
    // console.log("getproductbyid",productId);
    const selectedProduct = await ProductModel.findOne({_id : productId});
    if(!selectedProduct){
         res.status(404).send("Produit non trouvé");
    }else{
        res.send(selectedProduct).status(200);
    }
}))
router.get("/owner/:id",expressAsyncHandler(async(req,res)=>{
    const ownerId = req.params['id'];
    const selectedProduct = await ProductModel.find({productOwnerId:ownerId});
    res.send(selectedProduct);
}))
router.get("/email/:email",expressAsyncHandler(async(req,res)=>{
    const productOwner = req.params['email'];
    const selectedProduct = await ProductModel.find({productOwner:productOwner});
    res.send(selectedProduct);
}))
router.get("/category/:category",expressAsyncHandler(async(req,res)=>{
    const productCat = req.params['category']
    const productByCat = await ProductModel.find({productCategory : productCat});
    res.send(productByCat);
}))
router.get("/state/:state",expressAsyncHandler(async(req,res)=>{
    const productState = req.params['state']
    const productByState = await ProductModel.find({productCategory : productState});
    res.send(productByState);
}))



// à faire searchterm


// filtre par prix croissant & décroissant ou fourchette


// prévoir combinaison de filtre localisation, provenance, prix 

export default router;