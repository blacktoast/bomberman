var mainState = {
    preload: function(){
        game.load.image('wall', 'assets/wall.png');
        game.load.image('brick', 'assets/brick.png');
        game.load.image('bomber', 'assets/bomber.png');
    },

    create: function(){
        this.PIXEL_SIZE = 40;
        this.BLOCK_COUNT = 15;

        game.stage.backgroundColor = "#287800";

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.wallList = game.add.group();
        this.brickList = game.add.group();

        this.createMap();
        this.addPlayer();

        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

        upKey.onDown.add(this.moveUp, this);
        downKey.onDown.add(this.moveDown, this);
        rightKey.onDown.add(this.moveRight, this);
        leftKey.onDown.add(this.moveLeft, this);
    },

    update: function(){

    },

    createMap: function(){
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                if(x % 2 == 1 && y % 2 == 1){
                    this.addWall(x, y);
                } else if(x < 2 && y < 2){
                    // add nothing, space for grass
                } else {
                    if(Math.floor(Math.random() * 3)){
                        this.addBrick(x, y);
                    }
                }
            }
        }
    },

    addPlayer: function(){
        this.player = game.add.sprite(0, 0, 'bomber');
        game.physics.arcade.enable(this.player);

    },

    addWall: function(x, y){
        var wall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'wall');
        game.physics.arcade.enable(wall);
        this.wallList.add(wall);

    },

    addBrick: function(x, y){
        var brick = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'brick');
        game.physics.arcade.enable(brick);
        this.brickList.add(brick);

    },

    moveUp: function(){
        if(this.player.y > 0){
            this.player.y -= this.PIXEL_SIZE;
        }
    },

    moveDown: function(){
        if(this.player.y < (600 - this.PIXEL_SIZE)){
            this.player.y += this.PIXEL_SIZE;
        }
    },

    moveRight: function(){
        if(this.player.x < (600 - this.PIXEL_SIZE)){
            this.player.x += this.PIXEL_SIZE;
        }
    },

    moveLeft: function(){
        if(this.player.x > 0){
            this.player.x -= this.PIXEL_SIZE;
        }
    },
};

var game = new Phaser.Game(600, 600);
game.state.add('main', mainState);
game.state.start('main');
