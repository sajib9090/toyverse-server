const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())



// mongodb 

const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yc3f8jy.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://toy-verse:cXguT5GBv6RyK0Kf@cluster0.yc3f8jy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db('ToysDB')
    const haiku = database.collection('toys')

    // post

    app.post('/toys', async(req, res) => {
       const toy = req.body
       const result = await haiku.insertOne(toy)
       res.send(result)
    //    console.log(toy);
       
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Toy-verse server is running')
})

app.listen(port, () => {
    console.log(`toy-verse is running on port, ${port}`);
})

