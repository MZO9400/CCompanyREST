const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: Error) => {
        if (err) return res.status(401).json({status: false, message: 'Token is not valid'})
        next()
    })
}
