const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require("body-parser")
app.set('view engine', 'ejs');

var session = require('express-session')

app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true
}));

app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err)
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/html/index.html')
})
const https = require('https');

app.get('/profile/:id', function (req, res) {
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    data = ""
    https.get(url, function (https_res) {
        https_res.on("data", function (chunk) {
            data += chunk
        })
        https_res.on("end", function () {
            data = JSON.parse(data)
            abilities = data.abilities
            if (abilities.length == 3) {
                res.render("profile.ejs", {
                    "id": req.params.id,
                    "name": data.name,
                    "height": data.height,
                    "weight": data.weight,
                    "ability1": abilities[0].ability.name,
                    "ability2": abilities[1].ability.name,
                    "ability3": abilities[2].ability.name
                })
            } else if (abilities.length == 2) {
                res.render("profile.ejs", {
                    "id": req.params.id,
                    "name": data.name,
                    "height": data.height,
                    "weight": data.weight,
                    "ability1": abilities[0].ability.name,
                    "ability2": abilities[1].ability.name,
                    "ability3": ""
                })
            }
        })
    })
})

mongoose.connect("mongodb+srv://prab_bains:comp2537@2537-assignment.4wd0k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const eventSchema = new mongoose.Schema({
    eventDescription: String,
    user: String,
    hits: Number,
    time: String
});
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    pfp: String,
    type: String
})
const cartSchema = new mongoose.Schema({
    cardImage: String,
    name: String,
    price: Number,
    user: String
})
const orderSchema = new mongoose.Schema({
    cardImage: String,
    name: String,
    price: Number,
    user: String
})
const timelineModel = mongoose.model("timeline", eventSchema);
const userModel = mongoose.model("users", userSchema);
const cartModel = mongoose.model("cart", cartSchema);
const orderModel = mongoose.model("order", orderSchema);

const Joi = require('joi');
const req = require('express/lib/request');

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('[a-zA-Z0-9]')).min(3).max(30).required()
})

const newUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('[a-zA-Z0-9]')).min(3).max(30).required()
})

app.use(bodyparser.urlencoded({
    extended: true
}));

app.get('/timeline/getAllEvents', function (req, res) {
    timelineModel.find({}, function (err, data) {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log("Data: " + data);
        }
        res.send(data)
    });
})

app.get('/timeline/getAllEventsOfUser', function (req, res) {
    timelineModel.find({
        user: req.session.real_user[0].username
    }, function (err, data) {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log("Data: " + data);
        }
        res.send(data)
    });
})

app.put('/timeline/insert', function (req, res) {
    console.log(req.body)
    if (req.session.authenticated) {
        timelineModel.create({
            'eventDescription': req.body.eventDescription,
            'user': req.session.real_user[0].username,
            'time': req.body.time,
            'hits': req.body.hits
        }, function (err, data) {
            if (err) {
                console.log("Error: " + err)
            } else {
                console.log("Data " + data);
            }
            res.send("Successfully inserted.");
        });
    } else {
        timelineModel.create({
            'eventDescription': req.body.eventDescription,
            'user': 'Guest',
            'time': req.body.time,
            'hits': req.body.hits
        }, function (err, data) {
            if (err) {
                console.log("Error: " + err)
            } else {
                console.log("Data " + data);
            }
            res.send("Successfully inserted.");
        });
    }
})

app.get('/timeline/delete/:id', function (req, res) {
    timelineModel.remove({
        '_id': req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log("Data: " + data);
        }
        res.send("Successfully deleted.")
    })
})

app.get('/timeline/increaseHits/:id', function (req, res) {
    timelineModel.updateOne({
        '_id': req.params.id
    }, {
        $inc: {
            'hits': 1
        }
    }, function (err, data) {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log("Data: " + data);
        }
        res.send("Successfully Updated.")
    })
})

app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}))

app.get('/history', function (req, res) {
    res.sendFile(__dirname + "/public/html/timeline.html")
})

app.get('/timeline', function (req, res) {
    timelineModel.find({}, function (err, logs) {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log("Data: " + JSON.stringify(logs))
        }
        res.send(JSON.stringify(logs));
    })
})

