window.onload = function() {
    let pause = false;
    let mouseEventActif = false;
    let runningActif = false;
    let currentlyRunning = false;
    // <===== Vie =====>
    function vie(nvie) {
        for (let i = 1; i <= nvie; i++) {
            let vie = document.getElementById("vie"+i);
            vie.src = "images/coeurPlein.png";
        }
        for (let j = 3; j > nvie; j--) {
            let vie2 = document.getElementById("vie"+j);
            vie2.src = "images/coeurVide.png";
        }
    }
    var vieBase = 1;
    let nVies = vieBase;
    vie(nVies);

    // <===== Images =====>
    var createImage = function(url) {
        var image = document.createElement("img");
        image.src = url;
        return image
    }
        
    var balle = createImage("images/munitions.png");
    var energyBall = createImage("images/energyBall.png");
    let shootImages = [{"image":balle, "width":8, "height":19, "scale":0.7, "vitesse":4}, {"image":energyBall, "width":25, "height":25, "scale":0.4, "vitesse":4}];
    var mobBasic = createImage("images/Mob1.png");
    var mobFast = createImage("images/Mob2.png")
    let mobImages = [{"image":mobBasic, "width":25, "height":28, "scale":1.2, "vitesse":1}, {"image":mobFast, "width":26, "height":18, "scale":1.4, "vitesse":2}]
    var fond = createImage("images/fond.png");
    var fondVertical = createImage("images/fondVertical.png");
    var explosions = createImage("images/explosions.png");
    let img = createImage("images/planes.png");

    // <===== Choix munition =====>
    let typeMun = shootImages[0];
    var changeMun = function() {
        let num = parseInt(this.id[3])-1;
        typeMun = shootImages[num];
    }
    var mun1 = document.getElementById("mun1");
    mun1.addEventListener("click", changeMun);
    var mun2 = document.getElementById("mun2");
    mun2.addEventListener("click", changeMun);

    var startGame = function() {
        pause = false;
        // <===== Reset vie =====>
        nVies = vieBase;
        vie(nVies);

        // <===== Display des menus et du jeu =====>
        var elMenu = document.querySelectorAll("div#menu *");
        for (let i = 0; i < elMenu.length; i++) {
            elMenu[i].style.display = "none";
        }
        var elMenuInter = document.querySelectorAll("div#menuIntermediaire *");
        for (let i = 0; i < elMenuInter.length; i++) {
            elMenuInter[i].style.display = "none";
        }
        var spanDeath = document.querySelectorAll("#death span");
        for (let i = 0; i < spanDeath.length; i++) {
            spanDeath[i].style.display = "none";
        }
        var reprise = document.getElementById("reprise");
        reprise.style.display = "none";
        var elJeu = document.querySelectorAll("div#jeu *");
        for (let i = 0; i < elJeu.length; i++) {
            elJeu[i].style.display = "initial";
        }

        init();
    }
    img.onload = function() {
        var boutonStart = document.getElementById("start");
        boutonStart.addEventListener("click", startGame);
    }
    var stopGame = function() {
        // <===== Display des menus et du jeu =====>
        var elMenu = document.querySelectorAll("div#menu *");
        for (let i = 0; i < elMenu.length; i++) {
            elMenu[i].style.display = "initial";
        }
        var elMenuInter = document.querySelectorAll("div#menuIntermediaire *");
        for (let i = 0; i < elMenuInter.length; i++) {
            elMenuInter[i].style.display = "none";
        }
        var elJeu = document.querySelectorAll("div#jeu *");
        for (let i = 0; i < elJeu.length; i++) {
            elJeu[i].style.display = "none";
        }
        var spanDeath = document.querySelectorAll("#death span");
        for (let i = 0; i < spanDeath.length; i++) {
            spanDeath[i].style.display = "none";
        }
        var reprise = document.getElementById("reprise");
        reprise.style.display = "none";
    }

    // <===== Animations =====>    
    var init = function() {
        var body = document.getElementById("body");
        body.style.cursor = "none";
        // <===== Temps =====>
        let secondes = document.getElementById("secondes");
        let minutes = document.getElementById("minutes");
        secondes.innerHTML = "0 seconde";
        minutes.innerHTML = "0 minute et ";
        var chrono = function() {
            let compteur = parseInt(secondes.innerHTML)+1;
            if (compteur < 60) {
                if (compteur <= 1) {
                    secondes.innerHTML = compteur + " seconde";
                }
                else {
                    secondes.innerHTML = compteur + " secondes";
                }
            }
            else {
                compteurMin = parseInt(minutes.innerHTML) + 1;
                if (compteurMin == 1) {
                    minutes.innerHTML = compteurMin + " minute et "
                    secondes.innerHTML = "0 seconde";
                }
                else {
                    minutes.innerHTML = compteurMin + " minutes et "
                    secondes.innerHTML = "0 seconde";
                }
            }
        }
        boucleTemps = setInterval(chrono, 1000);

        // <===== Canvas =====>
        let canvas = document.getElementById('zoneJeu');
        let ctx = canvas.getContext('2d');
        //getContext retourne un contexte de dessin sur le canevas, ou null si l'identificateur de contexte n'est pas supporté (voir MDN pour plus de précisions)
        let canvasExt = document.getElementById('zoneExt');
        let ctxExt = canvasExt.getContext('2d');
        ctxExt.globalAlpha = 0.5;
        ctxExt.filter = "brightness(0.6)";
        let canvasMob = document.getElementById('zoneMob');
        let ctxMob = canvasMob.getContext('2d');

        const scale = 0.8;
        const width = 24*3;
        const height = 21*3;
        const scaledWidth = scale * width;
        const scaledHeight = scale * height;
        let playerHitbox = {"rayon":scaledHeight, "X":0, "Y":0, "direction":0};
        let invisibleFrames = 0;
    
        function drawFrame(frameX, frameY, canvasX, canvasY) {
            if (frameY == 0) {
                ctx.drawImage(img, frameX * width + frameX*3, frameY, width, height + frameX * 12, canvasX, canvasY, scaledWidth, scaledHeight + scale * frameX * 12);
                //Donc une frame = largeur ou longueur du perso ici
                playerHitbox.X = canvasX;
                playerHitbox.Y = canvasY;
                playerHitbox.direction = frameY;
            }
            else {
                if (frameY == 2) {
                    ctx.drawImage(img, frameX * width + frameX*3, height+width+18, width, height + frameX * 12, canvasX, canvasY - frameX * 12, scaledWidth, scaledHeight + scale * frameX * 12);
                    playerHitbox.X = canvasX;
                    playerHitbox.Y = canvasY - frameX * 12;
                    playerHitbox.direction = frameY;
                }
                else { 
                    if (frameY == 1) {
                        ctx.drawImage(img, frameX * height + frameX*3, height+15, height + frameX * 12, width, canvasX, canvasY, scaledHeight + scale * frameX * 12, scaledWidth);
                        playerHitbox.X = canvasX;
                        playerHitbox.Y = canvasY;
                        playerHitbox.direction = frameY;
                    }
                    else {
                        ctx.drawImage(img, frameX * height + frameX*3, 2*height+width+33, height + frameX * 12, width, canvasX - frameX * 12, canvasY, scaledHeight + scale * frameX * 12, scaledWidth);
                        playerHitbox.X = canvasX - frameX * 12;
                        playerHitbox.Y = canvasY;
                        playerHitbox.direction = frameY;
                    }
                }
            }
            
        }
        
        const CYCLE_LOOP = [0, 1];
        //0 = état initial du perso, 1 = état de mouvement
        //alernance entre 0, 1, 0, 2, 0... (cycle du mouvement)
        let currentLoopIndex = 0;
        const FACING_DOWN = 2;
        const FACING_UP = 0;
        const FACING_LEFT = 1;
        const FACING_RIGHT = 3;
        let currentDirection = FACING_UP;
        let keyPresses = {};
        let frequenceTir = 40;
        let currentShoot = 39;
        let munitions = [];
        let compteur = 0;
        let cycleFond = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        let cycleFondReverse = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
        let currentFond = 0;
        let frameFond = 0;
        let frameFondMax = 4;
        let tabMob = [];
        let spawnCount = 0;
        let compteurMob = 0;

        window.addEventListener('keydown', keyDownListener);
        function keyDownListener(event) {
            keyPresses[event.key.toLowerCase()] = true;
            //event.key correspond à la touche sur laquelle l'événement est déclenché (touche pressée ici)
            //keyPresses est un dictionnaire définit au préalable
            //On va ajouter dans ce dico des asscoiations -> touche pressée : booléen
            //Les booléens déterminent si une touche est pressée ou non (true si pressée, false sinon)
            if (event.key == " ") {
                keyPresses["space"] = true;
            }
        }

        window.addEventListener('keyup', keyUpListener);
        function keyUpListener(event) {
        keyPresses[event.key.toLowerCase()] = false;
        //Le .toLowerCase() permet d'éviter les problèmes avec les touches de modification shift et capterlock
        if (event.key == " ") {
            keyPresses["space"] = false;
        }
        }
        
        let MOVEMENT_SPEED = 1;
        let positionX = 171.2;
        let positionY = 164.8;
          
        function gameLoop() {
            // <===== Nettoyage =====>
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctxExt.clearRect(0, 0, canvasExt.width, canvasExt.height);
            ctxMob.clearRect(0, 0, canvasMob.width, canvasMob.height);
            //Pour "nettoyer" = on supprime la partie correspondante -> paramètres = (x, y, largeur, hauteur)

            // <===== Touches =====>
            let hasMoved = false;

            if (keyPresses.z) {
                //keyPresses.z donne la valeur associée à la touche z qui est un booléen (true = touche pressée, false sinon)
                moveCharacter(0, -MOVEMENT_SPEED, FACING_UP);
                //MOVEMENT_SPEED va ici déterminer la translation selon y, dans un canvas, translation négative pour y = aller vers le heut
                hasMoved = true;
            } else if (keyPresses.s) {
                moveCharacter(0, MOVEMENT_SPEED, FACING_DOWN);
                hasMoved = true;
            }
            if (keyPresses.q) {
                moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
                //Translation négative pour x = aller vers la gauche
                hasMoved = true;
            } else if (keyPresses.d) {
                moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
                hasMoved = true;
            }
            if (keyPresses.shift) {
                MOVEMENT_SPEED = 2;
            }
            else {
                MOVEMENT_SPEED = 1; 
            }

            if (hasMoved) {
                currentLoopIndex = 1;
                //état de mouvement
            }

            else {
                currentLoopIndex = 0;
            }
            if (keyPresses.space) {
                currentShoot++;
                if (currentShoot >= frequenceTir) {
                    currentShoot = 0;
                    shoot(typeMun);
                }
            }
            else {
                currentShoot++;
            }

            if (keyPresses.p && (!pause)) {
                pause = true;
            }

            // <===== Animation de tirs =====>
            for (let i = 0; i < munitions.length; i++) {
                if (munitions[i].active) {
                    let tirX = 0;
                    let tirY = 0;
                    var type = munitions[i].type;
                    var vitesse = type.vitesse;
                    if (munitions[i].direction == FACING_UP) {
                        tirX = munitions[i].X;
                        tirY = munitions[i].Y - vitesse;
                        ctx.drawImage(type.image, 0, 0, type.width, type.height, tirX, tirY, type.width*type.scale, type.height*type.scale);
                    }
                    else {
                        if (munitions[i].direction == FACING_DOWN) {
                            tirX = munitions[i].X;
                            tirY = munitions[i].Y + vitesse;
                            if (type == shootImages[0]) {
                                ctx.drawImage(type.image, 0, type.height+type.width+2, type.width, type.height, tirX, tirY, type.width*type.scale, type.height*type.scale);
                            }
                            else {
                                ctx.drawImage(type.image, 0, 0, type.width, type.height, tirX, tirY, type.width*type.scale, type.height*type.scale);
                            }
                        }
                        else {
                            if (munitions[i].direction == FACING_LEFT) {
                                tirX = munitions[i].X - vitesse;
                                tirY = munitions[i].Y;
                                if (type == shootImages[0]) {
                                    ctx.drawImage(type.image, 0, type.height+1, type.height, type.width, tirX, tirY, type.height*type.scale, type.width*type.scale);
                                }
                                else {
                                    ctx.drawImage(type.image, 0, 0, type.width, type.height, tirX, tirY, type.width*type.scale, type.height*type.scale);
                                }
                            }
                            else {
                                tirX = munitions[i].X + vitesse;
                                tirY = munitions[i].Y;
                                if (type == shootImages[0]) {
                                    ctx.drawImage(type.image, 0, 2*type.height+type.width+3, type.height, type.width, tirX, tirY, type.height*type.scale, type.width*type.scale);
                                }
                                else {
                                    ctx.drawImage(type.image, 0, 0, type.width, type.height, tirX, tirY, type.width*type.scale, type.height*type.scale);
                                }
                            }
                        }
                    }
                    munitions[i].X = tirX;
                    munitions[i].Y = tirY;
                }
            }

            // <===== Animation du fond =====>
            frameFond++;
            if (frameFond >= frameFondMax) {
                frameFond = 0;
                currentFond++;
                if (currentFond > 15) {
                    currentFond = 0;
                }
            }
            for (let i = 0; i<4; i++) {
                if (i<3) {
                    ctxExt.drawImage(fond, cycleFond[currentFond]*33, 0, 32, 32, 0, 100+i*100, 100, 100);
                    ctxExt.drawImage(fond, cycleFondReverse[currentFond]*33, 0, 32, 32, 500, 100+i*100, 100, 100);
                    ctxExt.drawImage(fondVertical, 0, cycleFond[currentFond]*33, 32, 32, 100+i*100, 0, 100, 100);
                    ctxExt.drawImage(fondVertical, 0, cycleFondReverse[currentFond]*33, 32, 32, 100+i*100, 480, 100, 100);
                }
                else {
                    ctxExt.drawImage(fond, cycleFond[currentFond]*33, 0, 32, 32, 0, 100+i*100, 100, 80);
                    ctxExt.drawImage(fond, cycleFondReverse[currentFond]*33, 0, 32, 32, 500, 100+i*100, 100, 80);
                    ctxExt.drawImage(fondVertical, 0, cycleFond[currentFond]*33, 32, 32, 100+i*100, 0, 100, 100);
                    ctxExt.drawImage(fondVertical, 0, cycleFondReverse[currentFond]*33, 32, 32, 100+i*100, 480, 100, 100);
                }
            }

            // <===== Animation des ennemis =====>
            spawnCount = spawnCount-1;
            var sec = parseInt(secondes.innerHTML);
            var min = parseInt(minutes.innerHTML);
            if (sec >= 2 && sec < 40 && min == 0 && spawnCount <= 0) {
                spawnMob(1, 2, mobImages[0]);
                spawnCount = 200;
            }
            else {
                if ((min == 0 && sec >= 40 && spawnCount <= 0) || (sec < 30 && min == 1 && spawnCount <= 0)) {
                    spawnMob(1, 4, mobImages[0]);
                    spawnCount = 300;
                }
                else {
                    if ((min == 1 && spawnCount <= 0) || (sec < 20 && min == 2 && spawnCount <=0)) {
                        spawnMob(1, 3, mobImages[0]);
                        spawnMob(0, 1, mobImages[1]);
                        spawnCount = 300;
                    }
                }
            }

            for (let i = 0; i < tabMob.length; i++) {
                let iMob = tabMob[i];
                if (iMob.X < 100 && iMob.active) {
                    ctxMob.drawImage(iMob.type.image, 0, 0, iMob.type.width, iMob.type.height, iMob.X+0.7, iMob.Y, iMob.type.width*iMob.type.scale, iMob.type.height*iMob.type.scale);
                    iMob.X = iMob.X+0.7;
                }
                else {
                    if (iMob.X > 500-iMob.type.width*iMob.type.scale && iMob.active) {
                        ctxMob.drawImage(iMob.type.image, 0, 0, iMob.type.width, iMob.type.height, iMob.X-0.7, iMob.Y, iMob.type.width*iMob.type.scale, iMob.type.height*iMob.type.scale);
                        iMob.X = iMob.X-0.7;
                    }
                    else {
                        if (iMob.Y < 100 && iMob.active) {
                            ctxMob.drawImage(iMob.type.image, 0, 0, iMob.type.width, iMob.type.height, iMob.X, iMob.Y+0.7, iMob.type.width*iMob.type.scale, iMob.type.height*iMob.type.scale);
                            iMob.Y = iMob.Y+0.7;
                        }
                        else {
                            if (iMob.Y > 480-iMob.type.height*iMob.type.scale && iMob.active) {
                                ctxMob.drawImage(iMob.type.image, 0, 0, iMob.type.width, iMob.type.height, iMob.X, iMob.Y-0.7, iMob.type.width*iMob.type.scale, iMob.type.height*iMob.type.scale);
                                iMob.Y = iMob.Y-0.7;
                            }
                            else {
                                if (iMob.active) {
                                    if (iMob.tours == 0) {
                                        iMob.tours = randomBetween(1, 100);
                                        iMob.direction = randomDirection();
                                    }
                                    moveMob(iMob, iMob.direction, iMob.type.vitesse);
                                }
                            }
                        }
                    }
                }
            }

            // <===== Animation du joueur =====>
            drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
            //Paramètres correspondant à frameX, frameY (pour les positions dans l'image) / canvasX et canvasY (positions dans le canvas)
            //Correspond à la colonne, donc prend les valeurs 0, 1 et 2, car ensuite multiplié par largeur du sprite 
            //0 = état initial du perso dans une direction, puis alternance
            //currentDirection correspond à la ligne dans l'image (ligne 1 = de face), donc = 0, 1, 2, ou 3 car ensuite multiplié par hauteur du sprite
            //positionX et positionY correspondent aux positions dans le canvas et sont initialisées à 0 (coin supérieur gauche)

            // <===== Collisions =====>
            if (tabMob.length) {
                for (var mob of tabMob) {
                    if (collisionJoueur(playerHitbox, mob) && mob.active && invisibleFrames == 0) {
                        mob.active = false;
                        invisibleFrames = 100;
                        nVies--;
                        vie(nVies);
                    }
                    for (var projectile of munitions) {
                        if (collision(projectile, mob) && projectile.active && mob.active) {
                            mob.active = false;
                            projectile.active = false;
                        }
                    }
                }
            }
            
            // <===== Pause =====>
            var reprise = document.getElementById("reprise");

            function testActif () {
                //console.log("testactif");
                if (runningActif) {
                    console.log("desactiverunning");
                    reprise.removeEventListener("click", running);
                    runningActif = false;
                }
            }

            function pauseGame() {
                if (pause) {
                    currentlyRunning = false;
                    clearInterval(boucleTemps);
                    if (document.visibilityState === "visible" && pause) {
                        console.log("pausing");
                        var body = document.getElementById("body");
                        body.style.cursor = "default";
                        reprise.style.display = "initial";
                        if (!runningActif) {
                            console.log("activation");
                            reprise.addEventListener("click", running);
                            runningActif = true;
                        }
                        interMenu();
                    }
                }
            }

            function running(e) {
                if (currentlyRunning) {
                    e.preventDefault();
                }
                else {
                    currentlyRunning = true;
                    console.log("running");
                    pause = false;
                    var buttonRestart = document.getElementById("restart");
                    buttonRestart.style.display = "none";
                    var buttonHome = document.getElementById("goHome");
                    buttonHome.style.display = "none";
                    var body = document.getElementById("body");
                    body.style.cursor = "none";
                    reprise.style.display = "none";
                    if (runningActif) {
                        reprise.removeEventListener("click", running);
                        runningActif = false;
                    }
                    boucleTemps = setInterval(chrono, 1000);
                    update();
                }
            }

            var mouseLeaving = function(event) {
                if(event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight)) {
                    pause = true;
                }
            }
            if (!mouseEventActif) {
                var body = document.getElementById("body");
                body.addEventListener("mouseleave", mouseLeaving);
                mouseEventActif = true;
            }

            // <===== Hit / Death check / Pause check =====>
            if (invisibleFrames > 0) {
                ctx.globalAlpha = 0.5;
                invisibleFrames--;
            }
            else {
                ctx.globalAlpha = 1;
            }

            function update() {
                if (!pause) {
                    RID = window.requestAnimationFrame(gameLoop);
                }
                else {
                    console.log("testActif");
                    testActif();
                    pauseGame();
                }
            }
            update();

            if (nVies == 0) {
                var body = document.getElementById("body");
                body.style.cursor = "default";
                clearInterval(boucleTemps);
                window.cancelAnimationFrame(RID);
                window.cancelAnimationFrame(RID2);
                deathAnimation(positionX, positionY);
            }
        }
        RID2 = window.requestAnimationFrame(gameLoop);

        // <===== Fonctions nécessaires au jeu =====>
        function moveCharacter(deltaX, deltaY, direction) {
            //Paramètres : translations selon x et y, direction du perso (regarde en haut, en bas, à droite ou à gauche)
            if (positionX + deltaX > 0 && positionX + scaledHeight+ deltaX < canvas.width) {
            //Permet d'éviter de franchir les bordures sur la largeur
              positionX += deltaX;
            }
            if (positionY + deltaY > 0 && positionY + scaledHeight + deltaY < canvas.height) {
              positionY += deltaY;
            }
            currentDirection = direction;
        }

        function moveMob(mob, direction, vitesse) {
            if (direction == FACING_UP) {
                if (mob.Y-vitesse > 100) {
                    ctxMob.drawImage(mob.type.image, 0, 0, mob.type.width, mob.type.height, mob.X, mob.Y-vitesse, mob.type.width*mob.type.scale, mob.type.height*mob.type.scale);
                    mob.Y = mob.Y-vitesse;
                }
                else {
                    mob.direction = changeRandomDirection(mob.direction);
                }
            }
            else {
                if (direction == FACING_DOWN) {
                    if (mob.Y+vitesse < 480-mob.type.height*mob.type.scale) {
                        ctxMob.drawImage(mob.type.image, 0, 0, mob.type.width, mob.type.height, mob.X, mob.Y+vitesse, mob.type.width*mob.type.scale, mob.type.height*mob.type.scale);
                        mob.Y = mob.Y+vitesse;
                    }
                    else {
                        mob.direction = changeRandomDirection(mob.direction);
                    }
                }
                else {
                    if (direction == FACING_LEFT) {
                        if (mob.X-vitesse > 100) {
                            ctxMob.drawImage(mob.type.image, 0, 0, mob.type.width, mob.type.height, mob.X-vitesse, mob.Y, mob.type.width*mob.type.scale, mob.type.height*mob.type.scale);
                            mob.X = mob.X-vitesse;
                        }
                        else {
                            mob.direction = changeRandomDirection(mob.direction);
                        }
                    }
                    else {
                        if (mob.X+vitesse < 500-mob.type.width*mob.type.scale) {
                            ctxMob.drawImage(mob.type.image, 0, 0, mob.type.width, mob.type.height, mob.X+vitesse, mob.Y, mob.type.width*mob.type.scale, mob.type.height*mob.type.scale);
                            mob.X = mob.X+vitesse;
                        }
                        else {
                            mob.direction = changeRandomDirection(mob.direction);
                        }
                    }
                }
            }
            mob.tours--;
        }

        function shoot(projectile) {
            let shootX = positionX;
            let shootY = positionY;
            let shootX2 = positionX;
            let shootY2 = positionY;
            let shootX3 = positionX;
            let shootY3 = positionY;
            var direction = currentDirection;
            var type = projectile;
            if (currentDirection == FACING_UP) {
                shootX += scaledWidth/2-type.width*type.scale/2;
                shootY -= type.height*type.scale;
                if (projectile == shootImages[0]) {
                    ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX, shootY, type.width*type.scale, type.height*type.scale);
                }
                else {
                    ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX, shootY, type.width*type.scale, type.height*type.scale);
                    shootX2 += 1.5*3*scale-type.width*type.scale/2;
                    shootY2 += 10*3*scale-type.height*type.scale;
                    ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX2, shootY2, type.width*type.scale, type.height*type.scale);
                    shootX3 += 22.5*3*scale-type.width*type.scale/2;
                    shootY3 += 10*3*scale-type.height*type.scale;
                    ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX3, shootY3, type.width*type.scale, type.height*type.scale);
                }
            }
            else {
                if (currentDirection == FACING_DOWN) {
                    shootX += scaledWidth/2-type.width*type.scale/2;
                    shootY += scaledHeight;
                    if (projectile == shootImages[0]) {
                        ctx.drawImage(type.image, 0, type.height+type.width+2, type.width, type.height, shootX, shootY, type.width*type.scale, type.height*type.scale);
                    }
                    else {
                        ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX, shootY, type.width*type.scale, type.height*type.scale);
                        shootX2 += 1.5*3*scale-type.width*type.scale/2;
                        shootY2 += 11*3*scale;
                        ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX2, shootY2, type.width*type.scale, type.height*type.scale);
                        shootX3 += 22.5*3*scale-type.width*type.scale/2;
                        shootY3 += 11*3*scale;
                        ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX3, shootY3, type.width*type.scale, type.height*type.scale);
                    }
                }
                else {
                    if (currentDirection ==  FACING_LEFT) {
                        shootX += 0;
                        shootY += scaledWidth/2-type.width*type.scale/2;
                        if (projectile == shootImages[0]) {
                            ctx.drawImage(type.image, 0, type.height+1, type.height, type.width, shootX, shootY, type.height*type.scale, type.width*type.scale);
                        }
                        else {
                            ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX, shootY, type.width*type.scale, type.height*type.scale);
                            shootX2 += 10*3*scale-type.width*type.scale;
                            shootY2 += 22.5*3*scale-type.width*type.scale/2;
                            ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX2, shootY2, type.width*type.scale, type.height*type.scale);
                            shootX3 += 10*3*scale-type.width*type.scale;
                            shootY3 += 1.5*3*scale-type.width*type.scale/2;
                            ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX3, shootY3, type.width*type.scale, type.height*type.scale);
                        }
                    }
                    else {
                        shootX += scaledHeight;
                        shootY += scaledWidth/2-type.width*type.scale/2;
                        if (projectile == shootImages[0]) {
                            ctx.drawImage(type.image, 0, 2*type.height+type.width+3, type.height, type.width, shootX, shootY, type.height*type.scale, type.width*type.scale);
                        }
                        else {
                            ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX, shootY, type.width*type.scale, type.height*type.scale);
                            shootX2 += 11*3*scale;
                            shootY2 += 1.5*3*scale-type.width*type.scale/2;
                            ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX2, shootY2, type.width*type.scale, type.height*type.scale);
                            shootX3 += 11*3*scale;
                            shootY3 += 22.5*3*scale-type.width*type.scale/2;
                            ctx.drawImage(type.image, 0, 0, type.width, type.height, shootX3, shootY3, type.width*type.scale, type.height*type.scale);
                        }
                    }
                }
            }
            munitions[compteur] = {"type":projectile, "X":shootX, "Y":shootY, "direction":direction, "active":true};
            if (projectile == shootImages[1]) {
                compteur++;
                munitions[compteur] = {"type":projectile, "X":shootX2, "Y":shootY2, "direction":direction, "active":true};
                compteur++;
                munitions[compteur] = {"type":projectile, "X":shootX3, "Y":shootY3, "direction":direction, "active":true};
            }
            compteur++;
        }

        function randomBetween(min, max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        }

        function randomDirection() {
            let hasard = Math.random();
            let res = FACING_DOWN;
            if (hasard < 0.25) {
                res = FACING_UP;
            }
            else {
                if (hasard < 0.5) {
                    res = FACING_DOWN;
                }
                else {
                    if (hasard < 0.75) {
                        res = FACING_LEFT;
                    }
                    else {
                        res = FACING_RIGHT;
                    }
                }
            }
            return res;
        }

        function changeRandomDirection(direction) {
            let hasard = Math.random()*3;
            let res = direction;
            if (res == FACING_UP) {
                if (hasard < 1) {
                    res = FACING_LEFT;
                }
                else {
                    if (hasard < 2) {
                        res = FACING_DOWN;
                    }
                    else {
                        res = FACING_RIGHT;
                    }
                }
            }
            else {
                if (res == FACING_DOWN) {
                    if (hasard < 1) {
                        res = FACING_LEFT;
                    }
                    else {
                        if (hasard < 2) {
                            res = FACING_UP;
                        }
                        else {
                            res = FACING_RIGHT;
                        }
                    }
                }
                else {
                    if (res == FACING_LEFT) {
                        if (hasard < 1) {
                            res = FACING_UP;
                        }
                        else {
                            if (hasard < 2) {
                                res = FACING_DOWN;
                            }
                            else {
                                res = FACING_RIGHT;
                            }
                        }
                    }
                    else {
                        if (hasard < 1) {
                            res = FACING_UP;
                        }
                        else {
                            if (hasard < 2) {
                                res = FACING_DOWN;
                            }
                            else {
                                res = FACING_UP;
                            }
                        }
                    }
                }
            }
            return res;
        }

        function spawnMob(min, max, mob) {
            var random = randomBetween(min, max);
            let positionMobY = 0;
            for (let i = 0; i < random; i++) {
                let positionMobX = randomBetween(0, 1);
                if (positionMobX == 0) {
                    if (Math.random() < 0.5) {
                        positionMobX = 0;
                    }
                    else {
                        positionMobX = 600-mob.width*mob.scale;
                    }
                    positionMobY = randomBetween(100, 480-mob.height*mob.scale);
                }
                else {
                    positionMobX = randomBetween(100, 500-mob.width*mob.scale);
                    if (Math.random() < 0.5) {
                        positionMobY = 0;
                    }
                    else {
                        positionMobY = 580-mob.height*mob.scale;
                    }
                }
                ctxMob.drawImage(mob.image, 0, 0, mob.width, mob.height, positionMobX, positionMobY, mob.width*mob.scale, mob.width*mob.scale);
                tabMob[compteurMob] = {"type":mob, "X":positionMobX, "Y":positionMobY, "tours":0, "direction":FACING_UP, "active":true};
                compteurMob++;
            }
        }

        function collision(objet1, objet2) {
            let collision = true;
            if (objet1.X > objet2.X-100 + objet2.type.width*objet2.type.scale || objet1.Y > objet2.Y-100 + objet2.type.height*objet2.type.scale || objet2.X-100 > objet1.X + objet1.type.width*objet1.type.scale || objet2.Y-100 > objet1.Y + objet1.type.height*objet1.type.scale) {
                collision = false;
            }
            return collision;
        }

        function collisionJoueur(joueur, objet) {
            let collision = true;
            let joueurX = 0;
            let joueurY = 0;
            let joueurWidth = 0;
            let joueurHeight = 0;
            if (joueur.direction == FACING_UP) {
                joueurX = joueur.X + 9*3*scale;
                joueurY = joueur.Y;
                joueurWidth = 4*3;
                joueurHeight = 19*3;
            }
            else {
                if (joueur.direction == FACING_DOWN) {
                    joueurX = joueur.X + 9*3*scale;
                    joueurY = joueur.Y + 2*3*scale;
                    joueurWidth = 4*3;
                    joueurHeight = 19*3;
                }
                else {
                    if (joueur.direction == FACING_LEFT) {
                        joueurX = joueur.X;
                        joueurY = joueur.Y + 9*3*scale;
                        joueurWidth = 19*3;
                        joueurHeight = 4*3;
                    }
                    else {
                        joueurX = joueur.X + 2*3*scale;
                        joueurY = joueur.Y + 9*3*scale;
                        joueurWidth = 19*3;
                        joueurHeight = 4*3;
                    }
                }
            }
            if (joueurX > objet.X-100 + objet.type.width*objet.type.scale || joueurY > objet.Y-100 + objet.type.height*objet.type.scale || objet.X-100 > joueurX + joueurWidth || objet.Y-100 > joueurY + joueurHeight) {
                collision = false;
            }
            return collision;
        }

        let n = 1;
        let i = 0;
        function deathAnimation(X, Y) {
            ctx.globalAlpha = 1;
            var scaleExplosion = 2;
            function explosion(X, Y, scale) {
                let halfWidth = 0;
                let halfHeight = 0;
                if (currentDirection == FACING_DOWN || currentDirection == FACING_UP) {
                    halfWidth = 28.8;
                    halfHeight = 25.2;
                }
                else {
                    halfWidth = 25.2;
                    halfHeight = 28.8;
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (i >= 10) {
                    n++;
                    i = 0;
                }
                i++;
                if (n == 1) {
                    ctx.drawImage(explosions, 0, 0, 25, 26, X+halfWidth-12.5*scale, Y+halfHeight-13*scale, 25*scale, 26*scale);
                }
                else {
                    if (n == 2) {
                        ctx.drawImage(explosions, 26, 0, 32, 34, X+halfWidth-16*scale, Y+halfHeight-17*scale, 32*scale, 34*scale);
                    }
                    else {
                        if (n == 3) {
                            ctx.drawImage(explosions, 59, 0, 34, 34, X+halfWidth-17*scale, Y+halfHeight-17*scale, 34*scale, 34*scale);
                        }
                        else {
                            if (n == 4) {
                                ctx.drawImage(explosions, 94, 0, 29, 30, X+halfWidth-14.5*scale, Y+halfHeight-15*scale, 29*scale, 30*scale);
                            }
                            else {
                                if (n == 5) {
                                    ctx.drawImage(explosions, 124, 0, 27, 28, X+halfWidth-13.5*scale, Y+halfHeight-14*scale, 27*scale, 28*scale);
                                }
                            }
                        }
                    }
                }
                EXPL = window.requestAnimationFrame(function() {explosion(X, Y, scale)});
                if (n > 5) {
                    window.cancelAnimationFrame(EXPL);
                    window.cancelAnimationFrame(EXPL2);
                    ctxMob.clearRect(0, 0, canvasMob.width, canvasMob.height);
                    deathMessage();
                }
            }
            EXPL2 = window.requestAnimationFrame(function() {explosion(X, Y, scaleExplosion)});
        }

        function deathMessage() { 
            var lettres = document.querySelectorAll("#death span");
            for (let i = 0; i<lettres.length; i++) {
                lettres[i].style.display = "initial";
            }
            var divDeath = document.getElementById("death");
            var styleDeath = window.getComputedStyle(divDeath);
            divDeath.style.transform = "translate(-" + parseInt(styleDeath.width)/2 + "px, -" + parseInt(styleDeath.height)/2 + "px)";
            let animate = anime({
                targets : "#death span",
                opacity: [0,1],
                easing: "easeInOutQuad",
                duration: 1000,
                delay: (el, i) => 300 * (i),
                complete: function() {interMenu()}
            })
        }

        function interMenu() {
            var buttonRestart = document.getElementById("restart");
            buttonRestart.style.display = "initial";
            buttonRestart.addEventListener("click", startGame);
            var buttonHome = document.getElementById("goHome");
            buttonHome.style.display = "initial";
            buttonHome.addEventListener("click", stopGame);
        }
    }
}