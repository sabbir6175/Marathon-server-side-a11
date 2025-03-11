
const express = require('express')
const cors = require("cors")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const app = express()
const port = process.env.PORT || 3000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');




//middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(cookieParser())
app.use(express.json());


const verifyToken = (req, res, next) =>{
  console.log('verify token marathon', req.cookies)
  const token = req?.cookies?.token;
  if(!token){
    return res.status(401).send({message: 'Unauthorized access'})
  }
  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (error, decoded) =>{
    if(error){
      return res.status(401).send({message: "Unauthorized access"})
    }
    req.user = decoded
    next();
  })
  
  
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vlz3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(process.env.DB_USER, process.env.DB_PASS)
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
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
 

    // marathon related apis
     const MarathonCollection = client.db('MarathonDb').collection('marathon')
     const RegisterMarathonCollection = client.db('MarathonDb').collection('registerMarathon')


     //auth related apis
     app.post('/jwt', async(req, res)=>{
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET_TOKEN, {expiresIn: "1h"})
      res
        .cookie('token', token, {
          httpOnly: true,
          secure:false
        })
      .send({success: true})
     })

    //get add marathon
    app.get('/AddMarathon', verifyToken, async(req, res) => {
      const { sortOrder = "older" } = req.query;
      // Sort direction: -1 for descending (newest first), 1 for ascending (oldest first)
      const sortDirection = sortOrder === "newest" ? -1 : 1;


      // Fetch marathons from the database and sort by createdAt
      const cursor = MarathonCollection.find().sort({ createdAt: sortDirection });
      const result = await cursor.toArray();
  
      res.send(result);
  });
   

  
      // limit data
  app.get('/AddMarathon/limit', async(req, res)=>{
    const cursor = MarathonCollection.find();
    const result = await cursor.limit(6).toArray();
    res.send(result)
   })   

  //  See More button when click marathon details page 
  app.get('/AddMarathon/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
    const result = await MarathonCollection.findOne(query)
    res.send(result)
  });


//  add new marathon 
    app.post("/marathon", async(req,res)=>{
        const newMarathon = req.body;
        newMarathon.totalRegistrationCount = 0;
        newMarathon.createdAt = new Date();
        const result = await MarathonCollection.insertOne(newMarathon)
        res.send(result)
    })
    // register form submit and count register one
    app.post("/registerMarathon", async (req, res) => {
      const newRegistration = req.body;  
      const registrationResult = await RegisterMarathonCollection.insertOne(newRegistration);
      const marathonTitle = newRegistration.marathonTitle;
      const filter = { marathonTitle };
     
      const update = {
        $inc: { totalRegistrationCount: 1 }  
      };
      const updateResult = await MarathonCollection.updateOne(filter, update,registrationResult);
      res.send(updateResult );
    });

    //get register marathon My apply list
    app.get("/registerMarathon", verifyToken, async(req, res)=>{
      const { search = "" } = req.query;
      const register = RegisterMarathonCollection.find({marathonTitle: { $regex: search, $options: 'i' }, });
    const result = await register.toArray();
    res.send(result)

    })

  // register Marathon updated My apply list updated
  app.put('/registerMarathon/:id', async(req,res)=>{
    const id = req.params.id;
    const filter = { _id: new ObjectId(id)}
    const options = { upsert: true }
    const updatedCampaign = req.body;
    const Campaign ={
      $set:{
        email: updatedCampaign.email,
        marathonTitle: updatedCampaign.marathonTitle,
        startDate: updatedCampaign.startDate,
        firstName: updatedCampaign.firstName,
        lastName: updatedCampaign.lastName,
        contact: updatedCampaign.contact,
        message: updatedCampaign.message
      }
    } 
    const result = await RegisterMarathonCollection.updateOne(filter, Campaign, options)
    res.send(result)
  })


  // updated data add marathon
  app.put('/AddMarathon/:id', async(req,res)=>{
    const id = req.params.id;
    const filter = { _id: new ObjectId(id)}
    const options = { upsert: true }
    const updateMarathon = req.body;
    const Marathon ={
      $set:{
        marathonTitle: updateMarathon.marathonTitle,
        startRegistrationDate: updateMarathon.startRegistrationDate,
        endRegistrationDate: updateMarathon.endRegistrationDate,
        marathonStartDate: updateMarathon.marathonStartDate,
        location: updateMarathon.location,
        description: updateMarathon.description,
        runningDistance: updateMarathon.runningDistance,
        marathonImage: updateMarathon.marathonImage
      }
    } 
    const result = await MarathonCollection.updateOne(filter, Marathon, options)
    res.send(result)
  })

// marathon specific id delete
    app.delete('/AddMarathon/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await MarathonCollection.deleteOne(query)
        res.send(result)
    })
//  Register marathon specific id delete
    app.delete('/registerMarathon/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await RegisterMarathonCollection.deleteOne(query)
        res.send(result)
    })


} finally {
    // Ensures that the client will close when you finish/erzror
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('Marathon project running!')
  })
  
app.listen(port, () => {
    console.log(` Marathon project running app listening on port ${port}`)
})
