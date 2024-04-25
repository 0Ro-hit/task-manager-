const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    var arr=[];
    fs.readdir('./files',function(err,files){
        if(err) return res.send("error");
        files.forEach(function(file){
            var content=fs.readFileSync(`./files/${file}`,'utf-8')
            arr.push({name:file,data:content});
        })
        res.render("index",{files:arr});
    });
});




//read more about file

app.get('/read/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,data){
        if(err) return console.log(err);
        else res.render("readmore",{filename:req.params.filename,filedata:data});
    })
});

// delete file 

app.get('/delete/:removefile',function(req,res){
    fs.unlink(`./files/${req.params.removefile}`,function(err){
        
        res.redirect("/");
    })
})

//upadate file 
app.get("/update/:filename",function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,data){
        if(err) return console.log(err);
        res.render("update",{filename:req.params.filename,newdata:data}); 
    });
})

app.post("/update/:filename",function(req,res){
    fs.writeFile(`./files/${req.params.filename}`, req.body.data,function(err){
        if(err) return console.log(err);
        res.redirect("/");
    })
})

app.post('/create',function(req,res){
    var fn=req.body.name.split(' ').join('')+'.txt';
    fs.writeFile(`./files/${fn}`,req.body.data,function(err){
        if(err) return res.status(404).send("folder not found please create Files folder");
        res.redirect('/');
    })
});
app.listen(3000,function(){
    console.log("hey");
});