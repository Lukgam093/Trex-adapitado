var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud,cloudImg;
var obstacles,obs1,obs2,obs3,obs4,obs5,obs6;
var score = 0;
var obstacleGroup,cloudGroup;
var restart,restartImg,gameOver,gameOverImg;
var die,jump,checkpoint;

function preload() {

    //Animações do chão e trex
    trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    trex_collided = loadImage("trex_collided.png");
    groundImage = loadImage("ground2.png");
    cloudImg = loadImage("cloud2.png");

    //Imagens dos obstaculos
    obs1 = loadImage("obstacle1.png");
    obs2 = loadImage("obstacle2.png");
    obs3 =loadImage("obstacle3.png");
    obs4 = loadImage("obstacle4.png");
    obs5 = loadImage("obstacle5.png");
    obs6 =loadImage("obstacle6.png");

    //Imagens de gameover e restart
    restartImg = loadImage("restart.png");
    gameOverImg = loadImage("gameOver.png");

    //sons
    die = loadSound("die.mp3");
    jump = loadSound("jump.mp3");
    checkpoint = loadSound("checkPoint.mp3");
}
function setup(){
    createCanvas(600, 200);

    //Trex
    trex = createSprite(50,160,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided);
    trex.scale = 0.5;
    trex.setCollider("rectangle",0,0,200,trex.height);
    //trex.debug = true;


    //Chão
    ground = createSprite(200,180,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;

    //restart e gameOver
    gameOver = createSprite(300,100);
    gameOver.addImage(gameOverImg);

    restart = createSprite(300,150);
    restart.addImage(restartImg);
    restart.scale = 0.7;
    

    //Chão invisivel
    invisibleGround = createSprite(200,195,400,20);
    invisibleGround.visible = false;

    //Grupos
    obstacleGroup = new Group();
    cloudGroup = new Group();
}
function draw() {
    background("white");
    
    text("pontuação: "+score,500,50);
   
    console.log("isto é: "+gameState);

    if(gameState === PLAY){
        gameOver.visible = false;
        restart.visible = false;

        ground.velocityX = -(4 + score/100);
        score = score+Math.round(frameCount/100);

        if(score>0 && score % 100 === 0){
            checkpoint.play();
        }

        //Fazer o trex pular
        if(keyDown("space") && trex.y>150){
        trex.velocityY = -12;
        jump.play();
        }
        
        //Gravidade do trex
        trex.velocityY = trex.velocityY + 0.8
        if(ground.x < 0){
        ground.x = ground.width / 2;
        }

        //Gerar as nuvens
        spawnClouds()

        //gerar obstaculos
        spawnObstacles()

        if(obstacleGroup.isTouching(trex)){
            //gameState = END;
            //die.play();
            trex.velocityY = -12;
            jump.play();
        }

    }

    else if(gameState === END){
        gameOver.visible = true;
        restart.visible = true;

        ground.velocityX = 0;
        trex.velocityY = 0;

        trex.changeAnimation("collided", trex_collided);

        cloudGroup.setLifetimeEach(-1);
        cloudGroup.setVelocityXEach(0);

        obstacleGroup.setLifetimeEach(-1);
        obstacleGroup.setVelocityXEach(0);
    }
    
    //Trex não atravessar o chão
    trex.collide(invisibleGround);

    drawSprites();
}

function spawnClouds(){
    if(frameCount % Math.round(random(30,80)) === 0){
    cloud = createSprite(600,100,40,10);
    cloud.velocityX = -2
    cloud.addImage(cloudImg);
    cloud.scale=random(0.4,0.8);
    cloud.y = Math.round(random(10,60));
    trex.depth=cloud.depth;
    trex.depth=trex.depth + 1;

    //tempo de vida da nuvem
    cloud.lifetime = 320;

    console.log(trex.depth);
    console.log(cloud.depth);

    //Adicionando cada nuvem ao grupo
    cloudGroup.add(cloud);
    }
}

//geração de obstaculos
function spawnObstacles(){
    if(frameCount % 60 ===0){
        obstacle = createSprite(600,165,10,40);
        obstacle.velocityX = -(6 + score / 100);
        var sorteio = Math.round(random(1,6));
        switch(sorteio){
            case 1 :
                obstacle.addImage(obs1);
                break;
            case 2 :
                obstacle.addImage(obs2);
                break;
            case 3 :
                obstacle.addImage(obs3);
                break;
            case 4 :
                obstacle.addImage(obs4);
                break;
            case 5 :
                obstacle.addImage(obs5);
                break;
            case 6 :
                obstacle.addImage(obs6);
                break;
            default:break;
        }
        obstacle.scale = 0.6;
        obstacle.lifetime = 300;

        //adicionando os obstaculos ao grupo
        obstacleGroup.add(obstacle);
    }
}