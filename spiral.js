
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
        dc.save();
        dc.translate(x,y);
        dc.lineWidth = 2;
        dc.beginPath();
        if ( color == null) color = "black";
        dc.strokeStyle = color;
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
            color:"red",
            res:2000,
			render:function(){
                this.dc.clearRect(0,0,this.width,this.height);
                this.eq.render(this.dc,this.width/2,this.height/2,this.res,this.color);
			},
            changeR2:function(value){
                this.eq.r2 = value;
                this.update();
            },
            changeR1:function(value){
                this.eq.r1 = value;
                this.update();        
            },
            changeP:function(value){
                this.eq.p = value;
                this.update();
            },
            changeRes:function(value){
                this.res = value;
                this.update();
            },
            update:function(){
                    this.render();
            },
            save:function(){
                    var dataURL = this.canvas.toDataURL();
                    document.getElementById("canvasImg").src = dataURL;
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


window.onload = function(){
	inst = Singleton.getInstance();
    document.getElementById("radioMenor").setAttribute("onchange","javascript:inst.changeR2(this.value)");
    document.getElementById("radioMayor").setAttribute("onchange","javascript:inst.changeR1(this.value)");
    document.getElementById("trazo").setAttribute("onchange","javascript:inst.changeP(this.value)");
    document.getElementById("resolucion").setAttribute("onchange","javascript:inst.changeRes(this.value)");
    document.getElementById("resolucion").setAttribute("onchange","javascript:inst.changeRes(this.value)");
    document.getElementById("download").setAttribute("onclick","javascript:inst.save()");
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
