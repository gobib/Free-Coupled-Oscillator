/*fungsi memulai simulasi*/
/*Variabel Inisial*/
//gacc = parseFloat(document.getElementById("gacc").value);

//Variabel yg berhubungan dengan posisi
var drawBall;
var drawGraph;
var drawGraph2;
var drawGraphxy;
var period = 0; /*periode update data*/
var ax1 = 0; var ax10 = 0;/*percepatan awal horizontal*/
var ax2 = 0; var ax20 = 0;/*percepatan awal horizontal*/
var ay1 = 0; var ay10 = 0;/*percepatan awal vertikal*/
var ay2 = 0; var ay20 = 0;/*percepatan awal vertikal*/
var vx1 = 0; var vx10 = 0;/*kecepatan awal horizontal*/
var vx2 = 0; var vx20 = 0;/*kecepatan awal horizontal*/
var vy1 = 0; var vy10 = 0;/*kecepatan awal vertikal*/
var vy2 = 0; var vy20 = 0;/*kecepatan awal vertikal*/
var first = true;
var timer1;
var i = 0;

var tdat = 0;
var xdat1 = 0;  var ydat1 = 0;
var xdat2 = 0;  var ydat2 = 0;
var vxdat1 = 0; var vydat1 = 0;
var vxdat2 = 0; var vydat2 = 0;

var g = 0; /*konstanta gravitasi (dalam m/s^2)*/
var deltay = 0;
var deltax = 0;
/*End Variabel Inisial*/

/*Variabel Input*/
//Benda 1
var x1 = 0; var x10 = 0;/*posisi awal benda 1 horizontal*/
var y1 = 0; var y10 = 0;/*posisi awal benda 1 vertikal*/
var R1 = 0; /*jari-jari benda 1*/
var c1 = 0; /*konstanta viskositas benda 1*/
var m1 = 0; /*massa benda 1 (dalam kg)*/
	
//Benda 2
var x2 = 0; var x20 = 0;/*posisi awal benda 2 horizontal*/
var y2 = 0; var y20 = 0;/*posisi awal benda 2vertikal*/
var R2 = 0; /*jari-jari benda 2*/
var beta = 0; /*sudut awal*/
var c2 = 0; /*konstanta viskositas benda 2*/
var m2 = 0; /*massa benda 2 (dalam kg)*/
	
//Variabel yang bergantung benda 1-2
var l = 0; /*panjang pegas (dalam m)*/
var L = 50;	 var L0 = L;/*besar posisi antara x1 dan x2*/
var k = 0; /*konstanta pegas*/
var deltal = 0; /*perubahan panjang pegas*/
	
//Variabel simulasi
var dt = 0; /*perubahan waktu*/
var ti = 0;
var tf = 0;
var tcur = 0;
/*End Variabel Input*/
var hasil = "";
var hasilawal = "";

/*warna*/
var black   = "#000000";
var red     = "#ff0000";
var green   = "#00ff00";
var blue    = "#0000ff";
var yellow  = "#ffff00";
var cyan    = "#00ffff";
var magenta = "#ff00ff";
var white   = "#ffffff";
var gray    = "#cccccc";

function fire() {
if (first)
	{read();}
	toggle();
}

function read() {
	var lines = new Array;
	lines = ta.value.split("\n");
	var N = lines.length;
	for (var b=0; b<N; b++){
		var terms = lines[b].split("\t");
		
		if (b==0)
		{
			x1 = parseFloat(terms[0]); /*posisi awal benda 1 horizontal*/
			y1 = parseFloat(terms[1]); /*posisi awal benda 1 vertikal*/
			R1 = parseFloat(terms[2]); /*jari-jari benda 1*/
			m1 = parseFloat(terms[3]); /*konstanta viskositas benda 1*/
			c1 = parseFloat(terms[4]); /*massa benda 1 (dalam kg)*/
		}
		else if (b==1)
		{
			x2 = parseFloat(terms[0]); /*posisi awal benda 2 horizontal*/
			y2 = parseFloat(terms[1]); /*posisi awal benda 2 vertikal*/
			R2 = parseFloat(terms[2]); /*jari-jari benda 2*/
			m2 = parseFloat(terms[3]); /*konstanta viskositas benda 2*/
			c2 = parseFloat(terms[4]); /*massa benda 2 (dalam kg)*/
		}
		else if (b==2)
		{
			g = parseFloat(terms[0]);
		}
		else if (b==3)
		{
			L = parseFloat(terms[0]); /*panjang pegas awal (dalam m)*/
			l = parseFloat(terms[1]); /*panjang pegas awal (dalam m)*/
			k = parseFloat(terms[2]); /*konstanta pegas*/
		}
		else if (b==4)
		{
			dt = parseFloat(terms[0]); /*perubahan waktu*/
			ti = parseFloat(terms[2]);
			tf = parseFloat(terms[3]);
			period = parseFloat(terms[4]);
		}
	}
	
	document.getElementById('hasil1').value = document.getElementById('hasil1').value + ti + "\t" + x1 + "\t" + y1 + "\t" + vx1 + "\t" + vy1 + "\t" + "\n";
	document.getElementById('hasil2').value = document.getElementById('hasil2').value + ti + "\t" + x2 + "\t" + y2 + "\t" + vx2 + "\t" + vy2 + "\t" + "\n";
}

