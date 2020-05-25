import express, { Request, Response } from 'express';
import { check, validationResult, ValidationError } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { Rank } from '../types/ranks';
import User from '../models/user';

const router = express.Router();

interface ResponseErrors {
    errors: ValidationError[] | string[]
}

interface RequestBody {
    email: string;
    displayname: string;
}

interface Userinfo {
    email: string;
    displayname: string;
    rank: Rank
}

type ResponseBody = Userinfo | ResponseErrors;

// ----- USER INFO -----//

/** On POST request to /auth/login */
router.post('/login', [
    check('email').isEmail().withMessage('not a valid email') // validate email is valid
], async (
    req: Request<{}, {}, RequestBody>,
    res: Response<ResponseBody>
) => {
    // send validation errors if there are any
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({ where:  { email: req.body.email }});
    if(user) {
        return res.status(200).send({ email: user.email, displayname: user.displayname, rank: user.rank });
    }

    const id = uuidv4();
    user = await User.create({ 
        id, 
        email: req.body.email,
        displayname: req.body.displayname,
        ci_displayname: req.body.displayname.toLowerCase(), 
        rank: Rank.GRAY 
    })
    return res.status(201).send({ email: user.email, displayname: user.displayname, rank: user.rank });
})

/** On POST request to /auth/userinfo */
router.post('/userinfo', [
    check('email').isEmail().withMessage('not a valid email') //validate email is valid email
], async (
    req: Request<{}, {}, RequestBody>,
    res: Response<ResponseBody>
) => {
    // send validation errors if there are any
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // if user does not exist, create one with default rank
        const id = uuidv4();
        const user = await User.create({
            id,
            email: req.body.email,
            displayname: req.body.displayname,
            ci_displayname: req.body.displayname.toLowerCase(),
            rank: Rank.GRAY
        });
        return res.status(201).send({ email: user.email, displayname: user.displayname, rank: user.rank });
    }
    catch(err) {
        console.error(err);
        return res.status(400).send({ errors: [err] })
    }
})

// ----- EDIT ATTRIBUTES ----- //

/** On POST request to /auth/edit-displayname */
router.post('/edit-displayname', [
    check('displayname').isAlphanumeric().withMessage('displayname must be alphanumeric')
], async (
    req: Request<{}, {}, RequestBody>,
    res: Response<ResponseBody>
) => {
    // send validation errors if there are any
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const displayname_taken = await User.findOne({ where: { ci_displayname: req.body.displayname.toLowerCase() }}) ? true : false;

    // if displayname is taken, send error
    if(displayname_taken) {
        return res.status(400).send({ errors: [`displayname is taken`]});
    }

    try {
        // get user with matching email
        const user = await User.findOne({ where: { email: req.body.email }});
        if(!user) {
            return res.status(400).send({ errors: [`incorrect email`]});
        }

        // update displayname in database
        await user.update({
            displayname: req.body.displayname,
            ci_displayname: req.body.displayname.toLowerCase()
        });

        return res.status(200).send({ email: user.email, displayname: user.displayname, rank: user.rank })
    }
    catch(err) {
        console.log(err);
        return res.status(400).send({ errors: [err] });
    }
})

// ----- CHECK DISPLAYNAME ----- //

/** on GET request to /auth/check-displayname */
router.get('/check-displayname', async (
    req: Request<{}, {}, {}, { displayname: string }>, 
    res: Response<{ available: boolean } | ResponseErrors>
) => {
    // send validation errors if there are any
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    // look for user in database with matching displayname
    const displayname = req.query.displayname.toLowerCase();
    const user = await User.findOne({
        where: { ci_displayname: displayname }
    })

    if(user) {
        // send back response saying displayname is not available
        return res.status(200).send({ available: false });
    } else if (!user) {
        // send back response saying displayname is available
        return res.status(200).send({ available: true });
    }

    return res.status(500).send({ errors: ['internal server error'] });
})

export default router;