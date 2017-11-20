/*variabel*/
var drawBall;   // deklarasi fungsi membuat bola
var drawPotential;
var period = 10; /*periode update data*/
// variable percepatan benda
var ax1 = 0;    /*percepatan awal horizontal benda 1*/
var ax2 = 0;    /*percepatan awal horizontal benda 2*/
var ay1 = 0;    /*percepatan awal vertikal benda 1*/
var ay2 = 0;    /*percepatan awal vertikal benda 2*/
// variable kecepatan benda
var vx1 = 0;    /*kecepatan awal horizontal benda 1*/
var vx2 = 0;    /*kecepatan awal horizontal benda 2*/
var vy1 = 0;    /*kecepatan awal vertikal benda 1*/
var vy2 = 0;    /*kecepatan awal vertikal benda 2*/
var v12 = 0;
var v22 = 0;
// variable posisi benda
var x1 = 150;   /*posisi awal horizontal benda 1*/
var x2 = 200;   /*posisi awal horizontal benda 2*/
var y1;   /*posisi awal vertikal benda 1*/
var y2;   /*posisi awal vertikal benda 3*/
var xc = 0;
var yc = 0;
// parameter benda
var R1;    /*jari-jari benda 1*/
var R2;    /*jari-jari benda 2*/
var c1;     /*konstanta viskositas benda 1*/
var c2;     /*konstanta viskositas benda 2*/
var m1;     /*massa benda 1 (dalam kg)*/
var m2;     /*massa benda 2 (dalam kg)*/
// parameter pegas
var L = 50;     /*panjang pegas awal (dalam cm)*/
var l = 0;      /*panjang pegas akhir (dalam cm)*/
var k;     /*konstanta pegas (dalam N/m)*/
// parameter lain-lain
var g = 98;     /*konstanta gravitasi (dalam m/s^2)*/
var dt;  /*perubahan waktu*/
var deltay = 0; // variable perbedaan posisi vertikal benda 1 dan 2
var deltax = 0; // variable perbedaan posisi horizontal benda 1 dan 2
var deltal = 0; // variable perubahan panjang pegas
var beta = 0;   /*sudut awal garis benda 1 ke 2 dengan horizontal*/
// energi
var epotential1 = 0;
var epotential2 = 0;
var epotential = 0;
var ekinetic1 = 0;
var ekinetic2 = 0;
var ekinetic = 0;
var espring1 = 0;
var espring2 = 0;
var espring = 0;
var etotal = 0;
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

var fisrt = true;
var timer;

var xmax;
var ymax;
var ymax1;
var dx;
var dy;
var t = 0;
var first = true;

function start() {
	toggle();
}

function ready() {
    y1 = parseFloat(document.getElementById("y1").value);
    R1 = parseFloat(document.getElementById("R1").value);
    c1 = parseFloat(document.getElementById("c1").value);
    m1 = parseFloat(document.getElementById("m1").value);

    y2 = parseFloat(document.getElementById("y2").value);
    R2 = parseFloat(document.getElementById("R2").value);
    c2 = parseFloat(document.getElementById("c2").value);
    m2 = parseFloat(document.getElementById("m2").value);

    k = parseFloat(document.getElementById("k").value);
    dt = parseFloat(document.getElementById("dt").value);

    drawBall= myCanvas.getContext('2d');

    drawBall.beginPath();
    drawBall.moveTo(x1,y1);
    drawBall.lineTo(x2,y2);
    drawBall.lineWidth =2;
    drawBall.strokeStyle=black;

    drawBall.stroke();
    drawBall.beginPath();
	drawBall.fillStyle=black;
	drawBall.arc(x1,y1,R1,0,Math.PI*2,true);
	drawBall.closePath();
	drawBall.fill();
	
	drawBall.beginPath();
	drawBall.fillStyle=red;
	drawBall.arc(x2,y2,R2,0,Math.PI*2,true);
	drawBall.closePath();
    drawBall.fill();

    xc = (m1*x1 + m2*x2)/(m1+m2);
    yc = (m1*y1 + m2*y2)/(m1+m2);
    
    putText(drawBall,"xc",20,90);
	putText(drawBall,xc.toFixed(2),40,90);
	putText(drawBall,"yc",20,100);
	putText(drawBall,(myCanvas.height-y1).toFixed(2),40,100);
    
    deltax = x2 - x1;
    deltay = y2 - y1;
    beta = Math.atan(deltay/deltax);
    l = Math.sqrt((deltax*deltax)+(deltay*deltay));
    L = l;
}

function reset() {
    location.reload();
}

function toggle() {
	if(document.getElementById("start").innerHTML == "Stop") {
		// Stop simulation
		document.getElementById("start").innerHTML = "Start";
		clearInterval(timer);
	} else {
		// Run simulation
		document.getElementById("start").innerHTML = "Stop";
		timer = setInterval(startSimulation, period);
	}
}

function putText(text,value,xdat,ydat) {
	text.font = "10px Arial";  
	text.fillStyle = black;
	text.textAlign = "left";
	text.fillText(value,xdat,ydat);
}

function graph(plot,xpos,ypos,dotsize,color) {
    plot.beginPath();
    plot.fillStyle=color;
    plot.arc(xpos,ypos,dotsize,0,Math.PI*2,true);
    plot.closePath();
    plot.fill();
}

