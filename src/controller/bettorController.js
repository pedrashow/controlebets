const express = require('express');

const Bettor = require('../model/Bettor');

const router = express.Router();

router.get('/', async (req, res) => {
	
});

router.get('/:bettorId', async (req, res) => {
	
});

router.post('/', async (req, res) => {
	
});

router.put('/:bettorId', async (req, res) => {
	
});

router.delete('/:bettorId', async (req, res) => {
	
});

module.exports = app => app.use("/bettor", router);