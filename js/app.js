/**
 * Project Name:    Bomberman
 * Project URL:     https://kevinpagtakhan.github.io/bomberman/
 * Description:     This is a game inspired by the original Bomberman developed using JavaScript and Phaser.
 * Version:         1.0.0
 * Author:          Kevin Pagtakhan
 * Author URI:      https://github.com/kevinpagtakhan
 **/
//html에 class의 score가 포함되어있는
var scoreBoard = document.querySelectorAll(".score");

var mainState = {
    preload: function(){
        // Map sprites
        game.load.image('ground', 'assets/ground.png');
        game.load.image('grass', 'assets/grass.png');
        game.load.image('wall', 'assets/wall.png');
        game.load.image('brick', 'assets/brick.png');
        game.load.image('blue-flag', 'assets/blue-flag.png');
        game.load.image('red-flag', 'assets/red-flag.png');

        // Weapon sprites
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('explosion', 'assets/explosion.png');

        // Player sprites
        game.load.image('bomber', 'assets/bomber.png');
        game.load.image('bomber-front', 'assets/bomber-front.png');
        game.load.image('bomber-left', 'assets/bomber-left.png');
        game.load.image('bomber-right', 'assets/bomber-right.png');
        game.load.image('bomber-back', 'assets/bomber-back.png');

        // Button sprites
        game.load.image('next-round', 'assets/next-round.png');
        game.load.image('start-game', 'assets/start-game.png');
        game.load.image('play-again', 'assets/play-again.png');
        // Power up sprites
        game.load.image('boots', 'assets/boots.png');
        game.load.image('star', 'assets/star.png');
        // Audio clip sprites
        game.load.audio('bomb-sound', 'assets/bomb-sound.wav');
        game.load.audio('power-up', 'assets/power-up.wav');
        game.load.audio('winner', 'assets/winner.wav');
        game.load.audio('intro', 'assets/intro.wav');
        game.load.audio('game-start', 'assets/game-start.wav');
        game.load.audio('round-end', 'assets/round-end.wav');

        game.load.audio('bg-music', 'assets/48-battle.mp3');
    },

    create: function(){
        this.BLOCK_COUNT = 15;

        //600/15 블럭하나의 크기를 계산.
        this.PIXEL_SIZE = GAME_SIZE / this.BLOCK_COUNT;

        music = game.add.audio('bg-music', 1, true);
        music.play();

        game.stage.backgroundColor = "#49311C";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;

        // Adds ground to entire map
        for (var x = 0; x < this.BLOCK_COUNT; x++) {
            for (var y = 0; y < this.BLOCK_COUNT; y++) {
                this.addGround(x, y);
            }
        }

        // Group container of game sprites
        this.grassList = game.add.group();
        this.wallList = game.add.group();
        this.bootList = game.add.group();
        this.starList = game.add.group();
        this.brickList = game.add.group();
        this.bombList = game.add.group();
        this.bombList_2 = game.add.group();
        this.flagList = game.add.group();
        this.addPlayers();
        this.explosionList = game.add.group();
        this.explosionList_2 = game.add.group();


        // 벽과 블럭 그리고 아이템을 설정한다.
        this.createMap();

        // Players 1's 초기설정
        this.playerSpeed = 150;
        this.playerPower = false;
        this.playerDrop = true;
        // Players 2's 초기설정
        this.playerSpeed_2 = 150;
        this.playerPower_2 = false;
        this.playerDrop_2 = true;

        // Creates listeners for player 1's controls
        this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // 풀래이어2의 컨트트롤할것을 구성
        //input.keyboard.createCursorKeys 은 방향키4개가 포함된 객체를 반환하는 메서드이다.
        this.cursor = game.input.keyboard.createCursorKeys();
        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Creates game feedback message
        this.gameMessage = "";
        this.messageStyle = { font: "60px Arcade", fill: "#FFFFFF", boundsAlignV: "middle", boundsAlignH: "center", align: "center", wordWrapWidth: 600};
        this.infoStyle = { font: "30px Arcade", fill: "#FFFFFF", boundsAlignV: "middle", boundsAlignH: "center", align: "center", wordWrapWidth: 600};

        // 게임의 사운드를 구성한다.
        bombSound = game.add.audio('bomb-sound');
        powerUp = game.add.audio('power-up');
        winner = game.add.audio('winner');
        intro = game.add.audio('intro');
        gameStart = game.add.audio('game-start');
        roundEnd = game.add.audio('round-end');

        // 게임 시작화면을 출력한다, gaminplay변수는 현재 게임이 진행중인지 아닌지를 판가름하는 변수인듯하다.
        if(!gameInPlay){
            this.showRoundWinner(null);
        }
    },

    update: function(){

        if (this.cursor.down.isDown || this.cursor.up.isDown || this.cursor.right.isDown || this.cursor.left.isDown){
            if (this.cursor.left.isDown){
                this.player.body.velocity.x = -(this.playerSpeed);
                this.player.loadTexture('bomber-left', 0);
            }
            if (this.cursor.right.isDown){
                this.player.body.velocity.x = (this.playerSpeed);
                this.player.loadTexture('bomber-right', 0);
            }
            if (this.cursor.up.isDown){
                this.player.body.velocity.y = -(this.playerSpeed);
                this.player.loadTexture('bomber-back', 0);
            }
            if (this.cursor.down.isDown){
                this.player.body.velocity.y = (this.playerSpeed);
                this.player.loadTexture('bomber-front', 0);
            }
        } else{
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
        }

        if (this.enterKey.justUp){
            if(gameInPlay)
                this.dropBomb(1);
        }

        if (this.aKey.isDown || this.sKey.isDown || this.dKey.isDown || this.wKey.isDown){
            if (this.aKey.isDown){
                this.player_2.body.velocity.x = -(this.playerSpeed_2);
                this.player_2.loadTexture('bomber-left', 0);
                // this.player_2.body.velocity.y = 0;
            }
            if (this.dKey.isDown){
                this.player_2.body.velocity.x = (this.playerSpeed_2);
                this.player_2.loadTexture('bomber-right', 0);
                // this.player_2.body.velocity.y = 0;
            }
            if (this.wKey.isDown){
                this.player_2.body.velocity.y = -(this.playerSpeed_2);
                this.player_2.loadTexture('bomber-back', 0);
                // this.player_2.body.velocity.x = 0;
            }
            if (this.sKey.isDown){
                this.player_2.body.velocity.y = (this.playerSpeed_2);
                this.player_2.loadTexture('bomber-front', 0);
                // this.player_2.body.velocity.x = 0;
            }
        } else{
            this.player_2.body.velocity.x = 0;
            this.player_2.body.velocity.y = 0;
        }

        if (this.spaceKey.justUp){
            if(gameInPlay)
                this.dropBomb(2);
        }

        game.physics.arcade.collide(this.player, this.brickList);
        game.physics.arcade.collide(this.player, this.wallList);
        game.physics.arcade.collide(this.player_2, this.wallList);
        game.physics.arcade.collide(this.player_2, this.brickList);


        game.physics.arcade.overlap(this.player, this.explosionList, function(){this.burn(1);}, null, this);
        game.physics.arcade.overlap(this.player, this.explosionList_2, function(){this.burn(1);}, null, this);

        game.physics.arcade.overlap(this.player_2, this.explosionList_2, function(){this.burn(2);}, null, this);
        game.physics.arcade.overlap(this.player_2, this.explosionList, function(){this.burn(2);}, null, this);

        game.physics.arcade.overlap(this.explosionList, this.flagList.children[0], function(){this.getFlag(2);}, null, this);
        game.physics.arcade.overlap(this.explosionList_2, this.flagList.children[1], function(){this.getFlag(1);}, null, this);

        game.physics.arcade.overlap(this.player, this.bootList, function(a,item){this.speedUp(1,item);}, null, this);
        game.physics.arcade.overlap(this.player_2, this.bootList, function(a,item){this.speedUp(2,item);}, null, this);

        game.physics.arcade.overlap(this.player, this.starList, function(a,item){this.starUp(1,item);}, null, this);
        game.physics.arcade.overlap(this.player_2, this.starList, function(a,item){this.starUp(2,item);}, null, this);
    },

    createMap: function(){
        for (var x = 0; x < this.BLOCK_COUNT; x++) {
            for (var y = 0; y < this.BLOCK_COUNT; y++) {
                if( x == 1 && x == y){
                    this.addBlueFlag();
                    this.addRedFlag();
                }//전체를 둘러싸는 벽
                if (x === 0 || y === 0 || x == 14 || y == 14){
                    this.addWall(x, y);
                }//중간 2칸마다의벽
                else if(x % 2 === 0 && y % 2 === 0){
                    this.addWall(x, y);
                } else if(x < 4 && y < 4 || x > 10 && y > 10){  //플레이어 자리주변의 잔디깔기
                    this.addGrass(x, y);
                } else {//랜덤적으로 벽돌을깔고,
                    if(Math.floor(Math.random() * 3)){
                        this.addBrick(x, y);
                        if(Math.floor(Math.random() * 3)){
                            this.addBoots(x, y);
                        }
                        if(Math.floor(Math.random() * 3)){
                            this.addStar(x, y);
                        }
                    } else {
                        this.addGrass(x, y);
                    }
                }
            }
        }
    },

    burn: function(player){
        if(player == 1){
            this.player.kill();
        } else {
            this.player_2.kill();
        }
        //게임 스코어를 올리는 코드
        if(gameInPlay){
            var score = Number(scoreBoard[player - 1].innerText);
            scoreBoard[player - 1].innerText = score + 1;

            if(score + 1 === 5){
                this.showGameWinner(player);
                winner.play();
            } else {
                this.showRoundWinner(player);
                roundEnd.play();
            }
        }

        gameInPlay = false;
    },

    getFlag: function(player){
        //위에 코드를 그대로 긁어와서 오류가 발생한듯하다
        if(gameInPlay){
            var score = Number(scoreBoard[player - 1].innerText);
            scoreBoard[player - 1].innerText = score + 1;

            if(score + 1 === 5){
                this.showGameWinner(player);
            } else {
                this.showRoundWinner(player);
            }
        }

        gameInPlay = false;
    },

    speedUp: function(player,item){
        powerUp.play();

        if(player == 1){
            this.playerSpeed = 350;
        } else {
            this.playerSpeed_2 = 350;
        }
        //아이템을 먹었으면 사라지게한다
        //foreach문은 무슨역할을 하는걸까? 입력값으로 함수를 받는것같은데.
        //자바스트립트에서 foreach는 배열에 있는 각요소에 대해 오름차순 순서로 콜백함수를 호출한다
        //그렇다면 결국 하나를 먹게되면 아이템이 다
      item.kill();
    },

    addBoots: function(x, y){
        var boots = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'boots');
        game.physics.arcade.enable(boots);
        boots.body.immovable = true;
        this.bootList.add(boots);
    },

    starUp: function(player,item){
        powerUp.play();

        if(player == 1){
            this.playerPower = true;
        } else {
            this.playerPower_2 = true;
        }

        item.kill();
    },

    addStar: function(x, y){
        var star = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'star');
        game.physics.arcade.enable(star);
        star.body.immovable = true;
        this.starList.add(star);
    },

    addPlayers: function(){

        this.player = game.add.sprite(GAME_SIZE - 2 * this.PIXEL_SIZE, GAME_SIZE - 2 * this.PIXEL_SIZE, 'bomber');
        game.physics.arcade.enable(this.player);

        this.player_2 = game.add.sprite(this.PIXEL_SIZE, this.PIXEL_SIZE, 'bomber');
        game.physics.arcade.enable(this.player_2);
        this.player_2.scale.setTo(0.9,0.9);
        this.player.scale.setTo(0.9,0.9);


    },

    addBlueFlag: function(){
        var blueFlag = game.add.sprite(1 * this.PIXEL_SIZE, 1 * this.PIXEL_SIZE, 'blue-flag');
        game.physics.arcade.enable(blueFlag);
        blueFlag.body.immovable = true;
        this.flagList.add(blueFlag);

    },

    addRedFlag: function(){
        var redFlag = game.add.sprite((this.BLOCK_COUNT - 2) * this.PIXEL_SIZE, (this.BLOCK_COUNT - 2) * this.PIXEL_SIZE, 'red-flag');
        game.physics.arcade.enable(redFlag);
        redFlag.body.immovable = true;
        this.flagList.add(redFlag);

    },

    addWall: function(x, y){
        var wall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'wall');
        game.physics.arcade.enable(wall);
        wall.body.immovable = true;
        this.wallList.add(wall);

    },

    addBrick: function(x, y){
        var brick = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'brick');
        game.physics.arcade.enable(brick);
        brick.body.immovable = true;
        this.brickList.add(brick);

    },

    addGrass: function(x, y){
        var grass = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'grass');
        game.physics.arcade.enable(grass);
        grass.body.immovable = true;
        this.grassList.add(grass);

    },

    detonateBomb: function(player, x, y, explosionList, wallList, brickList){
        bombSound.play();

        var fire = [
            game.add.sprite(x, y, 'explosion'),
            game.add.sprite(x, y + 40, 'explosion'),
            game.add.sprite(x, y - 40, 'explosion'),
            game.add.sprite(x + 40, y, 'explosion'),
            game.add.sprite(x - 40, y, 'explosion')
        ];
        if(player == 1 && mainState.playerPower){
            fire.push(game.add.sprite(x, y + 80, 'explosion'));
            fire.push(game.add.sprite(x, y - 80, 'explosion'));
            fire.push(game.add.sprite(x + 80, y, 'explosion'));
            fire.push(game.add.sprite(x - 80, y, 'explosion'));
        } else if (player == 2 && mainState.playerPower_2) {
            fire.push(game.add.sprite(x, y + 80, 'explosion'));
            fire.push(game.add.sprite(x, y - 80, 'explosion'));
            fire.push(game.add.sprite(x + 80, y, 'explosion'));
            fire.push(game.add.sprite(x - 80, y, 'explosion'));

        }

        for (var i = 0; i < fire.length; i++) {
            fire[i].body.immovable = true;
            explosionList.add(fire[i]);
        }

        for (i = 0; i < fire.length; i++) {
            if(game.physics.arcade.overlap(fire[i], wallList)){
                fire[i].kill();
                if(i > 0 && fire[i + 4] !== undefined){
                    this.brick_over=true;
                    fire[i+4].kill();
                }
            }
        }

        setTimeout(function(){
            explosionList.forEach(function(element){
                element.kill();
            });
            //fire와 벽돌의 좌표값이 같은 spirte들을 모아 배열을 만들고,427라인을 통해서 제거한다.
            var temp = brickList.filter(function(element){
              if(mainState.playerPower && this.brick_over)
              {
                for (var i = 0; i < fire.length-4; i++) {
                    if(element.x == fire[i].x && element.y == fire[i].y){
                        return true;
                    }
                }
                return false;

              }
              else if(mainState.playerPower_2 && this.brick_over)
              {
                for (var i = 0; i < fire.length-4; i++) {
                    if(element.x == fire[i].x && element.y == fire[i].y){
                        return true;
                    }
                }
                return false;

              }
              else {
                for (var i = 0; i < fire.length; i++) {
                    if(element.x == fire[i].x && element.y == fire[i].y){
                        return true;
                    }
                }
                return false;

              }

            });
            this.brick_over=false;

            temp.list.forEach(function(element){
                element.kill();
            });
        }, 1000);

    },
    //폭탄을 떨어트리는 함수
    dropBomb: function(player){
        var gridX;
        var gridY;
        var bomb;
        var detonateBomb;
        var explosionList;
        var wallList;
        var brickList;

        if(player == 1  && this.playerDrop){
            this.playerDrop = false;
            //현재 플레이어의 좌표값을 구해서 그밑에다 둔다.
            gridX = this.player.x - this.player.x % 40;
            gridY = this.player.y - this.player.y % 40;

            bomb = game.add.sprite(gridX, gridY, 'bomb');
            game.physics.arcade.enable(bomb);

            this.bombList.add(bomb);

            detonateBomb = this.detonateBomb;
            explosionList = this.explosionList;
            wallList = this.wallList;
            brickList = this.brickList;

            setTimeout(function(){
                bomb.kill();
                detonateBomb(player, bomb.x, bomb.y, explosionList, wallList, brickList);
                mainState.enablePlayerBomb(1);
            }, 2000);

            setTimeout(this.thisEnableBomb, 2000);

        } else if (player == 2  && this.playerDrop_2){
            this.playerDrop_2 = false;
            gridX = this.player_2.x - this.player_2.x % 40;
            gridY = this.player_2.y - this.player_2.y % 40;

            bomb = game.add.sprite(gridX, gridY, 'bomb');
            game.physics.arcade.enable(bomb);
            bomb.body.immovable = true;
            this.bombList_2.add(bomb);

            detonateBomb = this.detonateBomb;
            explosionList_2 = this.explosionList_2;
            wallList = this.wallList;
            brickList = this.brickList;

            setTimeout(function(){
                bomb.kill();
                detonateBomb(player, bomb.x, bomb.y, explosionList_2, wallList, brickList);
                mainState.enablePlayerBomb(2);
            }, 2000);

        }

    },

    enablePlayerBomb: function(player){
        if(player == 1){
            this.playerDrop = true;
        } else {
            this.playerDrop_2 = true;
        }

    },

    addGround: function(x, y){
        var wall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'ground');
        wall.body.immovable = true;

    },

    showRoundWinner: function(player){

        if(player !== null){
            this.gameMessage = game.add.text(0, 0, "PLAYER " + player + " WINS", this.messageStyle);
            this.gameMessage.setTextBounds(0, 0, 600, 560);
            this.button = game.add.button(230, 300, 'next-round');
        } else{
            intro.play();
            this.background = game.add.tileSprite(40, 40, 520, 520, 'grass');
            var introString = "LET'S PLAY BOMBERMAN" + "\n";
                introString += "You are in a mission to take control" + "\n";
                introString += "of you opponents base. Drop bombs" + "\n";
                introString += "to destroy the walls and navigate" + "\n";
                introString += "through the field." + "\n";

            this.gameMessage = game.add.text(0, 0, introString, this.infoStyle);
            this.gameMessage.setTextBounds(0, 0, 600, 560);
            this.button = game.add.button(230, 350, 'start-game');
        }

        this.button.onInputUp.add(this.restartGame, this);
    },

    showGameWinner: function(player){

        this.gameMessage = game.add.text(0, 0, "GAME OVER!\nPLAYER " + player + " WINS", this.messageStyle);
        this.gameMessage.setTextBounds(0, 0, 600, 560);
        this.button = game.add.button(230, 350, 'play-again');

        this.button.onInputUp.add(function(){
            scoreBoard[0].innerText = 0;
            scoreBoard[1].innerText = 0;
            this.restartGame();
        }, this);
    },

    restartGame: function(){
        gameInPlay = true;
        music.stop();
        gameStart.play();
        game.state.start('main');
    }

};

var GAME_SIZE = 600;
var gameInPlay = false;
var game = new Phaser.Game(GAME_SIZE, GAME_SIZE);
game.state.add('main', mainState);
game.state.start('main');