function toggle() {
	if(event.target.innerHTML == "Berhenti") {
		// Stop simulation
		event.target.innerHTML = "Mulai";
		clearInterval(timer1);
	} else {
		// Run simulation
		event.target.innerHTML = "Berhenti";
		timer1 = setInterval(mulaiFunction, period);
	}
}

function clearCurrentFigure() {
	var ctx1 = myCanvas.getContext("2d");
    var ctx2 = grafik1.getContext("2d");
	ctx1.fillStyle = "#fff";
	ctx1.fillRect(0,0,320,640);
    ctx2.fillStyle = "#fff";
	ctx2.fillRect(0,0,480,320);
}

// Reset simulation
function resetFunction() {
    location.reload();
}

/* FUNGSI MEMBUAT GRAFIK*/
function graph(plot,xpos,ypos,dotsize,color) {
    plot.beginPath();
    plot.fillStyle=color;
    plot.arc(xpos,ypos,dotsize,0,Math.PI*2,true);
    plot.closePath();
    plot.fill();
}

/* FUNGSI MEMBUAT GRID */
function makeGrid(grid,xi,yi,xf,yf,linesize) {
    grid.setLineDash([2, 4]);
    grid.beginPath();
    grid.moveTo(xi,yi);
    grid.lineTo(xf,yf);
    grid.lineWidth = linesize;
    grid.strokeStyle = black;
    grid.stroke();
}

/* FUNGSI MEMBUAT AXIS */
function makeAxis(axis,xi,yi,xf,yf,linesize) {
    axis.beginPath();
    axis.moveTo(xi,yi);
    axis.lineTo(xf,yf);
    axis.lineWidth = linesize;
    axis.strokeStyle = black;
    axis.stroke();
    
}

function gridText(text,value,xdat,ydat) {
    text.font = "10px Arial";  
    text.fillStyle = black;
    text.textAlign = "center";
    text.fillText(value,xdat,ydat);
}

/*makeGrid(drawGraph,1*320/10,0,1*320/10,320,1);*/

function siapFunction(){
	read();
	drawBall= myCanvas.getContext('2d');
    drawBall.clearRect(0,0,myCanvas.width,myCanvas.height);
    drawBall.beginPath();
    drawBall.fillStyle="#000000";
    drawBall.arc(x1,y1,R1,0,Math.PI*2,true);
    drawBall.closePath();
    drawBall.fill();

    drawBall.beginPath();
    drawBall.moveTo(x1,y1);
    drawBall.lineTo(x2,y2);
    drawBall.lineWidth =2;
    drawBall.stroke();

    drawBall.beginPath();
    drawBall.fillStyle="#ff0000";
    drawBall.arc(x2,y2,R2,0,Math.PI*2,true);
    drawBall.closePath();
    drawBall.fill();

    gridText(drawGraph,0*tf/10,1*dx,ymax+10);
    gridText(drawGraph,1*tf/10,2*dx,ymax+10);
    gridText(drawGraph,2*tf/10,3*dx,ymax+10);
    gridText(drawGraph,3*tf/10,4*dx,ymax+10);
    gridText(drawGraph,4*tf/10,5*dx,ymax+10);
    gridText(drawGraph,5*tf/10,6*dx,ymax+10);
    gridText(drawGraph,6*tf/10,7*dx,ymax+10);
    gridText(drawGraph,7*tf/10,8*dx,ymax+10);
    gridText(drawGraph,8*tf/10,9*dx,ymax+10);
    gridText(drawGraph,9*tf/10,10*dx,ymax+10);
    gridText(drawGraph,10*tf/10,(11*dx)-5,ymax+10);

    gridText(drawGraph2,0*tf/10,1*dx,ymax+10);
    gridText(drawGraph2,1*tf/10,2*dx,ymax+10);
    gridText(drawGraph2,2*tf/10,3*dx,ymax+10);
    gridText(drawGraph2,3*tf/10,4*dx,ymax+10);
    gridText(drawGraph2,4*tf/10,5*dx,ymax+10);
    gridText(drawGraph2,5*tf/10,6*dx,ymax+10);
    gridText(drawGraph2,6*tf/10,7*dx,ymax+10);
    gridText(drawGraph2,7*tf/10,8*dx,ymax+10);
    gridText(drawGraph2,8*tf/10,9*dx,ymax+10);
    gridText(drawGraph2,9*tf/10,10*dx,ymax+10);
    gridText(drawGraph2,10*tf/10,(11*dx)-5,ymax+10);
}

