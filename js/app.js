const container = document.querySelector('.container');
import * as THREE from './three.js/build/three.module.js';
let stats;
const count = 100;
const distance = 2;

const textureLoad = new THREE.TextureLoader();
const circleTexture = textureLoad.load("./js/circle.png");
const alpha = textureLoad.load("./js/alpha.png");

//scene et camera
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, container.clientWidth/container.clientHeight, 0.1, 1000 );
camera.position.z = 2;
scene.add(camera);

const points = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for(let i = 0; i <= count; i++){
    points[i] = THREE.MathUtils.randFloatSpread(distance * 2);
    colors[i] = Math.random() *0.5 + .5;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

const pointMaterial = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: THREE.VertexColors,
    alphaTest: 0.01,
    alphaMap: alpha,
    transparent: true,
    map: circleTexture,
});
const pointsObject = new THREE.Points(geometry, pointMaterial);
scene.add(pointsObject);

const group = new THREE.Group();
group.add(pointsObject);
scene.add(group);

//renderer
const renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
renderer.setClearColor(0x000000, 0);
renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild( renderer.domElement );

// SCENE
scene.background = new THREE.Color( 0x000000, 0 );
scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

// LIGHTS

const dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
dirLight.position.set( 0, 0, 1 ).normalize();
scene.add( dirLight );

const pointLight = new THREE.PointLight( 0xffffff, 1.5 );
pointLight.position.set( 0, 100, 90 );
scene.add( pointLight );

function animate() {

    requestAnimationFrame( animate );
    group.rotateX(-0.001);
    group.rotation.z += 0.001;
    group.rotation.y -= 0.001;
    // group.rotation.x += 0.01;
    renderer.render( scene, camera );
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth/container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});