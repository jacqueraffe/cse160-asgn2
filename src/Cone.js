
//Note to grader, used Gemini with prompt : write something similar to write a parameterized frustum cone (gave it cube class)
// and then the cone is inside out, draw the triangles counterclockwise, Also, make the cone with y as the up direction.

class Cone {
   constructor(topRadius, bottomRadius, height, segments) {
       this.type = 'Cone';
       this.color = [1.0, 1.0, 1.0, 1.0];
       this.matrix = new Matrix4();
       this.topRadius = topRadius;
       this.bottomRadius = bottomRadius;
       this.height = height;
       this.segments = segments;
   }

   render() {
       var rgba = this.color;
       gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

       let topRadius = this.topRadius;
       let bottomRadius = this.bottomRadius;
       let height = this.height;
       let segments = this.segments;

       // Generate vertices for the frustum cone with Y-axis as up
       let vertices = [];

       // Top cap vertices (centered at y = height/2)
       for (let i = 0; i < segments; i++) {
           let angle = (i / segments) * 2 * Math.PI;
           let x = topRadius * Math.cos(angle);
           let z = topRadius * Math.sin(angle);
           vertices.push([x, height / 2, z]); // Y is up, height along Y
       }

       // Bottom cap vertices (centered at y = -height/2)
       for (let i = 0; i < segments; i++) {
           let angle = (i / segments) * 2 * Math.PI;
           let x = bottomRadius * Math.cos(angle);
           let z = bottomRadius * Math.sin(angle);
           vertices.push([x, -height / 2, z]); // Y is up, height along Y
       }

       // Draw top cap (triangle fan) - Counterclockwise winding
       gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]); // Top cap color
       let topCenter = [0, height / 2, 0]; // Y-axis up center
       for (let i = 0; i < segments; i++) {
           let v1 = vertices[i];
           let v2 = vertices[(i + 1) % segments];
           drawTriangle3D([
               topCenter[0], topCenter[1], topCenter[2],
               v2[0], v2[1], v2[2], // Swapped v1 and v2 for counterclockwise
               v1[0], v1[1], v1[2]
           ]);
       }

       // Draw bottom cap (triangle fan) - Counterclockwise winding
       gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]); // Bottom cap color
       let bottomCenter = [0, -height / 2, 0]; // Y-axis up center
       for (let i = 0; i < segments; i++) {
           let v1 = vertices[segments + i];
           let v2 = vertices[segments + (i + 1) % segments];
           drawTriangle3D([
               bottomCenter[0], bottomCenter[1], bottomCenter[2],
               v1[0], v1[1], v1[2],
               v2[0], v2[1], v2[2]
           ]);
       }


       // Draw side faces (quads, each split into two triangles) - Counterclockwise winding
       gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]); // Side color
       for (let i = 0; i < segments; i++) {
           let top_v1 = vertices[i];
           let top_v2 = vertices[(i + 1) % segments];
           let bottom_v1 = vertices[segments + i];
           let bottom_v2 = vertices[segments + (i + 1) % segments];

           // First triangle of the quad
           drawTriangle3D([
               top_v1[0], top_v1[1], top_v1[2],
               top_v2[0], top_v2[1], top_v2[2],
               bottom_v1[0], bottom_v1[1], bottom_v1[2] // Corrected order
           ]);
           // Second triangle of the quad
           drawTriangle3D([
               top_v2[0], top_v2[1], top_v2[2],
               bottom_v2[0], bottom_v2[1], bottom_v2[2],
               bottom_v1[0], bottom_v1[1], bottom_v1[2] // Corrected order
           ]);
       }
   }
}
