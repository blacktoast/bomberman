var mainState = {
    preload: function(){

    },

    create: function(){

    },

    update: function(){

    }
};

var game = new Phaser.Game(600, 600);
game.state.add('main', mainState);
game.state.start('main');
