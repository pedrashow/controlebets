const express = require('express');

const Event = require('../model/Event');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const events = await Event.find().populate({path: 'bets', populate:{ path: 'bettor bookie stakeCurrency'}});
		return res.send({events});
	} catch (err) {
		return res.status(400).send({error: 'erro abrindo eventos'});
	}	
});

router.get('/market/:marketName', async (req, res) => {
	try {
		const marketName = req.params.marketName;
		const events = await Event.find({market : marketName});
		return res.send({events});
	} catch (err) {
		return res.status(400).send({error: 'erro abrindo eventos'});
	}	
});

router.get('/date/:initialDate/:endDate', async (req, res) => {
	try {
		const initialDate = req.params.initialDate;
		const endDate = req.params.endDate;
		const events = await Event.find({ date: { '$gte': initialDate, '$lte': endDate }});
		return res.send({events});
	} catch (err) {
		return res.status(400).send({error: 'erro abrindo eventos'});
	}	
});

router.get('/:eventId', async (req, res) => {
	try {
		const event = await Event.findById(req.params.eventId).populate('bets');
		return res.send({event});
	} catch (err) {
		return res.status(400).send({error: 'erro abrindo evento'});
	}	
});

router.post('/', async (req, res) => {
	try {
		const event = await Event.create(req.body);
		res.send({event});
	} catch (err) {
		res.status(400).send({ error : 'não foi possível criar o evento'});
		console.log(err);
	}
});

router.put('/:eventId', async (req, res) => {
	try {
		const eventUpdate = req.body;
		const event = await Event.findByIdAndUpdate(req.params.eventId, eventUpdate, {new: true}).populate('bets');
		return res.send({event});
	} catch (err) {
		return res.status(400).send({error: 'erro atualizando evento'});
	}	
});

router.put('/score/:eventId', async (req, res) => {
	try {
		const event = await Event.findById(req.params.eventId).populate('bets');
		event.scoreHomeTeam = req.body.scoreHomeTeam;
		event.scoreAwayTeam = req.body.scoreAwayTeam;
		
		await Promise.all (
			event.bets.map(async bet => {
				await bet.calcResult(event.scoreHomeTeam, event.scoreAwayTeam);
				await bet.save({new: true});
			})
		);

		await event.save({new : true});
		return res.send({event});
	} catch (err) {
		console.log(err);
		return res.status(400).send();
	}
});

router.delete('/:eventId', async (req, res) => {
	try {
		const event = await Event.findByIdAndRemove(req.params.eventId);
		return res.send();
	} catch (err) {
		return res.status(400).send({error: 'erro apagando evento'});
	}	
});

module.exports = app => app.use("/event", router);