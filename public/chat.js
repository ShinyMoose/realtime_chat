window.onload = function() {

  var messages = [];
  var message_content = $('#field');
  var socket = io.connect('http://ubkkdf0b7001.blindrunner.koding.io:3700');
  var field = document.getElementById("field");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("content");
  var test_field = document.getElementById("testing");
  var name = document.getElementById("name");
  var lang = document.getElementById("current_lang");
  var lang_select = document.getElementById("lang_select");
  var user_data_button = document.getElementById("user_set");
  socket.on('message', function (data) {

    if((data.message)&&(data.language == lang.innerHTML)) {
      //data.message = translated_text;
      messages.push(data);
      //http://api.mymemory.translated.net/get?q=tanslatethis?&langpair=en|ar
      var html = '';
      for(var i=0; i<messages.length; i++) {
        html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
        html += messages[i].message + '<br />';
      }
      content.innerHTML = html;
    } else {
      console.log("There is a problem:", data);
    }
  });
  message_content.keypress(function(e)
  {
    code= (e.keyCode ? e.keyCode : e.which);
    if ((code == 13)&&(field.value!=='')){
      if(name.value == "") {
        alert("Please type your name!");
      } else {
        var text = field.value;
        var selected = lang.innerHTML;
        socket.emit('send', { message: text, username: name.value, language: selected});
        field.value = '';
      }

    }
  });
  sendButton.onclick = function(){
    if(name.value == "") {
      alert("Please type your name!");
    } else {
      var text = field.value;
      var selected = lang.innerHTML;
      socket.emit('send', { message: text, username: name.value, language: selected});
      field.value = '';
    }

  };
  user_data_button.onclick = function(){
    temp = lang.innerHTML;
    lang.innerHTML = lang_select.value;
    socket.emit('lang_set', {language: lang.innerHTML, old_lang: temp});
  };
};
