window.onload = function() {
    let img = document.createElement("img");
    img.src = "images/spriteTest.png";
    img.onload = function() {
        init();
      };
    
    var init = function() {
        let canvas = document.getElementById('zoneJeu');
        let ctx = canvas.getContext('2d');
        //getContext retourne un contexte de dessin sur le canevas, ou null si l'identificateur de contexte n'est pas supporté (voir MDN pour plus de précisions)
   
        const scale = 2.5;
        const width = 16;
        const height = 18;
        const scaledWidth = scale * width;
        const scaledHeight = scale * height;
    
        function drawFrame(frameX, frameY, canvasX, canvasY) {
            ctx.drawImage(img, frameX * width, frameY * height, width, height, canvasX, canvasY, scaledWidth, scaledHeight);
            //Donc une frame = largeur ou longueur du perso ici
        }
        
        const CYCLE_LOOP = [0, 1, 0, 2];
        //0 = état initial du perso, 1 et 2 = états de mouvement
        //alernance entre 0, 1, 0, 2, 0... (cycle du mouvement)
        let currentLoopIndex = 0;
        let frameCount = 0;
        const FACING_DOWN = 0;
        const FACING_UP = 1;
        const FACING_LEFT = 2;
        const FACING_RIGHT = 3;
        let currentDirection = FACING_DOWN;
        let keyPresses = {};

        window.addEventListener('keydown', keyDownListener);
        function keyDownListener(event) {
            keyPresses[event.key.toLowerCase()] = true;
            //event.key correspond à la touche sur laquelle l'événement est déclenché (touche pressée ici)
            //keyPresses est un dictionnaire définit au préalable
            //On va ajouter dans ce dico des asscoiations -> touche pressée : booléen
            //Les booléens déterminent si une touche est pressée ou non (true si pressée, false sinon)
        }

        window.addEventListener('keyup', keyUpListener);
        function keyUpListener(event) {
        keyPresses[event.key.toLowerCase()] = false;
        //Le .toLowerCase() permet d'éviter les problèmes avec les touches de modification shift et capterlock
        }
        
        let MOVEMENT_SPEED = 1;
        let positionX = 0;
        let positionY = 0;

        const FRAME_LIMIT = 12;
        //Correspond au nombre de FPS (60 FPS = 60 frames par seconde), va donc déterminer la fréquence de l'animation
          
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //Pour "nettoyer" = on supprime la partie correspondante -> paramètres = (x, y, largeur, hauteur)
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
                frameCount++;
                if (frameCount >= FRAME_LIMIT) {
                //Une fois que 12 frames sont passées (FPS), on avance d'un cran dans l'animation, si FRAME_LIMIT augmente, l'animation sera plus lente
                  frameCount = 0;
                  currentLoopIndex++;
                  //On avance d'un état (voir suite), de 0 à 1 par exemple
                  if (currentLoopIndex >= CYCLE_LOOP.length) {
                    //Car currentLoopIndex sert d'indice pour le tableau CYCLE_LOOP
                    currentLoopIndex = 0;
                  }
                }
            }
            if (!hasMoved) {
                currentLoopIndex = 0;
            }

            drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
            //Paramètres correspondant à frameX, frameY (pour les positions dans l'image) / canvasX et canvasY (positions dans le canvas)
            //Correspond à la colonne, donc prend les valeurs 0, 1 et 2, car ensuite multiplié par largeur du sprite 
            //0 = état initial du perso dans une direction, puis alternance
            //currentDirection correspond à la ligne dans l'image (ligne 1 = de face), donc = 0, 1, 2, ou 3 car ensuite multiplié par hauteur du sprite
            //positionX et positionY correspondent aux positions dans le canvas et sont initialisées à 0 (coin supérieur gauche)
            window.requestAnimationFrame(gameLoop);
        }
        window.requestAnimationFrame(gameLoop);

        function moveCharacter(deltaX, deltaY, direction) {
            //Paramètres : translations selon x et y, direction du perso (regarde en haut, en bas, à droite ou à gauche)
            if (positionX + deltaX > 0 && positionX + scaledWidth + deltaX < canvas.width) {
            //Permet d'éviter de franchir les bordures sur la largeur
              positionX += deltaX;
            }
            if (positionY + deltaY > 0 && positionY + scaledHeight + deltaY < canvas.height) {
              positionY += deltaY;
            }
            currentDirection = direction;
        }
    }
}