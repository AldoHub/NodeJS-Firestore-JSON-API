const express = require("express");
const router = express.Router();

//now the review of the code

//require the admin
//you need to install this module
const admin = require('firebase-admin');
// I will link the resource so you can check how to
// download this file with your credentials.

//this file is private
const serviceAcc = require("../keyfile.json");


//init the sdk
//this will use the file credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAcc)
})

//init an instance of cloud firestore
//use the admin module to create the instance
const db= admin.firestore();

//reference to the database collection
const usersCollection= db.collection("users");


//this route serves all the users 
router.get("/users",(req, res ,next) =>{
    //get the collection in the database
    //I am storing them in an array
    let allUsers = [];
    //this is the get for the users in firestore
    usersCollection.get()
    .then(snapshot => {
        //for each document return the data
        snapshot.forEach(doc => {
             allUsers.push({
                "docID" : doc.id,
                "userData": doc.data()
                });
        });
       //respond with the array created
       //as json
       res.json({
           "statusCode": "200",
           "statusReponse": "Ok",
           "message": "All users",
           "data" : allUsers
       })
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });

    
});


//this is the route that serves according to an Id
router.get("/users/:id", (req, res, next) =>{
    //got a little error this will only serve
    //this id
    //lets get the id of the req
    let reqId = req.params.id;
    //now we should get the data from the ID we pass
    //it works
    usersCollection.doc(reqId).get()
    .then(doc=>{
       if(doc.exists){
         //if the data exists in the database
         res.json({
             "statusCode": "200",
             "statusReponse": "Ok",
             "message" : "User found",
             "userData": doc.data()
         });
       }else{
         res.json({
             "statusCode": "404",
             "statusReponse": "Not found",
             "message" : "User not found"
         })
       }
       
    }).catch(err=>{
        console.log(err);
       
     })
});


//manage the post requets
//this route writes to firestore
router.post("/users", (req, res, next)=>{
  
    //check if the json object is not null or empty
    if(req.body.name != null && req.body.email != null || req.body.name != undefined && req.body.email != undefined){
        let docId= Math.floor(Math.random() * (99999 - 00000)); //need ID for the document
        //we create an object with the params
        let newUser = {
            "name": req.body.name, 
            "email": req.body.email
        }
        //send the user to firestore
        //and send it using the ID
        // if its not present, it will fail
        let setNewUser = usersCollection.doc(String(docId)).set(newUser);

        res.json({
            "message": "user was successfully created"
        })
    }else{
        res.json({
            "message": "req.body params are undefined"
        })
    }

    
    
   
    

});

//update route
router.put("/users/:id", (req, res, next)=>{
    //manage the update function for the user id sent
    //get the id of the document to be updated
    let userId = req.params.id; 
    
    //make the transaction
    let transaction = db.runTransaction( transaction =>{
        return transaction.get(usersCollection).then( doc =>{
           //again check if theres something in the req body
           //remember you need body-parser for this
            if(req.body.name != undefined && req.body.email != undefined){
            
                //we pass the data as an object
            transaction.update(usersCollection.doc(userId), {
                name: req.body.name,
                email: req.body.email
            })
           }else {
               res.json({
                   "statusCode": "500",
                   "statusResponse": "Error parsing the data",
                   "message": "There is no data to parse"
               })
           }
           
        });
    })
    .then(result =>{
        res.json({
            "statusCode": "200",
            "statusResponse": "Ok",
            "message": "Transaction Success",
        });
    })
    .catch(err =>{
        console.log(err);
    });
    

});


//manage the delete request
//this is the delete route, we pass the ID and it will be gone.
router.delete("/users/:id", (req, res, next)=>{
    let deleteDoc = usersCollection.doc(req.params.id).delete();
    res.json({
        "message": "User was deleted successfully", 
    });
});

//thats all for this little NodeJs and Firestore API

module.exports = router;