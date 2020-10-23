import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'

import branchRouter from './controllers/BranchController'
import customerRouter from './controllers/CustomerController'
import employeeRouter from './controllers/EmployeeController'

async function initApp() {
  
  const app = express();

  app.use(bodyParser.json());

  app.use('/branch', branchRouter)
  app.use('/customer', customerRouter)
  app.use('/employee', employeeRouter)
  

  app.listen(process.env.PORT || 8000, () => {
    console.log(`App listen on port ${ process.env.PORT || 8000 }`)
  })
}


initApp()