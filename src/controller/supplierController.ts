import { Request, Response } from "express";
import Supplier from '../models/supplier';

class SupplierController {

    public async addSupplier(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Supplier']
        try {

            const newSupplier = {
                supplier: req.body.supplier,
                contactname: req.body.contactname,
                email: req.body.email,
                phone: req.body.phone,
                adress: req.body.adress
            }
            console.log(newSupplier)

            if (!newSupplier.contactname || !newSupplier.supplier || !newSupplier.email || !newSupplier.phone || !newSupplier.adress) {
                res.status(401).json({ message: 'Missing Data' })
            }

            const suppler = new Supplier(newSupplier);
            const createdSupplier = await suppler.save();


            console.log(createdSupplier)
            res.status(201).json({ message: "created successfully" })
            return { ...createdSupplier._doc, _id: createdSupplier.toString() };

        } catch (message) {
            res.status(500).json({ message: "Internal Server Error" })
        }

    }
    public async modifySupplier(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Supplier']
        try {
            const id = req.params.supplierId.trim();  // Correctly access the supplierId parameter
           
            const modifiedSupplier = {
                supplier: req.body.supplier,
                contactname: req.body.contactname,
                phone: req.body.phone,
                email: req.body.email,
                adress: req.body.adress
            };

            const supplier = await Supplier.findOne({_id:id});

            if (!supplier) {
                res.status(404).json({ message: "Supplier not found" }); // Handle the case where the supplier is not found
            } else {
                // Modify the supplier here
                // Update the fields based on modifiedSupplier
                supplier.supplier = modifiedSupplier.supplier;
                supplier.contactname = modifiedSupplier.contactname;
                supplier.phone = modifiedSupplier.phone;
                supplier.email = modifiedSupplier.email;
                supplier.adress = modifiedSupplier.adress;

                await supplier.save(); // Save the modified supplier

                res.status(200).json({ message: "Supplier modified successfully" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }


    public async deleteSupplier(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Supplier']
        try {
            const id = req.params.supplierId.trim(); 
            await Supplier.deleteOne({ _id: id })
            res.status(200).json({ message: "Supplier deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Servir Error' })
        }
    }

    public async getSuppliers(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Supplier']
        try {
            const supplers = Supplier.find()
            const response = await supplers;
            res.status(200).json(response);


        } catch (message) {
            res.status(401).json({ message: "Internal Server Error" })
        }
    }


    public async getSupplier(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Supplier']
        try {
            const id = req.params.supplierId.trim(); 
            const response = await Supplier.findOne({ _id: id }); 
            if (!response) {
                res.status(404).json({ message: 'Supplier not found' });
                return;
            }

            res.status(200).json(response);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default SupplierController;