'use strict';

const LocalStrategy = require('passport-local').Strategy,
			FacebookStrategy = require('passport-facebook').Strategy,
			TwitterStrategy  = require('passport-twitter').Strategy,
			User = require('../app/models/user'),
			configAuth = require('./auth');

module.exports = function (passport) {
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

	// LOCAL SIGNUP
	passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, function (req, email, password, done) {
    process.nextTick(function () {
      User.findOne({ 'local.email' :  email }, function (err, user) {
        // if there are any errors, return the error
        if (err) {
					return done(err);
				}

      // check to see if theres already a user with that email
      	if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      	} else {
					// if there is no user with that email
        	// create the user
        	var newUser = new User();

        	// set the user's local credentials
        	newUser.local.email = email;
        	newUser.local.password = newUser.generateHash(password);

        // save the user
        	newUser.save(function (err) {
          	if (err) {
							throw err;
						} else {
							return done(null, newUser);
						}
					});
				}
			});
		});
	}));

	// LOCAL LOGIN
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, function(req, email, password, done) { // callback with email and password from our form
    User.findOne({ 'local.email' :  email }, function(err, user) {
      // if there are any errors, return the error before anything else
    	if (err) {
				return done(err);
			}

      // if no user is found, return the message
      if (!user) {
				return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
			}

      // if the user is found but the password is wrong
      if (!user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			} else {
				// all is well, return successful user
				return done(null, user);
			}
		});
	}));

	// FACEBOOK LOGIN
	passport.use(new FacebookStrategy({
		// pull in our app id and secret from our auth.js file
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ["emails", "displayName"],
		passReqToCallback: true
	}, function (token, refreshToken, profile, done) {
		// asynchronous
    process.nextTick(function (req, res) {
			if(!req.user) {
				User.findOne({ 'facebook.id' : profile.id }, function (err, user) {
					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err) {
						return done(err);
					}

					// if the user is found, then log them in
					if (user) {
						if (!user.facebook.token) {
							user.facebook.token = token;
            	user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
              user.facebook.email = profile.emails[0].value;

              user.save(function(err) {
              	if (err) {
									throw err;
								} else {
									return done(null, user);
								}
							});
						}

						return done(null, user); // user found, return that user
					} else {
						// if there is no user found with that facebook id, create them
						var newUser = new User();

						// set all of the facebook information in our user model
						newUser.facebook.id    = profile.id; // set the users facebook id
	          newUser.facebook.token = token; // we will save the token that facebook provides to the user
	          newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
	          newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

						console.log('o que recebe do Facebook: ', profile);

	          // save our user to the database
	          newUser.save(function(err) {
	          	if (err) {
								throw err;
							} else {
								// if successful, return the new user
								return done(null, newUser);
							}
						});
					}
				});
			} else {
				var user = req.user; // pull the user out of the session

				// update the current users facebook credentials
        user.facebook.id = profile.id;
        user.facebook.token = token;
        newUser.facebook.name  = profile.displayName;
        user.facebook.email = profile.emails[0].value;

        // save the user
        user.save(function(err) {
        	if (err) {
						throw err;
					} else {
						return done(null, user);
					}
				});
			}
		});
	}));

	// TWITTER LOGIN
	passport.use(new TwitterStrategy({
		consumerKey     : configAuth.twitterAuth.consumerKey,
		consumerSecret  : configAuth.twitterAuth.consumerSecret,
		callbackURL     : configAuth.twitterAuth.callbackURL
	}, function (token, tokenSecret, profile, done) {
		// make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function () {
    	User.findOne({ 'twitter.id' : profile.id }, function (err, user) {
				// if there is an error, stop everything and return that
      	// ie an error connecting to the database
      	if (err) {
					return done(err);
				}

				// if the user is found then log them in
      	if (user) {
      		return done(null, user); // user found, return that user
				} else {
      		// if there is no user, create them
        	var newUser = new User();

					// set all of the user data that we need
        	newUser.twitter.id = profile.id;
        	newUser.twitter.token = token;
        	newUser.twitter.username = profile.username;
        	newUser.twitter.displayName = profile.displayName;

					console.log('o que vem do TWITTER > ', profile);

        	// save our user into the database
        	newUser.save(function (err) {
	        	if (err) {
							throw err;
						} else {
							return done(null, newUser);
						}
					});
				}
			});
		});
	}));
};
