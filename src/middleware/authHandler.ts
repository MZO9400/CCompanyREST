const jwt = require('jsonwebtoken');
import {NextFunction, Request, Response} from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    jwt.verify(token, process.env.SALT as string, (err: Error) => {
        if (!err) {
            req.body.authorized = true
        }
        next()
    })

}
