/* CENTRAL CASINO ENGINE 3.0 - STRICT RULES & AUDIO FX */
(function() {
    console.log("⚡ RWIN Central Engine Initialized");

    // 1. WEB AUDIO API SOUND GENERATOR (Zero broken audio URLs)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    window.CasinoAudio = {
        playChip: function() {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        },
        playWin: function() {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(audioCtx.currentTime + i * 0.1);
                osc.stop(audioCtx.currentTime + i * 0.1 + 0.3);
            });
        },
        playTick: function() {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.03);
        }
    };

    // 2. MEMBERSHIP & COIN RESET RULE ENFORCER
    window.CasinoSession = {
        // Membership Tiers: 'free', 'basic' (₹9/49/99), 'vip' (₹200)
        getTier: function() {
            return localStorage.getItem("rwin_membership_tier") || "free";
        },
        
        canResetCoins: function() {
            const tier = this.getTier();
            return tier === "basic" || tier === "vip";
        },

        resetCoins: function() {
            if (!this.canResetCoins()) {
                window.showCasinoModal(false, "Membership Required!", "Coin Reset is locked for Free users. Buy ₹9, ₹49, ₹99 or ₹200 VIP plan to unlock unlimited resets.", "🔒");
                return false;
            }
            window.game.balance = 10000;
            window.updateBalance();
            window.saveGame();
            window.CasinoAudio.playWin();
            window.showCasinoModal(true, "Coins Reset Success!", "₹10,000 Refilled", "🔄");
            return true;
        }
    };

    // 3. PERIOD ID & WIN-GO TREND GENERATOR
    window.PeriodEngine = {
        getPeriodId: function() {
            const d = new Date();
            const dateStr = d.getFullYear().toString() + (d.getMonth()+1).toString().padStart(2,'0') + d.getDate().toString().padStart(2,'0');
            const totalSecs = (d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds();
            const periodIndex = Math.floor(totalSecs / 30);
            return dateStr + periodIndex.toString().padStart(4, '0');
        }
    };
})();
              
