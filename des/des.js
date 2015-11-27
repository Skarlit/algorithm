
// compareTo (a, b) :  -1  a < b,  0 a == b,  1 a > b
var EventHeap = function(compareTo, hash, filter) {
    this.array = [null];
    this.last = 0;
    this.compareTo = compareTo;
    this.memo = {};
    this.hash = hash;
    this.filter = filter;
};

EventHeap.prototype._swap = function(i, j) {
    var tmp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = tmp;
};

EventHeap.prototype._min = function(idx, idy) {
    if (this.array[idx] && this.array[idy]) {
        if (this.compareTo(this.array[idx], this.array[idy]) > 0) {
            return idy;
        } else {
            return idx;
        }
    } else if (this.array[idx]) { return idx; }
    else if (this.array[idy]) { return idy;}
    else { return null; }
};

EventHeap.prototype._sink = function(idx) {
    var min;
    while (idx * 2 <= this.last) {
        min = this._min(idx*2 , idx*2 + 1);
        if (this.compareTo(this.array[idx], this.array[min]) > 0) {
            this._swap(idx, min);
            idx =  min;
        } else {
            return ;
        }
    }
};

EventHeap.prototype._swim = function(idx) {
    while (idx > 1) {
        if (this.compareTo(this.array[idx], this.array[parseInt(idx / 2)]) < 0) {
            this._swap(idx, parseInt(idx / 2));
            idx = parseInt(idx / 2);
        } else {
            return;
        }
    }
};

EventHeap.prototype.pop = function() {
    if (this.last == 0) return;
    this._swap(1, this.last);
    var tmp = this.array.pop();
    this.last--;
    this._sink(1);
    return tmp;
};

EventHeap.prototype.top = function() {
    return this.array[1];
};

EventHeap.prototype.insert = function(obj) {
    if(!this.memo[this.hash(obj)] && this.filter(obj)) {
        this.memo[this.hash(obj)] = true;
        this.array.push(obj);
        this.last++;
        this._swim(this.last);
    }
};

EventHeap.prototype.empty = function() { return this.last < 1;}

function ParticleSystem(n, r, cX, cY, maxSpeed, drawRadius) {
    this.r = r;
    this.collisionDist = 4* r * r * 1.01; // Allow for 1% error;
    this.collisionWallDist = r * 1.01;
    this.cX  = cX;
    this.cY = cY;
    this.p = new Array(n);
    this.v = new Array(n);
    this.pointCloudGeo = new THREE.Geometry();
    this.t = 0;
    this.drawRadius = drawRadius;
    this.maxSpeed = maxSpeed;

    for(var i = 0; i < n; i++) {
        this.p[i] = new THREE.Vector3(cX * 2 * (Math.random() - 0.5), cY * 2 * (Math.random() - 0.5), 0);
        this.v[i] = new THREE.Vector3(maxSpeed*(Math.random() - 0.5), maxSpeed*(Math.random() - 0.5), 0);
    }
    // DEBUG TEST
    //this.p = [new THREE.Vector3(cX, 0, 0), new THREE.Vector3(0, 0, 0)];
    //this.v = [new THREE.Vector3(-60, 0, 0), new THREE.Vector3(-20, 0, 0)];
    // DEBUG TEST

    this.pointCloudGeo.vertices = this.p;
    //this.pointCloudMat = new THREE.PointCloudMaterial({
    //    size: drawRadius,
    //    map: THREE.ImageUtils.loadTexture('../img/sparkle_0.png'),
    //    sizeAttenuation: false,
    //    transparent: true,
    //    color: 0x22dd22
    //});
    this.pointCloudMat = new THREE.ShaderMaterial({
        uniforms: {
            maxSpeed: {type: "f", value: this.maxSpeed},
            radius: {type: "f", value: this.drawRadius},
            color: {type: "c", value: new THREE.Color(0xb5e853)},
            texture: {type: 't', value: THREE.ImageUtils.loadTexture('../img/star.png')}
        },
        attributes: {
            velocity: {type: "v3", value: this.v}
        },
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs').textContent,
        blending:  THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true
    });

    this.pointCloud = new THREE.PointCloud(this.pointCloudGeo, this.pointCloudMat);
    this.eventHeap = new EventHeap(function(a, b) {
        if (a.timeStamp > b.timeStamp) {
            return 1;
        } else if (a.timeStamp < b.timeStamp) {
            return -1;
        } else {
            return 0;
        }
    }, function(event) {
        if (event.type == 0) return  [event.type,  event.pair.join(' '), event.timeStamp].join(' ');
        return  [event.type,  event.idx,  event.timeStamp].join(' ');
    }, function(event) {
        return event.type != -1;
    });
}

