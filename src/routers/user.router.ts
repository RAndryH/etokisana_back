import { Router } from "express";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Token, TokenModel } from "../models/token.models";
import {randomBytes} from"crypto";
import { SendEmail } from "../Utils/Emails/sendEmail";
import multer from 'multer';
import { NotificationModel } from "../models/notification.model";
import { Options } from "nodemailer/lib/smtp-pool/index";
import { SiteModel } from "../models/site.model";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { JWT_SECRET } from "../Utils/constant/constant";
dotenv.config();
const userRouter = Router();



  const transporter = nodemailer.createTransport({
                  host : "commercegestion.com",
                  port : 465,
                  secure : true,
                  auth : 
                  {
                      user:"contact@commercegestion.com",
                      pass:"Rzh398aNVtFZUu4"
                  }
              })
  const mailOptions = {
    from: 'contact@commercegestion.com', // sender address
    to: "randrianaivo.dominique@gmail.com", // list of receivers
    subject : "Test réussi",
    text : "Test réussi",
    html : "<h1>Test réussi</h1></br> <p>On avance !!</p>"
    // contextObject: contextObject,
  };


const sendMail = async (transporter:any , mailOptions:any) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent successfully:", info.messageId);
  } catch (error) {
    console.log("Error while sending mail:", error);
  }
};


// router.post("/register/",asyncHandler(async(req, res) => {

// const transporter = nodemailer.createTransport({
//   host: "commercegestion.com",
//   port: 465,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: "contact@commercegestion.com",
//     pass: "Rzh398aNVtFZUu4",
//   },
// });

// const mailOptions = {
//   from: 'contact@commercegestion.com',
//   to: "randrianaivo.dominique@gmail.com",
//   subject: "inscription randrianaivo ✔",
//   text: "Félicitations ! Votre inscription a été réussie.", // plain‑text body
//   html: "<b>Félicitations ! Votre inscription a été réussie.</b>", // HTML body
// };

// const sendMail = async (transporter:any, mailOptions:any) => {
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Message sent successfully:", info.messageId);
//   } catch (error) {
//     console.log("Error while sending mail:", error);
//   }
// };
// sendMail(transporter, mailOptions);
// }));

const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;
const avatar = multer({
  limits:{
    fileSize:1000000,
  },
  fileFilter(req,file,cb){
    if (file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/)) {
      return cb(new Error('This is not a correct format of the file'))
    }
    cb(null,true)
  }
})

// router.post('/user-avatar/',avatar.single('avatar'),async(req,res)=>{
//   userImage = req.file?.buffer
// },(err,req,res,next) => res.status(404).send({error:err}))

userRouter.get("/user-confirmation/:token",asyncHandler(async(req,res)=>{
    const verified = await TokenModel.findOne({token:req.params['token']});
    if(verified){
        console.log(verified);
        const user = await UserModel.findOne({_id : verified.userId});
        if (user) {
          const activatedUser = {
            userName: user.userName,
            userFirstname: user.userFirstname,
            userPassword : user.userPassword,
            userEmail : user.userEmail,
            userPhone : user.userPhone,
            userEmailVerified : true,
            userType : user.userType,
            userTotalSolde : user.userTotalSolde,
            userAccess : user.userAccess,
            // userparrainID : user.userparrainID,
            userValidated : user.userValidated,
            // userDescritpion : user.userDescritpion,
            // userImage : user.userImage,
            // userDateOfBirth : user.userDateOfBirth,
            // userLogo : user.userLogo,
            // userStatut : user.userStatut,
            // userManager : user.userManager,
            // userNif : user. userNif,
            // userRC : user. userRC,
            // identityDocument : user.identityDocument,
            // identityCardNumber : user.identityCardNumber,
            // userAdmin : user.userAdmin,
            // userAddress : user.userAddress,
            // userIdentityCode : user.userIdentityCode,
          }
          await UserModel.updateOne({_id : verified.userId}, activatedUser)
          console.log()
          await TokenModel.deleteOne({token : verified.token});
          let newNotification = {
            userId  : verified.userId,
            title   : "Email vérifié",
            message : "Félicitations ! Votre Email a bien été vérifié",
            state  : "new",
          }
          await NotificationModel.create(newNotification);
          res.status(200).send("Token Effacé");
        }
    }
    else{
      res.status(404).send("Token introuvable")
    }
}))


