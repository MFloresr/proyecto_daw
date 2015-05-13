'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Portatile = mongoose.model('Portatile'),
	_ = require('lodash');

/**
 * Create a Portatile
 */
exports.create = function(req, res) {
	var portatile = new Portatile(req.body);
	portatile.user = req.user;

	portatile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portatile);
		}
	});
};

/**
 * Show the current Portatile
 */
exports.read = function(req, res) {
	res.jsonp(req.portatile);
};

/**
 * Update a Portatile
 */
exports.update = function(req, res) {
	var portatile = req.portatile ;

	portatile = _.extend(portatile , req.body);

	portatile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portatile);
		}
	});
};

/**
 * Delete an Portatile
 */
exports.delete = function(req, res) {
	var portatile = req.portatile ;

	portatile.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portatile);
		}
	});
};

/**
 * List of Portatiles
 */
exports.list = function(req, res) { 
	Portatile.find().sort('-created').populate('user', 'displayName').exec(function(err, portatiles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portatiles);
		}
	});
};

/**
 * Portatile middleware
 */
exports.portatileByID = function(req, res, next, id) { 
	Portatile.findById(id).populate('user', 'displayName').exec(function(err, portatile) {
		if (err) return next(err);
		if (! portatile) return next(new Error('Failed to load Portatile ' + id));
		req.portatile = portatile ;
		next();
	});
};

/**
 * Portatile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.portatile.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
