const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 3001;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cors());

require('./controller/authController')(app);
require('./controller/eventController')(app);
require('./controller/currencyController')(app);
require('./controller/bettorController')(app);
require('./controller/betController')(app);

app.listen(port);