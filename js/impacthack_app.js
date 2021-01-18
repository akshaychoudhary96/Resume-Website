// DATA RETRIEVAL
// Used in obtaining the local data (stored in JSON files)

// Historical timeline data
diplomacy_timeline = [];

var xhttp3 = new XMLHttpRequest();
xhttp3.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(xhttp3.responseText);
        let output = Object.values(response);
        for (let i = 0; i < output.length; i++) {
            diplomacy_timeline.push(output[i]);
        }
    }
};
xhttp3.open("GET", "data/Diplomacy_Timeline.json", true);
xhttp3.send();

// Data with posts, country, etc.
embassy_data = [];
var xhttp2 = new XMLHttpRequest();
xhttp2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(xhttp2.responseText);
        let output = Object.values(response);
        for (let i = 0; i < output.length; i++) {
            embassy_data.push(output[i]);
        }
    }
};
xhttp2.open("GET", "data/Final_data.json", false);
xhttp2.send();

// Embassy timeline data
timelineData = [];
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(xhttp.responseText);
        let output = Object.values(response);
        for (let i = 0; i < output.length; i++) {
            timelineData.push(output[i]);
        }
    }
};
xhttp.open("GET", "data/Embassy_Timeline.json", true);
xhttp.send();

// CREATING THREEJS ENVIRONMENT
// This is the beginning of where the scene is setup, for the insertion of data.

// Create environment where objects are displayed
let scene = new THREE.Scene();

// Create camera to view objects
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Create renderer so objects can be placed in scene (set antialias to true for smooth-edges)
let renderer = new THREE.WebGLRenderer( {antialias: true} );

// Have renderer be the size of entire window's width/height
renderer.setSize( window.innerWidth, window.innerHeight );

// Create controls for user to interact with environment (scene)
let controls = new THREE.OrbitControls( camera, renderer.domElement );

// Append this renderer to the HTML DOM element
document.body.appendChild( renderer.domElement );

// Some generic global variables used for lights, interaction, etc.
// Lights is an array used for the entire scene
let lights = [];

// Raycaster used for mouse interaction of the scene
let raycaster = new THREE.Raycaster();

// Mouse is a 2D-vector which takes X,Y coords so window/scene knows where it is located
// for interactivity
let mouse = new THREE.Vector2();

// TouchTest is a variable used for responsive-environment(mobile devices)
let touchTest = new THREE.Vector2();

// CREATE THE EARTH
// Earthmap is used for the basic texture which has the various continents/countries/etc. on it
let earthMap = new THREE.TextureLoader().load( '../resources/img/earthmap4k.jpg' );

// EarthBumpMap is used to give the texture some "depth" so it is more appealing on eyes and data visuals
let earthBumpMap = new THREE.TextureLoader().load( '../resources/img/earthbump4k.jpg' );

// EarthSpecMap gives the earth some shininess to the environment, allowing reflectivity off of lights
let earthSpecMap = new THREE.TextureLoader().load( '../resources/img/earthspec4k.jpg' );

// Geometry is what the shape/size of the globe will be
let geometry = new THREE.SphereGeometry( 10, 32, 32 );

// Material is how the globe will look like
let material = new THREE.MeshPhongMaterial({
    map: earthMap,
    bumpMap: earthBumpMap,
    bumpScale: 0.10,
    specularMap: earthSpecMap,
    specular: new THREE.Color('grey')
});

// Sphere is the final product which ends up being rendered on scene, also is used as a parent for the points of interest
let sphere = new THREE.Mesh( geometry, material );

// Add the sphere to scene
scene.add( sphere );

// Parent is used for the historical timeline, which we append the photos' canvases to
let parent = new THREE.Object3D();

// Set the position for more centered scene
parent.position.y = 60;

// Add the object to the scene
scene.add( parent );

// CreateSkyBox allows the scene to have more attractiveness to it, in this case by having the blue starred images around globe
createSkyBox = (scene) => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '../resources/img/space_right.png',
        '../resources/img/space_left.png',
        '../resources/img/space_top.png',
        '../resources/img/space_bot.png',
        '../resources/img/space_front.png',
        '../resources/img/space_back.png',
    ])
    scene.background = texture;
};

