
const accountSID = 'AC69ff7a8f3a077a6860e4a9e3ee561fd7';
const authToken = '3b8e30883f9a16dfd3670bcedd4a68bc';
const stockey = 'OO50UFG8BZLO2IL3';
const client = require('twilio')(accountSID, authToken);

const fetch = require('node-fetch');

const username = 'rachit-lamba98';
const api_key = 'gapaBhfzXZHeZA2s4MtO';
var plotly = require('plotly')(username, api_key);

const fs = require('fs');


// get stock symbol for a company
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


// get stock data
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

// get info of a company
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

function createGraph(company) {
    return new Promise((resolve, reject) => {
        getSymbol(company).then((res) => {
            var symbol = res.bestMatches[0]['1. symbol'];
            const URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol +'&apikey=' + stockey;
            fetch(URL).then(res => res.json())
                .then((res) => {
                    data = res['Time Series (Daily)'];
                    var count = 0;

                    var close = [];
                    var open = [];
                    var high = [];
                    var low = [];
                    var dates = [];

                    for(var date in data) {

                        if(count == 7)
                            break;

                        open.push(data[date]['1. open']);
                        high.push(data[date]['2. high']);
                        low.push(data[date]['3. low']);
                        close.push(data[date]['4. close']);

                        dates.push(date);

                        count++;
                    }

                    var openTrace = {
                        x : dates,
                        y : open,
                        name : 'Opening price',
                        type : 'scatter'
                    };

                    var closeTrace = {
                        x : dates,
                        y : close,
                        name : 'Closing price',
                        type : 'scatter'
                    };

                    var highTrace = {
                        x : dates,
                        y : high,
                        name : 'High price',
                        type : 'scatter'
                    };

                    var lowTrace = {
                        x : dates,
                        y : low,
                        name : 'Low price',
                        type : 'scatter'
                    };

                    var layout = {
                        title : `${company} Stock Price Graph`,
                        xaxis: {
                            title: "Dates",
                            titlefont: {
                                family: "Courier New, monospace",
                                size: 18,
                                color: "#7f7f7f"
                            }
                        },
                        yaxis: {
                            title: "Price (in Dollars)",
                            titlefont: {
                                family: "Courier New, monospace",
                                size: 18,
                                color: "#7f7f7f"
                            }
                        }
                    };

                    var figure = { data : [openTrace, closeTrace, highTrace, lowTrace], layout : layout};

                    var imgOptions = {format : 'png', width : 1000, height : 500};

                    plotly.getImage(figure, imgOptions, (err, imgStream) => {

                        if(err) 
                            return reject(err);

                        var filename = new Date().toISOString();
                        var filepath = './public/graphs/' + filename + '.png';

                        var fileStream = fs.createWriteStream(filepath);
                        imgStream.pipe(fileStream);
                        fileStream.on('error', reject);

                        const host = 'http://bcfb523127fe.ngrok.io';

                        const url = host + '/graphs/' + filename + '.png';

                        resolve(url);
                        
                    })

                })

        }).catch((err) => reject(err));

    });
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

module.exports = {getSymbol, getStock, getInfo, getChange, createGraph, sendMessage};