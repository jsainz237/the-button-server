import express, { Request, Response } from 'express';
import User from '../models/user';

const router = express.Router();

interface CheckUsernameBody {
    username: string;
}

// on POST request to /auth/check-username
router.post('/', async (req: Request<{}, {}, CheckUsernameBody>, res: Response) => {
    const username = req.body.username.toLowerCase();
    // look for user in database with matching username
    const user = await User.findOne({
        where: { ci_username: username }
    })

    if(user) {
        // send back response saying username is not available
        return res.status(200).send({ available: false });
    } else if (!user) {
        // send back response saying username is available
        return res.status(200).send({ available: true });
    }

    return res.status(500).send({ error: 'internal server error' });
})

export default router;