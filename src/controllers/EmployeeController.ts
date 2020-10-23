import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'

import mongodb from 'mongodb'
import { Employee, EmployeeType } from '../mongodb/EmployeeMongodb'

const employeeRouter = express();

async function initEmployee() {
  //init db
  const connection = await mongodb.connect(`${process.env.MONGODB_URI}`,{ useUnifiedTopology: true });
  const db = connection.db(`${process.env.MONGODB_NAME}`);
  const employeeModel = new Employee(db);  

  employeeRouter.use(bodyParser.json());

  employeeRouter.post('/add', async function(req, res, next) {
    try {
      await employeeModel.create(req.body);
    } catch (error) {
      return next(error);
    };
    res.send({ success: true });
  })

  employeeRouter.get('/view', async function(req, res, next) {
    let employees: EmployeeType[]
    try {
      employees = await employeeModel.getAll()
    } catch (error) {
      return next(error)
    }
    return res.send(employees)
  })

  employeeRouter.get('/view/:id', async function(req, res, next) {
    let employee: EmployeeType | null
    try {
      employee = await employeeModel.getByID(req.params.id)
    } catch (error) {
      console.log(error)
      return next(error)
    }
    return res.send(employee)
  })

  employeeRouter.put('/update/:id', async function(req, res, next) {
    try {
      await employeeModel.update(req.params.id, req.body)
    } catch (error) {
      return next(error);
    }
    res.send({ success: true })
  })

  employeeRouter.delete('/delete/:id', async function(req, res, next) {
    try {
      await employeeModel.delete(req.params.id)
    } catch (error) {
      return next(error);
    }
    res.send({ success: true })
  })
 
}

initEmployee()
export default employeeRouter