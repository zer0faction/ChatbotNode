const builder = require('botbuilder');
const express = require('express');
const fs = require('fs');
const { Recognizer } = require('node-nlp');
const modelName = './smalltalk.nlp';
const excelName = './smalltalk.xls';
var http = require('http');
const { NlpManager } = require('node-nlp');


// Creates a connector for the chatbot
const connector = new builder.ChatConnector({
    appId: null,
    appPassword: null,
});

const recognizer = new Recognizer();
if (fs.existsSync(modelName)) {
    recognizer.load(modelName);
} else {
    recognizer.loadExcel(excelName);
    recognizer.save(modelName);
}


const bot = new builder.UniversalBot(connector, (session) => {
    recognizer.recognize(session, (err, data) => {
        session.send(data.answer || 'I don\'t understand');
    });
}).set('storage', new builder.MemoryBotStorage());

recognizer.setBot(bot);

// Creates a node-nlp recognizer for the bot
const manager = new NlpManager({ languages: ['en'] });
manager.load(modelName);

// Creates the express application
const app = express();
const port = process.env.PORT || 3000;
app.post('/api/messages', connector.listen());

app.get('/test/:message', async function (req, res, next) {
    const message = req.params.message;
    manager.process(message).then(result =>
        res.status(200).json(result.answer));
})

app.listen(port);
console.log('Chatbot listening on port 3000');
