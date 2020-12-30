var row=0;
var col=0;
var num=0;
var zz=0;
var h=0;
var m=0;
var s=0;



function NewGame()
{
    // var levels = document.getElementsByClassName("level-button");
    var levels = document.querySelectorAll(".level-button");
    // alert(levels[0]);
    for(var i=0;i<levels.length;i++){
        levels[i].addEventListener('click', function(event){
            var level=event.target.innerHTML;
            //alert(level);
            switch(level){
                case "初级":
                    h=0;
                    m=0;
                    s=0;
                    row=9;
                    col=9;
                    num=10;
                    Clear();
                    Init(row, col, num);
                    //alert(level);
                    break;
                case "中级":
                    h=0;
                    m=0;
                    s=0;
                    row=16;
                    col=16;
                    num=40;
                    Clear();
                    Init(row, col, num);
                    //alert(level);
                    break;
                case "高级":
                    h=0;
                    m=0;
                    s=0;
                    row=16;
                    col=30;
                    num=99;
                    Clear();
                    Init(row, col, num);
                    //alert(level);
                    break;
                case "自定义难度":
                    break;
                default:
                    alert("请选择游戏难度!");
                    break;
            }
        })
    }
    restart=document.querySelector(".restart-button");
    restart.addEventListener('click', function(){
        h=0;
        m=0;
        s=0;
        Init(9, 9, 10);
    })
}


// 刷新时间的间隔
var FreshTime;
// 初始化
function Init(row, col, num){
    h=0;
    m=0;
    s=0;
    if(localStorage.getItem("min_time")==null){
        var local_time=document.getElementById("min-time");
        console.log("local_time");
        local_time.innerHTML="暂无成绩";
    }
    else{
        var local_time=document.getElementById("min-time");
        console.log("local_time");
        local_time.innerHTML=localStorage.getItem("min_time");
    }

    var residue=document.getElementById("number");
    residue.innerHTML=num;
    var time=document.getElementById("time");
    time.innerHTML='00:00:00';
    var i=1;
    var T;
    // 取消由 setInterval() 设置的 timeout。
    clearInterval(FreshTime);
    FreshTime=setInterval(function name(params) {
        T='';
        if(s<59){
            s++;
        }
        else{
            s=0;
            if(m<59){
                m++;
            }
            else{
                h++;
            } 
        }
        if(h>=10){
            T+=`${h}:`;
        }
        else{
            T+=`0${h}:`;
        }
        if(m>=10){
            T+=`${m}:`;
        }
        else{
            T+=`0${m}:`;
        }
        if(s>=10){
            T+=`${s}`;
        }
        else{
            T+=`0${s}`;
        }
        time.innerHTML=T;
        //time.innerText=`${i++}`;
    }, 1000);
    var map=document.getElementById("map");
    map.innerHTML="";
    var body=document.getElementsByTagName("body");
    body[0].style.minWidth=`${27 * col}px`;

    var martix=CreateMap(row, col, num);
    CreateBomb(martix, row, col);
    ClearBomb(row, col, num);
}

function CreateMap(row, col, num){
    var map=new Array();
    // 生成一个二维矩阵来存放地图
    for(var i=0;i<row;i++){
        map[i]=new Array();
        for(var j=0;j<col;j++){
            map[i][j]=0;
        }
    }

    // 随机将地雷放入地图中
    for(var i=0;i<num;i++){
        var x = Math.floor(Math.random() * row);
        // alert(x);
        var y = Math.floor(Math.random() * col);
        // alert(y);
        while(true){
            // 该位置已放入地雷
            if(map[x][y]!=9){
                map[x][y]=9;
                break;
            }
            else{
                var x = Math.floor(Math.random() * row);
                var y = Math.floor(Math.random() * col);
            }
        }
    }

    // 为每个地雷旁边的八个方格添加一个数目
    var AddNum=function(x, y, row, col){
        if (x >= 0 && x < row && y >= 0 && y < col) {
            if (map[x][y] !== 9) {
                map[x][y] += 1;
            }
        }
    }

    var Write=function(){
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] === 9) {
                    // 上下 6 个
                    for (var i = -1; i < 2; i++) {
                        AddNum(x - 1, y + i, row, col);
                        AddNum(x + 1, y + i, row, col);
                    }
                    // 左右 2 个
                    AddNum(x, y + 1, row, col);
                    AddNum(x, y - 1, row, col);
                }
            }
        }
    }
    Write();
    return map;
}


