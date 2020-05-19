'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const pjson = require('../package.json')
const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.send(`Extrack Crawler v${pjson.version}`)
})

require('./api/routes/item')(app)

app.disable('x-powered-by')

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Aplicação Node rodando na porta: ${port}.`)
})
