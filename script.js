/**
 * Nh Ninja V4.3 - Visual Restoration & Procedural Mastery
 * Eliminates external asset dependencies for characters to guarantee visibility.
 * Implements robust game termination and refined physics.
 */

class TextureGenerator {
    static generate(scene) {
        // Generate Naruto
        this.drawCharacter(scene, 'n', {
            body: 0xffa500, hair: 0xffd700, headband: 0x3b82f6, eyes: 0x0000ff,
            hairType: 'spiky', special: 'whiskers'
        });
        // Generate Sasuke
        this.drawCharacter(scene, 's', {
            body: 0x1e1b4b, hair: 0x111827, headband: 0x4338ca, eyes: 0xef4444,
            hairType: 'spiky_down', special: 'sharingan'
        });
        // Generate Sakura
        this.drawCharacter(scene, 'sa', {
            body: 0xdb2777, hair: 0xfbcfe8, headband: 0xffffff, eyes: 0x22c55e,
            hairType: 'bob'
        });
        // Generate Kakashi
        this.drawCharacter(scene, 'k', {
            body: 0x166534, hair: 0xe5e7eb, headband: 0x1e3a8a, eyes: 0x000000,
            hairType: 'tilt', special: 'mask'
        });

        // Generate Enemies
        this.drawEnemy(scene, 'e1', 0xdc2626);
        this.drawEnemy(scene, 'e2', 0x991b1b);
        this.drawEnemy(scene, 'boss', 0x4c1d95, true);

        // Generate Kunai
        const kg = scene.add.graphics();
        kg.fillStyle(0x333333, 1);
        kg.fillPoints([{x:10,y:0}, {x:12,y:8}, {x:20,y:10}, {x:12,y:12}, {x:10,y:20}, {x:8,y:12}, {x:0,y:10}, {x:8,y:8}], true);
        kg.fillStyle(0x000000, 1); kg.fillCircle(10, 10, 2);
        kg.generateTexture('kunai', 20, 20); kg.destroy();
    }

    static drawCharacter(scene, key, config) {
        const g = scene.add.graphics();
        const w = 60, h = 85;

        // Body/Clothes
        g.fillStyle(config.body, 1);
        g.fillRoundedRect(10, 25, 40, 55, 8);
        
        // Head/Face
        g.fillStyle(0xffdbac, 1);
        g.fillRoundedRect(15, 5, 30, 25, 5);

        // Headband
        g.fillStyle(config.headband, 1);
        g.fillRect(15, 12, 30, 6);
        g.fillStyle(0x9ca3af, 1);
        g.fillRect(22, 12, 16, 6);

        // Hair
        g.fillStyle(config.hair, 1);
        if (config.hairType === 'spiky') {
            g.fillPoints([{x:15,y:5}, {x:20,y:0}, {x:25,y:5}, {x:30,y:0}, {x:35,y:5}, {x:40,y:0}, {x:45,y:5}], true);
        } else if (config.hairType === 'spiky_down') {
            g.fillPoints([{x:15,y:10}, {x:10,y:20}, {x:20,y:10}, {x:30,y:25}, {x:40,y:10}, {x:50,y:20}, {x:45,y:10}], true);
        } else if (config.hairType === 'bob') {
            g.fillEllipse(30, 8, 32, 12);
        } else if (config.hairType === 'tilt') {
            g.fillPoints([{x:15,y:10}, {x:10,y:-5}, {x:45,y:10}], true);
        }

        // Eyes
        g.fillStyle(0xffffff, 1);
        g.fillRect(20, 19, 6, 4);
        g.fillRect(34, 19, 6, 4);
        g.fillStyle(config.eyes, 1);
        g.fillRect(22, 20, 2, 2);
        g.fillRect(36, 20, 2, 2);

        // Specials
        if (config.special === 'whiskers') {
            g.lineStyle(1, 0x000000, 0.5);
            g.lineBetween(17, 22, 22, 22); g.lineBetween(17, 24, 22, 24);
            g.lineBetween(38, 22, 43, 22); g.lineBetween(38, 24, 43, 24);
        }
        if (config.special === 'mask') {
            g.fillStyle(0x1f2937, 1);
            g.fillRect(15, 22, 30, 8);
        }

        g.generateTexture(key, w, h);
        g.destroy();
    }