// CreateLights is a function which creates the lights and adds them to the scene.
createLights = (scene) => {
    lights[0] = new THREE.PointLight(0x00FFFF, .3, 0);
    lights[1] = new THREE.PointLight(0x00FFFF, .4, 0);
    lights[2] = new THREE.PointLight(0x00FFFF, .7, 0);
    lights[3] = new THREE.AmbientLight( 0x706570 );
    
    lights[0].position.set(0, 200, 0);
    lights[1].position.set(200, 100, 400);
    lights[2].position.set(-200, -200, -50);
    
    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
    scene.add(lights[3]);
};

// AddSceneObjects adds the items to the scene
addSceneObjects = (scene, camera, renderer) => {
    createSkyBox(scene);
    createLights(scene);
};

// Calling the function to create and add to scene
addSceneObjects(scene, camera, renderer);

// Change position so we can see objects
camera.position.z = 20;

// Disable control function, so users do not zoom too far in or pan away from center
controls.minDistance = 12;
controls.maxDistance = 30;
controls.enablePan = false;
controls.update();
controls.saveState();

let isHistory = false;
let isOther = true;

// Removes the points of interest and photos from scene, freeing up memory and space to have better performance
function removeChildren(){
    let destroy = sphere.children.length;
    while (destroy--) {
        sphere.remove(sphere.children[destroy]);
    }
    if(parent.children.length > 0){
        let destoyer = parent.children.length;
        while(destoyer--) {
            parent.children.length;
        }
    }
}

// Adds the points of interest to globe, along with other information which is used to display in HTML elements
addTimelineCoord = (sphere, latitude, longitude, color, country, establish_legation, elevate_to_embassy, establish_embassy, closure, reopen_legation, reopen_embassy) => {
    if (country == 'Austria') {
        let particleGeo = new THREE.SphereGeometry(.11, 32, 32);
        let lat = latitude * (Math.PI/180);
        let lon = -longitude * (Math.PI/180);
        const radius = 10;
        const phi   = (90-lat)*(Math.PI/180);
        const theta = (lon+180)*(Math.PI/180);
    
        var material = new THREE.MeshBasicMaterial({
            color: color
        });
    
        let mesh = new THREE.Mesh(
            particleGeo,
            material 
        );
    
        mesh.position.set(
            Math.cos(lat) * Math.cos(lon) * radius,
            Math.sin(lat) * radius,
            Math.cos(lat) * Math.sin(lon) * radius
        );
    
        mesh.rotation.set(0.0, -lon,lat-Math.PI*0.5);
        mesh.userData.country = country;
        mesh.userData.establish_legation = establish_legation;
        mesh.userData.elevate_to_embassy = elevate_to_embassy;
        mesh.userData.establish_embassy = establish_embassy;
        mesh.userData.closure = closure;
        mesh.userData.reopen_legation = reopen_legation;
        mesh.userData.reopen_embassy = reopen_embassy;
        sphere.add(mesh);
    } else {
        let particleGeo = new THREE.SphereGeometry(.1, 32, 32);
        let lat = latitude * (Math.PI/180);
        let lon = -longitude * (Math.PI/180);
        const radius = 10;
        const phi   = (90-lat)*(Math.PI/180);
        const theta = (lon+180)*(Math.PI/180);
    
        var material = new THREE.MeshBasicMaterial({
            color: color
        });
    
        let mesh = new THREE.Mesh(
            particleGeo,
            material 
        );
    
        mesh.position.set(
            Math.cos(lat) * Math.cos(lon) * radius,
            Math.sin(lat) * radius,
            Math.cos(lat) * Math.sin(lon) * radius
        );
    
        mesh.rotation.set(0.0, -lon,lat-Math.PI*0.5);
        mesh.userData.country = country;
        mesh.userData.establish_legation = establish_legation;
        mesh.userData.elevate_to_embassy = elevate_to_embassy;
        mesh.userData.establish_embassy = establish_embassy;
        mesh.userData.closure = closure;
        mesh.userData.reopen_legation = reopen_legation;
        mesh.userData.reopen_embassy = reopen_embassy;
        sphere.add(mesh);
    }
};

