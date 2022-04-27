import { z } from 'zod';
import VehicleSchema from './VehicleInterface';

const MotorcycleSchema = VehicleSchema.extend({
  category: z.nativeEnum({ 
    Street: 'Street', Custom: 'Custom', Trail: 'Trail' }),
  engineCapacity: z.number().int().positive().lte(2500),
});

type Motorcycle = z.infer<typeof MotorcycleSchema>;

export default MotorcycleSchema;
export { Motorcycle };