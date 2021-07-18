const fs = require('fs')
const { Pool } = require('pg')

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
    pool.query(`INSERT INTO users (username, password, email) VALUES (${username}, ${password}, ${email})` + usern, (error, results) => {
        if (error) {
            response.json({message: "Failure"})
        } else {
            response.status(200).json({message: "Success"})
        }
        
    })

}

module.exports = {
    getUsers,
    signUp
}