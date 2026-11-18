
history.scrollRestoration = "manual";

const lenis = new Lenis({anchors: true,});

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  lenis.stop();

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);

    lenis.scrollTo(0, {
      immediate: true,
      force: true,
    });
  });
  gsap.ticker.lagSmoothing(0);

  const parallaxElements = document.querySelectorAll(".parallax");
  let xValue = 0,
    yValue = 0,
    rotateDegree = 0;
  function update(cursorPosition) {
    parallaxElements.forEach((el) => {
      const speedx = Number(el.dataset.speedx) || 0;
      const speedy = Number(el.dataset.speedy) || 0;
      const speedz = Number(el.dataset.speedz) || 0;
      const rotateSpeed = Number(el.dataset.rotation) || 0;
      let isInLeft =
        parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
      const zValue =
        (cursorPosition - parseFloat(getComputedStyle(el).left)) *
        isInLeft *
        0.1;
      const moveX = xValue * speedx;
      const moveY = yValue * speedy;
      const moveZ = zValue * speedz;
      el.style.transform = `
      rotateY(${rotateDegree * rotateSpeed}deg)
      perspective(2300px)
      translate3d(
        calc(-50% + ${moveX}px),
        calc(-50% + ${moveY}px + var(--scroll-y, 0px)),
        ${moveZ}px
      )
    `;
    });
  }
  update(0);
  parallaxElements.forEach((el) => {
    el.style.animation = "0.45s cubic-bezier(.2,.49,.32,.99)";
  });

  /*gsap*/

  const timeline = gsap.timeline({
    onComplete: () => {
      lenis.start();
    },
  });
  Array.from(parallaxElements)
    .filter((el) => !el.classList.contains("text"))
    .forEach((el) => {
      timeline.from(
        el,
        {
          y: `${el.offsetHeight / 2 + +el.dataset.distance}px`,
          duration: 3.5,
          ease: "power3.out",
        },
        "1",
      );
    });

  timeline
    .from(
      ".text h1",
      {
        y:
          window.innerHeight -
          document.querySelector(".text h1").getBoundingClientRect().top,
        duration: 2,
      },
      "2.5",
    )
    .from(
      ".text h2",
      {
        y: -150,
        opacity: 0,
        duration: 1.5,
      },
      "3",
    )
    .from(
      ".hide",
      {
        opacity: 0,
        duration: 1.5,
      },

      "3",
    );
  window.addEventListener("mousemove", (e) => {
    if (timeline.isActive()) return;
    xValue = e.clientX - window.innerWidth / 2;
    yValue = e.clientY - window.innerHeight / 2;
    rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

    update(e.clientX);
  });

  /* PARALLAX AU SCROLL */

  let scrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    if (timeline.isActive()) return;
    scrollY = window.scrollY;

    parallaxElements.forEach((el) => {
      const speed = Number(el.dataset.speedy) || 0.1;

      // Déplacement vertical selon la vitesse de chaque couche
      el.style.setProperty("--scroll-y", `${scrollY * speed}px`);
    });
  });

  const cardWrap = document.querySelectorAll(".card-wrap");
  cardWrap.forEach((el_cardWrap) => {
    const card = el_cardWrap.querySelector(".card");
    const bg_img = el_cardWrap.querySelectorAll(".card-bg .img-card-bg");
    el_cardWrap.addEventListener("mousemove", (e) => {
      const rect = el_cardWrap.getBoundingClientRect();

      const mouseX = e.clientX - rect.left - el_cardWrap.offsetWidth / 2;
      const mouseY = e.clientY - rect.top - el_cardWrap.offsetHeight / 2;

      const mousePX = mouseX / el_cardWrap.offsetWidth;
      const mousePY = mouseY / el_cardWrap.offsetHeight;

      // Inclinaison de la carte
      const rX = mousePX * 30;
      const rY = mousePY * -30;

      card.style.transform = `rotateY(${rX}deg) rotateX(${rY}deg)`;

      // Déplacement du fond
      const tX = mousePX * -40;
      const tY = mousePY * -40;
      bg_img.forEach((el) => {
        const space = Number(el.dataset.space) || 0;
        el.style.transform = `translateX(${tX * space}px) translateY(${tY * space}px) `;
      });
    });
    el_cardWrap.addEventListener("mouseleave", (e) => {
      bg_img.forEach((el) => {
        el.style.transform = ``;
      });
      card.style.transform = ``;
    });
  });

  

  const svg = document.querySelector("svg.squiggle");
  const path = svg.querySelector("path");
  const concept_jeu = document.querySelector(".concept_jeu");
  const pathLength = path.getTotalLength();

  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;
  gsap.to(path, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".concept_jeu",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });
  const steps = document.querySelectorAll(".step")
