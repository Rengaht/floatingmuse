import {compileShader,getAttribLocation} from "../util/shader_util.js";

function WaveShader(gl){
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
	uniform sampler2D waveTexture;\n\
	uniform sampler2D textTexture;\n\
	\n\
	void main(){\n\
		float x = gl_FragCoord.x;\n\
        float y = gl_FragCoord.y;\n\
        vec4 tex=texture2D(waveTexture,gl_FragCoord.xy);\n\
        float vx=-(tex.r*.2-.1);\n\
        float vy=-(tex.g*.2-.1);\n\
		float intensity=-tex.b;\n\
		float maxAmp=0.2;\n\
		//x+=vx*intensity*maxAmp;\n\
		//y+=vy*intensity*maxAmp;\n\
		gl_FragColor=texture2D(textTexture,vec2(x,y));\n\
    }', gl.FRAGMENT_SHADER);
}
WaveShader.prototype.init=function(gl){
	var program = gl.createProgram();
    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    this.program=program;

    var vertexData = new Float32Array([
        1.0,  1.0,
		-1.0,  1.0,
		1.0, -1.0,
		-1.0, -1.0,
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

	// var waveTextureLocation=gl.getUniformLocation(program, "waveTexture");
	// var textTextureLocation=gl.getUniformLocation(program, "textTexture");

	// gl.uniform1i(waveTextureLocation, 0);  // texture unit 0
	// gl.uniform1i(textTextureLocation, 1);
}
WaveShader.prototype.step=function(gl,canvas_wave,canvas_text){
	
	// gl.activeTexture(gl.TEXTURE0);
	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,gl.RGB, gl.UNSIGNED_BYTE, canvas_wave);

	// gl.activeTexture(gl.TEXTURE1);
	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,gl.RGB, gl.UNSIGNED_BYTE, canvas_text);

	this.setupTexture(gl,canvas_wave,0,this.program,'waveTexture');
	this.setupTexture(gl,canvas_text,0,this.program,'textTexture');
	// canvas_wave;
	// canvas_text;
}
WaveShader.prototype.draw=function(gl){
	gl.clearDepth(1.0); 
	// console.log('wave shader step!');
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
WaveShader.prototype.setupTexture=function(gl,canvas, textureUnit, program, uniformName) {
   var tex = gl.createTexture();

   this.updateTextureFromCanvas(gl,tex, canvas, textureUnit);

   // Set the parameters so we can render any size image.
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

   var location = gl.getUniformLocation(this.program, uniformName);
   gl.uniform1i(location, textureUnit);
}

WaveShader.prototype.updateTextureFromCanvas=function(gl,tex, canvas, textureUnit) {
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
}

export default WaveShader;