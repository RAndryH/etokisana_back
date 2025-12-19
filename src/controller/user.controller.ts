import { Request, Response } from "express";
import UserService from "../service/user.sercice"

class UserController {
    REGISTER = async (req: Request, res: Response): Promise<void> => {
        try {
            await UserService.REGISTER(req.body);
            res.status(201).json({
                message: "Utilisateur créé !!!",
                success: true
            })
        } catch (error: any) {
            res.json({
                message: `Internal Server Error: ${error.message}`,
                success: false
            })
        }
    }
}

export default new UserController();