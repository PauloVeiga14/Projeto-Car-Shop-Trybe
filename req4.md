04 - Crie uma rota para o endpoint /cars onde seja possível cadastrar um novo carro
Crie uma rota que receba uma requisição POST para cadastrar um veículo do tipo carro. Será verificado que:

A rota retorna erro 400 caso a requisição receba um objeto vazio;

A rota retorna erro 400 ao tentar criar um carro com quantidade de assentos inferior a 2;

A rota retorna erro 400 ao tentar criar um carro com quantidade de portas inferior a 2;

A rota retorna erro 400 ao tentar criar um carro sem model, year, color, status e buyValue;

A rota retorna erro 400 ao tentar criar um carro sem doorsQty e seatsQty;

Não é possível criar um carro se os atributos estiverem com tipos errados;

É possível criar um carro se todos os parametros forem passados corretamente;

Sua API deve responder com status http 201 e o seguinte body:

 _id: "4edd40c86762e0fb12000003",
   model: "Ferrari Maranello",
   year: 1963,
   color: "red",
   buyValue: 3500000,
   seatsQty: 2,
   doorsQty: 2


   Baby Steps: 

  0) Criar uma model genérica para que possamos adicionar outros tipos de veículos - OK!
  1) Criar um model para criar carros - OK!
  1.5) Criar um service genérico para que possamos adicionar outros tipos de veículos
  2) Criar um service para criar carros - Ok!
  3) Criar um controler para criar carros - Ok!
  4) Incluir a rota