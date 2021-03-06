var context;
var bufferLoader;
var myBufferList;
var soundMap = {};
var loops = {};
var names = ["explore_kick_1","explore_kick_2","explore_kick_3","Air_funk","Caddy_ki","Doggiek","fatkick","Glitch Kick","kick_FSMH","Ohiokic","explore_clap","explore_snap1","explore_snap2","explore_snare1","explore_snare2","explore_snare3","BALTIMOR","Newerks","s2","s3","sn1","snr_FSMH","tightsnare","clap","explore_chop","chop1","chop2","chop4","stab62","Sound192","chimes","FX9","explore_fx","wheeee_fx","explore_perc","zap1","hih1","hih2","hh1","hh2","crash","crash1","airhorn","ironside","another-one","100","hah","hey!","haaahn","milli","montana","shout","scream1","[VOX] wooh","[VOX] Perfect"];
var soundBank = ["sounds/explore_kick_1.mp3","sounds/explore_kick_2.mp3","sounds/explore_kick_3.mp3","sounds/Air_funk.mp3","sounds/Caddy_ki.mp3","sounds/Doggiek.mp3","sounds/fatkick.mp3","sounds/Glitch_Hop_Kick05.mp3","sounds/(Kick) FSMH1.mp3","sounds/Ohiokic.mp3","sounds/explore_clap.mp3","sounds/explore_snap1.mp3","sounds/explore_snap2.mp3","sounds/explore_snare1.mp3","sounds/explore_snare2.mp3","sounds/explore_snare3.mp3","sounds/BALTIMOR.mp3","sounds/Newerks.mp3","sounds/s2.mp3","sounds/s3.mp3","sounds/sn1.mp3","sounds/[Snr] BEAUTIFUL MORNIN.mp3","sounds/tightsnare.mp3","sounds/clap.mp3","sounds/explore_chop.mp3","sounds/chop1.mp3","sounds/chop2.mp3","sounds/chop4.mp3","sounds/Misc_Stabs_62.mp3","sounds/Sound192.mp3","sounds/chimes.mp3","sounds/FX9.mp3","sounds/explore_fx.mp3","sounds/whee_fx.mp3","sounds/explore_perc.mp3","sounds/zap1.mp3","sounds/hih1.mp3","sounds/hih2.mp3","sounds/hh1.mp3","sounds/hh2.mp3","sounds/crash.mp3","sounds/crash1.mp3","sounds/airhorn.mp3","sounds/ironside.mp3","sounds/another-one.mp3","sounds/100.mp3","sounds/hah.mp3","sounds/hey.mp3","sounds/haan.mp3","sounds/milli.mp3","sounds/montana.mp3","sounds/shout.mp3","sounds/scream1.mp3","sounds/[VOX] BBB4U Quickie.mp3","sounds/[VOX] Perfect.mp3","sounds/loop_calabria.mp3","sounds/loop_hats.mp3","sounds/loop_crowd.mp3","sounds/loop_sango.mp3"];
var buttonNames = ['one','two','three','four','five'];
var buttonList = [1,2,3,4,5];
var keyList = [49,50,51,52,53];

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

window.onload = init;

function init() {
  context = new (window.AudioContext || window.webkitAudioContext)();
  bufferLoader = new BufferLoader(context,soundBank,finishedLoading);
  bufferLoader.load();

  window.addEventListener("keydown",function(event) {
    var key = event.keyCode;
    if(isValidKey(key)) onKeyDown(key);
  });
  window.addEventListener("keyup",function(event) {
    var key = event.keyCode;
    if(isValidKey(key)) onKeyUp(key);
  });
}

function finishedLoading(bufferList) {
  myBufferList = bufferList;
  setupButtons();
  setupLists();
  setupDrag();
  showSounds();
  setupLoops();
}

function changeSound(number, soundName) {
  if(soundMap[number].playing) { //if sound is already playing 
    soundMap[number].stop(); //stop it before creating and playing the new buffer
  }

  var idx = names.indexOf(soundName);
  soundMap[number].buffer = myBufferList[idx];

  // var button = document.getElementById(""+buttonList[number]);
  // button.style.backgroundColor = "rgba(0,230,255,0.85)";
  // button.className = 'loaded';

  var labels = document.querySelectorAll('.padLabel > span');
  labels[number].innerHTML = soundName;
}

function onKeyUp(key) {
  var number = keyList.indexOf(key);
  if(soundMap[number].buffer != undefined) {
    soundMap[number].can_trigger = true;
    var button = document.getElementById(""+buttonList[number]);
    // button.style.backgroundColor = "rgba(0,230,255,0.85)";
    // button.style.color = "black";
    button.className = 'loadedPad';
  }
}

