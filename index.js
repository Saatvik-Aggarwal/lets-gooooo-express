const express = require('express')
const db = require('./server')
const port = 3000
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

app.post('/signup', (request, response) => {
    let username = request.body.username
    let password = request.body.password
    let email = request.body.email

    bcrypt.hash(password, 10, (err, hash) => {
        pool.query(`INSERT INTO users (username, password, email) VALUES ('${username}', '${hash}', '${email}')` + usern, (error, results) => {
            if (error) {
                response.json({message: "Failure. Duplicate username or email detected!"})
            } else {
                response.status(200).json({message: "Success"})
            }
            
        })
    })

})

app.post('/login', (request, response) => {
    let username = request.body.username
    let password = request.body.password

    
    pool.query(`SELECT password FROM users WHERE username='${username}'` + usern, (error, results) => {
        if (error) {
            response.json({message: "Server side failure!"})
        } else {
            results.rows.forEach(row => {
                bcrypt.compare(password, row['password'], function(error, match) {
                    if (match) {
                        response.status(200).json({message: "Success"})
                        return
                    }
                    // response == true if they match
                    // response == false if password is wrong
                });
            });
            response.status(200).json({message: "Incorrect username or password."});
        }
        
    })
    

})

app.get('/', (request, response) => {
    response.json({info: 'HELLO BOOOMER'})
})

app.listen(process.env.PORT || port, () => {
    console.log(`App running on port ${port}`)
})
