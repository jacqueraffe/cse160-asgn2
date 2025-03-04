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
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;

function addActionForHtmlUI(){
  document.getElementById("animationYellowOffButton").onclick = function(){g_yellowAnimation = false;}
  document.getElementById("animationYellowOnButton").onclick = function(){g_yellowAnimation = true;}

  document.getElementById("angleSlide").addEventListener("mousemove", function() {g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById("yellowSlide").addEventListener("mousemove", function() {g_yellowAngle = this.value; renderAllShapes(); });
  document.getElementById("magentaSlide").addEventListener("mousemove", function() {g_magentaAngle = this.value; renderAllShapes(); });

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
    g_yellowAngle = 45*Math.sin(g_seconds);
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
  
  
  var head = new Sphere(40,40);
  head.color = [222/256, 184/256, 135/256, 1.0];
  head.matrix.scale(0.2, 0.1, 0.1);
  head.matrix.translate(-2, 2, 0, 2);
  head.render();
  
var body = new Cube();
body.color = [222/256, 184/256, 135/256, 1.0];
body.matrix.rotate(-10, 1, 15, 1);
body.matrix.scale(0.5, 0.3, 0.3);
body.render();

var frontLeftLeg = new Cube();
frontLeftLeg.color = [222/256, 184/256, 135/256, 1.0];
frontLeftLeg.matrix.rotate(-10, 1, 15, 1);
frontLeftLeg.matrix.scale(0.05, 0.3, 0.05);
frontLeftLeg.matrix.translate(0, -1.0, 0.0, 0);
frontLeftLeg.render();

var frontRightLeg = new Cube();
frontRightLeg.color = [222/256, 184/256, 135/256, 1.0];
frontRightLeg.matrix.rotate(-10, 1, 15, 1);
frontRightLeg.matrix.scale(0.05, 0.3, 0.05);
frontRightLeg.matrix.translate(0, -1.0, 5.0, 0);
frontRightLeg.render();
  
var backLeftLeg = new Cube();
backLeftLeg.color = [222/256, 184/256, 135/256, 1.0];
backLeftLeg.matrix.rotate(-10, 1, 15, 1);
backLeftLeg.matrix.scale(0.05, 0.3, 0.05);
backLeftLeg.matrix.translate(9, -1.0, 0.0, 0);
backLeftLeg.render();

var backRightLeg = new Cube();
backRightLeg.color = [222/256, 184/256, 135/256, 1.0];
backRightLeg.matrix.rotate(-10, 1, 15, 1);
backRightLeg.matrix.scale(0.05, 0.3, 0.05);
backRightLeg.matrix.translate(9, -1.0, 5.0, 0);
backRightLeg.render();
  
  var duration = performance.now() - startTime;
  sendTextToHTML( " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");

}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
