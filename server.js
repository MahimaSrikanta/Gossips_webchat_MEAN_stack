var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var secret = 'Mahima';
var db = null;

MongoClient.connect(process.env.MONGODB_URI, function(err,dbconn){
    if(!err){
        console.log("we are connected");
        db = dbconn;
    };
});

app.use(bodyParser.json());
app.use(express.static('public'));

  /*  var mewo = [
     "Hello I flipped over my cup ",
      "My owner just said hi to me",
      "Hello , anyone there?"
    ];
    */
    
app.get ("/mew", function (req, res, next){
    
    db.collection('mewos', function (err, mewosCollection){
        mewosCollection.find().toArray(function(err, mewos){
            return res.send(mewos);
            
        });
    });

    
});

app.post("/me", function (req, res, next){
    var token = req.headers.authorization;
    var user = jwt.decode(token, secret);
    
 
       db.collection('mewos', function (err, mewosCollection){
              var new1 = {
                            text:req.body.new,
                            user:user._id,
                            username :user.username,
                            date: req.body.date
                    };
        mewosCollection.insert(new1,{w:1}, function(err, mewos){
            return res.send();
            
        });
    });

   
});

app.put("/remove", function (req, res, next){
     var token = req.headers.authorization;
    var user = jwt.decode(token, secret);
 
       db.collection('mewos', function (err, mewosCollection){
           
              var new1 = req.body.delmewo._id;
        mewosCollection.remove({_id: ObjectId(new1), user: user._id },{w:1}, function(err, result){
                return res.send();
            
                      
        })
    })

   
})

//Sign-up
app.post("/users", function (req, res, next){
  
   bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        // Store hash in your password DB. 
          var useraccount = {
                username: req.body.username,
                password: hash
                
            }
         db.collection('users', function (err, userCollection){
          userCollection.insert(useraccount,{w:1}, function(err, mewos){
            return res.send();
            
        });
    });
    
    });
});
          
  

  
});


//Login

app.put("/user/login", function (req, res, next){
 
       db.collection('users', function (err, userCollection){
       userCollection.findOne({username: req.body.username},function(err, user){
           bcrypt.compare(req.body.password,user.password, function(err, result) {
               if (result){
                   var token = jwt.encode(user, secret);
                   return res.json({token: token});
               }
               else{
                  return res.status(400).send(); 
               }
    
        });
       }) ;    
     
            
            
        });
    });

   



app.listen(process.env.PORT || 3000, function(){
    console.log ("Listening on port 3000");
});