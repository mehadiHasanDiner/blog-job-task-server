const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctgcy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log('connection err', err)
  const blogsCollection = client.db("retroThemeBlog").collection("blogs");
  console.log("DB connected successfully")

  app.post('/addBlogs', (req, res) => {
    const newBlogs = req.body;
    console.log('adding new event: ', newBlogs)
    blogsCollection.insertOne(newBlogs)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  
  app.get('/blogs', (req, res) => {
    blogsCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  app.get('/blog/:id', (req, res) => {
    blogsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, document) => {
        res.send(document[0]);
    })
})

 app.delete('/delete/:id', (req, res) => {
  blogsCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result => {
      res.send(result.deletedCount > 0);
  })
})
  // client.close();

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})