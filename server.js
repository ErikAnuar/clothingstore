require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose")
const multer = require("multer");
const crypto = require("crypto");
var path = require('path')

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

//multer establishing
var storage = multer.diskStorage({

  destination: './public/images',
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err)

      cb(null, file.originalname)
    })
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3
  }
})
//multer establishing

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(session({
  secret: "The biggy secret2.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-yerik:12354astana@cluster0.xo1cb.mongodb.net/codlabDB");

//schema for authentication
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

//schema for feedback
const codlabSchema = mongoose.Schema({
  email: {
    type: String
  },
  name: {
    type: String
  },
  surname: {
    type: String
  },
  content: {
    type: String
  }
});

//schema for goods
const goodsSchema = mongoose.Schema({
  title: String,
  price: Number,
  imagepath: String,
  description: String,
  typeofgood: String
});

const User = new mongoose.model("User", userSchema);
const feedback = new mongoose.model("feedback", codlabSchema);
const cart = new mongoose.model("cart", goodsSchema);

const tshirt = new mongoose.model("tshirt", goodsSchema);
const jeans = new mongoose.model("jean", goodsSchema);
const SweatshirtsHoodies = new mongoose.model("sweatshirt", goodsSchema);
const accessory = new mongoose.model("accessories", goodsSchema);
const bomber = new mongoose.model("bomber", goodsSchema);

//authentication stuff
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

//app methods
app.post("/createobject", upload.single("avatar"), function(req, res) {
  const collection = req.body.category
  if (req.body.imagepath == "url") {
    if (collection == "tshirts") {
      const newobject = new tshirt({
        title: req.body.titleofgood,
        price: req.body.priceofgood,
        imagepath: req.body.urltext,
        description: req.body.descriptionofgood,
        typeofgood: req.body.category
      })
      newobject.save()
      res.redirect("/tshirts");
    } else if (collection == "jeans") {
      const newobject = new jeans({
        title: req.body.titleofgood,
        price: req.body.priceofgood,
        imagepath: req.body.urltext,
        description: req.body.descriptionofgood,
        typeofgood: req.body.category
      })
      newobject.save()
      res.redirect("/jeans");
    } else if (collection == "hoodies") {
      const newobject = new SweatshirtsHoodies({
        title: req.body.titleofgood,
        price: req.body.priceofgood,
        imagepath: req.body.urltext,
        description: req.body.descriptionofgood,
        typeofgood: req.body.category
      })
      newobject.save()
      res.redirect("/hoodies");
    } else if (collection == "accessories") {
      const newobject = new accessory({
        title: req.body.titleofgood,
        price: req.body.priceofgood,
        imagepath: req.body.urltext,
        description: req.body.descriptionofgood,
        typeofgood: req.body.category
      })
      newobject.save()
      res.redirect("/accessories");
    } else if (collection == "bombers") {
      const newobject = new bomber({
        title: req.body.titleofgood,
        price: req.body.priceofgood,
        imagepath: req.body.urltext,
        description: req.body.descriptionofgood,
        typeofgood: req.body.category
      })
      newobject.save()
      res.redirect("/bombers");
    }
  } else if (req.body.imagepath == "pc") {
    if (collection == "tshirts") {
      const newobject = new tshirt({
        title: req.body.titleofgood,
        price: req.body.priceofgood,
        imagepath: "/images/" + req.file.originalname,
        description: req.body.descriptionofgood,
        typeofgood: req.body.category
      })
      newobject.save()
      res.redirect("/tshirts");
    } else if (collection == "jeans") {
      const newobject = new jeans({
        title: req.body.titleofgood,
        price: req.body.priceofgood,
        imagepath: "/images/" + req.file.originalname,
        description: req.body.descriptionofgood,
        typeofgood: req.body.category
      })
      newobject.save()
      res.redirect("/jeans");
    } else if (collection == "hoodies") {
      const newobject = new SweatshirtsHoodies({
        title: req.body.titleofgood,
        price: req.body.priceofgood,
        imagepath: "/images/" + req.file.originalname,
        description: req.body.descriptionofgood,
        typeofgood: req.body.category
      })
      newobject.save()
      res.redirect("/hoodies");
    } else if (collection == "accessories") {
      const newobject = new accessory({
        title: req.body.titleofgood,
        price: req.body.priceofgood,
        imagepath: "/images/" + req.file.originalname,
        description: req.body.descriptionofgood,
        typeofgood: req.body.category
      })
      newobject.save()
      res.redirect("/accessories");
    } else if (collection == "bombers") {
      const newobject = new bomber({
        title: req.body.titleofgood,
        price: req.body.priceofgood,
        imagepath: "/images/" + req.file.originalname,
        description: req.body.descriptionofgood,
        typeofgood: req.body.category
      })
      newobject.save()
      res.redirect("/bombers");
    }
  }
})

app.post("/feedback", function(req, res) {
  const newfeedback = new feedback({
    email: req.body.email1,
    name: req.body.name,
    surname: req.body.surname,
    content: req.body.message
  })
  newfeedback.save()
  res.redirect("/feedback")
})

app.get("/tshirts/:aidishka", function(req, res) {
  if (req.isAuthenticated()) {
    tshirt.find({
      _id: req.params.aidishka
    }, function(err, found) {
      if (found) {
        res.render("sproduct", {
          data: found,
          status: 200,
          username: req.session.passport.user
        })
      }
    })
  } else {
    tshirt.find({
      _id: req.params.aidishka
    }, function(err, found) {
      if (found) {
        res.render("sproduct", {
          data: found,
          status: 404
        })
      }
    })
  }
})

app.get("/jeans/:aidishka", function(req, res) {
  if (req.isAuthenticated()) {
    jeans.find({
      _id: req.params.aidishka
    }, function(err, found) {
      if (found) {
        res.render("sproduct", {
          data: found,
          status: 200,
          username: req.session.passport.user
        })
      }
    })
  } else {
    jeans.find({
      _id: req.params.aidishka
    }, function(err, found) {
      if (found) {
        res.render("sproduct", {
          data: found,
          status: 404
        })
      }
    })
  }
})

app.get("/hoodies/:aidishka", function(req, res) {
  if (req.isAuthenticated()) {
    SweatshirtsHoodies.find({
      _id: req.params.aidishka
    }, function(err, found) {
      if (found) {
        res.render("sproduct", {
          data: found,
          status: 200,
          username: req.session.passport.user
        })
      }
    })
  } else {
    SweatshirtsHoodies.find({
      _id: req.params.aidishka
    }, function(err, found) {
      if (found) {
        res.render("sproduct", {
          data: found,
          status: 404
        })
      }
    })
  }
})

app.get("/accessories/:aidishka", function(req, res) {
  if (req.isAuthenticated()) {
    accessory.find({
      _id: req.params.aidishka
    }, function(err, found) {
      if (found) {
        res.render("sproduct", {
          data: found,
          status: 200,
          username: req.session.passport.user
        })
      }
    })
  } else {
    accessory.find({
      _id: req.params.aidishka
    }, function(err, found) {
      if (found) {
        res.render("sproduct", {
          data: found,
          status: 404
        })
      }
    })
  }
})

app.get("/bombers/:aidishka", function(req, res) {
  if (req.isAuthenticated()) {
    bomber.find({
      _id: req.params.aidishka
    }, function(err, found) {
      if (found) {
        res.render("sproduct", {
          data: found,
          status: 200,
          username: req.session.passport.user
        })
      }
    })
  } else {
    bomber.find({
      _id: req.params.aidishka
    }, function(err, found) {
      if (found) {
        res.render("sproduct", {
          data: found,
          status: 404
        })
      }
    })
  }
})

app.post("/tshirts/:world", function(req, res) {
  tshirt.find({
    _id: req.params.world
  }, function(err, found) {
    if (found) {
      const newobject = new cart({
        title: found[0].title,
        price: found[0].price,
        description: found[0].description,
        imagepath: found[0].imagepath
      })
      newobject.save()
      res.redirect("/tshirts/" + req.params.world)
    }
  })
})

app.post("/jeans/:world", function(req, res) {
  jeans.find({
    _id: req.params.world
  }, function(err, found) {
    if (found) {
      const newobject = new cart({
        title: found[0].title,
        price: found[0].price,
        description: found[0].description,
        imagepath: found[0].imagepath
      })
      newobject.save()
      res.redirect("/jeans/" + req.params.world)
    }
  })
})

app.post("/hoodies/:world", function(req, res) {
  SweatshirtsHoodies.find({
    _id: req.params.world
  }, function(err, found) {
    if (found) {
      const newobject = new cart({
        title: found[0].title,
        price: found[0].price,
        description: found[0].description,
        imagepath: found[0].imagepath
      })
      newobject.save()
      res.redirect("/hoodies/" + req.params.world)
    }
  })
})

app.post("/accessories/:world", function(req, res) {
  accessory.find({
    _id: req.params.world
  }, function(err, found) {
    if (found) {
      const newobject = new cart({
        title: found[0].title,
        price: found[0].price,
        description: found[0].description,
        imagepath: found[0].imagepath
      })
      newobject.save()
      res.redirect("/accessories/" + req.params.world)
    }
  })
})

app.post("/bombers/:world", function(req, res) {
  bomber.find({
    _id: req.params.world
  }, function(err, found) {
    if (found) {
      const newobject = new cart({
        title: found[0].title,
        price: found[0].price,
        description: found[0].description,
        imagepath: found[0].imagepath
      })
      newobject.save()
      res.redirect("/bombers/" + req.params.world)
    }
  })
})

app.get("/createobject", function(req, res) {
  if (req.isAuthenticated() && req.session.passport.user == "erik02003@mail.ru") {
    res.render("createobject", {
      status: 200,
      username: req.session.passport.user
    })
  } else {
    res.redirect("/");
  }
})

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
})

