/*
Introduction to Programming I (CM1005-01) - Coursework 2.2 Game project submission [002]
Student name : Zinhle Maurice-Mopp
Student number : 210125870
Candidate number : LX1314

Personal comment:
•	My extentions are the sounds that accompany my Candyland Game. I found some sounds easy to implement into my game functions, however I found difficulty with others as the sounds were distorted when run in the game code. The sound that plays when the game is over is distorted. In attempting to correct the sound, I tried to modify the sound's volume, amplitude, rate, sampleRate, reverb, etc. Unfortunately, I did not see any changes. Although my efforts did not change the sound, I still enjoyed trying out various sound related p5.js functions. 
•	This is my first experience / introduction into programmming. I have learnt a great deal in this course. The practical appplications, Sleuth cases and the Game Project, have made learning and practicing the core aspects of programming great fun. I have enjoyed creating this game and I am proud of what I have been able to produce. I look forward to further increasing my programming knowledge, in more new and exciting ways.   
*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isFound;
var isReached;
var trees_x;
var mountains; 
var collectables; 
var canyons; 
var game_score;
var flagpole;
var lives;
var gameMusic;
var jumpSound;
var game_overSound;
var game_wonSound;

function preload()
{
    soundFormats('mp3','wav');
    gameMusic = loadSound('assets/gameMusic.wav');
    gameMusic.setVolume(0.1);
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    game_overSound = loadSound('assets/gameOver.wav');
    game_overSound.setVolume(0.1);
}
 
function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
    lives = 3;
    startGame();
    reverb = new p5.Reverb();
    game_overSound.disconnect();
    reverb.process(game_overSound, 3, 2);
}

function draw()
{
	background(100, 155, 255);
	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height / 4); 
    
    push();
    translate(scrollPos, 0);
    
	drawClouds();
    drawMountains();
    drawTrees();
    
    for (var i = 0; i < canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }
	
    for (var i = 0; i < collectables.length; i++)
        {
            if (!collectables[i].isFound)
            {
                drawCollectable(collectables[i]);
                checkCollectable(collectables[i]);
            }
        }
    drawFlagpole();
    pop();
    
	drawGameChar();
    
    fill(255);
    textSize(25);
    text("score: " + game_score, 20, 40);
    text("lives: " , 800, 40);
    for (var i = 0; i < lives; i++)
        {
            drawLives(90, i, 45);
        }
    if (lives < 1)
        {
            fill(244, 0, 0);
            textSize(150);
            text("Game Over.", width / 2 - 400, height / 2 + 80);
            game_overSound.play();
            reverb.drywet(0.2);
            return ;
        }
    else if(flagpole.isReached)
            {
            fill(random(0, 255,0), 
                 random(255, 165, 0), 
                 random(124,252,0));
            textSize(100);
            text("Congratulations!", width / 2 - 450, height / 2 + 30);
            text("You have won!", width / 2 - 450, height / 2 + 120);
            return;
            }
	
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; 
		}
	}

    if (gameChar_y < floorPos_y)
        {
            gameChar_y += 5;
            isFalling = true;
        }
    else
        {
            isFalling = false;
        }

	if (!flagpole.isReached)
        {
        checkFlagpole();
        }
    
    checkPlayerDie();
	gameChar_world_x = gameChar_x - scrollPos;
}

function keyPressed()
{
     if(key == "A" || keyCode == 37)
     {
        isLeft = true;
     }
     if(key == "D" || keyCode == 39)
     {
        isRight = true;
     }
     if (key == " " || keyCode == 32)
     {
         if (!isFalling)  
              {
                gameChar_y -= 100;
                jumpSound.play();
              }
     }
}

function keyReleased()
{
    if(key == "A" || keyCode == 37)
    {
        isLeft = false;
    }
    
    if(key == "D" || keyCode == 39)
    {
        isRight = false;
    }     
}   

function drawGameChar()
{
	//Game character jumping left code
	if(isLeft && isFalling)
	{
	//Game character's body 
    strokeWeight(1);
    stroke(51);
    fill(255, 153, 204);
    rect(gameChar_x - 10, gameChar_y - 35, 20, 22);
    ellipse(gameChar_x + 0.5, gameChar_y - 35, 20, 5); 
    
    //Game character's eyes 
    stroke(51);
    fill(255);
    ellipse(gameChar_x - 5, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x - 2, gameChar_y - 25, 4 ,8);
    ellipse(gameChar_x - 5, gameChar_y - 25, 1, 2);
    ellipse(gameChar_x - 2, gameChar_y - 25, 1, 2);

    //Game character's mouth
    fill(255, 0, 127); 
    ellipse(gameChar_x - 4, gameChar_y - 19, 2, 3);

    //Game character's arms 
    fill(0); 
    rect(gameChar_x + 8, gameChar_y - 26, 1, 5);
    rect(gameChar_x - 13, gameChar_y - 25, 1, 5);
    rect(gameChar_x + 3, gameChar_y - 20, 5, 1);
    rect(gameChar_x - 11, gameChar_y - 20, 1, 1);
    
    //Game character's legs 
    fill(0); 
    rect(gameChar_x + 5, gameChar_y - 13, 1, 9);
    rect(gameChar_x - 5, gameChar_y - 13, 1, 9);
	}
    
    //Game character jumping right code
	else if(isRight && isFalling)
	{
    //Game character's body 
    strokeWeight(1);
    stroke(51);
    fill(255, 153, 204);
    rect(gameChar_x - 10, gameChar_y - 35, 20, 22);
    ellipse(gameChar_x + 0.5, gameChar_y - 35, 20, 5); 
    
    //Game character's eyes 
    stroke(51);
    fill(255);
    ellipse(gameChar_x + 8, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x + 5, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x + 8, gameChar_y - 25, 1, 2);
    ellipse(gameChar_x + 5, gameChar_y - 25, 1, 2);
    
    //Game character's mouth
    fill(255,0,127); 
    ellipse(gameChar_x + 7, gameChar_y - 19, 2, 3);

    //Game character's arms 
    fill(0); 
    rect(gameChar_x + 12, gameChar_y - 25, 1, 5);
    rect(gameChar_x - 10, gameChar_y - 25, 1, 5);
    rect(gameChar_x + 10, gameChar_y - 20, 1, 1);
    rect(gameChar_x - 8, gameChar_y - 20, 5, 1);
    
    //Game character's legs 
    fill(0); 
    rect(gameChar_x + 5, gameChar_y - 13, 1, 9);
    rect(gameChar_x - 5, gameChar_y - 13, 1, 9);
	}
    
    //Game character walking left code
	else if(isLeft)
	{
    //Game character's body 
    strokeWeight(1);
    stroke(51);
    fill(255, 153, 204);
    rect(gameChar_x - 10, gameChar_y - 35, 20, 22);
    ellipse(gameChar_x + 0.5, gameChar_y - 35, 20, 5); 
    
    //Game character's eyes 
    stroke(51);
    fill(255);
    ellipse(gameChar_x - 5, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x - 2, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x - 5, gameChar_y - 25, 1, 2);
    ellipse(gameChar_x - 2, gameChar_y - 25, 1, 2);

    //Game charcter's arms 
    fill(0); 
    rect(gameChar_x + 9, gameChar_y - 20, 1, 9);
    
    //Game character's legs 
    fill(0); 
    rect(gameChar_x + 5, gameChar_y - 13, 1, 9);
    rect(gameChar_x - 5, gameChar_y - 13, 1, 9)
	}
    
    // Game character walking right code
	else if(isRight)
	{ 
    //Game character's body 
    strokeWeight(1);
    stroke(51);
    fill(255, 153, 204);
    rect(gameChar_x - 10, gameChar_y - 35, 20, 22);
    ellipse(gameChar_x + 0.5, gameChar_y - 35, 20, 5); 
    
    //Game character's eyes 
    stroke(51);
    fill(255);
    ellipse(gameChar_x + 8, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x + 5, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x + 8, gameChar_y - 25, 1, 2);
    ellipse(gameChar_x + 5, gameChar_y - 25, 1, 2);

    //Game charcter's arms 
    fill(0); 
    rect(gameChar_x - 10, gameChar_y - 20, 1, 9);
    
    //Game character's legs 
    fill(0); 
    rect(gameChar_x + 5, gameChar_y - 13, 1, 9);
    rect(gameChar_x - 5, gameChar_y - 13, 1, 9);
    }
    
    //Game character falling facing forwards code
	else if(isFalling || isPlummeting)
	{ 
    //Game character's body 
    strokeWeight(1);
    stroke(51);
    fill(255, 153, 204);
    rect(gameChar_x - 10, gameChar_y - 35, 20, 22);
    ellipse(gameChar_x + 0.5, gameChar_y - 35, 20, 5); 
    
    //Game character's mouth 
    fill(255, 0, 127); 
    ellipse(gameChar_x + 1, gameChar_y - 19, 2, 3);
    
    //Game character's eyes 
    stroke(51);
    fill(255);
    ellipse(gameChar_x + 5, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x - 2, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x + 5, gameChar_y - 25, 1, 2);
    ellipse(gameChar_x - 2, gameChar_y - 25, 1, 2);

    //Game character's arms 
    fill(0); 
    rect(gameChar_x + 15, gameChar_y - 25, 1, 5);
    rect(gameChar_x - 16, gameChar_y - 25, 1, 5);
    rect(gameChar_x + 10, gameChar_y - 20, 5, 1);
    rect(gameChar_x - 15, gameChar_y - 20, 5, 1);
    
    //Game character's legs 
    fill(0); 
    rect(gameChar_x + 5, gameChar_y - 13, 1, 9);
    rect(gameChar_x - 5, gameChar_y - 13, 1, 9);
	}
	
    //Game character standing front facing code
    else 
    {  
    //Game character's body 
    strokeWeight(1);
    stroke(51);
    fill(255, 153, 204);
    rect(gameChar_x - 10, gameChar_y - 35, 20, 22);
    ellipse(gameChar_x + 0.5, gameChar_y - 35, 20, 5); 
    
    //Game character's eyes 
    stroke(51);
    fill(255);
    ellipse(gameChar_x + 5, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x - 2, gameChar_y - 25, 4, 8);
    ellipse(gameChar_x + 5, gameChar_y - 25, 1, 2);
    ellipse(gameChar_x - 2, gameChar_y - 25, 1, 2);

    //Game character's arms 
    fill(0); 
    rect(gameChar_x + 9, gameChar_y - 20, 1, 9);
    rect(gameChar_x - 10, gameChar_y - 20, 1, 9);
    
    //Game character's legs 
    fill(0); 
    rect(gameChar_x + 5, gameChar_y - 13, 1, 9);
    rect(gameChar_x - 5, gameChar_y - 13, 1 ,9);
    }
}

function drawClouds()
{
  for(var i = 0; i < clouds.length; i++)
  {
        fill(192 , 255, 255);
        ellipse(clouds[i].pos_x, clouds[i].pos_y, 100, 70);
        fill(183, 255, 255);
        ellipse(clouds[i].pos_x + 10, clouds[i].pos_y + 20, 150, 50);
        fill(204, 255, 255);
        ellipse(clouds[i].pos_x + 20, clouds[i].pos_y - 10, 70, 55);
  }
}

function drawMountains()
{
  for(var i = 0; i < mountains.length; i++)
  {
        fill(255,248,220);
        ellipse(mountains[i].pos_x, mountains[i].pos_y - 45, 160, 210);
        ellipse(mountains[i].pos_x - 90, mountains[i].pos_y, 80, 110);
        ellipse(mountains[i].pos_x + 80, mountains[i].pos_y, 80, 110);
        fill(255, 0, 0);
        ellipse(mountains[i].pos_x, mountains[i].pos_y - 155, 30, 30);
        fill(153, 76, 0);
        triangle(mountains[i].pos_x, mountains[i].pos_y - 200, mountains[i].pos_x + 5, mountains[i].pos_y - 200, mountains[i].pos_x, mountains[i].pos_y - 160);
    }
}

function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {  
	    fill(255);
        rect(trees_x[i], floorPos_y - 205, 18, 210);
        fill(255, 153, 255);
        ellipse(trees_x[i] + 10, floorPos_y - 232, 160, 160);
        fill(255, 0, 255);
	    rect(trees_x[i] - 80 , floorPos_y - 240, 180, 30);
    }
}

function drawCanyon(t_canyon)
{
  fill(0);
  rect(t_canyon.pos_x, t_canyon.pos_y, t_canyon.size, 100);
}

function drawCollectable(t_collectable)
{
    fill(102, 102, 255);
    ellipse(t_collectable.pos_x, t_collectable.pos_y, 40, 40);
    fill(204, 204, 255); 
    triangle(t_collectable.pos_x + 20, t_collectable.pos_y, t_collectable.pos_x + 35, t_collectable.pos_y + 20, t_collectable.pos_x + 35, t_collectable.pos_y - 20); 
    triangle(t_collectable.pos_x - 20, t_collectable.pos_y, t_collectable.pos_x - 35, t_collectable.pos_y - 20, t_collectable.pos_x - 35, t_collectable.pos_y + 20);
}

function drawLives(x, con, y)
{
    fill(255, 0 ,0);
	beginShape();
	vertex(x * 10 + con * 20, y + 3);
	bezierVertex(x * 10 + con * 20, y - 7,(x * 10 + con * 20) + 15,y -12,(x * 10 + con * 20) + 15, y - 17);
	bezierVertex((x * 10 + con * 20)+15, y - 22, (x * 10 + con * 20) + 3, y - 27, x * 10 + con * 20, y - 18);
	bezierVertex((x * 10 + con * 20) - 5,y - 27,(x * 10 + con * 20) -  15, y - 22, (x * 10 + con * 20) - 15, y - 17);
	bezierVertex((x * 10 + con * 20) - 15, y -12, x * 10 + con * 20, y - 7,x * 10 + con * 20, y + 3);
	endShape();
}

function checkCanyon(t_canyon)
{
 if(gameChar_world_x > t_canyon.pos_x + 15 && 
    gameChar_world_x < t_canyon.pos_x + t_canyon.size - 15 && 
    gameChar_y >= floorPos_y)
 {
      isPlummeting = true;
 }
 if(isPlummeting)
 {
      gameChar_y += 3;
 }
}

function checkCollectable(t_collectable)
{
 if (dist(gameChar_world_x, gameChar_y, t_collectable.pos_x,           t_collectable.pos_y) <  4 *  t_collectable.size)
 {
      t_collectable.isFound = true;
      game_score += 1;
 }
}

function drawFlagpole()
{
    strokeWeight(10);
    stroke(150);
    line(flagpole.pos_x + 20, floorPos_y, flagpole.pos_x + 20, floorPos_y - 150);
    
    if (flagpole.isReached)
    {
      noStroke();
      fill(255,182,193);
      ellipse(flagpole.pos_x + 30, floorPos_y - 200, 80, 80);
      ellipse(flagpole.pos_x + 50, floorPos_y - 180, 80, 80);
      ellipse(flagpole.pos_x + 20, floorPos_y - 130, 80, 80);
      ellipse(flagpole.pos_x - 30, floorPos_y - 155, 80, 80);
      ellipse(flagpole.pos_x + 60, floorPos_y - 150, 80, 80);
      ellipse(flagpole.pos_x, floorPos_y - 190, 80, 80);
        
      fill(255,228,225);
      ellipse(flagpole.pos_x + 30, floorPos_y - 200, 70, 70);
      ellipse(flagpole.pos_x + 50, floorPos_y - 180, 70, 70);
      ellipse(flagpole.pos_x + 20, floorPos_y - 130, 70, 70);
      ellipse(flagpole.pos_x - 30, floorPos_y - 155, 70, 70);
      ellipse(flagpole.pos_x + 60, floorPos_y - 150, 70, 70);
      ellipse(flagpole.pos_x, floorPos_y - 190, 70, 70);
        
      fill(255,240,245);
      ellipse(flagpole.pos_x + 30, floorPos_y - 200, 50, 50);
      ellipse(flagpole.pos_x + 50, floorPos_y - 180, 50, 50);
      ellipse(flagpole.pos_x + 20, floorPos_y - 130, 50, 50);
      ellipse(flagpole.pos_x - 30, floorPos_y - 155, 50, 50);
      ellipse(flagpole.pos_x + 60, floorPos_y - 150, 50, 50);
      ellipse(flagpole.pos_x, floorPos_y - 190, 50, 50);   
      ellipse(flagpole.pos_x + 10, floorPos_y - 150, 70, 70);
        
      strokeWeight(5);
      stroke(60, 60, 60); 
      fill(255,248,220);        
      ellipse(flagpole.pos_x + 8, floorPos_y - 180, 20, 30);
      ellipse(flagpole.pos_x + 38, floorPos_y - 180, 20, 30);
        
      fill(255,20,147);
      arc(flagpole.pos_x + 20, floorPos_y - 150, 50, 50, 0, radians(180), PIE);        
    }
    else
    {
      noStroke();
      fill(255,182,193);
      ellipse(flagpole.pos_x + 30, floorPos_y - 200, 80, 80);
      ellipse(flagpole.pos_x + 50, floorPos_y - 180, 80, 80);
      ellipse(flagpole.pos_x + 20, floorPos_y - 130, 80, 80);
      ellipse(flagpole.pos_x - 30, floorPos_y - 155, 80, 80);
      ellipse(flagpole.pos_x + 60, floorPos_y - 150, 80, 80);
      ellipse(flagpole.pos_x, floorPos_y - 190, 80, 80);
        
      fill(255,228,225);
      ellipse(flagpole.pos_x + 30, floorPos_y - 200, 70, 70);
      ellipse(flagpole.pos_x + 50, floorPos_y - 180, 70, 70);
      ellipse(flagpole.pos_x + 20, floorPos_y - 130, 70, 70);
      ellipse(flagpole.pos_x - 30, floorPos_y - 155, 70, 70);
      ellipse(flagpole.pos_x + 60, floorPos_y - 150, 70, 70);
      ellipse(flagpole.pos_x, floorPos_y - 190, 70, 70);
        
      fill(255,240,245);
      ellipse(flagpole.pos_x + 30, floorPos_y - 200, 50, 50);
      ellipse(flagpole.pos_x + 50, floorPos_y - 180, 50, 50);
      ellipse(flagpole.pos_x + 20, floorPos_y - 130, 50, 50);
      ellipse(flagpole.pos_x - 30, floorPos_y - 155, 50, 50);
      ellipse(flagpole.pos_x + 60, floorPos_y - 150, 50, 50);
      ellipse(flagpole.pos_x, floorPos_y - 190, 50, 50);   
      ellipse(flagpole.pos_x + 10, floorPos_y - 150, 70, 70); 
        
      strokeWeight(5);
      stroke(60, 60, 60);
      fill(255,20,147);
      beginShape();
      vertex(flagpole.pos_x, floorPos_y - 130);
      bezierVertex(
      flagpole.pos_x, floorPos_y - 190, 
      flagpole.pos_x + 100 , floorPos_y - 110, 
      flagpole.pos_x, floorPos_y - 130);
      endShape();
        
      fill(255,248,220);
      ellipse(flagpole.pos_x + 8, floorPos_y - 180, 20, 30);
      ellipse(flagpole.pos_x + 38, floorPos_y - 180, 20, 30);
    }
}

function checkFlagpole()
{
    var n = abs(gameChar_world_x - flagpole.pos_x);
    
    if(n < 15)
    {
          flagpole.isReached = true; 
    }
}

function checkPlayerDie()
{
    if(isPlummeting)
      {
          gameMusic.stop();
          if(lives > 1)
          {
              if(gameChar_y > height)
              {
                  lives -= 1; 
                  startGame();

              }
          }
          else
          {
              lives = 0;
          }
      }
}

function startGame()
{
    gameMusic.loop();
    gameChar_x = width / 2;
	gameChar_y = floorPos_y;
    scrollPos = 0;
    gameChar_world_x = gameChar_x - scrollPos;
    
    isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    
    trees_x = [-400, 100, 300, 1000, 1500];
    
    clouds =
        [
        {pos_x : -900, pos_y : 87},
        {pos_x : -700, pos_y : 240},
        {pos_x : -400, pos_y : 90},
        {pos_x : -80, pos_y : 130},
        {pos_x : 40, pos_y : 100},
        {pos_x : 300, pos_y : 80},
        {pos_x : 600, pos_y : 200},
        {pos_x : 1000, pos_y : 100},
        {pos_x : 1550, pos_y : 80}
        ];
    
    mountains =
        [
        {pos_x : -900, pos_y : 380},
        {pos_x : -18, pos_y : 370},
        {pos_x : 820, pos_y : 390},
        {pos_x : 1200, pos_y : 370}
        ];
    
    collectables =
        [
        {pos_x : 800, pos_y : floorPos_y, size : 35, isFound : false},
        {pos_x : 700, pos_y : floorPos_y - 20, size : 40, isFound : false},
        {pos_x : 180, pos_y : floorPos_y - 55, size : 45, isFound : false},
        {pos_x : 1200, pos_y : floorPos_y, size : 35, isFound : false},
        {pos_x : 1350, pos_y : floorPos_y - 20, size : 40, isFound : false},
        {pos_x : 1700, pos_y : floorPos_y - 55, size : 45, isFound : false},{pos_x : -30, pos_y : floorPos_y, size : 35, isFound : false},
        {pos_x : -700, pos_y : floorPos_y - 20, size : 40, isFound : false},
        {pos_x : -100, pos_y : floorPos_y - 55, size : 45, isFound : false}
        ];
    
    canyons =
        [
        {pos_x : 525, pos_y : floorPos_y, size : 65},
        {pos_x : 870, pos_y : floorPos_y, size : 70},
        {pos_x : 135, pos_y : floorPos_y, size : 100},
        {pos_x : 1200, pos_y : floorPos_y, size : 110}
        ];
    flagpole = {pos_x : 1800, isReached : false};  

    game_score = 0; 
}
