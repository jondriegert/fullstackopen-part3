require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

const randomLimit = parseInt(Number.MAX_SAFE_INTEGER / 10);

app.use(express.static('build'));

morgan.token('postdata', function (req, res) {
  if (!req || !req.headers || req.method !== 'POST') {
    return ' ';
  }

  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postdata'
  )
);

app.use(express.json());
app.use(cors());

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>phonebook backend</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/info', (request, response) => {
  console.log(request);
  response.send(
    `<div>Phonebook has info for ${
      persons.length
    } people</div><br><div>${Date()}</div>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const generateId = () => {
  let newId;
  do {
    newId = Math.floor(Math.random() * randomLimit);
  } while (persons.some((p) => p.id === newId));

  return newId;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || body.name === '') {
    return response.status(400).json({
      error: 'name missing',
    });
  }

  if (!body.number || body.number === '') {
    return response.status(400).json({
      error: 'number missing',
    });
  }

  // if (persons.some((p) => p.name === body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique',
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
