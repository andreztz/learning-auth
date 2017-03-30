'use strict';

const express = require('express'),
			app = express(),
			mongoose = require('mongoose'),
			bodyParser = require('body-parser'),
			morgan = require('morgan'),
			passport = require('passport'),
			jwt = require('jsonwebtoken'),
			port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', function(req, res) {
	res.json({ message: 'Bem vindo a API de Login!' });
});

const config = require('./config/main');
mongoose.connect(config.database);

require('./config/passport')(passport);

const User = require('./app/models/user');

app.use(passport.initialize());

const router = express.Router();

router.post('/register', function (req, res) {
	if (!req.body.email || !req.body.password) {
		res.json({ success: false, message: 'Por favor, digite o e-mail e senha para logar no sistema!' });
	} else {
		const newUser = new User({
			email: req.body.email,
			password: req.body.password
		});

		newUser.save(function (err) {
			if (err) {
				return res.json({ success: false, message: 'O e-mail utilizado já está cadastrado em nosso sistema! ' });
			}

			res.json({ success: true, message: 'Novo usuário cadastrado com sucesso!' });
		});
	}
});

router.post('/auth', function (req, res) {
	User.findOne({
		email: req.body.email
	}, function (err, user) {
		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Usuário não encontrado!' });
		} else {
			user.comparePassword(req.body.password, function (err, isMatch) {
				if (isMatch && !err) {
					const token = jwt.sign(user, config.secret, {
						expiresIn: 80 // seconds
					});

					res.json({ success: true, token: token });
					// res.json({ success: true, token: 'JWT ' + token });
				} else {
					res.json({ success: false, message: 'Senha incorreta!' });
				}
			});
		}
	});
});


// Rota protegida pelo TOKEN
router.get('/dashboard', passport.authenticate('jwt', { session: false }), function (req, res) {
	res.json({ message: 'Está funcionando. O ID do usuário é ' + req.user._id + '.'});
});

app.use('/api', router);

app.listen(port, function () {
	console.log('Servidor rodando em http://localhost:' + port);
});
