// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


angular.module('starter', ['ionic'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
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

    .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', function ($scope, $ionicModal, $timeout) {
        $scope.showContent = false;
        $timeout(function () {
            $scope.showContent = true;
        }, 2500);

        $scope.data =
            [
                {
                    header: 'Websites',
                    children: [
                        {
                            name: 'Nicole Bee'
                        },
                        {
                            name: 'Alpine-Adventures'
                        },
                        {
                            name: 'Danktronics'
                        },
                        {
                            name: 'nicolebee'
                        },
                        {
                            name: 'nicolebee'
                        }
                    ]
                },
                {
                    header: 'Apps',
                    children: [
                        {
                            name: 'Shoutmap'
                        },
                        {
                            name: 'stuff'
                        }]

                },
                {
                    header: 'Tunes',
                    children: [
                        {
                            name: 'Shoutmap'
                        },
                        {
                            name: 'stuff'
                        }
                    ]
                }

            ];

        $ionicModal.fromTemplateUrl('settings.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal
        });

        $scope.openSettings = function () {
            $scope.modal.show();
        };

        $scope.closeSettings = function () {
            $scope.modal.hide();
        };

    }])

    .directive('cardboardGl', [function () {

        return {
            restrict: 'E',
            link: function ($scope, $element, $attr) {
                create($element[0]);
            }
        }



        function create(glFrame) {


            //Physijs.scripts.worker = '/js/lib/physijs_worker.js';
            // Physijs.scripts.ammo = '/js/lib/ammo.js';


            var scene,
                camera,
                renderer,
                element,
                container,
                effect,
                controls,
                clock,
                cube,
                uniforms,
                INTERSECTED,
                raycaster,
                objects = [],
                enemy,
                enemies = [],
                startTime,
                group2,
                line,
                SELECTED,
                


                // application or 'global' level var

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
                DISPLACEMENT = 0.15,
                SPRING_STRENGTH = 0.0005,
                DAMPEN = 0.998,
                autoDistortTimer = null,
                currentColorRange = [0, 0.3];

            var logoImg = document.getElementById("logo-img");

            var controls, controlsEnabled;
            var moveForward,
                moveBackward,
                moveLeft,
                moveRight,
                isRunning,
                canJump;
            var velocity = new THREE.Vector3();
            var sphereVertices;
            var playerPosition;
            var scoreElement = document.getElementById("score");
            var playerScore = 0;
            var playerHealth = 100;
            var healthElement = document.getElementById("health");
            var selectedFace;

            var faceIndices = ['a', 'b', 'c'];

            var f, f2, f3, p, vertexIndex;

            var particleTexture = THREE.ImageUtils.loadTexture('img/textures/particle.png');

            particleTexture.wrapS = THREE.RepeatWrapping;
            particleTexture.wrapT = THREE.RepeatWrapping;
            // 


            var mouse = new THREE.Vector2();

            raycaster = new THREE.Raycaster();

            // var enemyCaster = new THREE.Raycaster(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, 1, 0), new THREE.Vector3(0, - 1, 0), 0, 0);;

            var clickCaster = new THREE.Raycaster();

            var group1;

            function Player() {
                radius = 200;
                this.geometry = new THREE.SphereGeometry(200, 60, 30);

                uniforms = {
                    time: { type: "f", value: 1.0 },
                    resolution: { type: "v2", value: new THREE.Vector2() }
                };


                for (var i = 0; i < this.geometry.faces.length; i++) {

                    color = new THREE.Color(0xffffff);
                    color.setHSL(0.125 / this.geometry.vertices.length, 1.0, 0.5);

                    f = this.geometry.faces[i];
                    //console.log(f);

                    for (var j = 0; j < 3; j++) {

                        vertexIndex = f[faceIndices[j]];

                        p = this.geometry.vertices[vertexIndex];
                        //console.log(p);
                        color = new THREE.Color(0xffffff);
                        color.setHSL((f.color / radius + 1) / 4, 0.1, 0.4);

                        f.color = color;

                    }

                }
                this.material = new THREE.MeshBasicMaterial({
                        color: 0x45A19D,
                        shading: THREE.FlatShading,
                    });




                this.geometry.dynamic = true;
                this.object = new THREE.Mesh(this.geometry, this.material);
                this.object.position.z = -600;
                this.object.geometry.dynamic = true;


                /**
                 * Creates an individual spring
                 *
                 * @param {Number} start The index of the vertex for the spring's start
                 * @param {Number} end The index of the vertex for the spring's start
                 */
                this.createSpring = function (start, end) {
                    var sphereVertices = this.geometry.vertices;
                    var startVertex = sphereVertices[start];
                    var endVertex = sphereVertices[end];

                    // if the springs array does not
                    // exist for a particular vertex
                    // create it
                    if (!startVertex.springs) {
                        startVertex.springs = [];

                        // take advantage of the one-time init
                        // and create some other useful vars
                        startVertex.normal = startVertex.clone().normalize();
                        startVertex.originalPosition = startVertex.clone();
                    }

                    // repeat the above for the end vertex
                    if (!endVertex.springs) {
                        endVertex.springs = [];
                        endVertex.normal = startVertex.clone().normalize();
                        endVertex.originalPosition = endVertex.clone();
                    }

                    if (!startVertex.velocity) {
                        startVertex.velocity = new THREE.Vector3();
                    }

                    // finally create a spring
                    startVertex.springs.push({

                        start: startVertex,
                        end: endVertex,
                        length: startVertex.length(
                            endVertex
                        )

                    });
                }

                /**
                 * Displaces the vertices of a face
                 *
                 * @param {THREE.Face3|4} face The face to be displaced
                 * @param {Number} magnitude By how much the face should be displaced
                 */
                this.displaceFace = function (face, magnitude) {

                    // displace the first three vertices
                    this.displaceVertex(face.a, magnitude);
                    this.displaceVertex(face.b, magnitude);
                    this.displaceVertex(face.c, magnitude);

                    // if this is a face4 do the final one
                    if (face instanceof THREE.Face4) {
                        displaceVertex(face.d, magnitude);
                    }

                };

                /**
                 * Displaces an individual vertex
                 *
                 * @param {Number} vertex The index of the vertex in the geometry
                 * @param {Number} magnitude The degree of displacement
                 */
                this.displaceVertex = function (vertex, magnitude) {

                    sphereVertices = this.geometry.vertices;

                    // add to the velocity of the vertex in question
                    // but make sure we're doing so along the normal
                    // of the vertex, i.e. along the line from the
                    // sphere centre to the vertex
                    sphereVertices[vertex].velocity.add(

                        sphereVertices[vertex].normal.
                            clone().
                            multiplyScalar(magnitude)

                    );
                };

                this.getScale = function () {
                    var scaleSize = {
                        x: this.object.scale.x,
                        y: this.object.scale.y
                    };
                    return scaleSize;
                };

                this.setScale = function (coords) {
                    this.object.scale.set(coords);
                };

                this.getPosition = function () {
                    var objectPosition = {
                        x: this.object.position.x,
                        y: this.object.position.y
                    };
                    return objectPosition;
                };

                this.setPosition = function (x, y) {
                    this.object.position.x = x;
                    this.object.position.y = y;
                };

                //scene.add(this.object);
            }

            function Node(x, y, z) {
                this.geometry = new THREE.SphereGeometry(50, 50, 30);
                this.material =
                    new THREE.MeshBasicMaterial({
                        color: 0x45A19D,
                        shading: THREE.FlatShading,
                    });

                this.object = new THREE.Mesh(this.geometry, this.material);
                this.object.position.x = x;
                this.object.position.y = y;
                this.object.position.z = z;

               
                this.object.scale.set(1, 1, 1);

                scene.add(this.object);
            }

            function Cube() {

            }


            //Spring Physics         
            /* Spring stiffness, in kg / s^2 */
            var k = -30;
            /* Damping constant, in kg / s */
            var b = -0.97;

            var target = {
                x: 0,
                y: 0,
            };

            function createCells() {
                //var thisCell = new Cell();

                //enemies.push(thisCell);
                //objects.push(thisCell.object);
            }

            init();

            function createSprings() {

                var sphereFaces = group1.geometry.faces;

                for (var f = 0; f < sphereFaces.length; f++) {
                    var face = sphereFaces[f];

                    // these may be Face3s, i.e. composed of
                    // three vertices, or Face4s, so we need
                    // to double check and not use face.d if
                    // it doesn't exist.
                    if (face instanceof THREE.Face3) {

                        group1.createSpring(face.a, face.b);
                        group1.createSpring(face.b, face.c);
                        group1.createSpring(face.c, face.a);

                    } else {

                        group1.createSpring(face.a, face.b);
                        group1.createSpring(face.b, face.c);
                        group1.createSpring(face.c, face.d);
                        group1.createSpring(face.d, face.a);

                    }
                }
            }

            /**
 * Chooses a face at random and displaces it
 * then sets the timeout for the next displacement
 */
            function displaceRandomFace() {

                var sphereFaces = group1.geometry.faces,
                    randomFaceIndex = Math.floor(Math.random() * sphereFaces.length),
                    randomFace = sphereFaces[randomFaceIndex];

                group1.displaceFace(randomFace, DISPLACEMENT);

                autoDistortTimer = setTimeout(displaceRandomFace, 100);
            }

            /**
  * Goes through each vertex's springs
  * and determines what forces are acting on the
  * spring's vertices. It then updates the vertices
  * and also dampens them back to their original
  * position.
  */
            function updateVertexSprings() {

                // go through each spring and
                // work out what the extension is
                var sphereVertices = group1.geometry.vertices,
                    vertexCount = sphereVertices.length,
                    vertexSprings = null,
                    vertexSpring = null,
                    extension = 0,
                    length = 0,
                    force = 0,
                    vertex = null,
                    acceleration = new THREE.Vector3(0, 0, 0);

                // go backwards, which should
                // be faster than a normal for-loop
                // although that's not always the case
                while (vertexCount--) {

                    vertex = sphereVertices[vertexCount];
                    vertexSprings = vertex.springs;

                    // miss any verts with no springs
                    if (!vertexSprings) {
                        continue;
                    }

                    // now go through each individual spring
                    for (var v = 0; v < vertexSprings.length; v++) {
                        // calculate the spring length compared
                        // to its base length
                        vertexSpring = vertexSprings[v];
                        length = vertexSpring.start.
                            length(vertexSpring.end);

                        // now work out how far the spring has
                        // extended and use this to create a
                        // force which will pull on the vertex
                        extension = vertexSpring.length - length;

                        // pull the start vertex
                        acceleration.copy(vertexSpring.start.normal).multiplyScalar(extension * SPRING_STRENGTH);
                        vertexSpring.start.velocity.add(acceleration);

                        // pull the end vertex
                        acceleration.copy(vertexSpring.end.normal).multiplyScalar(extension * SPRING_STRENGTH);
                        vertexSpring.end.velocity.add(acceleration);

                        // add the velocity to the position using
                        // basic Euler integration
                        vertexSpring.start.add(
                            vertexSpring.start.velocity);
                        vertexSpring.end.add(
                            vertexSpring.end.velocity);

                        // dampen the spring's velocity so it doesn't
                        // ping back and forth forever
                        vertexSpring.start.velocity.multiplyScalar(DAMPEN);
                        vertexSpring.end.velocity.multiplyScalar(DAMPEN);

                    }

                    // attempt to dampen the vertex back
                    // to its original position so it doesn't
                    // get out of control
                    vertex.add(
                        vertex.originalPosition.clone().sub(
                            vertex
                        ).multiplyScalar(0.03)
                    );
                }
            }



            function init() {


                scene = new THREE.Scene();
                //scene = new Physijs.Scene();
                //scene.setGravity(new THREE.Vector3(0,-0.2,0));

                camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 10000);
                
                //scene.add(camera);
                group1 = new Player();
                //group1.object.add(camera);
                group1.object.geometry.dynamic = true;
                createSprings();

                var direction = new THREE.Vector3();
                camera.position.x = 0;
                camera.position.z = 2;
                camera.position.y =0;
                scene.fog = new THREE.Fog(0x050505, 500, 4000);

                renderer = new THREE.WebGLRenderer({ alpha: true });
                renderer.setClearColor(0xff0000, 0);
                console.log(renderer);

                uniforms.resolution.value.x = window.innerWidth;
                uniforms.resolution.value.y = window.innerHeight;

                element = renderer.domElement;
                container = glFrame;
                container.appendChild(element);

                effect = new THREE.StereoEffect(renderer);

                initControls();

                 geometry = new THREE.BufferGeometry();
				 geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( 4 * 3 ), 3 ) );

				 material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2, transparent: true } );

				 line = new THREE.Line( geometry, material );
				 scene.add( line );




                radius = 200,

                    geometry = new THREE.IcosahedronGeometry(radius, 1),

                    geometry2 = new THREE.IcosahedronGeometry(radius, 1),
                    geometry3 = new THREE.IcosahedronGeometry(radius, 1);
                console.log(geometry);
                geometry.verticesNeedUpdating = true;
                for (var i = 0; i < geometry.vertices.length; i++) {

                    color = new THREE.Color(0xffffff);
                    color.setHSL(0.125 / geometry.vertices.length, 1.0, 0.5);

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

                //group2 = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
                scene.add(camera);
                
                	// geometry

				var triangles = 23;

			     geometry = new THREE.SphereBufferGeometry();

				var vertices = new Float32Array( triangles * 3 * 3 );

				for ( var i = 0, l = triangles * 3 * 3; i < l; i += 2) {

					vertices[ i     ] = Math.random() - 0.5;
					vertices[ i + 1 ] = Math.random() - 0.5;
					vertices[ i + 2 ] = Math.random() - 0.5;
                    //var node = new Node(1, 1, 1) ;

				}

				geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
                geometry.computeBoundingSphere();

				var colors = new Uint8Array( triangles * 3 * 4 );

				for ( var i = 0, l = triangles * 3 * 4; i < l; i += 2 ) {

					colors[ i     ] = Math.random() * 255;
					colors[ i + 1 ] = Math.random() * 255;
					colors[ i + 2 ] = Math.random() * 255;
					colors[ i + 3 ] = Math.random() * 255;

				}

				geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 4, true ) );

				// material

				var material = new THREE.RawShaderMaterial( {

					uniforms: {
						time: { value: 1.0 }
					},
					vertexShader: document.getElementById( 'vertexShader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
					side: THREE.DoubleSide,
					transparent: true,
                    wireframe: false,

				} );

				var mesh = new THREE.Mesh( geometry, material );
                console.log(mesh);
                group2 = mesh;
                console.log(group2);
                
                mesh.position.x = 0;
                mesh.position.y = 0;
				scene.add( mesh );
                mesh.geometry.attributes.position.dynamic = true;
                group2.geometry.attributes.position.dynamic = true;
                //group2.geometry.attributes.position.normalized = true;

                function setOrientationControls(e) {
                    if (!e.alpha) {
                        return;
                    }

                    element.addEventListener('click', fullscreen, false);

                    window.removeEventListener('deviceorientation', setOrientationControls, true);
                }
                window.addEventListener('deviceorientation', setOrientationControls, true);

                var ambientLight = new THREE.AmbientLight(0x2e1527);
                scene.add(ambientLight);

                var lights = [];
                lights[0] = new THREE.PointLight(0x2e1527, 0.23, 0);
                lights[1] = new THREE.PointLight(0xffffff, 0.3, 0);
                lights[2] = new THREE.PointLight(0xffffff, 0.4, 0);

                lights[0].position.set(0, 200, 0);
                lights[1].position.set(100, 200, 100);
                lights[2].position.set(300, 200, 500);

                scene.add(lights[0]);
                scene.add(lights[1]);
                scene.add(lights[2]);

                spriteMaterial = new THREE.SpriteMaterial({
                    map: particleTexture,
                });

                for (var i = 0; i < 60; i++) {
                    for (var j = 0; j < 60; j++) {
                        var sprite = new THREE.Sprite(spriteMaterial);

                        //console.log(sprite);
                        sprite.material.color.setHex(0xe5f2ff);
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

                particles.rotation.set(0, 0, 0);
                particles.position.z = -2;
                particles.position.y = 0;
                particles.position.x = 0;

                //var cell = new Cell();
                //console.log(cell);

                console.log(group1.getPosition());

                var boxGeometry = new THREE.BoxGeometry(20, 20, 10, 3);

                var boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

                var planetMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    wireframe: true
                });

                displaceRandomFace();
                clock = new THREE.Clock();
                var startTime = Date.now();
                animate();
            }


            function initControls() {
                document.addEventListener('mousedown', onDocumentMouseDown, false);
                document.addEventListener("touchstart", onTouchStart);
                document.addEventListener( 'mouseup', onDocumentMouseUp, false );

                document.addEventListener('mousemove', onDocumentMouseMove, false);

                controls = new THREE.OrbitControls(camera, renderer.domElement);
				//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
				controls.enableDamping = true;
				controls.dampingFactor = 0.25;
				controls.enableZoom = false;
            }

            function onDocumentMouseMove( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

				raycaster.setFromCamera( mouse, camera );

				if ( SELECTED ) {

					if ( raycaster.ray.intersectPlane( plane, intersection ) ) {

						SELECTED.position.copy( intersection.sub( offset ) );

					}

					return;

				}

				var intersects = raycaster.intersectObject( group2 );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

						INTERSECTED = intersects[ 0 ].object;
						//INTERSECTED.currentHex = INTERSECTED.material.color.getHex();



					}

					container.style.cursor = 'pointer';

				} else {

					//if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

					container.style.cursor = 'auto';

				}

			}


			function onDocumentMouseDown( event ) {

				event.preventDefault();

				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObject( group2 );

                console.log(selectedFace);

               
				if ( intersects.length > 0 ) {
                    console.log(intersects);
					controls.enabled = false;

					SELECTED = intersects[ 0 ].face;
                    console.log(SELECTED);

					SELECTED.face.a += mouse.x + 100;
                    SELECTED.face.b += mouse.y +100;
                    //SELECTED.uv.x = 500;
                     group2.verticesNeedUpdate = true;
                     group2.verticesNeedUpdating = true;
                     group2.geometry.attribues.position[SELECTED.faceIndex].x += 400;

					//offset.copy( intersection ).sub( SELECTED.position );

                     group2.updateMatrix();
					 group2.geometry.computeFaceNormals();
                     group2.geometry.computeVertexNormals();

					container.style.cursor = 'move';

				}

			}

            function onMouseMove(event) {

                // calculate mouse position in normalized device coordinates
                // (-1 to +1) for both components

                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
                //console.log(mouse);
                //console.log(mouse.x);
            };

            function onTouchStart(ev) {
                var e = ev.originalEvent;
                console.log(e);
            };

            function onMouseScroll(event) {

                mouse.y = event.deltaY;

            };

            function onMouseClick(event) {
                mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                //group1.setPosition(event.pageX, event.pageY);
                console.log(mouse);
            };

            function onDocumentMouseUp( event ) {

				event.preventDefault();

				controls.enabled = true;

				container.style.cursor = 'auto';

			}

            function detectCollisions() {

                var time = performance.now();
                var delta = (time - prevTime) / 1000;

                // var enemyVector = new THREE.Vector3(enemy.position.x, enemy.position.y, enemy.position.z);
                var playerVector = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);

                //raycaster.ray.origin.copy(playerVector);
                //  raycaster.ray.origin.y = -20;
                //var intersections = raycaster.intersectObjects(objects);

                //console.log(intersections);

                //v/ar isOnObject = intersections.length > 0;
                //console.log(isOnObject);

                prevTime = time;
                //}

            };

            function animate() {

                var dt = clock.getDelta();
                //updateVertexSprings();

                raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObject( group2 );

				if ( intersects.length > 0 ) {

					var intersect = intersects[ 0 ];
                    //console.log(intersect);
					var face = intersect.face;

					var linePosition = line.geometry.attributes.position;
					var meshPosition = group2.geometry.attributes.position;

					linePosition.copyAt( 0, meshPosition, face.a);
					linePosition.copyAt( 1, meshPosition, face.b );
					linePosition.copyAt( 2, meshPosition, face.c );
					linePosition.copyAt( 3, meshPosition, face.a );
                    meshPosition.x += 500;

					group2.updateMatrix();
                    
					line.geometry.applyMatrix( group2.matrix );
                    selectedFace = face;
                    //console.log(selectedFace);

					line.visible = true;

                    group2.geometry.computeFaceNormals();
                    group2.geometry.computeVertexNormals();

				} else {

					line.visible = false;

				}


group2.geometry.attributes.position.needsUpdate = true;
    //group2.geometry.attributes.color.needsUpdate = true;

                group2.verticesNeedUpdate = true;
                group2.verticesNeedUpdating = true;
                //console.log(group2.vertices[5]);
                if (group1 !== undefined) {
                    group1.object.position.x += mouse.x * dt * group1.object.scale.x * 100;
                    group1.object.position.y += mouse.y * dt * group1.object.scale.y * 100;
                    //group1.object.__dirtyPosition = true;

                    playerPosition = group1.object.position;
                }

                detectCollisions();

                for (var i = 0; i < group2.geometry.attributes.uv.array.length; i++) {
                    group2.geometry.attributes.uv.array[i * 3] += 10 * dt;
                  
                }
                

                var elapsedSeconds = clock.getElapsedTime();


                logoImg.style.transform = "rotate(" + elapsedSeconds * 25 + "deg)";
                controls.update();

                requestAnimationFrame(animate);
                //  group1.children[0].geometry.verticesNeedUpdate = true;

                update(clock.getDelta());
                //scene.simulate()
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

            function update(dt) {
                resize();

                camera.updateProjectionMatrix();

                //  controls.update(dt);
            }

            function render(dt) {
                var elapsedMilliseconds = Date.now() - startTime;
                //var elapsedSeconds = elapsedMilliseconds / 1000.;
                //uniforms.time.value = 60. * elapsedSeconds;
                renderer.render(scene, camera);

                var time = performance.now();

				//var object = scene.children[  ];

				group2.rotation.y = time * 0.00015;
                group2.rotation.x = time * 0.00015;
				group2.material.uniforms.time.value = time * 0.0015;
            }

            function resetState () {

            }

            function showMenu () {

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


