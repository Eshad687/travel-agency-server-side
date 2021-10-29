const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sxeom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);
async function run() {
    try {
        await client.connect();
        console.log('database connected')
        const database = client.db('travel_agency');
        const eventCollection = database.collection('offerings');

        // GET OFFERS API
        app.get('/offerings', async (req, res) => {
            const cursor = eventCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
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
