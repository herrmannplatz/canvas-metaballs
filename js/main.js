/**
 * thanks to http://www.somethinghitme.com/2012/06/06/2d-metaballs-with-canvas/
 */

(function(){

    function Vector2(x,y) {
        this.x = x;
        this.y = y;

        this.add = function(vec) {
            this.x += vec.x;
            this.y += vec.y;
        };
    }

    function Metaball(pos, vel, size) {
        var canvas = document.createElement("canvas"),
            colors = {r:0,g:0,b:Math.random()*255 | 0},
            ctx = canvas.getContext("2d"),
            gradiant;
            
        canvas.width = size*2;
        canvas.height = size*2;

        // draw ball shape
        gradiant = ctx.createRadialGradient(size, size, 1, size, size, size);
        gradiant.addColorStop(0, 'rgba(' + colors.r +',' + colors.g + ',' + colors.b + ',1)');
        gradiant.addColorStop(1, 'rgba(' + colors.r +',' + colors.g + ',' + colors.b + ',0)');
        ctx.beginPath();
        ctx.fillStyle = gradiant;
        ctx.arc(size, size, size, 0, Math.PI*2);
        ctx.fill();

        return {
            pos : pos,
            vel : vel,
            size : size,
            canvas : canvas
        }
    }

    function init() {
        var canvas = document.getElementById("canvas"),
            ctx = canvas.getContext("2d"),
            tempCanvas = document.createElement("canvas"),
            tempCtx = tempCanvas.getContext("2d"),
            threshold = 210,
            points = [];

        // adjust canvas size 
        canvas.width = tempCanvas.width = window.innerWidth/3;
        canvas.height= tempCanvas.height= window.innerHeight/3;

        // create balls
        for(var i = 0; i < 10; i++){
            var pos = new Vector2(Math.random()*canvas.width, Math.random()*canvas.height),
                vel = new Vector2((Math.random()*2)-1, (Math.random()*2)-1),
                size = Math.floor(Math.random()*60)+60;
            
            points.push(new Metaball(pos, vel, size));
                              
        };

        function metabalize(){
            var imageData = tempCtx.getImageData(0,0,canvas.width,canvas.height);
                pix = imageData.data,
                len = pix.length;

            while(len>0) {
                // check all alpha values
                if(pix[len-1]<threshold){
                    pix[len-1]=0;
                }
                len-=8; // skip some pixels
            }            
            
            ctx.putImageData(imageData, 0, 0);    
        }

        // update cycle
        (function update(){
            var len = points.length,
                ball, 
                point;
            
            tempCtx.clearRect(0,0,canvas.width,canvas.height);

            while(len--){
                ball = points[len],
                point = ball.pos;
                point.add(ball.vel);
                
                if(point.x < 0 || point.x > canvas.width){
                    ball.vel.x *= -1;
                }
                if(point.y < 0 || point.y > canvas.height){
                    ball.vel.y *= -1;
                }

                tempCtx.drawImage(ball.canvas, point.x - ball.size, point.y - ball.size);
            }
            metabalize();
            requestAnimationFrame(update);
        })();

    }

    window.init = init;
})();
