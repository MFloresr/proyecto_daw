'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Portatile Schema
 */
var PortatileSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Portatile name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Portatile', PortatileSchema);