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
        game.world.enableBody = true;

        this.wallList = game.add.group();
        this.brickList = game.add.group();

        this.createMap();
        this.addPlayer();

        this.cursor = game.input.keyboard.createCursorKeys();

    },

    update: function(){

        if (this.cursor.down.isDown || this.cursor.up.isDown || this.cursor.right.isDown || this.cursor.left.isDown){
            if (this.cursor.left.isDown)
                this.player.body.velocity.x = -150;
            if (this.cursor.right.isDown)
                this.player.body.velocity.x = +150;
            if (this.cursor.up.isDown)
                this.player.body.velocity.y = -150;
            if (this.cursor.down.isDown)
                this.player.body.velocity.y = 150;
        } else{
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
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
                    // add nothing, space for grass
                } else {
                    if(Math.floor(Math.random() * 2)){
                        this.addBrick(x, y);
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
};

var game = new Phaser.Game(600, 600);
game.state.add('main', mainState);
game.state.start('main');
