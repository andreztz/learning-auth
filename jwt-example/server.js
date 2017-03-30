'use strict'

let express = require('express')
let bodyParser = require('body-parser')
let jwt = require('jsonwebtoken')

const JWT_PASSWORD = 'here_are_dragons'

let app = express()

let users = { ednilson: 'teste123' }

app.post('/login', bodyParser.json(), (req, res) => {
	if (!users[req.body.username] || users[req.body.username] !== req.body.password) {
		res.status(401).json({ error: 'Usuario e/ou senha invalidos!' })
	} else {
		let token = jwt.sign({ username: req.body.username }, JWT_PASSWORD, { expiresIn: '90 seconds'})

		res.json({ token: token })
	}
})

app.get('/session', (req, res) => {
	let auth = req.headers.authorization

	if (!auth || !auth.startsWith('Bearer')) {
		return res.status(401).json({ error: 'Sessão inválida!' })
	} else {
		auth = auth.split('Bearer').pop().trim()
	}

	jwt.verify(auth, JWT_PASSWORD, (err, data) => {
		if (err) {
			return res.status(401).json({ error: 'Sessão inválida!' })
		}

		res.send(`Oii ${data.username}`)
	})
})

app.listen(9191, () => {
	console.log('Servidor rodando em http://localhost:9191')
})
