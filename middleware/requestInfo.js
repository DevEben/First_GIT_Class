const express = require('express');

const requestInfo = (req, res, next) => {
    req.date = Date()

    console.log(`This API was called on ${req.date}`)

    next()
}


module.exports = {requestInfo};