    static drawEnemy(scene, key, color, isBoss = false) {
        const g = scene.add.graphics();
        const w = isBoss ? 120 : 55, h = isBoss ? 150 : 80;
        const scale = isBoss ? 2 : 1;

        g.fillStyle(color, 1);
        g.fillRoundedRect(5 * scale, 20 * scale, 45 * scale, 55 * scale, 5 * scale);
        g.fillStyle(0x333333, 1); // Mask
        g.fillRect(5 * scale, 10 * scale, 45 * scale, 15 * scale);
        g.fillStyle(0xff0000, 1); // Evil Eyes
        g.fillRect(15 * scale, 13 * scale, 5 * scale, 3 * scale);
        g.fillRect(35 * scale, 13 * scale, 5 * scale, 3 * scale);

        g.generateTexture(key, w, h);
        g.destroy();
    }
}

class PreloadScene extends Phaser.Scene {
    constructor() { super('PreloadScene'); }
    preload() {
        const { width, height } = this.cameras.main;
        this.add.graphics().fillStyle(0x111111).fillRoundedRect(width/2-160, height/2-25, 320, 50, 10);
        const bar = this.add.graphics();
        this.load.on('progress', (v) => {
            bar.clear().fillStyle(0xffa500).fillRoundedRect(width/2-150, height/2-15, 300*v, 30, 5);
        });
        
        // Critical: Generate procedurally before moving on
        this.load.on('complete', () => {
            TextureGenerator.generate(this);
            this.scene.start('TitleScene');
        });

        // Load only essential audio (fallback handled)
        this.load.audio('music_title', 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a1b1b1.mp3');
        this.load.audio('music_game', 'https://cdn.pixabay.com/audio/2022/01/18/audio_24924a1b1b.mp3');
    }
}

class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        this.sound.stopAll();
        const { width, height } = this.cameras.main;
        this.add.rectangle(0, 0, width, height, 0x050515).setOrigin(0);
        this.add.text(width/2, height/2-100, 'NH NINJA V4.3', { 
            fontSize: '110px', fontStyle: 'bold', fill: '#ffa500', stroke: '#fff', strokeThickness: 10 
        }).setOrigin(0.5);
        const btn = this.add.text(width/2, height/2+150, 'START ADVENTURE', { 
            fontSize: '40px', fill: '#fff', fontStyle: 'bold', backgroundColor: '#00cc00', padding: 20 
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.scene.start('SelectScene'));
        if (this.cache.audio.exists('music_title')) this.sound.play('music_title', { loop: true, volume: 0.3 });
    }
}

