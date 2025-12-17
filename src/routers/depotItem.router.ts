import { Router, Request,Response } from "express"
import expressAsyncHandler from "express-async-handler";
import { DepotItemModel } from "../models/DepotItem.model";
import { SendEmail } from "../Utils/Emails/sendEmail";
import { SiteModel } from "../models/site.model";
import { UserModel } from "../models/user.model";
import  ftp from "basic-ftp";
import multer from 'multer';
import fs from "fs";

const router = Router();
const upload = multer({dest:"uploads/"}); // stockage temporaire

//Interface pour multer afin de typer req.file
interface MulterRequest extends Request{
    file?:Express.Multer.File;
}

router.get("/",expressAsyncHandler(async(req,res)=>{
    const allProducts = await DepotItemModel.find();
    res.send(allProducts);
}))

router.patch("/update/:id",expressAsyncHandler(async(req,res)=>{
    const modifiedProduct = await DepotItemModel.updateOne({_id : req.params['id']},{$set : req.body});
    res.send(modifiedProduct);
}))

router.delete("/delete/:id",expressAsyncHandler(async(req,res)=>{
    await DepotItemModel.deleteOne({_id : req.params['id']})
    res.status(200).send("suppression réussie !");
}))

router.get("/id/:id",expressAsyncHandler(async(req,res)=>{
    const depotItemId = req.params['id'];
    const selectedProduct = await DepotItemModel.findOne({_id : depotItemId});
    res.send(selectedProduct).status(200);
}))

router.get("/owner/:id",expressAsyncHandler(async(req,res)=>{
    const ownerId = req.params['id'];
    const selectedProduct = await DepotItemModel.find({productOwnerId:ownerId});
    res.send(selectedProduct);
}))

router.get("/category/:category",expressAsyncHandler(async(req,res)=>{
    const productCat = req.params['category']
    const productByCat = await DepotItemModel.find({productCategory : productCat});
    res.send(productByCat);
}))

router.get("/state/:state",expressAsyncHandler(async(req,res)=>{
    const productState = req.params['state']
    const productByState = await DepotItemModel.find({productCategory : productState});
    res.send(productByState);
}))

router.get("/stock/:id",expressAsyncHandler(async(req,res)=>{
    const depotId = req.params['id'];
    const productInStock = await DepotItemModel.find({currentDepotId : depotId});
    res.send(productInStock);
}))

router.get("/productinfos/:id",expressAsyncHandler(async(req,res)=>{
    const depotItemId = req.params['id'];
    const depotItemProductInfos = await DepotItemModel.findOne({_id : depotItemId}).populate({path:'productId'});
    res.send(depotItemProductInfos).status(200);
}))

router.get('/getStock/:productId/:depotId',expressAsyncHandler(async(req,res)=>{
    const productId = req.params['productId'];
    const depotId = req.params['depotId'];
    const currentStock = await DepotItemModel.findOne({productId,currentDepotId : depotId});
    console.log(currentStock);
        res.status(200).send(currentStock);
}))

router.post('/add',expressAsyncHandler(async(req,res)=>{
    const {    
        productId ,
        stock,
        prix,
        lastUpdate,
        currentDepotId,
    }= req.body;
    let newDepotItemData= {
        productId ,
        stock,
        prix,
        lastUpdate,
        currentDepotId,
    }
    const newDepotItem = await DepotItemModel.create(newDepotItemData);
    
    const currentSite = await SiteModel.findOne({_id:currentDepotId})

    if(currentSite){
        const currentUser = await UserModel.findOne({userId:currentSite.siteUserID})
        if (currentUser) {
            // let contexteEmail = {
            //     name:currentUser.userNickName,
            // }
            SendEmail(
                // "baseMail",
                // "Deposit",
                currentUser.userEmail,
                "Nouveau produit mis en stock",
                // contexteEmail
            )            
        }
    }
    res.send(newDepotItem).status(200);

}))

router.post('/delete/:id',expressAsyncHandler(async(req,res)=>{
    const deletedDepotItem = await DepotItemModel.findOne({_id :req.params['id']})
    res.send(deletedDepotItem).status(200);

}))

router.post('/deleteByProductId/:id',expressAsyncHandler(async(req,res)=>{
    const deletedDepotItem = await DepotItemModel.deleteMany({productId :req.params['id']})
    res.send(deletedDepotItem).status(200);

}))

router.patch('/modifyDepotItem/:id',expressAsyncHandler(async(req,res)=>{
    const newDepotItem = await DepotItemModel.updateOne({_id:req.params['id']},{$set:req.body});
    res.send(newDepotItem).status(200);
}))

router.get('/ByProductId/:id',expressAsyncHandler(async(req,res)=>{
    const allDepotItemByProductId = await DepotItemModel.findOne({productId : req.params['id']})
    // .populate('productId')
    // .populate('currentDepotId')
    // .exec();
    
    res.status(200).send(allDepotItemByProductId);
}))


router.post('/upload-image',upload.single('file'),async(req:MulterRequest,res:Response)=>{
    if(!req.file){
        return res.status(400).json({success: false, error : "Aucun fichier fourni"})
    }
    const  localPath = req.file.path; // chemin temporaire
    const remotePath = `/httpdocs/images/${req.file.originalname}`; // destination

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
        const imageUrl = `https://www.commercegestion.com/images/${req.file.originalname}`

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

// à faire searchterm


// filtre par prix croissant & décroissant ou fourchette


// prévoir combinaison de filtre localisation, provenance, prix 

export default router;