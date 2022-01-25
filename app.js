const config=require('./utils/config')
const express=require('express')
const cors=require('cors')
const morgan=require('morgan')
const personRouter=require('./controllers/person')
const middleware=require('./utils/middleware')
const mongoose=require('mongoose')
const logger=require('./utils/logger')
const app=express()



mongoose.connect(config.MONGODB_URI,{ useNewUrlParser: true ,useUnifiedTopology:true, useCreateIndex:true })
    .then( () => {
        logger.info('connected to ',config.MONGODB_URI)
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })


//app.use(cors())
app.use(express.static('build'))
app.use(express.json())
//app.use(middleware.requestLogger)

morgan.token('token',(req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :token'))

app.use(['/api/persons','/info'], personRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)





module.exports=app