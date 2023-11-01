const rout = require('express').Router();

import { NextFunction, Request, Response } from 'express';
import StockController from '../controller/stockitem';
let stockObject = new StockController();


rout.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        stockObject.getAllProducts(req, res)

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error First layer' })
    }

});

rout.get('/getproductcatalogue', async (req: Request, res: Response, next: NextFunction) => {




    await stockObject.getproductRange(req, res)


})



rout.post('/addproduct', async (req: Request, res: Response, next: NextFunction) => {




    await stockObject.addProduct(req, res)


})

rout.delete('/deleteproduct', async (req: Request, res: Response, next: NextFunction) => {

    await stockObject.deleteProduct(req, res)


})

rout.post('/addshipment', async (req: Request, res: Response) => {
    await stockObject.addShipment(req, res)

})

rout.get('/shipments', async (req: Request, res: Response) => {
    await stockObject.getAllShipments(req, res);
})
rout.get('/allshipments', async (req: Request, res: Response) => {
    await stockObject.getAllShipmentsForAllProducts(req, res);
})
module.exports = rout;
