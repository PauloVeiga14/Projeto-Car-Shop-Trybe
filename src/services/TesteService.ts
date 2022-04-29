import Service from './MongoService';
import CarModel from '../models/CarModel';
import { Car } from '../interfaces/CarInterface';

class ModelService extends Service<Car> {
  constructor(model = new CarModel()) {
    super(model);
  }
}

export default ModelService; 