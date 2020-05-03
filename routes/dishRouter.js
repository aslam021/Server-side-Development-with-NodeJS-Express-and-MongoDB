const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router(); //declaring dishRouter as an express.Router

dishRouter.use(bodyParser.json()); //this will extract the body part of the request

dishRouter.route('/') //all request end point with /dishes executs this (mounted with index.js)
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); //go to the next  -> (in this case that is get / post or what is called)
})
.get((req,res,next) => { //res is inherited from the above .all method with values
    res.end('Will send all the dishes to you!');
})
.post((req, res, next) => { //req.body. is obtained using bodyParser
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all dishes');
});


dishRouter.route('/:dishId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); //go to the next  -> (in this case that is get / post or what is called)
})
.get((req,res,next) => { //res is inherited from the above .all method with values
    res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
})
.post((req, res, next) => { //req.body. is obtained using bodyParser
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res, next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + 
            ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId);
});

module.exports = dishRouter;