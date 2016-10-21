// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


angular.module('starter', ['ionic'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs).
            // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
            // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
            // useful especially with forms, though we would prefer giving the user a little more room
            // to interact with the app.
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            var havePointerLock = 'pointerLockElement' in document ||
                'mozPointerLockElement' in document ||
                'webkitPointerLockElement' in document;

            document.requestPointerLock = document.requestPointerLock ||
                document.mozRequestPointerLock ||
                document.webkitRequestPointerLock;
            // Ask the browser to lock the pointer
            document.requestPointerLock();


            ionic.Platform.fullScreen();
            if (window.StatusBar) {
                return StatusBar.hide();
            }
        });
    })

    .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', function($scope, $ionicModal, $timeout) {
        $scope.showContent = false;
        $timeout(function() {
            $scope.showContent = true;

        }, 2500);

        $scope.data =
            [

                {
                    header: 'Mobile',
                    children: [
                        {
                            name: 'Shoutmap',
                            image: "/img/shoutmap-sm.png",
                            link: "http://www.theshoutmap.com"
                        },
                        {
                            name: 'Alpine Adventures',
                            image: "/img/alpine.png",
                            link: "http://alpineadventures.com/mobile/"
                        }]

                },
                {
                    header: 'Desktop',
                    children: [
                        {
                            name: 'Nicole Bee',
                            image: "/img/nicolebee.png",
                            link: "http://www.nicolebee.net"
                        },
                        {
                            name: 'Danktronics',
                            image: "/img/danktronics.png",
                            link: "http://www.danktronics.net"
                        }
                    ]
                },
                {
                    header: 'Tunes',
                    children: [
                        {
                            name: 'Soundcloud',
                            image: "/img/logoupdated.png",
                            link: "http://www.soundcloud.com/lycrabeats"
                        }
                    ]
                }

            ];




        $ionicModal.fromTemplateUrl('settings.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal
        });

        $scope.openSettings = function() {
            $scope.modal.show();
        };

        $scope.closeSettings = function() {
            $scope.modal.hide();
        };

    }])

    .directive('cardboardGl', [function() {

        return {
            restrict: 'E',
            link: function($scope, $element, $attr) {
                create($element[0]);
            }
        }

        function create(glFrame) {

            function checkForPointerLock() {
                return 'pointerLockElement' in document ||
                    'mozPointerLockElement' in document ||
                    'webkitPointerLockElement' in document;
            }
            var scene,
                camera,
                renderer,
                element,
                container,
                effect,
                controls,
                clock,
                cube,
                INTERSECTED,
                raycaster,
                objects = [],
                enemy,
                enemies = [],

                // application or 'global' level var
                havePointerLock = checkForPointerLock(),
                prevTime = performance.now(),
                walkingSpeed = 400,


                // Particles
                particles = new THREE.Object3D(),
                spheres = new THREE.Object3D(),
                totalParticles = 1000,
                maxParticleSize = 2000,
                particleRotationSpeed = 0,
                particleRotationDeg = 0,
                lastColorRange = [0, 0.3],
                currentColorRange = [0, 0.3];

            var logoImg = document.getElementById("logo-img");
            logoImg.style.opacity = 5;

            var controls, controlsEnabled;
            var moveForward,
                moveBackward,
                moveLeft,
                moveRight,
                isRunning,
                canJump;
            var velocity = new THREE.Vector3();
            var playerPosition;
            var scoreElement = document.getElementById("score");
            var playerScore = 0;
            var playerHealth = 100;
            var healthElement = document.getElementById("health");

            var maxLasers = Infinity;
            var nActive = 0;
            var maxLaserDist = -1000; // distance before laser disappears
            var beamLength = 50; // length of beam geometry
            var laserVelocity = 1000; // speed of laser beam
            var lasers = []; // array of laser mesh objects
            var collisionDist = beamLength; // distance to consider collision

            var contentBox = document.getElementById("content-box");

            var group1;
            var laserRadius = 0.5;
            var laserGeom = new THREE.CylinderGeometry(laserRadius, laserRadius, beamLength, 4);
            //laserGeom.position = playerPosition;
            laserGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, beamLength / 2, 0));
            laserGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
            var laserMat = new THREE.MeshPhongMaterial({
                ambient: 0,
                emissive: 0xff0000,
                color: 0xff0000,
                specular: 0x101010,
                shininess: 20
            });

            var mouse = new THREE.Vector2();
            raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
            var enemyCaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

            var clickCaster = new THREE.Raycaster();

            var scrollDistance = 0;

            var bgSound = "BGLoop";

            /* Spring stiffness, in kg / s^2 */
            var k = -40;
            /* Damping constant, in kg / s */
            var b = -0.97;

            var target = {
                x: 0,
                y: 0,
            };

            init();

            function init() {

                var tones = [];

                var audio = new Audio('/assets/lycrabeats-bg.wav');
                var audio1 = new Audio('/assets/vibeG.wav');
                tones.push(audio1);
                var audio2 = new Audio('/assets/vibeC.wav');
                tones.push(audio2);
                var audio3 = new Audio('/assets/vibeE.wav')
                tones.push(audio3);
                console.log(tones);
                audio.addEventListener('ended', function() {
                    audio.currentTime = 0;
                    audio.play();
                }, false);
                audio.play();

                scene = new THREE.Scene();
                camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 10000);
                //audio1.play();


                scene.add(camera);

                var direction = new THREE.Vector3();

                camera.position.z = 500;
                scene.fog = new THREE.Fog(0x050505, 500, 4000);

                //drawStars();
                renderer = new THREE.WebGLRenderer();
                element = renderer.domElement;
                container = glFrame;
                container.appendChild(element);

                effect = new THREE.StereoEffect(renderer);

                //initPointerLock();
                initControls();

                $('document').ready(function() {

                    $(".card").hover(function() {
                        var randomClip = Math.floor(Math.random() * 3);
                        console.log(randomClip);
                        tones[randomClip].play();
                    });

                    // We need to duplicate the whole body of the website so if you scroll down you can see both the bottom and the top at the same time. Before we do this we need to know the original height of the website.
                    var origDocHeight = document.body.offsetHeight;

                    // now we know the height we can duplicate the body    



                    $(document).scroll(function() { // detect scrolling

                        var scrollWindowPos = $(document).scrollTop(); // store how far we have scrolled
                        console.log(scrollWindowPos);

                        if (scrollWindowPos >= origDocHeight) { // if we scrolled further then the original doc height
                            $(document).scrollTop(0); // then scroll to the top
                        }
                    });

                });






                // initialize lasers:



                // Our initial control fallback with mouse/touch events in case DeviceOrientation is not enabled
                //controls = new THREE.PointerLockControls(camera);
                //scene.add(controls.getObject());
                //  raycaster.set(controls.getObject().position, direction);
                // Our preferred controls via DeviceOrientation
                function setOrientationControls(e) {
                    if (!e.alpha) {
                        return;
                    }

                    //   controls = new THREE.OrbitControls(camera, true);
                    //   controls.connect();
                    //   controls.update();

                    element.addEventListener('click', fullscreen, false);

                    window.removeEventListener('deviceorientation', setOrientationControls, true);
                }
                window.addEventListener('deviceorientation', setOrientationControls, true);

                var ambientLight = new THREE.AmbientLight(0x2e1527);
                scene.add(ambientLight);

                var lights = [];
                lights[0] = new THREE.PointLight(0x2e1527, 1, 0);
                lights[1] = new THREE.PointLight(0x2e1527, 1, 0);
                lights[2] = new THREE.PointLight(0xf2e1527, 1, 0);

                lights[0].position.set(0, 200, 0);
                lights[1].position.set(100, 200, 100);
                lights[2].position.set(300, 200, 500);

                scene.add(lights[0]);
                scene.add(lights[1]);
                scene.add(lights[2]);

                //       var floorTexture = THREE.ImageUtils.loadTexture('img/textures/wood.jpg');
                //       floorTexture.wrapS = THREE.RepeatWrapping;
                //       floorTexture.wrapT = THREE.RepeatWrapping;
                //       floorTexture.repeat = new THREE.Vector2(50, 50);
                //       floorTexture.anisotropy = renderer.getMaxAnisotropy();
                // 
                //       var floorMaterial = new THREE.MeshPhongMaterial({
                //         color: 0xffffff,
                //         specular: 0xffffff,
                //         shininess: 20,
                //         shading: THREE.FlatShading,
                //         map: floorTexture
                //       });
                // 
                //       var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
                // 
                //       var floor = new THREE.Mesh(geometry, floorMaterial);
                //       floor.rotation.x = -Math.PI / 2;
                //       scene.add(floor);

                // var helper = new THREE.GridHelper(500, 100);
                // helper.color1.setHex(0x444444);
                // helper.color2.setHex(0x444444);
                // helper.position.y = -50;
                // scene.add(helper);

                // var wall = new THREE.GridHelper(50, 5, 100);
                // wall.color1.setHex(0x444444);
                // wall.color2.setHex(0x444444);
                // wall.rotation.x = Math.PI / 2;
                // wall.position.y = 50;
                // wall.position.z = 700;
                // objects.push(wall);
                // scene.add(wall);
                // 
                //                 wall = new THREE.GridHelper(50, 5, 100);
                // wall.color1.setHex(0x444444);
                // wall.color2.setHex(0x444444);
                // wall.rotation.x = Math.PI / 2;
                // wall.position.y = 50;
                // wall.position.x = 450;
                // wall.position.z = 700;
                // objects.push(wall);
                // scene.add(wall);


                var particleTexture = THREE.ImageUtils.loadTexture('img/textures/particle.png'),
                    spriteMaterial = new THREE.SpriteMaterial({
                        map: particleTexture,

                    });

                for (var i = 0; i < 60; i++) {
                    for (var j = 0; j < 60; j++) {
                        var sprite = new THREE.Sprite(spriteMaterial);

                        //console.log(sprite);
                        sprite.material.color.setHex(0xffffff * Math.random());
                        sprite.scale.set(10, 10, 0.6);
                        sprite.position.x = -250 * i * 10;
                        sprite.position.y = Math.random() * 10;
                        sprite.position.z = -150 * j * 10;
                        sprite.position.setLength(maxParticleSize * Math.random());
                        //sprite.rotation.y = Math.PI / 180;
                        //sprite.position.z = -200 ;
                        sprite.material.blending = THREE.AdditiveBlending;

                        particles.add(sprite);
                    }
                }

                particles.rotation.set(180, 0, 0);
                particles.position.z = -400;
                particles.position.y = 0;
                particles.position.x = 1000;
                // console.log(particles);
                scene.add(particles);

                var hammertime = new Hammer(contentBox);
                hammertime.on('pan', function(ev) {
                    console.log(ev);
                    mouse.y = ev.deltaY;
                });



                var faceIndices = ['a', 'b', 'c'];

                var color, f, f2, f3, p, vertexIndex,

                    radius = 200,

                    geometry = new THREE.IcosahedronGeometry(radius, 1),

                    geometry2 = new THREE.IcosahedronGeometry(radius, 1),
                    geometry3 = new THREE.IcosahedronGeometry(radius, 1);
                console.log(geometry);
                geometry.verticesNeedUpdating = true;
                for (var i = 0; i < geometry.vertices.length; i++) {
                
                        color = new THREE.Color(0xffffff);   
                        color.setHSL(0.125 * vertexIndex / geometry.vertices.length, 1.0, 0.5); 
                    
                var geometrye = new THREE.SphereGeometry(20);
                var material =  new THREE.MeshBasicMaterial({ color: color, shading: THREE.FlatShading, wireframe: true, transparent: true })
                cube = new THREE.Mesh(geometrye, material);
                cube.position.x = geometry.vertices[i].x;
                cube.position.y = geometry.vertices[i].y;
                cube.position.z = geometry.vertices[i].z;
                enemies.push(cube);
                scene.add(cube);
                    f = geometry.faces[i];
                    f2 = geometry2.faces[i];
                    f3 = geometry3.faces[i];

                    for (var j = 0; j < 3; j++) {

                        vertexIndex = f[faceIndices[j]];

                        p = geometry.vertices[vertexIndex];

                        color = new THREE.Color(0xffffff);
                        color.setHSL((p.y / radius + 1) / 2, 1.0, 0.5);

                        f.vertexColors[j] = color;

                        color = new THREE.Color(0xffffff);
                        color.setHSL(0.0, (p.y / radius + 1) / 2, 0.5);

                        f2.vertexColors[j] = color;

                        color = new THREE.Color(0xffffff);
                        color.setHSL(0.125 * vertexIndex / geometry.vertices.length, 1.0, 0.5);

                        f3.vertexColors[j] = color;

                    }

                }


                var materials = [

                    new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 }),
                    new THREE.MeshBasicMaterial({ color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true })

                ];

                group1 = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
                console.log(group1);
                group1.position.x = 60
                group1.position.y = -100;
                group1.position.z = -75;
                group1.rotation.x = -1.87;
                group1.mass = 0.1;
                console.log(group1.children[0].material);

                var boxGeometry = new THREE.BoxGeometry(20, 20, 10, 3);

                var boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });



                // var groupVertices = group1.children[1].geometry.vertices;
                // for (var i = 0; i < groupVertices.length; i++ ) {
                //   var cubes = new THREE.Mesh(boxGeometry, boxMaterial) 
                //   console.log(cubes);
                //   
                //   cubes.position.x = group1.children[1].geometry.vertices[i].x;
                //   cubes.position.y = group1.children[1].geometry.vertices[i].y;
                //   objects.push(cubes);
                //   scene.add(cubes);
                // }
                scene.add(group1);
                var floorTexture = THREE.ImageUtils.loadTexture('img/textures/wood.jpg');
                floorTexture.wrapS = THREE.RepeatWrapping;
                floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture.repeat = new THREE.Vector2(5, 5);
                floorTexture.anisotropy = renderer.getMaxAnisotropy();

                var floorMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    specular: 0xffffff,
                    shininess: 20,
                    shading: THREE.SmoothShading,
                    map: floorTexture
                });

                var planetMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    wireframe: true
                });


                var geometrye = new THREE.SphereGeometry(1000, 100, 1, 5);
                var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                cube = new THREE.Mesh(geometrye, material);
                cube.material.blending = THREE.AdditiveBlending;
                cube.position.y = 400;
                cube.position.x = 500;
                //scene.add(cube);
                //objects.push(cube);

                var planet2 = new THREE.Mesh(geometry, floorMaterial);
                planet2.position.y = 600;
                planet2.position.x = -500;
                planet2.position.z = -333;
                // scene.add(planet2);
                console.log(contentBox);


                clock = new THREE.Clock();

                animate();
            }

            function loadSound() {
                //createjs.Sound.on("fileload", this.loadHandler, this);
                createjs.Sound.registerSound("/assets/lycrabeats-bg.wav", bgSound);

                //function loadHandler(event) {
                // This is fired for each sound that is registered.
                var instance = createjs.Sound.play(bgSound);  // play using id.  Could also use full sourcepath or event.src.
                //instance.on("complete", this.handleComplete, this);
                instance.volume = 0.5;
                //}

            }

            function playSound() {
                createjs.Sound.play(bgSound);
            }
            function initControls() {
                //document.addEventListener('keydown', onKeyDown, false);
                // document.addEventListener('keyup', onKeyUp, false);
                document.addEventListener('mousedown', onMouseClick, false);
                window.addEventListener("mousewheel", onMouseScroll);
                document.addEventListener("touchstart", onTouchStart);
                document.addEventListener("touchend", onTouchEnd);

                window.addEventListener('mousemove', onMouseMove, false);

            }


            //             function updateControls() {
            //                 
            //                 if (controlsEnabled) {
            //                     var delta = clock.getDelta();
            //                    //mouse = controls.getDirection(mouse);
            //                   animateLasers(delta);
            //                     velocity.x -= velocity.x * 10.0 * delta;
            //                     velocity.z -= velocity.z * 10.0 * delta;
            //                     velocity.y -= 9.8 * 100.0 * delta;
            // 
            //                     if (moveForward) velocity.z -= walkingSpeed * delta;
            //                     if (moveBackward) {
            //                         
            //                      velocity.z += walkingSpeed * delta;
            //                     }
            //                     if (moveLeft) {
            //                         velocity.x -= walkingSpeed * delta;
            //                     }
            //                     if (moveRight) {                      
            //                      velocity.x += walkingSpeed * delta;
            //                     }
            //                     if (isRunning) { walkingSpeed = 800;
            //                     }
            // 
            //                     controls.getObject().translateX(velocity.x * delta);
            //                     controls.getObject().translateY(velocity.y * delta);
            //                     controls.getObject().translateZ(velocity.z * delta);
            // 
            //                     if (controls.getObject().position.y < 10) {
            //                         velocity.y = 0;
            //                         controls.getObject().position.y = 10;
            //                         canJump = true;
            //                     }
            //                 }
            //             }

            function onMouseMove(event) {

                // calculate mouse position in normalized device coordinates
                // (-1 to +1) for both components
                target.x = 0;
                console.log(event);

                //console.log(mouse);
                //console.log(mouse.x);
            };

            function onTouchStart(ev) {
                var e = ev.originalEvent;
                console.log(ev);

                //mouse.y = ev.touches[0].clientY;
            };

            function onTouchEnd(ev) {
                var e = ev.originalEvent;
                console.log(ev);

                //mouse.y = ev.touches[0].clientY;
            };
            function onMouseScroll(event) {

                // calculate mouse position in normalized device coordinates
                // (-1 to +1) for both components
                mouse.y = event.deltaY;
                // mouse.x = event.deltaX;
                //console.log(event);

                //console.log(mouse.x);

            };


            function onMouseClick(event) {

                target.x = event.pageX;
                target.y = event.pageY;

                // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                // mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
                //var vec = new THREE.Vector3();
                //controls.getDirection(vec);

                //clickCaster.ray.origin.copy(controls.getObject().position);
                //clickCaster.ray.direction.copy(vec);
                //var clickCaster = new THREE.Raycaster(controls.getObject().position, vec);
                // update the picking ray with the camera and mouse position	
                //clickCaster.setFromCamera( mouse, camera );	
                //console.log(mouse);
                // console.log(controls.getDirection(vec));
                // calculate objects intersecting the picking ray
                //                 
                // 
                //                 var clickintersects = clickCaster.intersectObjects(enemies);
                // 
                //                 for (var i = 0; i < clickintersects.length; i++) {
                // 
                //                     if (clickintersects[0].distance < 400) {
                //                         console.log(clickintersects[0]);
                //                         clickintersects[0].object.material.color.set(0xff0000);
                //                         objects.splice(clickintersects[0].object);
                //                         scene.remove(clickintersects[0].object);
                //                         playerScore += 10;
                //                         scoreElement.innerHTML = playerScore;
                //                         // INCREMENT SCORE
                //                         //createEnemy();
                //                     }
                // 
                // 	               }

            };



            var getIntersects = function(point, objects) {

                mouse.set((point.x * 2) - 1, - (point.y * 2) + 1);

                raycaster.setFromCamera(mouse, camera);

                return raycaster.intersectObjects(objects);

            };



            function detectCollisions() {

                raycaster.setFromCamera(mouse, camera);
                //console.log(controls.getObject().position);
                // playerPosition = controls.getObject().position;

                //if (controlsEnabled) {
                //raycaster.ray.origin.copy(controls.getObject().position);
                //  raycaster.ray.origin.y = -20;
                //var intersections = raycaster.intersectObjects(objects);


                //   var isOnObject = intersections.length > 0;
                // console.log(isOnObject);
                var time = performance.now();
                var delta = (time - prevTime) / 1000;

                // var enemyVector = new THREE.Vector3(enemy.position.x, enemy.position.y, enemy.position.z);
                //  var playerVector = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);


                // var subVector = new THREE.Vector3();
                //subVector = subVector.subVectors(enemyVector, playerVector);

                // console.log(hypotenuse);
                //console.log(subVector);

                // if(hypotenuse > 1.5){
                //console.log(hypotenuse);


                //enemy.position.x = playerPosition.x - Math.random() * 10 * delta;
                //enemy.position.y = playerPosition.y;
                //enemy.position.z = playerPosition.z - Math.random() * 10 * delta;
                // velocity.x -= velocity.x * 10.0 * delta;
                // velocity.z -= velocity.z * 10.0 * delta;
                // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
                // if (moveForward) velocity.z -= 400.0 * delta;
                // if (moveBackward) velocity.z += 400.0 * delta;
                // if (moveLeft) velocity.x -= 400.0 * delta;
                // if (moveRight) velocity.x += 400.0 * delta;

                //controls.getObject().translateX(velocity.x * delta);
                // controls.getObject().translateY(velocity.y * delta);
                // controls.getObject().translateZ(velocity.z * delta);
                // if (controls.getObject().position.y < 10) {
                //    velocity.y = 0;
                //moveForward = false;
                //controls.getObject().position.y = 10;
                //   canJump = true;
                // }
                // if (controls.getObject().position.z < 5) {
                //     //velocity.y = 0;
                //     moveForward = false;
                //     controls.getObject().position.z = 5;
                //     canJump = true;

                // }

                if (particles.scale.x < 10) {
                    // particles.scale.set(delta * 1, delta * 1, delta * .25);
                    //particles.scale.y += delta * 1;
                    //particles.position.setLength(1000);
                } else {

                    //particles.scale.x =  3;
                    //particles.scale.y = 3;
                    // particles.scale =-  9;
                    //particles.position.setLength(1000);
                    //particles.scale.y =-  9;
                }


                //for (var i = 0; i < enemies.length; i++) {
                    
                

                //}

                prevTime = time;
                //}

            };
            console.log(group1);

            function animate() {

                var dt = clock.getDelta();

                group1.children[0].geometry.verticesNeedUpdating = true;
                //console.log(group1.children[0].geometry.vertices[5]);
                //console.log(mouse);
                detectCollisions();
                // find intersections
                //console.log(contentBox);
                //onMouseClick();


                // console.log(window.scrollY);
                    enemies[1].position.x += 0.025; 
                    enemies[0].position.y +=  0.01; 
                    console.log(enemies[0].position);

                var contentBoxHeight = $("#content-box").height();

                var elapsedSeconds = clock.getElapsedTime();



                //SCROLL CONTENT DOWN FOR BOTTOM LEFT
                //if (mouse.x < 0 && mouse.y < 0) {
                scrollDistance += mouse.y * (0.75 * dt);
                // console.log(contentBox.style.transform)
                //contentBox.style.transform = "translateY(" + 0+ "px)";
                //}

                //if (mouse.x < 0 && mouse.y > 0) {

                //console.log(scrollDistance);

                if (scrollDistance < -Math.abs(container.offsetHeight) - 1111) {
                    //console.log(scrollDistance,-Math.abs(container.offsetHeight));


                    scrollDistance = container.offsetHeight;

                }

                if (scrollDistance > container.offsetHeight) {
                    contentBox.style.transform = "translateY(" + -Math.abs(contentBoxHeight) + "px)";
                    scrollDistance = -Math.abs(contentBoxHeight);

                }

                contentBox.style.transform = "translateY(" + scrollDistance + "px)";
                //}

                console.log(logoImg.style.opacity);

                logoImg.style.transform = "rotate(" + elapsedSeconds * 25 + "deg)";
                
                logoImg.style.opacity -= 0.125;

                //contentBox.style.width = elapsedSeconds * 10 + "px";
                //console.log(group1.children[0].geometry.vertices);
                // 
                for (var i = 0; i < group1.children[0].geometry.vertices.length; i++) {
                    // console.log(group1.children[0].geometry.vertices[i].x);
                    //objects[i].lookAt(mouse.x);
                    //objects[i].position.x += mouse.x * dt * 100;
                    // objects[i].position.y += mouse.y * dt * 100;
                }

                var spring_x = k * ((group1.rotation.x - mouse.y));
                //console.log(spring_x);
                var damper_x = b * 2;

                //group1.material.color += dt;
                group1.children[0].material.color.setHex(0xffffff);
                group1.children[1].material.color.setHex(0xffffff * ((dt * 0.15)));
                //material.color.setHex(0xffffff * Math.random());

                //console.log(damper_x);
                group1.ax = (spring_x + damper_x) / 1.65;
                // console.log(group1.ax)
                group1.vx = group1.ax * dt;
                // console.log(group1.vx);

                // 
                //                //USE THESE CONTROLS FOR THE CELL GAME!!!
                //                  camera.position.x += mouse.x * dt * 100;
                //                  camera.position.y += mouse.y * dt * 100;
                // group1.position.y += mouse.y * dt * 100;
                group1.position.x += group1.vx * dt;
                group1.position.y += group1.vx * dt;
                group1.position.z += group1.vx * dt;

                // group1.scale.x += group1.vx * 0.0001;
                //  group1.scale.y += group1.vx * 0.0001;
                //   group1.scale.z += group1.vx * 0.0001;


                group1.rotation.x += group1.vx * 0.0005 ;
                group1.rotation.y += group1.vx * 0.0050;

                group1.rotation.z += group1.vx * 0.0001;

                //SCROLL CONTENT DOWN FOR BOTTOM LEFT
                //if (mouse.x < 0 && mouse.y < 0) {
                scrollDistance += mouse.y * dt;

                //console.log(scrollDistance);                   
                if (scrollDistance < (-Math.abs(contentBoxHeight) - 100)) {
                    contentBox.style.transform = "translateY(" + 300 + "px)";
                    scrollDistance = contentBoxHeight + 300;
                }
                //contentBox.style.transform = "translateY(" + 0+ "px)";
                //}

                //if (mouse.x < 0 && mouse.y > 0) {
                scrollDistance += mouse.y * (1.75 * dt);
                //console.log(scrollDistance);
              //  console.log(scrollDistance);
                if (scrollDistance > 700) {
                    contentBox.style.transform = "translateY(" + -Math.abs(contentBoxHeight) - 200 + "px)";
                    scrollDistance = -200;

                }

                contentBox.style.transform = "translateY(" + scrollDistance + "px)";

                // 
                //                 particles.scale.x += dt * scrollDistance / 20 * .1;
                //                  particles.scale.z += dt * scrollDistance / 20 * .1;
                //                 particles.scale.y += dt * scrollDistance / 20 * .1;
                // particles.scale.x = dt *.25 * mouse.x;
                // particles.position.y += dt * .25 * mouse.y;               

                requestAnimationFrame(animate);
                group1.children[0].geometry.verticesNeedUpdate = true;

                $(window).bind(
                    'touchmove',
                    function(e) {
                        e.preventDefault();
                    }
                );

                update(clock.getDelta());
                render(clock.getDelta());


            }

            function resize() {
                var width = container.offsetWidth;
                var height = container.offsetHeight;

                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                renderer.setSize(width, height);
                effect.setSize(width, height);
            }


            function initPointerLock() {
                var element = document.body;

                if (havePointerLock) {
                    var pointerlockchange = function(event) {
                        if (document.pointerLockElement === element ||
                            document.mozPointerLockElement === element ||
                            document.webkitPointerLockElement === element) {
                            controlsEnabled = true;
                            controls.enabled = true;
                        } else {
                            controlsEnabled = false;
                            controls.enabled = false;
                        }
                    };

                    var pointerlockerror = function(event) {
                        element.innerHTML = 'PointerLock Error';
                    };

                    document.addEventListener('pointerlockchange', pointerlockchange, false);
                    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
                    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

                    document.addEventListener('pointerlockerror', pointerlockerror, false);
                    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
                    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

                    var requestPointerLock = function(event) {
                        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                        element.requestPointerLock();
                    };
                    element.addEventListener('click', requestPointerLock, false);
                } else {
                    element.innerHTML = 'Bad browser; No pointer lock';
                }
            }

            function update(dt) {
                resize();

                camera.updateProjectionMatrix();

                //  controls.update(dt);
            }

            function render(dt) {
                renderer.render(scene, camera);
            }

            function fullscreen() {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
            }



        }
    }]);