// 向id为map的div中写入地雷
function CreateBomb(map, row, col){
    var bombs=document.getElementById("map");
    for (var i = 0; i < map.length; i++) {
        bombs.innerHTML=bombs.innerHTML+`<div class="row x-${i}" data-x="${i}" style="margin:0 auto;"></div>`;
    }

    var bomb=document.querySelectorAll('.row');
    for(var i=0;i<bomb.length;i++){
        for(var j=0;j<map[0].length;j++){
            var m=map[i][j];
            if (m === 0) {
                m = ''
            }
            
            bomb[i].innerHTML=bomb[i].innerHTML+`<div class="col y-${j} num-${m}" data-y="${j}">
                                                    <span class="span-${m}">${m}</span>
                                                    <img src="./扫雷-img/flag.svg" class="img-flag hide">
                                                </div>`;
        }
    }
}

function ClearBomb(row, col, num){
    var count=0;

    var MakeWhite=function(x, y, row, col){
        if(x<row && y<col && x>=0 && y>=0){
            //alert(x);
            //var child1=document.querySelector(`.x-${x}`);
            //alert(child1);
            var child=document.querySelector(`.x-${x}`).children[y];
            if(child.style.background != "white"){
                child.classList.add('open');
                child.style.background = 'white';
                child.children[0].style.opacity = '1';
                child.children[1].classList.add('hide');
                count++;
                IsSuccess(count, row, col, num);
                if (child.innerText == '') {
                    ShowNoMine(x, y, row, col);
                }
            }
        }
    }

    //自动显示空的格子
    var ShowNoMine = function (x, y, row, col) {
        // console.log(x, y, 'x,y');
        if(x-1>=0&&y+1<col){
            MakeWhite(x - 1, y + 1, row, col);
        }
        if(x-1>=0&&y-1>=0){
            MakeWhite(x - 1, y - 1, row, col);
        }
        if(x-1>=0){
            MakeWhite(x - 1, y, row, col);
        }
        if(x+1<row&&y-1>=0){
            MakeWhite(x + 1, y - 1, row, col);
        }
        if(x+1<row){
            MakeWhite(x + 1, y, row, col);
        }
        if(y+1<col){
            MakeWhite(x, y + 1, row, col);
        }
        if(y-1>=0){
            MakeWhite(x, y - 1, row, col);
        }
    }

    var display=function(){
        //鼠标左键
        var r=document.querySelectorAll(".row");
        for(var i=0;i<r.length;i++){
            r[i].addEventListener('click', function(event){
                var t=event.target;
                //alert(t.tagName);
                if (t.tagName != 'DIV') {
                    t=event.target.parentElement;
                }
                //确定元素中是否含有hide类
                var flag=t.children[1].classList.contains('hide');
                //判断方格是否被打开
                var flag1=t.classList.contains('open');
                if(t.tagName=="DIV" && flag){
                    if (t.children[0].innerText !== '9' && t.style.background !== 'white') {
                        //不透明属性
                        t.classList.add('open');
                        t.children[0].style.opacity = '1';
                        t.style.background = 'white';
                        count++;
                        IsSuccess(count, row, col, num);
                    }
                    else if (t.children[0].innerText === '9') {
                        zz = 1;
                        //给t的class增加一个boom
                        t.classList.add('boom');
                        load_sound();
                        var all = document.querySelectorAll('.col');
                        var ff = [];
                        var allNum = 0;

                        for (var i = 0; i < all.length; i++) {
                            if (all[i].children[0].innerText === '9') {
                                ff[allNum] = all[i];
                                allNum++;
                            }
                        }
                        allNum = 0;
                        //延时时间
                        var time = 60; 
                        if (num > 50) {
                            time = 10;
                        } else if (num > 10) {
                            time = 25;
                        }
                        var stop = setInterval(function () {
                            //给所有地雷的class增加一个boom
                            ff[allNum].classList.add('boom');
                            if(!ff[allNum].children[1].classList.contains('hide'))
                            {
                                ff[allNum].children[1].classList.add('hide');
                            }
                            allNum++;
                            if (allNum === ff.length) {
                                clearInterval(stop);
                                MyAlert("你失败了!");
                            }
                        }, time);
                        // alert(2);
                    }
                    if (t.children[0].innerText === '') {
                        // 获取到位置
                        var x = parseInt(t.parentElement.dataset.x);
                        var y = parseInt(t.dataset.y);
                        // 背景变成白色
                        ShowNoMine(x, y, row, col);
                    }
                }
                if(t.tagName=="DIV"&&flag1){
                    var count1=0;
                    var x = parseInt(t.parentElement.dataset.x);
                    var y = parseInt(t.dataset.y);
                    // alert(x);
                    // alert(y);
                    var x1=x-1;
                    var x2=x+1;
                    var y1=y-1;
                    var y2=y+1;
                    var brother1;
                    var brother2;
                    var brother3;
                    var brother4;
                    var brother5;
                    var brother6;
                    var brother7;
                    var brother8;
                    if(x<row && y<col && x>=0 && y>=0){
                        //得到当前的方格
                        var child=document.querySelector(`.x-${x}`).children[y];
                        if(x1>=0 && y1>=0){
                            //alert(1);
                            brother1=document.querySelector(`.x-${x1}`).children[y1];
                            if(!brother1.children[1].classList.contains('hide'))
                                count1++;
                        }
                        if(x1>=0){
                            //alert(2);
                            brother2=document.querySelector(`.x-${x1}`).children[y];
                            if(!brother2.children[1].classList.contains('hide'))
                                count1++;
                        }
                        if(x1>=0&&y2<col){
                            //alert(3);
                            brother3=document.querySelector(`.x-${x1}`).children[y2];
                            if(!brother3.children[1].classList.contains('hide'))
                                count1++;
                        }
                        if(y1>=0){
                            //alert(4);
                            brother4=document.querySelector(`.x-${x}`).children[y1];
                            if(!brother4.children[1].classList.contains('hide'))
                                count1++;
                        }
                        if(y2<col){
                            //alert(5);
                            brother5=document.querySelector(`.x-${x}`).children[y2];
                            if(!brother5.children[1].classList.contains('hide'))
                                count1++;
                        }
                        if(x2<row && y1>=0){
                            //alert(6);
                            brother6=document.querySelector(`.x-${x2}`).children[y1];
                            if(!brother6.children[1].classList.contains('hide'))
                                count1++;
                        }  
                        if(x2<row){
                            //alert(7);
                            brother7=document.querySelector(`.x-${x2}`).children[y];
                            if(!brother7.children[1].classList.contains('hide'))
                                count1++;
                        }
                        if(x2<row&&y2<col){
                            //alert(8);
                            brother8=document.querySelector(`.x-${x2}`).children[y2];
                            if(!brother8.children[1].classList.contains('hide'))
                                count1++;
                        }
                        
                        if(count1==child.children[0].innerHTML)
                        {
                            if(brother1 != undefined){
                                if(!brother1.classList.contains("open") && brother1.children[1].classList.contains("hide")){
                                    if(brother1.style.background != "white" && brother1.children[0].innerText != '9'){
                                        brother1.classList.add('open');
                                        brother1.style.background = 'white';
                                        brother1.children[0].style.opacity = '1';
                                        brother1.children[1].classList.add('hide');
                                        count++;
                                        IsSuccess(count, row, col,num);
                                        if (brother1.children[0].innerText == '') {
                                            //alert(1);
                                            ShowNoMine(x1, y1, row, col);
                                        }
                                    }
                                    else if(brother1.children[0].innerText=='9'){
                                        brother1.classList.add('boom');
                                        load_sound();              
                                        zz = 1;
                                        var all = document.querySelectorAll('.col');
                                        var ff = [];
                                        var allNum = 0;
                
                                        for (var i = 0; i < all.length; i++) {
                                            if (all[i].children[0].innerText === '9') {
                                                ff[allNum] = all[i];
                                                allNum++;
                                            }
                                        }
                                        allNum = 0;
                                        //延时时间
                                        var time = 60; 
                                        if (num > 50) {
                                            time = 10;
                                        } else if (num > 10) {
                                            time = 25;
                                        }
                                        var stop = setInterval(function () {
                                            //给所有地雷的class增加一个boom
                                            ff[allNum].classList.add('boom');
                                            allNum++;
                                            if (allNum === ff.length) {
                                                clearInterval(stop);
                                                MyAlert("你失败了!");
                                            }
                                        }, time);

                                    }
                                }
                            }
                            if(brother2!=undefined){
                                if(!brother2.classList.contains("open") && brother2.children[1].classList.contains("hide")){
                                    if(brother2.style.background != "white" && brother2.children[0].innerText!='9'){
                                        brother2.classList.add('open');
                                        brother2.style.background = 'white';
                                        brother2.children[0].style.opacity = '1';
                                        brother2.children[1].classList.add('hide');
                                        count++;
                                        IsSuccess(count, row, col, num);
                                        if (brother2.children[0].innerText == '') {
                                            //alert(2);
                                            ShowNoMine(x1, y, row, col);
                                        }
                                    }
                                    else if(brother2.children[0].innerText=='9'){
                                        brother2.classList.add('boom');
                                        load_sound();
                                        zz = 1;
                                        var all = document.querySelectorAll('.col');
                                        var ff = [];
                                        var allNum = 0;
                
                                        for (var i = 0; i < all.length; i++) {
                                            if (all[i].children[0].innerText === '9') {
                                                ff[allNum] = all[i];
                                                allNum++;
                                            }
                                        }
                                        allNum = 0;
                                        //延时时间
                                        var time = 60; 
                                        if (num > 50) {
                                            time = 10;
                                        } else if (num > 10) {
                                            time = 25;
                                        }
                                        var stop = setInterval(function () {
                                            //给所有地雷的class增加一个boom
                                            ff[allNum].classList.add('boom');
                                            allNum++;
                                            if (allNum === ff.length) {
                                                clearInterval(stop);
                                                MyAlert("你失败了!");
                                            }
                                        }, time);
                                    }
                                }
                            }  
                            if(brother3!=undefined){
                                if(!brother3.classList.contains("open") && brother3.children[1].classList.contains("hide")){
                                    if(brother3.style.background != "white" && brother3.children[0].innerText!='9'){
                                        brother3.classList.add('open');
                                        brother3.style.background = 'white';
                                        brother3.children[0].style.opacity = '1';
                                        brother3.children[1].classList.add('hide');
                                        count++;
                                        IsSuccess(count, row, col, num);
                                        if (brother3.children[0].innerText == '') {
                                            //alert(3);
                                            ShowNoMine(x1, y2, row, col);
                                        }
                                    }
                                    else if(brother3.children[0].innerText=='9'){
                                        brother3.classList.add('boom');
                                        load_sound();
                                        zz = 1;
                                        var all = document.querySelectorAll('.col');
                                        var ff = [];
                                        var allNum = 0;
                
                                        for (var i = 0; i < all.length; i++) {
                                            if (all[i].children[0].innerText === '9') {
                                                ff[allNum] = all[i];
                                                allNum++;
                                            }
                                        }
                                        allNum = 0;
                                        //延时时间
                                        var time = 60; 
                                        if (num > 50) {
                                            time = 10;
                                        } else if (num > 10) {
                                            time = 25;
                                        }
                                        var stop = setInterval(function () {
                                            //给所有地雷的class增加一个boom
                                            ff[allNum].classList.add('boom');
                                            allNum++;
                                            if (allNum === ff.length) {
                                                clearInterval(stop);
                                                MyAlert("你失败了!");
                                            }
                                        }, time);
                                    }
                                }
                            }
                            if(brother4!=undefined){
                                if(!brother4.classList.contains("open") && brother4.children[1].classList.contains("hide")){
                                    if(brother4.style.background != "white" && brother4.children[0].innerText!='9'){
                                        brother4.classList.add('open');
                                        brother4.style.background = 'white';
                                        brother4.children[0].style.opacity = '1';
                                        brother4.children[1].classList.add('hide');
                                        count++;
                                        IsSuccess(count, row, col, num);
                                        if (brother4.children[0].innerText == '') {
                                            //alert(4);
                                            ShowNoMine(x, y1, row, col);
                                        }
                                    }
                                    else if(brother4.children[0].innerText=='9'){
                                        brother4.classList.add('boom');
                                        load_sound();
                                        zz = 1;
                                        var all = document.querySelectorAll('.col');
                                        var ff = [];
                                        var allNum = 0;
                
                                        for (var i = 0; i < all.length; i++) {
                                            if (all[i].children[0].innerText === '9') {
                                                ff[allNum] = all[i];
                                                allNum++;
                                            }
                                        }
                                        allNum = 0;
                                        //延时时间
                                        var time = 60; 
                                        if (num > 50) {
                                            time = 10;
                                        } else if (num > 10) {
                                            time = 25;
                                        }
                                        var stop = setInterval(function () {
                                            //给所有地雷的class增加一个boom
                                            ff[allNum].classList.add('boom');
                                            allNum++;
                                            if (allNum === ff.length) {
                                                clearInterval(stop);
                                                MyAlert("你失败了!");
                                            }
                                        }, time);
                                    }
                                }                                
                            }

                            if(brother5!=undefined){
                                if(!brother5.classList.contains("open") && brother5.children[1].classList.contains("hide")){
                                    if(brother5.style.background != "white" && brother5.children[0].innerText!='9'){
                                        brother5.classList.add('open');
                                        brother5.style.background = 'white';
                                        brother5.children[0].style.opacity = '1';
                                        brother5.children[1].classList.add('hide');
                                        count++;
                                        IsSuccess(count, row, col, num);
                                        if (brother5.children[0].innerText == '') {
                                            //alert(5);
                                            ShowNoMine(x, y2, row, col);
                                        }
                                    }
                                    else if(brother5.children[0].innerText=='9'){
                                        brother5.classList.add('boom');
                                        load_sound();
                                        zz = 1;
                                        var all = document.querySelectorAll('.col');
                                        var ff = [];
                                        var allNum = 0;
                
                                        for (var i = 0; i < all.length; i++) {
                                            if (all[i].children[0].innerText === '9') {
                                                ff[allNum] = all[i];
                                                allNum++;
                                            }
                                        }
                                        allNum = 0;
                                        //延时时间
                                        var time = 60; 
                                        if (num > 50) {
                                            time = 10;
                                        } else if (num > 10) {
                                            time = 25;
                                        }
                                        var stop = setInterval(function () {
                                            //给所有地雷的class增加一个boom
                                            ff[allNum].classList.add('boom');
                                            allNum++;
                                            if (allNum === ff.length) {
                                                clearInterval(stop);
                                                MyAlert("你失败了!");
                                            }
                                        }, time);
                                    }
                                }                                
                            }

                            if(brother6!=undefined){
                                if(!brother6.classList.contains("open") && brother6.children[1].classList.contains("hide")){
                                    if(brother6.style.background != "white" && brother6.children[0].innerText!='9'){
                                        brother6.classList.add('open');
                                        brother6.style.background = 'white';
                                        brother6.children[0].style.opacity = '1';
                                        brother6.children[1].classList.add('hide');
                                        count++;
                                        IsSuccess(count, row, col, num);
                                        if (brother6.children[0].innerText == '') {
                                            //alert(6);
                                            ShowNoMine(x2, y1, row, col);
                                        }
                                    }
                                    else if(brother6.children[0].innerText=='9'){
                                        brother6.classList.add('boom');
                                        load_sound();
                                        zz = 1;
                                        var all = document.querySelectorAll('.col');
                                        var ff = [];
                                        var allNum = 0;
                
                                        for (var i = 0; i < all.length; i++) {
                                            if (all[i].children[0].innerText === '9') {
                                                ff[allNum] = all[i];
                                                allNum++;
                                            }
                                        }
                                        allNum = 0;
                                        //延时时间
                                        var time = 60; 
                                        if (num > 50) {
                                            time = 10;
                                        } else if (num > 10) {
                                            time = 25;
                                        }
                                        var stop = setInterval(function () {
                                            //给所有地雷的class增加一个boom
                                            ff[allNum].classList.add('boom');
                                            allNum++;
                                            if (allNum === ff.length) {
                                                clearInterval(stop);
                                                MyAlert("你失败了!");
                                            }
                                        }, time);
                                    }
                                }                                
                            }

                            if(brother7!=undefined){
                                if(!brother7.classList.contains("open") && brother7.children[1].classList.contains("hide")){
                                    if(brother7.style.background != "white" && brother7.innerText!='9'){
                                        brother7.classList.add('open');
                                        brother7.style.background = 'white';
                                        brother7.children[0].style.opacity = '1';
                                        brother7.children[1].classList.add('hide');
                                        count++;
                                        IsSuccess(count, row, col, num);
                                        if (brother7.children[0].innerText == '') {
                                            //alert(7);
                                            ShowNoMine(x2, y, row, col);
                                        }
                                    }
                                    else if(brother7.children[0].innerText=='9'){
                                        brother7.classList.add('boom');
                                        load_sound();
                                        zz = 1;
                                        var all = document.querySelectorAll('.col');
                                        var ff = [];
                                        var allNum = 0;
                
                                        for (var i = 0; i < all.length; i++) {
                                            if (all[i].children[0].innerText === '9') {
                                                ff[allNum] = all[i];
                                                allNum++;
                                            }
                                        }
                                        allNum = 0;
                                        //延时时间
                                        var time = 60; 
                                        if (num > 50) {
                                            time = 10;
                                        } else if (num > 10) {
                                            time = 25;
                                        }
                                        var stop = setInterval(function () {
                                            //给所有地雷的class增加一个boom
                                            ff[allNum].classList.add('boom');
                                            allNum++;
                                            if (allNum === ff.length) {
                                                clearInterval(stop);
                                                MyAlert("你失败了!");
                                            }
                                        }, time);
                                    }
                                }        
                            }
                            if(brother8!=undefined){
                                if(!brother8.classList.contains("open") && brother8.children[1].classList.contains("hide")){
                                    if(brother8.style.background != "white" && brother8.innerText!='9'){
                                        brother8.classList.add('open');
                                        brother8.style.background = 'white';
                                        brother8.children[0].style.opacity = '1';
                                        brother8.children[1].classList.add('hide');
                                        count++;
                                        IsSuccess(count, row, col, num);
                                        if (brother8.children[0].innerText == '') {
                                            //alert(8);
                                            ShowNoMine(x2, y2, row, col);
                                        }
                                    }
                                    else if(brother8.children[0].innerText=='9'){
                                        brother8.classList.add('boom');
                                        load_sound();
                                        zz = 1;
                                        var all = document.querySelectorAll('.col');
                                        var ff = [];
                                        var allNum = 0;
                
                                        for (var i = 0; i < all.length; i++) {
                                            if (all[i].children[0].innerText === '9') {
                                                ff[allNum] = all[i];
                                                allNum++;
                                            }
                                        }
                                        allNum = 0;
                                       //延时时间
                                        var time = 60; 
                                        if (num > 50) {
                                            time = 10;
                                        } else if (num > 10) {
                                            time = 25;
                                        }
                                        var stop = setInterval(function () {
                                            //给所有地雷的class增加一个boom
                                            ff[allNum].classList.add('boom');
                                            allNum++;
                                            if (allNum === ff.length) {
                                                clearInterval(stop);
                                                MyAlert("你失败了!");
                                            }
                                        }, time);
                                    }
                                }            
                            }
                        }
                    }
                }
            })
        }


        for (var i = 0; i < r.length; i++) {
            var mineNum = num;
            //绑定鼠标右键
            r[i].addEventListener('contextmenu', function (event) {
                //不执行页面右击事件的默认操作
                event.preventDefault();
                //得到触发事件的按键 0为左键 1为中建 2为右键
                var btnNum = event.button;
                var t = event.target;
                if (t.tagName !== 'DIV') {
                    t = event.target.parentElement;
                }
                if (t.tagName === 'DIV') {
                    //得到img标签
                    var classList = t.children[1].classList;
                    // 已经被点击过的地方不能标记
                    if (classList.contains('hide') && t.style.background !== 'white') {
                        var number = document.querySelector('#number');
                        if (mineNum !== 0) {
                            mineNum--;
                        }
                        number.innerText = `${mineNum}`;
                        classList.remove('hide');
                    } 
                    else if (t.style.background !== 'white' && t.classList.contains('col')) {
                        classList.add('hide');
                        var number = document.querySelector('#number');
                        if (mineNum < num) {
                            mineNum++;
                        }
                        number.innerText = `${mineNum}`;
                    }
                }
            })
        }
    }
    display();
}

