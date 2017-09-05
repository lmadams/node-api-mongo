'use strict';

const repository = require('../repositories/product-repository');
const ValidationContract = require('../validators/fluent-validator');
const azureStorage = require('azure-storage');
const config = require('../config');
const guid = require('guid');

exports.get = async (req, res, next) => {
  try {
    const data = await repository.get();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição!'
    });
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const data = await repository.getBySlug(req.params.slug);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição!'
    });
  }
};

exports.getByTag = async (req, res, next) => {
  try {
    const data = await repository.getByTag(req.params.tag);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição!'
    });
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await repository.getById(req.params.id);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição!'
    });
  }
};


exports.post = async (req, res, next) => {
  let contract = new ValidationContract();
  contract.hasMinLen(req.body.title, 3, 'O título deve conter pelos 3 caracateres.');
  contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelos 3 caracateres.');
  contract.hasMinLen(req.body.description, 3, 'A descrição deve conter pelos 3 caracateres.');

  // se ps dados forem inválidos
  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end();
    return;
  }

  try {
    // Cria o blog Service
    const blobSvc = azureStorage.createBlobService(config.containerConnectionString);

    let filename = guid.raw().toString() + '.jpg';
    let rawdata = req.body.image;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], 'base64');

    // Salva a imagem
    await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
      contentType: type
    }, function (error, result, response) {
      if (error) {
        filename = 'default-product.png'
      }
    });

    await repository.create({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      active: true,
      tags: req.body.tags,
      image: 'https://adamsstore.blob.core.windows.net/product-images/' + filename
    });
    res.status(201).send({
      message: 'Produto cadastrado com sucesso!'
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Falha ao processar sua requisição!'
    });
  }
};

exports.put = async (req, res, next) => {
  try {
    await repository.update(req.params.id, req.body);
    res.status(200).send({
      message: 'Produto atualizado com sucesso!'
    });
  } catch (error) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição!'
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    await repository.delete(req.params.id);
    res.status(200).send({
      message: 'Produto removido com sucesso!'
    });
  } catch (error) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição!'
    });
  }
};