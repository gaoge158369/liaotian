var express=require("express");

var app=express();

var fs=require("fs");

var formidable=require("formidable");

//session公式：
var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//socket.io公式：
var http = require('http').Server(app);
var io = require('socket.io')(http);

var i=1;

app.set("view engine","ejs");

app.use(express.static("./public"));

app.get("/",function(req,res){
	if(req.session.username){
		res.render("index",{
			username:req.session.username,
			index:req.session.index
		});
	}else{
		res.redirect("/login");
	}

});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/dologin",function(req,res){
	 var form = new formidable.IncomingForm();
	 form.uploadDir = "./public/images";

	 form.parse(req,function(err,fields,files){

	 	fs.rename("./"+files.touxiang.path,"./public/images/"+fields.username+".jpg",function(err){
	 		if(err){
	 			res.send("错误");
	 			return;
	 		}
	 		req.session.username=fields.username;
	 		(i==2)?i=1:i=2;
	 		req.session.index=i;
	 		res.redirect("/");
	 	});
	 });
});

var i=0;
io.on("connection",function(socket){
	console.log("一个用户连接了"+i++);
	socket.on("liaotian",function(msg){
		console.log(msg);
		//把接收到的msg原样广播 
		io.emit("liaotian",msg);
	});
});


http.listen(3000);