const express = require('express');
const port = 3001;

const app = express();

app.get('/', (req,res) => {
	res.send("olá");
});

app.listen(port);

