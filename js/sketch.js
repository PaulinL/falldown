let joueur;
let projectiles;
let tauxApp = 100;
let meilleurScore = 0;
let unBonus = null;
let intervalId;

document.onkeydown = function(evt) {
    evt = evt || window.event;
    let keyCode = evt.keyCode;
    if (keyCode >= 37 && keyCode <= 40) {
        return false;
    }
};

function setup() {

    canvas = createCanvas(700, 700);
    canvas.parent('sketch_holder');
    joueur = new Joueur(width / 2, height / 2);
    projectiles = [];
    //setInterval(nouveauProjectile,tauxApp);
    //setInterval(nouveauBonus, 10000);
    startInterval(tauxApp);

    //setInterval(function(){joueur.score++}, 90);
    $(document).ready(function () {
        setInterval(function () {
            if (document.hasFocus()) {
                joueur.pts++;
            }
        }, 90);
    });

    $(document).ready(function () {
        setInterval(function () {
            if (document.hasFocus()) {
                nouveauBonus()
            }
        }, 11000);
    });


}

function draw() {
    background(0);
    stroke(255);

    if (unBonus) {
        if (unBonus.toDelete()) {
            unBonus = null;
        }
        else {
            unBonus.update();
            unBonus.show();
        }
    }
    if (unBonus) {
        if (joueur.touch(unBonus)) {
            joueur.catch(unBonus);
            unBonus = null;
        }
    }

    gestionProjectiles();

    joueur.move();
    joueur.show();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nouveauProjectile() {
    $(document).ready(function () {
        if (document.hasFocus()) {
            projectiles.push(new Cercle(random(0, width), 0, speed = joueur.pts / 200));
        }

    });
    //projectiles.push(new Cercle(random(0, width), 0, speed = joueur.score / 200));
}

function nouveauBonus() {
    unBonus = new Bonus();
}

function startInterval(interval) {
    clearInterval(intervalId);
    intervalId = setInterval(nouveauProjectile, interval);
}

function gestionProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        afficherScores();
        projectiles[i].update();
        projectiles[i].show();
        if (projectiles[i].toBeDeleted()) { //suppression des projectiles en bas
            projectiles.splice(i, 1);
            joueur.pts++;

            if (joueur.pts % 60 === 0 && tauxApp > 4) { //augmentation de la difficulté
                tauxApp *= 0.8;
                startInterval(tauxApp);
            }
        }
        if (joueur.touch(projectiles[i])) { //si le joueur touche un projectile, il perd
            perdrePartie();
        }
    }
}

function afficherScores() {
    textSize(20);
    fill(80);
    textStyle(NORMAL);
    stroke(80);
    text("Score : " + joueur.pts, 10, height - 20);
    text("Meilleur score : " + meilleurScore, 10, height - 45);
    text("Nb boules : " + projectiles.length, 10, height - 70);
}

function perdrePartie() {
    if(joueur.pts>60){
        sendScore();
    }

    background(255, 0, 0);
    projectiles = []; //suppression des projectiles
    if (meilleurScore < joueur.pts) //meilleur score mis a jour
        meilleurScore = joueur.pts;
    joueur = new Joueur(width / 2, height / 2); //reinitialisation du joueur
    unBonus = null;

    tauxApp = 100; //reset taux d'appartition
    startInterval(tauxApp);

}

class Joueur{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.taille=12;
        this.pts=0;
    }
    show(){
        fill(255);
        ellipse(this.x,this.y,this.taille);
        if(this.x<0 || this.x>width || this.y<0 || this.y>height){
            this.x=width/2;
            this.y=height/2;
        }
    }
    move(){
        if (keyIsDown(LEFT_ARROW) && this.x > 0)
            this.x-=this.speed;

        if (keyIsDown(RIGHT_ARROW) && this.x < width)
            this.x+=this.speed;

        if (keyIsDown(UP_ARROW) && this.y > 0)
            this.y-=this.speed;

        if (keyIsDown(DOWN_ARROW) && this.y < height)
            this.y+=this.speed;
        // this.x=mouseX;
        // this.y=mouseY;
    }
    touch(object){
        return (dist(this.x, this.y, object.x, object.y) <= (this.taille / 2 + object.taille / 2));
    }

    catch(bonus){
        switch (bonus.typeBonus){
            case 1 : //clear des projectiles
                projectiles = [];
                tauxApp *= 1.15;
                startInterval(tauxApp);
                textSize(100);
                stroke(50);
                textStyle(BOLD);
                fill(50);
                text("CLEARED",50,height/2);
                break;
            case 2:
                tauxApp *= 1.23;
                startInterval(tauxApp);
                let $bon = getRandomInt(80,120);
                joueur.pts += $bon;
                textSize(100);
                stroke(50);
                textStyle(BOLD);
                fill(50);
                text("+" . toString($bon),width/2-50,height/2);
                break;
        }
    }
}

class Cercle{
    constructor(x,y,s){
        this.x=x;
        this.y=y;
        this.taille=random(15,25);
        let maxSpeed=s+3;
        this.speed=random(2,maxSpeed);
        this.R=random(0,255);
        this.G=random(0,255);
        this.B=random(0,255);
        this.moving = random(0,6);
    }
    show(){
        stroke(255);
        fill(this.R,this.G,this.B);
        ellipse(this.x,this.y,this.taille);
    }
    update(){
        this.y+=this.speed;
        if(this.moving<1){
            this.x+=random(-4,4);
        }
    }

    toBeDeleted(){
        return !(this.y - this.taille < height);
    }
}

class Bonus{
    constructor(){
        this.x = 0;
        this.y = random(50,height-50);
        this.typeBonus = getRandomInt(1,2);
        this.taille=30;
    }
    show(){
        fill(random(0,255),random(0,255),random(0,255));
        ellipse(this.x,this.y,this.taille);
    }
    update(){
        this.x += 5;
        this.y += random(-10,10);
    }
    toDelete(){
        return !(this.x<=width);
    }

}
function sendScore() {
    $.ajax
    ({
        url: "../saveScore.php",
        type: "POST",
        cache: false,
        data: "score=" + joueur.pts +"&jeu=" +1,
                   // success: function (data) {
                   //     alert(data);
                   // }
    })
}
