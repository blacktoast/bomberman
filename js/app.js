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

    }
};

var game = new Phaser.Game(600, 600);
game.state.add('main', mainState);
game.state.start('main');
