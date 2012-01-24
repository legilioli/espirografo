
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

    this.render = function(dc,x,y,steps,color){
        nturns = Math.abs(this.r2) / gcd(this.r1,Math.abs(this.r2)) 
        var dt = Math.PI*2 / steps;
        dc.lineWidth = 1;
        dc.save();
        dc.translate(x,y);
        dc.beginPath();
//        if ( color == null) color = "black";
        dc.strokeStyle = colors[Math.floor((Math.random()*colors.length))];//color;
        for ( i = 0; i <= steps*nturns; i++){
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
			dc:null,
            canvas:null,
            eq:null,
            width:0,
            heigth:0,
            color:"orange",
            res:2000,
			render:function(){
//                this.dc.clearRect(0,0,this.width,this.height);
                this.dc.fillStyle = "#000000";

                this.eq.render(this.dc,this.width/2,this.height/2,this.res,this.color);
			},
            update:function(){
                //this.dc.fillStyle = "#000000";
                this.dc.clearRect(0,0,this.width,this.height);
                for (var i = 0; i<3; i++){
                    var n = getRandomSpiralValues();
                    this.eq.r1 = n.r1;
                    this.eq.r2 = n.r2;
                    this.eq.d = n.d;
                    this.eq.render(this.dc,this.width/2,this.height/2,this.res);
                }

            },
            save:function(){
                    var dataURL = this.canvas.toDataURL();
                    document.getElementById("canvasimg").src = dataURL;
                    window.open(dataURL);
            }
		    };
        i.canvas = document.getElementById("canv1");
		i.dc = i.canvas.getContext("2d");
        i.width = i.canvas.width;
        i.height = i.canvas.height;
		i.eq = new SpirographEq(100,2,80);
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



function getRandomIntValue(from,to){
    return Math.floor(from+Math.random()*to);
}

function getRandomSpiralValues(){
    return {
        'r1':getRandomIntValue(20,200),
        'r2':getRandomIntValue(20,100),
        'd':getRandomIntValue(20,200),
        'res':getRandomIntValue(50,500),
    }
}


window.onload = function(){
	inst = Singleton.getInstance();
    document.getElementById("canvasimg").setAttribute("onclick","inst.save()");   
    inst.update();

}

function gcd(x, y) {
	while (y != 0) {
		var z = x % y;
		x = y;
		y = z;
	}
	return x;
}

colors = ["red","green","blue","yellow","orange","fuchsia","maroon","navy","olive","purple","teal","aqua","black"];
