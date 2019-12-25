/*
  ======================================
    "Joyeux Noel Sofiya"
    by Eduard Anton (AKA NextLightDev)
    Created on 22/12/2019
    With the game engine THREE JS
  ======================================
  Description: Interactive christmas gift for Sofiya
*/

var snowVelocityY = 1;
var snowflakeCount = 2200;
var globeSize = 50;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var listener = new THREE.AudioListener();
var music = new THREE.PositionalAudio(listener);
var mouse = new THREE.Vector2();
camera.add(listener);

const loadingManager = new THREE.LoadingManager( () => {
		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		// optional: remove loader from DOM via event listener
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
	});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function onTransitionEnd(event) {
	event.target.remove();
  headPhoneWarning();
}

window.addEventListener('resize', function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

document.addEventListener('mousemove', function(event) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}, false);

//Controls
camera.position.set(0, 65, 250);
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enabled = false;
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.autoRotate = true;

//Sound
var audioLoader = new THREE.AudioLoader(loadingManager);
audioLoader.load('sound/All I Want For Christmas Is You.ogg', function(buffer) {
	music.setBuffer(buffer);
  music.setLoop(true);
  music.setVolume(0.7);
	music.setRefDistance(20);
  music.play();
});

//Snow particles
var snowGeometry = new THREE.Geometry();
for (let i=0; i < snowflakeCount; i++) {
  var flake = new THREE.Vector3(
     Math.random() * 1200 - 600,
     Math.random() * 1200 - 600,
     Math.random() * 1200 - 600
  );
  flake.velocity = new THREE.Vector2(Math.random() * 1 - 0.5, Math.random() * 1 - 0.5);
  snowGeometry.vertices.push(flake);
}
let sprite = new THREE.TextureLoader(loadingManager).load("snowflake.png");
let snowMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 10,
  transparent: true,
  map: sprite
});
var snow = new THREE.Points(snowGeometry, snowMaterial);
scene.add(snow);

//SkyBox
var skyTextures = [
  "skybox/negz.jpg",
  "skybox/posz.jpg",
  "skybox/posy.jpg",
  "skybox/negy.jpg",
  "skybox/posx.jpg",
  "skybox/negx.jpg"
];
var skyTextureCube = new THREE.CubeTextureLoader(loadingManager).load(skyTextures);
skyTextureCube.mapping = THREE.CubeRefractionMapping;
scene.background = skyTextureCube;

var glassMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: skyTextureCube, transparent: true, opacity: 0.5, refractionRatio: 0.9, reflectivity: 0.95, side: THREE.DoubleSide } );

//Mesh
var sphereGeo = new THREE.SphereGeometry(globeSize, 100, 100);
var globeObject = new THREE.Mesh(sphereGeo, glassMaterial);
scene.add(globeObject);

var bottomObject;
var loader = new THREE.GLTFLoader(loadingManager);
loader.load('mesh/bottomGlobe.gltf', function(gltf) {
  var bottomMat = new THREE.MeshStandardMaterial({ color: 0xC70039, roughness: 0.15, metalness: 1, envMap: skyTextureCube});
  bottomObject = new THREE.Mesh(gltf.scene.children[0].geometry, bottomMat);
  bottomObject.scale.set(5, 5, 5);
  bottomObject.position.y = -50;
  bottomObject.castShadow = true;
  scene.add(bottomObject);
});

var radioObject;
loader = new THREE.GLTFLoader(loadingManager);
loader.load('mesh/radio.gltf', function(gltf) {
  radioObject = gltf.scene;
  radioObject.traverse ( (o) => {
    if (o.isMesh) {
      o.material.envMap = skyTextureCube;
    }
  });
  radioObject.scale.set(1, 1, 1);
  radioObject.castShadow = true;
  radioObject.add(music);
  scene.add(radioObject);
  radioObject.velocity = new THREE.Vector3(
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125
  );
  radioObject.rotVelocity = new THREE.Vector3(
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125
  );
});

var treeObject;
loader = new THREE.GLTFLoader(loadingManager);
loader.load('mesh/tree.gltf', function(gltf) {
  treeObject = gltf.scene;
  treeObject.traverse ( (o) => {
    if (o.isMesh) {
      o.material.envMap = skyTextureCube;
    }
  });
  treeObject.scale.set(0.02, 0.02, 0.02);
  treeObject.castShadow = true;
  scene.add(treeObject);
  treeObject.velocity = new THREE.Vector3(
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125
  );
  treeObject.rotVelocity = new THREE.Vector3(
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125
  );
});

