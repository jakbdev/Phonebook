const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(data)
    response.status(200).end()
})

app.get('/api/persons/:id', (request, response) => {
    id = Number(request.params.id)
    person = data.find(i => id === i.id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    
    console.log('before', data);
    id = Number(request.params.id)
    newList = data.filter(i => i.id !== id)

    if (newList.length < data.length) {
        data = newList
        console.log('after', data)
        response.status(200).end()
    } else {
        response.status(204).end()
    }
})

app.get('/info', (request, response) => {
    const info = `Phonebook has info for ${data.length} people.`
    const time = new Date()
    response.send(`<p>${info}</p><br><p>${time}</p>`)
})

app.post('/api/persons', (request, response) => {
    const newId = Math.random(0, 100000)

    if (request.body.name && request.body.number) {
        const isUnique = data.find(person => person.name === request.body.name)

        if (!isUnique) {
            newPerson = {
                id: newId,
                name: request.body.name,
                number: request.body.number,
            }
        
            data = data.concat(newPerson)
            response.json(data)
            response.status(200).end()
        } else {
            response.status(400).json({
                error: `${request.body.name} is already in phonebook`
            })
        }
    } else {
        response.status(400).json({
            error: 'Either name or number is missing'
        })
    }
})


// middleware function is only called, if no route handler was activated, meaning a request to an undefined route was made.
const unknownEndpoint = (request, response) => {
    response.status(400).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})