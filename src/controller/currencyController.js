const express = require('express');

const Currency = require('../model/Currency');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const currencies = await Currency.find();
		return res.send({currencies});
	} catch (err) {
		return res.status(400).send({error: 'erro abrindo moedas'});
	}	
});

router.get('/:currencyId', async (req, res) => {
	try {
		const currency = await Currency.findById(req.params.currencyId);
		return res.send({currency});
	} catch (err) {
		return res.status(400).send({error: 'erro abrindo moeda'});
	}	
});

router.post('/', async (req, res) => {
	try {
		const currency = await Currency.create(req.body);
		return res.send({currency});
	} catch (err) {
		return res.status(400).send({error: 'erro na criação da moeda'});
	}
});

router.put('/:currencyId', async (req, res) => {
	try {
		const {rateToEur} = req.body;
		const currency = await Currency.findByIdAndUpdate(req.params.currencyId, {rateToEur}, {new: true});
		return res.send({currency});
	} catch (err) {
		console.log(err);
		return res.status(400).send({error: 'erro na atualizacao da moeda'});
	}
});

router.delete('/:currencyId', async (req, res) => {
	try {
		const currency = await Currency.findByIdAndRemove(req.params.currencyId);
		return res.send();
	} catch (err) {
		return res.status(400).send({error: 'erro apagando moeda'});
	}	
});

module.exports = app => app.use("/currency", router);