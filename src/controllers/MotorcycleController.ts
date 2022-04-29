import { Request, Response } from 'express';
import Controller, { ResponseError } from './MongoController';
import MotorcycleService from '../services/MotorcycleService';
import { RequestWithBody } from '../interfaces/RequestWithBody';
import { Motorcycle } from '../interfaces/MotorcycleInterface';

class MotorcycleController extends Controller<Motorcycle> {
  private _route: string;

  constructor(service = new MotorcycleService(), route = '/motorcycles') {
    super(service);
    this._route = route;
  }

  get route() { return this._route; }

  create = async (
    req: RequestWithBody<Motorcycle>,
    res: Response<Motorcycle | ResponseError>,
  ) => {
    const { body } = req;
    try {
      const newMotorcycle = await this.service.create(body);
      if (newMotorcycle === null || newMotorcycle === undefined) {
        return res.status(400).json({ error: this.errors.badRequest });
      }
      if ('error' in newMotorcycle) {
        return res.status(400).json({ error: this.errors.badRequest });
      }

      return res.status(201).json(newMotorcycle);
    } catch (err) {
      return res.status(500).json({ error: this.errors.internal });
    }
  };

  readOne = async (
    req: Request<{ id: string }>,
    res: Response<Motorcycle | ResponseError>,
  ): Promise<typeof res> => {
    const { id } = req.params;
    if (id.length < 24) {
      return res.status(400).json({ error: this.errors.idLength });
    }
    try {
      const motorcycle = await this.service.readOne(id);

      if (!motorcycle) {
        return res.status(404).json({ error: this.errors.notFound });
      }

      return res.status(200).json(motorcycle);
    } catch (err) {
      return res.status(500).json({ error: this.errors.internal });
    }
  };

  update = async (
    req: RequestWithBody<Motorcycle>,
    res: Response<Motorcycle | ResponseError>,
  ): Promise<typeof res> => {
    const { id } = req.params;
    if (id.length < 24) {
      return res.status(400).json({ error: this.errors.idLength });
    }
    try {
      const updatedMotorcycle = await this.service.update(id, req.body);

      if (!updatedMotorcycle) {
        return res.status(404).json({ error: this.errors.notFound });
      }

      if ('error' in updatedMotorcycle) return res.status(400).json();

      return res.status(200).json(updatedMotorcycle);
    } catch (err) {
      return res.status(500).json({ error: this.errors.internal });
    }
  };

  delete = async (
    req: RequestWithBody<Motorcycle>,
    res: Response<Motorcycle | ResponseError>,
  ): Promise<typeof res> => {
    const { id } = req.params;
    if (id.length < 24) {
      return res.status(400).json({ error: this.errors.idLength });
    }
    try {
      const deletedMotorcycle = await this.service.delete(id);

      if (!deletedMotorcycle) {
        return res.status(404).json({ error: this.errors.notFound });
      }

      return res.status(204).json(deletedMotorcycle);
    } catch (err) {
      return res.status(500).json({ error: this.errors.internal });
    }
  };
}

export default MotorcycleController;