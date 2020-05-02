import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { check, validationResult } from 'express-validator';

import User from '../models/user';

const router = express.Router();

interface RegisterReqBody {
    username: string;
    password: string;
}

router.post('/', [
        check('username').isAlphanumeric().withMessage('username must be alphanumeric'),
        check('password')
            .isLength({ min: 8, max: 64 }).withMessage('must be 8 to 64 characters long')
            .matches(/\d/).withMessage('must contain a number')
            .matches(/[A-Z]/).withMessage('must contain an uppercase letter')
            .matches(/[a-z]/).withMessage('must contain a lowecase letter')
            .matches(/[!?(){}_\\-\\.$#&]/).withMessage('must contain a special character')
            .matches(/^((?!')(?!").)*$/).withMessage('cannot contain \" or \' characters')
    ], (req: Request<{}, {}, RegisterReqBody>, res: Response) => {
        
        // check validation errors
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const user_id = uuidv4();
        const username = req.body.username;
        const ci_username = username.toLowerCase();

        try {
            const password_encrypted = bcrypt.hashSync(req.body.password, 10);
            User.create({ id: user_id, ci_username, username, password: password_encrypted });
            return res.status(201).send();
        } catch(err) {
            console.log(err);
            return res.status(500).send();
        }
    }
)

export default router;