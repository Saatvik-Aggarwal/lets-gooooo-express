const fs = require('fs')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const { response } = require('express')

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

const getTrails = (request, response) => {
    let latitude = request.body.latitude
    let longitude = request.body.longitude
    let radius = request.body.radius

    let values = [latitude + radius, latitude - radius, longitude + radius, longitude - radius]
    console.log(values);
    pool.query(`SELECT * FROM trails WHERE latitude < $1 AND latitude > $2 AND longitude < $3 AND longitude > $4`, values, (error, results) => {
        if (error) {
            response.status(200).json({message: "Failure!"})
            console.log(error)
        } else {
            response.status(200).json({message: "Success", data: results.rows})
        }
        
    })
    
}


// var axios = require("axios").default;

// const cities = require('./cities');

// var fails = 0; 
// var done = 0; 
// var total = 0;
// const cacheData = (req, response) => {

//     cities.data.forEach(element => {
//         //element = cities.data[0];
//         location = element[10]
//         x = location.split('/ ')[2].split('﻿')[0].split("; ");
//         lat = x[0];
//         long = x[1];
//         console.log(lat + " " + long);

//         var options = {
//             method: 'GET',
//             url: 'https://trailapi-trailapi.p.rapidapi.com/trails/explore/',
//             params: {lon: `${long}`, lat: `${lat}`,  radius: 100, per_page: 10000},
//             headers: {
//             'x-rapidapi-key': 'REDACTED',
//             'x-rapidapi-host': 'trailapi-trailapi.p.rapidapi.com'
//             },
//         };
            
//         axios.request(options).then(function (response) {
//             //console.log(response.data);
//             rows = eval(response.data);
//             //console.log(rows.data.length)
//             total += rows.data.length;
//             rows.data.forEach(element => {
//                 upload(element['name'], element['length'], element['thumbnail'], element['difficulty'], element['description'], element['lat'], element['lon'])
//             });
            
//             console.log(rows.data.length)
//         }).catch(function (error) {
//             console.error(error);
//         });
        
//     });


// }

// async function upload(name, length = 0, thumbnail = '', difficulty = 0, description='', lat, lon) {
//     const values = [name, length, thumbnail, difficulty, description, lat, lon];
//     pool.query(`INSERT INTO trails VALUES ($1, $2, $3, $4, $5, $6, $7)`, values, (error, results) => {
//         if (error) {
//             console.log("Trail failed: " + name + "total fail count: " + fails);
//             fails += 1;
//         } else {
//             console.log("Added trail: " + name + " | " + done + " / " + total);
//             done += 1;
//         }
        
//     })
// }

module.exports = {
    getUsers,
    signUp,
    login,
    getTrails
}