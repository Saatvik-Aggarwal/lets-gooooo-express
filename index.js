const express = require('express')
const db = require('./server')
const port = 3500
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/users', db.getUsers)

app.get('/', (request, response) => {
    response.json({info: 'HELLO BOOOMER'})
})

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})
