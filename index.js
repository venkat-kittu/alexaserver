var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    transports: ['polling', 'websocket'],
});
var path = require('path');
var fileUpload = require('express-fileupload');
const sqlite3 = require('sqlite3').verbose();
var obj={};
var obj2={};
var data={};
var data2={};
var dbfile;
var db;
var type2;
var arr=new Array()

// io.attach(4567);

io.on('connection', function(socket){

  console.log('connected with unity');
  db = new sqlite3.Database('policestation.db',(err)=> {
	if(err) {console.err(err.message);}
	console.log('policestation database connected connected');
});
let sqlquery1="SELECT policestation,COUNT(policestation) as count FROM policedata GROUP BY policestation;";
db.all(sqlquery1,function(err,rows){
	if(err) 
		throw err;
	rows.forEach(function(row) {
		var temp={};
		temp['name'] = row.policestation;
		temp['value'] = row.count;
		arr.push(temp);
	});
	console.log(arr);
	data['Data'] = arr;
	obj['file'] =JSON.stringify(arr);
	console.log(JSON.stringify(obj));
	// console.log(obj['file']['data']['name'])

	io.emit('datarec',obj);
	io.emit('alexamsg',"your data is ready");
});
// db.close();

});

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(fileUpload());


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.js', function(req, res){
  res.sendFile(__dirname + '/index.js');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});