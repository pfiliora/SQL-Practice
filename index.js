const express = require('express');
const db = require('sqlite');

let app = express();
const port = 4001;

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const DB_NAME = './database.sqlite';

// this is sqliteui stuff
const socket = require('./sqliteui/websocket');
app.use('/', express.static('./sqliteui/public', {
    'index': ['index.html']
}));
const SocketInst = socket(DB_NAME, app);
app = SocketInst.app;
// end sqliteui stuff

app.get('/Company', (req, res, next) => {
    return db.get('SELECT * FROM Company')
    .then
    next();
})

//A MIDDLEWARE SOLUTION TO PASSING IN THE REQ.BODY, AND MATCHING KEYS VIA $
// app.use((req, res, next) => {
//     let args = {};
//     for (const prop in req.body) {
//         args['$' + prop] = req.body[prop];
//     }
//     req.body = args;
//     next();
// })

app.post('/Company', (req, res, next) => {

    db.all('SELECT * FROM Company')
        .then(() => {  
            // initial way I did it. simple yet can grow lenthy.          
            return db.run("INSERT INTO COMPANY (NAME,AGE,ADDRESS,SALARY) VALUES (?, ?, ?, ?)", [req.body.NAME, req.body.AGE, req.body.ADDRESS, req.body.SALARY])
            // return db.run("INSERT INTO COMPANY (NAME,AGE,ADDRESS,SALARY) VALUES (?, ?, ?, ?)", req.body)
        })
        .then((Company) => {            

            // *SUPER IMPORTANT* always broadcast to update the UI
            SocketInst.broadcast('LOAD_BUFFER');
            // END 
            return db.all('SELECT * FROM Company')
        })
        .then((data) => {    
            res.header('Content-Type', 'application/json');
            res.send({ Company });
        })
        .catch((e) => {
            res.status(401);
        });
});

app.post('/Department', (req, res, next) => {
    console.log('here');

    db.all('SELECT * FROM Department')
        .then(() => {
            return db.run("INSERT INTO Department (NAME) VALUES (?)", [req.body.NAME])
        })
        .then((Department) => {
            console.log(Department);

            // *SUPER IMPORTANT* always broadcast to update the UI
            SocketInst.broadcast('LOAD_BUFFER');
            // END 

            res.header('Content-Type', 'application/json');
            res.send({ Department });
        })
        .catch((e) => {
            res.status(401);
        });
});

Promise.resolve()
    .then(() => db.open(DB_NAME, { Promise }))
    // .then(() => db.migrate({ force: 'last' }))
    .then(() => app.listen(port))
    .then(() => {
        console.log(`Server started on port ${port}`)
     })
    .catch(err => console.error(err.stack))
