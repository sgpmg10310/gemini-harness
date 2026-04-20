/**
 * Nh Ninja "World & Story" Edition (V7.0)
 * Center Aligned | Diverse Enemies | High Density Levels | Improved Particle UI
 */

class PixelRenderer {
    static generateFromMap(scene, key, pixelSize, map, colors) {
        const g = scene.add.graphics();
        for (let y = 0; y < map.length; y++) {
            const row = map[y];
            for (let x = 0; x < row.length; x++) {
                const symbol = row[x];
                if (symbol !== '.' && colors[symbol] !== undefined) {
                    g.fillStyle(colors[symbol]);
                    g.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        g.generateTexture(key, map[0].length * pixelSize, map.length * pixelSize);
        g.destroy();
    }
}

const ART = {
    char_idle: [
        "....XXXXXXX.....", "...XXHHHHHXX....", "..XHHHHHHHHHX...", "..XHHSSSSSXHX...",
        "..XXSWWEWWEHX...", "..X.SWEEWEESX...", "....XSSSSSX.....", "...XXCCCCCXX....",
        "..X.CXXXXXC.X...", "..X.CCCCCCC.X...", "..X.XXCCCXX.X...", "..X.XXCCCXX.X...",
        "...XX.XXX.XX....", "...XS.X.X.SX....", "...XX.X.X.XX....", "......X.X......."
    ],
    char_run: [
        "....XXXXXXX.....", "...XXHHHHHXX....", "..XHHHHHHHHHX...", "..XHHSSSSSXHX...",
        "..XXSWWEWWEHX...", "..X.SWEEWEESX...", "....XSSSSSX.....", "...XXCCCCCXX....",
        "..X.CXXXXXC.....", "..X.CCCCCCCXX...", "...XXXCCCXX.X...", "..XX.XCCCXX.X...",
        "..XS.X.XXX......", "..XX.X.X.XX.....", ".......X.XS.....", ".......X.XX....."
    ],
    anchor: [
        "....XXXX....", "...XDDDDX...", "..XDXXXXDX..", "..XDX..XDX..", "..XDX..XDX..",
        "..XDXXXXDX..", "...XDDDDX...", "....XXXX....", "...XBBBBX...", "...XBBBBX..."
    ],
    spring: [
        "..XXXXXXXX..", "..XCCCCCCX..", "...XXXXXX...", "....XXXX....", "...XXXXXX...",
        "....XXXX....", "...XXXXXX...", "..XXXXXXXX..", "XGGGGGGGGGGX", "XGGGGGGGGGGX"
    ],
    enemy: [
        "..XXXXXXXX..", ".XRRRRRRRRX.", "XRRRRRRRRRRX", "XRXXRRRRXXRX", "XRWWXRRXWWRX",
        "XXWWXRRXWWXX", "XRXXRRRRXXRX", "XRRRRRRRRRRX", ".XXRRRRRRXX.", "..XRRRRRRX.."
    ]
};

class JuiceManager {
    static shake(scene, intensity = 0.02, duration = 200) { scene.cameras.main.shake(duration, intensity); }
    static emitParticles(scene, x, y, type, color) {
        const particles = scene.add.particles(0, 0, 'pixel', {
            speed: { min: 50, max: 200 }, scale: { start: 0.8, end: 0 }, lifespan: 400, gravityY: 300,
            quantity: type === 'EXPLOSION' ? 30 : 5, tint: color || 0xcccccc
        });
        particles.emitParticleAt(x, y);
        scene.time.delayedCall(500, () => particles.destroy());
    }
}

class TextureGenerator {
    static generate(scene) {
        // 1. Soft Glow Circle (Particle)
        const pg = scene.make.graphics({x:0, y:0, add:false});
        for(let i=0; i<5; i++) pg.fillStyle(0xffffff, 0.15).fillCircle(16, 16, 16 - i*3);
        pg.fillStyle(0xffffff, 1).fillCircle(16, 16, 3);
        pg.generateTexture('pixel', 32, 32);

        // 2. Realistic Leaf/Petal (No squares)
        const lg = scene.make.graphics({x:0, y:0, add:false});
        lg.fillStyle(0x2ecc71, 1);
        lg.beginPath();
        lg.moveTo(10, 0); lg.lineTo(20, 10); lg.lineTo(10, 20); lg.lineTo(0, 10); lg.closePath(); lg.fillPath();
        lg.generateTexture('leaf', 20, 20);

        const palettes = {
            'n': { 'X': 0x111111, 'S': 0xffdbac, 'W': 0xffffff, 'E': 0x3b82f6, 'H': 0xffd700, 'C': 0xffa500 },
            's': { 'X': 0x111111, 'S': 0xffdbac, 'W': 0xffffff, 'E': 0xef4444, 'H': 0x111827, 'C': 0x1e1b4b },
            'sa': { 'X': 0x111111, 'S': 0xffdbac, 'W': 0xffffff, 'E': 0x22c55e, 'H': 0xfbcfe8, 'C': 0xdb2777 },
            'k': { 'X': 0x111111, 'S': 0xffdbac, 'W': 0xffffff, 'E': 0x111111, 'H': 0xe5e7eb, 'C': 0x166534 }
        };
        for (const [key, colors] of Object.entries(palettes)) {
            PixelRenderer.generateFromMap(scene, `${key}_idle`, 4, ART.char_idle, colors);
            PixelRenderer.generateFromMap(scene, `${key}_run`, 4, ART.char_run, colors);
        }

        PixelRenderer.generateFromMap(scene, 'rope_anchor', 4, ART.anchor, { 'X': 0x111111, 'D': 0xcccccc, 'B': 0x8b4513 });
        PixelRenderer.generateFromMap(scene, 'spring', 4, ART.spring, { 'X': 0x111111, 'C': 0xffff00, 'G': 0x555555 });
        PixelRenderer.generateFromMap(scene, 'e1', 5, ART.enemy, { 'X': 0x111111, 'R': 0xdc2626, 'W': 0xffff00 });
        
        scene.make.graphics({add:false}).fillStyle(0x888888).fillPoints([{x:0,y:5}, {x:15,y:5}, {x:20,y:2}, {x:30,y:5}, {x:20,y:8}, {x:15,y:5}], true).generateTexture('kunai_v2', 30, 10);
        scene.make.graphics({add:false}).fillStyle(0xffffff, 0.9).fillRoundedRect(0, 0, 100, 25, 12).generateTexture('cloud_plat', 100, 25);
        scene.make.graphics({add:false}).fillStyle(0xffffff, 0.4).fillCircle(10, 10, 10).generateTexture('enemy_bullet', 20, 20);

        const mg = scene.make.graphics({add:false});
        mg.fillStyle(0x7b92a6, 1).fillPoints([{x:0,y:400}, {x:200,y:100}, {x:400,y:300}, {x:600,y:50}, {x:800,y:400}], true);
        mg.fillStyle(0xffffff, 0.8).fillPoints([{x:160,y:160}, {x:200,y:100}, {x:240,y:140}, {x:200,y:180}], true).generateTexture('bg_mountains', 800, 400);

        const fcg = scene.make.graphics({add:false});
        fcg.fillStyle(0xffffff, 0.6).fillCircle(50, 50, 30).fillCircle(80, 40, 40).fillCircle(110, 50, 30).generateTexture('bg_clouds', 200, 100);
    }
}

class PreloadScene extends Phaser.Scene {
    constructor() { super('PreloadScene'); }
    preload() {
        this.load.on('complete', () => { TextureGenerator.generate(this); this.scene.start('TitleScene'); });
    }
}

class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        const { width, height } = this.cameras.main;
        this.add.graphics().fillGradientStyle(0x1e293b, 0x1e293b, 0x0f172a, 0x0f172a, 1).fillRect(0, 0, 800, 600);
        this.add.text(width/2, height/2-100, 'NH NINJA V7.0', { fontSize: '80px', fill: '#fff', fontStyle: 'bold', stroke: '#3b82f6', strokeThickness: 10 }).setOrigin(0.5);
        const btn = this.add.text(width/2, height/2+100, 'START ADVENTURE', { fontSize: '32px', backgroundColor: '#3b82f6', fill: '#fff', padding: 20 }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.scene.start('SelectScene'));
        this.tweens.add({ targets: btn, scale: 1.1, duration: 1000, yoyo: true, repeat: -1 });
    }
}

class SelectScene extends Phaser.Scene {
    constructor() { super('SelectScene'); }
    create() {
        this.add.graphics().fillGradientStyle(0x1e293b, 0x1e293b, 0x0f172a, 0x0f172a, 1).fillRect(0, 0, 800, 600);
        this.add.text(400, 80, 'CHOOSE YOUR WARRIOR', { fontSize: '48px', fontStyle: 'bold', fill: '#fff' }).setOrigin(0.5);
        const chars = [{id:'n', name:'NARUTO'}, {id:'s', name:'SASUKE'}, {id:'sa', name:'SAKURA'}, {id:'k', name:'KAKASHI'}];
        chars.forEach((c, i) => {
            const x = 120 + i*185;
            const img = this.add.image(x, 300, `${c.id}_idle`).setScale(3).setInteractive({ useHandCursor: true });
            img.on('pointerdown', () => this.scene.start('StoryScene', { char: c }));
            this.add.text(x, 420, c.name, { fontSize: '24px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        });
    }
}

class StoryScene extends Phaser.Scene {
    constructor() { super('StoryScene'); }
    init(data) { this.charData = data.char; }
    create() {
        const w = 800, h = 600;
        this.add.rectangle(0, 0, w, h, 0x000000).setOrigin(0);
        this.add.image(100, h/2 - 50, `${this.charData.id}_idle`).setScale(4);
        this.add.rectangle(w/2, h - 100, w - 40, 160, 0x111111, 0.9).setStrokeStyle(4, 0xffffff);
        this.nameText = this.add.text(40, h - 170, '', { fontSize: '28px', fontStyle: 'bold', fill: '#ff0' });
        this.dialogueText = this.add.text(40, h - 130, '', { fontSize: '24px', fill: '#fff', wordWrap: { width: 720 } });
        
        this.dialogues = [
            { name: "HOKAGE", text: "고대의 두루마리가 탈취되었다! 안개 계곡으로 향해라." },
            { name: this.charData.name, text: "걱정 마십시오. 반드시 되찾아 오겠습니다!" },
            { name: "SYSTEM", text: "(임무 시작: 500m 지점에서 적의 정예를 조우합니다.)" }
        ];
        this.currentLine = 0; this.input.on('pointerdown', () => this.next()); this.next();
    }
    next() {
        if (this.currentLine >= this.dialogues.length) return this.scene.start('GameScene', { char: this.charData });
        this.nameText.setText(this.dialogues[this.currentLine].name);
        this.dialogueText.setText(this.dialogues[this.currentLine].text);
        this.currentLine++;
    }
}

class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }
    init(data) {
        this.charData = data.char; this.hp = 100; this.score = 0; this.dist = 0;
        this.isGameOver = false; this.skillUnlocked = false; this.skillCooldown = 0;
        this.isRoping = false; this.ropeTarget = null; this.midStoryTriggered = false; this.isPausedForStory = false;
    }

    create() {
        const worldWidth = 50000;
        this.physics.world.setBounds(0, 0, worldWidth, 600);
        this.cameras.main.setBounds(0, 0, worldWidth, 600);
        
        this.add.graphics().setScrollFactor(0).fillGradientStyle(0x0f172a, 0x0f172a, 0x334155, 0x334155, 1).fillRect(0, 0, 800, 600);
        this.bgMountains = this.add.tileSprite(0, 200, 800, 400, 'bg_mountains').setOrigin(0).setScrollFactor(0);
        
        this.platforms = this.physics.add.staticGroup();
        for(let i=0; i<100; i++) {
            let g = this.add.graphics();
            g.fillStyle(0x32cd32).fillRect(0, 0, 600, 20); g.fillStyle(0x8b4513).fillRect(0, 20, 600, 60);
            g.generateTexture(`g${i}`, 600, 80);
            this.platforms.create(300 + i*600, 560, `g${i}`).refreshBody(); g.destroy();
        }

        // Falling Leaves (Replaces squares)
        this.blossoms = this.add.particles(0, 0, 'leaf', {
            x: { min: 0, max: 1200 }, y: -50, gravityY: 20, speedX: { min: -40, max: -100 },
            lifespan: 10000, quantity: 1, scale: { start: 0.5, end: 1 }, rotate: { min: 0, max: 360 }, alpha: { start: 0.8, end: 0 }
        }).setScrollFactor(0);

        this.player = this.physics.add.sprite(200, 400, `${this.charData.id}_idle`).setDepth(5);
        this.player.setBodySize(32, 50).setOffset(16, 14);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.enemies = this.physics.add.group();
        this.anchors = this.physics.add.staticGroup();
        this.clouds = this.physics.add.staticGroup();
        this.bullets = this.physics.add.group();

        // High Density Level Design
        for(let i=0; i<100; i++) {
            this.anchors.create(800 + i*500, 150, 'rope_anchor'); // More anchors (ropes)
            this.clouds.create(600 + i*400, 400 - (i%3)*100, 'cloud_plat').refreshBody(); // More platforms
        }

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.clouds, (p, c) => { if(!c.isP) { c.isP=true; this.tweens.add({targets:c, y:c.y+5, yoyo:true, duration:100, onComplete:()=>c.isP=false}); }});
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.enemies, this.handleDamage, null, this);
        this.physics.add.overlap(this.player, this.bullets, this.handleDamage, null, this);

        this.keys = this.input.keyboard.addKeys('W,A,S,D,Q,SPACE');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.ropeLine = this.add.graphics().setDepth(10);

        this.ui = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
        this.distText = this.add.text(20, 20, '0m', { fontSize: '32px', fill: '#fff', fontStyle: 'bold' });
        this.hpBar = this.add.graphics();
        this.ui.add([this.distText, this.hpBar]);

        this.time.addEvent({ delay: 2000, callback: this.spawnEnemy, callbackScope: this, loop: true });
    }

