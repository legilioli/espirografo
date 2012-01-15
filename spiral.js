
function Circle(x,y,radius,rot){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.rot = rot;
	this.draw = function(dc){
			dc.save();
			dc.translate(this.x,this.y);
			dc.rotate(this.rot);
			dc.beginPath();
			dc.arc(0,0,this.radius,0,Math.PI*2);
			dc.moveTo(-(this.radius),0);
			dc.lineTo(this.radius,0);
			dc.moveTo(0,-(this.radius));
			dc.lineTo(0,this.radius);
			dc.stroke();
			dc.restore();
		    }
	this.setPos = function(x,y){
			this.x = x;
			this.y = y;
		}
}

function Spirograph(x,y,r1,r2){

	this.x = x;
	this.y = y;
    this.r1 = r1;
    this.r2 = r2;
	this.bigcircle = new Circle(x,y,r1,0);
	this.smallcircle = new Circle(0,0,r2,0);
    this.eq = new SpirographEq(r1,r2,r2*1.2);

	this.draw = function(dc){
			this.bigcircle.draw(dc);
			this.smallcircle.draw(dc);
		    }

	this.rotateStep = function(dTheta){
			this.smallcircle.rot = this.smallcircle.rot + dTheta;
			r1 = this.bigcircle.radius;
			r2 = this.smallcircle.radius;
			angle = - this.smallcircle.rot*r2/(r1-r2);
			radius = r1 - r2;
			//punto central de r2
			xc = this.x + Math.cos(angle) * radius;
			yc = this.y + Math.sin(angle) * radius;
			this.smallcircle.setPos(xc,yc);
	}
}


function SpirographEq(r1,r2,p){

    this.r1=r1;
    this.r2=r2;
    this.p=p;

    this.calculatePoint = function(t){
        var r1 = this.r1;
        var r2 = this.r2;
        var p = this.p;
        point = 
        {
            'x':Math.cos(t)*(r1-r2) + Math.cos(t*(r1-r2)/r2)*p,
            'y':Math.sin(t)*(r1-r2) - Math.sin(t*(r1-r2)/r2)*p
        }
        return point;
    };

    this.render = function(dc,x,y,steps,n,color){
        var dt = Math.PI*2 / steps;
        dc.save();
        dc.translate(x,y);
        dc.lineWidth = 2;
        dc.beginPath();
        if ( color == null) color = "black";
        dc.strokeStyle = color;
        for ( i = 0; i < steps*n; i++){
            var point = this.calculatePoint(dt*i);
            dc.lineTo(point.x,point.y);
        }
        dc.stroke();
        dc.restore();
    }

}

var Singleton = (function(){

	var instance;
	this.init = function(){
		i = {
			sp:null,
			dc:null,
            width:0,
            heigth:0,
			dTheta: Math.PI*2/90,
			step:function(dt){
				this.sp.rotateStep(this.dTheta*dt/1000);
			},
			render:function(){
				this.dc.fillStyle="#ffffff";
				this.dc.fillRect(0,0,this.width,this.height);
				this.sp.draw(this.dc);
			},
			gameloop:function(){
				this.step(1000);
				this.render();
			},
            changeR2:function(value){
                this.reset();
                this.sp.smallcircle.radius = value;
            },
            changeR1:function(value){
                this.reset();
                this.sp.bigcircle.radius = value;
            },
            reset:function(){
                this.sp.smallcircle.rot=0;
            },
            changeDTheta:function(deg){
                this.dTheta = deg*Math.PI*2/360;
            }

		    };
        canvas = document.getElementById("canv1");
		i.dc = canvas.getContext("2d");
        i.width = canvas.width;
        i.height = canvas.height;
		i.sp = new Spirograph(i.width/2,i.height/2,75,30);
		i.sp.rotateStep(Math.PI/2);
		return i;
	}
	
	return {
		getInstance:function(){
			if(!instance)
				instance = init();
			return instance;
		}
	};

})();


function draw(){
	inst = Singleton.getInstance();
	var a = function(){
		inst.step(1000);
		inst.render();
	}

    document.getElementById("radioMenor").setAttribute("onchange","javascript:inst.changeR2(this.value)");
    document.getElementById("radioMayor").setAttribute("onchange","javascript:inst.changeR1(this.value)");
    document.getElementById("velocidad").setAttribute("onchange","javascript:inst.changeDTheta(this.value)");

	setInterval(a,50);

    dc2 = document.getElementById("canv2").getContext("2d");
    eq = new SpirographEq(175,20,30);
    eq.render(dc2,200,200,200,10,"red");
    

}

