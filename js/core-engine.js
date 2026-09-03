/* DEVICE FINGERPRINTING & STRICT TIER ENFORCER */
(function() {
    // Canvas & Browser Hardware Fingerprint Generator
    function generateDeviceFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText("RWIN_VIP_CASINO_2026", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("RWIN_VIP_CASINO_2026", 4, 17);
        
        const b64 = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < b64.length; i++) {
            const char = b64.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return "DEV_" + Math.abs(hash) + "_" + navigator.hardwareConcurrency + "_" + screen.width;
    }

    const deviceId = generateDeviceFingerprint();
    localStorage.setItem("rwin_device_id", deviceId);

    window.CasinoSession = {
        getTier: function() {
            return localStorage.getItem("rwin_membership_tier") || "free";
        },
        getDeviceId: function() {
            return deviceId;
        },
        canResetCoins: function() {
            const tier = this.getTier();
            // Free Tier = 0 Resets strictly allowed
            return tier === "basic" || tier === "vip";
        },
        resetCoins: function() {
            if (!this.canResetCoins()) {
                window.showCasinoModal(
                    false, 
                    "🔒 VIP Pass Required", 
                    "Coin Resets are strictly locked for Free Devices. Buy ₹9/₹49/₹99 (20 Games) or ₹200 VIP Pass (70+ Games) to unlock unlimited resets!", 
                    "⛔"
                );
                return false;
            }
            window.game.balance = 10000;
            window.updateBalance();
            window.saveGame();
            if (window.CasinoAudio) window.CasinoAudio.playWin();
            window.showCasinoModal(true, "Coins Reset Success!", "₹10,000 Refilled", "🔄");
            return true;
        }
    };
})();
            
              
