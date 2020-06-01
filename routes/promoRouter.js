const express = require('express');
const bodyParser = require('body-parser');

const Promo = require('../models/promo');
var authenticate = require('../authenticate');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());


promoRouter.route('/')
.get((req, res, next) => {
    Promo.find({})
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => {next(err)})
    .catch((err) => {next(err)});
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promo.create(req.body)
    .then((promo)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => {next(err)})
    .catch((err) => {next(err)});
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promo.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => {next(err)})
    .catch((err) => {next(err)});
});



promoRouter.route('/:promoId')
.get((req, res, next) => {
    Promo.findById(req.params.promoId)
    .then((promo)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => {next(err)})
    .catch((err) => {next(err)});
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promo.findByIdAndUpdate(
        req.params.promoId,
        {$set: req.body},
        {new: true}
    )
    .then((promo)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => {next(err)})
    .catch((err) => {next(err)});
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promo.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => {next(err)})
    .catch((err) => {next(err)});
});


module.exports = promoRouter;