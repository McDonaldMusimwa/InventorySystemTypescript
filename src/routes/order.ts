import Router, { Request, Response } from 'express';
import
OrderControler from '../controller/order';

const router = Router();
const orderController = new OrderControler();

router.get('/', (req: Request, res: Response) => {
   orderController.getAllOrders(req, res)
})
router.patch('/orderid', (req: Request, res: Response) => {
    orderController.modifyOrder(req, res)
})

router.post('/addorder', (req: Request, res: Response) => {

    orderController.addOrder(req, res)
})

router.get('/getorder/:orderid', (req:Request,res:Response)=>{
    
    orderController.getOrder(req,res)
})

module.exports = router