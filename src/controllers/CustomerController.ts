import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'

import mongodb from 'mongodb'
import { Customer, CustomerType } from '../mongodb/CustomerMongodb'

const customerRouter = express();

async function initCustomer() {
  //init db
  const connection = await mongodb.connect(`${process.env.MONGODB_URI}`,{ useUnifiedTopology: true });
  const db = connection.db(`${process.env.MONGODB_NAME}`);
  const customerModel = new Customer(db);  

  customerRouter.use(bodyParser.json());

  customerRouter.post('/add', async function(req, res, next) {
    try {
      await customerModel.create(req.body);
    } catch (error) {
      return next(error)
    }
    res.send({ success: true })
  })

  customerRouter.get('/view', async function(req, res, next) {
    let customers: CustomerType[]
    try {
      customers = await customerModel.getAll()
    } catch (error) {
      return next(error)
    }
    return res.send(customers)
  })

  customerRouter.get('/view/:id', async function(req, res, next) {
    let customer: CustomerType | null
    try {
      customer = await customerModel.getByID(req.params.id)
    } catch (error) {
      console.log(error)
      return next(error)
    }
    return res.send(customer)
  })

  customerRouter.put('/update/:id', async function(req, res, next) {
    try {
      await customerModel.update(req.params.id, req.body)
    } catch (error) {
      return next(error);
    }
    res.send({ success: true })
  })

  customerRouter.delete('/delete/:id', async function(req, res, next) {
    try {
      await customerModel.delete(req.params.id)
    } catch (error) {
      return next(error);
    }
    res.send({ success: true })
  })
 
}

initCustomer()
export default customerRouter