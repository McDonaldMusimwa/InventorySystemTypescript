const router = require('express').Router();

import { NextFunction, Request, Response } from 'express';
import StockController from '../controller/stockitem';
let stockObject = new StockController();


router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        stockObject.getAllProducts(req, res)

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error First layer' })
    }

});

router.get('/getproductcatalogue', async (req: Request, res: Response, next: NextFunction) => {




    await stockObject.getproductRange(req, res)


})



router.post('/addproduct', async (req: Request, res: Response, next: NextFunction) => {




    await stockObject.addProduct(req, res)


})

router.delete('/deleteproduct', async (req: Request, res: Response, next: NextFunction) => {

    await stockObject.deleteProduct(req, res)


})

router.post('/addshipment', async (req: Request, res: Response) => {
    await stockObject.addShipment(req, res)

})

router.get('/productshipments/:productid', async (req: Request, res: Response) => {
    console.log("Single productid")
    await stockObject.getAllShipmentsForOneProduct(req, res);
})


router.get('/allshipments', async (req: Request, res: Response) => {
    
    await stockObject.getAllShipmentsForAllProducts(req, res);
});
module.exports = router;
