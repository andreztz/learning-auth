const jwt = require('jsonwebtoken'),
			CONSTANTS = require('./constants');

module.exports = function (req, res, next) {
	const headerToken = req.headers['authorization'];
	console.log('headerToken: ', headerToken);

	if (headerToken && headerToken.startsWith('Bearer')) {
		const token = headerToken.substr(7);

		jwt.verify(token, CONSTANTS.SECRET, function (err, data) {
			if (err) {
				return res.status(401).json({
					statusCode: 401,
					message: 'Token inválido!',
					error: true,
					status: 'NOK'
				});
			} else {
				next();
			}
		});
	} else {
		return res.status(401).json({
			statusCode: 401,
			message: 'Não veio token. Precisa enviar o token para acessar esse recurso.',
			error: true,
			status: 'NOK'
		});
	}
};

