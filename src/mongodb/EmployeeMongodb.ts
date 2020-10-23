import mongodb from 'mongodb'

export type EmployeeType = {
  first_name: string
	last_name: string
	age: number
  employee_type: string
  salary: number
	street: string
	city: string
	state: string
	phone_number: string

}

export class Employee {
  private collection: mongodb.Collection<EmployeeType>

  constructor(db: mongodb.Db) {
    this.collection = db.collection('Employee')
  }

  async create(data: EmployeeType) {
    try {
      const result = await this.collection.insertOne(data)
      console.log('Insert result %j', result)
    } catch (error) {
      throw error
    }
  }

  async getAll() {
    let employees: EmployeeType[]
    try {
      employees = await this.collection.find().toArray()
    } catch (error) {
      throw error
    }
    return employees
  }

  async getByID(employeeID: string) {
    let employee: EmployeeType | null
    try {
      employee = await this.collection.findOne({ _id: new mongodb.ObjectID(employeeID) })
    } catch (error) {
      throw error
    }
    return employee
  }

  async update(employeeID: string, updateData: Partial<EmployeeType>) {
    try {
      await this.collection.updateOne({ _id: new mongodb.ObjectID(employeeID) }, { $set: updateData})
    } catch (error) {
      throw error
    }
  }


  async delete(employeeID: string) {
    try {
      await this.collection.deleteOne({ _id: new mongodb.ObjectID(employeeID) })
    } catch (error) {
      throw error
    }
  }
}