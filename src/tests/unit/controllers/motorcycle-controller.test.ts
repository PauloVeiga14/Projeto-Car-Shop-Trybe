import * as sinon from 'sinon';
import chai from 'chai';
import mongoose from 'mongoose';
import { Response } from 'superagent';
import { data } from '../../mocks/motorcycleMocks';
import server from '../../../server';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;

let response: Response;

describe('Testa a camada MotorcycleController', () => {
  describe('Testa a rota POST /motorcycles', () => {

    describe('Requisição para criar motocicleta é enviada incorretamente', () => {

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/motorcycles').send({ ...data.newMotorcycle, model: 'ab' });

        expect(response.status).to.be.equal(400);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/motorcycles').send({ ...data.newMotorcycle, model: 'ab' });

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
          .post('/motorcycles').send(data.newMotorcycle);

        expect(response.status).to.be.equal(400);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/motorcycles').send(data.newMotorcycle);

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
          .post('/motorcycles').send(data.newMotorcycle);

        expect(response.status).to.be.equal(500);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/motorcycles').send(data.newMotorcycle);

        expect(response.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('Motocicleta é criada com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'create').resolves(data.createdMotorcycle);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 201', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/motorcycles').send(data.newMotorcycle);

        expect(response.status).to.be.equal(201);
      });

      it('Retorna uma nova motocicleta criada', async () => {
        let response = await chai.request('http://localhost:3001')
          .post('/motorcycles').send(data.newMotorcycle);

        expect(response.body).to.have.property('_id');
      });
    });
  });

  describe('Testa a rota GET /motorcycles/', () => {

    describe('Requisição retorna com erro no sistema', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'find').throws(new Error);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 500', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/motorcycles');

        expect(response.status).to.be.equal(500);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/motorcycles');

        expect(response.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('Retorna com o(s) objeto(s) solicitado(s)', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'find').resolves(data.arrayOfMotorcycles);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 200', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/motorcycles');

        expect(response.status).to.be.equal(200);
      });

      it('Retorna o array de motocicletas', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/motorcycles');

        expect(response.body).to.be.deep.equal(data.arrayOfMotorcycles);
      });
    });
  });

  describe('Testa a rota GET /motorcycles/:id', () => {

    const id = '4edd40c86762e0fb12000003';

    describe('id com tamanho menor do que 24 caracteres', () => {

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/motorcycles/1');

        expect(response.status).to.be.equal(400);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/motorcycles/1');

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
          .get('/motorcycles/123456789012345678901234')

        expect(response.status).to.be.equal(404);
      });

      it('Retorna com corpo da mensagem null', async () => {
        let response = await chai.request('http://localhost:3001')
          .get('/motorcycles/123456789012345678901234')

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
          .get(`/motorcycles/${id}`);

        expect(response.status).to.be.equal(500);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .get(`/motorcycles/${id}`);

        expect(response.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('Retorna com o objeto solicitado', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOne').resolves(data.createdMotorcycle);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 200', async () => {
        let response = await chai.request('http://localhost:3001')
          .get(`/motorcycles/${id}`);

        expect(response.status).to.be.equal(200);
      });

      it('Retorna o motocicleta com id enviado', async () => {
        let response = await chai.request('http://localhost:3001')
          .get(`/motorcycles/${id}`);

        expect(response.body).to.be.deep.equal(data.createdMotorcycle);
      });
    });
  });

  describe('Testa a rota PUT /motorcycles/:id', () => {

    const id = '4edd40c86762e0fb12000003';

    describe('id com tamanho menor do que 24 caracteres', () => {

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .put('/motorcycles/1').send(data.updateMotorcycle);;

        expect(response.status).to.be.equal(400);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .put('/motorcycles/1').send(data.updateMotorcycle);;

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
          .put(`/motorcycles/${id}`).send(data.updateMotorcycle);

        expect(response.status).to.be.equal(404);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/motorcycles/${id}`).send(data.updateMotorcycle);

        expect(response.body).to.have.property('error');
      });
    });

    describe('Requisição para atualizar motocicleta é enviada incorretamente', () => {

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/motorcycles/${id}`).send({ ...data.newMotorcycle, model: 'ab' });

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
          .put(`/motorcycles/${id}`).send(data.updateMotorcycle);

        expect(response.status).to.be.equal(500);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/motorcycles/${id}`).send(data.updateMotorcycle);

        expect(response.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('motocicleta é atualizado com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndUpdate').resolves(data.updatedMotorcycle);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 200', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/motorcycles/${id}`).send(data.updateMotorcycle);

        expect(response.status).to.be.equal(200);
      });

      it('Retorna um novo motocicleta criado', async () => {
        let response = await chai.request('http://localhost:3001')
          .put(`/motorcycles/${id}`).send(data.updateMotorcycle);

        expect(response.body).to.be.deep.equal(data.updatedMotorcycle);
      });
    });
  })

  describe('Testa a rota DELETE /motorcycles/:id', () => {

    const id = '4edd40c86762e0fb12000003';

    describe('id com tamanho menor do que 24 caracteres', () => {

      it('Retorna status 400', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete('/motorcycles/1');

        expect(response.status).to.be.equal(400);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete('/motorcycles/1');

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
          .delete(`/motorcycles/${id}`);

        expect(response.status).to.be.equal(404);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete(`/motorcycles/${id}`);

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
          .delete(`/motorcycles/${id}`);

        expect(response.status).to.be.equal(500);
      });

      it('Retorna uma mensagem de erro', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete(`/motorcycles/${id}`);

        expect(response.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('Motocicleta é deletada com sucesso', () => {

      before(() => {
        sinon.stub(mongoose.Model, 'findOneAndDelete').resolves(data.createdMotorcycle);
      });

      after(() => {
        sinon.restore();
      });

      it('Retorna status 204', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete(`/motorcycles/${id}`);

        expect(response.status).to.be.equal(204);
      });

      it('Retorna um novo motocicleta criado', async () => {
        let response = await chai.request('http://localhost:3001')
          .delete(`/motorcycles/${id}`);

        expect(response.body).to.be.deep.equal({});
      });
    });
  })
});