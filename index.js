const fs = require('fs');
const express = require('express');

var app = require('express')();
var io = require('socket.io')(http);
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var sanitizer = require('sanitizer');

var port = process.env.PORT || 3000;

const secret_key = __dirname + '/powersource-c5e07ba477f9.json';

const admin = require('firebase-admin');
const serviceAccount = require(secret_key);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  const index = __dirname + '/public/static/index.html';

  res.sendFile(index);
});

app.get('/cards', async function (req, res) {
  const cardRef = db.collection('cards').doc('log');
  const doc = await cardRef.get(); 

  const cards = doc.data().log;

  res.send(cards);
});

app.post('/create_card', async function (req, res) {
  let background_img = req.body.background_img;
  let background_clr = req.body.background_clr;
  let card_tle = req.body.card_tle;
  let card_img = req.body.card_img;
  let card_frm = req.body.card_frm;

  const cardRef = db.collection('cards').doc('log');
  const doc = await cardRef.get(); 

  if (background_img === "fuck") {
    console.log("No background image given.");

    background_img = "style='background-color: " + background_clr +"'";
  }

  else {
    background_img = `style='background-size: cover; background-image: url("` + background_img + `")'`;
  }

  if (card_img === "fuck") {
    console.log("No card image given.");

    card_img = "<img src='https://media.discordapp.net/attachments/772064957793435678/778697163827445760/FFvZBv8dQXbZeOr0THrwpxdIFVBVAegTSZORqjjWfv7tD7IWvmHAkeSd8O_r2gjUqqrBte8d6f63nKG72Xq_HMB-th0X10_Tugsd.png' class='pfp'/>";
  }

  card_tle = sanitizer.escape(card_tle);
  card_frm = sanitizer.escape(card_frm);

  const card_shit = {
    log : "<div class='card center' " + background_img + ">" + "<h1>" + card_tle + "</h1><br/><img src='" + card_img + "' class='pfp'/><br/><h3><i>" + card_frm + "</i></h3></div><br/>" + doc.data().log
  }

  await cardRef.set(card_shit);

  res.send(doc.data().log);
});

http.listen(port, function(){
  console.log('listening on *:' + port);

  const cardRef = db.collection('cards').doc('log');

  async function fixShit () {
    const shit = await cardRef.get();

    if (!shit.exists) {
      console.log('Fixing....');

      const fix_shit = {
        log : `<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet"><link href='https://givecards.codesalvageon.repl.co/styles/external.css' rel='stylesheet'/>`
      }

      cardRef.set(fix_shit);
    }

    else {
      console.log('No fix needed.');
    }
  }

  fixShit();
});