userRouter.post("/requestVerificationEmail",asyncHandler(async(req,res)=>{
  let tokenInfo
  const userInfos = req.body;
  tokenInfo = generateTokenResponse(userInfos);
  const tokenDB : Token = {
          userId    : tokenInfo.userId,
          token : tokenInfo.token,
        };
  
}))


//userRouter.post('/register', asyncHandler(REGISTER));

userRouter.post("/register/",asyncHandler(async(req, res) => {
  
    let tokenInfo
    let userDb



    //----------------------
    //Récupération des informations de l'utilisateur
    //----------------------
    const {
      userNickName,
      userName,
      userFirstname,
      userPassword,
      userEmail,
      userPhone,
      userAccess,
      // userparrainID,
      userType,
      userDateOfBirth,
      userAddress ,
      userMainLat,
      userMainLng,
      userId,
      userEmailVerified,
      userValidated,
      userImage,
      identityDocument,
      identityCardNumber,
      documentType,
      raisonSocial        ,
      type                ,
      rcs                 ,
      carteStat           ,
      nif                 ,
      carteFiscal         ,
      logo                ,
      managerName         ,
      managerEmail        ,
      parrain1ID,
      parrain2ID,
    } = req.body;


    //----------------------
    //Check si l'email est déjà utilisé
    //----------------------
    const user = await UserModel.findOne({userEmail : userEmail.toLowerCase()});
    if(user){
        res.status(500).send("Ce nom est déjà utilisé !");
        return;
    }else
    {

      //Criptage du mot de passe
      const encryptedPassword = await bcrypt.hash(userPassword,10);



      
      const newUser : User = {
          userNickName,
          userName,
          userFirstname,
          userPassword,
          userEmail:userEmail.toLowerCase(),
          userPhone,
          userTotalSolde : 0,
          userType,
          userAccess,
          // userparrainID,
          userValidated,
          userEmailVerified,
          userAddress ,
          userDateOfBirth,
          userMainLat,
          userMainLng,
          userId              ,
          userImage           ,
          identityDocument    ,
          identityCardNumber  ,
          documentType        ,
          raisonSocial        ,
          type                ,
          rcs                 ,
          carteStat           ,
          nif                 ,
          carteFiscal         ,
          logo                ,
          managerName         ,
          managerEmail        ,
          parrain1ID,
          parrain2ID,
      }
      //SendEmail(userEmail,"Test réusssi !!");
      userDb = await UserModel.create(newUser); 
      
      

      const mailOptions = {
        from: 'contact@commercegestion.com',
        to: "randrianaivo.dominique@gmail.com",
        subject: "inscription ranix ✔",
        text: "Félicitations ! Votre inscription a été réussie.", // plain‑text body
        html: "<b>Félicitations ! Votre inscription a été réussie.</b>", // HTML body
      };

      const sendMail = async (transporter:any, mailOptions:any) => {
        try {
          const info = await transporter.sendMail(mailOptions);
          console.log("Message sent successfully:", info.messageId);
        } catch (error) {
          console.log("Error while sending mail:", error);
        }
      };
    sendMail(transporter,mailOptions);
    //---------------------------
    //4. Envoi email (async/await propre)
    //---------------------------
    try 
    {
        const sendInfo = await transporter.sendMail(mailOptions);
        if (sendInfo) {
          console.log("Email envoyé : ", sendInfo.messageId);          
        }else{
          console.log("Erreur lors de l'envoi du mail");
        }

    }catch(error){
        console.error("Erreur lors de l'envoi de l'email : ", error);
    }      
      }

    tokenInfo = generateTokenResponse(userDb);
      const tokenDB : Token = {
        userId    : tokenInfo._id,
        token : tokenInfo.token,
      }
      await TokenModel.create(tokenDB);
    
    //Sending mail
    const verificationLink = "https://www.commercegestion.com/#/user-confirmation/"+ tokenInfo.token;
      if (userType == "Entreprise") {
        sendMail(transporter, mailOptions);

        SendEmail(
        "baseMail",
        "ValidationEntrepriseEmail",
        userEmail,
        "Bienvenue sur Etokisana",
        {
          name : raisonSocial,
          link : verificationLink,
        }
        )

      }
      if(userType == "Particulier") {
        sendMail(transporter, mailOptions);

        SendEmail(
        "baseMail",
        "ValidationEmail",
        userEmail,
        "Bienvenue sur Etokisana",
        {
          name : raisonSocial,
          link : verificationLink,
        }
      )


      }
      let newNotification = {
        userId  : userId,
        title   : "Inscription en attente",
        message : "Nous vous remercions de votre patience pendant la validation de votre insciption au sein de nos administrateurs",
        state  : "new",
      }
      await NotificationModel.create(newNotification);
      res.status(200).send(['Utilisateur créé !!!']);
}
))
userRouter.get("/checkparrain/:id",asyncHandler(async(req,res)=>{
  const user = await UserModel.findOne({_id:req.params['id']});
  if(user){
      if (user.parrain1ID && user.parrain2ID) {
        await UserModel.updateOne({_id : req.params['id']},{$set :{userValidate : true}});
    }
  }
}))

