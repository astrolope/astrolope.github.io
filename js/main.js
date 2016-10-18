// Dean Attali / Beautiful Jekyll 2016

var main = {

  bigImgEl : null,
  numImgs : null,

  init : function() {
    // Shorten the navbar after scrolling a little bit down
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".navbar").addClass("top-nav-short");
        } else {
            $(".navbar").removeClass("top-nav-short");
        }
    });

    // On mobile, hide the avatar when expanding the navbar menu
    $('#main-navbar').on('show.bs.collapse', function () {
      $(".navbar").addClass("top-nav-expanded");
    });
    $('#main-navbar').on('hidden.bs.collapse', function () {
      $(".navbar").removeClass("top-nav-expanded");
    });

    // On mobile, when clicking on a multi-level navbar menu, show the child links
    $('#main-navbar').on("click", ".navlinks-parent", function(e) {
      var target = e.target;
      $.each($(".navlinks-parent"), function(key, value) {
        if (value == target) {
          $(value).parent().toggleClass("show-children");
        } else {
          $(value).parent().removeClass("show-children");
        }
      });
    });

    // Ensure nested navbar menus are not longer than the menu header
    var menus = $(".navlinks-container");
    if (menus.length > 0) {
      var navbar = $("#main-navbar ul");
      var fakeMenuHtml = "<li class='fake-menu' style='display:none;'><a></a></li>";
      navbar.append(fakeMenuHtml);
      var fakeMenu = $(".fake-menu");

      $.each(menus, function(i) {
        var parent = $(menus[i]).find(".navlinks-parent");
        var children = $(menus[i]).find(".navlinks-children a");
        var words = [];
        $.each(children, function(idx, el) { words = words.concat($(el).text().trim().split(/\s+/)); });
        var maxwidth = 0;
        $.each(words, function(id, word) {
          fakeMenu.html("<a>" + word + "</a>");
          var width =  fakeMenu.width();
          if (width > maxwidth) {
            maxwidth = width;
          }
        });
        $(menus[i]).css('min-width', maxwidth + 'px')
      });

      fakeMenu.remove();
    }

    // show the big header image
    main.initImgs();


  },

  initImgs : function() {
    // If the page was large images to randomly select from, choose an image
    if ($("#header-big-imgs").length > 0) {
      main.bigImgEl = $("#header-big-imgs");
      main.numImgs = main.bigImgEl.attr("data-num-img");

          // 2fc73a3a967e97599c9763d05e564189
	  // set an initial image
	  var imgInfo = main.getImgInfo();
	  var src = imgInfo.src;
	  var desc = imgInfo.desc;
  	  main.setImg(src, desc);

	  // For better UX, prefetch the next image so that it will already be loaded when we want to show it
  	  var getNextImg = function() {
	    var imgInfo = main.getImgInfo();
	    var src = imgInfo.src;
	    var desc = imgInfo.desc;

		var prefetchImg = new Image();
  		prefetchImg.src = src;
		// if I want to do something once the image is ready: `prefetchImg.onload = function(){}`

  		setTimeout(function(){
                  var img = $("<div></div>").addClass("big-img-transition").css("background-image", 'url(' + src + ')');
  		  $(".intro-header.big-img").prepend(img);
  		  setTimeout(function(){ img.css("opacity", "1"); }, 50);

		  // after the animation of fading in the new image is done, prefetch the next one
  		  //img.one("transitioned webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
		  setTimeout(function() {
		    main.setImg(src, desc);
			img.remove();
  			getNextImg();
		  }, 1000);
  		  //});
  		}, 6000);
  	  };

	  // If there are multiple images, cycle through them
	  if (main.numImgs > 1) {
  	    getNextImg();
	  }
    }
  },

  getImgInfo : function() {
  	var randNum = Math.floor((Math.random() * main.numImgs) + 1);
    var src = main.bigImgEl.attr("data-img-src-" + randNum);
	var desc = main.bigImgEl.attr("data-img-desc-" + randNum);

	return {
	  src : src,
	  desc : desc
	}
  },

  setImg : function(src, desc) {
	$(".intro-header.big-img").css("background-image", 'url(' + src + ')');
	if (typeof desc !== typeof undefined && desc !== false) {
	  $(".img-desc").text(desc).show();
	} else {
	  $(".img-desc").hide();
	}
  }
};