app.get('/search', function (req, res) {
    res.sendFile(__dirname + '/public/html/search.html')
})

app.get('/login', function (req, res) {
    if (req.session.authenticated == true) {
        res.redirect('/userProfile')
    } else {
        res.sendFile(__dirname + '/public/html/login.html')
    }
})

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/public/html/signup.html')
})

function get_password(data) {
    return data.password
}

app.post('/verify', function (req, res) {
    username = req.body.username
    password = req.body.password
    userModel.find({
        username: username
    }, function (err, user) {
        var info = user
        const {
            error
        } = schema.validate({
            username: username,
            password: password
        })
        if (error) {
            req.session.authenticated = false
            res.send("incorrect information")
        } else if (err) {
            console.log(err)
        } else {
            user = user.map(get_password)
            if (req.body.password == user[0]) {
                req.session.real_user = info
                req.session.authenticated = true
                res.send(req.session.real_user)
            } else {
                req.session.authenticated = false
                res.send("incorrect information")
            }
        }
    })
})

app.put('/addAccount', function (req, res) {
    userModel.create({
        username: req.body.username,
        password: req.body.password,
        pfp: '../img/profilepic.png',
        type: req.body.type

    }, function (err, data) {
        const {
            error
        } = schema.validate({
            username: username,
            password: password
        })
        if (error) {
            req.session.authenticated = false
            res.send("incorrect information")
        } else if (err) {
            console.log("Error: " + err)
        } else {
            console.log("New Account: " + data)
        }
        res.send("Data sent successfully!")
    })
})

app.put('/addAdmin', function (req, res) {
    userModel.create({
        username: req.body.username,
        password: req.body.password,
        pfp: '../img/profilepic.png',
        type: req.body.type

    }, function (err, data) {
        const {
            error
        } = newUserSchema.validate({
            username: username,
            password: password
        })
        if (error) {
            req.session.authenticated = false
            res.send("incorrect information")
        } else if (err) {
            console.log("Error: " + err)
        } else {
            console.log("New Account: " + data)
        }
        res.send("Data sent successfully!")
    })
})

app.get('/signOut', function (req, res) {
    req.session.authenticated = false
    res.redirect("/")
})

app.get('/userProfile', function (req, res) {
    if (req.session.authenticated == true) {
        res.render("userProfile.ejs", {
            profilePicture: req.session.real_user[0].pfp,
            username: req.session.real_user[0].username
        })
    } else {
        res.redirect('/login');
    }
})

app.get('/checkAuthentication', function (req, res) {
    res.send(req.session.authenticated)
})

app.get('/checkUserType', function (req, res) {
    res.send(req.session.real_user[0].type)
})

app.get('/shop', function (req, res) {
    res.sendFile(__dirname + "/public/html/shop.html")
})

app.put('/addToCart', function (req, res) {
    if (req.session.authenticated == true) {
        cartModel.create({
            cardImage: req.body.cardImage,
            user: req.session.real_user[0].username,
            name: req.body.name,
            price: req.body.price
        }, function (err, data) {
            if (err) {
                console.log("Error: " + err)
            } else {
                console.log("Data: " + data)
            }
        })
    } else {
        cartModel.create({
            cardImage: req.body.cardImage,
            user: 'Guest',
            name: req.body.name,
            price: req.body.price
        }, function (err, data) {
            if (err) {
                console.log("Error: " + err)
            } else {
                console.log("Data: " + data)
            }
        })
    }
    res.send("Successfully added to cart.")
})

app.get('/cart', function (req, res) {
    if (req.session.authenticated == true) {
        res.sendFile(__dirname + "/public/html/cart.html")
    } else {
        res.redirect("/")
    }
})

app.get('/getCartItems', function (req, res) {
    cartModel.find({user: req.session.real_user[0].username}, function (err, data) {
        if (err) {
            console.log("Error: " + err)
        } else {
            console.log("Data: " + data)
        }
        res.send(data);
    })
})