// Adds the points of interest in a "timeseries" manner, so users can see the diplomatic timeline as it progresses
function addTimeline(e) {
    removeChildren();
    var target = e.target;
    for (let i = 0; i < timelineData.length; i++) {
        if (
            (
                timelineData[i].reopen_embassy <= target.value && timelineData[i].reopen_embassy != '0') 
            ){
                addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#fecf6a', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        }
        else if (
            (
                timelineData[i].elevate_to_embassy <= target.value && timelineData[i].elevate_to_embassy > timelineData[i].closure && timelineData[i].elevate_to_embassy != '0')
            | (timelineData[i].elevate_to_embassy <= target.value && target.value < timelineData[i].closure && timelineData[i].elevate_to_embassy != '0')
            ) 
        {
            addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#fecf6a', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        }
        else if (
            (
                timelineData[i].establish_embassy <= target.value && timelineData[i].establish_embassy > timelineData[i].closure && timelineData[i].establish_embassy != '0')
            ||  (timelineData[i].establish_embassy <= target.value && target.value < timelineData[i].closure && timelineData[i].establish_embassy != '0')    
            ){
                addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#fecf6a', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        } else if (
            (
                timelineData[i].reopen_legation <= target.value && timelineData[i].reopen_legation > timelineData[i].closure && timelineData[i].reopen_legation != '0')
            //||  (timelineData[i].reopen_legation <= target.value && target.value < timelineData[i].closure && timelineData[i].reopen_legation != '0')    
            ){
                addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#0066FF', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        } else if (
            (
                timelineData[i].closure <= target.value && target.value < timelineData[i].reopen_legation && timelineData[i].reopen_legation != '0' && timelineData[i].closure !='0') 
            || (timelineData[i].closure <= target.value && target.value < timelineData[i].reopen_embassy && timelineData[i].reopen_embassy != '0' && timelineData[i].closure !='0')
            || (timelineData[i].closure <= target.value && target.value < timelineData[i].establish_embassy && timelineData[i].establish_embassy != '0' && timelineData[i].closure !='0')
            || (timelineData[i].closure <= target.value && target.value < timelineData[i].elevate_to_embassy && timelineData[i].elevate_to_embassy != '0' && timelineData[i].closure !='0')
            || (timelineData[i].closure <= target.value && target.value > timelineData[i].establish_legation && timelineData[i].establish_legation != '0' && timelineData[i].closure !='0')
            || (timelineData[i].closure <= target.value && timelineData[i].elevate_to_embassy == '0' && timelineData[i].reopen_embassy == '0' && timelineData[i].reopen_legation == '0' && timelineData[i].closure !='0')
            ){
                addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#df1c1c', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        } else if (
            (
                timelineData[i].establish_legation <= target.value && timelineData[i].establish_legation != '0') 
            ){
                addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, 'white', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        }
    }
    console.log(sphere.children.length)
}

addEmbassyCoord = (sphere, latitude, longitude, color, post, bureau, country, language, status, social_url, embassy_url) => {
    let particleGeo = new THREE.SphereGeometry(.1, 32, 32);
    let lat = latitude * (Math.PI/180);
    let lon = -longitude * (Math.PI/180);
    const radius = 10;
    const phi   = (90-lat)*(Math.PI/180);
    const theta = (lon+180)*(Math.PI/180);

    var material = new THREE.MeshBasicMaterial({
		color: color
	});

    let mesh = new THREE.Mesh(
		particleGeo,
		material 
    );

    mesh.position.set(
        Math.cos(lat) * Math.cos(lon) * radius,
        Math.sin(lat) * radius,
        Math.cos(lat) * Math.sin(lon) * radius
    );

    mesh.rotation.set(0.0, -lon,lat-Math.PI*0.5);
    mesh.userData.post = post;
    mesh.userData.bureau = bureau;
    mesh.userData.country = country;
    mesh.userData.language = language;
    mesh.userData.status = status;
    mesh.userData.color = color;
    mesh.userData.social_url = social_url;
    mesh.userData.embassy_url = embassy_url;
    sphere.add(mesh);
};

// If user changes window size, this allows scene to update accordingly (maintaining aspect ratio)
onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

// Allows for the scene to move and be interacted with
animate = () => {
    requestAnimationFrame( animate );
    render();
    controls.update();   
}

// Updates camera renderer
render = () => {
    renderer.render( scene, camera );
}

// Used for the interaction of scene, so users can click on points of interest or photos for information
onMouseClick = (event) => {
    event.preventDefault();
    mouse.x = ((event.clientX / window.innerWidth) * 2 - 1);
    mouse.y = (-(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);

    if(isOther == true){
        let intersects = raycaster.intersectObjects(sphere.children);
        for (var i = 0; i < intersects.length; i++) {
            document.querySelector('#country').innerText = "Point of Interest: " + intersects[0].object.userData.country
            document.querySelector('#establish-legation').innerText = "Established Legation: " + intersects[0].object.userData.establish_legation
            document.querySelector('#elevate-to-embassy').innerText = "Elevated to Embassy: " + intersects[0].object.userData.elevate_to_embassy
            document.querySelector('#establish-embassy').innerText = "Established Embassy: " + intersects[0].object.userData.establish_embassy
            document.querySelector('#closure').innerText = "Closed: " + intersects[0].object.userData.closure
            document.querySelector('#reopen-legation').innerText = "Reopened Legation: " + intersects[0].object.userData.reopen_legation
            document.querySelector('#reopen-embassy').innerText = "Reopened Embassy: " + intersects[0].object.userData.reopen_embassy
        }
        for (var i = 0; i < intersects.length; i++) {
            document.querySelector('#bureau').innerText = "Bureau: " + intersects[0].object.userData.bureau
            document.getElementById("bureau").style.color = intersects[0].object.userData.color;
            document.querySelector('#post').innerText = "Post: " + intersects[0].object.userData.post
            document.querySelector('#country-two').innerText = "Country: " + intersects[0].object.userData.country
            document.querySelector('#language').innerText = "Languages: " + intersects[0].object.userData.language
            document.querySelector('#status').innerText = "Status: " + intersects[0].object.userData.status
            document.getElementById('more-info-box').style.display = 'flex';
            document.querySelector("#social-url").setAttribute("href", intersects[0].object.userData.social_url);
            document.querySelector("#embassy-url").setAttribute("href", intersects[0].object.userData.embassy_url);
        }
        const item = intersects[0];
        var point = item.point;
        var camDistance = camera.position.copy(point).normalize.multiplyScalar(camDistance)
        controls.update();
    }
    else if(isHistory == true) {
        let intersects = raycaster.intersectObjects(parent.children);
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[0].object.userData.source_2 == '') {
                    document.querySelector('#source-1').style.display = 'flex';
                    document.querySelector('#source-2').style.display = 'none';
                    console.log(intersects[0])
                    document.querySelector('#date-1').innerText = intersects[0].object.userData.date;
                    document.querySelector('#event').innerText = intersects[0].object.userData.event;
                    document.querySelector("#source-1").setAttribute("href", intersects[0].object.userData.source);
                    document.querySelector("#source-1").innerText = intersects[0].object.userData.type_1;

            } else {
                document.querySelector('#source-2').style.display = 'flex';
                document.querySelector('#source-1').style.display = 'flex';
                for (var i = 0; i < intersects.length; i++) {
                    console.log(intersects[0])
                    document.querySelector('#date-1').innerText = intersects[0].object.userData.date + " - " + intersects[0].object.userData.date_2;
                    document.querySelector('#event').innerText = intersects[0].object.userData.event; 
                    document.querySelector("#source-1").setAttribute("href", intersects[0].object.userData.source);
                    document.querySelector("#source-2").setAttribute("href", intersects[0].object.userData.source_2);
                    document.querySelector("#source-1").innerText = intersects[0].object.userData.type_1;
                    document.querySelector("#source-2").innerText = intersects[0].object.userData.type_2;
                }
            }
            const item = intersects[0];
            var point = item.point;
            var camDistance = camera.position.copy(point).normalize.multiplyScalar(camDistance)
            controls.update();
        }
    }
}

// Functions for clicking on buttons
sourceOneFunc = () => {
    window.open(document.querySelector("#source-1").getAttribute("href"), "_blank")
}
sourceTwoFunc = () => {
    window.open(document.querySelector("#source-2").getAttribute("href"), "_blank")
}
socialUrlFunc = () => {
    window.open(document.querySelector("#social-url").getAttribute("href"), "_blank")
}
embassyUrlFunc = () => {
    window.open(document.querySelector("#embassy-url").getAttribute("href"), "_blank")
}

let hidden = false;
instructionFunc = () => {
    hidden = !hidden;
    if(hidden){
        document.querySelector("#help-box").style.display = 'none'
    } else {
        document.querySelector("#help-box").style.display = 'flex'
    }
}

// Same as previous function but for mboile/responsive devices
function onTouchStart (event) {

    event.preventDefault();
    touchTest.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    touchTest.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(touchTest,camera);
    if(isOther == true) {
        let intersects = raycaster.intersectObjects(sphere.children);

        for (var i = 0; i < intersects.length; i++) {
            document.querySelector('#country').innerText = "Point of Interest: " + intersects[0].object.userData.country
            document.querySelector('#establish-legation').innerText = "Established Legation: " + intersects[0].object.userData.establish_legation
            document.querySelector('#elevate-to-embassy').innerText = "Elevated to Embassy: " + intersects[0].object.userData.elevate_to_embassy
            document.querySelector('#establish-embassy').innerText = "Established Embassy: " + intersects[0].object.userData.establish_embassy
            document.querySelector('#closure').innerText = "Closed: " + intersects[0].object.userData.closure
            document.querySelector('#reopen-legation').innerText = "Reopened Legation: " + intersects[0].object.userData.reopen_legation
            document.querySelector('#reopen-embassy').innerText = "Reopened Embassy: " + intersects[0].object.userData.reopen_embassy
        }
        for (var i = 0; i < intersects.length; i++) {
            document.querySelector('#bureau').innerText = "Bureau: " + intersects[0].object.userData.bureau
            document.getElementById("bureau").style.color = intersects[0].object.userData.color;
            document.querySelector('#post').innerText = "Post: " + intersects[0].object.userData.post
            document.querySelector('#country-two').innerText = "Country: " + intersects[0].object.userData.country
            document.querySelector('#language').innerText = "Languages: " + intersects[0].object.userData.language
            document.querySelector('#status').innerText = "Status: " + intersects[0].object.userData.status
            document.getElementById('more-info-box').style.display = 'flex';
            document.querySelector("#social-url").setAttribute("href", intersects[0].object.userData.social_url);
            document.querySelector("#embassy-url").setAttribute("href", intersects[0].object.userData.embassy_url);
        }
        const item = intersects[0];
        var point = item.point;
        var camDistance = camera.position.copy(point).normalize.multiplyScalar(camDistance)
        controls.update();
    }
    else if (isHistory == true){
        let intersects = raycaster.intersectObjects(parent.children);
        if (intersects[0].object.userData.source_2 == '') {
            document.querySelector('#source-1').style.display = 'flex';
            for (var i = 0; i < intersects.length; i++) {
                console.log(intersects[0])
                document.querySelector('#date-1').innerText = intersects[0].object.userData.date;
                document.querySelector('#event').innerText = intersects[0].object.userData.event;
                document.querySelector("#source-1").setAttribute("href", intersects[0].object.userData.source);
                document.querySelector("#source-1").innerText = intersects[0].object.userData.type_1;
                
            }
        }
        else {
            document.querySelector('#source-2').style.display = 'flex';
            document.querySelector('#source-1').style.display = 'flex';
            for (var i = 0; i < intersects.length; i++) {
                console.log(intersects[0])
                document.querySelector('#date-1').innerText = intersects[0].object.userData.date + " - " + intersects[0].object.userData.date_2;
                document.querySelector('#event').innerText = intersects[0].object.userData.event;
                document.querySelector("#source-1").setAttribute("href", intersects[0].object.userData.source);
                document.querySelector("#source-2").setAttribute("href", intersects[0].object.userData.source_2);
                document.querySelector("#source-1").innerText = intersects[0].object.userData.type_1;
                document.querySelector("#source-2").innerText = intersects[0].object.userData.type_2;             
            }
        }
        const item = intersects[0];
        var point = item.point;
        var camDistance = camera.position.copy(point).normalize.multiplyScalar(camDistance)
        controls.update();
    }
}

// This takes the information input by user in timeline so the globe updates when number changes
let slider = document.getElementById("slider");
slider.addEventListener("input", addTimeline);

// Set the other div's to none, so the main content is only seen
document.getElementById('info-box').style.display = 'none';
document.getElementById('info-box-two').style.display = 'none';
document.getElementById('diplomacy-box').style.display = 'none';
document.getElementById('more-info-box').style.display = 'none';

// Add event listeners so DOM knows what functions to use when objects/items are interacted with
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', onMouseClick, false);
window.addEventListener('touchstart', onTouchStart, false);

// These three variables are used for changing the scene based upon user input
let embassyStuff = document.getElementById("embassy");
embassyStuff.addEventListener("click", changeToEmbassy);

let timelineStuff = document.getElementById("timeline");
timelineStuff.addEventListener("click", changeToTimeline);

let historyStuff = document.getElementById("history");
historyStuff.addEventListener("click", changeToHistory);

// Call the animation function so scene is properly rendered
animate();

// This changes the scenes children to focus on the globe with wmbassies
function changeToEmbassy() {
    hidden = true;
    document.querySelector("#help-box").style.display = 'none'
    document.querySelector("#more-info-box").style.display = 'none'
    document.querySelector("#title-subtitle").style.display = 'none'
    if(isOther != true) {
        isOther = true;
        isHistory = false;
    }
    removeChildren();
    document.querySelector('#bureau').innerText = "Bureau: ";
    document.querySelector('#post').innerText = "Post: ";
    document.querySelector('#country-two').innerText = "Country: ";
    document.querySelector('#language').innerText = "Languages: ";
    document.querySelector('#status').innerText = "Status: ";
    document.getElementById('info-box-two').style.display = 'flex';
    document.getElementById('info-box').style.display = 'none';
    document.getElementById('diplomacy-box').style.display = 'none';
    document.getElementById('title-subtitle').style.right = '0';
    document.getElementById('title-subtitle').style.top = '3vh';
    document.getElementById('title-subtitle').style.width = '20vw';
    document.getElementById('title-subtitle').style.height = '12.5vh';    
    document.getElementById('main-title').style.fontSize = '25pt';    
    document.getElementById('main-subtitle').style.fontSize = '15pt'; 
    document.getElementById("history").style.backgroundColor = "white";
    document.getElementById("history").style.color = "black"; 
    document.getElementById("timeline").style.backgroundColor = "white";
    document.getElementById("timeline").style.color = "black"; 
    document.getElementById("embassy").style.backgroundColor = "black";
    document.getElementById("embassy").style.color = "white"; 

    // Get the data from JSON file
    for(let i = 0; i < embassy_data.length; i++){
        if(embassy_data[i].Bureau==='EUR'){
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'deepskyblue', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status, embassy_data[i].Social, embassy_data[i].Embassy_Url);
        } else if(embassy_data[i].Bureau==='NEA') {
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'orange', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status, embassy_data[i].Social, embassy_data[i].Embassy_Url);
        } else if(embassy_data[i].Bureau==='SCA') {
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'yellow', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status, embassy_data[i].Social, embassy_data[i].Embassy_Url);
        } else if(embassy_data[i].Bureau==='EAP') {
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'violet', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status, embassy_data[i].Social, embassy_data[i].Embassy_Url);
        } else if(embassy_data[i].Bureau==='AF') {
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'pink', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status, embassy_data[i].Social, embassy_data[i].Embassy_Url);
        } else if (embassy_data[i].Bureau==='WHA') {
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'white', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status, embassy_data[i].Social, embassy_data[i].Embassy_Url);
        }
    }
    if(camera.fov != 75){
        camera.fov = 75;
        camera.near = 0.1;
        camera.far = 1000;
        camera.updateProjectionMatrix();
        controls.enableZoom = true;
        controls.minDistance = 12;
        controls.maxDistance = 30;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI;
        controls.reset();
        controls.update();
    }
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.reset();
    controls.update();
};

