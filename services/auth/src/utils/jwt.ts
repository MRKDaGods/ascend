import jwt, { SignOptions } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || '';

export const generateToken = (payload: object, expiresIn: string = '1h'): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, SECRET_KEY);
};