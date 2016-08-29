var scoreBoard = document.querySelectorAll(".score");

var mainState = {
    preload: function(){
        game.load.image('ground', 'assets/ground.png');
        game.load.image('grass', 'assets/grass.png');
        game.load.image('wall', 'assets/wall.png');
        game.load.image('brick', 'assets/brick.png');
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('bomber', 'assets/bomber.png');
        game.load.image('explosion', 'assets/explosion.png');
        game.load.image('bomber-front', 'assets/bomber-front.png');
        game.load.image('bomber-left', 'assets/bomber-left.png');
        game.load.image('bomber-right', 'assets/bomber-right.png');
        game.load.image('bomber-back', 'assets/bomber-back.png');
        game.load.image('next-round', 'assets/next-round.png');
        game.load.image('start-game', 'assets/start-game.png');
        game.load.image('play-again', 'assets/play-again.png');
        game.load.image('blue-flag', 'assets/blue-flag.png');
        game.load.image('red-flag', 'assets/red-flag.png');
    },

    create: function(){
        this.BLOCK_COUNT = 15;
        this.PIXEL_SIZE = GAME_SIZE / this.BLOCK_COUNT;

        game.stage.backgroundColor = "#49311C";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;

        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                this.addGround(x, y);
            }
        }
        this.wallList = game.add.group();
        this.brickList = game.add.group();
        this.grassList = game.add.group();
        this.bombList = game.add.group();
        this.bombList_2 = game.add.group();
        this.flagList = game.add.group();
        this.addPlayers();
        this.explosionList = game.add.group();
        this.explosionList_2 = game.add.group();

        this.createMap();
        // this.addPlayers();

        this.cursor = game.input.keyboard.createCursorKeys();
        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

        this.gameMessage;
        this.messageStyle = { font: "60px Arcade", fill: "#FFFFFF", boundsAlignV: "middle", boundsAlignH: "center", align: "center", wordWrapWidth: 600};

        this.background;
        this.button;

        if(!gameInPlay){
            this.showRoundWinner(null);
        }
    },

    update: function(){

        if (this.cursor.down.isDown || this.cursor.up.isDown || this.cursor.right.isDown || this.cursor.left.isDown){
            if (this.cursor.left.isDown){
                this.player.body.velocity.x = -150;
                this.player.loadTexture('bomber-left', 0);
            }
            if (this.cursor.right.isDown){
                this.player.body.velocity.x = +150;
                this.player.loadTexture('bomber-right', 0);
            }
            if (this.cursor.up.isDown){
                this.player.body.velocity.y = -150;
                this.player.loadTexture('bomber-back', 0);
            }
            if (this.cursor.down.isDown){
                this.player.body.velocity.y = 150;
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
                this.player_2.body.velocity.x = -150;
                this.player_2.loadTexture('bomber-left', 0);
                // this.player_2.body.velocity.y = 0;
            }
            if (this.dKey.isDown){
                this.player_2.body.velocity.x = +150;
                this.player_2.loadTexture('bomber-right', 0);
                // this.player_2.body.velocity.y = 0;
            }
            if (this.wKey.isDown){
                this.player_2.body.velocity.y = -150;
                this.player_2.loadTexture('bomber-back', 0);
                // this.player_2.body.velocity.x = 0;
            }
            if (this.sKey.isDown){
                this.player_2.body.velocity.y = 150;
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



        game.physics.arcade.collide(this.player, this.wallList);
        game.physics.arcade.collide(this.player, this.brickList);

        game.physics.arcade.collide(this.player_2, this.wallList);
        game.physics.arcade.collide(this.player_2, this.brickList);

        game.physics.arcade.overlap(this.player, this.explosionList, function(){this.burn(1);}, null, this);
        game.physics.arcade.overlap(this.player, this.explosionList_2, function(){this.burn(1);}, null, this);

        game.physics.arcade.overlap(this.player_2, this.explosionList_2, function(){this.burn(2);}, null, this);
        game.physics.arcade.overlap(this.player_2, this.explosionList, function(){this.burn(2);}, null, this);

        game.physics.arcade.overlap(this.player, this.flagList.children[0], function(){this.getFlag(1)}, null, this);
        game.physics.arcade.overlap(this.player_2, this.flagList.children[1], function(){this.getFlag(2)}, null, this);
    },

    createMap: function(){
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                if( x == 1 && x == y){
                    this.addBlueFlag();
                    this.addRedFlag();
                }
                if (x === 0 || y === 0 || x == 14 || y == 14){
                    this.addWall(x, y);
                }
                else if(x % 2 === 0 && y % 2 === 0){
                    this.addWall(x, y);
                } else if(x < 4 && y < 4 || x > 10 && y > 10){
                    this.addGrass(x, y);
                } else {
                    if(Math.floor(Math.random() * 0)){
                        this.addBrick(x, y);
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

    getFlag: function(player){
        // if(player == 1){
        //     this.player.kill();
        // } else {
        //     this.player_2.kill();
        // }

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

    addPlayers: function(){

        this.player = game.add.sprite(GAME_SIZE - 2 * this.PIXEL_SIZE, GAME_SIZE - 2 * this.PIXEL_SIZE, 'bomber');
        game.physics.arcade.enable(this.player);

        this.player_2 = game.add.sprite(this.PIXEL_SIZE, this.PIXEL_SIZE, 'bomber');
        game.physics.arcade.enable(this.player_2);

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

    detonateBomb: function(x, y, explosionList, wallList, brickList){
        var fire1 = game.add.sprite(x, y, 'explosion');
        fire1.body.immovable = true;
        explosionList.add(fire1);

        var fire2 = game.add.sprite(x, y + 40, 'explosion');
        fire2.body.immovable = true;
        explosionList.add(fire2);
        if(game.physics.arcade.overlap(fire2, wallList)){
            fire2.kill();
        }

        var fire3 = game.add.sprite(x, y - 40, 'explosion');
        fire3.body.immovable = true;
        explosionList.add(fire3);
        if(game.physics.arcade.overlap(fire3, wallList)){
            fire3.kill();
        }

        var fire4 = game.add.sprite(x + 40, y, 'explosion');
        fire4.body.immovable = true;
        explosionList.add(fire4);
        if(game.physics.arcade.overlap(fire4, wallList)){
            fire4.kill();
        }

        var fire5 = game.add.sprite(x - 40, y, 'explosion');
        fire5.body.immovable = true;
        explosionList.add(fire5);
        if(game.physics.arcade.overlap(fire5, wallList)){
            fire5.kill();
        }

        setTimeout(function(){
            explosionList.forEach(function(element){
                element.kill();
            });
            var temp = brickList.filter(function(element){
                if(element.x == fire1.x && element.y == fire1.y ||
                    element.x == fire2.x && element.y == fire2.y ||
                    element.x == fire3.x && element.y == fire3.y ||
                    element.x == fire4.x && element.y == fire4.y ||
                    element.x == fire5.x && element.y == fire5.y){
                    return true;
                } else{
                    return false;
                }
            });

            temp.list.forEach(function(element){
                element.kill();
            });
        }, 1000);
    },

    dropBomb: function(player){
        if(player == 1){
            var gridX = this.player.x - this.player.x % 40;
            var gridY = this.player.y - this.player.y % 40;

            var bomb = game.add.sprite(gridX, gridY, 'bomb');
            game.physics.arcade.enable(bomb);
            bomb.body.immovable = true;
            this.bombList.add(bomb);

            var detonateBomb = this.detonateBomb;
            var explosionList = this.explosionList;
            var wallList = this.wallList;
            var brickList = this.brickList;

            setTimeout(function(){
                bomb.kill();
                detonateBomb(bomb.x, bomb.y, explosionList, wallList, brickList);
            }, 2000);

        } else if (player == 2){
            var gridX = this.player_2.x - this.player_2.x % 40;
            var gridY = this.player_2.y - this.player_2.y % 40;

            var bomb = game.add.sprite(gridX, gridY, 'bomb');
            game.physics.arcade.enable(bomb);
            bomb.body.immovable = true;
            this.bombList_2.add(bomb);

            var detonateBomb = this.detonateBomb;
            var explosionList_2 = this.explosionList_2;
            var wallList = this.wallList;
            var brickList = this.brickList;

            setTimeout(function(){
                bomb.kill();
                detonateBomb(bomb.x, bomb.y, explosionList_2, wallList, brickList);
            }, 2000);

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
            this.background = game.add.tileSprite(40, 40, 520, 520, 'grass');
            this.gameMessage = game.add.text(0, 0, "LET'S PLAY", this.messageStyle);
            this.gameMessage.setTextBounds(0, 0, 600, 560);
            this.button = game.add.button(230, 300, 'start-game');
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
        game.state.start('main');
    }

};

var GAME_SIZE = 600;
var gameInPlay = false;
var game = new Phaser.Game(GAME_SIZE, GAME_SIZE);
game.state.add('main', mainState);
game.state.start('main');
