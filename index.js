const express = require('express')
const cors=require('cors')
const morgan=require('morgan')

morgan.token('bo',  (req, res)=> { return JSON.stringify(req.body) })

const app = express()

app.use(cors())

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bo'))

let persons = [
  { 
    "name": "Arto Hellast", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
  
]



app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date=new Date()
  response.send(`<p>phonebook has info for ${persons.length} people</p>
  <p>${date}</p>`)
})

app.get('/api/persons/:id', (request,response)=>{
    let id=Number(request.params.id)
    const person=persons.find((person)=>person.id===id)
    if(person){
      response.json(person)
    }
    else{
      response.status(204).end()
    }
})

const generateId=()=>{
 return Math.floor( Math.random()* 250)
}

app.post('/api/persons',(request,response)=>{
  const body=request.body
 
  if(!(body.name&&body.number)){
    return response.status(400).json({error:'name or number is missing'})
  }
 
  let value=persons.some((person)=>person.name.toLowerCase()===body.name.trim().toLowerCase())
  if(value){
    return response.status(401).json({err:'this name already exists'})
  }
  const person={
    name:body.name,
    number:body.number,
    id:generateId()
 }
  persons=persons.concat(person)
  response.json(persons)

})

app.delete('/api/persons/:id', (request,response)=>{
  let id=Number(request.params.id)
  persons=persons.filter((person)=>person.id!==id)
  response.status(204).end()
})


const PORT = proc.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})