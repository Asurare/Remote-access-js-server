var WebSocketServer = require("ws").Server;
var fs = require("fs");

var ws = new WebSocketServer( { port: 8080 } );

function sending(ws_used, cmd, data_type) {
  var exec = require('child_process').exec,
    child;

  child = exec(cmd,
    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  function sending_data(data) {
    out += data;
    var to_send = {
      type: data_type,
      content: out
    };
    if (ws_used.readyState == ws_used.OPEN)
      ws_used.send(JSON.stringify(to_send));
  }
  var out = "";
  child.stdout.on('data', function (data) {
    if (ws_used.readyState == ws_used.OPEN)
      sending_data(data);
  });
  child.stderr.on('data', function (data) {
    if (ws_used.readyState == ws_used.OPEN)
      sending_data(data);
  });
  child.on('exit', function() {
    if (ws_used.readyState == ws_used.OPEN && cmd != "plesk bin customer --list")
      //sending(ws_used, "plesk bin customer --list", "list");
    out = "";
  });
}

console.log("Server started...");

ws.on('connection', function (ws)
{
  console.log(ws.upgradeReq.connection.remoteAddress);
  console.log("Browser connected online...");

  ws.on("message", function (str)
  {
    //sending(ws, "plesk bin customer --list", "list");
    var ob = JSON.parse(str);
    switch(ob.type)
    {
     case 'text':
      console.log("Received: " + ob.content);
      ws.send('{ "type":"text", "content":"Server ready."}');
      break;
     case 'client':
      sending(ws, ob.content, "text");
      console.log("Received for a client creation: " + ob.content);
      break;
    case 'domain':
     sending(ws, ob.content, "text");
     console.log("Received for a domain creation: " + ob.content);
     break;
    }
  });
  ws.on("close", function() {
      console.log("Browser gone.");
  });
});
