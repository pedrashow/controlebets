const express = require('express');

const Bettor = require('../model/Bettor');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const bettors = await Bettor.find()
								.populate({path: 'bets', populate:{ path: 'event bookie stakeCurrency'}})
								.populate('favCurrency');
		return res.send( {bettors});
	} catch (err) {
		return res.status(400).send({error: 'erro abrindo apostadores'});
	}	
});

router.get('/bookies', async(req, res) => {
	try {

		const bookies = await Bettor.find({ isBookie : true});

		return res.send({ bookies });

	} catch (err) {
		return res.status(400);
	}
});


router.post('/', async (req, res) => {
	try {
		const bettor = await Bettor.create(req.body);
		res.send({bettor});
	} catch (err) {
		console.log(err);
		res.status(400).send({ error : 'não foi possível criar o apostador'});
	}
});

router.put('/:bettorId', async (req, res) => {
	try {
		const bettorFields = req.body;
		const bettor = await Bettor.findByIdAndUpdate(req.params.bettorId, bettorFields, { new: true}).populate('favCurrency');
		return res.send({bettor});
	} catch (err) {
		return res.status(400).send({error: 'erro atualizando apostador'});
	}
});

router.delete('/:bettorId', async (req, res) => {
	try {
		const bettor = await Bettor.findByIdAndRemove(req.params.bettorId);
		return res.send();
	} catch (err) {
		return res.status(400).send({error: 'erro apagando apostador'});
	}	
});

module.exports = app => app.use("/bettor", router);