/**
 * Nh Ninja V4.2 (Emergency Patch) - Master Script
 * Robust asset loading, CORS handling, and runtime fallbacks.
 */

const PROXY = 'https://wsrv.nl/?url=';
const ASSETS = {
    NARUTO: PROXY + 'https://i.imgur.com/vHqBv6R.png',
    SASUKE: PROXY + 'https://i.imgur.com/KzX5ZzK.png',
    SAKURA: PROXY + 'https://i.imgur.com/5u9C67y.png',
    KAKASHI: PROXY + 'https://i.imgur.com/8Qe7jWv.png',
    ENEMY_1: PROXY + 'https://i.imgur.com/7Y9WzB3.png',
    ENEMY_2: PROXY + 'https://i.imgur.com/6XzWzB3.png',
    BOSS: PROXY + 'https://i.imgur.com/9AzWzB3.png',
    KUNAI: PROXY + 'https://i.imgur.com/8E6pA9V.png',
    BGM_TITLE: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a1b1b1.mp3',
    BGM_GAME: 'https://cdn.pixabay.com/audio/2022/01/18/audio_24924a1b1b.mp3'
};

class PreloadScene extends Phaser.Scene {
    constructor() { super('PreloadScene'); }
    preload() {
        const { width, height } = this.cameras.main;
        
        // UI: Loading Bar Background
        this.add.graphics().fillStyle(0x111111, 0.9).fillRoundedRect(width / 2 - 160, height / 2 - 25, 320, 50, 10);
        const progressBar = this.add.graphics();
        
        const loadingText = this.make.text({ 
            x: width / 2, y: height / 2 - 60, 
            text: 'INITIALIZING NINJA SYSTEMS...', 
            style: { font: 'bold 20px monospace', fill: '#ffa500' } 
        }).setOrigin(0.5);
        
        const percentText = this.make.text({ 
            x: width / 2, y: height / 2 + 50, 
            text: '0%', 
            style: { font: '18px monospace', fill: '#ffffff' } 
        }).setOrigin(0.5);

        const errorText = this.add.text(width / 2, height / 2 + 90, '', { font: '14px monospace', fill: '#ff4444' }).setOrigin(0.5);

        // Configuration
        this.load.crossOrigin = 'anonymous';

        // Event Handlers
        this.load.on('progress', (value) => {
            percentText.setText(`SYNCING ASSETS: ${Math.floor(value * 100)}%`);
            progressBar.clear();
            // Outer glow effect
            progressBar.lineStyle(2, 0xffa500, 0.3);
            progressBar.strokeRoundedRect(width / 2 - 152, height / 2 - 17, 304, 34, 5);
            // Progress fill
            progressBar.fillStyle(0xffa500, 1).fillRoundedRect(width / 2 - 150, height / 2 - 15, 300 * value, 30, 5);
        });

        this.load.on('loaderror', (file) => {
            console.error(`Asset load error: ${file.key}`);
            errorText.setText('Network lag detected. Using local fallbacks.');
        });

        this.load.on('complete', () => {
            this.scene.start('TitleScene');
        });

        // Safety Timeout (10 seconds)
        this.time.delayedCall(10000, () => {
            if (this.scene.isActive('PreloadScene')) this.scene.start('TitleScene');
        });

        // Assets
        this.load.image('n', ASSETS.NARUTO);
        this.load.image('s', ASSETS.SASUKE);
        this.load.image('sa', ASSETS.SAKURA);
        this.load.image('k', ASSETS.KAKASHI);
        this.load.image('e1', ASSETS.ENEMY_1);
        this.load.image('e2', ASSETS.ENEMY_2);
        this.load.image('boss', ASSETS.BOSS);
        this.load.image('kunai', ASSETS.KUNAI);
        this.load.audio('music_title', ASSETS.BGM_TITLE);
        this.load.audio('music_game', ASSETS.BGM_GAME);
    }
}

