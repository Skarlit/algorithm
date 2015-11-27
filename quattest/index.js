window.onload = function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;
    var camVec = new THREE.Vector3(0, 0, -1);

    var q =new THREE.Quaternion();
    q.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 6 );

    var render = function () {
        requestAnimationFrame(render);
        camera.lookAt(camVec);
        renderer.render(scene, camera);
    };

    var prevX;
    var prevY;
    window.addEventListener('mousemove', function(e) {
        if (!prevX && !prevY) {
            prevX = e.clientX;
            prevY = e.clientY;
            return;
        }
        
        camVec.applyQuaternion(q);
        console.log(e);
    })

    render();
}