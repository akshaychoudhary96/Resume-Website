// Scene
var scene = new THREE.Scene();

var width = window.innerWidth;
var height = window.innerHeight;
// Camera
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

// Renderer
var renderer = new THREE.WebGLRenderer({ antialias: true});

renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})

///////////////////////////////////////////

//var axes = new THREE.AxisHelper( 20 );
//scene.add(axes);

// Add Russian Flag for language selection
var russianFlagGeo = new THREE.PlaneGeometry(15,10);
var russianFlagTex = new THREE.TextureLoader().load('../resources/img/russian_flag.png')
var russianFlagMat = new THREE.MeshLambertMaterial({map: russianFlagTex});
var russianFlag = new THREE.Mesh(russianFlagGeo, russianFlagMat);
russianFlag.position.z = -30;
russianFlag.position.x = 30;
russianFlag.position.y = 20;
russianFlag.castShadow = true;
russianFlag.receiveShadow = true;
scene.add(russianFlag)

// Add American Flag for language selection
var americanFlagGeo = new THREE.PlaneGeometry(15,10);
var americanFlagTex = new THREE.TextureLoader().load('../resources/img/american_flag.png')
var americanFlagMat = new THREE.MeshLambertMaterial({map: americanFlagTex});
var americanFlag = new THREE.Mesh(americanFlagGeo, americanFlagMat);
americanFlag.position.z = -30;
americanFlag.position.x = 0;
americanFlag.position.y = 20;
americanFlag.castShadow = true;
americanFlag.receiveShadow = true;
scene.add(americanFlag)

// Add text for user to choose language
var planeTextGeo = new THREE.PlaneGeometry(15,10);
var planeTextTex = new THREE.TextureLoader().load('../resources/img/text.png')
var planeTextMat = new THREE.MeshLambertMaterial({map: planeTextTex});
var planeText = new THREE.Mesh(planeTextGeo, planeTextMat);
planeText.position.z = -30;
planeText.position.x = 15;
planeText.position.y = 7;
planeText.castShadow = true;
planeText.receiveShadow = true;
scene.add(planeText)

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(70,100);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var plane = new THREE.Mesh(planeGeometry,planeMaterial);
plane.receiveShadow = true;

// rotate and position the plane
plane.rotation.x=-0.5*Math.PI;
plane.position.x=15;
plane.position.y=0;
plane.position.z=-30;

// add the plane to the scene
scene.add(plane);

// Add left plane for cube
var leftPlaneGeometry = new THREE.PlaneGeometry(60,100);
var leftPlaneMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var leftPlane = new THREE.Mesh(leftPlaneGeometry,leftPlaneMaterial);
leftPlane.position.x=-10;
leftPlane.position.y=20;
leftPlane.position.z=-20;
leftPlane.rotation.y = 1.5;
leftPlane.rotation.x = 1.7;
leftPlane.castShadow = false;
leftPlane.receiveShadow = true;
scene.add(leftPlane);

// Add right plane for cube
var rightPlaneGeometry = new THREE.PlaneGeometry(60,100);
var rightPlaneMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var rightPlane = new THREE.Mesh(rightPlaneGeometry,rightPlaneMaterial);
rightPlane.position.x= 47;
rightPlane.position.y= 20;
rightPlane.position.z= -20;
rightPlane.rotation.y = 4.8;
rightPlane.rotation.x = 1.7;
rightPlane.castShadow = false;
rightPlane.receiveShadow = true;
scene.add(rightPlane);

// Add back plane for cube
var backPlaneGeo = new THREE.PlaneGeometry(60,100);
var backPlaneMat = new THREE.MeshLambertMaterial({color: 0xffffff});
var backPlane = new THREE.Mesh(backPlaneGeo,backPlaneMat);
backPlane.receiveShadow = true;
backPlane.position.z = -40;
backPlane.position.x = 10;
backPlane.position.y = 20;
backPlane.rotation.z = 1.6;
backPlane.castShadow = false;
backPlane.receiveShadow = true;
scene.add(backPlane);

// Small geometric cube sitting in space
var geometry2 = new THREE.CubeGeometry(4, 4, 4); // always has geometry
var material2 = new THREE.MeshLambertMaterial({ color: 0xff0000}); // always has a mesh
var cube2 = new THREE.Mesh(geometry2, material2); // always need to add both together
cube2.position.x = -4;
cube2.position.y = 3;
cube2.position.z = 2;
cube2.castShadow = true;
cube2.receiveShadow = false;
scene.add(cube2); // then add to scene

// Small geomeetric sphere sitting in space
var sphereGeometry = new THREE.SphereGeometry(3,20,20);
var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

// position the sphere
sphere.position.x=30;
sphere.position.y=4;
sphere.position.z=2;
sphere.castShadow = true;
sphere.receiveShadow = false;

// add the sphere to the scene
scene.add(sphere);

// position and point the camera to the center of the scene
camera.position.x = 10;
camera.position.y = 5;
camera.position.z = 35;
camera.rotation.x = .10;
camera.rotation.y = -.05;
//camera.lookAt(scene.position);

