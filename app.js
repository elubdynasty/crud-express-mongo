const express = require('express')
const app = express()
const PORT = 5000;
const MongoClient = require('mongodb').MongoClient

const uri =
  "mongodb+srv://<username>:<password>@cluster0.vdq5m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then((client) => {
  console.log("Connected to DB");
  const db = client.db();

  const favsCollection = db.collection("users");

  app.set("view engine", "ejs");
 

  //middleware
  app.use(express.json());

  // For parsing application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

   app.get("/", (req, res) => {
     favsCollection.find().toArray()
     .then(results => {
        //console.log(results)
        res.render("index.ejs", { users: results });
     })
     .catch(err => {
         console.error(err)
     })
   

   });

  app.post("/create-users", (req, res) => {
    //console.log(req.body)
    favsCollection.insertOne(req.body).then((result) => {
      //console.log(result);
      
      res.redirect("/"); //when don't need to send browser info by asking the it to redirect back to '/' instead
    });
  });

  app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("listening on PORT", PORT);
  });
})
.catch(err => {
    console.error(err)
})