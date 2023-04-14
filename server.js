const express = require('express');
const bodyParser = require('body-parser');
const bycrpt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const database = knex({
    client: 'pg',
    connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Gancarz1',
    database : 'database'
  }
})

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/signin', (req, res) => {
    database.select('email', 'password', 'user').from('users')
    .where('email', '=', req.body.email)
    .then(data => {
    if (data[0].email === req.body.email) {
        if (req.body.password === data[0].password) {
            res.json(data);
        }
    } else {
        res.json('fail')
    }})
    .catch(err => res.status(400).json(err))
})

app.post('/checkuser', (req, res) => {
    console.log(req.body.email)
    database.select('email', 'user').from('users')
    .where('email', '=', req.body.email)
    .then(data => {
        if(data[0]) {
            res.json(data[0])
        } else {
            res.json('false')
        }
    })
    .catch(err => res.status(400).json(err)) 
})

app.post('/messageseen', (req, res) => {
    database('conversation')
    .where('receiver', '=', req.body.email)
    .where('sender', '=', req.body.person)
    .update({
        seen: 'yes',
    })
    .then(message => {
        res.json(message[0]);
    })
    .catch(err => res.status(400).json(err))
})

app.post('/addmessage', (req, res) => {
    database('conversation')
    .returning('*')
    .insert({
        sender: req.body.email,
        receiver: req.body.receiver,
        message: req.body.message,
        time: new Date(),
        seen: 'no'
    })
    .then(data => {
        if(data[0]) {
            res.json('success')
        } else {
            res.json('error')
        }
    })
    .catch(err => res.status(400).json(err))
})

app.post('/getfriends', (req, res) => {
    database.select('email', 'user', 'friends').from('users')
    .where('email', '=', req.body.email)
    .then(data => {
        res.json(data[0])
    })
    .catch(err => res.status(400).json(err))
})

app.get('/getusers', (req, res) => {
    database.select('email', 'user', 'friends', 'friendsrequest', 'password').from('users')
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json(err));
})

app.get('/messages', (req, res) => {
    database('conversation')
    .then(data => {
        if(data) {
            res.json(data)
        } else {
            res.json('error')
        }
    })
    .catch(err => res.status(400).json(err));
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    database('users')
        .returning('*')
        .insert({
            email: email,
            user: name,
            password: password,
            joined: new Date(),
            friends: '',
            friendsrequest: ''
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json(err))
})

app.post('/updatefile', (req, res) => {
    database('newprojects')
    .where('name', '=', req.body.name)
    .update({
    file: req.body.file,
    newfile: req.body.newfile,
    update: new Date(),
    })
    .then(project => {
        res.json(project[0]);
    })
    .catch(err => res.status(400).json(err))
})

app.post('/updatetask', (req, res) => {
    database('projects')
    .where('projectname', '=', req.body.projectname)
    .where('taskname', '=', req.body.taskname)
    .update({
    type: req.body.type,
    })
    .then(project => {
        res.json(project);
    })
    .catch(err => res.status(400).json(err))
})

app.put('/changeuser', (req, res) => {
    if (req.body.password !== undefined) {
        database('users')
        .where('email', '=', req.body.email)
        .update({
            password: req.body.password
        })
        .catch(err => res.status(400).json(err))
    } else if (req.body.name !== undefined) {
        database('users')
        .where('email', '=', req.body.email)
        .update({
            user: req.body.name
        })
        .catch(err => res.status(400).json(err))
    } else {
        res.status(400)
    }
})

app.put('/changeproject', (req, res) => {
    database('newprojects')
    .where('name', '=', req.body.projectName)
    .update({
        description: req.body.projectDescription
    })
    .then((data) => res.json(data))
    .catch(err => res.status(400).json(err))
})

app.post('/createtask', (req, res) => {
    database('projects')
    .returning('*')
    .insert({
        projectname: req.body.projectname,
        taskname: req.body.name,
        type: 'new',
        createdby: req.body.email,
        owner: req.body.owner,
        createtime: new Date()
    })
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json(err))
})

app.post('/deletetask', (req, res) => {
    database.select('projectname').from('projects')
    .where('taskname', '=', req.body.taskname)
    .where('projectname', '=', req.body.projectname)
    .del()
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json(err))
})

app.post('/deleteproject', (req, res) => {
    database.select('name').from('newprojects')
    .where('name', '=', req.body.name)
    .del()
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json(err));
})

app.post('/deleteprojecttask', (req, res) => {
    database.select('projectname').from('projects')
    .where('projectname', '=', req.body.projectname)
    .del()
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json(err))
})

app.post('/createproject', (req, res) => {
    const { email, projectName, projectDescription } = req.body;
    database('newprojects')
        .returning('*')
        .insert({
            name: projectName,
            owner: email,
            description: projectDescription,
            users: ""
    })
    .then(newProject => {
        res.json(newProject[0]);
    })
    .catch(err => res.status(400).json(err))
})

app.get('/getprojects', (req, res) => {
    database.select('*').from('newprojects')
    .then(projects => {
        res.json(projects);
    })
    .catch(err => res.status(400).json(err))
})

app.get('/gettasks', (req, res) => {
    database.select('*').from('projects')
    .then(tasks => {
        res.json(tasks);
    })
    .catch(err => res.status(400).json(err))
})

app.put('/newusers', (req, res) => {
    database('newprojects')
    .where('name', '=', req.body.name)
    .where('owner', '=', req.body.emailOwner)
    .update({
    users: req.body.users,
    })
    .then(project => {
        res.json(project);
    })
    .catch(err => res.status(400).json(err))
})

app.put('/invite', (req, res) => {
    database('users')
    .where('email', '=', req.body.email)
    .update({
    friendsrequest: req.body.friendsrequest,
    })
    .then(project => {
        res.json(project);
    })
    .catch(err => res.status(400).json(err))
})

app.put('/addfriend', (req, res) => {
    database('users')
    .where('email', '=', req.body.email)
    .update({
    friends: req.body.friends,
    friendsrequest: req.body.requests,
    })
    .then(project => {
        res.json(project);
    })
    .catch(err => res.status(400).json(err))
})

app.put('/deletefriend', (req, res) => {
    database('users')
    .where('email', '=', req.body.email)
    .update({
    friends: req.body.friends,
    })
    .then(project => {
        res.json(project);
    })
    .catch(err => res.status(400).json(err))
})

app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})