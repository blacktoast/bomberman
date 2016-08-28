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
        this.explosionList = game.add.group();

        this.createMap();
        this.addPlayer();

        this.cursor = game.input.keyboard.createCursorKeys();
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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

        if (this.spaceKey.justUp){
            this.dropBomb(this.player.x, this.player.y);
        }

        game.physics.arcade.collide(this.player, this.wallList);
        game.physics.arcade.collide(this.player, this.brickList);
        game.physics.arcade.overlap(this.player, this.explosionList, function(){game.state.start('main');}, null, this);
    },

    createMap: function(){
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                if (x === 0 || y === 0 || x == 14 || y == 14){
                    this.addWall(x, y);
                }
                else if(x % 2 === 0 && y % 2 === 0){
                    this.addWall(x, y);
                } else if(x < 4 && y < 4){
                    this.addGrass(x, y);
                } else {
                    if(Math.floor(Math.random() * 3)){
                        this.addBrick(x, y);
                    } else {
                        this.addGrass(x, y);
                    }
                }
            }
        }
    },

    addPlayer: function(){
        this.player = game.add.sprite(this.PIXEL_SIZE, this.PIXEL_SIZE, 'bomber');
        game.physics.arcade.enable(this.player);

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

    dropBomb: function(x, y){
        var gridX = x - x % 40;
        var gridY = y - y % 40;

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
            detonateBomb(bomb.x, bomb.y, explosionList, wallList,brickList);
        }, 2000);
    },

    addGround: function(x, y){
        var wall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'ground');
        wall.body.immovable = true;

    },

};

var GAME_SIZE = 600;

var game = new Phaser.Game(GAME_SIZE, GAME_SIZE);
game.state.add('main', mainState);
game.state.start('main');
