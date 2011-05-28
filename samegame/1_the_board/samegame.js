window.onload = (function() {
    var WIDTH = 800,
        HEIGHT = 640,
        BOX_WIDTH = 32,
        BOX_HEIGHT = 32,
        BOARD_TOP = 100,
        BOARD_LEFT = 160,
        BOARD_ROWS = 10,
        BOARD_COLS = 16;
    Crafty.init(WIDTH, HEIGHT);
    Crafty.canvas();

    Crafty.sprite(32, "../../img/crate.png", { crate: [0, 0]});

    Crafty.c("Box", {
        init: function() {
            this.addComponent("2D, Canvas, Color, Mouse, crate");
            
            this.w = BOX_WIDTH;
            this.h = BOX_HEIGHT;

            this.bind("click", function(obj) {
                if (this._onClickCallback) this._onClickCallback({
                    x: obj.realX, 
                    y: obj.realY, 
                    color: this._color
                });
            });
        },
        makeBox: function(x, y, color, onClickCallback) {
            this.attr({x: x, y: y}).color(color);
            this._onClickCallback = onClickCallback;
            return this;
        }
    });

    Crafty.c("Board", {
        COLORS: ["#F00", "#0F0", "#FF0", "#F0F", "#0FF"],
        init: function() {
            this.addComponent("2D, Canvas, Color");
            this.x = BOARD_LEFT;
            this.y = BOARD_TOP;
            this.w = BOX_WIDTH * BOARD_COLS;
            this.h = BOX_HEIGHT * BOARD_ROWS;
            this.color("#888");
            this._setupBoard(BOARD_LEFT, BOARD_TOP, BOARD_ROWS, BOARD_COLS, BOX_WIDTH, BOX_HEIGHT);

            this.bind("enterframe", function(e) {
                if (this._board._dirty === true) {
                    this._board._dirty = false;
                }
            });
        },
        _setupBoard: function(x, y, rows, cols, bw, bh) {
            this._board = [];
            for (var c = 0; c < cols; c++) {
                this._board[c] = [];
                for (var r = 0; r < rows; r++) {
                    var that = this;
                    var newBox = Crafty.e("Box").makeBox(x + c * BOX_HEIGHT
                                        , y + (BOX_HEIGHT * BOARD_ROWS - (r + 1) * BOX_WIDTH)
                                        , this.COLORS[Crafty.randRange(0, 4)]
                                        , function () {
                                            // bind to 'this' context
                                            that._clickHandler.apply(that, arguments);
                                        });
                    this._board[c][r] = newBox;
                }
            }
        },
        _clickHandler: function(obj) {
            var aPos = this._translateToArrayPos(obj.x, obj.y);
            console.log(aPos);
        },
        _translateToArrayPos: function(x, y) {
            return {
                x: Math.floor((x - BOARD_LEFT) / BOX_WIDTH),
                y: (BOARD_ROWS - 1) - Math.floor((y - BOARD_TOP) / BOX_HEIGHT)
            };
        }
    });
    
    Crafty.e("Board");
});