class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        this.sound.stopAll();
        const { width, height } = this.cameras.main;
        
        this.add.rectangle(0, 0, width, height, 0x050515).setOrigin(0);
        
        const title = this.add.text(width / 2, height / 2 - 100, 'NH NINJA V4.2 (Emergency Patch)', { 
            fontSize: '110px', fontStyle: 'bold', fill: '#ffa500', 
            stroke: '#ffffff', strokeThickness: 10,
            shadow: { offsetX: 0, offsetY: 0, color: '#ff4500', blur: 30, stroke: true, fill: true }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.text(width / 2, height / 2 + 10, 'STABILITY & PRECISION ENHANCED', { 
            fontSize: '22px', fill: '#888', letterSpacing: 5 
        }).setOrigin(0.5);
        
        const startBtn = this.add.text(width / 2, height / 2 + 150, 'START ADVENTURE', { 
            fontSize: '40px', fill: '#ffffff', fontStyle: 'bold',
            backgroundColor: '#00cc00', padding: { x: 40, y: 20 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        startBtn.on('pointerover', () => {
            startBtn.setBackgroundColor('#00ee00').setScale(1.1);
        });
        startBtn.on('pointerout', () => {
            startBtn.setBackgroundColor('#00cc00').setScale(1.0);
        });
        startBtn.on('pointerdown', () => this.scene.start('SelectScene'));
        
        if (this.cache.audio.exists('music_title')) {
            this.sound.play('music_title', { loop: true, volume: 0.3 });
        }
    }
}

class SelectScene extends Phaser.Scene {
    constructor() { super('SelectScene'); }
    create() {
        this.add.rectangle(0, 0, 800, 600, 0x0a0a20).setOrigin(0);
        this.add.text(400, 80, 'SELECT YOUR WARRIOR', { 
            fontSize: '52px', fontStyle: 'bold', fill: '#fff',
            shadow: { color: '#3b82f6', blur: 20, fill: true }
        }).setOrigin(0.5);
        
        const chars = [
            { id: 'n', name: 'NARUTO', color: 0xffa500, desc: 'Balance' },
            { id: 's', name: 'SASUKE', color: 0x4b0082, desc: 'Speed' },
            { id: 'sa', name: 'SAKURA', color: 0xffb7c5, desc: 'Power' },
            { id: 'k', name: 'KAKASHI', color: 0x228b22, desc: 'Elite' }
        ];

        chars.forEach((c, i) => {
            const x = 120 + (i * 185);
            const card = this.add.container(x, 320);
            
            // Card Background
            const bg = this.add.graphics();
            bg.fillStyle(0x1a1a3a, 1).fillRoundedRect(-85, -140, 170, 280, 15);
            bg.lineStyle(3, c.color, 0.8).strokeRoundedRect(-85, -140, 170, 280, 15);
            
            let avatar;
            if (this.textures.exists(c.id)) {
                avatar = this.add.image(0, -20, c.id).setDisplaySize(140, 210).setInteractive({ useHandCursor: true });
            } else {
                avatar = this.add.rectangle(0, -20, 140, 210, c.color).setInteractive({ useHandCursor: true });
            }
            
            avatar.on('pointerover', () => {
                avatar.setTint(0xffffff);
                this.tweens.add({ targets: card, y: 310, duration: 200 });
            });
            avatar.on('pointerout', () => {
                avatar.clearTint();
                this.tweens.add({ targets: card, y: 320, duration: 200 });
            });
            
            avatar.on('pointerdown', () => {
                this.sound.stopAll();
                this.scene.start('GameScene', { char: c });
            });
            
            card.add([bg, avatar, 
                this.add.text(0, 110, c.name, { fontSize: '24px', fontStyle: 'bold', fill: '#fff' }).setOrigin(0.5),
                this.add.text(0, 135, c.desc, { fontSize: '16px', fill: c.color }).setOrigin(0.5)
            ]);
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

        // World: Desert Ambience
        this.add.graphics().fillGradientStyle(0x1e3a8a, 0x1e3a8a, 0x3b82f6, 0x3b82f6, 1).fillRect(0, 0, this.worldWidth, 600).setScrollFactor(0);
        
        // Desert Dunes (Graphics)
        const dunes = this.add.graphics();
        dunes.fillStyle(0xd97706, 0.5);
        for(let i=0; i<20; i++) {
            dunes.fillEllipse(i * 500, 580, 800, 200);
        }
        dunes.setScrollFactor(0.5);

        this.platforms = this.physics.add.staticGroup();
        for (let i = 0; i < 15; i++) {
            let g = this.add.graphics().fillStyle(0xEDC9AF).fillRect(0, 0, 600, 60);
            g.generateTexture(`ground${i}`, 600, 60);
            this.platforms.create(300 + (i * 600), 570, `ground${i}`).refreshBody();
            g.destroy();
        }

        // Player
        const pKey = this.textures.exists(this.charData.id) ? this.charData.id : null;
        this.player = this.physics.add.sprite(200, 450, pKey).setDisplaySize(65, 95);
        if (!pKey) this.player.setTint(this.charData.color);
        this.player.setCollideWorldBounds(false);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // UI: Modern HP Bar
        this.hpBarBg = this.add.graphics().fillStyle(0x000000, 0.5).fillRoundedRect(20, 20, 200, 25, 5).setScrollFactor(0);
        this.hpBar = this.add.graphics().setScrollFactor(0);
        this.uiText = this.add.text(20, 55, '', { fontSize: '20px', fontStyle: 'bold', fill: '#fff', stroke: '#000', strokeThickness: 2 }).setScrollFactor(0);

        // Entities
        this.enemies = this.physics.add.group();
        this.kunais = this.physics.add.group();
        this.spawnData = [];
        for (let i = 0; i < 40; i++) {
            this.spawnData.push({ x: 1200 + (i * 200), y: 500, type: Phaser.Math.Between(1, 2), spawned: false });
        }

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
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => this.scene.start('TitleScene'));
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
                const tex = this.textures.exists(`e${s.type}`) ? `e${s.type}` : null;
                let e = this.enemies.create(s.x, s.y, tex).setDisplaySize(55, 80);
                if (!tex) e.setTint(0xff0000);
                e.setVelocityX(-180);
                s.spawned = true;
            }
        });
    }

    drawHP() {
        this.hpBar.clear();
        const color = this.hp > 30 ? 0x00ff00 : 0xff0000;
        this.hpBar.fillStyle(color, 1);
        this.hpBar.fillRoundedRect(22, 22, (this.hp / 100) * 196, 21, 4);
    }

    fireKunai() {
        const tex = this.textures.exists('kunai') ? 'kunai' : null;
        let k = this.kunais.create(this.player.x, this.player.y, tex).setDisplaySize(35, 20);
        if (!tex) k.setTint(0xffff00);
        k.body.allowGravity = false;
        k.setVelocityX(this.player.flipX ? -1200 : 1200);
        if (this.player.flipX) k.setFlipX(true);
        this.physics.add.overlap(k, this.enemies, (kn, en) => { en.destroy(); kn.destroy(); this.score += 150; });
        this.time.delayedCall(1200, () => { if (k.active) k.destroy(); });
    }

    handleDamage(p, e) {
        if (p.isInvincible) return;
        this.hp -= 20;
        this.cameras.main.shake(150, 0.02);
        this.player.setTint(0xff0000);
        this.time.delayedCall(200, () => this.player.clearTint());
        e.destroy();
    }
}

const config = {
    type: Phaser.AUTO, width: 800, height: 600, parent: 'game-container',
    physics: { default: 'arcade', arcade: { gravity: { y: 1500 }, debug: false } },
    scene: [PreloadScene, TitleScene, SelectScene, GameScene]
};
new Phaser.Game(config);
