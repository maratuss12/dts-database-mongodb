import mongodb from 'mongodb'

export type BranchType = {
  branch_name: string
	street: string
	city: string
	state: string
	zip_code: string
	phone_number: string

}

export class Branch {
  private collection: mongodb.Collection<BranchType>

  constructor(db: mongodb.Db) {
    this.collection = db.collection('branch')
  }

  async create(data: BranchType) {
    try {
      const result = await this.collection.insertOne(data)
      console.log('Insert result %j', result)
    } catch (error) {
      throw error
    }
  }

  async getAll() {
    let branchs: BranchType[]
    try {
      branchs = await this.collection.find().toArray()
    } catch (error) {
      throw error
    }
    return branchs
  }

  async getByID(branchID: string) {
    let branch: BranchType | null
    try {
      branch = await this.collection.findOne({ _id: new mongodb.ObjectID(branchID) })
    } catch (error) {
      throw error
    }
    return branch
  }

  async update(branchID: string, updateData: Partial<BranchType>) {
    try {
      await this.collection.updateOne({ _id: new mongodb.ObjectID(branchID) }, { $set: updateData})
    } catch (error) {
      throw error
    }
  }


  async delete(branchID: string) {
    try {
      await this.collection.deleteOne({ _id: new mongodb.ObjectID(branchID) })
    } catch (error) {
      throw error
    }
  }
}