/* MODULE: REAL 3D NEON DICE (THREE.JS) */
(function init3DDice() {
    console.log("🎲 3D Dice Engine Loading...");
    const container = document.getElementById("game-dice2");
    if (!container) return;

    container.innerHTML = `
        <div class="action-box" style="text-align:center;">
            <h2 style="color:var(--neon-blue);">🎲 3D Cyber Neon Dice</h2>
            <p style="font-size:11px; color:#94a3b8;">Predict Under 4 or Over 3 for 2X Coins!</p>
            
            <!-- 3D CANVAS CONTAINER -->
            <div id="dice3dCanvas" style="width:100%; height:180px; background:#050811; border-radius:12px; margin:10px 0; border:1px solid #1e293b;"></div>

            <input type="number" id="dice3dBet" value="200" style="padding:10px; width:60%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; margin-bottom:12px;">
            <br>
            <button onclick="window.roll3DDice('UNDER')" style="padding:12px 20px; background:#ef4444; color:#fff; font-weight:800; border:none; border-radius:8px; margin:4px; cursor:pointer;">UNDER 4 (2X)</button>
            <button onclick="window.roll3DDice('OVER')" style="padding:12px 20px; background:var(--neon-green); color:#fff; font-weight:800; border:none; border-radius:8px; margin:4px; cursor:pointer;">OVER 3 (2X)</button>
        </div>
    `;

    // Three.js Setup
    const canvasDiv = document.getElementById("dice3dCanvas");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvasDiv.clientWidth / 180, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(canvasDiv.clientWidth, 180);
    canvasDiv.appendChild(renderer.domElement);

    // 3D Cube Geometry with Neon Wireframe
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0x00E5FF, wireframe: false, shininess: 100 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Wireframe Outer Glow
    const wireGeo = new THREE.WireframeGeometry(geometry);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    cube.add(wireframe);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    // Render Loop
    let isRolling = false;
    function animate() {
        requestAnimationFrame(animate);
        if (isRolling) {
            cube.rotation.x += 0.25;
            cube.rotation.y += 0.2;
        } else {
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.008;
        }
        renderer.render(scene, camera);
    }
    animate();

    // Roll Function
    window.roll3DDice = function(choice) {
        const bet = Number(document.getElementById("dice3dBet").value) || 200;
        if (window.game.balance < bet) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        window.game.balance -= bet;
        window.updateBalance();

        isRolling = true;

        setTimeout(() => {
            isRolling = false;
            const result = Math.floor(Math.random() * 6) + 1;
            
            // Set 3D Angle according to result
            if(result === 1) { cube.rotation.set(0, 0, 0); }
            else if(result === 6) { cube.rotation.set(Math.PI, 0, 0); }
            else if(result === 3) { cube.rotation.set(0, Math.PI / 2, 0); }
            else { cube.rotation.set(Math.PI / 4, Math.PI / 4, 0); }

            let win = false;
            if (choice === 'UNDER' && result <= 3) win = true;
            if (choice === 'OVER' && result >= 4) win = true;

            if (win) {
                const won = bet * 2;
                window.game.balance += won;
                window.addXP(60);
                window.showCasinoModal(true, `3D Dice Result: ${result}`, "₹" + won, "🎲");
            } else {
                window.showCasinoModal(false, `3D Dice Result: ${result}`, "₹" + bet, "🎲");
            }
            
            window.updateBalance();
            window.saveGame();
        }, 1200);
    };
})();
                                                 
