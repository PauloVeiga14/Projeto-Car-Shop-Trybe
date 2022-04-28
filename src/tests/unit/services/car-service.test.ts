import { expect } from 'chai';
import * as sinon from 'sinon';
import { data } from '../../mocks/carMocks';

import CarService from '../../../services/CarService';
import mongoose from 'mongoose';

describe('Testa a camada CarService', () => {
  
  const carService = new CarService();

  describe('Testa o método create', () => {

    describe('Erro na criação do veículo', () => {

      it('Veículo cadastrado com atributo model com menos de 3 caracteres', async() => {
        const result = await carService.create({...data.newCar, model: 'ab'});

        expect(result).to.have.an.property('error');
      });

      it('Veículo cadastrado com o atributo year fora do intervalo permitido', async () => {
        const firstResult = await carService.create({...data.newCar, year: 2050});
        const secondResult = await carService.create({...data.newCar, year: 1000});

        expect(firstResult).to.have.an.property('error');
        expect(secondResult).to.have.an.property('error');
      });

      it('Veículo cadastrado com o atributo color com menos de 3 caracteres', async () => {
        const result = await carService.create({...data.newCar, color: 'ab'});

        expect(result).to.have.an.property('error');
      });

      it('Veículo cadastrado com valor do atributo buyValue diferente de inteiro', async () => {
        const result = await carService.create({...data.newCar, buyValue: 15000.50});

        expect(result).to.have.an.property('error');
      });

      it('Veículo cadastrado com doorsQty fora do intervalo permitido', async () => {
        const firstResult = await carService.create({...data.newCar, doorsQty: 1});
        const secondResult = await carService.create({...data.newCar, doorsQty: 5});

        expect(firstResult).to.have.an.property('error');
        expect(secondResult).to.have.an.property('error');
      });

      it('Veículo cadastrado com seatsQty fora do intervalo permitido', async () => {
        const firstResult = await carService.create({...data.newCar, seatsQty: 1});
        const secondResult = await carService.create({...data.newCar, seatsQty: 8});

        expect(firstResult).to.have.an.property('error');
        expect(secondResult).to.have.an.property('error');
      });
    });

    describe('Veículo criado com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'create').resolves(data.createdCar);
      });

      after(() => {
        sinon.restore();
      });
  
      it('Retorna um objeto criado com sucesso', async () => {
        const result = await carService.create(data.newCar)
  
        expect(result).to.be.equal(data.createdCar);
      });
    });
  });

  describe('Testa o método update', () => {
    
    const _id = "4edd40c86762e0fb12000003";

    describe('Erro na atualização do veículo', () => {

      it('Veículo atualizado com atributo model com menos de 3 caracteres', async() => {
        const result = await carService.update(_id, {...data.newCar, model: 'ab'});

        expect(result).to.have.an.property('error');
      });

      it('Veículo atualizado com o atributo year fora do intervalo permitido', async () => {
        const firstResult = await carService.update(_id, {...data.newCar, year: 2050});
        const secondResult = await carService.update(_id, {...data.newCar, year: 1000});

        expect(firstResult).to.have.an.property('error');
        expect(secondResult).to.have.an.property('error');
      });

      it('Veículo atualizado com o atributo color com menos de 3 caracteres', async () => {
        const result = await carService.update(_id, {...data.newCar, color: 'ab'});

        expect(result).to.have.an.property('error');
      });

      it('Veículo atualizado com valor do atributo buyValue diferente de inteiro', async () => {
        const result = await carService.update(_id, {...data.newCar, buyValue: 15000.50});

        expect(result).to.have.an.property('error');
      });

      it('Veículo atualizado com doorsQty fora do intervalo permitido', async () => {
        const firstResult = await carService.update(_id, {...data.newCar, doorsQty: 1});
        const secondResult = await carService.update(_id, {...data.newCar, doorsQty: 5});

        expect(firstResult).to.have.an.property('error');
        expect(secondResult).to.have.an.property('error');
      });

      it('Veículo atualizado com seatsQty fora do intervalo permitido', async () => {
        const firstResult = await carService.update(_id, {...data.newCar, seatsQty: 1});
        const secondResult = await carService.update(_id, {...data.newCar, seatsQty: 8});

        expect(firstResult).to.have.an.property('error');
        expect(secondResult).to.have.an.property('error');
      });
    });
    
    describe('Veículo atualizado com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndUpdate').resolves(data.updatedCar);
      });

      after(() => {
        sinon.restore();
      });
  
      it('Retorna um objeto criado com sucesso', async () => {
        const result = await carService.update(_id, data.updateCar)
  
        expect(result).to.be.equal(data.updatedCar);
      });
    });

  });
});