//var onGridResize = new Event('onGridResize');

var events = {
    ON_GRID_ANIMATION_FINISH: 'gridjs.onAnimationFinish',
    ON_GRID_RESIZE: 'gridjs.onGridResize'
};

function GridCanvas(canvas, height, width, settings){
    this.triggerEvent = function(el, eventName, data){
        el.dispatchEvent(new CustomEvent(eventName, {detail: data}));
    }

    if(canvas && height && width){
        this.ctx = canvas.getContext('2d');
        this.element = document.createElement('div');
    }
    else{
        console.log('Incorrect GridJS configuration');
        this.start = function(){};
        return;
    }

    this.onAnimationFinish = function(callback){
        this.element.addEventListener(events.ON_GRID_ANIMATION_FINISH, callback, false);
    }
    this.onGridResize = function(callback){
        this.element.addEventListener(events.ON_GRID_RESIZE, callback, false);
    }

    this.height = height;
    this.width = width;
    this.settings = extend({
        lineColor: '#FFFFFF',
        rowLineCount: 20,
        columnLineCount: 20,
        opacity: .7,
        interval: 50,
        //lineDuration: 2000,
        lineDuration: 1000,
        height: height,
        width: width,
        fillParent: true,
        animateOnRedraw: false,
        gridAsSquares: true,
        gridSquareSize: 75
    }, settings);
    this.updateRes = function(height, width){
        this.height = height;
        this.width = width;
        this.settings.height = height;
        this.settings.width = width;

        if(this.settings.gridAsSquares){
            this.settings.rowLineCount = Math.ceil(height/this.settings.gridSquareSize);
            this.settings.columnLineCount = Math.ceil(width/this.settings.gridSquareSize);
        }

        this.rowDistance = height/this.settings.rowLineCount;
        this.columnDistance = width/this.settings.columnLineCount;
        this.drawnRows = 0;
        this.drawnColumns = 0;
        this.lines = [];
        this.animating = true;

        this.triggerEvent(this.element, events.ON_GRID_RESIZE);
    }
    this.updateSettings = function(newSet){
        this.settings = extend(this.settings, newSet);

        this.rowDistance = this.settings.height/this.settings.rowLineCount;
        this.columnDistance = this.settings.width/this.settings.columnLineCount;
        this.drawnRows = 0;
        this.drawnColumns = 0;
        this.lines = [];
        this.animating = true;
    }
    this.lastFrame;
    this.lastLine = 0;
    this.stopped = false;
    this.drawnRows = 0;
    this.drawnColumns = 0;
    this.lines = [];
    this.animating = true;
    this.rowDistance = height/this.settings.rowLineCount;
    this.columnDistance = width/this.settings.columnLineCount;
    this.line = function(type, num){

        var ls = {};
        var opac = this.settings.opacity;
        ls.colors = hexToRgb(this.settings.lineColor);
        ls.alpha = opac;
        ls.x = 0;
        ls.y = 0;
        ls.finalWidth = 0;
        ls.finalHeight = 0;
        if(this.loaded){
            ls.reDrawn = true;
        }
        ls.settings = this.settings;
        ls.type = type;

        if(type == 'row'){
            ls.y = this.rowDistance*(num-1);
            ls.finalWidth = this.width;
        }
        else{
            ls.x = this.columnDistance*(num-1);
            ls.vy = 10;
            ls.finalHeight = this.height;
        }

        ls.c = this.ctx;
        
        this.lines.push(new Line(ls));
    }
    this.animate = function(){
        var _this = this;
        if(!this.stopped){
            requestAnimationFrame(_this.animate.bind(this));
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        //console.log('clear');

        if(this.loaded && !this.settings.animateOnRedraw){
            for(i=0;i<this.settings.rowLineCount;i++){
                this.line('row', this.drawnRows+1);
                this.drawnRows++;
            }
            for(i=0;i<this.settings.columnLineCount;i++){
                this.line('column', this.drawnColumns+1);
                this.drawnColumns++;
            }
        }
        else if(this.lastLine+this.settings.interval <= this.lastFrame){
            if(this.drawnRows < this.settings.rowLineCount){
                this.line('row', this.drawnRows+1);
                this.drawnRows++;
            }
            if(this.drawnColumns < this.settings.columnLineCount){
                this.line('column', this.drawnColumns+1);
                this.drawnColumns++;
            }
            this.lastLine = this.lastFrame;
        }

        for(var i = 0; i<this.lines.length; i++){
            this.lines[i].update();
            //console.log(i);

            // if(this.lines[i].iteration >= this.settings.lineDuration){
            //     this.lines[i].finished = true;
            // }
            
            if(Date.now()-this.lines[i].began >= this.settings.lineDuration){
                this.lines[i].finished = true;
                if(i == this.lines.length-1 && this.animating == true){
                    this.animating = false;
                    this.triggerEvent(this.element, events.ON_GRID_ANIMATION_FINISH);
                }
            }
        }

        //console.log(this.fizzles.length);

        this.lastFrame = Date.now();
    }
    this.start = function(){
        var _this = this;
        this.animate();
        this.bindResize();
        this.onResize();
        setTimeout(function(){
            _this.loaded = true;
        }, 2000);
    };
    this.stop = function(){
        this.stopped = true;
        this.bindResize(false);
    }
    this.bindResize = function(action = true){
        var _this = this;
        if(!action){
            //return;
        }
        window.onresize = function(event) {
            _this.onResize(event);
        }
    }
    this.onResize = function(event){
        var pHeight = canvas.parentElement.clientHeight;
        var pWidth = canvas.parentElement.clientWidth;
        canvas.height = pHeight;
        canvas.width = pWidth;
        var cHeight = canvas.clientHeight;
        var cWidth = canvas.clientWidth;
        if(this.settings.fillParent){
            this.updateRes(cHeight, cWidth);
        }
    }
}

var mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2
};

