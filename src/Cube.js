class Cube {
   constructor(segments) {
       this.type = 'cube';
       this.color = [1.0, 1.0, 1.0, 1.0];
       this.rotation = Math.random() * 360;
   }

   render() {
      var rgba = this.color;
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
      drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
   }
}
