

import { NextFunction, Request, Response, Router } from 'express';
import StockController from '../controller/stockitem';
let stockObject = new StockController();
const router = Router();

router.get('/', async(req: Request, res: Response, next: NextFunction) => {
    try {
      await  stockObject.getAllProducts(req, res)

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error First layer' })
    }

});


router.get('/getproductcatalogue', async (req: Request, res: Response, next: NextFunction) => {
    await stockObject.getproductRange(req, res);
});

router.get('/getoneproduct/:id', async (req: Request, res: Response, next: NextFunction) => {
    console.log('get one product')
    await stockObject.getOneProduct(req, res);
});



router.post('/addproduct', async (req: Request, res: Response, next: NextFunction) => {
    console.log("Add product route")
    await stockObject.addProduct(req, res)
})

router.delete('/deleteproduct', async (req: Request, res: Response, next: NextFunction) => {
    await stockObject.deleteProduct(req, res)
})






module.exports = router;












