// 2fc73a3a967e97599c9763d05e564189


			var group;
			var container, controls, stats;
			var particlesData = [];
			var camera, scene, renderer;
			var positions, colors;
			var particles;
			var pointCloud;
			var particlePositions;
			var linesMesh;
      var windowHeight, windowWidth;

			var maxParticleCount = 1000;
			var particleCount = 500;
			var r = 800;
			var rHalf = r / 2;

			var effectController = {
				showDots: false,
				showLines: true,
				minDistance: 120,
				limitConnections: false,
				maxConnections: 20,
				particleCount: 250
			};

			init();
			animate();

			function initGUI() {

				var gui = new dat.GUI();

				gui.add( effectController, "showDots" ).onChange( function( value ) { pointCloud.visible = value; } );
				gui.add( effectController, "showLines" ).onChange( function( value ) { linesMesh.visible = value; } );
				gui.add( effectController, "minDistance", 10, 300 );
				gui.add( effectController, "limitConnections" );
				gui.add( effectController, "maxConnections", 0, 30, 1 );
				gui.add( effectController, "particleCount", 0, maxParticleCount, 1 ).onChange( function( value ) {

					particleCount = parseInt( value );
					particles.setDrawRange( 0, particleCount );

				});

			}

			function init() {

				//initGUI();

				container = document.getElementById( '3d' );

				//

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
				camera.position.z = 1750;

				//controls = new THREE.OrbitControls( camera, container );

				scene = new THREE.Scene();


				group = new THREE.Group();
				scene.add( group );

				var helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( r, r, r ) ) );
				helper.material.color.setHex( 0x080808 );
				helper.material.blending = THREE.AdditiveBlending;
				helper.material.transparent = true;
				//group.add( helper );

				var segments = maxParticleCount * maxParticleCount;

				positions = new Float32Array( segments * 3 );
				colors = new Float32Array( segments * 3 );

				var pMaterial = new THREE.PointsMaterial( {
					color: 0xFFFFFF,
					size: 3,
					blending: THREE.AdditiveBlending,
					transparent: true,
					sizeAttenuation: false
				} );

				particles = new THREE.BufferGeometry();
				particlePositions = new Float32Array( maxParticleCount * 3 );

				for ( var i = 0; i < maxParticleCount; i++ ) {

					var x = Math.random() * r - r / 2;
					var y = Math.random() * r - r / 2;
					var z = Math.random() * r - r / 2;

					particlePositions[ i * 3     ] = x;
					particlePositions[ i * 3 + 1 ] = y;
					particlePositions[ i * 3 + 2 ] = z;

					// add it to the geometry
					particlesData.push( {
						velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 ),
						numConnections: 0
					} );

				}

				particles.setDrawRange( 0, particleCount );
				particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );

				// create the particle system
				pointCloud = new THREE.Points( particles, pMaterial );
				group.add( pointCloud );

				var geometry = new THREE.BufferGeometry();

				geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
				geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );

				geometry.computeBoundingSphere();

				geometry.setDrawRange( 0, 0 );

				var material = new THREE.LineBasicMaterial( {
					vertexColors: THREE.VertexColors,
					blending: THREE.AdditiveBlending,
					transparent: true
				} );

				linesMesh = new THREE.LineSegments( geometry, material );
				group.add( linesMesh );

				//

				renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );

				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, 400 );
        renderer.setClearColor(0xff0000, 0);
				renderer.gammaInput = true;
				renderer.gammaOutput = true;

				container.appendChild( renderer.domElement );

				//

				//stats = new Stats();
				//container.appendChild( stats.dom );

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / 400;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, 400 );

			}

			function animate() {

				var vertexpos = 0;
				var colorpos = 0;
				var numConnected = 0;

				for ( var i = 0; i < particleCount; i++ )
					particlesData[ i ].numConnections = 0;

				for ( var i = 0; i < particleCount; i++ ) {

					// get the particle
					var particleData = particlesData[i];

					particlePositions[ i * 3     ] += particleData.velocity.x;
					particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
					particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

					if ( particlePositions[ i * 3 + 1 ] < -rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
						particleData.velocity.y = -particleData.velocity.y;

					if ( particlePositions[ i * 3 ] < -rHalf || particlePositions[ i * 3 ] > rHalf )
						particleData.velocity.x = -particleData.velocity.x;

					if ( particlePositions[ i * 3 + 2 ] < -rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
						particleData.velocity.z = -particleData.velocity.z;

					if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
						continue;

					// Check collision
					for ( var j = i + 1; j < particleCount; j++ ) {

						var particleDataB = particlesData[ j ];
						if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
							continue;

						var dx = particlePositions[ i * 3     ] - particlePositions[ j * 3     ];
						var dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
						var dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
						var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

						if ( dist < effectController.minDistance ) {

							particleData.numConnections++;
							particleDataB.numConnections++;

							var alpha = 1.0 - dist / effectController.minDistance;

							positions[ vertexpos++ ] = particlePositions[ i * 3     ];
							positions[ vertexpos++ ] = particlePositions[ i * 3 + 1 ];
							positions[ vertexpos++ ] = particlePositions[ i * 3 + 2 ];

							positions[ vertexpos++ ] = particlePositions[ j * 3     ];
							positions[ vertexpos++ ] = particlePositions[ j * 3 + 1 ];
							positions[ vertexpos++ ] = particlePositions[ j * 3 + 2 ];

							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;

							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;

							numConnected++;
						}
					}
				}


				linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
				linesMesh.geometry.attributes.position.needsUpdate = true;
				linesMesh.geometry.attributes.color.needsUpdate = true;

				pointCloud.geometry.attributes.position.needsUpdate = true;

				requestAnimationFrame( animate );

				//stats.update();
				render();

			}

			function render() {

				var time = Date.now() * 0.001;

				group.rotation.y = time * 0.1;
				renderer.render( scene, camera );

			}

document.addEventListener('DOMContentLoaded', main.init);
