const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


// My_task
// W8N3FYsku2htZEW3
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://My_task:W8N3FYsku2htZEW3@cluster0.0e8wm8t.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const database = client.db("my-task").collection("tasks");
        const database_completeTask = client.db("my-task").collection("completeTask");
        app.post('/task', async (req, res) => {
            const doc = req.body
            if (doc.title) {
                const result = await database.insertOne(doc);
                res.send(result)
            }
        })

        app.get('/task', async (req, res) => {
            const email = req.query.email
            const query = {email : email}
            const result = await database.find(query).toArray();
            res.send(result)
        })

        app.get('/taskComplete', async (req, res) => {
            const id = req.query.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const completeTask = await database.findOne(query);
            console.log(completeTask)
            const result = await database_completeTask.insertOne(completeTask);
            await database.deleteOne(query);
            res.send(result)
        })

        app.get('/taskNotComplete', async (req, res) => {
            const id = req.query.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const NotCompleteTask = await database_completeTask.findOne(query);
            console.log(NotCompleteTask)
            const result = await database.insertOne(NotCompleteTask);
            await database_completeTask.deleteOne(query);
            res.send(result)
        })

        app.get('/taskCompleted', async (req, res) => {
            const email = req.query.email
            const query = {email : email}
            const completeTask = await database_completeTask.find(query).toArray();
            res.send(completeTask)
        })

        app.put('/updateTask', async (req, res) => {
            const id = req.query.id;
            console.log(id)
            const updatedData = req.body;
            console.log(updatedData)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updatedData.title,
                    details: updatedData.details
                },
            };
            const result = await database.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.delete('/taskDelete', async (req, res) => {
            const id = req.query.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await database.deleteOne(query);
            res.send(result)
        })

        app.delete('/completedTaskDelete', async (req, res) => {
            const id = req.query.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await database_completeTask.deleteOne(query);
            res.send(result)
        })
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})