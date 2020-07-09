export const NUM_METABALLS=18;
export const vs=`
    varying vec2 vUv;
    void main(){
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;

    }`;

export const fs=`
    precision highp float;
    uniform vec3 metaballs[` + NUM_METABALLS + `];
    uniform vec3 ocean_color[4];
    uniform float tt;
    uniform sampler2D mask;
    uniform float width;
    uniform float height;
    varying vec2 vUv;
    const vec3 BORDER_COLOR=vec3(0.02,0.22,0.48);
    float rand(float n){return fract(sin(n) * 43758.5453123);}
    float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(float p){
        float fl = floor(p);
        float fc = fract(p);
        return mix(rand(fl), rand(fl + 1.0), fc);
    }
    float noise(vec2 n) {
        const vec2 d = vec2(0.0, 1.0);
        vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
        return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
    }
    void main(){
        float x=vUv.x;
        float y=vUv.y;
        float ratio=width/height;
        float mx=(vUv.x-.5)*ratio+.5;
        float my=vUv.y;
        vec4 mask_=texture2D(mask,vec2(mx,my));
        // gl_FragColor=mask_;
        float v = 0.0;
        for (int i = 0; i < ` + NUM_METABALLS + `; i++) {
            vec3 mb = metaballs[i];
            float dx = mb.x - x;
            float dy = mb.y - y;
            float r = mb.z;
            v += r*r/(dx*dx + dy*dy);
        }
        v=v*(noise(vec2(x*0.02+tt*0.002,y*0.02+tt*0.002))*.4+.6);
        if(mod(v,0.4)<0.01) gl_FragColor=vec4(BORDER_COLOR,1.0);
        else{
            if (v > 1.0) {
                float step=floor(v/4.0);
                float pp=1.0;
                if(step>=3.0) gl_FragColor = vec4(ocean_color[0], 1.0);
                else if(step>=2.0) gl_FragColor = vec4(mix(ocean_color[0],ocean_color[1],pp), 1.0);
                else if(step>=1.0) gl_FragColor = vec4(mix(ocean_color[1],ocean_color[2],pp), 1.0);
                else{
                    // gl_FragColor = vec4(mix(ocean_color[2],ocean_color[3],pp), 1.0);  
                    if(length(mask_.rgb)>1.0){
                        gl_FragColor=vec4(1.0,0.0,0.0,1.0);
                    }else{
                        gl_FragColor = vec4(ocean_color[3], 1.0);
                    }
                } 
            }else{
                if(length(mask_.rgb)>1.0){
                    gl_FragColor=vec4(1.0,0.0,0.0,1.0);
                }else{
                    gl_FragColor = vec4(ocean_color[3], 1.0);
                }
            }
        }
    }
    `;