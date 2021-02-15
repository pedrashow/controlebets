const express = require('express');
const bodyParser = require('body-parser');

const port = 3001;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./controller/authController')(app);
require('./controller/eventController')(app);
require('./controller/currencyController')(app);

app.listen(port);

