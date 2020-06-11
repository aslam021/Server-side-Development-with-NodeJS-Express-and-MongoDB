const express = require('express');
const bodyParser = require('body-parser');

const Favorites = require('../models/favorite');
var authenticate = require('../authenticate');
const cors = require('./cors');

const favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

//function to check whether dishId already added to favorites in database.
const favoriteHas = (dbItems, userItem) => {
    for (var i=0; i<dbItems.length; i++){
        if(dbItems[i].equals(userItem))
            return true;
    }
    return false;
}

favoritesRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => { 
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favoriteProfile) => {
        console.log(favoriteProfile)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favoriteProfile);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Favorites.findOne({user: req.user._id})
    .then((result) => {

        let favorites = [];

        // if user has not registered any favorites before
        if (result==null){
            
            //filter duplicates from req.body
            req.body.forEach(item => {
                if(!favorites.includes(item._id)){
                    favorites.push(item._id);
                }
            });

            const favoriteProfile = {
                user: req.user._id,
                dishes: favorites
            };
            
            Favorites.create(favoriteProfile)
            .then((favoriteProfile) => {
                console.log('Favourite profile Created ', favoriteProfile);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favoriteProfile);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{

            //filter duplicates from req.body and database favorites
            req.body.forEach(item => {                
                //if user has already added this dish to favorites we should not allow to add again
                if(favoriteHas(result.dishes, item._id)){
                    console.log(item._id + ' already presence in favorites');    
                }
                else if(!favorites.includes(item._id)){
                    favorites.push(item._id);
                }
            });

            Favorites.updateOne({user: req.user._id}, {$push: {dishes: favorites}})
            .then((result) => {
                Favorites.findOne({user: req.user._id})
                .then((result) => {
                    console.log('Favourite profile Updated ', result);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(result);
                }, (err) => next(err));

            }, (err) => next(err))
            .catch((err) => next(err));
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndDelete({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



favoritesRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => { 
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'
        + req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Favorites.findOne({user: req.user._id})
    .then((result) => {

        //if user has not registered any favorites before
        if (result==null){            
            const favoriteProfile = {
                user: req.user._id,
                dishes: [req.params.dishId]
            };
            
            //create user profile
            Favorites.create(favoriteProfile)
            .then((favoriteProfile) => {
                console.log('Favourite profile Created ', favoriteProfile);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favoriteProfile);
            }, (err) => next(err))
            .catch((err) => next(err));
        }

        // if user has already added this dish to favorites we should not allow to add again
        else if(favoriteHas(result.dishes, req.params.dishId)){
            res.statusCode = 403;
            res.end(req.params.dishId + ' already presence in favorites');    
        }
        //adding a new dish to favorites 
        else {
            Favorites.updateOne({user: req.user._id}, {$push: {dishes: req.params.dishId}})
            .then((result) => {

                Favorites.findOne({user: req.user._id})
                .then((result) => {
                    console.log('Favourite profile Updated ', result);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(result);
                }, (err) => next(err));

            }, (err) => next(err))
            .catch((err) => next(err));
        }
        
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'
        + req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndUpdate({user: req.user._id}, {$pull: {dishes: req.params.dishId}})
    .then((result) => {

        //if this user has added no favorites
        if(!result){
            res.statusCode = 403;
            res.end('You have not added any favorites');
        } 
        else{
            result.save()
            .then(() => {
                Favorites.findOne({user: req.user._id})
                .then((result) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({status: req.params.dishId + " removed from favorites.\n",result});
                }, (err) => next(err));  
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoritesRouter;