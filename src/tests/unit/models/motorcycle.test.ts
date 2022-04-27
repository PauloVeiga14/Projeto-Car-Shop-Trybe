import { expect } from 'chai';
import mongoose from 'mongoose';
import * as sinon from 'sinon';
import { data } from '../../mocks/motorcycleMocks';

import MotorcycleModel from '../../../models/MotorcycleModel';

describe('Testa a camada MotorcycleModel', () => {
  
  const motorcycleModel = new MotorcycleModel();
  const _id = '4edd40c86762e0fb12000003'

  describe('Testa o método create', () => {
    
    before(() => {
      sinon.stub(mongoose.Model, 'create').resolves(data.createdMotorcycle)
    });

    after(() => {
      sinon.restore();
    });

    it('Cadastra um novo Motorcyclero no banco de dados', async () => {
      const result = await motorcycleModel.create(data.newMotorcycle);

      expect(result).to.be.equal(data.createdMotorcycle);
    });
  });

  describe('Testa o método read', () => {
    
    before(() => {
      sinon.stub(mongoose.Model, 'find').resolves(data.arrayOfMotorcycles);
    });

    after(() => {
      sinon.restore();
    });

    it('Retorna o array de Motorcycleros cadastrados', async () => {
      const result = await motorcycleModel.read();

      expect(result).to.be.equal(data.arrayOfMotorcycles);
    });
  }) ; 

  describe('Testa o método readOne', () => {
    
    before(() => {
      sinon.stub(mongoose.Model, 'findOne').resolves(data.arrayOfMotorcycles);
    });

    after(() => {
      sinon.restore();
    });

    it('Retorna o Motorcyclero com id informado', async () => {
      const result = await motorcycleModel.readOne(_id);

      expect(result).to.be.equal(data.arrayOfMotorcycles);
    });
  }) ;  

  describe('Testa o método update', () => {
    
    before(() => {
      sinon.stub(mongoose.Model, 'findOneAndUpdate').resolves(data.updatedMotorcycle);
    });

    after(() => {
      sinon.restore();
    });

    it('Realiza o update de um Motorcyclero no banco de dados', async () => {
      const result = await motorcycleModel.update(_id, data.updateMotorcycle);

      expect(result).to.be.equal(data.updatedMotorcycle);
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
      const result = await motorcycleModel.delete(_id);

      expect(result).to.be.equal(null);
    })
  });
});