const progress_line = document.querySelector(".progress_line_milestone")
const line = document.querySelector(".line_milestone")
const end_milestone = document.querySelector(".end_milestone")
const start_milestone = document.querySelector(".start_milestone")

// Position de l'extrémité de la progression
const extremity = progress_line.getBoundingClientRect().right

// Position du départ et de la fin de la ligne
const start = line.getBoundingClientRect().left
const end = line.getBoundingClientRect().right

steps.forEach((step) => {
  const stepRect = step.getBoundingClientRect()
  const stepCenter = stepRect.left + stepRect.width / 2

  if (extremity >= stepCenter) {
    step.classList.add("check")
  } else {
    step.classList.remove("check")
  }
})

// Départ
start_milestone.classList.toggle("check", extremity > start)

// Arrivée
end_milestone.classList.toggle("check", extremity >= end)
  const Gameplay_video = document.querySelector(".Gameplay_video");
  const stickyMask = document.querySelector(".stickyMask");

  stickyMask.style.maskSize = "100%";

  gsap.fromTo(
    stickyMask,
    {
      maskSize: "100%",
      webkitMaskSize: "100%",
    },
    {
      maskSize: "5000%",
      webkitMaskSize: "5000%",
      ease: "power2.in",
      scrollTrigger: {
        trigger: ".Gameplay_video",
        start: "top top",
        end: "+=250%",
        scrub: true,
        pin: true,
      },
    },
  );
const cardSection = document.querySelector(".container");
const cards = gsap.utils.toArray(".card-wrap");

// Récupération des positions naturelles avant l'animation
const originalPositions = cards.map((card) => {
  const rect = card.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
});

// Position de la pile : centre du conteneur
const containerRect = document
  .querySelector(".container")
  .getBoundingClientRect();

const stackX = containerRect.left + containerRect.width / 2;
const stackY = containerRect.top + containerRect.height / 2;

// Empilement initial
gsap.set(cards, {
  x: (i) => stackX - originalPositions[i].x,
  y: (i) => stackY - originalPositions[i].y,
  rotation: (i) => (i % 2 === 0 ? -3 : 3),
  zIndex: (i) => cards.length - i,
  transformOrigin: "center center",
});

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: cardSection,
    start: "top top",
    end: "+=300%",
    scrub: 1,
    pin: true,
    invalidateOnRefresh: true,
  },
});

// 1. Déballage : dispersion des cartes
tl.to(cards, {
  x: 0,
  y: 0,
  rotation: 0,
  stagger: 0.08,
  duration: 1,
  ease: "power2.out",
});

// 2. Retournement des cartes
tl.to(cards, {
  rotationY: 180,
  stagger: 0.06,
  duration: 1,
  ease: "power2.inOut",
});

const images = gsap.utils.toArray(".el");

const scales = [4, 5, 6, 8, 9, 5, 4];

const tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".sticky",
    start: "top top",
    end: "+=200%",
    scrub: 1,
    pin: ".sticky",
  }
});

images.forEach((image, index) => {
  tl2.to(image, {
    scale: scales[index],
    ease: "none",
  }, 0);
});
document.body.addEventListener("mousemove", (e) => {
  const eyes = document.querySelectorAll(".eye");

  eyes.forEach(eye => {
    const pupil = eye.querySelector(".pupil");
    const rect = eye.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - y, e.clientX - x);

    const maxMove = 3;

    const moveX = Math.cos(angle) * maxMove;
    const moveY = Math.sin(angle) * maxMove;

    pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});



  requestAnimationFrame(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
});

function resetScrollAndRefresh() {
  window.scrollTo(0, 0);

  lenis.scrollTo(0, {
    immediate: true,
    force: true,
  });

  requestAnimationFrame(() => {
    ScrollTrigger.refresh(true);
  });
}

window.addEventListener("pageshow", resetScrollAndRefresh);

const phrase = document.querySelectorAll(".reveal-text");
  phrase.forEach((el_phrase) => {
    const word_phrase = el_phrase.textContent.trim().split(/\s+/);
    el_phrase.textContent = "";

    word_phrase.forEach((el) => {
      const newWord = document.createElement("span");
      newWord.classList.add("word");
      newWord.textContent = `${el} `;
      el_phrase.appendChild(newWord);
      
    });
    const Word = el_phrase.querySelectorAll(".word");
gsap.set(Word,{
  opacity: 0.2,
})
    gsap.to(Word, {
      opacity: 1,
      ease: "none",
      stagger: {
        amount: 1,
        from: "start",
      },
      scrollTrigger: {
        trigger: el_phrase,
        start: "top 100%",
        end: "bottom 50%",
        scrub: true,
      },
    });
  });