import { expect } from 'chai';
import * as sinon from 'sinon';
import { data } from '../../mocks/motorcycleMocks';

import MotorcycleService from '../../../services/MotorcycleService';
import mongoose from 'mongoose';

describe('Testa a camada MotorcycleService', () => {

  const motorcycleService = new MotorcycleService();

  describe('Testa o método create', () => {

    describe('Erro na criação do veículo', () => {

      it('Veículo cadastrado com atributo model com menos de 3 caracteres', async () => {
        const result = await motorcycleService.create(
          { ...data.newMotorcycle, category: "Street", model: 'ab' }
        );

        expect(result).to.have.an.property('error');
      });

      it('Veículo cadastrado com o atributo year fora do intervalo permitido', async () => {
        const firstResult = await motorcycleService.create(
          { ...data.newMotorcycle, category: 'Street', year: 2050 }
        );
        const secondResult = await motorcycleService.create(
          { ...data.newMotorcycle, category: 'Street', year: 1000 }
        );

        expect(firstResult).to.have.an.property('error');
        expect(secondResult).to.have.an.property('error');
      });

      it('Veículo cadastrado com o atributo color com menos de 3 caracteres', async () => {
        const result = await motorcycleService.create(
          { ...data.newMotorcycle, category: 'Street', color: 'ab' }
        );

        expect(result).to.have.an.property('error');
      });

      it('Veículo cadastrado com valor do atributo buyValue diferente de inteiro', async () => {
        const result = await motorcycleService.create(
          { ...data.newMotorcycle, category: 'Street', buyValue: 15000.50 }
        );

        expect(result).to.have.an.property('error');
      });

      it('Veículo cadastrado com engineCapacity fora do intervalo permitido', async () => {
        const firstResult = await motorcycleService.create(
          { ...data.newMotorcycle, category: 'Street', engineCapacity: 1000.50 }
        );
        const secondResult = await motorcycleService.create(
          { ...data.newMotorcycle, category: 'Street', engineCapacity: -1000 }
        );
        const thirdResult = await motorcycleService.create(
          { ...data.newMotorcycle, category: 'Street', engineCapacity: 2501 }
        );

        expect(firstResult).to.have.an.property('error');
        expect(secondResult).to.have.an.property('error');
        expect(thirdResult).to.have.an.property('error');
      });
    });

    describe('Veículo criado com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'create').resolves(data.createdMotorcycle);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna um objeto criado com sucesso', async () => {
        const result = await motorcycleService.create({ ...data.newMotorcycle, category: 'Street' })

        expect(result).to.be.equal(data.createdMotorcycle);
      });
    });
  });

  describe('Testa o método update', () => {

    const _id = "4edd40c86762e0fb12000003";

    describe('Erro na atualização do veículo', () => {

      it('Veículo atualizado com atributo model com menos de 3 caracteres', async () => {
        const result = await motorcycleService.update(
          _id, { ...data.newMotorcycle, category: 'Street', model: 'ab' }
        );

        expect(result).to.have.an.property('error');
      });

      it('Veículo atualizado com o atributo year fora do intervalo permitido', async () => {
        const firstResult = await motorcycleService.update(
          _id, { ...data.newMotorcycle, category: 'Street', year: 2050 }
        );
        const secondResult = await motorcycleService.update(
          _id, { ...data.newMotorcycle, category: 'Street', year: 1000 }
        );

        expect(firstResult).to.have.an.property('error');
        expect(secondResult).to.have.an.property('error');
      });

      it('Veículo atualizado com o atributo color com menos de 3 caracteres', async () => {
        const result = await motorcycleService.update(
          _id, { ...data.newMotorcycle, category: 'Street', color: 'ab' }
        );

        expect(result).to.have.an.property('error');
      });

      it('Veículo atualizado com valor do atributo buyValue diferente de inteiro', async () => {
        const result = await motorcycleService.update(
          _id, { ...data.newMotorcycle, category: 'Street', buyValue: 15000.50 }
        );

        expect(result).to.have.an.property('error');
      });

      it('Veículo atualizado com engineCapacity fora do intervalo permitido', async () => {
        const firstResult = await motorcycleService.update(
          _id, { ...data.newMotorcycle, category: 'Street', engineCapacity: 1000.50 }
        );
        const secondResult = await motorcycleService.update(
          _id, { ...data.newMotorcycle, category: 'Street', engineCapacity: -1000 }
        );
        const thirdResult = await motorcycleService.update(
          _id, { ...data.newMotorcycle, category: 'Street', engineCapacity: 2501 }
        );

        expect(firstResult).to.have.an.property('error');
        expect(secondResult).to.have.an.property('error');
        expect(thirdResult).to.have.an.property('error');
      });
    });

    describe('Veículo atualizado com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndUpdate').resolves(data.updatedMotorcycle);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna um objeto criado com sucesso', async () => {
        const result = await motorcycleService.update(
          _id, { ...data.updateMotorcycle, category: 'Street' }
        )

        expect(result).to.be.equal(data.updatedMotorcycle);
      });
    });

  });
});