const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({canvas, antialias:false, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const geo = new THREE.PlaneGeometry(2,2);

// ---- Fragment shader: geodesic ray marching in the equatorial-plane
// approximation of the Schwarzschild null-geodesic ODE, generalized to 3D.
// The exact planar photon equation d^2u/dphi^2 = -u + 3Mu^2 (u=1/r) is
// equivalent, per conserved specific angular momentum h = |r x v|, to the
// 3D acceleration law used below: a = -1.5 * h^2 * r_hat / r^4 (G=c=1, r_s=2M).
// Spin adds an approximate Lense-Thirring (frame-dragging) twist term.
const frag = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec3  uCamPos;
uniform mat3  uCamBasis;
uniform float uRs;
uniform float uSpin;
uniform float uDiskSpeed;

#define STEPS 220
#define PI 3.14159265
#define TAU 6.28318530

float hash13(vec3 p){ p=fract(p*0.1031); p+=dot(p,p.yzx+33.33); return fract((p.x+p.y)*p.z); }
float vnoise(vec3 p){
  vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  float n000=hash13(i+vec3(0,0,0)), n100=hash13(i+vec3(1,0,0));
  float n010=hash13(i+vec3(0,1,0)), n110=hash13(i+vec3(1,1,0));
  float n001=hash13(i+vec3(0,0,1)), n101=hash13(i+vec3(1,0,1));
  float n011=hash13(i+vec3(0,1,1)), n111=hash13(i+vec3(1,1,1));
  return mix(mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y),
             mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y), f.z);
}
float fbm(vec3 p){
  float s=0.0, a=0.5;
  for(int i=0;i<5;i++){ s+=a*vnoise(p); p*=2.02; a*=0.5; }
  return s;
}
// crude blackbody-ish ramp: hot(white/blue) -> mid(yellow) -> cool(deep red)
vec3 blackbody(float t){
  t=clamp(t,0.0,1.0);
  vec3 hot=vec3(0.75,0.85,1.4), mid=vec3(1.3,0.9,0.45), cool=vec3(0.9,0.15,0.05);
  return t>0.5? mix(mid,hot,(t-0.5)*2.0) : mix(cool,mid,t*2.0);
}
vec3 starfield(vec3 d){
  vec2 uv = vec2(atan(d.z,d.x)/TAU, acos(clamp(d.y,-1.0,1.0))/PI);
  vec2 gv = uv*vec2(900.0,450.0);
  vec2 id = floor(gv); vec2 fv = fract(gv)-0.5;
  float h = hash13(vec3(id,7.0));
  float star = step(0.986,h) * smoothstep(0.5,0.0,length(fv)) * (0.6+0.4*sin(uTime*3.0+h*80.0));
  vec3 col = vec3(star)*mix(vec3(1.0,0.85,0.7),vec3(0.7,0.8,1.0),h);
  col += 0.035*vec3(0.25,0.35,0.75)*fbm(d*2.2+3.0);
  return col;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes)/uRes.y;
  vec3 dir = normalize(uCamBasis*normalize(vec3(uv,1.4)));
  vec3 pos = uCamPos;
  vec3 vel = dir;

  vec3 h = cross(pos,vel);
  float h2 = dot(h,h);
  float rs = uRs;
  float isco = 3.0*rs;
  float outerR = 10.0*rs;
  float photonSphere = 1.5*rs;

  vec3 accum = vec3(0.0);
  float trans = 1.0;
  bool captured = false;

  for(int i=0;i<STEPS;i++){
    float r = length(pos);
    if(r < rs*0.55){ captured = true; break; }
    if(r > 40.0) break;

    // adaptive step: fine near the photon sphere, coarse far away
    float dl = clamp(0.035*r + 0.004, 0.006, 0.6);
    dl *= smoothstep(photonSphere*0.6, photonSphere*3.0, r)*0.85 + 0.15;

    // RK4 integration of the geodesic acceleration a = -1.5 h^2 r / r^5
    vec3 p1=pos, v1=vel;                       float r1=length(p1);
    vec3 a1=-1.5*h2*p1/pow(r1,5.0);
    vec3 p2=pos+0.5*dl*v1, v2=vel+0.5*dl*a1;   float r2=length(p2);
    vec3 a2=-1.5*h2*p2/pow(r2,5.0);
    vec3 p3=pos+0.5*dl*v2, v3=vel+0.5*dl*a2;   float r3=length(p3);
    vec3 a3=-1.5*h2*p3/pow(r3,5.0);
    vec3 p4=pos+dl*v3, v4=vel+dl*a3;           float r4=length(p4);
    vec3 a4=-1.5*h2*p4/pow(r4,5.0);

    vec3 newPos = pos + dl/6.0*(v1+2.0*v2+2.0*v3+v4);
    vec3 newVel = vel + dl/6.0*(a1+2.0*a2+2.0*a3+a4);

    // approximate Lense-Thirring frame-dragging twist about spin axis (Y)
    if(uSpin > 0.0001){
      float drag = uSpin*dl*rs*rs/(pow(max(r,rs*0.6),3.0));
      float s=sin(drag), c=cos(drag);
      newVel.xz = mat2(c,-s,s,c)*newVel.xz;
      newPos.xz = mat2(c,-s,s,c)*newPos.xz;
    }

    // accretion-disk crossing test (thin disk in y=0 plane)
    if(pos.y*newPos.y < 0.0){
      float t = pos.y/(pos.y-newPos.y);
      vec3 hp = mix(pos,newPos,t);
      float rd = length(hp);
      if(rd>isco && rd<outerR){
        float rn = (rd-isco)/(outerR-isco);
        float ang = atan(hp.z,hp.x);
        float omega = uDiskSpeed*pow(isco/rd,1.5); // Keplerian-ish differential rotation
        vec3 sp = vec3(hp.x,0.0,hp.z);
        float density = fbm(vec3(cos(ang-omega*uTime),sin(ang-omega*uTime),0.0)*4.0*rd/isco
                             + vec3(0.0, rd*0.6, 0.0));
        density *= smoothstep(0.0,0.15,rn)*smoothstep(1.0,0.55,rn);
        density = pow(clamp(density,0.0,1.0), 1.3);

        // Keplerian orbital speed (v = sqrt(rs/(2r)), G=c=1 units)
        float beta = clamp(sqrt(rs/(2.0*rd)), 0.0, 0.999);
        float gamma = 1.0/sqrt(1.0-beta*beta);
        vec3 vHat = normalize(cross(vec3(0.0,1.0,0.0), sp));
        vec3 toObs = normalize(-vel); // direction photon travels toward camera
        float costh = dot(vHat, toObs);
        float doppler = 1.0/(gamma*(1.0-beta*costh));

        // gravitational redshift escaping this radius
        float grShift = sqrt(max(0.0, 1.0-rs/rd));

        float temp = pow(isco/rd, 0.75); // disk temperature profile
        vec3 base = blackbody(clamp(temp,0.0,1.0));

        // spectral shift: blue-boost when approaching (doppler>1), red when receding
        vec3 shiftCol = mix(vec3(1.3,0.55,0.35), vec3(0.55,0.75,1.5), clamp((doppler-0.4)/1.6,0.0,1.0));
        float beaming = pow(clamp(doppler,0.05,3.0), 3.0);

        vec3 emission = base*shiftCol*density*beaming*grShift*1.6;
        float op = clamp(density*1.4,0.0,1.0);
        accum += trans*emission*op;
        trans *= (1.0-op);
      }
    }
    pos = newPos; vel = newVel;
    if(trans < 0.01) break;
  }

  vec3 col = accum;
  if(!captured) col += trans*starfield(normalize(vel));
  col = col/(1.0+col); // simple tonemap
  col = pow(col, vec3(0.4545));
  gl_FragColor = vec4(col,1.0);
}`;

const vert = `void main(){ gl_Position = vec4(position.xy,0.0,1.0); }`;

const uniforms = {
  uRes:{value:new THREE.Vector2()},
  uTime:{value:0},
  uCamPos:{value:new THREE.Vector3()},
  uCamBasis:{value:new THREE.Matrix3()},
  uRs:{value:1.0},
  uSpin:{value:0.35},
  uDiskSpeed:{value:1.0},
};
const mat = new THREE.ShaderMaterial({vertexShader:vert, fragmentShader:frag, uniforms});
scene.add(new THREE.Mesh(geo, mat));

// ---- orbit camera (spherical, mouse/touch drag + wheel/pinch zoom)
let az = 0.9, el = 0.35, dist = 9.0;
let dragging=false, lastX=0, lastY=0;
canvas.addEventListener('pointerdown', e=>{dragging=true; lastX=e.clientX; lastY=e.clientY;});
addEventListener('pointerup', ()=>dragging=false);
addEventListener('pointermove', e=>{
  if(!dragging) return;
  az -= (e.clientX-lastX)*0.005;
  el = Math.max(-1.3, Math.min(1.3, el + (e.clientY-lastY)*0.005));
  lastX=e.clientX; lastY=e.clientY;
});
canvas.addEventListener('wheel', e=>{ dist = Math.max(2.2, Math.min(30, dist + e.deltaY*0.01)); e.preventDefault(); }, {passive:false});
let pinchStart=null;
canvas.addEventListener('touchstart', e=>{ if(e.touches.length===2) pinchStart=Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY); });
canvas.addEventListener('touchmove', e=>{
  if(e.touches.length===2 && pinchStart){
    const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
    dist = Math.max(2.2, Math.min(30, dist * (pinchStart/d)));
    pinchStart = d;
  }
}, {passive:true});

document.getElementById('rs').addEventListener('input', e=>uniforms.uRs.value=parseFloat(e.target.value));
document.getElementById('spin').addEventListener('input', e=>uniforms.uSpin.value=parseFloat(e.target.value));
document.getElementById('spd').addEventListener('input', e=>uniforms.uDiskSpeed.value=parseFloat(e.target.value));

function resize(){
  const w=innerWidth, h=innerHeight;
  renderer.setSize(w,h,false);
  uniforms.uRes.value.set(w*renderer.getPixelRatio(), h*renderer.getPixelRatio());
}
addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
function frame(){
  requestAnimationFrame(frame);
  uniforms.uTime.value = clock.getElapsedTime();

  const camPos = new THREE.Vector3(
    dist*Math.cos(el)*Math.sin(az),
    dist*Math.sin(el),
    dist*Math.cos(el)*Math.cos(az)
  );
  const fwd = camPos.clone().negate().normalize();
  const worldUp = new THREE.Vector3(0,1,0);
  const right = new THREE.Vector3().crossVectors(fwd, worldUp).normalize();
  const up = new THREE.Vector3().crossVectors(right, fwd).normalize();
  uniforms.uCamPos.value.copy(camPos);
  uniforms.uCamBasis.value.set(
    right.x, up.x, fwd.x,
    right.y, up.y, fwd.y,
    right.z, up.z, fwd.z
  );
  renderer.render(scene, camera);
}
frame();