userRouter.get("/new",asyncHandler(async(req,res)=>{
  const userNewList = await UserModel.find({userValidated : false,userAccess:"Utilisateur"})
  res.status(200).send(userNewList)
}))
userRouter.get("/validate/:id",asyncHandler(async(req,res)=>{
  const userDBId = req.params['id'];
  const userById = await UserModel.findById({_id:userDBId});
  await UserModel.updateOne({_id : userDBId},{$set : {userValidated : true}});
 
    if (userById?.userType == "Entreprise") {
      // SendEmail(
      //   // "baseMail",
      //   // "welcome",
      //   userById.userEmail,
      //   "Inscription terminée",
      //   // {
      //   //   name : userById.userName,
      //   // }
      // )
    }
    if (userById && userById.userType == "Particulier") {
      // SendEmail(
      //   // "baseMail",
      //   // "welcome",
      //   userById.userEmail,
      //   "Inscription terminée",
      //   // {
      //   //   name : userById.userName,
      //   // }
      // )
    }
    
      
  // let newNotification = {
  //     userId  : userById?.userId,
  //     title   : "Inscritpion réussie !",
  //     message : "Félicitations ! Vous faites maintenant partie de la grande famille de notre plateforme.",
  //     states  : "new",
  // }
  // await NotificationModel.create(newNotification);
  res.status(200).send(userById?.userId) ;
}))

const generateTokenResponse = (user:any) =>{
    const token = jwt.sign({
        _id: user._id,
        userEmail:user.userEmail,
        userPhone:user.userPhone,
    }, JWT_SECRET,{
        expiresIn:"30d"
    });
    return {
        _id             : user._id,
        userNickName    : user.userNickName,
        userId          : user.userId,
        userEmail       : user.userEmail,
        userName        : user.userName,
        userFirstname   : user.userFirstname,
        userPhone       : user.userPhone,
        userTotalSolde  : user.userTotalSolde,
        userStatut      : user.userStatut,
        raisonSocial    : user.raisonSocial,
        type            : user.type,
        rcs             : user.rcs,
        nif             : user.nif,
        managerName     : user.managerName,
        managerEmail    : user.managerEmail,
        token           : token
    };
}
  userRouter.get("/token/:token",asyncHandler(async(req,res)=>{
    const token = req.params['token'];
    const tokenUserId = await TokenModel.findOne({token});
    if (tokenUserId) {
      const userConcerned =await UserModel.findOne({_id:tokenUserId.userId})
      res.send(userConcerned).status(200)
    }
 }))
 
