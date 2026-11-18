  import * as THREE from "three";
  import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.background = new THREE.Color(0x005001)



const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setClearColor(0x005001,1)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMapping = 2.5;
document.querySelector(".boite_3D .model").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xfffff,3)
scene.add(ambientLight)

const mainLight = new THREE.DirectionalLight(0xfffff,1)
mainLight.position.set(5,10,7.5)
scene.add(mainLight)

const fillLight = new THREE.DirectionalLight(0xfffff,3)
fillLight.position.set(-5,0,-5)
scene.add(fillLight)

const hemiLight = new THREE.HemisphereLight(0xfffff,0xfffff,2)
hemiLight.position.set(0,25,0)
scene.add(hemiLight);

function basic_animate() {
  // required if controls.enableDamping or controls.autoRotate are set to true
  //controls.update();
  renderer.render( scene, camera );
    requestAnimationFrame(basic_animate)
}
basic_animate()

let model;
const loader = new GLTFLoader();
loader.load( 'public/3D/boite.glb', function ( gltf ) {
    model = gltf.scene
    
    
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center)
    scene.add(model);
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x,size.y,size.z)
    camera.position.z = maxDim *1.5;
    model.scale.set(0,0,0)
    playInitialAnimation()
    cancelAnimationFrame(basic_animate)
    animate()

}); 

const floatAmplitude = 0.2
const floatSpeed = 1.5
const rotationSpeed = 0.3
let isFloating = true
let currentScroll = 0
const stickyHeight = window.innerHeight
const scannerSection = document.querySelector(".scanner")
const scannerPosition = scannerSection.offsetTop;
const scanContainer = document.querySelector(".scan-container")

function playInitialAnimation(){
    if (model){
        gsap.to(model.scale,{
            x: 1,
            y: 1,
            z: 1,
            duration: 1,
            ease: "power2.out"
        });
        gsap.to(scanContainer, {
            scale: 1,
            duration: 1,
            ease: "power2.out",
        })
    }
}

ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "top -10",
    onEnterBack: ()=>{
        if (model){
            gsap.to(model.scale, {
                x: 1,
                y: 1,
                z:1,
                duration: 1,
                ease: "power2.out"
            });
            isFloating = true
        }
        gsap.to(scanContainer, {
            scale: 1,
            duration: 1,
            ease: "power2.out"
        })
    }
})

ScrollTrigger.create({
    trigger: ".scanner",
    start: "top top",
    end: `${stickyHeight}px`,
    pin: true,
    onEnter: ()=>{
        if (model){
            isFloating = false
            model.position.y = 0

            setTimeout(()=>{
                

            },500)
            gsap.to(model.rotation,{
                y: model.rotation.y + Math.PI * 2,
                duration: 1,
                ease: "power2.out",
                onComplete: ()=>{
                    gsap.to(model.scale, {
                        x:0,
                        y:0,
                        z:0,
                        duration: 0.5,
                        ease: "power2.in",
                        onComplete: ()=>{
                            gsap.to(scanContainer, {
                                scale: 0,
                                duration: 0.5,
                                ease: "power2.in"
                            })
                        }
                    })
                }
            })
        }

    },
    onLeaveBack: ()=>{
        gsap.set(scanContainer, {scale:0});
        gsap.to(scanContainer, {
            scale: 1,
            duration: 1,
            ease: "power2.out"
        })
    }
})

lenis.on("scroll",(e)=>{
  currentScroll = e.scroll;
})

function animate(){
if (model){
    if (isFloating){
      const floatOffset = Math.sin(Date.now()*0.001 *floatSpeed) *floatAmplitude;
      model.position.y = floatOffset
    }
    const scrollProgress = Math.min(currentScroll / scannerPosition, 1);

    if (scrollProgress < 1){
      model.rotation.x = scrollProgress * Math.PI * 2
    }

    if (scrollProgress<1){
      model.rotation.y += 0.001 * rotationSpeed;
    }

    renderer.render(scene,camera)
    requestAnimationFrame(animate)
  }
}




window.addEventListener("load", () => {
  history.scrollRestoration = "manual";

  window.scrollTo(0, 0);

  lenis.scrollTo(0, {
    immediate: true,
    force: true,
  });

});