app.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("index", {
      status: 200,
      username: req.session.passport.user
    })
  } else {
    res.render("index", {
      status: 404
    });
  }
})

app.get("/tshirts", upload.single("avatar"), function(req, res) {
  if (req.isAuthenticated()) {
    tshirt.find(function(err, found) {
      if (found) {
        res.render("tshirts", {
          data: found,
          status: '200',
          username: req.session.passport.user
        })
      }
    })
  } else {
    tshirt.find(function(err, found) {
      if (found) {
        res.render("tshirts", {
          status: '404',
          data: found
        })
      }
    })
  }
})

app.get("/jeans", upload.single("avatar"), function(req, res) {
  if (req.isAuthenticated()) {
    jeans.find(function(err, found) {
      if (found) {
        res.render("jeans", {
          data: found,
          status: '200',
          username: req.session.passport.user
        })
      }
    })
  } else {
    jeans.find(function(err, found) {
      if (found) {
        res.render("jeans", {
          status: '404',
          data: found
        })
      }
    })
  }
})

app.get("/hoodies", upload.single("avatar"), function(req, res) {
  if (req.isAuthenticated()) {
    SweatshirtsHoodies.find(function(err, found) {
      if (found) {
        res.render("hoodies", {
          data: found,
          status: '200',
          username: req.session.passport.user
        })
      }
    })
  } else {
    SweatshirtsHoodies.find(function(err, found) {
      if (found) {
        res.render("hoodies", {
          status: '404',
          data: found
        })
      }
    })
  }
})

