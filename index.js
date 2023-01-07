const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('The server is running')
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.19qwu6y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const run = async() => {
    try{
        const myTasks = client.db('taskManagement').collection('myTasks');
        const completedTasks = client.db('taskManagement').collection('completedTasks');
        const taskCompleted = client.db('taskManagement').collection('taskcompleted');

        //Adding the task to the database
        app.post('/mytasks', async(req, res) => {
            const task = req.body;
            const result = await myTasks.insertOne(task);
            res.send(result);
        })

        //Showing the data to the server
        app.get('/mytasks', async(req, res) => {
            let query= {};
            if (req.query.email){
                query={
                  email: req.query.email
                }
              }
            const cursor = myTasks.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        })

        app.delete('/mytasks/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await myTasks.deleteOne(query);
            res.send(result);
        })

        app.post('/completedtasks', async(req, res) => {
            const task = req.body;
            const result = await completedTasks.insertOne(task);
            res.send(result);
            console.log(result);
        })

        app.get('/completedtasks', async(req, res) => {
            let query= {};
            if (req.query.email){
                query={
                  email: req.query.email
                }
              }
            const cursor =completedTasks.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        })

        app.delete('/completedtasks/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await completedTasks.deleteOne(query);
            res.send(result);
        })
    }
    catch(error){
        console.log(error.name, error.message, error.stack);
    }
}
run().catch(err => console.error(err))

app.listen(port, () => {
    console.log('its running')
})