const express = require("express");

const db = require("../data/dbConfig.js");
const { from, insert, update } = require("../data/dbConfig.js");
const { restart } = require("nodemon");

const server = express();
server.use(express.urlencoded({extended: true}))
server.use(express.json());


//GET Request all✅
server.get('/', (req, res) => {
    //get data from db
    db.select("*").from('accounts')
        .then(data => {
            res.status(200).json({
                data: data
            })
        })
        .catch(err => console.log(err))
})

//GET By :id ✅
server.get('/:id', (req, res) => {
    db('accounts')
        .where({id: req.params.id})
        .first()
        .then(post => {
            if(post) {
                res.status(200).json({ data:post })
            } else {
                res.status(404).json({ message: `User ${req.params.id} not found6`})
            }
        })
        .catch(err => console.log(err))
})

//POST✅
server.post('/', (req, res) => {
    db('accounts')
        .insert(req.body, "id")
        .then(ids => {
            res.status(201).json({results:ids})
        })
        .catch(err => console.log(err))
})

//PUT by :id
server.put('/:id', (req, res) => {
    const postBody = req.body

    db('accounts')
        .where({ id : req.params.id })
        .update(postBody)
        .then( count => {
            if( count > 0) {
                res.status(200).json({message:"Recorded successfully update"})
            } else {
                res.status(404).json({errorMessage:`User ${req.params.id} not found`})
            }
        })
        .catch(err => console.log(err))
})

// Delete ✅
server.delete('/:id', (req, res) => {
    db('accounts').where({id: req.params.id}).del()
        .then(count  => {
            if(count > 0) {
            res.status(200).json({message: `user ${req.params.id} was sucessfully deleted`})
            } else {
                res.status(404).json({ message: `User ${req.params.id} not found`})
            }
        })
        .catch(err => console.log(err))
})

module.exports = server;
