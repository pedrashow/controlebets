const express = require('express');

const Bet = require('../model/bet');
const Event = require('../model/Event');
const Bettor = require('../model/Bettor');

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const bet = await Bet.create(req.body);
		const event = await Event.findById(req.body.event);
		let bettor = await Bettor.findById(bet.bettor);
		event.bets.push(bet);
		await event.save();
		bettor.bets.push(bet);
		await bettor.save();
		bettor = await Bettor.findById(bet.bookie);
		bettor.bets.push(bet);
		await bettor.save();
		res.send({bet});
	} catch (err) {
		console.log(err);
		res.status(400).send({ error : 'não foi possível criar a aposta'});
	}
});

router.put('/:betId', async (req, res) => {
	try {
		const betFields = req.body;
		const bet = await Bet.findByIdAndUpdate(req.params.betId, betFields, { new: true});
		return res.send({bet});
	} catch (err) {
		return res.status(400).send({ error : 'não foi possível atualizar a aposta'});
	}
	
});

router.delete('/:betId', async (req, res) => {
	try {
		const bet = await Bet.findById(req.params.betId);
		const event = await Event.findById(bet.event);
		let bettor = await Bettor.findById(bet.bettor);
		event.bets.pull(bet._id);
		await event.save();
		bettor.bets.pull(bet._id);
		await bettor.save();
		bettor = await Bettor.findById(bet.bookie);
		bettor.bets.pull(bet._id);
		await bettor.save();
		await bet.remove();
		res.send();
	} catch (err) {
		res.status(400).send({ error : 'não foi possível apagar a aposta'});
	}
});

module.exports = app => app.use("/bet", router);