function mulaiFunction() {
    if(first){
        first = false;
        //Variabel global / Konstanta
        deltay = 0;
        deltax = 0;
        /*End Variabel Inisial*/
        
        /*Variabel Input*/
        //Benda 1
        x10 = x1;
		y10 = y1;
        
        //Benda 2
		x20 = x2;
		y20 = y2;
        beta = 0; /*sudut awal*/
        
        //Variabel yang bergantung benda 1-2
        L0 = L;
        /*End Variabel Input*/
        
	}

	else {
		i++;
        var tii = ti.toFixed(3);
        var x = x1.toFixed(2);
        var y = 640-y1.toFixed(2);
        var xx = x2.toFixed(2);
        var yy = 640-y2.toFixed(2);
        var vx = vx1.toFixed(2);
        var vy = vy1.toFixed(2);
        var vxx = vx2.toFixed(2);
        var vyy = vy2.toFixed(2);
		if(i%10==0)
        {
			document.getElementById('hasil1').value = document.getElementById('hasil1').value + tii + "\t" + x + "\t" + y + "\t" + vx + "\t" + vy + "\t" + "\n";
			document.getElementById('hasil2').value = document.getElementById('hasil2').value + tii + "\t" + xx + "\t" + yy + "\t" + vxx + "\t" + vyy + "\t" + "\n";
		}
        else{}
        //Untuk display data pada textarea.
        //Untuk display data pada textarea.
        deltay = y2 - y1;
		deltax = x2 - x1;
		
		beta = Math.abs(Math.atan(deltay/deltax));
		l = Math.sqrt((deltax*deltax)+(deltay*deltay));
		deltal = l - L;
		/*nilai percepatannya benda*/
        if(x1 <= x2) {
			if (y1 <= y2){
				if (l >= L){
					ax1 = (k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c1*vx1)) / m1;
					ay1 = (k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m1*g) - (c1*vy1)) / m1;
					ax2 = (-k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c2*vx2)) / m2;
					ay2 = (-k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m2*g) - (c2*vy2)) / m2;    	
				} 
				if (l < L){
					ax1 = (-k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c1*vx1)) / m1;
					ay1 = (-k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m1*g) - (c1*vy1)) / m1;
					ax2 = (k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c2*vx2)) / m2;
					ay2 = (k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m2*g) - (c2*vy2)) / m2;
				}
			}
			
			if (y1 > y2){
				if (l >= L){
					ax1 = (k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c1*vx1)) / m1;
					ay1 = (-k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m1*g) - (c1*vy1)) / m1;
					ax2 = (-k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c2*vx2)) / m2;
					ay2 = (k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m2*g) - (c2*vy2)) / m2;    	
				} 
				if (l < L){
					ax1 = (-k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c1*vx1)) / m1;
					ay1 = (k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m1*g) - (c1*vy1)) / m1;
					ax2 = (k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c2*vx2)) / m2;
					ay2 = (-k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m2*g) - (c2*vy2)) / m2;
				}
			}
			
			 
        }
		
		if(x1 > x2) {
			if (y1 <= y2){
				if (l >= L){
					ax1 = (-k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c1*vx1)) / m1;
					ay1 = (k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m1*g) - (c1*vy1)) / m1;
					ax2 = (k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c2*vx2)) / m2;
					ay2 = (-k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m2*g) - (c2*vy2)) / m2;    	
				} 
				if (l < L){
					ax1 = (k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c1*vx1)) / m1;
					ay1 = (-k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m1*g) - (c1*vy1)) / m1;
					ax2 = (-k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c2*vx2)) / m2;
					ay2 = (k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m2*g) - (c2*vy2)) / m2;
				}
			}

			if (y1 > y2){
				if (l >= L){
					ax1 = (-k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c1*vx1)) / m1;
					ay1 = (-k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m1*g) - (c1*vy1)) / m1;
					ax2 = (k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c2*vx2)) / m2;
					ay2 = (k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m2*g) - (c2*vy2)) / m2;    	
				}
				if (l < L){
					ax1 = (k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c1*vx1)) / m1;
					ay1 = (k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m1*g) - (c1*vy1)) / m1;
					ax2 = (-k*Math.abs(deltal*deltax/l)*(Math.cos(beta)) - (c2*vx2)) / m2;
					ay2 = (-k*Math.abs(deltal*deltay/l)*(Math.sin(beta)) + (m2*g) - (c2*vy2)) / m2;
				}
			}
			 
        }
		
		/*nilai kecepatan benda*/
		vx1 = vx1 + (ax1*dt);
		vy1 = vy1 + (ay1*dt);
		vx2 = vx2 + (ax2*dt);
		vy2 = vy2 + (ay2*dt);
		
		if(y1 >= 640-R1) {
            vy1 = - 0.2 * vy1;
        }

        if(y2 >= 640-R2) {
            vy2 = - 0.2 * vy2;
        }
		
		/*nilai posisi benda*/
		x1 = x1 + (vx1*dt);
		y1 = y1 + (vy1*dt);
		x2 = x2 + (vx2*dt);
		y2 = y2 + (vy2*dt);

        
	}
    drawBall= myCanvas.getContext('2d');
    drawBall.clearRect(0,0,myCanvas.width,myCanvas.height);
    drawBall.beginPath();
    drawBall.fillStyle="#000000";
    drawBall.arc(x1,y1,R1,0,Math.PI*2,true);
    drawBall.closePath();
    drawBall.fill();

    drawBall.beginPath();
    drawBall.moveTo(x1,y1);
    drawBall.lineTo(x2,y2);
    drawBall.lineWidth =2;
    drawBall.stroke();

    drawBall.beginPath();
    drawBall.fillStyle="#ff0000";
    drawBall.arc(x2,y2,R2,0,Math.PI*2,true);
    drawBall.closePath();
    drawBall.fill();

    /*grafik x benda 1*/
    drawGraph = grafik1.getContext('2d');
    drawGraph2 = grafik2.getContext("2d");
    drawGraphxy = grafikxy.getContext('2d');
    var xmax = grafik1.width - (grafik1.width/10);
    var ymax = grafik1.height - (grafik1.height/10);
    var yymax1 = y1 * grafik2.height / myCanvas.height - (y1 * grafik2.height / myCanvas.height/10);
    var yymax2 = y2 * grafik2.height / myCanvas.height - (y2 * grafik2.height / myCanvas.height/10);
    var dx = xmax/10;
    var dy = ymax/10;
    graph(drawGraph,dx+(ti*(xmax)/tf),(ymax-x1),0.5,black);
    graph(drawGraph,dx+(ti*(xmax)/tf),(ymax-x2),0.5,red);
    graph(drawGraph2,dx+(ti*(xmax)/tf),(yymax1),0.5,black);
    graph(drawGraph2,dx+(ti*(xmax)/tf),(yymax2),0.5,red);
    /*membuat teks grid vertikal*/
