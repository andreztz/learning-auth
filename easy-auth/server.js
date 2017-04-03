'use strict';

const express = require('express'),
			app = express(),
			port = process.env.PORT || 8181,
			mongoose = require('mongoose'),
			passport = require('passport'),
			flash = require('connect-flash'),
			morgan = require('morgan'),
			cookieParser = require('cookie-parser'),
			bodyParser = require('body-parser'),
			session = require('express-session'),
			configDB = require('./config/db');

mongoose.connect(configDB.database);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'pug');

app.use(session({ secret: 'beDragonsBaby' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);
require('./app/routes')(app, passport);

app.listen(port, function () {
	console.log('Servidor rodando em http://localhost:' + port);
});
