import { ServiceError } from '../interfaces/ServiceError';
import Model from '../models/MongoModel';

abstract class Service<T> {
  constructor(protected model: Model<T>) { }

  public async create(obj: T): Promise<T | null | ServiceError> {
    return this.model.create(obj);
  }

  public async read(): Promise<T[]> {
    return this.model.read();
  }

  public async readOne(_id: string): Promise<T | null | ServiceError> {
    return this.model.readOne(_id);
  }

  public async update(_id: string, obj: T): Promise<T | null | ServiceError> {
    return this.model.update(_id, obj);
  }

  public async delete(_id: string): Promise<T | null | ServiceError> {
    return this.model.delete(_id);
  }
}

export default Service;