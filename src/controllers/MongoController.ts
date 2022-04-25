import { Request, Response } from 'express';
import { RequestWithBody } from '../interfaces/RequestWithBody';
import ControllerErrors from '../enums/ControllerErrors';
import Service from '../services/MongoService';

export type ResponseError = {
  message: unknown,
};

abstract class Controller<T> {
  abstract route: string;

  protected errors = ControllerErrors;

  constructor(protected service: Service<T>) { }

  abstract create(
    req: RequestWithBody<T>,
    res: Response<T | ResponseError>,
  ): Promise<typeof res>;

  read = async (
    _req: Request,
    res: Response<T[] | ResponseError>,
  ): Promise<typeof res> => {
    try {
      const arrayOfVehicles = await this.service.read();
      return res.status(200).json(arrayOfVehicles);
    } catch (err) {
      return res.status(500).json({ message: this.errors.internal });
    }
  };

  abstract readOne(
    req: Request<{ id: string }>,
    res: Response<T | ResponseError>
  ): Promise<typeof res>;
}

export default Controller;