    update(time, delta) {
        if (this.isGameOver || this.isPausedForStory) return;
        this.dist = Math.floor(this.player.x / 10);
        this.distText.setText(`${this.dist}m`);
        this.bgMountains.tilePositionX = this.cameras.main.scrollX * 0.1;

        if (this.dist >= 500 && !this.midStoryTriggered) this.triggerMidStory();

        this.updateHPBar(); this.handleMovement(); this.handleRope(); this.handleEnemyAI();
    }

    updateHPBar() {
        this.hpBar.clear();
        this.hpBar.fillStyle(0x000000, 0.5).fillRect(20, 60, 200, 15);
        this.hpBar.fillStyle(this.hp > 30 ? 0x2ecc71 : 0xe74c3c).fillRect(20, 60, this.hp * 2, 15);
    }

    handleMovement() {
        if (this.isRoping) return;
        const speed = 400;
        if (this.cursors.left.isDown) { this.player.setVelocityX(-speed); this.player.flipX = true; }
        else if (this.cursors.right.isDown) { this.player.setVelocityX(speed); this.player.flipX = false; }
        else this.player.setVelocityX(0);

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.player.body.touching.down) this.player.setVelocityY(-900);
        if (Phaser.Input.Keyboard.JustDown(this.keys.Q)) this.useSkill();
    }