app.get('/cart/delete/:id', function (req, res) {
    cartModel.remove({
        '_id': req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log("Data: " + data);
        }
        res.send("Successfully deleted.")
    })
})

app.get('/checkout', function (req, res) {
    cartModel.remove({user: req.session.real_user[0].username}, function (err, data) {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log("Data: " + data);
        }
    })
    res.send("Checked out all items.")
})

app.put('/insertIntoOrder', function (req, res) {
    orderModel.create({
        cardImage: req.body.cardImage,
        name: req.body.name,
        price: req.body.price,
        user: req.body.user
    }, function (err, data) {
        if (err) {
            console.log("Error: " + err)
        } else {
            console.log("Data: " + data)
        }
    })
    res.send("Inserted item into order.")
})

app.get('/getPreviousOrders', function (req, res) {
    orderModel.find({user: req.session.real_user[0].username}, function (err, data) {
        if (err) {
            console.log("Error: " + err)
        } else {
            console.log("Data: " + data)
        }
        res.send(data)
    })
})

app.get('/orders', function (req, res) {
    if (req.session.authenticated == true) {
        res.sendFile(__dirname + "/public/html/orders.html")
    } else {
        res.redirect("/")
    }
})

app.get('/admin', function (req, res) {
    if (req.session.authenticated == true) {
        res.sendFile(__dirname + "/public/html/admin.html")
    } else {
        res.redirect("/")
    }
})

app.get('/getAllUsers', function (req, res) {
    userModel.find({type: 'user'}, function (err, data) {
        if (err) {
            console.log("Error: " + err)
        } else {
            console.log("Data: " + data)
        }
        res.send(data)
    })
})

app.get('/findUser/:id', function (req, res) {
    userModel.find({"_id": req.params.id}, function (err, data) {
        if (err) {
            console.log("Error: " + err)
        } else {
            console.log("Data: " + data)
        }
        res.send(data)
    })
})

app.post('/updateUsername/:id', function (req, res) {
    const usernameSchema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required()
    })
    const {error, value} = usernameSchema.validate({username: req.body.newUsername})
    if (error) {
        console.log(error)
        res.send(error)
    } else {
        userModel.updateOne({"_id": req.params.id}, {
        $set: {username: req.body.newUsername}
        }, function (err, data) {
            if (err) {
                console.log("Error: " + err)
                res.send(err)
            } else {
                console.log("Data: " + data)
                res.send("updated successfully")
            }
        })
    }
})

app.post('/updatePassword/:id', function (req, res) {
    const passwordSchema = Joi.object({
        password: Joi.string().pattern(new RegExp('[a-zA-Z0-9]')).min(3).max(30).required()
    })
    const {error, value} = passwordSchema.validate({password: req.body.newPassword})
    if (error) {
        console.log(error)
        res.send(error)
    } else {
        userModel.updateOne({"_id": req.params.id}, {
        $set: {password: req.body.newPassword}
        }, function (err, data) {
            if (err) {
                console.log("Error: " + err)
                res.send(err)
            } else {
                console.log("Data: " + data)
                res.send("updated successfully")
            }
        })
    }
})

app.delete('/deleteUser/:id', function (req, res) {
    userModel.remove({"_id": req.params.id}, function (err, data) {
        if (err) {
            console.log("Error: " + err)
        } else {
            console.log("Data: " + data)
            res.send("successfully deleted")
        }
    })
})

app.get('/game', function (req, res) {
    if (req.session.authenticated) {
        res.sendFile(__dirname + "/public/html/game.html")
    } else {
        res.redirect("/")
    }
})

app.post('/validateBoardSize', function (req, res) {
    const gameSizeSchema = Joi.object({
        gameSize: Joi.string().pattern(new RegExp('([3-8]+[x][3-8]+)')).min(3).max(3).required()
    })
    const {error, value} = gameSizeSchema.validate({gameSize: req.body.gameSize})
    if (error) {
        console.log(error)
        res.send("incorrect information")
    } else {
        res.send(req.body.gameSize)
    }
})

app.use(express.static("./public"))