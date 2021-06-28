
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var exerciseSchema = Schema( {
  part:String,
  exercise: String,
  urlLink: String,
  localPicture: String,
  shortDescription: String,
  userId: ObjectId

} );

module.exports = mongoose.model( 'Exercise', exerciseSchema );