var giftObject;
loader = new THREE.GLTFLoader(loadingManager);
loader.load('mesh/gift.gltf', function(gltf) {
  giftObject = gltf.scene;
  giftObject.traverse ( (o) => {
    if (o.isMesh) {
      o.material.envMap = skyTextureCube;
    }
  });
  giftObject.scale.set(0.04, 0.04, 0.04);
  giftObject.castShadow = true;
  scene.add(giftObject);
  giftObject.velocity = new THREE.Vector3(
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125
  );
  giftObject.rotVelocity = new THREE.Vector3(
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125
  );
});

var sugarObject;
loader = new THREE.GLTFLoader(loadingManager);
loader.load('mesh/candy.gltf', function(gltf) {
  sugarObject = gltf.scene;
  sugarObject.traverse ( (o) => {
    if (o.isMesh) {
      o.material.envMap = skyTextureCube;
    }
  });
  sugarObject.scale.set(0.008, 0.008, 0.008);
  sugarObject.castShadow = true;
  scene.add(sugarObject);
  sugarObject.velocity = new THREE.Vector3(
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125
  );
  sugarObject.rotVelocity = new THREE.Vector3(
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125
  );
});

var letterObject;
loader = new THREE.GLTFLoader(loadingManager);
loader.load('mesh/scene.gltf', function(gltf) {
  letterObject = gltf.scene;
  letterObject.scale.set(3.5, 3.5, 3.5);
  letterObject.name = "letter";
  scene.add(letterObject);
  letterObject.velocity = new THREE.Vector3(
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125
  );
  letterObject.rotVelocity = new THREE.Vector3(
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125,
    Math.random() * 0.25 - 0.125
  );
});

var snowManObject;
loader = new THREE.GLTFLoader(loadingManager);
loader.load('mesh/snowman.gltf', function(gltf) {
  snowManObject = gltf.scene;
  snowManObject.traverse ( (o) => {
    if (o.isMesh) {
      o.material.envMap = skyTextureCube;
    }
  });
  snowManObject.scale.set(0.08, 0.08, 0.08);
  snowManObject.castShadow = true;
  snowManObject.position.y = -50;
  scene.add(snowManObject);
});

//Lights
let light = new THREE.AmbientLight(0x404040, 5);
scene.add(light);
var directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
directionalLight.position.x = 10000;
directionalLight.position.y = 4000;
directionalLight.position.z = 9000;
directionalLight.castShadow = true;
scene.add(directionalLight);
// let ptLight = new THREE.PointLight(0x404040, 10);
// scene.add(ptLight);

var update = function() {
  controls.update();
  snowGeometry.vertices.forEach(p=>{
    p.y -= snowVelocityY;
    p.x += p.velocity.x;
    p.z += p.velocity.y;
    if (p.y < -800 || p.distanceTo(globeObject.position) <= globeSize) {
      p.x = Math.random() * 1200 - 600;
      p.y =  Math.random() * 1200 - 600;
      p.z = Math.random() * 1200 - 600;
    }
  });
  snowGeometry.verticesNeedUpdate = true;
  snow.rotation.y += 0.001;

  var objects = [
    radioObject,
    treeObject,
    giftObject,
    sugarObject,
    letterObject
  ];

  for (var o = 0; o < objects.length; o++) {
    if (objects[o]) {
      objects[o].position.add(objects[o].velocity);
      objects[o].rotation.x += objects[o].rotVelocity.x;
      objects[o].rotation.y += objects[o].rotVelocity.y;
      objects[o].rotation.z += objects[o].rotVelocity.z;

      if (objects[o].position.distanceTo(globeObject.position) >= globeSize - 10) {
        objects[o].velocity.multiplyScalar(-1);
        objects[o].velocity.x += Math.random() * 0.5 - 0.25;
        objects[o].velocity.y += Math.random() * 0.5 - 0.25;
        objects[o].velocity.z += Math.random() * 0.5 - 0.25;
        objects[o].velocity.clampLength(-0.8, 0.8);
      }
    }
  }
};