// Spotlight
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(40, 20, 10);
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = .05;
spotLight.shadow.camera.far = 50;
//spotLight.shadow.camera.fov = 30;

scene.add(spotLight);
//scene.add(spotLight.target);

// Second spotlight
var spotLight2 = new THREE.SpotLight(0xffffff);
spotLight2.position.set(-5, 40, -10);
spotLight2.castShadow = true;

spotLight2.shadow.mapSize.width = 1024;
spotLight2.shadow.mapSize.height = 1024;

spotLight2.shadow.camera.near = .05;
spotLight2.shadow.camera.far = 50;
//spotLight.shadow.camera.fov = 30;

scene.add(spotLight2);
//scene.add(spotLight2.target);

//spotLight.target = cube2;

// Ambient light
var ambientLight = new THREE.AmbientLight( 0x000000, 1);
scene.add(ambientLight)

var spotLightHelper = new THREE.SpotLightHelper(spotLight);
//scene.add(spotLightHelper);

var spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
//scene.add(spotLightHelper2);

// Enable for mouse interaction
var raycaster = new THREE.Raycaster();

// Create for mouse being used in 2d-space
var mouse = new THREE.Vector2(), INTERSECTED;
var touchTest = new THREE.Vector2(), TOUCHINTERSECTED;

// Letting the program know where the mouse is located on canvas
function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = - (event.clientY / height) * 2 + 1;
}

// Program knows where the mouse clicks.
function onMouseDown(event){
    event.preventDefault();
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = - (event.clientY / height) * 2 + 1;

    raycaster.setFromCamera(mouse,camera);
    var intersectAmericanFlag = raycaster.intersectObject(americanFlag, true);
    for (var i = 0; i < intersectAmericanFlag.length; i++) {
        console.log(intersectAmericanFlag[i]);
        window.location.href='../index.html'
    }

    var intersectRussianFlag = raycaster.intersectObject(russianFlag, true);
    for (var i = 0; i < intersectRussianFlag.length; i++) {
        console.log(intersectRussianFlag[i]);
        window.location.href='../russian.html'
    }

}

function onTouchStart (event) {
    event.preventDefault();
    touchTest.x = (event.touches[0].clientX / width) * 2 - 1;
    touchTest.y = - (event.touches[0].clientY / height) * 2 + 1;

    raycaster.setFromCamera(touchTest,camera);
    var intersectAmericanFlag = raycaster.intersectObject(americanFlag, true);
    for (var i = 0; i < intersectAmericanFlag.length; i++) {
        window.location.href='../index.html'
    }

    var intersectRussianFlag = raycaster.intersectObject(russianFlag, true);
    for (var i = 0; i < intersectRussianFlag.length; i++) {
        window.location.href='../russian.html'
    }
}

function onTouchMove(event) {
    event.preventDefault();
    touchTest.x = (event.touches[0].clientX / width) * 2 - 1;
    touchTest.y = - (event.touches[0].clientY / height) * 2 + 1;

    raycaster.setFromCamera(touchTest,camera);
    var intersectObjects = raycaster.intersectObjects([cube2, sphere, russianFlag, americanFlag, planeText], true);
    for (var i = 0; i < intersectObjects.length; i++) {
        console.log(intersectObjects[i]);
        spotLight.target = intersectObjects[i].object;
        spotLight2.target = intersectObjects[i].object;
    }
}

function onTouchEnd(event) {
    event.preventDefault();
    touchTest.x = (event.touches[0].clientX / width) * 2 - 1;
    touchTest.y = - (event.touches[0].clientY / height) * 2 + 1;

    raycaster.setFromCamera(touchTest,camera);
    var intersectAmericanFlag = raycaster.intersectObject(americanFlag, true);
    for (var i = 0; i < intersectAmericanFlag.length; i++) {
        console.log(intersectAmericanFlag[i]);
        window.location.href='https://www.google.com'
    }

    var intersectRussianFlag = raycaster.intersectObject(russianFlag, true);
    for (var i = 0; i < intersectRussianFlag.length; i++) {
        console.log(intersectRussianFlag[i]);
        window.location.href='https://www.microsoft.com'
    }
}

// Function for animating
var animate = function() {
    requestAnimationFrame(animate);
    //cube.rotation.x +=0.01;
    //cube.rotation.y +=0.01;
    render();
}
 // Function for rendering
var render = function() {
    camera.updateProjectionMatrix();
    raycaster.setFromCamera(mouse,camera);

    var intersects = raycaster.intersectObjects([cube2, sphere, russianFlag, americanFlag, planeText]);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            //INTERSECTED.material.emissive.setHex(0xdddddd);
            spotLight.target = intersects[0].object;
            spotLight2.target = intersects[0].object;
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;
    }

    renderer.render(scene, camera);

}

// Used for calling the functions and javascript equivalents.
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('touchstart', onTouchStart, false);
window.addEventListener('touchmove', onTouchMove, false);
//window.addEventListener('touchend', onTouchEnd, false);
animate();
//renderer.setClearColorHex(0xEEEEEE);
//renderer.render(scene, camera);