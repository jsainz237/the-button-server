import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import User from '../models/user';

const router = express.Router();

interface RegisterReqBody {
    username: string;
    password: string;
}

router.post('/', (req: Request<{}, {}, RegisterReqBody>, res: Response) => {
    const user_id = uuidv4();
    const username = req.body.username;
    const ci_username = username.toLowerCase();

    try {
        const password_encrypted = bcrypt.hashSync(req.body.password, 10);
        User.create({ id: user_id, ci_username, username, password: password_encrypted });
        res.status(201).send();
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
})

export default router;