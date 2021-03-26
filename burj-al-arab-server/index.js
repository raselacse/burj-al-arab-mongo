const express = require('express')
const app = express()
const port = 5000

const password = "X3sgpUhoYyvrp52k";

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://arabian:X3sgpUhoYyvrp52k@cluster0.muahx.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db("burjAlArab").collection("bookings");
  app.post('/booking', (req,res)=>{
      const newBooking = req.body;
      bookings.insertOne(newBooking)
      .then(result =>{
        res.send(result.insertedCount > 0)
      })
      console.log(newBooking);
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})