import { expect } from 'chai';
import mongoose from 'mongoose';
import * as sinon from 'sinon';
import { data } from '../../mocks/carMocks';

import CarModel from '../../../models/CarModel';

describe('Testa a camada CarModel', () => {
  
  const carModel = new CarModel();
  const _id = '4edd40c86762e0fb12000003'

  describe('Testa o método create', () => {
    
    before(() => {
      sinon.stub(mongoose.Model, 'create').resolves(data.createdCar)
    });

    after(() => {
      sinon.restore();
    });

    it('Cadastra um novo carro no banco de dados', async () => {
      const result = await carModel.create(data.newCar);

      expect(result).to.be.equal(data.createdCar);
    });
  });

  describe('Testa o método read', () => {
    
    before(() => {
      sinon.stub(mongoose.Model, 'find').resolves(data.arrayOfCars);
    });

    after(() => {
      sinon.restore();
    });

    it('Retorna o array de carros cadastrados', async () => {
      const result = await carModel.read();

      expect(result).to.be.equal(data.arrayOfCars);
    });
  }) ; 

  describe('Testa o método readOne', () => {
    
    before(() => {
      sinon.stub(mongoose.Model, 'findOne').resolves(data.arrayOfCars);
    });

    after(() => {
      sinon.restore();
    });

    it('Retorna o carro com id informado', async () => {
      const result = await carModel.readOne(_id);

      expect(result).to.be.equal(data.arrayOfCars);
    });
  }) ;  

  describe('Testa o método update', () => {
    
    before(() => {
      sinon.stub(mongoose.Model, 'findOneAndUpdate').resolves(data.updatedCar);
    });

    after(() => {
      sinon.restore();
    });

    it('Realiza o update de um carro no banco de dados', async () => {
      const result = await carModel.update(_id, data.updateCar);

      expect(result).to.be.equal(data.updatedCar);
    });
  });

  describe('Testa o método delete', () => {
    before(() => {
      sinon.stub(mongoose.Model, 'findOneAndDelete').resolves(null);
    });

    after(() => {
      sinon.restore();
    });

    it('Deleta o arquivo do banco de dados', async () => {
      const result = await carModel.delete(_id);

      expect(result).to.be.equal(null);
    })
  });
});