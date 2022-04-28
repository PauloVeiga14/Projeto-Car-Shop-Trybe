import * as sinon from 'sinon';
import chai from 'chai';
import mongoose from 'mongoose';
import { Response } from 'superagent';
import CarController from '../../../controllers/CarController';
import { data } from '../../mocks/carMocks';
import server from '../../../server';
import chaiHttp = require('chai-http');

const app = server.startServer();

chai.use(chaiHttp);

const { expect } = chai;

let response: Response;

describe('Testa a camada CarController', () => {
  describe('Testa a rota POST /cars', () => {

    describe('Requisição para criar carro é enviada incorretamente', () => {

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/cars').send({ ...data.newCar, model: 'ab' });

        expect(response.status).to.be.equal(400);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/cars').send({ ...data.newCar, model: 'ab' });

        expect(response.body).to.have.property('error');
      });
    });

    describe('Requisição retorna com body null', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'create').resolves(null);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/cars').send(data.newCar);

        expect(response.status).to.be.equal(400);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/cars').send(data.newCar);

        expect(response.body).to.have.property('error');
      });
    });

    describe('Requisição retorna com erro no sistema', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'create').throws(new Error);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 500', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/cars').send(data.newCar);

        expect(response.status).to.be.equal(500);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/cars').send(data.newCar);

        expect(response.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('Carro é criado com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'create').resolves(data.createdCar);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 201', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/cars').send(data.newCar);

        expect(response.status).to.be.equal(201);
      });

      it('Retorna um novo carro criado', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/cars').send(data.newCar);

        expect(response.body).to.have.property('_id');
      });
    });
  });

  describe('Testa a rota GET /cars/', () => {

    describe('Requisição retorna com erro no sistema', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'find').throws(new Error);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 500', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/cars');

        expect(response.status).to.be.equal(500);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/cars');

        expect(response.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('Retorna com o(s) objeto(s) solicitado(s)', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'find').resolves(data.arrayOfCars);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 200', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/cars');

        expect(response.status).to.be.equal(200);
      });

      it('Retorna o array de carros', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/cars');

        expect(response.body).to.be.deep.equal(data.arrayOfCars);
      });
    });
  });

  describe('Testa a rota GET /cars/:id', () => {

    const id = '4edd40c86762e0fb12000003';

    describe('id com tamanho menor do que 24 caracteres', () => {

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/cars/1');

        expect(response.status).to.be.equal(400);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/cars/1');

        expect(response.body.error).to.be.equal('Id must have 24 hexadecimal characters');
      });
    });

    describe('Requisição retorna com body null', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOne').resolves(null);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 404', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/cars/123456789012345678901234')

        expect(response.status).to.be.equal(404);
      });

      it('Retorna com corpo da mensagem null', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/cars/123456789012345678901234')

        expect(response.body.error).to.be.equal('Object not found');
      });
    });

    describe('Requisição retorna com erro no sistema', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOne').throws(new Error);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 500', async () => {
        let response = await chai.request('http://localhost:3001')
          .get(`/cars/${id}`);

        expect(response.status).to.be.equal(500);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .get(`/cars/${id}`);

        expect(response.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('Retorna com o objeto solicitado', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOne').resolves(data.createdCar);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 200', async () => {
        let response = await chai.request('http://localhost:3001')
          .get(`/cars/${id}`);

        expect(response.status).to.be.equal(200);
      });

      it('Retorna o carro com id enviado', async () => {
        let response = await chai.request('http://localhost:3001')
          .get(`/cars/${id}`);

        expect(response.body).to.be.deep.equal(data.createdCar);
      });
    });
  });

  describe('Testa a rota PUT /cars/:id', () => {

    const id = '4edd40c86762e0fb12000003';

    describe('id com tamanho menor do que 24 caracteres', () => {

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .put('/cars/1').send(data.updateCar);;

        expect(response.status).to.be.equal(400);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .put('/cars/1').send(data.updateCar);;

        expect(response.body.error).to.be.equal('Id must have 24 hexadecimal characters');
      });
    });

    describe('Requisição retorna com body null', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndUpdate').resolves(null);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 404', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/cars/${id}`).send(data.updateCar);

        expect(response.status).to.be.equal(404);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/cars/${id}`).send(data.updateCar);

        expect(response.body).to.have.property('error');
      });
    });

    describe('Requisição para atualizar carro é enviada incorretamente', () => {

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/cars/${id}`).send({ ...data.newCar, model: 'ab' });

        expect(response.status).to.be.equal(400);
      });
    });

    describe('Requisição retorna com erro no sistema', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndUpdate').throws(new Error);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 500', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/cars/${id}`).send(data.updateCar);

        expect(response.status).to.be.equal(500);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/cars/${id}`).send(data.updateCar);

        expect(response.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('Carro é atualizado com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndUpdate').resolves(data.updatedCar);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 200', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/cars/${id}`).send(data.updateCar);

        expect(response.status).to.be.equal(200);
      });

      it('Retorna um novo carro criado', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/cars/${id}`).send(data.updateCar);

        expect(response.body).to.be.deep.equal(data.updatedCar);
      });
    });
  })


  describe('Testa a rota DELETE /cars/:id', () => {

    const id = '4edd40c86762e0fb12000003';

    describe('id com tamanho menor do que 24 caracteres', () => {

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete('/cars/1');

        expect(response.status).to.be.equal(400);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete('/cars/1');

        expect(response.body.error).to.be.equal('Id must have 24 hexadecimal characters');
      });
    });

    describe('Requisição retorna com body null', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndDelete').resolves(null);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 404', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete(`/cars/${id}`);

        expect(response.status).to.be.equal(404);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete(`/cars/${id}`);

        expect(response.body).to.have.property('error');
      });
    });

    describe('Requisição retorna com erro no sistema', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndDelete').throws(new Error);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 500', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete(`/cars/${id}`);

        expect(response.status).to.be.equal(500);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete(`/cars/${id}`);

        expect(response.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('Carro é deletado com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndDelete').resolves(data.createdCar);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 204', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete(`/cars/${id}`);

        expect(response.status).to.be.equal(204);
      });

      it('Retorna um novo carro criado', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete(`/cars/${id}`);

        expect(response.body).to.be.deep.equal({});
      });
    });
  })
});