/*    gridText(drawGraph,0*tf/10,1*dx,ymax+10);
    gridText(drawGraph,1*tf/10,2*dx,ymax+10);
    gridText(drawGraph,2*tf/10,3*dx,ymax+10);
    gridText(drawGraph,3*tf/10,4*dx,ymax+10);
    gridText(drawGraph,4*tf/10,5*dx,ymax+10);
    gridText(drawGraph,5*tf/10,6*dx,ymax+10);
    gridText(drawGraph,6*tf/10,7*dx,ymax+10);
    gridText(drawGraph,7*tf/10,8*dx,ymax+10);
    gridText(drawGraph,8*tf/10,9*dx,ymax+10);
    gridText(drawGraph,9*tf/10,10*dx,ymax+10);
    gridText(drawGraph,10*tf/10,(11*dx)-5,ymax+10);*/
    graph(drawGraphxy,x1,y1,0.5,black);
    graph(drawGraphxy,x2,y2,0.5,red);

    ti=ti+dt;
    l = l;
    tdat = ti.toFixed(2);
    xdat1 = x1.toFixed(2);
    ydat1 = y1.toFixed(2);
    xdat2 = x2.toFixed(2);
    ydat2 = y2.toFixed(2);
    vxdat1 = vx1.toFixed(2);
    vydat1 = vy1.toFixed(2);
    vxdat2 = vx2.toFixed(2);
    vydat2 = vy2.toFixed(2);
    hasil+=tdat+"\t"+xdat1+"\t"+ydat1+"\t"+xdat2+"\t"+ydat2+"\t"+vxdat1+"\t"+vydat1+"\t"+vxdat2+"\t"+vydat2+"\n";

	// Update parameters
	document.getElementById("tcur").value = ti+dt;
	ti=ti+dt;
	
	// Terminate simulation
	if(ti > tf) {
			clearInterval(timer1);
			document.getElementById("mulai").innerHTML = "Mulai";
			document.getElementById("mulai").disabled = true;
			first = false;
	}
}