class SelectScene extends Phaser.Scene {
    constructor() { super('SelectScene'); }
    create() {
        this.add.rectangle(0, 0, 800, 600, 0x0a0a20).setOrigin(0);
        this.add.text(400, 80, 'SELECT YOUR WARRIOR', { fontSize: '52px', fontStyle: 'bold', fill: '#fff' }).setOrigin(0.5);
        const chars = [
            { id: 'n', name: 'NARUTO', color: 0xffa500 },
            { id: 's', name: 'SASUKE', color: 0x4b0082 },
            { id: 'sa', name: 'SAKURA', color: 0xffb7c5 },
            { id: 'k', name: 'KAKASHI', color: 0x228b22 }
        ];

        chars.forEach((c, i) => {
            const x = 120 + (i * 185);
            const card = this.add.container(x, 320);
            const bg = this.add.graphics().fillStyle(0x1a1a3a, 1).fillRoundedRect(-85, -140, 170, 280, 15).lineStyle(3, c.color).strokeRoundedRect(-85, -140, 170, 280, 15);
            const img = this.add.image(0, -20, c.id).setInteractive({ useHandCursor: true });
            img.on('pointerdown', () => { this.sound.stopAll(); this.scene.start('GameScene', { char: c }); });
            card.add([bg, img, this.add.text(0, 110, c.name, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5)]);
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }
    init(data) { this.charData = data.char; this.hp = 100; this.score = 0; this.isGameOver = false; }
    create() {
        this.worldWidth = 8000;
        this.physics.world.setBounds(0, 0, this.worldWidth, 600);
        this.cameras.main.setBounds(0, 0, this.worldWidth, 600);
        if (this.cache.audio.exists('music_game')) this.sound.play('music_game', { loop: true, volume: 0.4 });

        this.add.graphics().fillGradientStyle(0x1e3a8a, 0x1e3a8a, 0x3b82f6, 0x3b82f6, 1).fillRect(0, 0, this.worldWidth, 600).setScrollFactor(0);
        this.platforms = this.physics.add.staticGroup();
        for (let i = 0; i < 15; i++) {
            let g = this.add.graphics().fillStyle(0xEDC9AF).fillRect(0, 0, 600, 60);
            g.generateTexture(`ground${i}`, 600, 60);
            this.platforms.create(300 + (i * 600), 570, `ground${i}`).refreshBody(); g.destroy();
        }

        this.player = this.physics.add.sprite(200, 450, this.charData.id);
        this.player.setCollideWorldBounds(false);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.hpBar = this.add.graphics().setScrollFactor(0);
        this.uiText = this.add.text(20, 55, '', { fontSize: '20px', fontStyle: 'bold', fill: '#fff', stroke: '#000', strokeThickness: 2 }).setScrollFactor(0);

        this.enemies = this.physics.add.group();
        this.kunais = this.physics.add.group();
        this.spawnData = [];
        for (let i = 0; i < 40; i++) this.spawnData.push({ x: 1200 + (i * 200), y: 500, type: Phaser.Math.Between(1, 2), spawned: false });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.enemies, this.handleDamage, null, this);
        this.keys = this.input.keyboard.addKeys('Q,W,E,A,S');
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.isGameOver) return;
        
        if (this.hp <= 0 || this.player.y > 700) {
            this.isGameOver = true;
            this.player.setVelocity(0, 0);
            this.player.body.setEnable(false); // Critical: Stop all physics movements
            this.player.setTint(0xff0000);
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start('TitleScene'));
            return;
        }
        
        this.drawHP();
        this.uiText.setText(`NINJA: ${this.charData.name} | SCORE: ${this.score}`);

        const speed = 400;
        if (this.cursors.left.isDown) { this.player.setVelocityX(-speed); this.player.flipX = true; }
        else if (this.cursors.right.isDown) { this.player.setVelocityX(speed); this.player.flipX = false; }
        else { this.player.setVelocityX(0); }

        if ((Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keys.S)) && this.player.body.touching.down) {
            this.player.setVelocityY(-850);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.W)) this.fireKunai();
        if (this.keys.A.isDown) { this.player.setAlpha(0.6); this.player.isInvincible = true; } 
        else { this.player.setAlpha(1); this.player.isInvincible = false; }

        this.spawnData.forEach(s => {
            if (!s.spawned && s.x - this.player.x < 800 && s.x - this.player.x > 0) {
                let e = this.enemies.create(s.x, s.y, 'e'+s.type);
                e.setVelocityX(-180); s.spawned = true;
            }
        });
    }

    drawHP() {
        this.hpBar.clear();
        this.hpBar.fillStyle(0x000000, 0.5).fillRoundedRect(20, 20, 200, 25, 5);
        this.hpBar.fillStyle(this.hp > 30 ? 0x00ff00 : 0xff0000, 1).fillRoundedRect(22, 22, (this.hp/100)*196, 21, 4);
    }

    fireKunai() {
        let k = this.kunais.create(this.player.x, this.player.y, 'kunai');
        k.body.allowGravity = false;
        k.setVelocityX(this.player.flipX ? -1200 : 1200);
        this.physics.add.overlap(k, this.enemies, (kn, en) => { en.destroy(); kn.destroy(); this.score += 150; });
        this.time.delayedCall(1200, () => { if (k.active) k.destroy(); });
    }

    handleDamage(p, e) {
        if (p.isInvincible) return;
        this.hp -= 20;
        this.cameras.main.shake(150, 0.02);
        e.destroy();
    }
}

const config = {
    type: Phaser.AUTO, width: 800, height: 600, parent: 'game-container',
    physics: { default: 'arcade', arcade: { gravity: { y: 1500 }, debug: false } },
    scene: [PreloadScene, TitleScene, SelectScene, GameScene]
};
new Phaser.Game(config);
