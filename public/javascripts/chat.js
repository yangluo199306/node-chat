/**
 * Created by yangluo on 2017/7/3.
 */

//相当于定义了一个Javascript类,在初始化时传入了一个socket.IO的参数socket

var Chat = function(socket){
    this.socket = socket;
}

//添加这个发送聊天消息的函数
Chat.prototype.sendMessage = function(room,text){
    var message = {
        room:room,
        text:text
    };
    this.socket.emit("message",message);
}

//变更房间的函数
Chat.prototype.changeRoom = function(room){
    this.socket.emit("join",{
        newRoom:room
    })
}

//处理聊天命令
Chat.prototype.processCommand = function(command){
    var words = command.split(" ");
    command = words[0].substring(1,words[0].length).toLowerCase();   //从第一个单词开始解析命令
    var message = false;
    switch(command){
        case "join":
            words.shift();
            var room = words.join(" ");
            this.changeRoom(room);                                    //处理房间的变换/创建
            break;
        case "nick":
            words.shift();
            var name = words.join(".");
            this.socket.emit("nameAttempt",name);                     //处理更名尝试
            break;
        default:
            message = "Unrecognized command.";                        //如果命令无法识别,返回错误消息
            break;
    }
    return message;
}



























