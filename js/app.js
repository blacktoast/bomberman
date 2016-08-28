var mainState = {
    preload: function(){
        game.load.image('wall', 'assets/wall.png');
        game.load.image('brick', 'assets/brick.png');
        game.load.image('bomber', 'assets/bomber.png');
        game.load.image('grass', 'assets/grass.png');
        game.load.image('bomb', 'assets/bomb.png');
    },

    create: function(){
        this.BLOCK_COUNT = 15;
        this.PIXEL_SIZE = GAME_SIZE / this.BLOCK_COUNT;

        game.stage.backgroundColor = "#287800";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;

        this.wallList = game.add.group();
        this.brickList = game.add.group();
        this.grassList = game.add.group();
        this.bombList = game.add.group();

        this.createMap();
        this.addPlayer();

        this.cursor = game.input.keyboard.createCursorKeys();
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    update: function(){

        if (this.cursor.down.isDown || this.cursor.up.isDown || this.cursor.right.isDown || this.cursor.left.isDown){
            if (this.cursor.left.isDown){
                this.player.body.velocity.x = -150;
            }
            if (this.cursor.right.isDown){
                this.player.body.velocity.x = +150;
            }
            if (this.cursor.up.isDown){
                this.player.body.velocity.y = -150;
            }
            if (this.cursor.down.isDown){
                this.player.body.velocity.y = 150;
            }
        } else{
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
        }

        if (this.spaceKey.justUp){
            this.dropBomb(this.player.x, this.player.y)
    		console.log("hello");
        }

        game.physics.arcade.collide(this.player, this.wallList);
        game.physics.arcade.collide(this.player, this.brickList);
    },

    createMap: function(){
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                if (x === 0 || y === 0 || x == 14 || y == 14){
                    this.addWall(x, y);
                }
                else if(x % 2 === 0 && y % 2 === 0){
                    this.addWall(x, y);
                } else if(x < 3 && y < 3){
                    this.addGrass(x, y);
                } else {
                    if(Math.floor(Math.random() * 2)){
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

    dropBomb: function(x, y){
        var gridX = x - x % 40;
        var gridY = y - y % 40;
        console.log(x, y);
        var bomb = game.add.sprite(gridX, gridY, 'bomb');
        game.physics.arcade.enable(bomb);
        bomb.body.immovable = true;
        this.bombList.add(bomb);
    },
};

var GAME_SIZE = 600;

var game = new Phaser.Game(GAME_SIZE, GAME_SIZE);
game.state.add('main', mainState);
game.state.start('main');
