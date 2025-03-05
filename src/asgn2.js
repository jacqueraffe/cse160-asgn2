// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
// Name: Jacqueline Palevich
// Student email: japalevi@ucsc.edu
// 


// NOTE FOR GRADER:
// # cse160-asgn1
// heavily referenced video playlist.

// Awesomeness:
// I added a garden brushes. So there is a flower and grass brush to use. The grass is always green and draws straight downwards. The flower has four petals, and you can change the colors of the petals, but the center is always yellow.


var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix*u_ModelMatrix*a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`
  
//Global Vars
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
}

function connectVariablesToGLSL(){
   // Initialize shaders
   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
 a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
 u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  
}

let g_globalAngle = 0;
let g_debugAngle = 0;
let g_legBendAngle = 0; // use for leg floating animation
let g_yellowAnimation = false;

function addActionForHtmlUI(){
  document.getElementById("animationYellowOffButton").onclick = function(){g_yellowAnimation = false;}
  document.getElementById("animationYellowOnButton").onclick = function(){g_yellowAnimation = true;}

  document.getElementById("angleSlide").addEventListener("mousemove", function() {g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById("legBendSlide").addEventListener("mousemove", function() {g_legBendAngle = this.value; renderAllShapes(); });
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionForHtmlUI();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  console.log(g_seconds);
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}

function updateAnimationAngles(){
  if(g_yellowAnimation){
    g_legBendAngle = 45*Math.sin(g_seconds);
  }
}

function renderAllShapes(){
  // Clear <canvas>
  var startTime = performance.now();
  
  var globalRotMat  = new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.enable(gl.DEPTH_TEST);
  
  var body = new Box(0.5, 0.3, 0.25);
  body.color = [170/256, 100/256, 50/256, 1.0];
  body.matrix.rotate(-20, 1, 35, 1);
  body.matrix.translate(0, -0.35, 0, 0);
  var base = new Matrix4(body.matrix);
  body.render();
  
  var head = new Sphere(20,20);
  head.matrix = new Matrix4(base);
  head.color = [160/256, 90/256, 40/256, 1.0];
  head.matrix.scale(0.17, 0.13, 0.14);
  head.matrix.translate(-1.2, 2, -0.5, 0);
  head.matrix.rotate(30, 0, 1, 0);
  head.render();
  
  var leftEar = new Sphere(20,20, head);
  leftEar.startLongitude = 0;
  leftEar.endLongitude = Math.PI;
  leftEar.initSphere();
  leftEar.color = [160/256, 90/256, 40/256, 1.0];
  leftEar.matrix.scale(0.3, 0.3, 0.3);
  leftEar.matrix.translate(4, -2, -1, 0);
  leftEar.matrix.rotate(90, 1, 0, 0);
  gl.cullFace(gl.FRONT);
  leftEar.color = [255/256, 190/256, 203/256, 1.0];
  leftEar.render();
  gl.cullFace(gl.BACK);
  gl.disable(gl.CULL_FACE);
  leftEar.matrix.scale(1.2, 1.2, 1.2);
  leftEar.color = [160/256, 90/256, 40/256, 1.0];
  leftEar.render();
  gl.enable(gl.CULL_FACE);
  
  var rightEar = new Sphere(20,20, head);
  rightEar.startLongitude = 0;
  rightEar.endLongitude = Math.PI;
  rightEar.initSphere();
  rightEar.color = [160/256, 90/256, 40/256, 1.0];
  rightEar.matrix.scale(0.3, 0.3, 0.3);
  rightEar.matrix.translate(-4, -2, -1, 0);
  rightEar.matrix.rotate(90, 1, 0, 0);
  gl.cullFace(gl.FRONT);
  rightEar.color = [255/256, 190/256, 203/256, 1.0];
  rightEar.render();
  gl.cullFace(gl.BACK);
  gl.disable(gl.CULL_FACE);
  rightEar.matrix.scale(1.2, 1.2, 1.2);
  rightEar.color = [160/256, 90/256, 40/256, 1.0];
  rightEar.render();
  gl.enable(gl.CULL_FACE);

  var rightEye = new Sphere(20,20, head);
  rightEye.color =  [10/256, 10/256, 10/256, 1.0];
  rightEye.matrix.scale(0.175, 0.175, 0.175);
  rightEye.matrix.translate(3.5, -2, -4, 0);
  rightEye.render();
  var rightEyeSparkle = new Sphere(20,20, rightEye);
  rightEyeSparkle.color =  [1, 1, 1, 1.0];
  rightEyeSparkle.matrix.scale(0.175, 0.175, 0.175);
  rightEyeSparkle.matrix.translate(3.5, -1, -5, 0);
  rightEyeSparkle.render();
  
  var leftEye = new Sphere(20,20, head);
  leftEye.color =  [10/256, 10/256, 10/256, 1.0];
  leftEye.matrix.scale(0.175, 0.175, 0.175);
  leftEye.matrix.translate(-4.1, -1.9, -4, 0);
  leftEye.render();
  
  var leftEyeSparkle = new Sphere(20,20, leftEye);
  leftEyeSparkle.color =  [1, 1, 1, 1.0];
  leftEyeSparkle.matrix.scale(0.175, 0.175, 0.175);
  leftEyeSparkle.matrix.translate(-3, 0, -5, 0);
  leftEyeSparkle.render();
  
  var snoutUpper = new Sphere(10, 10, head);
  snoutUpper.color =  [190/256, 110/256, 70/256, 1.0];
  snoutUpper.matrix.scale(1.1, 0.5, 0.55);
  snoutUpper.matrix.translate(0, -1.75, -1.5, 0);
  snoutUpper.render();
  
  var snoutLower = new Sphere(10, 10, snoutUpper);
  snoutLower.color =  [125/256, 65/256, 45/256, 1.0];
  snoutLower.matrix.scale(0.8, 0.8, 0.8);
  snoutLower.matrix.translate(0, -0.5, 0, 0);
  snoutLower.render();

// Front Left
var frontLeftUpperLeg = new Box(0.05, 0.15, 0.05);
frontLeftUpperLeg.matrix = new Matrix4(base);
frontLeftUpperLeg.color = [170/256, 100/256, 50/256, 1.0];
frontLeftUpperLeg.matrix.translate(-0.22, -0.225, -0.1, 0);
rotateHelper(frontLeftUpperLeg.matrix, 0, 0.0725, 0, -g_legBendAngle, 0, 0, 1);
frontLeftUpperLeg.render();

var frontLeftBottomLeg = new Box(0.05, 0.15, 0.05);
frontLeftBottomLeg.matrix = new Matrix4(frontLeftUpperLeg.matrix);
frontLeftBottomLeg.color = [170/256, 100/256, 50/256, 1.0];
frontLeftBottomLeg.matrix.translate(0, -0.15, 0, 0);
rotateHelper(frontLeftBottomLeg.matrix, 0, 0.0725, 0, 2*g_legBendAngle, 0, 0, 1);
frontLeftBottomLeg.render();

var frontLeftHoof = new Box(0.05, 0.05, 0.05);
frontLeftHoof.matrix = new Matrix4(frontLeftBottomLeg.matrix);
frontLeftHoof.color = [150/256, 150/256, 150/256, 1.0];
frontLeftHoof.matrix.translate(0, -0.1, 0, 0);
rotateHelper(frontLeftHoof.matrix, 0, 0.025, 0, g_legBendAngle, 0, 0, 1);
frontLeftHoof.render();

// Front Right
var frontRightUpperLeg = new Box(0.05, 0.15, 0.05);
frontRightUpperLeg.matrix = new Matrix4(base);
frontRightUpperLeg.color = [170/256, 100/256, 50/256, 1.0];
frontRightUpperLeg.matrix.translate(-0.22, -0.225, 0.1, 0);
rotateHelper(frontRightUpperLeg.matrix, 0, 0.0725, 0, -0.8*g_legBendAngle, 0, 0, 1);
frontRightUpperLeg.render();

var frontRightBottomLeg = new Box(0.05, 0.15, 0.05);
frontRightBottomLeg.matrix = new Matrix4(frontRightUpperLeg.matrix);
frontRightBottomLeg.color = [170/256, 100/256, 50/256, 1.0];
frontRightBottomLeg.matrix.translate(0, -0.15, 0, 0);
rotateHelper(frontRightBottomLeg.matrix, 0, 0.0725, 0, 1.6*g_legBendAngle, 0, 0, 1);
frontRightBottomLeg.render();

var frontRightHoof = new Box(0.05, 0.05, 0.05);
frontRightHoof.matrix = new Matrix4(frontRightBottomLeg.matrix);
frontRightHoof.color = [150/256, 150/256, 150/256, 1.0];
frontRightHoof.matrix.translate(0, -0.1, 0, 0);
rotateHelper(frontRightHoof.matrix, 0, 0.025, 0, 0.8*g_legBendAngle, 0, 0, 1);
frontRightHoof.render();

// Back Left
var backLeftUpperLeg = new Box(0.05, 0.15, 0.05);
backLeftUpperLeg.matrix = new Matrix4(base);
backLeftUpperLeg.color = [170/256, 100/256, 50/256, 1.0];
backLeftUpperLeg.matrix.translate(0.22, -0.225, -0.1, 0);
rotateHelper(backLeftUpperLeg.matrix, 0, 0.0725, 0, -g_legBendAngle, 0, 0, 1);
backLeftUpperLeg.render();

var backLeftBottomLeg = new Box(0.05, 0.15, 0.05);
backLeftBottomLeg.matrix = new Matrix4(backLeftUpperLeg.matrix);
backLeftBottomLeg.color = [170/256, 100/256, 50/256, 1.0];
backLeftBottomLeg.matrix.translate(0, -0.15, 0, 0);
rotateHelper(backLeftBottomLeg.matrix, 0, 0.0725, 0, 2*g_legBendAngle, 0, 0, 1);
backLeftBottomLeg.render();

var backLeftHoof = new Box(0.05, 0.05, 0.05);
backLeftHoof.matrix = new Matrix4(backLeftBottomLeg.matrix);
backLeftHoof.color = [150/256, 150/256, 150/256, 1.0];
backLeftHoof.matrix.translate(0, -0.1, 0, 0);
rotateHelper(backLeftHoof.matrix, 0, 0.025, 0, g_legBendAngle, 0, 0, 1);
backLeftHoof.render();

// Back Right
var backRightUpperLeg = new Box(0.05, 0.15, 0.05);
backRightUpperLeg.matrix = new Matrix4(base);
backRightUpperLeg.color = [170/256, 100/256, 50/256, 1.0];
backRightUpperLeg.matrix.translate(0.22, -0.225, 0.1, 0);
rotateHelper(backRightUpperLeg.matrix, 0, 0.0725, 0, -0.8*g_legBendAngle, 0, 0, 1);
backRightUpperLeg.render();

var backRightBottomLeg = new Box(0.05, 0.15, 0.05);
backRightBottomLeg.matrix = new Matrix4(backRightUpperLeg.matrix);
backRightBottomLeg.color = [170/256, 100/256, 50/256, 1.0];
backRightBottomLeg.matrix.translate(0, -0.15, 0, 0);
rotateHelper(backRightBottomLeg.matrix, 0, 0.0725, 0, 1.6*g_legBendAngle, 0, 0, 1);
backRightBottomLeg.render();

var backRightHoof = new Box(0.05, 0.05, 0.05);
backRightHoof.matrix = new Matrix4(backRightBottomLeg.matrix);
backRightHoof.color = [150/256, 150/256, 150/256, 1.0];
backRightHoof.matrix.translate(0, -0.1, 0, 0);
rotateHelper(backRightHoof.matrix, 0, 0.025, 0, 0.8*g_legBendAngle, 0, 0, 1);
backRightHoof.render();




  
  var duration = performance.now() - startTime;
  sendTextToHTML( " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");

}

function rotateHelper(matrix, tx, ty, tz, angle, ax, ay, az){
  matrix.translate(tx, ty, tz);
  matrix.rotate(angle, ax, ay, az);
  matrix.translate(-tx, -ty, -tz);
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
