var express = require("express");
var app = express();
var port = 3700;
var io = require('socket.io').listen(app.listen(port));
var http = require('http');


app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
  res.render("page");
});



app.use(express.static(__dirname + '/public'));
var langs = [];
langs[0] = {lang:'en-GB', users:1};
io.sockets.on('connection', function (socket) {

  console.log("user connected");
  socket.emit('message', { message: 'welcome to the chat'});
  socket.on('log', function(data){
    console.log(data);
  });
  socket.on('lang_set', function(data){
    var exists = 'nope';
    for(var i=0; i<langs.length; i++){
      if(langs[i].lang == data.language){
        exists = 'yup';
        langs[i].users++;
      }
      if(langs[i].lang == data.old_lang){
        langs[i].users--;
      }
    }
    if(exists=='nope'){
      langs[langs.length] = {lang: data.language, users: 1};
    }
    console.log(langs);
    console.log(langs.length);
  });
  socket.on('send', function (data) {
    console.log(data);
    var temp = data.language;
    for(var i=0; i<langs.length;i++){


      if((langs[i].users > 0)&&(temp!=langs[i].lang)){
        var temp2 = langs[i].lang;
        console.log(langs[i].lang);
        http.get("http://api.mymemory.translated.net/get?q=" + data.message + "&langpair="+temp+"|"+langs[i].lang, function(res,langs) {
          data.language = temp2;
          var mesage = '';
          res.on('data', function(chunk) {
            message = JSON.parse(chunk);
            data.message= message.responseData.translatedText;
            io.sockets.emit('message', data);
            console.log("Sent "+data.message+" to "+data.language+ " with the username "+data.username);
          });});}
          else{
            data.language = temp;
            io.sockets.emit('message', data);
            console.log("Sent "+data.message+" to "+data.language);
          }
        }

      });
    });
    console.log("Listening on port " + port);
