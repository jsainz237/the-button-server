import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import User from '../models/user';

const router = express.Router();

interface ReqBody {
    username: string;
    password: string;
}

router.post('/', (req: Request<{}, {}, ReqBody>, res: Response) => {
    const user_id = uuidv4();
    const username = req.body.username;

    try {
        const password_encrypted = bcrypt.hashSync(req.body.password, 10);
        User.create({ id: user_id, username, password: password_encrypted });
        res.status(201).send();
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
})

export default router;