/**
 * Nh Ninja "World & Story" Edition (V5.0)
 * Bright Atmosphere | Story Cutscenes | Cherry Blossom Effects
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
    static hitStop(scene, duration = 50) {
        scene.physics.world.pause();
        scene.time.delayedCall(duration, () => scene.physics.world.resume());
    }
    static shake(scene, intensity = 0.02, duration = 200) { scene.cameras.main.shake(duration, intensity); }
    static emitParticles(scene, x, y, type, color) {
        const particles = scene.add.particles(0, 0, 'pixel', {
            speed: { min: 50, max: 200 }, scale: { start: 1, end: 0 }, lifespan: 400, gravityY: 300,
            quantity: type === 'EXPLOSION' ? 30 : 5, tint: color || 0xcccccc
        });
        particles.emitParticleAt(x, y);
        scene.time.delayedCall(500, () => particles.destroy());
    }
}

class TextureGenerator {
    static generate(scene) {
        const pg = scene.add.graphics();
        pg.fillStyle(0xffffff).fillRect(0,0,4,4); pg.generateTexture('pixel', 4,4); pg.destroy();

        // Cherry Blossom Petal Textures
        const petal1 = scene.add.graphics().fillStyle(0xffb7c5).fillRect(0,0,4,4); petal1.generateTexture('petal1', 4,4); petal1.destroy();
        const petal2 = scene.add.graphics().fillStyle(0xff69b4).fillRect(0,0,6,6); petal2.generateTexture('petal2', 6,6); petal2.destroy();

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

        // Gimmicks & Enemies
        PixelRenderer.generateFromMap(scene, 'rope_anchor', 4, ART.anchor, { 'X': 0x111111, 'D': 0xcccccc, 'B': 0x8b4513 });
        PixelRenderer.generateFromMap(scene, 'spring', 4, ART.spring, { 'X': 0x111111, 'C': 0xffff00, 'G': 0x555555 });
        PixelRenderer.generateFromMap(scene, 'e1', 5, ART.enemy, { 'X': 0x111111, 'R': 0xdc2626, 'W': 0xffff00 });

        const kg = scene.add.graphics().fillStyle(0x888888).fillPoints([{x:0,y:5}, {x:15,y:5}, {x:20,y:2}, {x:30,y:5}, {x:20,y:8}, {x:15,y:5}], true);
        kg.generateTexture('kunai_v2', 30, 10); kg.destroy();

        const cg = scene.add.graphics().fillStyle(0xffffff, 0.8).fillRoundedRect(0, 0, 100, 20, 10);
        cg.generateTexture('cloud_plat', 100, 20); cg.destroy();

        // 1. Mountains (Distant Background)
        const mg = scene.add.graphics();
        mg.fillStyle(0x7b92a6, 1);
        mg.fillPoints([{x:0,y:400}, {x:200,y:100}, {x:400,y:300}, {x:600,y:50}, {x:800,y:400}], true);
        // Snow caps
        mg.fillStyle(0xffffff, 0.8).fillPoints([{x:160,y:160}, {x:200,y:100}, {x:240,y:140}, {x:200,y:180}], true);
        mg.fillPoints([{x:550,y:130}, {x:600,y:50}, {x:650,y:130}, {x:600,y:160}], true);
        mg.generateTexture('bg_mountains', 800, 400); mg.destroy();

        // 2. Fluffy Clouds (Mid Background)
        const fcg = scene.add.graphics();
        fcg.fillStyle(0xffffff, 0.6);
        fcg.fillCircle(50, 50, 30); fcg.fillCircle(80, 40, 40); fcg.fillCircle(110, 50, 30);
        fcg.fillCircle(250, 80, 25); fcg.fillCircle(280, 70, 35); fcg.fillCircle(310, 80, 25);
        fcg.generateTexture('bg_clouds', 400, 150); fcg.destroy();
    }
}

class StoryScene extends Phaser.Scene {
    constructor() { super('StoryScene'); }
    init(data) { this.charData = data.char; }
    create() {
        const w = 800, h = 600;
        this.add.rectangle(0, 0, w, h, 0x000000).setOrigin(0);
        
        // Portrait Placeholder
        this.add.image(100, h/2 - 50, `${this.charData.id}_idle`).setScale(4);
        
        // Dialogue Box
        this.add.rectangle(w/2, h - 100, w - 40, 160, 0x111111, 0.9).setStrokeStyle(4, 0xffffff);
        this.nameText = this.add.text(40, h - 170, '', { fontSize: '28px', fontStyle: 'bold', fill: '#ff0' });
        this.dialogueText = this.add.text(40, h - 130, '', { fontSize: '24px', fill: '#fff', wordWrap: { width: 720 } });
        this.promptText = this.add.text(w - 60, h - 40, '▼', { fontSize: '24px', fill: '#ff0' }).setOrigin(0.5);
        
        this.tweens.add({ targets: this.promptText, y: h-30, duration: 500, yoyo: true, repeat: -1 });

        this.dialogues = [
            { name: "HOKAGE", text: "마을의 금지된 두루마리를 탈주 닌자들에게 탈취당했다..." },
            { name: this.charData.name, text: "걱정 마십시오. 제가 반드시 되찾아 오겠습니다!" },
            { name: "HOKAGE", text: "서둘러라! 그들이 국경을 넘기 전에 막아야 한다!" },
            { name: "SYSTEM", text: "(임무가 시작됩니다... 행운을 빕니다!)" }
        ];
        
        this.currentLine = 0;
        this.currentChar = 0;
        this.isTyping = false;
        this.typeTimer = null;

        this.input.on('pointerdown', () => this.advanceDialogue());
        this.input.keyboard.on('keydown-SPACE', () => this.advanceDialogue());

        this.showNextLine();
    }

    advanceDialogue() {
        if (this.isTyping) {
            // Skip typing
            this.isTyping = false;
            if(this.typeTimer) this.typeTimer.remove();
            this.dialogueText.setText(this.dialogues[this.currentLine].text);
        } else {
            this.currentLine++;
            if (this.currentLine >= this.dialogues.length) {
                this.cameras.main.fade(800, 0, 0, 0);
                this.time.delayedCall(800, () => this.scene.start('GameScene', { char: this.charData }));
            } else {
                this.showNextLine();
            }
        }
    }

    showNextLine() {
        this.isTyping = true;
        this.currentChar = 0;
        this.nameText.setText(this.dialogues[this.currentLine].name);
        this.dialogueText.setText('');
        
        const fullText = this.dialogues[this.currentLine].text;
        this.typeTimer = this.time.addEvent({
            delay: 40,
            callback: () => {
                this.currentChar++;
                this.dialogueText.setText(fullText.slice(0, this.currentChar));
                if (this.currentChar >= fullText.length) this.isTyping = false;
            },
            repeat: fullText.length - 1
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }
    init(data) {
        this.charData = data.char; this.hp = 100; this.score = 0;
        this.dist = 0; this.isGameOver = false;
        this.skillUnlocked = false; this.skillCooldown = 0;
        this.isRoping = false; this.ropeTarget = null;
    }

    create() {
        const worldWidth = 20000;
        this.physics.world.setBounds(0, 0, worldWidth, 600);
        this.cameras.main.setBounds(0, 0, worldWidth, 600);
        
        // 1. Sky Gradient (Bright Daytime)
        const sky = this.add.graphics().setScrollFactor(0);
        sky.fillGradientStyle(0x4facfe, 0x4facfe, 0x00f2fe, 0x00f2fe, 1);
        sky.fillRect(0, 0, 800, 600);

        // 2. Parallax Mountains and Clouds
        this.bgMountains = this.add.tileSprite(0, 200, 800, 400, 'bg_mountains').setOrigin(0).setScrollFactor(0);
        this.bgClouds = this.add.tileSprite(0, 50, 800, 150, 'bg_clouds').setOrigin(0).setScrollFactor(0).setAlpha(0.8);

        // 3. Bright Grass Platforms
        this.platforms = this.physics.add.staticGroup();
        for(let i=0; i<40; i++) {
            let g = this.add.graphics();
            g.fillStyle(0x32cd32).fillRect(0, 0, 600, 20); // Grass Top
            g.fillStyle(0x8b4513).fillRect(0, 20, 600, 60); // Dirt Bottom
            g.generateTexture(`g${i}`, 600, 80);
            this.platforms.create(300 + i*600, 560, `g${i}`).refreshBody(); g.destroy();
        }

        // 4. Cherry Blossom Particles (Constant Ninja Vibe)
        this.blossoms = this.add.particles(0, 0, ['petal1', 'petal2'], {
            x: { min: 0, max: 1200 }, y: -50,
            gravityY: 50, gravityX: -20,
            speedX: { min: -50, max: -100 }, speedY: { min: 20, max: 60 },
            lifespan: 10000, quantity: 2, scale: { start: 1, end: 0.5 }, rotate: { min: 0, max: 360 },
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, -50, 1200, 50) }
        });
        this.blossoms.setScrollFactor(0); // Moves with camera, simulating global wind

        this.player = this.physics.add.sprite(200, 400, `${this.charData.id}_idle`);
        this.player.setBodySize(32, 50).setOffset(16, 14);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.enemies = this.physics.add.group();
        this.kunais = this.physics.add.group();
        this.anchors = this.physics.add.staticGroup();
        this.springs = this.physics.add.staticGroup();
        this.clouds = this.physics.add.group();

        for(let i=0; i<30; i++) {
            this.anchors.create(1200 + i*1000, 100, 'rope_anchor');
            this.springs.create(1500 + i*1000, 540, 'spring');
            this.clouds.create(1800 + i*1000, 420, 'cloud_plat').body.setAllowGravity(false).setImmovable(true);
        }

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.clouds, this.handleCloud, null, this);
        this.physics.add.collider(this.player, this.springs, (p, s) => { p.setVelocityY(-1200); JuiceManager.shake(this, 0.01, 100); });
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.enemies, this.handleDamage, null, this);

        this.keys = this.input.keyboard.addKeys('W,A,S,D,Q,SPACE');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.ropeLine = this.add.graphics().setDepth(10);

        this.ui = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
        this.hpBar = this.add.graphics();
        this.distText = this.add.text(20, 20, '0m', { fontSize: '32px', fill: '#fff', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 });
        
        this.skillBtn = this.add.rectangle(740, 540, 60, 60, 0x333333, 0.8).setStrokeStyle(2, 0xffffff);
        this.skillIcon = this.add.text(740, 540, '?', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
        this.cdText = this.add.text(740, 540, '', { fontSize: '20px', fill: '#ff0' }).setOrigin(0.5);
        
        this.ui.add([this.hpBar, this.distText, this.skillBtn, this.skillIcon, this.cdText]);

        this.unlockMsg = this.add.text(780, -100, 'NEW SKILL UNLOCKED! (Q)', { 
            fontSize: '28px', fill: '#ff0', fontStyle: 'bold', stroke: '#000', strokeThickness: 4, backgroundColor: '#00000088', padding: 10
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(2000);

        this.time.addEvent({ delay: 2000, callback: this.spawnEnemy, callbackScope: this, loop: true });
    }

    update(time, delta) {
        if (this.isGameOver) return;
        this.dist = Math.floor(this.player.x / 10);
        this.distText.setText(`${this.dist}m`);
        
        // Parallax scroll updates
        this.bgMountains.tilePositionX = this.cameras.main.scrollX * 0.1;
        this.bgClouds.tilePositionX = (this.cameras.main.scrollX * 0.3) + (time * 0.02); // Scrolls with camera AND moves slowly over time

        if (!this.skillUnlocked && this.dist > 100) {
            this.skillUnlocked = true;
            this.skillIcon.setText('SKILL');
            this.tweens.add({ targets: this.unlockMsg, y: 20, duration: 800, ease: 'Bounce' });
            this.time.delayedCall(4000, () => { this.tweens.add({ targets: this.unlockMsg, y: -100, duration: 500 }); });
        }

        this.updateHPBar();
        this.handleMovement(delta);
        this.handleRope();
        this.updateAnimation(time);
        
        if (this.skillCooldown > 0) {
            this.skillCooldown -= delta;
            this.cdText.setText(Math.ceil(this.skillCooldown/1000));
            this.skillBtn.setFillStyle(0x111111, 0.9);
        } else {
            this.cdText.setText('');
            this.skillBtn.setFillStyle(0x333333, 0.8);
        }
    }

    updateHPBar() {
        this.hpBar.clear();
        this.hpBar.fillStyle(0x000000, 0.6).fillRect(20, 60, 204, 24);
        const color = this.hp > 30 ? 0x2ecc71 : 0xe74c3c;
        this.hpBar.fillStyle(color, 1).fillRect(22, 62, (this.hp/100)*200, 20);
        this.hpBar.lineStyle(2, 0xffffff, 0.8).strokeRect(20, 60, 204, 24);
    }

    updateAnimation(time) {
        if (Math.abs(this.player.body.velocity.x) > 10 && this.player.body.touching.down) {
            if (time % 300 < 150) this.player.setTexture(`${this.charData.id}_run`);
            else this.player.setTexture(`${this.charData.id}_idle`);
        } else {
            this.player.setTexture(`${this.charData.id}_idle`);
        }
    }

    handleMovement(delta) {
        const speed = 400;
        if (this.isRoping) return;

        if (this.cursors.left.isDown) { this.player.setVelocityX(-speed); this.player.flipX = true; }
        else if (this.cursors.right.isDown) { this.player.setVelocityX(speed); this.player.flipX = false; }
        else { this.player.setVelocityX(0); }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.player.body.touching.down) {
            this.player.setVelocityY(-950);
            JuiceManager.emitParticles(this, this.player.x, this.player.y+20, 'DUST');
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.keys.W) || Phaser.Input.Keyboard.JustDown(this.keys.S)) this.fireKunai();
        if (Phaser.Input.Keyboard.JustDown(this.keys.Q) && this.skillUnlocked && this.skillCooldown <= 0) this.useSkill();
    }

    handleRope() {
        this.ropeLine.clear();
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
            if (this.isRoping) { this.isRoping = false; this.player.body.setAllowGravity(true); }
            else {
                let nearest = Phaser.Actions.GetClosest(this.player, this.anchors.getChildren());
                if (Phaser.Math.Distance.BetweenPoints(this.player, nearest) < 400) {
                    this.isRoping = true; this.ropeTarget = nearest;
                    this.player.body.setAllowGravity(false);
                }
            }
        }
        if (this.isRoping) {
            let angle = Phaser.Math.Angle.BetweenPoints(this.ropeTarget, this.player);
            this.player.x = this.ropeTarget.x + Math.cos(angle + 0.05) * 250;
            this.player.y = this.ropeTarget.y + Math.sin(angle + 0.05) * 250;
            this.player.setVelocity(0,0);
            
            this.ropeLine.lineStyle(2, 0x8b4513, 1);
            this.ropeLine.beginPath();
            this.ropeLine.moveTo(this.ropeTarget.x, this.ropeTarget.y);
            this.ropeLine.lineTo(this.player.x, this.player.y);
            this.ropeLine.strokePath();
        }
    }

    useSkill() {
        this.skillCooldown = 5000;
        JuiceManager.shake(this, 0.03, 300);
        const effectX = this.player.x + (this.player.flipX ? -60 : 60);
        const color = this.charData.id === 'n' ? 0x3b82f6 : (this.charData.id === 's' ? 0x8b5cf6 : 0xf472b6);
        
        let fx = this.add.circle(effectX, this.player.y, 50, color, 0.8);
        this.physics.add.existing(fx);
        this.physics.add.overlap(fx, this.enemies, (f, e) => {
            const ex = e.x, ey = e.y; e.destroy();
            JuiceManager.emitParticles(this, ex, ey, 'EXPLOSION', color);
            this.score += 300;
        });
        this.time.delayedCall(300, () => fx.destroy());
    }

    fireKunai() {
        const spawnX = this.player.x + (this.player.flipX ? -30 : 30);
        const k = this.kunais.create(spawnX, this.player.y, 'kunai_v2');
        k.body.setAllowGravity(false);
        k.setVelocityX(this.player.flipX ? -1500 : 1500);
        k.angle = this.player.flipX ? 180 : 0;
        
        this.physics.add.overlap(k, this.enemies, (kn, en) => {
            const ex = en.x, ey = en.y; en.destroy(); kn.destroy(); this.score += 150;
            JuiceManager.emitParticles(this, ex, ey, 'EXPLOSION');
        });
    }

    handleCloud(p, c) {
        this.tweens.add({ targets: c, alpha: 0, duration: 800, onComplete: () => c.destroy() });
    }

    spawnEnemy() {
        const x = this.player.x + 800;
        this.enemies.create(x, 400, 'e1').setVelocityX(-200);
    }

    handleDamage(p, e) {
        this.hp -= 20; JuiceManager.shake(this); 
        this.tweens.add({ targets: this.hpBar, x: 2, duration: 50, yoyo: true, repeat: 3 });
        e.destroy();
        if (this.hp <= 0) {
            this.isGameOver = true; this.physics.pause();
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start('TitleScene'));
        }
    }
}

class PreloadScene extends Phaser.Scene {
    constructor() { super('PreloadScene'); }
    preload() {
        this.load.on('complete', () => { TextureGenerator.generate(this); this.scene.start('TitleScene'); });
        this.load.audio('music_title', 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a1b1b1.mp3');
    }
}

class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        const { width, height } = this.cameras.main;
        
        // Bright title background
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x4facfe, 0x4facfe, 0x00f2fe, 0x00f2fe, 1);
        sky.fillRect(0, 0, 800, 600);

        this.add.text(width/2, height/2-100, 'NH NINJA V5.0', { fontSize: '80px', fill: '#fff', fontStyle: 'bold', stroke: '#3b82f6', strokeThickness: 10 }).setOrigin(0.5);
        this.add.text(width/2, height/2, 'WORLD & STORY EDITION', { fontSize: '24px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5);
        
        const btn = this.add.text(width/2, height/2+100, 'START ADVENTURE', { fontSize: '32px', backgroundColor: '#3b82f6', fill: '#fff', padding: 20 }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.scene.start('SelectScene'));
        this.tweens.add({ targets: btn, scale: 1.1, duration: 1000, yoyo: true, repeat: -1 });
    }
}

class SelectScene extends Phaser.Scene {
    constructor() { super('SelectScene'); }
    create() {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x4facfe, 0x4facfe, 0x00f2fe, 0x00f2fe, 1);
        sky.fillRect(0, 0, 800, 600);
        
        this.add.text(400, 80, 'CHOOSE YOUR WARRIOR', { fontSize: '48px', fontStyle: 'bold', fill: '#fff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5);
        const chars = [{id:'n', name:'NARUTO'}, {id:'s', name:'SASUKE'}, {id:'sa', name:'SAKURA'}, {id:'k', name:'KAKASHI'}];
        
        chars.forEach((c, i) => {
            const x = 120 + i*185;
            const img = this.add.image(x, 300, `${c.id}_idle`).setScale(2.5).setInteractive({ useHandCursor: true });
            img.on('pointerdown', () => this.scene.start('StoryScene', { char: c })); // Route to StoryScene first
            this.add.text(x, 420, c.name, { fontSize: '24px', fill: '#fff', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
            
            img.on('pointerover', () => { img.setTexture(`${c.id}_run`); img.setScale(2.8); });
            img.on('pointerout', () => { img.setTexture(`${c.id}_idle`); img.setScale(2.5); });
        });
    }
}

const config = {
    type: Phaser.AUTO, width: 800, height: 600, parent: 'game-container',
    physics: { default: 'arcade', arcade: { gravity: { y: 2000 }, debug: false } },
    scene: [PreloadScene, TitleScene, SelectScene, StoryScene, GameScene]
};
new Phaser.Game(config);
