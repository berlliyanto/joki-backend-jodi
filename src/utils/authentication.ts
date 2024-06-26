import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class Authentication {
    public static passwordHash = (password: string): Promise<string> => {
        return bcrypt.hash(password, 10);
    }

    public static passwordCompare = (password: string, hashedPassword: string): Promise<boolean> => {
        return bcrypt.compare(password, hashedPassword);
    }

    public static generateToken = (id: number, name: string, role: string): string => {
        const secretKey: string = process.env['JWT_SECRET_KEY'] || "secret";
        const token: string = jwt.sign(
            {
                id, name, role
            }, 
            secretKey,
            {
                expiresIn: "24h"
            }
        );

        return token;
    }
}

export default Authentication;