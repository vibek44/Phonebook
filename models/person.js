
const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')


const personSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,'name is required'],
        unique:[true,'name must be unique'],
        minlength:[3,'name length is short']
    },
    number:{
        type:Number,
        required:true,
        validate:function(value){
            if(!(/\d{9}/.test(value))){
                throw new Error('invalid phone number')
            }}
    }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports= mongoose.model('Person', personSchema)





