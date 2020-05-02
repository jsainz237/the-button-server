import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';

const router = express.Router();

interface LoginReqBody {
    username: string;
    password: string;
}

// on POST request to /auth/login
router.post('/', async (req: Request<{}, {}, LoginReqBody>, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    // find user in database
    const user = await User.findOne({
        where: { ci_username: username.toLowerCase() }
    })

    // if user does not exist, send error response
    if(!user) {
        res.status(400).send(`No user found with username ${username}`)
        return;
    }

    // check encrypted password
    if(bcrypt.compareSync(password, user.password)) {
        res.status(200).send();
        return;
    } else {
        res.status(400).send(`Incorrect password`);
        return;
    }
})

export default router;