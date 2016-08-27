var mainState = {
    preload: function(){
        game.load.image('wall', 'assets/wall.png');
    },

    create: function(){
        this.PIXEL_SIZE = 40;
        this.BLOCK_COUNT = 15;

        game.stage.backgroundColor = "#287800";

        this.wallList = game.add.group();

        this.createMap();
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
                        // add brick
                    }
                }
            }
        }
    },

    addWall: function(x, y){
        var wall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'wall');
        this.wallList.add(wall);
    },
};

var game = new Phaser.Game(600, 600);
game.state.add('main', mainState);
game.state.start('main');
