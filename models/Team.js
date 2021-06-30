
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var teamItemSchema = Schema( {
  ownerid:ObjectId,
  name: String,
  position: String,
  salary: Number,

} );

module.exports = mongoose.model( 'Team', teamItemSchema );
