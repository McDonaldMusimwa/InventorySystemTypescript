import { Request, Response } from 'express';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWTTOKEN = process.env.JWTTOKEN;
import { passport, DoneFunction } from 'passport';

const SerialObject : any  = {
    serialize: (user: any, done: DoneFunction) => {
        done(null, user.id)
    },
    deserialize: (user: any, done: DoneFunction) => {
        try {
            const userr = UserModel.findById(user.id);
            done(null, userr);
        } catch (error) {
            done(error);
        }
    }
}

class UserController {


    public async createUser(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['User']
        try {
            // Extract user information from the request body
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashedPassword
            };


            // Validate the input (you can use a library like Joi for this)
            if (!newUser.lastname || !newUser.firstname || !newUser.password || !newUser.email) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }


            const User = new UserModel.User(newUser); // Create a new user with the 'NewUser' model
            const createdUser = await User.save(); // Save the user to the database
            res.status(200).json({ success: "created successfully" });
            return { ...createdUser._doc, _id: createdUser.toString() };

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }

    }

    public async userLogin(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['User']
        try {
            const userPassword: string = req.body.password;
            const userEmail: string = req.body.email

            if (!userPassword || !userEmail) {
                res.status(401).json({ message: 'Please provide relevant data.' })
            }
            const user: any = await UserModel.findOne({ email: userEmail })
            const hashedPassword: any = user.password;
            if (!user) {
                res.status(500).json({ message: 'User not found' })
            }

            bcrypt.compare(userPassword, hashedPassword, (err: any, result: any) => {
                if (err || !result) {
                    res.status(401).json({ message: 'Authentication failed' });
                } else {
                    if (result) {
                        const token = jwt.sign(
            
                            { userId: user._id.toString(), email: user.email },
                            JWTTOKEN!,
                            { expiresIn: '1h' }
                            
                          );
                        res.status(200).json(token)
                    }
                }
            });


        } catch {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

}

export default UserController; // Export the 'UserController' class
