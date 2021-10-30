const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sxeom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//console.log(uri);
async function run() {
    try {
        await client.connect();
        // console.log('database connected')
        const database = client.db('travel_agency');
        const offersCollection = database.collection('offerings');
        const bookingCollection = database.collection('bookings')

        // GET OFFERS API
        app.get('/offerings', async (req, res) => {
            const cursor = offersCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        })

        // POST OFFERS API

        app.post('/offerings', async (req, res) => {

            const newOffer = req.body;
            const result = await offersCollection.insertOne(newOffer)

            console.log('got new user', req.body);
            console.log('added user', result);

            //sending back to client side
            res.send(result)
        })

        //GET BOOKING API
        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })


        //POST BOOKING API
        app.post('/bookings', async (req, res) => {

            const newBooking = req.body;
            const result = await bookingCollection.insertOne(newBooking)

            res.send(result)
        })

        // GET MY BOOKING API
        app.get('/bookings/:email', async (req, res) => {
            const query = req.params.email;

            const cursor = bookingCollection.find({ email: query });
            const bookings = await cursor.toArray();
            res.send(bookings);
        })

        //UPDATE API

        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBooking = req.body;
            //console.log(id, updatedBooking)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedBooking.status,


                }
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options)

            res.send(result);
        })

        //DELETE API

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            //console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            // console.log('deleted count', result)
            // console.log('deleting user with id', id)

            res.json(result);
        })

    }
    finally {
        //await client.close();
    }

}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('backend server started');
})

app.listen(port, () => {
    console.log('listening to the port', port)
})
