
const express=require('express')
const router=express.Router()
const Person=require('../models/person')


router.get('/', async (req,res,next) => {
    if(req.baseUrl==='/api/persons'){
        try{ 
            const result=await Person.find({})
            res.json(result)
        }catch(error){
            next(error)
        }
    }
    next()
})

router.get('/', async(req,res,next) => {

    if(req.baseUrl==='/info'){
        try{
            let result=await Person.find({})
            res.send(`<p>Phonebook has info for ${result.length} people</p>
                 <p>${new Date()}</p>`)
        }catch(error){
            next(error)
        }
    }
})

router.get('/:id', (req,res,next) => {
    try{
        const result=Person.findById(req.params.id)
        
        if(result){
            res.json(result)
        }else{
            res.status(404).send('404! not found')
        }
    }catch(error)  {
        next(error) 
    }

})

router.post('/',async (req,res,next) => { 
    const body=req.body

    if(!(body.name && body.number)){
        res.status(400).json({ error:'Name or number is missing' } )
        return
    }

    const person = new Person({
        name:body.name,
        number:body.number
    })
    try{
        const savedNote=await person.save()
        res.json(savedNote) 
    }catch( error){  
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }
    try{
        const updatedNote=await Person.findByIdAndUpdate(req.params.id, person, { new: true,runValidators:true,context:'query' })
        res.json(updatedNote)
    }catch( error){
        next(error)
    }
})

router.delete('/:id', async (req,res,next) => {
    try{
        const result=await Person.findByIdAndDelete(req.params.id)
        if(result){                  //run on successful operation and result can be accessed in callback 
            res.status(204).end()  
        }
    
    }catch( error) {
        next(error) 
    } 
})



module.exports=router