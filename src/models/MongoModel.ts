// Esse classe implementará a interface Model criada no req1 e servirá de maneira genérica
// para a criação de qualquer tipo de veículo.

import { Model as M, Document } from 'mongoose';
import { Model } from '../interfaces/ModelInterface';

abstract class MongoModel<T> implements Model<T> {
  constructor(protected model: M<T & Document>) { }

  create = async (obj: T): Promise<T> => this.model.create({ ...obj });

  read = async (): Promise<T[]> => this.model.find();

  readOne = async (id: string): Promise<T | null> =>
    this.model.findOne({ _id: id });

  update = async (id: string, obj: T): Promise<T | null> =>
    this.model.findByIdAndUpdate({ _id: id }, { ...obj });

  delete = async (id: string): Promise<T | null> => 
    this.model.findByIdAndDelete({ _id: id });
}

export default MongoModel;