//判断是否胜利
function IsSuccess(count, row, col, num){
    //alert(count);
    //alert((col * row) - num);
    if (count === ((col * row) - num)) {
        var game_time=document.getElementById("time");
        game_time=game_time.innerHTML;
        var min=localStorage.getItem("min_time");
        if(game_time<min){
            localStorage.setItem("min_time", game_time);
            console.log(localStorage.getItem("min_time"));
        }

        var all = document.querySelectorAll('.col');
        var allNum = 0;

        var stop = setInterval(function () {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = 210;
            // var b = Math.floor(Math.random() * 256)
            all[allNum].children[0].style.opacity = `0`;
            all[allNum].children[1].style.opacity = '0';
            all[allNum].style.background = `rgba(${r},${g},${b}, 0.6)`;
            allNum++;
            if (allNum === all.length) {
                clearInterval(stop);
                if (zz === 0) {
                    var txt="恭喜您通关了，您的用时为："+game_time; 
                    MyAlert(txt);
                    //Init(row, col, num);
                }
                h=0;
                m=0;
                s=0;
                Init(row, col, num);
            }
        }, 1);
    }
}

//清空地图
function Clear()
{
    var x=document.getElementById("map");
    x.innerHTML="";
}

//弹出对话框
function MyAlert(sentence){
    var x = document.querySelector(".modal-body");
    x.innerHTML = sentence;
    $('#exampleModal').modal('show');
}

