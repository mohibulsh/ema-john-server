const express = require('express')
const cors =require('cors')
require('dotenv').config()
const app = express()
const port =process.env.PORT ||5000;
//middle ware
app.use(cors())
app.use(express.json())
//use mongodb operation

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khyx0yo.mongodb.net/?retryWrites=true&w=majority`;

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
    const productsCollection = client.db('emaJohnDB').collection('products')
    //get all products
    app.get('/products',async(req,res)=>{
        console.log(req.query)
        const { page, limit } = req.query;
        const pageNumber = parseInt(page) || 0;
        const itemsPerPage = parseInt(limit) || 10;
        const skip = pageNumber * itemsPerPage
        const result = await productsCollection.find().skip(skip).limit(itemsPerPage).toArray()
        res.send(result)
    })
    //special dataload
    app.post('/productsById',async(req,res)=>{
      const ids = req.body;
      // console.log(ids)
      const objectIds=ids.map(id=>new ObjectId(id))
      console.log(objectIds)
      const query={_id:{$in : objectIds}}
      const result=await productsCollection.find(query).toArray()
      res.send(result)
      
    })
    //pagination products
    app.get('/totalProducts',async(req,res)=>{
        const result = await productsCollection.estimatedDocumentCount()
        res.send({totalProducts:result})
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('ema-john server is running')
})

app.listen(port, () => {
  console.log(`ema is running on port ${port}`)
})