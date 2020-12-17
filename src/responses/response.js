
const util = require('../utilities/utilities.js');
const fetch = require('node-fetch');

const accountSID = 'AC69ff7a8f3a077a6860e4a9e3ee561fd7';
const authToken = '3b8e30883f9a16dfd3670bcedd4a68bc';
const stockey = 'OO50UFG8BZLO2IL3';
const client = require('twilio')(accountSID, authToken);

var menu=`  
    Greetings Customer 🌿
    
To get assistance with your query, reply with relevant keywords plus the company name:
        
1⃣ *Info* : To get information about a company
2⃣ *Stock* : To know stock price of a company
3⃣ *Change* : To get change percent of stock price w.r.t previous day 
4⃣ *Graph* : To get graphical depiction of historical stock prices.
5⃣ *End* : To stop this conversation
    
    
    `;

function test() {
	console.log("working");
}

// Greetings
function bonjour(phone){

    util.sendMessage(menu,phone);
}


//End Conversation
function stop(phone){
    util.sendMessage("Au revoir !",phone);
}

// Send graph

// function res_Graph(phone,company){
//     client.messages
//     .create({
//        mediaUrl: ['https://1d5be9b5f0be.ngrok.io/graphs/1.png'],
//        from: 'whatsapp:+14155238886',
//        body: `*${company}* Statistics `,
//        to: phone
//      })
//      .catch((err) => {
//         console.log("Error while sending message to user: " + err);
//     });
// }

function res_Graph(phone,company){

    util.createGraph(company).then((url) => {

        console.log(url);

        client.messages
            .create({
               mediaUrl: [url],
               from: 'whatsapp:+14155238886',
               body: `*${company}* Statistics `,
               to: phone
             })
             .catch((err) => {
                console.log("Error while sending graph to user: " + err);
                send
            });

    }).catch((err) => {
        console.log("Error while creating graph: " + err);
        util.sendMessage("An error occured while generating the graph. Please try again.", phone);
    });
}


// Send Stock
function res_Stock(From, message) {

    var company = message.toLowerCase();
    util.getSymbol(company)
        .then((res) => {
            sym = res.bestMatches[0]['1. symbol'];
            util.getStock(sym).then((result) => {
                price = result['Global Quote']['05. price'];
                message = `
Stock price for *${company.toUpperCase()}* is : *${price}*
_▶️Send 1 to see the menu_
							`;
                util.sendMessage(message, From);
            }).catch((err) => {
                util.sendMessage("Couldn't find stock price for your company :(", From);
            })
        }).catch((err) => {
        	console.log("symbol error:" + err);
            util.sendMessage("Sorry, I couldn't find the company that you mentioned. Maybe try a different spelling ?", From);
        })


}

// Send information of company
function myInfo(phone,company){
    var company = company.toLowerCase();
    util.getSymbol(company)
        .then((res) => {
            sym = res.bestMatches[0]['1. symbol'];
            util.getInfo(sym).then((result) => {
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
`;
                util.sendMessage(message, phone);
            }).catch((err) => {
                util.sendMessage("Couldn't find information for your company :(", phone);
            })
        }).catch((err) => {
            console.log(err);
            util.sendMessage("Sorry, I couldn't find the company that you mentioned. Maybe try a different spelling ?", phone);
        })
}

// Send previous stock change

function res_Change(From,message){
var company = message.toLowerCase();
    util.getSymbol(company)
        .then((res) => {
            sym = res.bestMatches[0]['1. symbol'];
            util.getChange(sym).then((result) => {
                price = result['Global Quote']['09. change'];
                message = `
Change in Stock price for *${company.toUpperCase()}* is : *${price}*
                
_▶️Send 1 to see the menu_
                
                `;
                util.sendMessage(message, From);
            }).catch((err) => {
                console.log(err);
                util.sendMessage("Couldn't find change in stock price for your company :(", From);
            })
        }).catch((err) => {
            util.sendMessage("Sorry, I couldn't find the company that you mentioned. Maybe try a different spelling ?", From);
        })
}

function hi(phone) {
    var reply = `Sorry, I couldn't understand what you said. I can help you with the following: 
1⃣ *Info* : To get information about a company
2⃣ *Stock* : To know stock price of a company
3⃣ *Change* : To get change percent of stock price w.r.t previous day 
4⃣ *Graph* : To get graphical depiction of historical stock prices.
5⃣ *End* : To stop this conversation
    
    `;

    util.sendMessage(reply, phone);
}

module.exports = {hi, test, bonjour, stop, res_Change, res_Stock, res_Graph, myInfo, res_Change};
