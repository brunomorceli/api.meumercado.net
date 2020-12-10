// =====================================================================================
//                                  DEPENDENCIES
// =====================================================================================

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const globals = require('globals');
const async = require('async');

const router = require('./libs/router');
const models = require('./models');

// =====================================================================================
//                                     GLOBALS
// =====================================================================================

globals.config = require('./config');
globals.models = models;
globals.libs = require('./libs');
globals.schemas = require('./schemas');

// =====================================================================================
//                               APP CONFIG AND SETUP
// =====================================================================================

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// =====================================================================================
//                                     CORS
// =====================================================================================

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	res.header("Access-Control-Allow-Methods", "*");
  next();
});

// =====================================================================================
//                                   SECURITY
// =====================================================================================

router.setJwtToken(globals.config.tokenSecret);

router.addAuthMiddleware('common', (req, res, next) => {
	if (!req.credentials) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	async.waterfall([
		cb => cb(null, { credentials: req.credentials }),

		// check the credentials
		(data, cb) => cb(!data.credentials ? 'Unauthorized' : null, data),

		// get the owner
		(data, cb) => {
			const query = { 
				where: {
					ownerId: data.credentials.ownerId,
					status: 'active'
				}
			};

			models.user.findOne(query)
			.then(owner => {
				data.owner = owner;
				cb(!owner ? 'Unauthorized' : null, data);
			})
			.catch(e => cb('Error on try to get owner', data));
		},

		// get the user
		(data, cb) => {
			if (data.owner.id.toString() === data.credentials.userId.toString()) {
				data.user = data.owner;
				return cb(null, data);
			}

			const query = { 
				where: {
					id: data.credentials.userId,
					status: 'active'
				}
			};

			models.user.findOne(query)
			.then(user => {
				data.user = user;
				cb(!user ? 'Unauthorized' : null, data);
			})
			.catch(e => cb('Error on try to get user', data));
		}
	], (error, data) => {
		if (error) {
			return res.status(401).json({ message: error });
		}

		req.user = data.user;
		req.owner = data.owner;

		next();
	});
});

// =====================================================================================
//                                    EMAIL
// =====================================================================================

globals.libs.email
.init({
	engine: globals.config.email.engine,
	templatePath: path.join(__dirname, 'templates', 'emails'),
	from: globals.config.email.from,
	contentType: 'html',
	credentials: globals.config.email.credentials[globals.config.email.engine],
});

// =====================================================================================
//                                    ROUTES
// =====================================================================================

router.generate(app, path.join(__dirname, 'routes'));

// =====================================================================================
//                               RESPONSE HANDLERS
// =====================================================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;