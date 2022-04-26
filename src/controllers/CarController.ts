import { Response } from 'express';
import Controller, { ResponseError } from './MongoController';
import CarService from '../services/CarService';
import { RequestWithBody } from '../interfaces/RequestWithBody';
import { Car } from '../interfaces/CarInterface';

class CarController extends Controller<Car> {
  private _route: string;

  constructor(service = new CarService(), route = '/cars') {
    super(service);
    this._route = route;
  }

  // Pode não ser necessário. Avaliar.
  get route() { return this._route; }

  create = async (
    req: RequestWithBody<Car>,
    res: Response<Car | ResponseError>,
  ) => {
    const { body } = req;
    try {
      const newCar = await this.service.create(body);
      if (newCar === null || newCar === undefined) {
        return res.status(400).json({ error: this.errors.badRequest });
      }
      if ('error' in newCar) {
        return res.status(400).json({ error: this.errors.badRequest });
      }

      return res.status(201).json(newCar);
    } catch (err) {
      return res.status(500).json({ error: this.errors.internal });
    }
  };
}

export default CarController;
