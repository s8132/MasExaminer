var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    everyauth = require('everyauth'),
    db = require('./models');

function preEveryauthMiddlewareHack() {
    return function (req, res, next) {
      var sess = req.session
        , auth = sess.auth
        , ea = { loggedIn: !!(auth && auth.loggedIn) };

      // Copy the session.auth properties over
      for (var k in auth) {
        ea[k] = auth[k];
      }

      if (everyauth.enabled.password) {
        // Add in access to loginFormFieldName() + passwordFormFieldName()
        ea.password || (ea.password = {});
        ea.password.loginFormFieldName = everyauth.password.loginFormFieldName();
        ea.password.passwordFormFieldName = everyauth.password.passwordFormFieldName();
      }

      res.locals.everyauth = ea;

      next();
    }
};

function postEveryauthMiddlewareHack() {
  var userAlias = everyauth.expressHelperUserAlias || 'user';
  return function( req, res, next) {
    res.locals.everyauth.user = req.user;
    res.locals[userAlias] = req.user;
    next();
  };
};

everyauth.everymodule
  .findUserById( function (id, callback) {
    // callback(null, usersById[id]);
    db.User.find(id).success(function(user){
      if(user!==null){
        callback(null, user);
      }
    });
  });

everyauth.everymodule.logoutPath('/logout');
everyauth.everymodule.logoutRedirectPath('/');

//Logowanie za pomoca maila
everyauth.password
  .loginFormFieldName('login')
  .passwordFormFieldName('password')
  .getLoginPath('/login')
  .postLoginPath('/login')
  .loginView('user/login')
  .authenticate(function(login, password){
    var prom = this.Promise();
    db.User.find({where: {login: login, password: password}}).success(function(user){
      if(user!==null){
        prom.fulfill(user);
      }else{
        prom.fulfill(['Logowanie nie udane']);
      }
    });
    return prom;
  })
  .loginSuccessRedirect('/')
  .getRegisterPath('/register')
  .postRegisterPath('/register')
  .registerView('user/login')
  .validateRegistration(function(newUserAttr){
    var prom = this.Promise();


    return prom;
  })
  .registerUser(function(newUserAttr){
    var prom = this.Promise();
    

    return prom;
  })
  .registerSuccessRedirect('/afterRegister');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser("egz"));
  app.use(express.session());
  app.use(preEveryauthMiddlewareHack());
  app.use(everyauth.middleware());
  app.use(postEveryauthMiddlewareHack());
  app.use(express.methodOverride(app));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/login', function(req, res){
  res.render('user/login');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