// This changes scenes children to focus on historical diplomacy
function changeToTimeline() {
    hidden = true;
    document.querySelector("#help-box").style.display = 'none'
    document.getElementById('more-info-box').style.display = 'none';
    document.querySelector("#title-subtitle").style.display = 'none'
    if(isOther != true) {
        isOther = true;
        isHistory = false;
    }
    removeChildren();
    document.querySelector('#country').innerText = "Point of Interest: ";
    document.querySelector('#establish-legation').innerText = "Established Legation: ";
    document.querySelector('#elevate-to-embassy').innerText = "Elevated to Embassy: ";
    document.querySelector('#establish-embassy').innerText = "Established Embassy: ";
    document.querySelector('#closure').innerText = "Closed: ";
    document.querySelector('#reopen-legation').innerText = "Reopened Legation: ";
    document.querySelector('#reopen-embassy').innerText = "Reopened Embassy: ";
    document.getElementById('info-box-two').style.display = 'none';
    document.getElementById('info-box').style.display = 'flex';
    document.getElementById('diplomacy-box').style.display = 'none';
    document.getElementById('title-subtitle').style.right = '0';
    document.getElementById('title-subtitle').style.top = '3vh';
    document.getElementById('title-subtitle').style.width = '20vw';
    document.getElementById('title-subtitle').style.height = '12.5vh';    
    document.getElementById('main-title').style.fontSize = '25pt';    
    document.getElementById('main-subtitle').style.fontSize = '15pt'; 
    document.getElementById("history").style.backgroundColor = "white";
    document.getElementById("history").style.color = "black"; 
    document.getElementById("embassy").style.backgroundColor = "white";
    document.getElementById("embassy").style.color = "black"; 
    document.getElementById("timeline").style.backgroundColor = "black";
    document.getElementById("timeline").style.color = "white"; 


    if(camera.fov != 75){
        camera.fov = 75;
        camera.near = 0.1;
        camera.far = 1000;
        camera.updateProjectionMatrix();
        controls.enableZoom = true;
        controls.minDistance = 12;
        controls.maxDistance = 30;
        controls.maxPolarAngle = Math.PI;
        controls.minPolarAngle = 0;
        controls.reset();
        controls.update();
    }
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.reset();
    controls.update();
};


