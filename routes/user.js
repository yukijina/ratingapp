const passport = require('passport');

// if you don't 'require('passport') but if pass passport argument in server.js, you can write like this
// module.exports = (app, passport) => {
module.exports = (app) => {
  app.get('/', (req, res, next) => {
    // this title is for browser tag
    res.render('index', { title: 'Index || Rate App' });
  });

  app.get('/signup', (req, res) => {
    res.render('user/signup', { title: 'Sign Up || Rate App' });
  });

  app.post(
    '/signup',
    //local.signup is from config.passport
    passport.authenticate('local.signup', {
      //if successful, it redirects index /
      successRedirect: '/',
      failureRedirect: '/signup',
      failureFlash: true,
    })
  );

  app.get('/login', (req, res) => {
    res.render('user/login', { title: 'Login || Rate App' });
  });
};
