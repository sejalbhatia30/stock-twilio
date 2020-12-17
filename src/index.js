// ACCOUNT SID : AC69ff7a8f3a077a6860e4a9e3ee561fd7
// AUTH TOKEN : 3b8e30883f9a16dfd3670bcedd4a68bc
// Alphavantage API key: OO50UFG8BZLO2IL3

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');
const path = require('path');
const util =require('./utilities/utilities.js');
const resp = require('./responses/response.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

staticPath = path.join(__dirname, '../public');

app.use(express.static(staticPath));

// console.log(__dirname + '../public');

app.get('/', function (req, res) {
    resp.test();
    res.send("hi");
});

app.post('/get-msg', async (req, res) => {
    const { From, Body } = req.body;
    console.log(Body);
    extractKeyword(Body,From);
    
});

function extractKeyword(message,phone){
    if(message == "Hello" || message == "hello" || message== "hi" || message == "Hi" || message == "help" || message==1) respond("Greetings",phone,null)
    else{
        message = message.split(' ');
        keyword=message[0];
        company=message[1];
        console.log(keyword);
        console.log(company);
        respond(keyword.toLowerCase(),phone,company);
    } 
}

function respond(keyword, phone ,company) {

    if (keyword == "info") resp.myInfo(phone,company)
    else if (keyword == "Greetings") resp.bonjour(phone)
    else if (keyword == "stock") resp.res_Stock(phone,company)
    else if (keyword == "change") resp.res_Change(phone,company)
    else if (keyword == "graph") resp.res_Graph(phone,company)
    else if (keyword == "end") resp.stop(phone)
    else resp.hi(phone);

}

app.listen(3000, function () {
    console.log('Server listening on port 3000!');
});

