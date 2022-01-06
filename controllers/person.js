
const express=require('express')
const router=express.Router()
const Person=require('../models/person')


router.get('/',(req,res,next) => {
    if(req.baseUrl==='/api/persons'){
        Person.find({}).then(result => {
            res.json(result)
        })
    }
    next()
})

router.get('/', (req,res) => {

    if(req.baseUrl==='/info'){
        Person.find({}).then(result => {
            res.send(`<p>Phonebook has info for ${result.length} people</p>
      <p>${new Date()}</p>`)
        })
    }
})

router.get('/:id', (req,res,next) => {
    Person.findById(req.params.id)
        .then(result => {
            if(result){
                res.json(result)
            }else{
                res.status(404).send('404! not found')
            }
        })
        .catch(error => {
            next(error) 
        }) 
})

router.post('/',(req,res,next) => { 
    const body=req.body

    if(!(body.name && body.number)){
        res.status(400).json({ error:'Name or number is missing' } )
        return
    }

    const person = new Person({
        name:body.name,
        number:body.number
    })

    person.save()
        .then(savedNote => {
            res.json(savedNote)    
        })
        .catch( error => next(error))
})

router.put('/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true,runValidators:true,context:'query' })
        .then(updatedNote => {
            res.json(updatedNote)
        }).catch( error => next(error))
})

router.delete('/:id', (req,res,next) => {
    Person.findByIdAndDelete(req.params.id)
        .then( () => res.status(204).end() )    //run on successful operation and result can be accessed in callback 
        .catch( error => next(error)) 
})

const errorHandler = (error, req, res, next) => {
  
    if (error.name === 'CastError') {
        return res.status(400).json({ error : 'malformatted id' } )
    }else if(error.name==='ValidationError'){
        return res.status(400).json({ error:error.message })
    }
    next(error)

}
  
// error handler middleware has to be the last loaded middleware.
router.use(errorHandler)

module.exports=router