import {compileShader,getAttribLocation,getUniformLocation} from "../util/shader_util.js";

function OceanShader(gl,NUM_METABALLS){

    this.vertexShader = compileShader(gl,'\n\
    attribute vec2 position;\n\
    \n\
    void main() {\n\
        // position specifies only x and y.\n\
        // We set z to be 0.0, and w to be 1.0\n\
        gl_Position = vec4(position, 0.0, 1.0);\n\
    }\
    ', gl.VERTEX_SHADER);

    this.fragmentShader = compileShader(gl,'\n\
    precision highp float;\n\
    uniform vec3 metaballs[' + NUM_METABALLS + '];\n\
    uniform vec3 ocean_color[4];\n\
    uniform float tt;\n\
    const vec3 BORDER_COLOR=vec3(0.02,0.22,0.48);'+
    'float rand(float n){return fract(sin(n) * 43758.5453123);}\n\
    float rand(vec2 n) { \n\
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n\
    }\n\
    float noise(float p){\n\
        float fl = floor(p);\n\
        float fc = fract(p);\n\
        return mix(rand(fl), rand(fl + 1.0), fc);\n\
    }'+
    'float noise(vec2 n) {\n\
        const vec2 d = vec2(0.0, 1.0);\n\
        vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));\n\
        return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);\n\
    }'+
    'void main(){\n\
        float x = gl_FragCoord.x;\n\
        float y = gl_FragCoord.y;\n\
        float v = 0.0;\n\
        for (int i = 0; i < ' + NUM_METABALLS + '; i++) {\n\
            vec3 mb = metaballs[i];\n\
            float dx = mb.x - x;\n\
            float dy = mb.y - y;\n\
            float r = mb.z;\n\
            v += r*r/(dx*dx + dy*dy);\n\
        }\n\
        v=v*(noise(vec2(x*0.02+tt*0.002,y*0.02+tt*0.002))*.4+.6);\n\
        if(mod(v,0.4)<0.01) gl_FragColor=vec4(BORDER_COLOR,1.0);\n\
        else{\n\
        if (v > 1.0) {'+
            'float step=floor(v/4.0);'+ 
            'float pp=1.0;'+
            'if(step>=3.0) gl_FragColor = vec4(ocean_color[0], 1.0);'+
            'else if(step>=2.0) gl_FragColor = vec4(mix(ocean_color[0],ocean_color[1],pp), 1.0);'+
            'else if(step>=1.0) gl_FragColor = vec4(mix(ocean_color[1],ocean_color[2],pp), 1.0);'+
            'else gl_FragColor = vec4(mix(ocean_color[2],ocean_color[3],pp), 1.0);'+
        '}else{\n\
            gl_FragColor = vec4(ocean_color[3], 1.0);\n\
        }\n\
        }\n\
    }\n\
    ', gl.FRAGMENT_SHADER);

}
OceanShader.prototype.init=function(gl){
    var program = gl.createProgram();
    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    var vertexData = new Float32Array([
        -1.0,  1.0, // top left
        -1.0, -1.0, // bottom left
         1.0,  1.0, // top right
         1.0, -1.0, // bottom right
    ]);
    var vertexDataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    var positionHandle = getAttribLocation(gl,program, 'position');
    gl.enableVertexAttribArray(positionHandle);
    gl.vertexAttribPointer(positionHandle,
                           2, // position is a vec2
                           gl.FLOAT, // each component is a float
                           gl.FALSE, // don't normalize values
                           2 * 4, // two 4 byte float components per vertex
                           0 // offset into each span of vertex data
                           );

    var ocean_color=new Float32Array([
            0.0,0.375,0.62,
            0.08,0.375,0.65,
            0.16,0.52,0.68,
            0.25,0.59,0.72]);
    gl.uniform3fv(getUniformLocation(gl,program, 'ocean_color'), ocean_color);
    

    this.metaballsHandle = getUniformLocation(gl,program, 'metaballs');
    this.ttHandle = getUniformLocation(gl,program, 'tt');
}
OceanShader.prototype.step=function(gl,dataToSendToGPU){

    gl.uniform3fv(this.metaballsHandle, dataToSendToGPU);
    gl.uniform1f(this.ttHandle, performance.now());
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

}

export default OceanShader;