// on mousemovement, update coordinates of mouse
window.addEventListener('mousemove', function(e) {
	mouse.x = e.x;
    mouse.y = e.y;
});

function Line(settings) {
    this.reDrawn = settings.reDrawn;
    this.x = settings.x;
    this.y = settings.y;
    this.finalHeight = settings.finalHeight;
    this.finalWidth = settings.finalWidth;
    this.x2 = settings.x;
    this.y2 = settings.y;
    this.colors = settings.colors;
    this.settings = settings.settings;
    this.alpha = settings.alpha;
    this.c = settings.c;
    this.finished = false;
    this.began = settings.began || Date.now();
    //this.iteration = 0;
    this.type = settings.type;

	this.draw = function() {
        this.c.beginPath();
        
        this.c.moveTo(this.x, this.y);
        this.c.lineTo(this.x2, this.y2);
        
        var stroke = getRGBA(this.colors.r, this.colors.g, this.colors.b, this.alpha);
        
		this.c.strokeStyle = stroke;
        this.c.stroke();
        // if(!this.finished){
        //     this.iteration++;
        // }
	}

	this.update = function() {

        // if(this.type == 'row'){
        //     this.x2 = this.finalWidth*EasingFunctions.easeInOutCubic(this.iteration/this.settings.lineDuration);
        // }
        // else{
        //     this.y2 = this.finalHeight*EasingFunctions.easeInOutCubic(this.iteration/this.settings.lineDuration);
        // }

        var now = Date.now();
        var began = this.began;
        var curTime = now-began;
        
        if(this.type == 'row'){
            if(this.finished || (this.reDrawn && !this.settings.animateOnRedraw)){
                this.x2 = this.finalWidth;
            }
            else{
                this.x2 = this.finalWidth*EasingFunctions.easeInOutCubic(curTime/this.settings.lineDuration);
            }

            // if(!this.finished || (!this.reDrawn && this.settings.animateOnRedraw)){
            //     // console.log('now: ' +now);
            //     // console.log('beg: ' +began);
            //     // console.log('curTime: ' +curTime);
            //     // console.log('lineDuration: ' +this.settings.lineDuration);
            //     this.x2 = this.finalWidth*EasingFunctions.easeInOutCubic(curTime/this.settings.lineDuration);
            // }
            // else{
            //     this.x2 = this.finalWidth;
            // }
        }
        else{
            if(this.finished || (this.reDrawn && !this.settings.animateOnRedraw)){
                this.y2 = this.finalHeight;
            }
            else{
                this.y2 = this.finalHeight*EasingFunctions.easeInOutCubic(curTime/this.settings.lineDuration);
            }

            // if(!this.finished || (!this.reDrawn && this.settings.animateOnRedraw)){
            //     this.y2 = this.finalHeight*EasingFunctions.easeInOutCubic(curTime/this.settings.lineDuration);
            // }
            // else{
            //     this.y2 = this.finalHeight;
            // }
        }

		this.draw();
	}
}



var extend = function(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i])
        continue;

        for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
            out[key] = arguments[i][key];
        }
    }

    return out;
};

function getRGBA(r,g,b,a){
    return 'rgba('+r+', '+g+', '+b+', '+a+')';
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function ranNum(i,j){
    return Math.floor(Math.random() * j) + i;
}
function ranDec(i,j){
    return (Math.random() * (j - i) + i).toFixed(2);
}

function checkBounds(val1, val2, lim){
    if(val2-lim <= val1 && val2+lim >= val1){
        return true;
    }
    else{
        return false;
    }
}

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
    // elastic bounce effect at the beginning
    easeInElastic: function (t) { return (.04 - .04 / t) * Math.sin(25 * t) + 1 },
    // elastic bounce effect at the end
    easeOutElastic: function (t) { return .04 * t / (--t) * Math.sin(25 * t) },
    // elastic bounce effect at the beginning and end
    easeInOutElastic: function (t) { return (t -= .5) < 0 ? (.01 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1 },
    easeInSin: function (t) { return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2);},
    easeOutSin : function (t) {return Math.sin(Math.PI / 2 * t);},
    easeInOutSin: function (t) {return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;}
}