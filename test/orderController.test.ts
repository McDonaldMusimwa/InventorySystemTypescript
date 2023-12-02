import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Request, Response } from 'express';
import sinon from 'sinon';
import OrderController from '../src/controller/order';
import PurchaseOrder, { Order }from '../src/models/order';
import Stock from '../src/models/stockitem';

describe('OrderController', () => {
  describe('addOrder', () => {
    it('should add a new order successfully', async () => {
      const request: Partial<Request> = {
        body: {
          customername: 'John Doe',
          dateordered: new Date(),
          customerphone: '1234567890',
          customeremail: 'john.doe@example.com',
          products: [
            {
              productId: '1',
              quantity: 5,
            },
          ],
        },
      };

      const response: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Mock the necessary methods for testing
      sinon.stub(PurchaseOrder.prototype, 'save').resolves({} as any);
      sinon.stub(Stock, 'findOne').resolves({
        productId: '1',
        shipments: [{ quantityreceived: 10 }],
        save: sinon.stub(),
      } as any);

      const orderController = new OrderController();
      await orderController.addOrder(request as Request, response as Response);

      sinon.assert.calledOnce(response.status as sinon.SinonStub);
      sinon.assert.calledWith(response.status as sinon.SinonStub, 201);
      sinon.assert.calledOnce(response.json as sinon.SinonStub);
      sinon.assert.calledWith(response.json as sinon.SinonStub, { message: 'Order added successfully', order: {} });
    });

    it('should handle error when adding an order', async () => {
      const request: Partial<Request> = {
        body: {
          // Invalid request to trigger an error
        },
      };

      const response: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const orderController = new OrderController();
      await orderController.addOrder(request as Request, response as Response);

      sinon.assert.calledOnce(response.status as sinon.SinonStub);
      sinon.assert.calledWith(response.status as sinon.SinonStub, 400);
      sinon.assert.calledOnce(response.json as sinon.SinonStub);
      sinon.assert.calledWith(response.json as sinon.SinonStub, { message: 'Enter valid order details with products' });
    });
  });

  // Add more test cases for other methods in OrderController
});
