'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tablet = mongoose.model('Tablet'),
	_ = require('lodash');

/**
 * Create a Tablet
 */
exports.create = function(req, res) {
	var tablet = new Tablet(req.body);
	tablet.user = req.user;

	tablet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tablet);
		}
	});
};

/**
 * Show the current Tablet
 */
exports.read = function(req, res) {
	res.jsonp(req.tablet);
};

/**
 * Update a Tablet
 */
exports.update = function(req, res) {
	var tablet = req.tablet ;

	tablet = _.extend(tablet , req.body);

	tablet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tablet);
		}
	});
};

/**
 * Delete an Tablet
 */
exports.delete = function(req, res) {
	var tablet = req.tablet ;

	tablet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tablet);
		}
	});
};

/**
 * List of Tablets
 */
exports.list = function(req, res) { 
	Tablet.find().sort('-created').populate('user', 'displayName').exec(function(err, tablets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tablets);
		}
	});
};

/**
 * Tablet middleware
 */
exports.tabletByID = function(req, res, next, id) { 
	Tablet.findById(id).populate('user', 'displayName').exec(function(err, tablet) {
		if (err) return next(err);
		if (! tablet) return next(new Error('Failed to load Tablet ' + id));
		req.tablet = tablet ;
		next();
	});
};

/**
 * Tablet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tablet.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
