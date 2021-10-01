// OLD
const accountSid = 'AC8e7b0f1a335b7cb19d1489a913ae24c4';
const authToken = 'f22a69c038a1abdba1aba4a6992f15e1';
const client = require('twilio')(accountSid, authToken);
const stockey = 'MQLSM2MQGB2210J1'

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const fetch = require('node-fetch');


app.use(bodyParser.urlencoded({ extended: false }));

var text=`
    Greetings Customer 🌿
    
To get assistance with your query, reply with relevant keywords plus the company name:
        
1⃣ *Info* : To get information about a company
2⃣ *Stock* : To know stock price of a company
3⃣ *Change* : To get change percent of stock price w.r.t previous day 
4⃣ *Graph* : To get graphical depiction of historical stock prices.
5⃣ *End* : To stop this conversation
    
    
    `;



app.get('/', function (req, res) {
    res.send("hi");
});

app.post('/get-msg', async (req, res) => {
    const { From, Body } = req.body;
    console.log(Body);
    extractKeyword(Body,From);
    
});

function extractKeyword(message,phone){
    if(message == "Hello" || message == "hello" || message== "hi" || message == "Hi" || message == "menu" || message==1) respond("Greetings",phone,null)
    else{
        message = message.split(' ');
        keyword=message[0];
        company=message[1];
        console.log(keyword);
        console.log(company);
        respond(keyword,phone,company);
    } 
}

function respond(keyword, phone ,company) {
    console.log("sending response");
    if (keyword == "Info") myInfo(phone,company)
    else if (keyword == "Greetings") bonjour(phone)
    else if (keyword == "Stock") res_Stock(phone,company)
    else if (keyword == "Change") res_Change(phone,company)
    else if (keyword == "Graph") res_Graph(phone,company)
    else if (keyword == "End") stop(phone)
    else hi(phone);

}

function bonjour(phone){
    sendMessage(text,phone);
}

function stop(phone){
    sendMessage("Au revoir !",phone);
}
function res_Graph(phone,company){
    client.messages
    .create({
       mediaUrl: ['https://media.ycharts.com/charts/c511f80ec356858029d034295d969d3d.png'],
       from: 'whatsapp:+14155238886',
       body: `*${company}* Statistics `,
       to: phone
     })
     .catch((err) => {
        console.log("Error while sending message to user: " + err);
    });
}
function res_Stock(From, message) {

    var company = message.toLowerCase();
    getSymbol(company)
        .then((res) => {
            sym = res.bestMatches[0]['1. symbol'];
            getStock(sym).then((result) => {
                price = result['Global Quote']['05. price'];
                message = `
Stock price for *${company.toUpperCase()}* is : *${price}*

_▶️Send 1 to see the menu_

`;
                sendMessage(message, From);
            }).catch((err) => {
                sendMessage("Couldn't find stock price for your company :(", From);
            })
        }).catch((err) => {
            sendMessage("Sorry, I couldn't find the company that you mentioned. Maybe try a different spelling ?", From);
        })


}

function getSymbol(company) {

    return new Promise((resolve, reject) => {

        const URL = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' + company + '&apikey=' + stockey;
        fetch(URL)
            .then(res => res.json())
            .then((res) => {

                resolve(res)

            }).catch((err) => reject(err));

    });
}



function getStock(symbol) {
    return new Promise((resolve, reject) => {

        const URL = ' https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + symbol + '&apikey=' + stockey;
        fetch(URL)
            .then(res => res.json())
            .then((res) => {

                resolve(res)

            }).catch((err) => reject(err));

    });
}


function getInfo(symbol){
    return new Promise((resolve, reject) => {
       
        const URL = ' https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + stockey;
        fetch(URL)
            .then(res => res.json())
            .then((res) => {

                resolve(res)

            }).catch((err) => reject(err));

    });
}

function getChange(symbol){
    return new Promise((resolve, reject) => {
       
        const URL = ' https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + symbol + '&apikey=' + stockey;
        fetch(URL)
            .then(res => res.json())
            .then((res) => {

                resolve(res)

            }).catch((err) => reject(err));

    });
}

function myInfo(phone,company){
    var company = company.toLowerCase();
    getSymbol(company)
        .then((res) => {
            sym = res.bestMatches[0]['1. symbol'];
            getInfo(sym).then((result) => {
                company=company.toUpperCase();
                company_name = result['Name'];
                sector=result['Sector'];
                address=result['Address'];
                asset=result['AssetType'];
message=
`*${company}* Details : 

*Name* : ${company_name}
*Symbol* : ${sym}
*Asset Type* : ${asset}
*Sector* : ${sector}
*Address* : ${address}

_▶️Send 1 to see the menu_

`
                sendMessage(message, phone);
            }).catch((err) => {
                sendMessage("Couldn't find information for your company :(", From);
            })
        }).catch((err) => {
            sendMessage("Sorry, I couldn't find the company that you mentioned. Maybe try a different spelling ?", From);
        })
}

function res_Change(From,message){
var company = message.toLowerCase();
    getSymbol(company)
        .then((res) => {
            sym = res.bestMatches[0]['1. symbol'];
            getChange(sym).then((result) => {
                price = result['Global Quote']['09. change'];
                message = `
Change in Stock price for *${company.toUpperCase()}* is : *${price}*
                
_▶️Send 1 to see the menu_
                
                `;
                sendMessage(message, From);
            }).catch((err) => {
                sendMessage("Couldn't find change in stock price for your company :(", From);
            })
        }).catch((err) => {
            sendMessage("Sorry, I couldn't find the company that you mentioned. Maybe try a different spelling ?", From);
        })
}

function sendMessage(message, number) {

    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            body: message,
            to: number
        })
        .catch((err) => {
            console.log("Error while sending message to user: " + err);
        });
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


