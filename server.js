const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session); // store session in db (collection "session" is created without model)
const passport = require('passport');
const flash = require('connect-flash');

const app = express();

// connect db
mongoose.connect('mongodb://localhost/ratingapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

require('./config/passport');

app.use(express.static('public'));
app.engine('ejs', engine);
// use server view (ejs)
app.set('view engine', 'ejs');
app.use(cookieParser());
// bodyParser - get body (req.body)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    // secret is used to sign in the session. This allows to use session across different pages
    secret: 'ThisIsMyTestKey',
    // false = we don't need to resave session to db
    resave: false,
    saveUninitialized: false,
    // store sessuib to mongo db
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(flash());
// passport must list after session
app.use(passport.initialize());
app.use(passport.session());

// pass argument app
require('./routes/user')(app);
// we can pass passport like this, if you dont "requre('passport') in user route"
// require('./routes/user')(app, passport);

app.listen(8000, () => {
  console.log('Listening on port 8000');
});