app.get("/accessories", upload.single("avatar"), function(req, res) {
  if (req.isAuthenticated()) {
    accessory.find(function(err, found) {
      if (found) {
        res.render("accessories", {
          data: found,
          status: '200',
          username: req.session.passport.user
        })
      }
    })
  } else {
    accessory.find(function(err, found) {
      if (found) {
        res.render("accessories", {
          status: '404',
          data: found
        })
      }
    })
  }
})

app.get("/bombers", upload.single("avatar"), function(req, res) {
  if (req.isAuthenticated()) {
    bomber.find(function(err, found) {
      if (found) {
        res.render("bombers", {
          data: found,
          status: '200',
          username: req.session.passport.user
        })
      }
    })
  } else {
    bomber.find(function(err, found) {
      if (found) {
        res.render("bombers", {
          status: '404',
          data: found
        })
      }
    })
  }
})

app.get("/cart", function(req, res) {
  if (req.isAuthenticated()) {
    cart.find(function(err, found) {
        if (found) {
          res.render("cart", {
            status: '200',
            username: req.session.passport.user,
            data: found
          });
        }
      }
    )
} else {
  cart.find(function(err, found) {
      if (found) {
        res.render("cart", {
          status: '404',
          data: found
        });
      }
    })
  }
})

app.post("/delete", function(req, res) {
  const deleteditem = req.body.checkbox
  cart.findByIdAndRemove(deleteditem, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("successfully deleted an item");
      res.redirect("/cart")
    }
  })
})

app.get("/feedback", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("feedback", {
      status: '200',
      username: req.session.passport.user
    });
  } else {
    res.render("feedback", {
      status: 404
    });
  }
})

app.get("/buy", function(req, res) {
  res.render("form", {

  })
})

app.get("/login", function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/")
  } else {
    res.render("login");
  }
})

app.get("/register", function(req, res) {
  res.render("register");
})

app.post("/register", function(req, res) {
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register")
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/login")
      })
    }
  })
})

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/")
      })
    }
  })
})

app.post("/buy", function(req, res) {
  const firstname = req.body.firstName;
  const lastname = req.body.lastName;
  const username = req.body.username;
  const address = req.body.address;
  const phone = req.body.phone;
  const region = req.body.region;
  const city = req.body.city;
  const zip = req.body.zip;
  const note = req.body.customerNote;
  const shortColor = req.body.shortColor;
  const shirtColor = req.body.shirtColor;

  res.render("confirmation", {
    name: firstname,
    surname: lastname,
    username: username,
    address: address,
    region: region,
    phone: phone,
    city: city,
    zip: zip,
    note: note,
    shortColor: shortColor,
    shirtColor: shirtColor
  })
})

app.listen(3000, function() {
  console.log("Server is run on port 3000");
})