ParticleSystem.prototype.predictAll = function () {
    for(var i = 0; i < this.p.length; i++) {
        for(var j = i+1; j < this.p.length; j++) {
            this.eventHeap.insert( this._predict(i, j));
        }
        this.eventHeap.insert(this._predictWall(i));
    }
};

ParticleSystem.prototype.update = function(dt) {
    for(var i = 0; i < this.p.length ; i++) {
        this.p[i] = this.p[i].add(this.v[i].clone().multiplyScalar(dt));
    }
    this.pointCloud.geometry.verticesNeedUpdate = true;
    this.pointCloudMat.attributes.velocity.needsUpdate = true;
};

ParticleSystem.prototype.handleEvent = function(e) {
    var valid = false;
    var offset = this.t - e.timeStamp;
    switch(e.type) {
        case 0:
            var dist = new THREE.Vector3(
                this.p[e.pair[0]].x - this.v[e.pair[0]].x * offset - this.p[e.pair[1]].x + this.v[e.pair[1]].x * offset,
                this.p[e.pair[0]].y - this.v[e.pair[0]].y * offset - this.p[e.pair[1]].y + this.v[e.pair[1]].y * offset, 0);
            if(dist.lengthSq() <= this.collisionDist) { // valid
                this._collide(e.pair[0], e.pair[1]);
                for(var i = 0; i < this.p.length; i++) {
                    this.eventHeap.insert(this._predict(e.pair[0], i));
                    this.eventHeap.insert(this._predict(e.pair[1], i));
                }
                this.eventHeap.insert(this._predictWall(e.pair[0]));
                this.eventHeap.insert(this._predictWall(e.pair[1]));
            }
            return;
        case 1:
            if (Math.abs(this.p[e.idx].y - this.v[e.idx].y * offset  - this.cY) <= this.collisionWallDist) {
                this.v[e.idx].y = - this.v[e.idx].y;
                valid = true;
            }
            break;
        case 2:
            if (Math.abs(this.p[e.idx].x - this.v[e.idx].x * offset + this.cX) <= this.collisionWallDist) {
                this.v[e.idx].x = - this.v[e.idx].x;
                valid = true;
            }
            break;
        case 3:
            if (Math.abs(this.p[e.idx].y - this.v[e.idx].y * offset  + this.cY) <= this.collisionWallDist) {
                this.v[e.idx].y = - this.v[e.idx].y;
                valid = true;
            }
            break;
        case 4:
            if (Math.abs(this.p[e.idx].x - this.v[e.idx].x * offset - this.cX) <= this.collisionWallDist) {
                this.v[e.idx].x = - this.v[e.idx].x;
                valid = true;
            }
            break;
    }
    if (valid) {
        var event;
        for (var i = 0; i < this.p.length; i++) {
            event = this._predict(e.idx, i);
            if (event) this.eventHeap.insert(event);
        }
        event = this._predictWall(e.idx);
        if (event) this.eventHeap.insert(event);
    }
};


ParticleSystem.prototype._predict = function (n, m) {
    if(n == m) return {type: -1};
    var dp =  (new THREE.Vector3).subVectors(this.p[m], this.p[n]);
    var dv =  (new THREE.Vector3).subVectors(this.v[m], this.v[n]);
    var dvdp = dp.dot(dv);
    var det = Math.pow(dvdp, 2) - (dp.lengthSq() - 4 * this.r * this.r) * dv.lengthSq();
    if (det >= 0 && dvdp < 0) {
        return  {
            type: 0,
            pair:  n > m ? [m, n] : [n, m],
            timeStamp:  this.t + ( -dvdp -Math.sqrt(det)) / ( dv.lengthSq())
        }
    } else {
        return {type: -1}
    }
};

/*
     1
  -------
 2|     | 4
  |     |
  -------
    3
 */

