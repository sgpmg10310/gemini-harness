/**
 * Nh Ninja "Final Mission" Edition (V8.0)
 * 100 Stages | Boss Arena | Character Colors | Advanced Monster AI
 */

class PixelRenderer {
    static generateFromMap(scene, key, pixelSize, map, colors) {
        const g = scene.make.graphics({add: false});
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
    monster: [
        "..XXXXXXXX..", ".XRRRRRRRRX.", "XRRRRRRRRRRX", "XRXXRRRRXXRX", "XRWWXRRXWWRX",
        "XXWWXRRXWWXX", "XRXXRRRRXXRX", "XRRRRRRRRRRX", ".XXRRRRRRXX.", "..XRRRRRRX.."
    ],
    monster_alt: [
        "....XXXX....", "...XRRRRX...", "..XRRRRRRX..", ".XRRXXXXRRX.", ".XRXRRRRXRX.",
        ".XRXRRRRXRX.", ".XRRXXXXRRX.", "..XRRRRRRX..", "...XRRRRX...", "....XXXX...."
    ]
};

class JuiceManager {
    static shake(scene, intensity = 0.02, duration = 200) { scene.cameras.main.shake(duration, intensity); }
    static emitParticles(scene, x, y, type, color) {
        const particles = scene.add.particles(0, 0, 'pixel', {
            speed: { min: 50, max: 200 }, scale: { start: 0.8, end: 0 }, lifespan: 400, gravityY: 300,
            quantity: type === 'EXPLOSION' ? 30 : 5, tint: color || 0xffffff
        });
        particles.emitParticleAt(x, y);
        scene.time.delayedCall(500, () => particles.destroy());
    }
}

class TextureGenerator {
    static generate(scene) {
        // Particles & UI
        const pg = scene.make.graphics({add: false});
        for(let i=0; i<5; i++) pg.fillStyle(0xffffff, 0.15).fillCircle(16, 16, 16 - i*3);
        pg.fillStyle(0xffffff, 1).fillCircle(16, 16, 3);
        pg.generateTexture('pixel', 32, 32);

        const lg = scene.make.graphics({add: false});
        lg.fillStyle(0x2ecc71, 1).beginPath().moveTo(10, 0).lineTo(20, 10).lineTo(10, 20).lineTo(0, 10).closePath().fillPath();
        lg.generateTexture('leaf', 20, 20);

        // Characters
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

        // Diverse Monsters
        PixelRenderer.generateFromMap(scene, 'm1', 4, ART.monster, { 'X': 0x111111, 'R': 0xffffff, 'W': 0x000000 });
        PixelRenderer.generateFromMap(scene, 'm2', 4, ART.monster_alt, { 'X': 0x111111, 'R': 0xffffff });

        scene.make.graphics({add: false}).fillStyle(0x8b4513).fillRect(0,0,16,16).generateTexture('rope_anchor', 16, 16);
        scene.make.graphics({add: false}).fillStyle(0xffffff, 0.9).fillRoundedRect(0, 0, 100, 25, 12).generateTexture('cloud_plat', 100, 25);
        scene.make.graphics({add: false}).fillStyle(0x3b82f6).fillCircle(15, 5, 5).generateTexture('kunai_n', 30, 10);
        scene.make.graphics({add: false}).fillStyle(0x8b5cf6).fillCircle(15, 5, 5).generateTexture('kunai_s', 30, 10);
        scene.make.graphics({add: false}).fillStyle(0xf472b6).fillCircle(15, 5, 5).generateTexture('kunai_sa', 30, 10);
        scene.make.graphics({add: false}).fillStyle(0xe5e7eb).fillCircle(15, 5, 5).generateTexture('kunai_k', 30, 10);
        scene.make.graphics({add: false}).fillStyle(0xffffff, 0.4).fillCircle(10, 10, 10).generateTexture('enemy_bullet', 20, 20);

        const mg = scene.make.graphics({add: false});
        mg.fillStyle(0x7b92a6, 1).fillPoints([{x:0,y:400}, {x:200,y:100}, {x:400,y:300}, {x:600,y:50}, {x:800,y:400}], true).generateTexture('bg_mountains', 800, 400);
    }
}

class PreloadScene extends Phaser.Scene {
    constructor() { super('PreloadScene'); }
    preload() { this.load.on('complete', () => { TextureGenerator.generate(this); this.scene.start('TitleScene'); }); }
}

class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        this.add.graphics().fillGradientStyle(0x1e293b, 0x1e293b, 0x0f172a, 0x0f172a, 1).fillRect(0, 0, 800, 600);
        this.add.text(400, 200, 'NH NINJA V8.0', { fontSize: '80px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        const btn = this.add.text(400, 400, 'START MISSION', { fontSize: '32px', backgroundColor: '#3b82f6', fill: '#fff', padding: 20 }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.scene.start('SelectScene'));
    }
}

class SelectScene extends Phaser.Scene {
    constructor() { super('SelectScene'); }
    create() {
        this.add.graphics().fillGradientStyle(0x1e293b, 0x1e293b, 0x0f172a, 0x0f172a, 1).fillRect(0, 0, 800, 600);
        this.add.text(400, 80, 'CHOOSE YOUR NINJA', { fontSize: '48px', fontStyle: 'bold', fill: '#fff' }).setOrigin(0.5);
        const chars = [{id:'n', name:'NARUTO'}, {id:'s', name:'SASUKE'}, {id:'sa', name:'SAKURA'}, {id:'k', name:'KAKASHI'}];
        chars.forEach((c, i) => {
            const x = 120 + i*185;
            const img = this.add.image(x, 300, `${c.id}_idle`).setScale(3).setInteractive({ useHandCursor: true });
            img.on('pointerdown', () => this.scene.start('StoryScene', { char: c }));
            this.add.text(x, 420, c.name, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
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
        const box = this.add.rectangle(400, 500, 760, 160, 0x111111, 0.9).setStrokeStyle(4, 0xffffff);
        this.nameText = this.add.text(40, 430, '', { fontSize: '28px', fontStyle: 'bold', fill: '#ff0' });
        this.dialogueText = this.add.text(40, 470, '', { fontSize: '24px', fill: '#fff', wordWrap: { width: 720 } });
        this.dialogues = [
            { name: "HOKAGE", text: "탈주 닌자들이 국경을 넘기 전에 막아라. 100개의 관문이 기다리고 있다." },
            { name: this.charData.name, text: "제 이름에 걸린 긍지를 걸고 반드시 완수하겠습니다!" },
            { name: "SYSTEM", text: "(미션: 50,000m 지점의 최종 보스를 격파하십시오.)" }
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
        this.charData = data.char; this.hp = 100; this.score = 0; this.dist = 0; this.stage = 1;
        this.isGameOver = false; this.skillCooldown = 0;
        this.isRoping = false; this.ropeTarget = null; this.midStoryTriggered = false; this.isPausedForStory = false;
        this.isBossArena = false;
    }

    create() {
        const worldWidth = 60000;
        this.physics.world.setBounds(0, 0, worldWidth, 600);
        this.cameras.main.setBounds(0, 0, worldWidth, 600);
        this.add.graphics().setScrollFactor(0).fillGradientStyle(0x0f172a, 0x0f172a, 0x334155, 0x334155, 1).fillRect(0, 0, 800, 600);
        this.bgMountains = this.add.tileSprite(0, 200, 800, 400, 'bg_mountains').setOrigin(0).setScrollFactor(0);

        this.platforms = this.physics.add.staticGroup();
        for(let i=0; i<150; i++) {
            let g = this.add.graphics();
            g.fillStyle(0x32cd32).fillRect(0, 0, 600, 20); g.fillStyle(0x8b4513).fillRect(0, 20, 600, 60);
            g.generateTexture(`g${i}`, 600, 80);
            this.platforms.create(300 + i*600, 560, `g${i}`).refreshBody(); g.destroy();
        }

        this.blossoms = this.add.particles(0, 0, 'leaf', {
            x: { min: 0, max: 1200 }, y: -50, gravityY: 20, speedX: { min: -40, max: -100 },
            lifespan: 10000, quantity: 1, scale: { start: 0.5, end: 1 }, rotate: { min: 0, max: 360 }, alpha: { start: 0.8, end: 0 }
        }).setScrollFactor(0);

        this.player = this.physics.add.sprite(200, 400, `${this.charData.id}_idle`).setDepth(10);
        this.player.setBodySize(32, 50).setOffset(16, 14);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.enemies = this.physics.add.group();
        this.kunais = this.physics.add.group();
        this.bullets = this.physics.add.group();
        this.anchors = this.physics.add.staticGroup();
        this.clouds = this.physics.add.staticGroup();

        // High Density Level Design
        for(let i=0; i<200; i++) {
            this.anchors.create(1000 + i*400, 150, 'rope_anchor');
            this.clouds.create(800 + i*350, 400 - (i%4)*80, 'cloud_plat').refreshBody();
        }

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.clouds, (p, c) => { if(!c.isP) { c.isP=true; this.tweens.add({targets:c, y:c.y+5, yoyo:true, duration:100, onComplete:()=>c.isP=false}); }});
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.enemies, this.handleDamage, null, this);
        this.physics.add.overlap(this.player, this.bullets, this.handleDamage, null, this);
        this.physics.add.overlap(this.kunais, this.enemies, (k, e) => { e.destroy(); k.destroy(); this.score += 100; JuiceManager.emitParticles(this, e.x, e.y, 'EXPLOSION'); });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D,Q,SPACE');
        this.ropeLine = this.add.graphics().setDepth(5);

        this.ui = this.add.container(0, 0).setScrollFactor(0).setDepth(2000);
        this.distText = this.add.text(20, 20, '0m | STAGE 1', { fontSize: '28px', fill: '#fff', fontStyle: 'bold' });
        this.hpBar = this.add.graphics();
        this.skillCdText = this.add.text(780, 20, '', { fontSize: '24px', fill: '#ff0' }).setOrigin(1, 0);
        this.ui.add([this.distText, this.hpBar, this.skillCdText]);

        this.time.addEvent({ delay: 2000, callback: this.spawnEnemy, callbackScope: this, loop: true });
    }

    update(time, delta) {
        if (this.isGameOver || this.isPausedForStory) return;
        this.dist = Math.floor(this.player.x / 10);
        this.stage = Math.min(100, Math.floor(this.dist / 500) + 1);
        this.distText.setText(`${this.dist}m | STAGE ${this.stage}`);
        this.bgMountains.tilePositionX = this.cameras.main.scrollX * 0.1;

        if (this.stage >= 100 && !this.isBossArena) this.triggerBossArena();

        if (this.skillCooldown > 0) {
            this.skillCooldown -= delta;
            this.skillCdText.setText(`SKILL READY: ${Math.ceil(this.skillCooldown/1000)}s`);
        } else {
            this.skillCdText.setText('SKILL READY!');
        }

        this.updateHPBar(); this.handleMovement(); this.handleRope(); this.handleEnemyAI();
    }

    triggerBossArena() {
        this.isBossArena = true;
        this.cameras.main.stopFollow();
        const arenaX = this.player.x - 400;
        this.physics.world.setBounds(arenaX, 0, 800, 600);
        this.player.setCollideWorldBounds(true);
        JuiceManager.shake(this, 0.05, 500);
        
        // Final Boss Spawn
        const boss = this.enemies.create(arenaX + 700, 400, 'm2').setScale(3).setTint(0xff0000);
        boss.type = 'boss'; boss.hp = 100; boss.lastShot = 0;
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
        if (Phaser.Input.Keyboard.JustDown(this.keys.W) || Phaser.Input.Keyboard.JustDown(this.keys.S)) this.fireKunai();
        if (Phaser.Input.Keyboard.JustDown(this.keys.Q) && this.skillCooldown <= 0) this.useSkill();
    }

    fireKunai() {
        const k = this.kunais.create(this.player.x, this.player.y, `kunai_${this.charData.id}`);
        k.body.setAllowGravity(false);
        k.setVelocityX(this.player.flipX ? -1200 : 1200);
        k.angle = this.player.flipX ? 180 : 0;
    }

    useSkill() {
        this.skillCooldown = 5000;
        JuiceManager.shake(this, 0.05, 400);
        const color = this.charData.id === 'n' ? 0x3b82f6 : (this.charData.id === 's' ? 0x8b5cf6 : 0xf472b6);
        let ring = this.add.circle(this.player.x, this.player.y, 10, color, 0.3).setStrokeStyle(3, 0xffffff);
        this.tweens.add({ targets: ring, radius: 400, alpha: 0, duration: 600, onComplete: () => ring.destroy() });
        this.enemies.getChildren().forEach(e => {
            if(Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y) < 400) {
                JuiceManager.emitParticles(this, e.x, e.y, 'EXPLOSION', color);
                if (e.type === 'boss') e.hp -= 20; else e.destroy();
            }
        });
    }

    handleRope() {
        this.ropeLine.clear();
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
            if (this.isRoping) { this.isRoping = false; this.player.body.setAllowGravity(true); }
            else {
                let near = Phaser.Actions.GetClosest(this.player, this.anchors.getChildren());
                if (near && Phaser.Math.Distance.BetweenPoints(this.player, near) < 400) {
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
        if (this.isBossArena) return;
        const x = this.player.x + 800;
        const type = Phaser.Utils.Array.GetRandom(['runner', 'jumper', 'shooter']);
        const texture = Phaser.Utils.Array.GetRandom(['m1', 'm2']);
        const e = this.enemies.create(x, 400, texture);
        e.type = type; e.lastShot = 0; e.setTint(Phaser.Display.Color.RandomRGB().color);
        const speed = -200 - (this.stage * 2);
        e.setVelocityX(speed);
    }

    handleEnemyAI() {
        this.enemies.getChildren().forEach(e => {
            if(e.type === 'jumper' && Math.abs(e.x - this.player.x) < 300 && e.body.touching.down) e.setVelocityY(-700);
            if(e.type === 'shooter' || e.type === 'boss') {
                if(this.time.now - e.lastShot > 2000) {
                    e.lastShot = this.time.now;
                    const b = this.bullets.create(e.x, e.y, 'enemy_bullet');
                    b.body.setAllowGravity(false);
                    this.physics.moveToObject(b, this.player, 350);
                }
            }
        });
    }

    handleDamage(p, e) {
        this.hp -= 10; JuiceManager.shake(this); e.destroy();
        if(this.hp <= 0) this.scene.start('TitleScene');
    }
}

const config = {
    type: Phaser.AUTO, width: 800, height: 600, parent: 'game-container',
    physics: { default: 'arcade', arcade: { gravity: { y: 2200 } } },
    scene: [PreloadScene, TitleScene, SelectScene, StoryScene, GameScene]
};
new Phaser.Game(config);
