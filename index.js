const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user: dbUser3
// password: lkXjH7wwYORjVDe7


const uri = "mongodb+srv://dbUser3:lkXjH7wwYORjVDe7@cluster0.jbxtt4r.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const productCollection = client.db('productManagement').collection('products');
        

        app.get('/products', async(req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query)
            res.send(product);
        })

        app.post('/products', async(req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        app.put('/products/:id', async(req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const product = req.body;
            const option = { upsert: true }
            const updatedProduct = {
                $set: {
                    name: product.name,
                    photoURL: product.photoURL,
                    quantity: product.quantity,
                    price: product.price
                }
            }
            const result = await productCollection.updateOne(filter, updatedProduct, option);
            res.send(result)
        })

        app.delete('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Product Manage server in ready');
})

app.listen(port, () => {
    console.log('Product management server running on port ',port);
})