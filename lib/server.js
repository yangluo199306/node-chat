/**
 * Created by yangluo on 2017/7/3.
 */


var http = require("http");       //内置的http模块提供HTTP服务
var fs = require("fs");           //内置的fs模块提供了与文件系统相关的功能
var path = require("path");       //内置的path模块提供了与文件系统路径相关的功能
var mime = require("mime");       //附加的mime模块有根据文件扩展名得出MIME类型的能力
var cache = {};                   //用来缓存文件内容的对象
// console.log(http)
// 所请求的文件不存在时发送404错误的
function send404(response){
    response.writeHead(404,{"Content-Type":"text/plain"});
    response.write("Error 404:resource not found yangluo");
    response.end();
}

// 提供文件数据服务
function sendFile(response,filePath,fileContents){
    response.writeHead(200,{"content-type":mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

// 提供静态文件服务
function serverStatic(response,cache,absPath){
    if(cache[absPath]){                                         //检查文件是否缓存在内存中
        sendFile(response,absPath,cache[absPath])               //在内存中返回文件
    }else{
        console.log(fs.exists)
        fs.exists(absPath,function(exists){                     //检查文件是否存在
            if(exists){
                fs.readFile(absPath,function(err,data){         //从硬盘中读取
                    if(err){
                        send404(response)
                    }else{
                        cache[absPath] = data;
                        sendFile(response,absPath,data)         //从硬盘中读取文件并返回
                    }
                })
            }else{
                send404(response);                               //发送HTTP 404响应
            }
        })
    }
}

// 创建HTTP服务器的逻辑

var server = http.createServer(function(request,response){      //创建HTTP服务器,用匿名函数定义对每个请求的处理行为
    var filePath = false;
    if(request.url == "/"){
        filePath = "public/index.html";                         //确认返回的默认HTML文件
    }else{
        filePath = "public" + request.url;                      //将URL路径转化为文件的相对路径
    }
    var absPath = "../" + filePath;
    console.log(absPath)
    serverStatic(response,cache,absPath)                         //返回静态文件
})

//启动HTTP服务器

server.listen(3000,function(){
    console.log("Server listening on port 3000")
})

// 设置SocketIO服务器

var chatServer = require("./chat_server");
chatServer.listen(server);