/*fungsi memulai simulasi*/
function startSimulation() {
	drawBall= myCanvas.getContext('2d');
	drawBall.clearRect(0,0,myCanvas.width,myCanvas.height);

	if (l < L) {
		drawBall.beginPath();
		drawBall.moveTo(x1,y1);
		drawBall.lineTo(x2,y2);
		drawBall.lineWidth =2;
		drawBall.strokeStyle=green;
		drawBall.stroke();
	} else if (l > L) {
		drawBall.beginPath();
		drawBall.moveTo(x1,y1);
		drawBall.lineTo(x2,y2);
		drawBall.lineWidth =2;
		drawBall.strokeStyle=red;
		drawBall.stroke();
	} else {
		drawBall.beginPath();
		drawBall.moveTo(x1,y1);
		drawBall.lineTo(x2,y2);
		drawBall.lineWidth =2;
		drawBall.strokeStyle=black;
		drawBall.stroke();
	}

	drawBall.beginPath();
	drawBall.fillStyle=black;
	drawBall.arc(x1,y1,R1,0,Math.PI*2,true);
	drawBall.closePath();
	drawBall.fill();
	
	drawBall.beginPath();
	drawBall.fillStyle=red;
	drawBall.arc(x2,y2,R2,0,Math.PI*2,true);
	drawBall.closePath();
	drawBall.fill();

	epotential1 = m1*g*(myCanvas.height-y1-R1);
	epotential2 = m1*g*(myCanvas.height-y2-R2);
	ekinetic1 = 1/2*m1*v12;
	ekinetic2 = 1/2*m2*v22;
	espring1 = 1/2*k*deltal*deltal;
	espring2 = 1/2*k*deltal*deltal;
	etotal = epotential1 + epotential2 +
			ekinetic1 + ekinetic2 +
			0.5*(espring1 + espring2);

	epotential = epotential1 + epotential2;
	ekinetic = ekinetic1 + ekinetic2;
	espring = 0.5*(espring1 + espring2);

	epotential = potentialGraph.height * epotential / 200000;
	ekinetic = kineticGraph.height * ekinetic / 200000;
	espring = springGraph.height * espring / 200000;
	etotal = totalGraph.height * etotal / 200000;

	drawPotential = potentialGraph.getContext('2d');
	drawKinetic = kineticGraph.getContext('2d');
	drawSpring = springGraph.getContext('2d');
	drawTotal = totalGraph.getContext('2d');

	graph(drawPotential,t,potentialGraph.height-epotential,0.5,black);
	graph(drawKinetic,t,kineticGraph.height-ekinetic,0.5,black);
	graph(drawSpring,t,springGraph.height-espring,0.5,black);
	graph(drawTotal,t,totalGraph.height-etotal,0.5,black)

	v12 = (vx1*vx1)+(vy1*vy1);
	v22 = (vx2*vx2)+(vy2*vy2);
	t = t + 0.2;

	deltax = x2 - x1;
	deltay = y2 - y1;
	beta = Math.atan(deltay/deltax);
	l = Math.sqrt((deltax*deltax)+(deltay*deltay));
	deltal = l - L;

	/*nilai percepatannya benda*/
	if(x1 <= x2) {
		ax1 = (k*deltal*(Math.cos(beta)) - (c1*vx1)) / m1;
		ay1 = (k*deltal*(Math.sin(beta)) + (m1*g) - (c1*vy1)) / m1;
		ax2 = (-k*deltal*Math.cos(beta) - (c2*vx2)) / m2;
		ay2 = (-k*deltal*Math.sin(beta) + (m2*g) - (c2*vy2)) / m2;
	}
	else if(x1 >= x2) {
		ax1 = (-k*deltal*(Math.cos(beta)) - (c1*vx1)) / m1;
		ay1 = (-k*deltal*(Math.sin(beta)) + (m1*g) - (c1*vy1)) / m1;
		ax2 = (k*deltal*Math.cos(beta) - (c2*vx2)) / m2;
		ay2 = (k*deltal*Math.sin(beta) + (m2*g) - (c2*vy2)) / m2;
	}
	xc = (m1*x1 + m2*x2)/(m1+m2);
	yc = (m1*y1 + m2*y2)/(m1+m2);
	putText(drawBall,"xc",20,90);
	putText(drawBall,xc.toFixed(2),40,90);
	putText(drawBall,"yc",20,100);
	putText(drawBall,(myCanvas.height-y1).toFixed(2),40,100);
	
	vx1 = vx1 + (ax1*dt);
	vy1 = vy1 + (ay1*dt);
	vx2 = vx2 + (ax2*dt);
	vy2 = vy2 + (ay2*dt);

	// }
	/*nilai posisi benda*/
	x1 = x1 + (vx1*dt);
	y1 = y1 + (vy1*dt);
	x2 = x2 + (vx2*dt);
	y2 = y2 + (vy2*dt);

	if(y1 >= myCanvas.height-R1) {
		if (vy1 > 0) {
			vy1 = -vy1;
		} else {
			vy1 = vy1;
		}
	}
	if(y2 >= myCanvas.height-R2) {
		if (vy2 > 0) {
			vy2 = -vy2;
		} else {
			vy2 = vy2;
		}
	}
	if (t >= potentialGraph.width) {
		toggle();
	}
}