require('dotenv').config();
const express=require('express');
const cors=require('cors')
const morgan=require('morgan');
const personRouter=require('./routes/users')
const app=express();
app.use(express.json());

app.use(cors())



morgan.token('token',(req,res)=>{
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :token'))
app.use(express.static('build'))
app.use(['/api/persons','/info'], personRouter)

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT=process.env.PORT || 3001

app.listen(PORT,()=>console.log('Server is running on port 3001'));