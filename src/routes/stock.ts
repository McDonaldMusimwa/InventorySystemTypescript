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



rout.post('/addproduct', async (req: Request, res: Response, next: NextFunction) => {



    try {
        const result = await stockObject.addInventory(req, res)
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error first layer' })
    }

})

rout.delete('/deleteproduct', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await stockObject.deleteProduct(req, res)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error first layer' })
    }
})

rout.post('/addshipment',async(req:Request,res:Response)=>{
     await stockObject.addShipment(req,res)

})

rout.get('/shipments',async(req:Request,res:Response)=>{
    await stockObject.getAllShipments(req,res);
})
module.exports = rout;
