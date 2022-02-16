const canvas = document.getElementById('can');
const c = canvas.getContext('2d');

canvas.width = innerWidth ;
canvas.height = innerHeight ;

//variables
let mouse = {
    x: 10,
    y: 10
};

const colors = [
    '#2185c5',
    '#7ECEFD',
    '#FFF6E5',
    '#FF0005',
];

//Event Listeners
addEventListener("mousemove", function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener("resize", function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});


//utility function
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
};

function distance(x1, y1, x2, y2) {
    let xDist = x2 - x1;
    let yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function rotate(velocity, angle) {
    const rotateVelocities = {
        x: velocity.x = Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x = Math.sin(angle) - velocity.y * Math.cos(angle),
    };

    return rotateVelocities;
}

function resolveCollision(particule, otherParticule) {
    const xVelocityDiff = particule.velocity.x - otherParticule.velocity.x;
    const yVelocityDiff = particule.velocity.y - otherParticule.velocity.y;

    const xDist = otherParticule.x - particule.x;
    const yDist = otherParticule.y - particule.y;

    if(xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle =-Math.atan2(otherParticule.y - particule.y, otherParticule.x - particule.x);

        const m1 = particule.mass;
        const m2 = otherParticule.mass;

        //velocity before equation
        const u1 = rotate(particule.velocity, angle);
        const u2 = rotate(otherParticule.velocity, angle);

        //velocity after id collision equation
        const v1 = {x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y}
        const v2 = {x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y};

        //final velocity after rotating
        const vFinal1 = rotate(v1, +angle);
        const vFinal2 = rotate(v2, -angle);

        particule.velocity.x = vFinal1.x;
        particule.velocity.y = vFinal1.y;

        otherParticule.velocity.x = vFinal2.x;
        otherParticule.velocity.y = vFinal2.y;
    }
}

//object
function Particule(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5
    }
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;

    this.update = particules => {
        this.draw();

        for(let i = 0; i < particules.length; i++) {
            if(this === particules[i]) continue;
            if(distance(this.x, this.y, particules[i].x, particules[i].y) - this.radius * 2  < 0){
                resolveCollision(this, particules[i]);
            }
        }

        if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
            this.velocity.x = -this.velocity.x;
        }

        if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
            this.velocity.y = -this.velocity.y;
        }

        //mouse
        if(distance(mouse.x, mouse.y, this.x, this.y) < 30 && this.opacity < 0.2 ) {
            this.opacity += 0.02;
        } else if (this.opacity > 0) {
            this.opacity -= 0.02;

            this.opacity = Math.max(0, this.opacity);
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    };
}

//implentation
let particules;
function init() {
    particules = [];

    for (let i = 0; i < 10; i++) {
        const radiu = 10;
        const radius = canvas.width / (radiu + canvas.width);
        let x = randomIntFromRange(radius, canvas.width - radius);
        let y = randomIntFromRange(radius, canvas.height - radius);
        const color = randomColor(colors);
        if(i !== 0) {
            for (let j = 0; i < particules.length; j++) {
                if(distance(x, y, particules[j].x, particules[j].y) - radius * 2  < 0){
                    x = randomIntFromRange(radius, canvas.width - radius);
                    y = randomIntFromRange(radius, canvas.height - radius);

                    j = -1;
                }
                console.log(distance(x, y, particules[j].x, particules[j].y));
            }
        }
        particules.push(new Particule(x, y, radius, color));
    }
    // console.log(particules);
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    particules.forEach(particule => {
        particule.update(particules);
    });
}

init();
animate();