const express = require('express')
const app = express()
const path = require('path')

// 
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '1287ef60b68b4f10bb8a89790d739ee5',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// 
rollbar.log('Hello world!') 

app.use(express.json())

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info('Someone got the student list')
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
            // rollbar.warning(`someone tied to add an empty sting`)
           res.status(400).send('You must enter a name.')
       } else {
            // rollbar.error(`someone tried to duplicate a student`)
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    // rollbar.critical('someone deleted a student!')
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
