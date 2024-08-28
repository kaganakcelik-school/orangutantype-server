const express = require('express')
const app = express()
require('dotenv').config()

const Score = require('./models/score')

let scores = [
	{
		score: 0,
		id: 1
	}
]

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
	response.send('<h1>the orangutantype server</h1>')
})

app.get('/api/scores', (request, response) => {
	Score.find({}).then(scores => {
		response.json(scores)
	})
})

app.post('/api/scores', (request, response) => {
	const body = request.body

	if (body.score === undefined || body.score === null) {
		return response.status(400).json({ error: 'score missing' })
	}

	const score = new Score({
		score: body.score,
		name: body.name || 'anonymous'
	})

	score.save().then(savedScore => {
		response.json(savedScore)
	})
})

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`)
})