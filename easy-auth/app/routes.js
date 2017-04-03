'use strict';

module.exports = function (app, passport) {
	app.get('/', function (req, res) {
		res.render('index.pug');
	});

	app.get('/login', function (req, res) {
		res.render('login.pug', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/signup', function (req, res) {
		res.render('signup.pug', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/profile', function (req, res) {
		res.render('profile.pug', { user: req.user });
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	app.get('/connect/local', function(req, res) {
		res.render('connect-local.pug', { message: req.flash('loginMessage') });
	});


	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/connect/local',
		failureFlash : true
	}));

	app.get('/unlink/local', function (req, res) {
		var user = req.user;

		user.local.email = undefined;
    user.local.password = undefined;

		user.save(function (err) {
			res.redirect('/profile');
		});
	});

	app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

	// handle the callback after facebook has authorized the user
	app.get('/connect/facebook/callback', passport.authorize('facebook', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	app.get('/unlink/facebook', function (req, res) {
		var user = req.user;

		user.facebook.token = undefined;

		user.save(function (err) {
			res.redirect('/profile');
		});
	});

	app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

	// handle the callback after twitter has authorized the user
	app.get('/connect/twitter/callback', passport.authorize('twitter', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	app.get('/unlink/twitter', function (req, res) {
		var user = req.user;

		user.twitter.token = undefined;

		user.save(function (err) {
			res.redirect('/profile');
		});
	});
};

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/');
	}
}
