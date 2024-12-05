const express = require("express");
const cors = require("cors")
const app = express();
const os = require("os")
const path = require('path');

let isReadyVote = false;
let resultados = [];
let logDeVotos = []

let alreadyVote = []

let pregunta = [
    "pregunta",
    ['a','b','c']
];

const globalData = require('./info.json');

const secretaria = globalData.admin;
console.log(secretaria)

const puerto = globalData.port;
console.log(puerto)

const consejales = globalData.concejo;
console.log(consejales)

let votes = [];

function concejalName(usuarioBuscado){
    for(let consejal of consejales){
        if(consejal.user === usuarioBuscado){
            return consejal.name;
        }
    } 
}

function getLocalIPAddress() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const addresses = networkInterfaces[interfaceName];
        for (const address of addresses) {
            if (address.family === 'IPv4' && !address.internal) {
                return address.address; // Retorna la dirección IPv4 no interna
            }
        }
    }
    return 'No se encontró una IP válida';
};

app.use('/chartjs', express.static(path.join(__dirname, 'node_modules/chart.js/dist')));
app.use(express.static("public"))
app.use(cors());
app.use(express.json());

//Recibe resultados
app.get('/resultados', (req, res) => {
    res.json({
        rta: resultados,
        logh: logDeVotos,
        quest: pregunta
    });
});

app.get('/getLocalIP', (req, res) => {
    const localIP = getLocalIPAddress();
    res.json({ ip: localIP,port:puerto });
});

app.get("/getData",(req,res)=>{
    const sendData = {
        quest:pregunta[0],
        option:pregunta[1]
    }
    res.send(JSON.stringify(sendData))
    
});

// Recibe el voto del Concejal
app.post("/vote/:voto",(req,res)=>{
    const data = req.body;
    let validate = true

    console.log(alreadyVote)

    alreadyVote.forEach(name => {
        if(name == data.user){
            validate = false;
        }
    });

    if(validate){
        logDeVotos.push(data);
        resultados[data.voto]++;
        alreadyVote.push(data.user);
    }
    res.end()
});

// Recibe la Pregunta
app.post("/quests/:data",(req,res)=>{
    resultados = [];
    const data = req.body;
    pregunta = [data.quest,data.options];

    data.options.forEach(item => {
        resultados.push(0);
    });

    console.log(pregunta);
    isReadyVote = true;
    logDeVotos = []
    res.end();
});

// Login Secretaria
app.post("/admin/:secretaria",(req,res)=>{
    const data = req.body;
    res.setHeader('Access-Control-Allow-Origin', '*');
    if(data["user"] == secretaria["user"] && data["pass"] == secretaria["pass"]){
        const sendData = {
            href:"setUpVote.html",
            name:'admin'
        }
        alreadyVote = []
        res.send(JSON.stringify(sendData))
    }else{
        const sendData = {
            href:"index.html",
            name:''
        }
        res.send(JSON.stringify(sendData))
    }
    res.end()
});

// Login de Concejales
app.post("/login/:user",(req,res)=>{
    const data = req.body;
    let nameID = '';
    let find = false;
    let voteYet = false;

    res.setHeader('Access-Control-Allow-Origin', '*');
    
    consejales.forEach(concejal => {
        if(data["user"] == concejal["user"] && data["pass"] == concejal["pass"]){
            nameID = concejal['name']
            find = true;
        }
    });

    alreadyVote.forEach( name =>{
        if(name == concejalName(data.user))
            voteYet = true;
    });


    if(find && isReadyVote && !voteYet){
        const clientIP = req.socket.remoteAddress;
        console.log(`Conexión recibida desde IP: ${clientIP}`);
        const sendData = {
            href:"concejal.html",
            name:nameID
        }
        res.send(JSON.stringify(sendData))
    }else{
        const sendData = {
            href:"index.html",
            name:nameID
        }
        res.send(JSON.stringify(sendData))
    }
    res.end()
});

app.listen(puerto,()=>{
    console.log(`Servidor en puerto: ${puerto}`)
    console.log(getLocalIPAddress())
}); 
