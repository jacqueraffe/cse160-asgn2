//note to grader; used Gemini to make sphere class
/*
used this prompt:
you are an expert WebGL programmer, here is the code for a class that draws a cube:

(cube code here)

Please write similar code to render a unit sphere. Include longitude and latitude parameters for tessellation
*/

// additionally, asked it to turn the triangles counterclockwise and to do shading.

class Sphere {
    constructor(longitudeBands, latitudeBands) {
        this.type = 'sphere';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.longitudeBands = longitudeBands;
        this.latitudeBands = latitudeBands;
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.initSphere();
    }

    initSphere() {
        let vertices = [];
        let normals = [];
        let indices = [];

        for (let latNumber = 0; latNumber <= this.latitudeBands; latNumber++) {
            let theta = latNumber * Math.PI / this.latitudeBands;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= this.longitudeBands; longNumber++) {
                let phi = longNumber * 2 * Math.PI / this.longitudeBands;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = cosPhi * sinTheta;
                let y = sinPhi * sinTheta;
                let z = cosTheta;

                vertices.push(x);
                vertices.push(y);
                vertices.push(z);

                normals.push(x);
                normals.push(y);
                normals.push(z); // For a unit sphere, vertex normal is the same as vertex position
            }
        }

        for (let latNumber = 0; latNumber < this.latitudeBands; latNumber++) {
            for (let longNumber = 0; longNumber < this.longitudeBands; longNumber++) {
                let first = (latNumber * (this.longitudeBands + 1)) + longNumber;
                let second = first + this.longitudeBands + 1;

                indices.push(first);
                indices.push(first + 1); // Swapped order for counter-clockwise
                indices.push(second);      // Swapped order for counter-clockwise

                indices.push(first + 1); // Swapped order for counter-clockwise
                indices.push(second + 1);
                indices.push(second);      // Swapped order for counter-clockwise
            }
        }
        this.indexedVertices = [];
        this.indexedNormals = [];
        for (let i = 0; i < indices.length; i++) {
            let index = indices[i];
            this.indexedVertices.push(vertices[index * 3]);
            this.indexedVertices.push(vertices[index * 3 + 1]);
            this.indexedVertices.push(vertices[index * 3 + 2]);
            this.indexedNormals.push(normals[index * 3]);
            this.indexedNormals.push(normals[index * 3 + 1]);
            this.indexedNormals.push(normals[index * 3 + 2]);
        }
    }


    render() {
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        for (let i = 0; i < this.indexedVertices.length; i += 9) {
            let v1 = [this.indexedVertices[i], this.indexedVertices[i+1], this.indexedVertices[i+2]];
            let v2 = [this.indexedVertices[i+3], this.indexedVertices[i+4], this.indexedVertices[i+5]];
            let v3 = [this.indexedVertices[i+6], this.indexedVertices[i+7], this.indexedVertices[i+8]];

            // Calculate face normal (for flat shading)
            let normal = this.calculateFaceNormal(v1, v2, v3);
            let shadingFactor = Math.max(0.0, normal[2]); // Simple shading based on Z component of normal
            let rgba = this.color.map(c => c * shadingFactor);

            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
            drawTriangle3D([
                v1[0], v1[1], v1[2],
                v2[0], v2[1], v2[2],
                v3[0], v3[1], v3[2]
            ]);
        }
    }

    calculateFaceNormal(v1, v2, v3) {
        let a = subtractVectors(v2, v1);
        let b = subtractVectors(v3, v1);
        let normal = crossProduct(a, b);
        return normalizeVector(normal);
    }
}

// Helper vector functions (you might already have these or similar)
function subtractVectors(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

function crossProduct(v1, v2) {
    return [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0]
    ];
}

function normalizeVector(v) {
    let length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (length > 0) {
        return [v[0] / length, v[1] / length, v[2] / length];
    } else {
        return [0, 0, 0]; // Avoid division by zero
    }
}
