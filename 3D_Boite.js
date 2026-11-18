import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  scene.background = new THREE.Color(0x001A10);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x005001, 1);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMapping = 2.5;
  document.querySelector(".boite_3D .model").appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xfffff, 3);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfffff, 1);
  mainLight.position.set(5, 10, 7.5);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xfffff, 3);
  fillLight.position.set(-5, 0, -5);
  scene.add(fillLight);

  const hemiLight = new THREE.HemisphereLight(0xfffff, 0xfffff, 2);
  hemiLight.position.set(0, 25, 0);
  scene.add(hemiLight);

  // controls.update() must be called after any manual changes to the camera's transform
  //const controls = new OrbitControls( camera, renderer.domElement );
  //camera.position.set( 0, 0, 5 );
  //controls.update();
  function basic_animate() {
    // required if controls.enableDamping or controls.autoRotate are set to true
    //controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(basic_animate);
  }
  basic_animate();

  let model;
  const loader = new GLTFLoader();
  loader.load("public/3D/boite.glb", function (gltf) {
    model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    scene.add(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.z = maxDim * 1.5;
    const scan_info_left = document.querySelector(".scan-info.left")
    const scan_info_right = document.querySelector(".scan-info.left")
    if (model) {
      isFloating = false;
      model.position.y = 0;
      model.rotation.set(0, 0, 0);
      model.scale.set(0, 0, 0);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".boite_3D",
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: 1,
          pinSpacing: true,
        },
      });
      tl.to(model.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power2.out",
      });
     
      tl.to(model.rotation, {
        y: Math.PI * 2,
        duration: 2,
        ease: "none",
      });
    }
    ScrollTrigger.sort();
  ScrollTrigger.refresh();
  });
  
  const floatAmplitude = 0.2;
  const floatSpeed = 1.5;
  const rotationSpeed = 0.3;
  let isFloating = true;
  let currentScroll = 0;
  const scannerSection = document.querySelector(".scanner");
  const scannerPosition = scannerSection.offsetTop;

  //lenis.on("scroll", (e) => {
  //  currentScroll = e.scroll;
  //});

  function animate() {
    if (model) {
      if (isFloating) {
        const floatOffset =
          Math.sin(Date.now() * 0.001 * floatSpeed) * floatAmplitude;
        model.position.y = floatOffset;
      }
      const scrollProgress = Math.min(currentScroll / scannerPosition, 1);

      if (scrollProgress < 1) {
        model.rotation.x = scrollProgress * Math.PI * 2;
      }

      if (scrollProgress < 1) {
        model.rotation.y += 0.001 * rotationSpeed;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
  }