const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();
server.use(express.urlencoded({extended: true}))
server.use(express.json());

module.exports = server;
