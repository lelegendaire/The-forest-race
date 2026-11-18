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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.physicallyCorrectLights = true;

  document.querySelector(".composant .model").appendChild(renderer.domElement);

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

loader.load("public/3D/pion.glb", function (gltf) {
  model = gltf.scene;

  const pions = {
    cerf: model.getObjectByName("cerf"),
    grenouille: model.getObjectByName("grenouille"),
    lapin: model.getObjectByName("lapin"),
    ecureuil: model.getObjectByName("écureuil"),
    ours: model.getObjectByName("ours"),
    hibou: model.getObjectByName("hibou"),
    ratonLaveur: model.getObjectByName("ratonu_laveur"),
    sanglier: model.getObjectByName("sanglier"),
  };

  // Centrer le modèle
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());

  model.position.sub(center);
  scene.add(model);

  // Groupe qui va tourner
  const carousel = new THREE.Group();
  scene.add(carousel);

  // Informations des animaux
  const animals = [
    {
      key: "cerf",
      name: "Le cerf",
      title: "01 — Le Cerf",
      description: "2 fois par partie, peut ignorer un piège. (Le roi de la forêt.)",
    },
    {
      key: "grenouille",
      name: "La grenouille",
      title: "02 — La Grenouille",
      description: "Traverse les ruisseaux, capacité de bondir si il y a un piège.",
    },
    {
      key: "lapin",
      name: "Le lapin",
      title: "03 — Le Lapin",
      description: "2 fois par partie, peut doubler son déplacement.",
    },
    {
      key: "ecureuil",
      name: "L'écureuil",
      title: "04 — L'Écureuil",
      description: "3 fois par partie, peut conserver une carte Fruit lorsqu’il reçoit un malus.",
    },
    {
      key: "ours",
      name: "L'ours",
      title: "05 — L'Ours",
      description: "3 fois par partie, recule d’une seule case au lieu de 3 face au Loup.",
    },
    {
      key: "hibou",
      name: "Le hibou",
      title: "06 — L'Hibou",
      description: "3 fois par partie, peut regarder une carte piochée et la remettre s’il s’agit d’un malus.",
    },
    {
      key: "ratonLaveur",
      name: "Le raton laveur",
      title: "07 — Le Raton Laveur",
      description: "il vole une carte d’un autre joueur.",
    },
    {
      key: "sanglier",
      name: "Le sanglier",
      title: "08 — Le Sanglier",
      description: "4 fois par partie, peut piocher une carte supplémentaire.",
    },
  ];

  const radius = 7;
  const angleStep = (Math.PI * 2) / animals.length;

  // Placer les animaux en cercle
  model.updateMatrixWorld(true);

  animals.forEach((animal, index) => {
    const pion = pions[animal.key];

    if (!pion) {
      console.warn(`Pion introuvable : ${animal.key}`);
      return;
    }

    // Déplacer le pion dans le groupe sans perdre sa transformation globale
    carousel.attach(pion);

    const angle = index * angleStep;

    pion.position.set(
      Math.sin(angle) * radius,
      0,
      Math.cos(angle) * radius
    );

    // Orientation du pion
    pion.rotation.y = angle + Math.PI;
  });

  // Caméra
  camera.position.set(0, 0, 17);
  camera.lookAt(0, 0, 0);

  // Éléments HTML
  const info = document.querySelector(".pion-info");
  const number = document.querySelector(".pion-number");
  const title = document.querySelector(".pion-title");
  const description = document.querySelector(".pion-description");

  let currentIndex = -1;

  // Affichage des informations
  function updateText(index) {
    if (index === currentIndex) return;

    currentIndex = index;

    const animal = animals[index];

    gsap.killTweensOf(info);

    gsap.to(info, {
      autoAlpha: 0,
      y: 20,
      duration: 0.2,
      onComplete: () => {
        number.textContent = animal.title;
        title.textContent = animal.name;
        description.textContent = animal.description;

        gsap.to(info, {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        });
      },
    });
  }

  // Animation pilotée par le scroll
  gsap.to(carousel.rotation, {
    y: -Math.PI * 2,
    ease: "none",

    scrollTrigger: {
      trigger: ".composant",
      start: "top top",
      end: "+=2500",
      scrub: 1,
      pin: true,
      anticipatePin: 1,

      onUpdate: (self) => {
        const rotation = carousel.rotation.y;

        // Déterminer quel pion est le plus proche de la caméra
        const index = (
          Math.round(-rotation / angleStep) % animals.length
          + animals.length
        ) % animals.length;

        updateText(index);
      },
    },
  });

  // Premier texte
  updateText(0);

  ScrollTrigger.refresh();
});
  
 