userRouter.patch("/passwordReset",asyncHandler(async(req,res)=>{
    const {token,id,password} = req.body;
    console.log(id,token,password)
    let passwordResetToken = await TokenModel.findOne({ userId : id });
    let user = await UserModel.findOne({_id:id})
    if (!passwordResetToken) {
      throw new Error("Mot de passe incorrect !");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Mot de passe incorrect !");
    }
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    if (user && passwordResetToken) {
      const updatePassword = await UserModel.updateOne({ _id: id },{$set:{
          userPassword : hash,
        }
      });
      if (updatePassword) {
          await passwordResetToken.deleteOne({token : token});
      }
    }
    if (isValid && user) {

      // SendEmail(
      //   // "baseMail",
      //   // "resetPassword",
      //   user.userEmail,
      //   "Mot de passe réinitialisé",
      //   // {name : user.userName,}
      // )
    }
    res.send('Mot de passe réinitialisé')   
 }))

userRouter.post("/requestResetPwd",asyncHandler(async(req,res)=>{
    const {email} = req.body;
    //console.log(email+ " " + userId)
    const user = await UserModel.findOne({userEmail : email})

    if (!user) {
        throw new Error("L'utilisateur n'existe pas")
    }
    let token = await TokenModel.findOne({ _id: user._id });
    if (token) { 
          await token.deleteOne()
    };
    let resetToken = randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
    
        await new TokenModel({
          userId: user._id,
          token: hash,
          // createdAt: Date.now(),
        }).save();
        //on envoi le token non crypté pour le comparer avec le token crypté de la base de donnée
        const link = `${clientURL}/#/passwordReset/${resetToken}/${user._id}`;
        
        // SendEmail(
        //   // "requestResetPassword",
        //   // "baseMail",
        //   user.userEmail,
        //   "Réinitialisation du mot de passe",
        //   // {
        //   //   name : user.userFirstname,
        //   //   link : link,
        //   // }
        // )
}))

userRouter.get("", asyncHandler(async(req, res) => {
    const users = await UserModel.find();
    res.send(users);
}))
userRouter.get("/id/:id", asyncHandler(async(req, res) => {
    const userId = req.params['id'];
    const user = await UserModel.findOne({_id : userId});
    // console.log(user);
    res.send(user);
}))
userRouter.get("/email/:email", asyncHandler(async(req, res) => {
    const userEmail = req.params['email'];
    const user = await UserModel.findOne({userEmail : userEmail});
    res.send(user);
}))
userRouter.get("/userId/:id", asyncHandler(async(req, res) => {
  const userId = req.params['id'];
  const user = await UserModel.findOne({userId : userId});
  res.send(user);
}))

userRouter.post("/login",asyncHandler(async(req,res) => {
    const {userEmail,userPassword} = req.body;
    const user = await UserModel.findOne({userEmail})
    if (user && (await bcrypt.compare(userPassword,user.userPassword))) {
        res.send(generateTokenResponse(user));
        
    }else{
        res.status(404).send("L'utilisateur n'existe pas ou le mot de passe est incorrect !");
    }
}))
userRouter.delete("/delete/:id",asyncHandler(async(req,res)=>{
  const userId = req.params.id;
  const user = await UserModel.findOne({_id: userId})
  const deletedSite = await SiteModel.deleteMany({siteUserID : userId})
  if (user && deletedSite) {
    await UserModel.deleteOne({_id : userId});
    res.send("Utilisateur supprimé : " + userId);
  }else{
    res.send("Impossible de supprimer l'utilisateur");
  }
}))
// router.patch("userToAdmin/:id",asyncHandler(async(req,res)=>{
//   const userId = req.params['id'];
//   const userChange = 
//   await UserModel.updateOne({_id:userId},{$set : {userAccess : "Admin"}})
//   res.send(userId);
// }))

// router.get("AdminToUser/:id",asyncHandler(async(req,res)=>{
//   const userId = req.params.id;
//   await UserModel.updateOne({_id:userId},{$set : {userAccess : "Utilisateur"}});
//   res.send(userId);
// }))

userRouter.patch("/update/:id",asyncHandler(async(req,res) => {
    const id = req.params['id'];
     await UserModel.updateOne({_id : id}, {$set : req.body})
    res.send(id).status(200);
}))
export default userRouter;