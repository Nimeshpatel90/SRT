import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('srt-space-canvas');
if (!canvas) throw new Error('SRT 3D canvas not found');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030914, 0.018);

const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.1, 9.5);

const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

scene.add(new THREE.AmbientLight(0x5577aa, 0.28));
const key = new THREE.DirectionalLight(0xffffff, 2.0);
key.position.set(5, 3, 5);
scene.add(key);
const blueLight = new THREE.PointLight(0x268cff, 3.5, 18);
blueLight.position.set(-4, 1, 3);
scene.add(blueLight);

const group = new THREE.Group();
group.rotation.z = -0.16;
scene.add(group);

// Planet / moon: same visual language as the supplied Lunar Gravity component.
const loader = new THREE.TextureLoader();
const moonTexture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');
moonTexture.colorSpace = THREE.SRGBColorSpace;

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2.35, 64, 64),
  new THREE.MeshStandardMaterial({map:moonTexture, bumpMap:moonTexture, bumpScale:0.035, roughness:0.84, metalness:0.08})
);
moon.position.set(2.05, 0.15, 0);
group.add(moon);

// Soft atmospheric shell.
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(2.43, 48, 48),
  new THREE.MeshBasicMaterial({color:0x3c9dff, transparent:true, opacity:0.075, side:THREE.BackSide, blending:THREE.AdditiveBlending})
);
atmosphere.position.copy(moon.position);
group.add(atmosphere);

// Stars / particles.
const starCount = innerWidth < 700 ? 4500 : 8500;
const starPositions = new Float32Array(starCount * 3);
const starColors = new Float32Array(starCount * 3);
for(let i=0;i<starCount;i++){
  const r = 14 + Math.random()*28;
  const a = Math.random()*Math.PI*2;
  const z = (Math.random()-0.5)*26;
  starPositions[i*3] = Math.cos(a)*r;
  starPositions[i*3+1] = Math.sin(a)*r;
  starPositions[i*3+2] = z;
  const tint = Math.random();
  starColors[i*3] = 0.55 + tint*0.35;
  starColors[i*3+1] = 0.70 + tint*0.25;
  starColors[i*3+2] = 0.92 + tint*0.08;
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions,3));
starGeo.setAttribute('color', new THREE.BufferAttribute(starColors,3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({size:0.035, vertexColors:true, transparent:true, opacity:0.7, depthWrite:false}));
scene.add(stars);

// Orbital particle ring.
const ringCount = innerWidth < 700 ? 3500 : 6500;
const ringPos = new Float32Array(ringCount*3);
const ringCol = new Float32Array(ringCount*3);
for(let i=0;i<ringCount;i++){
  const a = Math.random()*Math.PI*2;
  const r = 2.85 + Math.pow(Math.random(),1.7)*2.5;
  const y = (Math.random()-0.5)*(0.15 + (1-Math.min((r-2.85)/2.5,1))*0.28);
  ringPos[i*3] = Math.cos(a)*r;
  ringPos[i*3+1] = y;
  ringPos[i*3+2] = Math.sin(a)*r;
  const blue = Math.random();
  ringCol[i*3] = 0.12 + blue*0.25;
  ringCol[i*3+1] = 0.45 + blue*0.45;
  ringCol[i*3+2] = 0.72 + blue*0.28;
}
const ringGeo = new THREE.BufferGeometry();
ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos,3));
ringGeo.setAttribute('color', new THREE.BufferAttribute(ringCol,3));
const ring = new THREE.Points(ringGeo, new THREE.PointsMaterial({size:0.018, vertexColors:true, transparent:true, opacity:0.85, blending:THREE.AdditiveBlending, depthWrite:false}));
ring.position.copy(moon.position);
ring.rotation.x = THREE.MathUtils.degToRad(66);
ring.rotation.z = THREE.MathUtils.degToRad(-18);
group.add(ring);

// A few larger orbiting travel beacons.
const beaconGroup = new THREE.Group();
group.add(beaconGroup);
const beaconGeo = new THREE.SphereGeometry(0.045, 12, 12);
for(let i=0;i<18;i++){
  const b = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({color:i%4===0?0xa9dcff:0x3e9fff, transparent:true, opacity:0.8}));
  b.userData = {angle:Math.random()*Math.PI*2, radius:3.1+Math.random()*2.1, speed:(0.08+Math.random()*0.13)*(Math.random()>.5?1:-1), offset:(Math.random()-.5)*.4};
  beaconGroup.add(b);
}

let targetX=0, targetY=0, mouseX=0, mouseY=0;
addEventListener('pointermove', e=>{
  targetX=(e.clientX/innerWidth-.5)*0.55;
  targetY=(e.clientY/innerHeight-.5)*0.3;
});

const clock = new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(),0.05);
  const t = clock.elapsedTime;
  moon.rotation.y += dt*0.045;
  ring.rotation.y -= dt*0.018;
  stars.rotation.y += dt*0.002;
  beaconGroup.rotation.y += dt*0.035;
  beaconGroup.children.forEach(b=>{
    b.userData.angle += b.userData.speed*dt;
    const a=b.userData.angle, r=b.userData.radius;
    b.position.set(Math.cos(a)*r, Math.sin(a)*r*0.18+b.userData.offset, Math.sin(a)*r);
  });
  mouseX += (targetX-mouseX)*0.025;
  mouseY += (targetY-mouseY)*0.025;
  group.rotation.y = mouseX;
  group.rotation.x = mouseY*0.35;
  camera.position.x += (mouseX*0.9-camera.position.x)*0.025;
  camera.position.y += (1.1-mouseY*0.5-camera.position.y)*0.025;
  camera.lookAt(1.1,0,0);
  renderer.render(scene,camera);
}
animate();

addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.setSize(innerWidth,innerHeight);
});
