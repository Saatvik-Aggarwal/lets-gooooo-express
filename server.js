const fs = require('fs')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

dotenv.config()

const pool = new Pool({
    user: 'saatvik_aggarwal',
    password: process.env.DB_PASS,
    host: 'free-tier.gcp-us-central1.cockroachlabs.cloud',
    port: 26257,
    database: 'novel-gecko-2611.defaultdb',
    ssl: {
        ca: fs.readFileSync('root.crt').toString()
    }
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const signUp = (request, response) => {
    let username = request.body.username
    let password = request.body.password
    let email = request.body.email

    bcrypt.hash(password, 10, (err, hash) => {
        pool.query(`INSERT INTO users (username, password, email) VALUES ('${username}', '${hash}', '${email}')`, (error, results) => {
            if (error) {
                response.status(200).json({message: "Failure. Duplicate username or email detected!"})
            } else {
                response.status(200).json({message: "Success"})
            }
            
        })
    })

}

const login = (request, response) => {
    let username = request.body.username
    let password = request.body.password

    var setBody = false
    pool.query(`SELECT password FROM users WHERE username='${username}'`, (error, results) => {
        if (error) {
            //response.json({message: "Server side failure!"})
            throw error
        } else {
            results.rows.forEach(row => {
                
                bcrypt.compare(password, row['password'], function(error, match) {
                    //console.log(match)
                    if (match && !setBody) {
                        response.json({message: "Success"})
                        setBody = true
                    } else if (!setBody) {
                        response.json({message: "Incorrect username or password."})
                    }
                    // } else {
                    //     response.json({one: password, two: row['password']})
                    //     return
                    // }
                    // response == true if they match
                    // response == false if password is wrong
                });
            });
            
            if (results.rowCount == 0 && !setBody) response.json({message: "Incorrect username or password."});
        }
        
    })
    

}

module.exports = {
    getUsers,
    signUp,
    login
}