function MyAlert1(){
    var x=document.getElementById("col-input");
    x.value="";
    var y=document.getElementById("row-input");
    y.value="";
    var z=document.getElementById("bomb-input");
    z.value="";
    $('#exampleModa2').modal('show');
}

function BeginGame1(){
    h=0;
    m=0;
    s=0;
    var x=document.getElementById("col-input").value;
    var y=document.getElementById("row-input").value;
    var z=document.getElementById("bomb-input").value;

    Init(x, y, z);
}

function load_sound(){
    var myAuto = document.getElementById('myaudio');
    myAuto.play();
}

function BeginGame(){
    var main = document.getElementById("main");
    main.innerHTML=`<div id="main" width="500px" style="border:1px solid #c3c3c3;">
                        <div class="config">
                            <button type="button" name="button" class="level-button">初级</button>
                            <button type="button" name="button" class="level-button">中级</button>
                            <button type="button" name="button" class="level-button">高级</button>
                            <button type="button" name="button" class="level-button" onclick="MyAlert1()">自定义难度</button>
                            </br>
                            </br>
                            <button type="button" name="button" class="restart-button">重新开始</button>
                        </div>
                        <div id="map" style="background-image:url(扫雷-css/扫雷-img/hui.jpg);"></div>
                        <div class="info">
                            <p>
                                剩余雷数:
                                <span id="number"></span>
                                &nbsp;&nbsp;&nbsp;&nbsp;已用时间:
                                <span id="time"></span>s
                                &nbsp;&nbsp;&nbsp;&nbsp;最短用时:
                                <span id="min-time"></span>s
                            </p>
                        </div>
                        <audio src="./扫雷-css/扫雷-音效/boom.wav" id="myaudio" controls="controls" hidden="true">

                        </audio>
                    </div>`;
    if(localStorage.getItem("min_time")==null){
        var local_time=document.getElementById("min-time");
        console.log("local_time");
        local_time.innerHTML="暂无成绩";
    }
    else{
        var local_time=document.getElementById("min-time");
        console.log("local_time");
        local_time.innerHTML=localStorage.getItem("min_time");
    }
    NewGame();
    Init(9, 9, 10);
    
}