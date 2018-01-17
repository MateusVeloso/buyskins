/**
 * Basic example demonstrating passport-steam usage within Express framework
 */
var express = require('express')
        , passport = require('passport')
        , util = require('util')
        , session = require('express-session')
        , SteamStrategy = require('./strategy.js')
        , iven = require("steam-inventory")
        , MongoClient = require('mongodb').MongoClient
        , url = require('url')
        , path = require('path');


var uri = "mongodb://vttcue:OubMzOoRIDjdf7fV@buyskins-shard-00-00-zvlo4.mongodb.net:27017/buyskins_db?ssl=true&authSource=admin";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: '181EA201D7BE357D64DEDDEB1502C91D'
},
        function (identifier, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                // To keep the example simple, the user's Steam profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Steam account with a user record in your database,
                // and return that user instead.
                profile.identifier = identifier;
                return done(null, profile);
            });
        }
));
var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: require('crypto').randomBytes(64).toString('hex'),
    name: 'BuySkins Session',
    resave: true,
    saveUninitialized: true}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../../public'));

app.get('/', function (req, res) {
    if (req.user) {
        MongoClient.connect(uri, function (err, db) {
            try {
                var usuario = {id_steam: req.user.id};
                var collection = db.db("buyskins_db").collection("usuarios");
                collection.findOne(usuario, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    if (result) {
                        usuario = Object.assign({}, req.user, result);
                        if (!usuario) {
                            usuario = req.user;
                        }
                        res.render('index', {user: usuario});
                    }
                });
            } catch (exception) {
                console.log(exception);
            } finally {
                db.close();
            }
        });
    }else{
        res.render('index', {user: null});
    }
});

app.get('/account', ensureAuthenticated, function (req, res) {
    res.render('account', {user: req.user});
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/accounts', function (req, res) {
    MongoClient.connect(uri, function (err, db) {
        try {
            var collection = db.db("buyskins_db").collection("usuarios");
            collection.find().toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                res.render('accounts', {accounts: result});
            });
        } catch (exception) {
            console.log(exception);
        } finally {
            db.close();
        }
    });
});

app.get('/iventario', ensureAuthenticated, function (req, res) {
    if (req.user) {
        iven(req.user.id, 730, 2, (items, error) => {
            if (error) {
                return console.log("Erro: Não foi possivel acessar o iventario do jogador : " + req.user.displayName);
            } else {
                res.render('iventario', {user: req.user, iventario: items});
            }
        });
    }
});

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
app.get('/auth/steam',
        passport.authenticate('steam', {failureRedirect: '/'}),
        function (req, res) {
            res.redirect('/');
        });
// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/steam/return',
        passport.authenticate('steam', {failureRedirect: '/'}),
        function (req, res) {
            checkInsertUsuario(req.user.id, res);
        });

app.listen(3000);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
//const market = require('steam-market-pricing');
//market.getItemPrice(730, 'AK-47 | Point Disarray (Field-Tested)',[currency = 7]).then(item => console.log(item));


function insertUsuario(id, response) {
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            throw err;
        }
        var dbo = db.db("buyskins_db");
        var usuario = {id_steam: id, reais: "0,00", buy_coins: "0,00", rank: 0, qtd_vendas: 0, medalhas: {}};
        dbo.collection("usuarios").insertOne(usuario, function (err, res) {
            if (err) {
                console.error(err);
            }
            console.log('Usuário cadastrado com sucesso : ' + usuario.id_steam);
            response.redirect('/');
//            Object.assign(first, last)
            db.close();
        });

    });
}

function deleteUsuarios() {
    MongoClient.connect(uri, function (err, db) {
        try {
            if (err) {
                throw err;
            }
            var dbo = db.db("buyskins_db");
            dbo.collection("usuarios").drop(function (err, delOK) {
                if (err) {
                    throw err;
                }
                if (delOK) {
                    console.log("Collection deleted");
                }
            });
        } catch (exception) {
            db.close();
            console.log(exception);
        }
    });
}

function checkInsertUsuario(id, response) {
    MongoClient.connect(uri, function (err, db) {
        try {
            var usuario = {id_steam: id};
            var collection = db.db("buyskins_db").collection("usuarios");
            collection.findOne(usuario, function (err, result) {
                if (err) {
                    throw err;
                }
                if (!result) {
                    insertUsuario(id, response);
                } else {
                    console.log('Usuario já cadastrado : ' + JSON.stringify(result));
                    response.redirect('/');
                }
            });
        } catch (exception) {
            console.log(exception);
        } finally {
            db.close();
        }
    });
}

//deleteUsuarios();
//checkInsertUsuario();
