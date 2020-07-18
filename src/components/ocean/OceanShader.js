export const NUM_METABALLS=22;
export const NUM_METABALLS_TW=5;

export const IslandPortion=0.85;
export const IslandCenter=0.55;

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
    uniform float width;
    uniform float height;
    uniform float layer;
    uniform float roi_pos_x;
    uniform float roi_pos_y;
    uniform float roi_size_x;
    uniform float roi_size_y;
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
    vec2 mapCoord(vec2 p){
        float ratio=width/height;
        float rx=(p.x-.5)*ratio*roi_size_x+((roi_pos_x-.5)*ratio+.5);
        float ry=-(p.y-.5)*roi_size_y+roi_pos_y;

        return vec2(rx,ry);
    }
    void main(){
        float ratio=width/height;
        vec2 p=mapCoord(vUv.xy);
        float x=p.x;
        float y=p.y;
        
        float mx=x*ratio;
        float my=y;
        
        float curve=20.0+layer*2.0;
        
        float v = 0.0;
        float d=0.0;
        for (int i = 0; i < ` + NUM_METABALLS + `; i++) {
            vec3 mb = metaballs[i];
            float dx = ((mb.x-.5)*ratio+.5) - x;
            float dy = mb.y - y;
            float r = mb.z;
            v += r*r/(dx*dx + dy*dy);
            // v += r*r/(dx*dx + dy*dy);
            // d+=1.0/(dx*dx+dy*dy);

            // if(mod(sqrt(d)*width,1.0)<0.01){
            //     gl_FragColor=vec4(BORDER_COLOR,1.0);
            //     return;
            // }
        }
        v=v*(noise(vec2(x*ratio*curve+tt,y*curve+tt))*.5+.5);
        // d=d*noise(vec2(x*ratio*curve+tt,y*curve+tt)*.5+.5);
        if(mod(sqrt(v)*width,0.5)<0.01) gl_FragColor=vec4(BORDER_COLOR,1.0);
        else{
            // if (v > 1.0) {
                float step=v;
                float pp=step-floor(step);
                pp=1.0;//-pp;
                if(step>=layer*2.5) gl_FragColor = vec4(ocean_color[0], 1.0);
                else if(step>=layer*2.0) gl_FragColor = vec4(mix(ocean_color[0],ocean_color[1],pp), 1.0);
                else if(step>=layer*1.5) gl_FragColor = vec4(mix(ocean_color[1],ocean_color[2],pp),1.0);
                else if(step>=layer){
                    gl_FragColor = vec4(mix(ocean_color[2],ocean_color[3],pp), 1.0);  
                }else{
                    gl_FragColor = vec4(ocean_color[3], 0.0);
                }
        }
    }
    `;
export const fs_tw=`
    precision highp float;
    uniform vec3 metaballs[` + NUM_METABALLS_TW + `];
    uniform vec3 ocean_color[4];
    uniform float tt;
    uniform sampler2D mask;
    uniform float width;
    uniform float height;
    varying vec2 vUv;
    uniform vec3 ISLAND_COLOR[4];
    // uniform float ISLAND_PORTION;
    // uniform float ISLAND_CENTER;
    uniform vec4 mask_region;
    uniform float roi_pos_x;
    uniform float roi_pos_y;
    uniform float roi_size_x;
    uniform float roi_size_y;
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
    bool inMask(vec2 p){
        
        // if(p.y>ISLAND_CENTER+ISLAND_PORTION || p.y<ISLAND_CENTER-ISLAND_PORTION) return false;

        // float ratio=width/height;
        // float my=(p.y-ISLAND_CENTER)*1.0/ISLAND_PORTION/2.0+.5;
        
        // float mx=(p.x-.5)*1.0/ISLAND_PORTION/2.0+.5;

        if(p.x<mask_region[0] || p.y<mask_region[1] 
            || p.x>mask_region[0]+mask_region[2] || p.y>mask_region[1]+mask_region[3]) return false;

        float mx=(p.x-mask_region[0])/mask_region[2];
        float my=(p.y-mask_region[1])/mask_region[3];
        
        vec4 mask_=texture2D(mask,vec2(mx,1.0-my));
        bool in_mask=(length(mask_.rgb)>1.0);
        
        return in_mask;
        // return true;
    }
     vec2 mapCoord(vec2 p){
        float ratio=width/height;
        float rx=(p.x-.5)*roi_size_x+((roi_pos_x-.5)*ratio+.5);
        float ry=-(p.y-.5)*roi_size_y+roi_pos_y;
        // ry=1.0-ry;

        return vec2(rx,ry);
    }
    void main(){
        float ratio=width/height;
        vec2 p=mapCoord(vUv.xy);
        float x=p.x;
        float y=p.y;
        
        // float mx=(vUv.x-.5)*ratio+.5;
        // float my=vUv.y;
        float v = 0.0;
        float d=0.0;
        for (int i = 0; i < ` + NUM_METABALLS_TW + `; i++) {
            vec3 mb = metaballs[i];
            float dx = mb.x - x;
            float dy = mb.y - y;
            float r = mb.z;
            v += r*r/(dx*dx + dy*dy);
            d+=sqrt(r*r/(dx*dx + dy*dy));
        }
        v=v*(noise(vec2(x*ratio*20.0+tt,y*20.0+tt))*.5+.5);
        bool in_mask=inMask(p);
        vec4 tmp=vec4(ocean_color[3],.2);
        vec4 dest=vec4(mix(ISLAND_COLOR[2],ISLAND_COLOR[3],y),tt);
        if(v > 1.0){
            tmp=vec4(ocean_color[3], .2);
            float step=floor(v/4.0);
            float pp=1.0;
            if(step>=6.0) tmp =vec4(ocean_color[0], 1.0);
            else if(step>=5.0) tmp =vec4(ocean_color[1], 1.0);
            else if(step>=4.0) tmp =vec4(ocean_color[2], 1.0);

            // if(tt>0.0 && !in_mask) tmp=vec4(ocean_color[3],.2);
        }
        if(in_mask){
            dest=vec4(mix(ISLAND_COLOR[0],ISLAND_COLOR[1],y),1.0);
        }
        float t=.0;
        if(tt<.5) t=.0;
        else t=(tt-.5)*2.0;
        gl_FragColor=vec4(mix(tmp,dest,t));
    }
    `;