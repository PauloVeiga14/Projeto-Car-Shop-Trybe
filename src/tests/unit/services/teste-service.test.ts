import { expect } from 'chai';
import * as sinon from 'sinon';
import { data } from '../../mocks/carMocks';

import TesteService from '../../../services/TesteService';
import mongoose from 'mongoose';

describe('Testa a camada TesteService', () => {
  
  const testeService = new TesteService();

  describe('Testa o método create', () => {

    describe('Veículo criado com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'create').resolves(data.createdCar);
      });

      after(() => {
        sinon.restore();
      });
  
      it('Retorna um objeto criado com sucesso', async () => {
        const result = await testeService.create(data.newCar)
  
        expect(result).to.be.equal(data.createdCar);
      });
    });
  });

  describe('Testa o método update', () => {
    
    const _id = "4edd40c86762e0fb12000003";
     
    describe('Veículo atualizado com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndUpdate').resolves(data.updatedCar);
      });

      after(() => {
        sinon.restore();
      });
  
      it('Retorna um objeto criado com sucesso', async () => {
        const result = await testeService.update(_id, data.updateCar)
  
        expect(result).to.be.equal(data.updatedCar);
      });
    });

  });
});