import { Router } from 'express';
import { Response, Request } from 'express';
import UserController from '../controller/user';

const userController = new UserController();
const router = Router()


router.post('/', (req: Request, res: Response) => {
    console.log('where here')
    userController.createUser(req, res)
});

router.post('/login',  (req: Request, res: Response) => {
    userController.userLogin(req, res)
})

module.exports = router;
