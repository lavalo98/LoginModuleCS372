const video=document.getElementById("my-video");
const back15=document.getElementById("back15");
const forward15=document.getElementById("forward15");

var player = videojs('my-video');

// When you pass text in options it just creates a control text,
// which is displayed as tooltip when hovered on 
// this button viz the span in you div,

var fullscreen = player.controlBar.getChild("FullscreenToggle")
var index = player.controlBar.children().indexOf(fullscreen)

var myButton = player.controlBar.addChild("button", {}, index);

console.log(player.controlBar.getChild("Heart"))
// There are many functions available for button component 
// like below mentioned in this docs 
// https://docs.videojs.com/button. 
// You can set attributes and clasess as well.

// Getting html DOM
var myButtonDom = myButton.el();
// Since now you have the html dom element 
// you can add click events

// Now I am setting the text as you needed.
myButtonDom.innerHTML = "<span class='pointer'><i class='fa-solid fa-forward'></i></span>";

// Adding a click event function
myButtonDom.onclick = function(){
    forward();
}  

var myButton2 = player.controlBar.addChild("button", {}, index);

console.log(player.controlBar.getChild("Other"))

var myButtonDom2 = myButton2.el();

myButtonDom2.innerHTML = "<span class='pointer'><i class='fa-solid fa-backward'></i></span>";

myButtonDom2.onclick = function(){
    backward();
}  


forward=()=>{
  skip(15);
}

backward=()=>{
   skip(-15);
}

skip=(time)=>{
  video.currentTime=video.currentTime+time;
}