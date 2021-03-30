const express = require('express')
const app = express()
const port = 5000

const password = "X3sgpUhoYyvrp52k";
require('dotenv').config()
console.log(process.env.DB_PASS);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const cors = require('cors');
app.use(cors());

const admin = require('firebase-admin');
var serviceAccount = require("../burj-al-arab-after-auth-master-firebase-adminsdk-lnv8u-c0ce8380be.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.muahx.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db("burjAlArab").collection("bookings");
  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer')) {
      const idToken = bearer.split(' ')[1];
      console.log(idToken);
      admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          console.log(tokenEmail, queryEmail)
          if (tokenEmail == queryEmail) {
            bookings.find({ email: req.query.email })
              .toArray((err, documents) => {
                res.status(200).send(documents)
              })
          }
          else{
            res.status(401).send('un-authrized')
          }
        })
        .catch((error) => {
          res.status(401).send('un-authrized')
        });
    }
    else{
      res.status(401).send('un-authrized')
    }

  })
});

app.listen(process.env.POST || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})