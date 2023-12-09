import Router from 'express';
import { Response, Request } from 'express';
import SupplierController from '../controller/supplierController';

const route = Router()
const supplier = new SupplierController()


route.get('/', (req: Request, res: Response) => {
    supplier.getSuppliers(req, res)
})
route.get('/:supplierId', (req: Request, res: Response) => {
    console.log(' fetch')
    supplier.getSupplier(req, res)
})
route.post('/addsupplier', (req: Request, res: Response) => {
    supplier.addSupplier(req, res)
})

route.patch('/:supplierId', (req: Request, res: Response) => {
    console.log('its here mow')
    supplier.modifySupplier(req, res)

})
route.delete('/:supplierId', (req: Request, res: Response) => {
    supplier.deleteSupplier(req, res)
})






module.exports = route;