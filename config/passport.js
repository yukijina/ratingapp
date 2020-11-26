const passport = require('passport');
const { update } = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
// require model to access user schema (to login)
const User = require('../models/user');

////**** Passport */
// stores userId as session in database when user sign up
// When user login or retrieve any user data, passport.deserializeUser - find user by Id

// This function is passed 2nd. (2)
//serializer takes two argumments
//It takes userId and save in session in db
passport.serializeUser((user, done) => {
  console.log('user', user);
  // user.id is saved in session
  done(null, user.id);
});

// This function is passed 3rd. (3)
//get user id (that was saved above) from session and retrieve user data by id
passport.deserializeUser((id, done) => {
  //Find user by id. If id is find, everything is saved in this user object
  //findById - mongoose
  console.log('id', id);
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// This function is passed 1st. (1)
//passport middleware - for Signup
//LocalStrategy - password takes two - username and password
//if you sign with user name change 'email' to 'username'
passport.use(
  'local.signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // true means you can make cb after this curly bracket }
    },
    (req, email, password, done) => {
      //find if User is already in our db
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          // this err is for db connection error
          return done(err);
        }
        if (user) {
          // if user already exist, no sign up -> should login not signup
          // return done(null, false, {}); when you add specific message - add object
          return done(null, false);
        }

        // if there is no user, save user info to db
        const newUser = new User();
        console.log('req', req.body);
        newUser.fullname = req.body.fullname;
        newUser.email = req.body.email;
        // encryptPassword function is from user model
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
          return done(null, newUser);
        });
      });
    }
  )
);
