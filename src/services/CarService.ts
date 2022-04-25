import { ServiceError } from '../interfaces/ServiceError';
import CarSchema, { Car } from '../interfaces/CarInterface';
import Service from './MongoService';
import CarModel from '../models/CarModel';

class CarService extends Service<Car> {
  constructor(model = new CarModel()) {
    super(model);
  }

  // Métodos read() e readOne() não precisam de validação especial.

  create = async (obj: Car): Promise<Car | ServiceError | null> => {
    const parsed = CarSchema.safeParse(obj);
    if (parsed.success === false) {
      return { error: parsed.error };
    }

    return this.model.create(obj);
  };
}

export default CarService;