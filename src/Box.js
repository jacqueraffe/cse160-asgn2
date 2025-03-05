class Box {
   constructor(width, height, length) {
       this.type = 'box';
       this.color = [1.0, 1.0, 1.0, 1.0];
       this.matrix = new Matrix4();
       this.width = width;
       this.height = height;
       this.length = length;
   }

   render() {
       var rgba = this.color;
       gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

       let w = this.width / 2;
       let h = this.height / 2;
       let l = this.length / 2;

       // xy0 face (z = -l)
       gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
       drawTriangle3D([-w, -h, -l,   w,  h, -l,  -w,  h, -l]);
       drawTriangle3D([-w, -h, -l,   w, -h, -l,   w,  h, -l]);

       // xy1 face (z = +l)
       gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
       drawTriangle3D([ w,  h,  l,  -w, -h,  l,  -w,  h,  l]);
       drawTriangle3D([ w, -h,  l,  -w, -h,  l,   w,  h,  l]);

       // 0yz face (x = -w)
       gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
       drawTriangle3D([-w,  h,  l,  -w, -h, -l,  -w,  h, -l]);
       drawTriangle3D([-w, -h,  l,  -w, -h, -l,  -w,  h,  l]);

       // 1yz face (x = +w)
       gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
       drawTriangle3D([ w, -h, -l,   w,  h,  l,   w,  h, -l]);
       drawTriangle3D([ w, -h, -l,   w, -h,  l,   w,  h,  l]);

       // x0z face (y = -h)
       gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
       drawTriangle3D([ w, -h, -l,  -w, -h, -l,   w, -h,  l]);
       drawTriangle3D([-w, -h, -l,  -w, -h,  l,   w, -h,  l]);

       // x1z face (y = +h)
       gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
       drawTriangle3D([-w,  h,  l,  -w,  h, -l,   w,  h,  l]);
       drawTriangle3D([ w,  h,  l,  -w,  h, -l,   w,  h, -l]);
   }
}