function onKeyDown(key) {
  var number = keyList.indexOf(key);
  if(soundMap[number].buffer != undefined) {
    if(soundMap[number].can_trigger) {
      var button = document.getElementById(""+buttonList[number]);
      play(number);
      // button.style.backgroundColor = "rgba(0,170,200,0.7)";
      // button.style.color = "rgba(0,230,255,0.6)"; //visual 'press' effect
      button.className = 'activePad';
    }
  }
}

function toggleLoop(number) {
  var curr_loop = document.getElementById('loop'+(number+1));
  if(loops[number].playing) { //if loop is playing 
    loops[number].stop(); //stop it
    curr_loop.className = "";
  }
  else {
    loops[number].play(true);
    curr_loop.className = "activeLoop";
  }
}

function play(number) {
  if(soundMap[number].playing) { //if sound is already playing 
    soundMap[number].stop(); //stop it before creating and playing the new buffer
  }
  soundMap[number].playing = true;
  soundMap[number].can_trigger = false;
  soundMap[number].play();
}

function isValidKey(key) {
  var idx = keyList.indexOf(key);
  return idx >= 0;
}

function Sound(sound,buffer,rate,playing,can_trigger) {
  this.sound = sound;
  this.buffer = buffer;
  this.rate = rate;
  this.playing = playing;
  this.can_trigger = can_trigger;
}

Sound.prototype.play = function(loop) {
  this.playing = true;
  this.sound = context.createBufferSource();
  this.sound.buffer = this.buffer;
  this.sound.connect(context.destination);
  this.sound.loop = loop;
  this.sound.start(0);
}

Sound.prototype.stop = function() {
  this.playing = false;
  this.sound.disconnect(context.destination);
}

function setupLoops() {
  for(var i = 0; i < 4; i++) {
    loops[i] = new Sound(null,myBufferList[myBufferList.length-1-i],1.0,false,true);
  }
  var loops_div = document.getElementById('loops');
  var display_loops = document.getElementById('loops_wrapper');
  var loading = document.getElementById('loading_loops');
  loops_div.removeChild(loading);
  display_loops.style.display = "flex";
}

function setupButtons() {
  for(var i = 0; i < 5; i++) {
    soundMap[i] = new Sound(null,null,1.0,false,true);
  }
}

function showSounds() {
  var wrapper = document.getElementById('sounds_wrapper');
  var sounds = document.getElementById('sounds');
  var loading = document.getElementById('loading_sounds');
  wrapper.removeChild(loading);
  sounds.style.display = "flex";
}

function setupLists() {
  var list = document.getElementById('sounds');
  for(var j = 0; j < names.length; j++) {
    var soundLabel = document.createElement("li");
    soundLabel.innerHTML = names[j];
    soundLabel.id = names[j];
    soundLabel.setAttribute('draggable', 'true');
    
    soundLabel.addEventListener('dragstart', handleDragStart, false);
    soundLabel.addEventListener('dragenter', handleDragEnter, false);
    list.appendChild(soundLabel);
  }
}

function setupDrag() {
  var pads = document.querySelectorAll('#mpc button');
  for(var i = 0; i < pads.length; i++) {
    var pad = pads[i];
    pad.addEventListener('dragover', handleDragOver, false);
    pad.addEventListener('dragleave', handleDragLeave, false);
    pad.addEventListener('drop', handleDrop, false);
  }
}

function handleDragStart(e) {
  e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
  e.dataTransfer.setData('Text', this.id);
}

function handleDragOver(e) {
  e.preventDefault(); // allows us to drop
  this.className = 'dragoverPad';
  e.dataTransfer.dropEffect = 'copy';
  return false;
}

// to get IE to work
function handleDragEnter() {
  return false;
}

function handleDragLeave() {
  var undef = soundMap[this.id-1].buffer != undefined;
  this.className = undef ? 'loadedPad' : '';
}

function handleDrop(e) {
  // this.style.backgroundColor = "rgba(0,230,255,0.85)";
  this.className = 'loadedPad';
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  if (!e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
  var el = document.getElementById(e.dataTransfer.getData('Text'));
  changeSound(this.id-1, el.id);
}

/*

ideas:

maschine-style sound editor window (AnalyserNode to display waveforms?)
add volume sliders
effects rack?
re-design to make it look nicer
better button presses
iOS capable

*/