ParticleSystem.prototype._predictWall = function(i) {
    var tx;
    var ty;
    if (this.v[i].x < 0) {  //  LEFT
         tx = (-this.cX - this.p[i].x ) / this.v[i].x;
        if (this.v[i].y < 0) {  // DOWN
            ty = - (this.p[i].y + this.cY) / this.v[i].y;
            return (ty > tx ?  {type: 2, idx: i,  timeStamp: this.t + tx} : {type: 3, idx: i, timeStamp: this.t + ty});
        } else {  // UP
            ty = (this.cY - this.p[i].y) / this.v[i].y;
            return (ty > tx ?  {type: 2, idx: i,timeStamp: this.t + tx} : {type: 1, idx: i, timeStamp: this.t +  ty});
        }
    } else {  // RIGHT
        tx = (this.cX - this.p[i].x) / this.v[i].x;
        if (this.v[i].y < 0) {  // DOWN
            ty = - (this.p[i].y + this.cY) / this.v[i].y;
            return (ty > tx ?  {type: 4, idx: i, timeStamp: this.t + tx} : {type: 3, idx: i, timeStamp:  this.t + ty});
        } else { // UP
            ty = (this.cY - this.p[i].y) / this.v[i].y;
            return (ty > tx ?  {type: 4, idx: i, timeStamp: this.t + tx} : {type: 1, idx: i, timeStamp:  this.t + ty});
        }
    }
};

ParticleSystem.prototype._collide = function(n, m) {
    var dp =  (new THREE.Vector3).subVectors(this.p[m], this.p[n]);
    var dv =  (new THREE.Vector3).subVectors(this.v[m], this.v[n]);
    var dvdp = dp.dot(dv);
    var jVec = dp.multiplyScalar(dvdp / dp.lengthSq());
    this.v[n].add(jVec);
    this.v[m].sub(jVec);
};

function Main() {
    // Set up scene
    var width = 800;
    var height = 600;
    var canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    var renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(width, height);
    var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    camera.position.z = 100;

    // Set up particle System
    var boundX = 200;
    var boundY = 200;
    var r = 10;
    var pNum = 50;
    var drawRadius = 30;
    var maxSpeed = 1600;
    var p = new ParticleSystem(pNum, r, boundX, boundY, maxSpeed, drawRadius);
    p.predictAll();

    // Set up Box
    var geometry = new THREE.Geometry();
    geometry.vertices = [
        new THREE.Vector3(boundX + drawRadius, boundY  + drawRadius, 0),
        new THREE.Vector3(boundX + drawRadius, -boundY - drawRadius, 0),
        new THREE.Vector3(-boundX - drawRadius, -boundY - drawRadius , 0),
        new THREE.Vector3(-boundX - drawRadius , boundY + drawRadius, 0),
        new THREE.Vector3(boundX + drawRadius, boundY  + drawRadius, 0)
    ];
    var material = new THREE.LineBasicMaterial( {color: 0xffff00, linewidth: 3} );
    var plane = new THREE.Line( geometry, material );

    // Stage scene
    var scene = new THREE.Scene();
    scene.add(p.pointCloud);
    scene.add( plane );

    // Set up and Update UI
    var ui = $('#ui');
    var particle = ui.find('.particle');
    var location = ui.find('.location');
    var eNums = ui.find('.event');
    var heapTop = ui.find('.heaptop');
    var time = ui.find('.time');
    function UIUpdate() {
        time.text('time: ' + p.t);
        particle.text('Location: ' + JSON.stringify(p.pointCloud.geometry.vertices[1]));
        location.text('Velocity: ' + JSON.stringify(p.v[1]));
        eNums.text('events: ' + p.eventHeap.last);
        heapTop.text('heap top: ' + JSON.stringify(p.eventHeap.top()));
    }

    p.t = 0;
    var dt = 0.005;
    var frames = 10;
    var count = 0;
    var prevEvent = {timeStamp: 0};
    // Render
    function render() {
        window.requestAnimationFrame(render);
        //UIUpdate();
        while (p.t > p.eventHeap.top().timeStamp) {
            p.handleEvent(p.eventHeap.pop());
        }
        p.t += dt;
        p.update(dt);
        renderer.render(scene, camera);
    }

    render();

    Code.render(document.getElementById('code'), document.getElementById('vs').textContent, 'c++');
    Code.render(document.getElementById('code'), document.getElementById('fs').textContent, 'c++');
    $.get(document.getElementById('des').src, function(result) {
        Code.render(document.getElementById('code'), result, 'js');
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    })

}


window.onload = Main;
