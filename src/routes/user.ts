import { Router } from 'express';
import { Response, Request } from 'express';
import UserController from '../controller/user';
const userController = new UserController();
const route = Router()


route.post('/', async (req: Request, res: Response) => {
    console.log('where here')
    userController.createUser(req, res)
});

route.get('/login', async (req: Request, res: Response) => {
    userController.userLogin(req, res)
})

module.exports = route;
