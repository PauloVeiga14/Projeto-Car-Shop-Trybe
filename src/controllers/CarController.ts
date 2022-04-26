import { Request, Response } from 'express';
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

  readOne = async (
    req: Request<{ id: string }>,
    res: Response<Car | ResponseError>,
  ): Promise<typeof res> => {
    const { id } = req.params;
    if (id.length < 24) {
      return res.status(400).json({ error: this.errors.idLength });
    }
    try {
      const car = await this.service.readOne(id);

      if (!car) {
        return res.status(404).json({ error: this.errors.notFound });
      }

      return res.status(200).json(car);
    } catch (err) {
      return res.status(500).json({ error: this.errors.internal });
    }
  };

  update = async (
    req: RequestWithBody<Car>,
    res: Response<Car | ResponseError>,
  ): Promise<typeof res> => {
    const { id } = req.params;
    if (id.length < 24) {
      return res.status(400).json({ error: this.errors.idLength });
    }
    try {
      const updatedCar = await this.service.update(id, req.body);

      if (!updatedCar) {
        return res.status(404).json({ error: this.errors.notFound });
      }

      if ('error' in updatedCar) return res.status(400);

      return res.status(200).json(updatedCar);
    } catch (err) {
      return res.status(500).json({ error: this.errors.internal });
    }
  };

  delete = async (
    req: RequestWithBody<Car>,
    res: Response<Car | ResponseError>,
  ): Promise<typeof res> => {
    const { id } = req.params;
    if (id.length < 24) {
      return res.status(400).json({ error: this.errors.idLength });
    }
    try {
      const deletedCar = await this.service.delete(id);

      if (!deletedCar) {
        return res.status(404).json({ error: this.errors.notFound });
      }

      return res.status(204).json(deletedCar);
    } catch (err) {
      return res.status(500).json({ error: this.errors.internal });
    }
  };
}

export default CarController;
