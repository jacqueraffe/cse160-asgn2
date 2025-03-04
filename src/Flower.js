class Flower {
    constructor() {
        this.type = 'flower';
        this.position = [0.0, 0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }
 
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, size);
        var d = this.size/200.0;

        var centerPt = [xy[0], xy[1]];
        
        var angle1 = 0;
        var angle2 = 45;
        var vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
        var vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
        var pt1  = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
        var pt2  = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
        drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
        var angle1 = 90;
        var angle2 = 135;
        var vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
        var vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
        var pt1  = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
        var pt2  = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
        drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
        var angle1 = 180;
        var angle2 = 225;
        var vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
        var vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
        var pt1  = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
        var pt2  = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
        drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
        var angle1 = 270;
        var angle2 = 315;
        var vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
        var vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
        var pt1  = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
        var pt2  = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
        drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );

        gl.disableVertexAttribArray(a_Position);
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0);
        gl.uniform1f(u_Size, size/2);
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
 }
 
 function drawTriangle(vertices) {
    var n = 3;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
 
    gl.enableVertexAttribArray(a_Position);
 
    gl.drawArrays(gl.TRIANGLES, 0, n);
 }
 