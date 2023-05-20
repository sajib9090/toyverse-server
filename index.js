const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yc3f8jy.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb+srv://toy-verse:lkL7TE42OLevs8ag@cluster0.yc3f8jy.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("ToysDB");
    const haiku = database.collection("toys");

    // get/read
    app.get("/toys", async (req, res) => {
      const cursor = haiku.find();
      const result = await cursor.toArray();
      res.send(result);
    });

     
    

    app.get('/category/:subCategory', async (req, res) => {
      
      if(req.params.subCategory == "baby_dolls" || req.params.subCategory == "barbie" || req.params.subCategory == "american_girl"){
        const result = await haiku.find({category: req.params.subCategory}).sort({ createdAt: -1 }).toArray()
        return res.send(result)
      }
      const result = await haiku.find({category: req.params.subCategory }).sort({createdAt: -1}).toArray()
      res.send(result)
    })

    //get

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id)}
      const data = await haiku.findOne(query)
      res.send(data)
     })

   

    // post
    app.post("/toys", async (req, res) => {
      const toy = req.body;
      toy.createdAt = new Date();
      const result = await haiku.insertOne(toy);
      res.send(result);
      //    console.log(toy);
    });

    //delete

    app.delete('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await haiku.deleteOne(query)
      res.send(result)
    })

    



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Toy-verse server is running");
});

app.listen(port, () => {
  console.log(`toy-verse is running on port, ${port}`);
});