    handleRope() {
        this.ropeLine.clear();
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
            if (this.isRoping) { this.isRoping = false; this.player.body.setAllowGravity(true); }
            else {
                let near = Phaser.Actions.GetClosest(this.player, this.anchors.getChildren());
                if (Phaser.Math.Distance.BetweenPoints(this.player, near) < 400) {
                    this.isRoping = true; this.ropeTarget = near; this.player.body.setAllowGravity(false);
                }
            }
        }
        if (this.isRoping) {
            let angle = Phaser.Math.Angle.BetweenPoints(this.ropeTarget, this.player);
            this.player.x = this.ropeTarget.x + Math.cos(angle + 0.05) * 250;
            this.player.y = this.ropeTarget.y + Math.sin(angle + 0.05) * 250;
            this.player.setVelocity(0,0);
            this.ropeLine.lineStyle(3, 0x8b4513, 1).beginPath().moveTo(this.ropeTarget.x, this.ropeTarget.y).lineTo(this.player.x, this.player.y).strokePath();
        }
    }

    spawnEnemy() {
        const x = this.player.x + 800;
        const types = ['runner', 'jumper', 'shooter'];
        const type = Phaser.Utils.Array.GetRandom(types);
        const e = this.enemies.create(x, 400, 'e1');
        e.type = type; e.lastShot = 0;
        if(type === 'runner') e.setVelocityX(-250);
        else if(type === 'jumper') e.setVelocityX(-200);
        else e.setVelocityX(-150);
    }

    handleEnemyAI() {
        this.enemies.getChildren().forEach(e => {
            if(e.type === 'jumper' && Math.abs(e.x - this.player.x) < 300 && e.body.touching.down) e.setVelocityY(-600);
            if(e.type === 'shooter' && Math.abs(e.x - this.player.x) < 500) {
                let now = this.time.now;
                if(now - e.lastShot > 2000) {
                    e.lastShot = now;
                    const b = this.bullets.create(e.x, e.y, 'enemy_bullet');
                    b.body.setAllowGravity(false);
                    this.physics.moveToObject(b, this.player, 300);
                }
            }
        });
    }

    triggerMidStory() {
        this.midStoryTriggered = true; this.isPausedForStory = true; this.physics.pause();
        const lines = [
            { name: "BOSS", text: "여기까지 오다니, 제법이군." },
            { name: this.charData.name, text: "두루마리를 돌려받으러 왔다!" },
            { name: "BOSS", text: "가질 수 있다면 가져가 봐라!" }
        ];
        const group = this.add.container(0, 0).setDepth(3000).setScrollFactor(0);
        const bg = this.add.rectangle(400, 300, 800, 600, 0, 0.7).setInteractive();
        const box = this.add.rectangle(400, 500, 760, 150, 0x111111, 0.9).setStrokeStyle(2, 0xffffff);
        const txt = this.add.text(40, 450, '', { fontSize: '24px', fill: '#fff' });
        group.add([bg, box, txt]);
        let curr = 0;
        const next = () => {
            if(curr >= lines.length) { group.destroy(); this.isPausedForStory = false; this.physics.resume(); return; }
            txt.setText(`${lines[curr].name}: ${lines[curr].text}`); curr++;
        };
        bg.on('pointerdown', next); next();
    }

    useSkill() {
        JuiceManager.shake(this, 0.05, 300);
        const color = this.charData.id === 'n' ? 0x3b82f6 : 0xef4444;
        let ring = this.add.circle(this.player.x, this.player.y, 10, color, 0.5).setStrokeStyle(3, 0xffffff);
        this.tweens.add({ targets: ring, radius: 300, alpha: 0, duration: 500, onComplete: () => ring.destroy() });
        this.enemies.getChildren().forEach(e => { if(Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y) < 300) { JuiceManager.emitParticles(this, e.x, e.y, 'EXPLOSION', color); e.destroy(); }});
    }

    handleDamage(p, e) {
        this.hp -= 10; e.destroy();
        if(this.hp <= 0) this.scene.start('TitleScene');
    }
}

const config = {
    type: Phaser.AUTO, width: 800, height: 600, parent: 'game-container',
    physics: { default: 'arcade', arcade: { gravity: { y: 2000 } } },
    scene: [PreloadScene, TitleScene, SelectScene, StoryScene, GameScene]
};
new Phaser.Game(config);
