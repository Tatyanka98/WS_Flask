// Перезагрузка старницы с анимацией логотипа

window.addEventListener("load",function() {
    const SPEED_ANIM = 0.001;
    let canv, ctx; 
    let maxx, maxy;
    let events;
    const mrandom = Math.random;
    const mfloor = Math.floor;
    const mround = Math.round;
    const mceil = Math.ceil;
    const mabs = Math.abs;
    const mmin = Math.min;
    const mmax = Math.max;
    const mPI = Math.PI;
    const mPIS2 = Math.PI / 2;
    const mPIS3 = Math.PI / 3;
    const m2PI = Math.PI * 2;
    const m2PIS3 = Math.PI * 2 / 3;
    const msin = Math.sin;
    const mcos = Math.cos;
    const matan2 = Math.atan2;
    const mhypot = Math.hypot;
    const msqrt = Math.sqrt;
    const rac3   = msqrt(3);
    const rac3s2 = rac3 / 2;
    const bcontainer = document.getElementById( 'blob' );
    function alea (mini, maxi) {
        if (typeof(maxi) == 'undefined') return mini * mrandom();
        return mini + mrandom() * (maxi - mini);
    }
    function intAlea (mini, maxi) {
        if (typeof(maxi) == 'undefined') return mfloor(mini * mrandom()); 
        return mini + mfloor(mrandom() * (maxi - mini)); 
    }
    function Noise1DOneShot (period, min = 0, max = 1, random) {
        random = random || Math.random;
        let currx = random();
        let y0 = min + (max - min) * random();
        let y1 = min + (max - min) * random();
        let dx = 1 / period;
        return function() {
            currx += dx;
            if (currx > 1) {
                currx -= 1;
                y0 = y1;
                y1 = min + (max - min) * random();
            }
            let z = (3 - 2 * currx) * currx * currx;
            return z * y1 + (1 - z) * y0;
        }
    }
    function drawBezierArc (p0, p1, p2, p3) {
        let dx, dy, lngth, ltg, lctrl;
        let x1c, y1c; 
        let x2c, y2c; 
        const coeffDir = 0.3; 
        lngth = mhypot(p2[0] - p1[0], p2[1] - p1[1]);
        lctrl = lngth * coeffDir
        dx = p2[0] - p0[0];
        dy = p2[1] - p0[1];
        ltg = mhypot(dx, dy);
        x1c = p1[0] + lctrl * dx / ltg;
        y1c = p1[1] + lctrl * dy / ltg;
        dx = p1[0] - p3[0];
        dy = p1[1] - p3[1];
        ltg = mhypot(dx, dy);
        x2c = p2[0] + lctrl * dx / ltg;
        y2c = p2[1] + lctrl * dy / ltg;
        ctx.bezierCurveTo(x1c ,y1c,
            x2c, y2c,
        p2[0], p2[1]);
    }
    function Blob (xc, yc, radiusMax, nbSteps, lineWidth, hue) {
        this.xc = xc;
        this.yc = yc;
        this.radiusMax = radiusMax;
        this.nbSteps = nbSteps;
        this.lineWidth = lineWidth;
        let nbPts = this.nbPts = intAlea(4, 10);
        this.th0 = alea(m2PI);
        let deltadir = m2PI / nbPts;
        let periodAngle = nbSteps / alea(1,5); 
        let periodRadius = nbSteps / alea(2,5);
        let periodHue = nbSteps /alea(2, 5);
        this.huef = Noise1DOneShot(periodHue, hue, hue + intAlea(90));
        this.points = []; 
        this.pointFunctions = [];
        for (let k = 0; k < nbPts; ++k) {
            this.pointFunctions[k] = {angle: Noise1DOneShot( periodAngle,
            deltadir * (k - 0.4), deltadir * (k + 0.4)),
            radius: Noise1DOneShot( periodRadius,
            0.4, 1) };
        } 
    } 
    Blob.prototype.actualPoints = function (kStep) {
        let pf, angle, radius;
        for (let k = 0; k < this.nbPts; ++k) {
            pf = this.pointFunctions[k];
            angle = this.th0 + pf.angle();
            radius = this.radiusMax * pf.radius() * kStep / this.nbSteps;
            this.points[k] = [this.xc + radius * mcos(angle),
            this.yc + radius * msin(angle)];
        } 
    } 
    Blob.prototype.draw = function() {
        let k, pt;
        let k1, k2, k3;
        ctx.beginPath();
        ctx.moveTo (this.points[1][0],this.points[1][1]);
        k1 = 1;
        k2 = 2;
        k3 = 3;
        if (k3 >= this.nbPts ) k3 -= this.nbPts;
        for (k = 0 ; k < this.nbPts; ++k ) {
            drawBezierArc(
                this.points[k],        
                this.points[k1],
                this.points[k2],
            this.points[k3]);
            k1++; if (k1 >= this.nbPts) k1 -= this.nbPts;
            k2++; if (k2 >= this.nbPts) k2 -= this.nbPts;
            k3++; if (k3 >= this.nbPts) k3 -= this.nbPts;
        }
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = `hsl(${(this.huef() % 360)}, 100%, 50%)`;
        ctx.stroke();
    }
    let animate;
    { 
        let animState = 0;
        let blob;
        let kStep;
        animate = function(tStamp) {
            let event;
            let tinit, radMax;
            event = events.pop();
            if (event && event.event == 'reset') animState = 0;
            if (event && event.event == 'click') animState = 0;
            window.requestAnimationFrame(animate)
            tinit = performance.now();
            do {
                switch (animState) {
                    case 0 :
                    if (startOver()) {
                        radMax = mhypot(maxx / 2, maxy / 2)
                        kStep = mround(radMax * 5);
                        blob = new Blob ( maxx / 2, maxy / 2, radMax, kStep, 0.1, intAlea(360));
                        ++animState;
                    }
                    break;
                    case 1 :
                    blob.actualPoints(kStep);
                    blob.draw();
                    if (--kStep <= 0) {
                        ++animState;
                    }
                    break;
                    case 2:
                    break;
                }
            } while ((animState == 1) && (performance.now() - tinit < SPEED_ANIM));
        } 
    } 
    function startOver() {
        maxx = bcontainer.offsetWidth;
        maxy = bcontainer.offsetHeight;
        canv.width = maxx;
        canv.height = maxy;
        ctx.clearRect(0, 0, maxx, maxy);
        return true;
    }
    function mouseClick (event) {
        events.push({event:'click'});;
    }
    {
        canv = document.createElement('canvas');
        canv.style.position="absolute";
        canv.style.top=0;
        bcontainer.appendChild(canv);
        ctx = canv.getContext('2d');
    }
    let block = document.getElementsByClassName('block');
    window.addEventListener('resize', mouseClick);  
    for (var i = 0; i < block.length; i++) {
        block[i].addEventListener('click', mouseClick);
    }  
    events = [{event:'reset'}];
    requestAnimationFrame(animate);
});
