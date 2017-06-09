/*fungsi memulai simulasi*/
function mulaiFunction() {
	/*variabel*/
	var drawBall;
	var period = 50; /*periode update data*/
	var ax1 = 0; /*percepatan awal horizontal*/
	var ax2 = 0; /*percepatan awal horizontal*/
	var ay1 = 0; /*percepatan awal vertikal*/
	var ay2 = 0; /*percepatan awal vertikal*/
	var vx1 = 0; /*kecepatan awal horizontal*/
	var vx2 = 0; /*kecepatan awal horizontal*/
	var vy1 = 0; /*kecepatan awal vertikal*/
	var vy2 = 0; /*kecepatan awal vertikal*/
	var x1 = 350; /*posisi awal horizontal*/
	var x2 = 400; /*posisi awal horizontal*/
	var y1 = 50; /*posisi awal vertikal*/
	var y2 = 100; /*posisi awal vertikal*/
	var R1 = 10; /*jari-jari benda 1*/
	var R2 = 20; /*jari-jari benda 2*/
	var beta = 0; /*sudut awal*/
	var c1 = 0.1; /*konstanta viskositas benda 1*/
	var c2 = 2; /*konstanta viskositas benda 2*/
	var m1 = 1; /*massa benda 1 (dalam kg)*/
	var m2 = 2; /*massa benda 2 (dalam kg)*/
	var g = 10; /*konstanta gravitasi (dalam m/s^2)*/
	var L = 50; /*panjang pegas awal (dalam cm)*/
	var l = 0; /*panjang pegas akhir (dalam cm)*/
	var k = 10; /*konstanta pegas (dalam N/m)*/
	var dt = 0.127; /*perubahan waktu*/
	var deltay = 0;
	var deltax = 0;
	var deltal = 0;
	/*fungsi untuk mengupdate posisi lingkaran*/
	function updatePos() {
		drawBall= myCanvas.getContext('2d');
		drawBall.clearRect(0,0,640,480);
		drawBall.beginPath();
		drawBall.fillStyle="#000000";
		drawBall.arc(x1,y1,R1,0,Math.PI*2,true);
		drawBall.arc(x2,y2,R2,0,Math.PI*2,true);
		drawBall.closePath();
		drawBall.fill();
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
		/*nilai kecepatan benda*/
		vx1 = vx1 + (ax1*dt);
		vy1 = vy1 + (ay1*dt);
		vx2 = vx2 + (ax2*dt);
		vy2 = vy2 + (ay2*dt);
		/*nilai posisi benda*/
		x1 = x1 + (vx1*dt);
		y1 = y1 + (vy1*dt);
		x2 = x2 + (vx2*dt);
		y2 = y2 + (vy2*dt);
		
}			
	setInterval(updatePos, period)
}
