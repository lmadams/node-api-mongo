

const repository = require('../repositories/order-repository');
const guid = require('guid');
const authService = require('../services/auth-service');

exports.get = async (req, res) => {
  try {
    const data = await repository.get();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição!',
    });
  }
};

exports.post = async (req, res) => {
  try {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const dataToken = await authService.decodeToken(token);

    await repository.create({
      customer: dataToken.id,
      number: guid.raw().substring(0, 6),
      items: req.body.items,
    });
    res.status(201).send({ message: 'Pedido cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição!',
    });
  }
};
