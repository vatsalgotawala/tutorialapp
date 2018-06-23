var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
	validate({
		validator: 'matches',
		arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
		message: 'Name must contain a space between first and last name, no numbers or special characters allowed.'
	}),
	validate({
		validator: 'isLength',
		arguments: [3, 25],
		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var emailValidator = [
	validate({
		validator: 'isEmail',
		arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
		message: 'Not a valid Email.'
	}),
	validate({
		validator: 'isLength',
		arguments: [3, 25],
		message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var usernameValidator = [
	validate({
		validator: 'isAlphanumeric',
		message: 'Username must contain letters and numbers only.'
	}),
	validate({
		validator: 'isLength',
		arguments: [3, 25],
		message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var passwordValidator = [
	validate({
		validator: 'matches',
		arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\w]).{8,35}$/,
		message: 'Password must contain atleast one lower case, one uppercase, one number and one special character.'
	}),
	validate({
		validator: 'isLength',
		arguments: [8, 35],
		message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var UserSchema = new Schema({
	name: {type: String, required: true, validate: nameValidator},
	username: {type: String, lowercase: true, required: true, unique: true, validate: usernameValidator},
	password: {type: String, required: true, validate: passwordValidator, select: false},
	email: {type: String, lowercase: true, required: true, unique: true, validate: emailValidator},
	active: {type: Boolean, required: true, default: false},
	temporarytoken: {type: String, required: true},
	resettoken: {type: String, required: false},
	permission: {type: String, required: true, default: 'user'}
});

UserSchema.pre('save',function(next){
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

UserSchema.plugin(titlize, {
  paths: [ 'name' ]
});

UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User', UserSchema);

