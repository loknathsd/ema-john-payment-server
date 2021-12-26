const express = require ('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

console.log(process.env.DB_PASS)


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfsjf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);

const app = express()
app.use(cors())
app.use(bodyParser.json())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJohnStore").collection("products");
  const orderCollection = client.db("emaJohnStore").collection("orders");

    app.post('/addProduct',(req,res)=>{
        const products = req.body;
        console.log(products)
        collection.insertOne(products)
        .then(result =>{
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })
    app.get('/products', (req,res)=>{
        const search = req.query.search;
        collection.find({name : {$regex:search}})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
    app.get('/product/:key', (req,res)=>{
        collection.find({key:req.params.key})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
    })

    app.post('/productKeys',(req,res)=>{
        const productKeys = req.body;
        collection.find({key:{$in:productKeys} })
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })


    app.post('/addOrders',(req,res)=>{
        const orders = req.body;
        orderCollection.insertOne(orders)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })
//   client.close();
});





app.get('/' , (req,res)=>{
    res.send('hello maam..how are you')
})





app.listen(5000)