var render = function() {
  renderer.render(scene, camera);
};

var gameLoop = function() {
  requestAnimationFrame(gameLoop);
  update();
  render();
};

function headPhoneWarning() {
  var textBox = $("<div>", {"class": "beautiful-textbox"});
  var heading = $("<div>", {"class": "beautiful-textbox"});
  heading.text("Joyeux Noël!");
  textBox.append(heading);
  var heading2 = $("<div>", {"class": "beautiful-textbox2"});
  heading2.text("Il y a aussi du son!");
  textBox.append(heading2);
  var butWrap = $("<div>", {"class": "button-wrapper"});
  var button = $("<div>", {"class": "button"});
  button.text("Continuer");
  button.click(function() {
    textBox.remove();
    zoomInTitle();
  });
  butWrap.append(button);
  textBox.append(butWrap);
  $("body").append(textBox);
}

function zoomInTitle() {
  var container = $('<div>', {"class": "console-container"});
  var title = $('<span>', {"class": "title"});
  var underscore = $('<div>', {"class": "console-underscore"});
  container.append(title);
  container.append(underscore);
  $("body").append(container);
  var visibleUnderscore = true;
  var currentSentence = 0;
  var txt = '';
  var isDeleting = false;
  var sentences = [
    "Chère Sofiya,  ",
    "je te souhaites le plus beau Noël  ",
    "et la plus belle année qu'il soit  ",
    "Joyeux Noël!  ",
    "Par Eduard Anton  "
  ];
  zoomCameraIn(new THREE.Vector3(0, 0, 0));

  var anime = setInterval(function() {
    var fullTxt = sentences[currentSentence];
    if (txt.length == 0) isDeleting = false;
    if (txt.length == fullTxt.length) {
      isDeleting = true;
    }
    if (isDeleting) {
      txt = fullTxt.substring(0, txt.length - 1);
      fullTxt = sentences[currentSentence];
      if (txt.length == 0) currentSentence++;
      if (currentSentence > sentences.length - 1) {
        clearInterval(anime);
        container.remove();
        showMsg();
      }
    } else {
      txt = fullTxt.substring(0, txt.length + 1);
    }
    if (visibleUnderscore) {
      visibleUnderscore = false;
      underscore.text("|");
    } else {
      visibleUnderscore = true;
      underscore.text("");
    }
    title.text(txt);
  }, 100);
}

function zoomCameraIn(position) {
  var clock = new THREE.Clock();
  controls.enabled = true;
  controls.update();
  clock.start();
  var zoom = setInterval(function() {
    camera.position.lerp(position, 0.05);
  }, 5);
  if (camera.position.length < 0.1) {
      clearInterval(zoom);
  }
}

function showMsg() {
  var text = `
Chère Sofiya, aujourd'hui c'est Noël, un temps de partage et de fêtes. Pour cette raison, je veux te faire part de mon temps pour t'exprimer mes aveux comme cadeau. J'espère que la joie tourne autour de toi ces temps-ci et que les années qui suivront au début de cette nouvelle décennie te marquent avec des moments mémorables en compagnie des amis et de la famille. Ainsi, tes rêves et souhaits pourront se réaliser. Merci aussi d'avoir été une personne magnifique. Tu ne le sais peut-être pas, mais tu es l'étoile qui a illuminé mon année. Cela m'est dur d'imaginer ces derniers mois sans toi. Pourtant, parfois, j'ai l'impression qu'on est des étrangers. Cela me rend triste de ne pas avoir pu mieux te connaître à cause de mes sottises. À vrai dire, même si les choses sont comme elles le sont, j'adresserai mon voeu de Nouvel An à ton égard et cela du profonds et sincère de mon coeur. Merci, et désolé d'avoir été un idiot qui ne t'a pas compris. Joyeux Noël!

P. S. Tu devrais sourire plus. Ça te va bien.
  `;
  var container = $('<div>', {"class": "msg-container"});
  var msg = $('<span>', {"class": "title"});
  var signature = $('<div>')
  signature.text("- Eduard Anton");
  signature.css("text-align: left; color: blue; ");
  msg.text(text);
  container.append(msg);
  container.append(signature);
  $('body').append(container);
};

gameLoop();
