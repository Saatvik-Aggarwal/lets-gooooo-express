const fs = require('fs')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')

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
        pool.query(`INSERT INTO users (username, password, email) VALUES ('${username}', '${hash}', '${email}')` + usern, (error, results) => {
            if (error) {
                response.json({message: "Failure. Duplicate username or email detected!"})
            } else {
                response.status(200).json({message: "Success"})
            }
            
        })
    })

}

const login = (request, response) => {
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
    

}

module.exports = {
    getUsers,
    signUp,
    login
}