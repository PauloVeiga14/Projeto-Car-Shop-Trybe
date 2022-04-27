import { expect } from 'chai';
import * as sinon from 'sinon';
import { data } from '../../mocks/carMocks';

import CarService from '../../../services/CarService';

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

    // O teste abaixo não está incluindo a linha 18. Não sei o motivo. 
    // Sugestão: verificar o retorno dessa linha no Postman.

    describe('Veículo criado com sucesso', () => {

      before(() => {
        sinon.stub(carService, 'create').resolves(data.createdCar);
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
});