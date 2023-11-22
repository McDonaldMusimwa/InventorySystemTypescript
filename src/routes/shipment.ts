
//import  isAuthenticated  from '../auth/is-auth';
import { NextFunction, Request, Response ,Router} from 'express';
import StockController from '../controller/stockitem';
const router = Router();
let stockObject = new StockController();


router.get('/',(req: Request, res: Response, next: NextFunction) => {
    try {
        stockObject.getAllShipments(req, res)

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error First layer' })
    }

});
router.get('/:id', async (req: Request, res: Response) => {
    
     stockObject.getOneShipment(req, res);
})



router.post('/addshipment',async (req: Request, res: Response) => {
    console.log('add shipment')
    await stockObject.addShipment(req,res)
})






module.exports = router;












































