import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { TransactionModel } from "../models/transaction.model";
import { UserModel } from "../models/user.model";
import { SendEmail } from "../Utils/Emails/sendEmail";

const router = Router();


router.post("/add",expressAsyncHandler(async(req,res)=>{
    const {
      userId,
      siteDepartId,
      siteArriveId,
      typeES,
      montantTotal,
      statut,
      productList,
    } = req.body;
    const newTransaction = {
      userId,
      siteDepartId,
      siteArriveId,
      typeES,
      montantTotal,
      statut,
      productList,
    }
    const currentUser = await UserModel.findOne({_id : userId})
    if (currentUser && typeES == "Dépôt") {
      SendEmail(
        // "baseMail","Deposit",
        currentUser.userEmail,"Transaction réussie",
        // {
        //   name : currentUser.userFirstname,
        //   montant : montantTotal,
        // }
      )
    }
    if (currentUser && typeES == "Retrait") {
      SendEmail(
        // "baseMail","Withdraw",
        currentUser.userEmail,"Transaction réussie",
        // {
        //   name : currentUser.userFirstname,
        //   montant : montantTotal,
        // }
      )
    }
    await TransactionModel.create(newTransaction);
    res.send(newTransaction).status(200)
}))
router.get("/", expressAsyncHandler(async(req,res)=>{
    const transactions = await TransactionModel.find();
    res.send(transactions).status(200);
    
}))
router.get("/id/:id", expressAsyncHandler(async(req,res)=>{
    const transaction = await TransactionModel.findOne({_id : req.params['id']});
    res.send(transaction).status(200);
    
}))
router.get("/user/:id", expressAsyncHandler(async(req,res)=>{
    const transactions = await TransactionModel.find({userId: req.params['id']});
    res.send(transactions).status(200);
    
}))
router.patch("/update/:id",expressAsyncHandler(async(req,res)=>{
    const updatedTransaction = await TransactionModel.updateOne({_id : req.params['id']},{$set : req.body})
    res.send(updatedTransaction).status(200);
}))
router.delete("/delete/:id",expressAsyncHandler(async(req,res)=>{
    res.send().status(200);
}))

export default router;