import { NotificationModel } from "../models/notification.model";
import { Token, TokenModel } from "../models/token.models";
import { User, UserModel } from "../models/user.model";
import { SendEmail } from "../Utils/Emails/sendEmail";
import { generateTokenResponse } from "../Utils/functions/functions";

interface RegisterResponse {
    message: string;
    success: boolean;
}

class UserService {

    // S'inscrire un utilisateur
    REGISTER(payload: User) {
        return new Promise<RegisterResponse>(async (resolve, reject) => {
            try {
                // Check if user already exists
                const existingUser = await UserModel.findOne({ userEmail: payload.userEmail.toLowerCase() }).exec();
                if (existingUser) throw new Error('Ce nom est dejà utilisé !');

                const newUser: User = {
                    ...payload,
                    userEmail: payload.userEmail.toLowerCase()
                }

                // Create new user
                const userDb = await UserModel.create(newUser);

                // Create new token for user
                const tokenInfo = generateTokenResponse(userDb);
                const tokenDb: Token = {
                    userId: tokenInfo._id!,
                    token: tokenInfo.token
                }

                // Add token in DB
                await TokenModel.create(tokenDb);

                // Send email to user to verify email address
                const verificationLink = `https://www.commercegestion.com/#/user-confirmation/${tokenInfo.token}`;
                SendEmail(
                    "baseMail",
                    payload.userType === "Entreprise" ? "ValidationEntrepriseEmail" : "ValidationEmail",
                    payload.userEmail,
                    "Bienvenue sur Etokisana",
                    {
                        name: payload.raisonSocial,
                        link: verificationLink,
                    }
                )

                // Send notification
                const newNotification = {
                    userId: payload.userId,
                    title: "Inscription en attente",
                    message: "Nous vous remercions de votre patience pendant la validation de votre insciption au sein de nos administrateurs",
                    state: "new",
                }
                await NotificationModel.create(newNotification);

                resolve({
                    message: "Utilisateur créé !!!",
                    success: true
                })


            } catch (error: any) {
                reject({
                    message: `Internal Server Error: ${error.message}`,
                    success: false
                });
            }
        })
    }
}

export default new UserService();