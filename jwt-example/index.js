'use strict'

let jwt = require('jsonwebtoken')
let token = jwt.sign({ user_id: 123456 }, 'super_secret')
let decode = jwt.verify(token, 'super_secret')

console.log(token)
