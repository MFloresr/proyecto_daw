'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Componente Schema
 */
var ComponenteSchema = new Schema({
  marca: {
		type: String,
		default: '',
		required: 'Please fill Componente marca',
		trim: true
	},
  modelo: {
		type: String,
		default: '',
		required: 'Please fill Componente modelo',
		trim: true
	},
  nserie: {
		type: String,
		default: '',
		required: 'Please fill Componente numero de serie',
		trim: true
	},
  precio: {
		type: String,
		default: '',
		required: 'Please fill Componente precio',
		trim: true
	},
  url_img: {
		type: String,
		default: '',
		required: 'Please fill Componente url img',
		trim: true
	},
	descripcion: {
		type: String,
		default: '',
		required: 'Please fill Componente url img',
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

mongoose.model('Componente', ComponenteSchema);
