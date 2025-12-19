import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';
import { JWT_SECRET } from '../constant/constant';
import { ITokenResponse } from '../../models/token.models';

export const generateTokenResponse = (user: User): ITokenResponse => {
    const token = jwt.sign({
        _id: user._id,
        userEmail: user.userEmail,
        userPhone: user.userPhone
    }, JWT_SECRET,
        {
            expiresIn: '30d'
        });

    return {
        _id: user._id!,
        userNickName: user.userNickName,
        userId: user.userId,
        userEmail: user.userEmail,
        userName: user.userName,
        userFirstname: user.userFirstname,
        userPhone: user.userPhone,
        userTotalSolde: user.userTotalSolde,
        userStatut: user.userStatut,
        raisonSocial: user.raisonSocial,
        type: user.type,
        rcs: user.rcs,
        nif: user.nif,
        managerName: user.managerName,
        managerEmail: user.managerEmail,
        token: token
    };
}