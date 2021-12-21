const express=require('express');
const router=express.Router();

let persons=[
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
 

router.get('/',(req,res,next)=>{
         if(req.baseUrl==='/api/persons'){
        res.json(persons);
         }
       next();
  })
  
router.get('/', (req,res,next)=>{
  if(req.baseUrl==='/info'){
     res.send(`<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`)
    }
  next();
})
  
router.get('/:id', (req,res)=>{
   const id=Number(req.params.id);
   const person=persons.find((person)=>person.id===id);
   if(!person){
     res.status(404).end('content not found!!');
     return;
    }
    res.json(person);
  })
  
  const generateId=()=>Math.floor(Math.random()*100+persons.length)
  
  router.post('/',(req,res)=>{ 
    const body=req.body;
    if(!(body.name && body.number)){
      res.status(400).json({error:'Name or number is missing'})
      return;
    }
    let person=persons.find((person)=>{
      return person.name.toLowerCase()===body.name.trim().toLowerCase()})
      if(person){
        res.status(400).json({error:'Name must be unique'})
        return;
      }
    console.log(person);
    const id=generateId();
    person={id:id,...body}
    persons=persons.concat(person)
    res.status(201).json(person)
  
  })
  
  router.delete('/:id', (req,res)=>{
    let id=Number(req.params.id);
    persons=persons.filter((person)=>person.id!==id);
    res.status(204).end();
  })

module.exports=router