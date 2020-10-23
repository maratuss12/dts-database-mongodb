import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'

import mongodb from 'mongodb'
import { Branch, BranchType } from '../mongodb/BranchMongodb'

const branchRouter = express();

async function initBranch() {
  //init db
  const connection = await mongodb.connect(`${process.env.MONGODB_URI}`,{ useUnifiedTopology: true });
  const db = connection.db(`${process.env.MONGODB_NAME}`);
  const branchModel = new Branch(db);  

  branchRouter.use(bodyParser.json());

  branchRouter.post('/add', async function(req, res, next) {
    try {
      await branchModel.create(req.body);
    } catch (error) {
      return next(error);
    };
    res.send({ success: true });
  })

  branchRouter.get('/view', async function(req, res, next) {
    let branchs: BranchType[]
    try {
      branchs = await branchModel.getAll()
    } catch (error) {
      return next(error)
    }
    return res.send(branchs)
  })

  branchRouter.get('/view/:id', async function(req, res, next) {
    let branch: BranchType | null
    try {
      branch = await branchModel.getByID(req.params.id)
    } catch (error) {
      console.log(error)
      return next(error)
    }
    return res.send(branch)
  })

  branchRouter.put('/update/:id', async function(req, res, next) {
    try {
      await branchModel.update(req.params.id, req.body)
    } catch (error) {
      return next(error);
    }
    res.send({ success: true })
  })

  branchRouter.delete('/delete/:id', async function(req, res, next) {
    try {
      await branchModel.delete(req.params.id)
    } catch (error) {
      return next(error);
    }
    res.send({ success: true })
  })
 
}

initBranch()
export default branchRouter