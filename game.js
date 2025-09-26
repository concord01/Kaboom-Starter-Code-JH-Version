// Initialize the Kaboom context.
kaboom({
    width: 800,
    height: 600,
    background: [0, 100, 200],
});

// Set the global gravity value for all physics objects.
setGravity(800);

// --- Load Assets ---
// We must load all sprites before we can use them in the game.
loadSprite("pineapple", "https://kaboomjs.com/sprites/pineapple.png");
// This was the missing line! Now the game knows what an "enemy" looks like.
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
        sprite("pineapple"),
        pos(100, 100),
        area({ scale: 0.7 }),
        body(),
        "player",
        timer(),
        health(2),
    ]);

    // --- The Enemy Character ---
    // This function DEFINES the patrol component for our enemy
    function patrol() {
        return {
            id: "patrol",
            require: [ "pos", "area", ],
            dir: -1,
            update() {
                this.move(60 * this.dir, 0);
            },
            // This event flips the direction when the enemy collides with something
            add() {
                this.onCollide((obj, col) => {
                    // The isSide() function doesn't exist.
                    // Instead, we check if the collision is from the left OR the right.
                    if (col.isLeft() || col.isRight()) {
                        this.dir = -this.dir;
                    }
                });
            },
        };
    }

    // Add an enemy to the scene
    const enemy = add([
        sprite("enemy"),
        pos(600, 200), // Start position for the enemy
        area(),
        body(),
        patrol(), // Use the patrol component we just defined
        "enemy"
    ]);


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

    player.onCollide("enemy", (enemy, col) => {
        // If the player lands on top of the enemy
        if (col.isBottom()) {
            destroy(enemy);
            player.jump(300);
        } else {
            // If the player hits the enemy from the side
            player.health = player.health-1;
            if (player.health != 0){
                for(i = 0; i < 10; i++){
                    player.opacity = 0.2
                    wait(0.4, () =>{
                        player.opacity = 1
                    });
                };
            }
            else if (player.health == 0){
                destroy(player);
            };
        };
    });
});


// --- Game Over Scene ---
scene("lose", () => {
    add([
        text("Game Over"),
        pos(center()),
        anchor("center"),
    ]);

    // Go back to the main game after 2 seconds
    wait(2, () => {
        go("main");
    });
});

// Start the game
go("main");