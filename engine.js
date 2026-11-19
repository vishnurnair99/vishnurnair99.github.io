// Original procedural illustration. No company CAD, project dimensions, or simulation data.
const stage = document.getElementById('engine-stage');
const status = document.getElementById('viewer-status');
const motion = document.getElementById('engine-motion');
const wire = document.getElementById('engine-wire');
const reset = document.getElementById('engine-reset');
let THREE;
try {
  THREE = await import('./vendor/three.module.min.js');
} catch {}
if (THREE) {
  try { setup(THREE); } catch (error) { fallback(); console.warn('3D engine unavailable:', error.message); }
} else fallback();
function fallback() {
  status.textContent = 'Static engine illustration · interactive 3D unavailable';
  for (const button of [motion, wire, reset]) button.disabled = true;
}
function setup(T) {
  const renderer = new T.WebGLRenderer({antialias:true, alpha:true, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.domElement.setAttribute('aria-label','3D rocket engine. Drag or use arrow keys to rotate; plus and minus to zoom.');
  renderer.domElement.setAttribute('role','img');
  renderer.domElement.tabIndex = 0;
  stage.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(33,1,0.1,50);
  camera.position.set(0,0.15,9.5);
  camera.lookAt(0,0.05,0);
  const engine = new T.Group();
  scene.add(engine);
  const steel = new T.MeshStandardMaterial({color:0x9ca8b4, metalness:0.84, roughness:0.28});
  const bright = new T.MeshStandardMaterial({color:0xd1d9df, metalness:0.8, roughness:0.24});
  const graphite = new T.MeshStandardMaterial({color:0x252e36, metalness:0.7, roughness:0.36});
  const copper = new T.MeshStandardMaterial({color:0xad7046, metalness:0.78, roughness:0.35});
  const darkCopper = new T.MeshStandardMaterial({color:0x624839, metalness:0.74, roughness:0.4, side:T.DoubleSide});
  const blue = new T.MeshStandardMaterial({color:0x54778c, metalness:0.8, roughness:0.29});
  const materials = [steel,bright,graphite,copper,darkCopper,blue];
  const mesh = (geometry, material, position=[0,0,0], parent=engine) => {
    const object = new T.Mesh(geometry,material); object.position.set(...position);parent.add(object);return object;
  };
  function cylinder(radius,height,y,mat=steel,radial=64){return mesh(new T.CylinderGeometry(radius,radius,height,radial),mat,[0,y,0]);}
  function ring(radius,tube,y,mat=steel){const m=mesh(new T.TorusGeometry(radius,tube,10,96),mat,[0,y,0]);m.rotation.x=Math.PI/2;return m;}
  function pipe(points,radius,mat=steel){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),48,radius,8,false),mat);}
  function flange(radius,y,bolts=16){
    cylinder(radius,0.085,y,bright);
    ring(radius-0.015,0.015,y+0.046,graphite);
    for(let i=0;i<bolts;i++){
      const a=i/bolts*Math.PI*2;const r=radius-0.055;
      mesh(new T.CylinderGeometry(0.025,0.025,0.05,6),graphite,[Math.cos(a)*r,y+0.065,Math.sin(a)*r]);
    }
  }
  // Bell contour: an illustrative smooth throat and expansion, with finite lip thickness.
  const bellProfile = [[1.03,-1.8],[1.025,-1.76],[0.91,-1.58],[0.77,-1.34],[0.63,-1.08],[0.5,-0.81],[0.39,-0.56],[0.31,-0.34],[0.28,-0.16],[0.285,-0.04],[0.32,0.1],[0.41,0.24],[0.445,0.38]];
  const contour = bellProfile.map(p=>new T.Vector2(...p));
  mesh(new T.LatheGeometry(contour,96),steel);
  const interior=bellProfile.map(([r,y])=>new T.Vector2(r-0.025,y+0.005));
  const inner=mesh(new T.LatheGeometry(interior,96),darkCopper);inner.material.side=T.BackSide;
  ring(1.025,0.025,-1.79,bright);
  ring(0.445,0.027,0.38,copper);
  // Fine longitudinal cooling-channel ribs follow the nozzle contour.
  for(let i=0;i<72;i++){
    const a=i/72*Math.PI*2;
    const points=bellProfile.map(([r,y])=>new T.Vector3((r+0.006)*Math.cos(a),y,(r+0.006)*Math.sin(a)));
    mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),36,0.006,4,false),i%6===0?copper:graphite);
  }
  cylinder(0.445,0.95,0.855,steel);
  for(let i=0;i<48;i++){
    const a=i/48*Math.PI*2;
    pipe([[0.452*Math.cos(a),0.4,0.452*Math.sin(a)],[0.452*Math.cos(a),1.3,0.452*Math.sin(a)]],0.007,copper);
  }
  flange(0.56,0.41);flange(0.57,1.33,20);
  cylinder(0.49,0.16,1.44,graphite);
  cylinder(0.43,0.13,1.56,bright);
  // Injector cap and individual fittings.
  const cap=mesh(new T.SphereGeometry(0.43,48,20,0,Math.PI*2,0,Math.PI/2),steel,[0,1.61,0]);cap.scale.y=0.38;
  ring(0.465,0.045,0.63,copper);
  ring(0.465,0.04,1.14,graphite);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    const lug=mesh(new T.BoxGeometry(0.1,0.22,0.12),steel,[0.49*Math.cos(a),1.27,0.49*Math.sin(a)]);lug.rotation.y=-a;
  }
  // Two main feed branches and contrasting anodized couplings.
  pipe([[-0.19,1.7,0.02],[-0.22,2.03,0.03],[-0.7,2.09,0.07],[-0.94,1.8,0.07],[-0.94,0.54,0.07],[-0.66,0.33,0.07],[-0.43,0.4,0.07]],0.075,bright);
  pipe([[0.18,1.71,-0.03],[0.25,2.13,-0.03],[0.7,2.19,-0.08],[0.91,1.89,-0.08],[0.91,0.87,-0.08],[0.66,0.66,-0.08],[0.45,0.63,-0.08]],0.063,steel);
  for(const [x,y,z] of [[-0.94,1.7,0.07],[-0.94,0.85,0.07],[0.91,1.67,-0.08],[0.91,1.07,-0.08]]){
    const c=mesh(new T.CylinderGeometry(0.103,0.103,0.15,8),x<0?blue:copper,[x,y,z]);
    const clamp=mesh(new T.TorusGeometry(0.105,0.012,6,24),bright,[x,y+0.06,z]);clamp.rotation.x=Math.PI/2;
  }
  // Valve bodies, actuators, mounting struts and instrument tubing.
  for(const x of [-0.94,0.91]){
    mesh(new T.BoxGeometry(0.23,0.25,0.22),graphite,[x,1.36,0]);
    mesh(new T.CylinderGeometry(0.11,0.11,0.3,24),steel,[x,1.62,0]);
    mesh(new T.BoxGeometry(0.12,0.1,0.16),blue,[x,1.36,0.18]);
  }
  for(const a of [0.25,2.35,4.45]){
    const x=Math.cos(a),z=Math.sin(a);
    pipe([[x*0.65,1.8,z*0.65],[x*0.6,1.32,z*0.6],[x*0.53,0.5,z*0.53]],0.025,graphite);
    mesh(new T.SphereGeometry(0.045,10,8),bright,[x*0.6,1.32,z*0.6]);
  }
  pipe([[0.25,1.72,0.3],[0.58,1.6,0.52],[0.64,0.5,0.52],[0.4,0.2,0.3]],0.018,copper);
  pipe([[-0.25,1.5,-0.32],[-0.64,1.3,-0.5],[-0.64,0.72,-0.5],[-0.43,0.55,-0.22]],0.02,bright);
  const sensor=mesh(new T.CylinderGeometry(0.055,0.055,0.21,12),steel,[0.49,0.91,0.2]);sensor.rotation.z=Math.PI/2;
  // Broad studio lights reveal hardware surfaces without using external texture assets.
  scene.add(new T.HemisphereLight(0xe7f1ff,0x24212a,2.4));
  function light(color,intensity,x,y,z){const l=new T.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l);}
  light(0xe0edff,5,3,5,4);light(0xffbd80,3,-4,1,2);light(0x83a9d7,5,1,2,-4);light(0xffffff,1.5,0,-3,3);
  engine.rotation.set(0.15,-0.5,-0.16);
  let auto=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dragging=false,lastX=0,lastY=0,visible=true,lastTime=0,frame;
  let targetX=0.15,targetY=-0.5,zoom=9.5;
  motion.textContent=auto?'Pause rotation':'Resume rotation';motion.setAttribute('aria-pressed',String(auto));
  const canvas=renderer.domElement;
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;targetY+=(e.clientX-lastX)*0.009;targetX=Math.max(-0.65,Math.min(0.65,targetX+(e.clientY-lastY)*0.006));lastX=e.clientX;lastY=e.clientY;});
  const release=()=>{dragging=false;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('wheel',e=>{if(!canvas.matches(':focus'))return;e.preventDefault();zoom=Math.max(7,Math.min(12,zoom+e.deltaY*0.004));},{passive:false});
  canvas.addEventListener('keydown',e=>{const actions={ArrowLeft:()=>targetY-=0.15,ArrowRight:()=>targetY+=0.15,ArrowUp:()=>targetX=Math.max(-0.65,targetX-0.1),ArrowDown:()=>targetX=Math.min(0.65,targetX+0.1),'+':()=>zoom=Math.max(7,zoom-0.4),'-':()=>zoom=Math.min(12,zoom+0.4)};if(actions[e.key]){e.preventDefault();actions[e.key]();}});
  motion.addEventListener('click',()=>{auto=!auto;motion.textContent=auto?'Pause rotation':'Resume rotation';motion.setAttribute('aria-pressed',String(auto));});
  wire.addEventListener('click',()=>{const enabled=wire.getAttribute('aria-pressed')!=='true';materials.forEach(m=>m.wireframe=enabled);wire.setAttribute('aria-pressed',String(enabled));});
  reset.addEventListener('click',()=>{targetX=0.15;targetY=-0.5;zoom=9.5;});
  const observer=new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});observer.observe(stage);
  const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});visibility.observe(stage);
  function render(time){frame=requestAnimationFrame(render);const dt=Math.min((time-lastTime)/1000,0.05);lastTime=time;if(!visible||document.hidden)return;if(auto&&!dragging)targetY+=dt*0.13;engine.rotation.x+=(targetX-engine.rotation.x)*0.1;engine.rotation.y+=(targetY-engine.rotation.y)*0.1;camera.position.z+=(zoom-camera.position.z)*0.1;renderer.render(scene,camera);}
  frame=requestAnimationFrame(render);
  stage.classList.add('is-ready');status.textContent='Interactive 3D ready';
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);stage.classList.remove('is-ready');fallback();});
}
