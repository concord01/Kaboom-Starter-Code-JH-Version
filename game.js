// Initialize the Kaboom context.
kaboom({
    width: 800,
    height: 600,
    background: [0, 100, 200],
});

// Set the global gravity value for all physics objects.
setGravity(800);

// --- Load Assets ---
// For Day 1, we only need the player's sprite.
loadSprite("apple", "https://kaboomjs.com/sprites/apple.png");
// New thing: Enemy sprite
loadSprite("enemy", "https://kaboomjs.com/sprites/gigagantrum.png");


// --- Main Game Scene ---
scene("main", () => {

    // --- The Level Design ---
    const levelLayout = [
        "                    ",
        "                    ",
        "    =         =     ",
        "                    ",
        "  =       =      =  ",
        "                    ",
        "====================",
    ];

    // Configure what each symbol in the level layout means.
    const levelConf = {
        tileWidth: 47,
        tileHeight: 47,
        tiles: {
            " ": () => [],
            "=": () => [
                rect(47, 47),
                color(0, 200, 0),
                area(),
                body({ isStatic: true }),
            ],
        }
    };

    addLevel(levelLayout, levelConf);

    // --- The Player Character ---
    const player = add([
        sprite("apple"),
        pos(100, 100),
        area({ scale: 0.7 }),
        body(),
        "player",
    ]);

    // The enemy patrol
    function patrol(){
        return{
            id:"patrol",
            require: ["pos","area"],
            dir: -1,
            update(){
                this.move(60*this.dir,0)
            },
            // Next event will flip direction if enemy collides with something
            add(){
                this.onCollide((obj, col) => {
                    if (col.isLeft() || col.isRight()){
                        this.dir = -this.dir;
                    }
                });
            }
        }
    }

    // Add enemy to scene
    const enemy = add([
        sprite("enemy"),
        pos(600,200), // enemy starting pos
        area(),
        body(),
        patrol(), // calling patrol function
        "enemy"
    ])

    // --- Player Controls & Interactions ---
    onKeyDown("left", () => {
        player.move(-200, 0);
    });

    onKeyDown("right", () => {
        player.move(200, 0);
    });

    onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump(650);
        }
    });
    // Collision detection
    player.onCollide("enemy",(enemy,col) =>{
        if(col.isBottom){
            destroy(enemy);
            player.jump(300);
        }
        else{
            destroy(player);
            go("lose");
        }
    });
});

// Game over scene
scene("lose", () => {
    add([
        text("Game Over"),
        pos(center()),
        anchor("center")
    ]);
});

// Start the game
go("main");