// This changes the scenes children to be rendering the historical timeline.
function changeToHistory() {
    hidden = true;
    document.querySelector("#help-box").style.display = 'none'
    document.getElementById('more-info-box').style.display = 'none';
    document.querySelector("#title-subtitle").style.display = 'none'
    if(isHistory != true){
        isHistory = true;
        isOther = false;
    }
    document.getElementById('info-box-two').style.display = 'none';
    document.getElementById('info-box').style.display = 'none';
    document.getElementById('diplomacy-box').style.display = 'flex';
    document.getElementById('title-subtitle').style.right = '0';
    document.getElementById('title-subtitle').style.top = '3vh';
    document.getElementById('title-subtitle').style.width = '20vw';
    document.getElementById('title-subtitle').style.height = '12.5vh';    
    document.getElementById('main-title').style.fontSize = '25pt';    
    document.getElementById('main-subtitle').style.fontSize = '15pt';
    document.getElementById("timeline").style.backgroundColor = "white";
    document.getElementById("timeline").style.color = "black"; 
    document.getElementById("embassy").style.backgroundColor = "white";
    document.getElementById("embassy").style.color = "black"; 
    document.getElementById("history").style.backgroundColor = "black";
    document.getElementById("history").style.color = "white";    

    removeChildren();
    if(camera.fov != 65){
        camera.fov = 65;
        camera.near = 0.001;
        camera.far = 1000;
        camera.position.y = 47;
        camera.position.z = 1535;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minDistance = 1535;
        controls.maxDistance = 1535;
        controls.maxPolarAngle = 1.54;
        controls.minPolarAngle = 1.54;
        controls.rotateSpeed = 0.5;
        controls.update();
    }
    document.querySelector('#source-1').style.display = 'none';
    document.querySelector('#source-2').style.display = 'none';

    var camSize = 100;
    var startAngle = 0;
    var circleRadius = 230;
    var diameter = circleRadius*4;
    var centerX = -5;
    var centerZ = 0.5;
    var targetRotation = 0;
    var targetRotationOnMouseDown = 0; 

    var mpi = Math.PI/180;
    var startRadians = startAngle + mpi;
    var total_length = 62;
    var incrementAngle = 360/total_length;
    var incrementRadians = incrementAngle * mpi;

    let arrayOfImages = {
        "0":"0.jpg",
        "1":"1.jpg",
        "2":"2.jpg",
        "3":"3.jpg",
        "4":"4.jpg",
        "5":"5.jpg",
        "6":"6.jpg",
        "7":"7.jpg",
        "8":"8.jpg",
        "9":"9.jpg",
        "10":"10.jpg",
        "11":"11.jpg",
        "12":"12.jpg",
        "13":"13.jpg",
        "14":"14.jpg",
        "15":"15.jpg",
        "16":"16.jpg",
        "17":"17.jpg",
        "18":"18.jpg",
        "19":"19.jpg",
        "20":"20.jpg",
        "21":"21.jpg",
        "22":"22.jpg",
        "23":"23.jpg",
        "24":"24.jpg",
        "25":"25.jpg",
        "26":"26.jpg",
        "27":"27.jpg",
        "28":"28.jpg",
        "29":"29.jpg",
        "30":"30.jpg",
        "31":"31.jpg",
        "32":"32.jpg",
        "33":"33.jpg",
        "34":"34.jpg",
        "35":"35.jpg",
        "36":"36.jpg",
        "37":"37.jpg",
        "38":"38.jpg",
        "39":"39.jpg",
        "40":"40.jpg",
        "41":"41.jpg",
        "42":"42.jpg",
        "43":"43.jpg",
        "44":"44.jpg",
        "45":"45.jpg",
        "46":"46.jpg",
        "47":"47.jpg",
        "48":"48.jpg",
        "49":"49.jpg",
        "50":"50.jpg",
        "51":"51.jpg",
        "52":"52.jpg",
        "53":"53.jpg",
        "54":"54.jpg",
        "55":"55.jpg",
        "56":"56.jpg",
        "57":"57.jpg",
        "58":"58.jpg",
        "59":"59.jpg",
        "60":"60.jpg",
        "61":"61.jpg"
    }

    // This adds the timeline data to the scene along with assigning other needed infor for div manipulation
    addTimelineData = (i,parent, date, date_2, event, source, source_2, type_1, type_2) => {
        let x_position = centerX + Math.sin(startRadians) * circleRadius * 6;
        let z_position = centerZ + Math.cos(startRadians) * circleRadius * 6;
            let loader = new THREE.TextureLoader();
            let texture = loader.load('img/'+arrayOfImages[i]);
            var mesh = new THREE.Mesh( 
                new THREE.PlaneGeometry( camSize, .95*camSize), 
                new THREE.MeshBasicMaterial( {  
                map: texture
            })
            );
        
            mesh.position.x = x_position;
            mesh.position.z = z_position;
        
            mesh.rotation.y = i*incrementAngle * (Math.PI/180.0);
            
            startRadians += incrementRadians;
            
            mesh.userData.date = date;
            mesh.userData.date_2 = date_2;
            mesh.userData.event = event;
            mesh.userData.source = source;
            mesh.userData.source_2 = source_2;
            mesh.userData.type_1 = type_1;
            mesh.userData.type_2 = type_2;

            parent.add( mesh ); 
    }

    for ( let i = 0; i < diplomacy_timeline.length; i++ ) {
        addTimelineData(i, parent, diplomacy_timeline[i].Date, diplomacy_timeline[i].Date_2, diplomacy_timeline[i].Event, diplomacy_timeline[i].Source_1, diplomacy_timeline[i].Source_2,diplomacy_timeline[i].Type_1, diplomacy_timeline[i].Type_2)
    }
    camera.updateProjectionMatrix();
}