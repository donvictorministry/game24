(function () {
  const widgetId = "faith-runner";
  let isRunning = false;
  let score = 0;
  let health = 100;
  let playerLane = 1; // 0: Left, 1: Center, 2: Right
  let currentStage = 1;
  let spawnTimer = null;
  let gameTick = null;

  const STAGES = [
    { name: "Jerusalem Gates", speed: 32, targetScore: 100 },
    { name: "Wilderness of Temptation", speed: 28, targetScore: 250 },
    { name: "Jordan River Crossing", speed: 24, targetScore: 450 },
    { name: "Walls of Jericho", speed: 20, targetScore: 700 },
    { name: "The Promised Land", speed: 16, targetScore: 1000 }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Faith Runner",
    iconSvg: `<path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z"/>`,
    mount(container, onScoreUpdate) {
      isRunning = true;
      score = 0;
      health = 100;
      playerLane = 1;
      currentStage = 0;

      container.innerHTML = `
        <style>
          .runner-viewport { width:100%; height:100%; position:relative; overflow:hidden; background:linear-gradient(180deg, #1E1E1E 0%, #121212 100%); display:flex; flex-direction:column; }
          .runner-hud { height:56px; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:space-between; padding:0 16px; border-bottom:1px solid #333; z-index:10; }
          .runner-hud-text { font-size:19px; font-weight:700; color:#DF1E5A; }
          .runner-field { flex:1; position:relative; width:100%; overflow:hidden; }
          .runner-lanes { display:flex; width:100%; height:100%; position:absolute; inset:0; }
          .runner-lane-track { flex:1; border-right:1px dashed #333333; position:relative; }
          .runner-lane-track:last-child { border-right:none; }
          .runner-character { position:absolute; bottom:30px; width:64px; height:64px; background:#DF1E5A; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:left 0.12s cubic-bezier(0.2,0,0,1); z-index:20; }
          .runner-character svg { width:36px; height:36px; fill:#FFFFFF; }
          .runner-drop-item { position:absolute; width:52px; height:52px; border-radius:18px; display:flex; align-items:center; justify-content:center; z-index:15; }
          .runner-drop-item svg { width:32px; height:32px; fill:#FFFFFF; }
          .item-blessing { background:#146C2E; }
          .item-hazard { background:#B3261E; }
          .runner-controls { height:84px; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:space-between; padding:0 24px; z-index:30; }
          .runner-touch-btn { width:80px; height:64px; border-radius:32px; border:none; background:#DF1E5A; color:#FFFFFF; display:flex; align-items:center; justify-content:center; cursor:pointer; }
          .runner-touch-btn svg { width:36px; height:36px; fill:#FFFFFF; }
        </style>
        <div class="runner-viewport" id="runnerArena">
          <div class="runner-hud">
            <span class="runner-hud-text" id="runnerStageName">Stage: Jerusalem</span>
            <span class="runner-hud-text" id="runnerHealthDisplay">Faith: 100%</span>
          </div>
          <div class="runner-field" id="runnerField">
            <div class="runner-lanes">
              <div class="runner-lane-track"></div>
              <div class="runner-lane-track"></div>
              <div class="runner-lane-track"></div>
            </div>
            <div class="runner-character" id="runnerAvatar">
              <svg viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
            </div>
          </div>
          <div class="runner-controls">
            <button class="runner-touch-btn" id="runnerLeftArrow" aria-label="Move Left"><svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></button>
            <button class="runner-touch-btn" id="runnerRightArrow" aria-label="Move Right"><svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></button>
          </div>
        </div>
      `;

      const avatar = container.querySelector('#runnerAvatar');
      const field = container.querySelector('#runnerField');
      const stageNameEl = container.querySelector('#runnerStageName');
      const healthEl = container.querySelector('#runnerHealthDisplay');

      const updateAvatarPos = () => {
        const laneW = field.clientWidth / 3;
        avatar.style.left = `${playerLane * laneW + (laneW - 64) / 2}px`;
      };
      updateAvatarPos();

      container.querySelector('#runnerLeftArrow').onclick = () => {
        if (playerLane > 0) { playerLane--; updateAvatarPos(); }
      };
      container.querySelector('#runnerRightArrow').onclick = () => {
        if (playerLane < 2) { playerLane++; updateAvatarPos(); }
      };

      // Spawning loop
      const spawnItem = () => {
        if (!isRunning) return;
        const isHazard = Math.random() > 0.42;
        const lane = Math.floor(Math.random() * 3);
        const el = document.createElement('div');
        el.className = `runner-drop-item ${isHazard ? 'item-hazard' : 'item-blessing'}`;
        el.innerHTML = isHazard
          ? `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`
          : `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;

        const laneW = field.clientWidth / 3;
        el.style.left = `${lane * laneW + (laneW - 52) / 2}px`;
        field.appendChild(el);

        let topY = -60;
        const speed = STAGES[currentStage].speed;
        const fall = setInterval(() => {
          if (!isRunning || !el.parentNode) { clearInterval(fall); return; }
          topY += 9;
          el.style.top = `${topY}px`;

          const hitY = field.clientHeight - 110;
          if (topY >= hitY && topY <= hitY + 50 && lane === playerLane) {
            clearInterval(fall);
            el.remove();
            if (isHazard) {
              health = Math.max(0, health - 15);
              healthEl.textContent = `Faith: ${health}%`;
              if (health <= 0) {
                isRunning = false;
                container.innerHTML = `
                  <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
                    <h2 style="font-size:26px;color:#B3261E;">Trial Ended</h2>
                    <p style="font-size:20px;">You ran with perseverance. Score: ${score} PTS</p>
                    <button class="md3-btn md3-btn-primary" id="runnerRetryBtn">Run Again</button>
                  </div>
                `;
                container.querySelector('#runnerRetryBtn').onclick = () => window.FaithGamesCore.launch(widgetId);
              }
            } else {
              score += 25;
              onScoreUpdate(score);
              // Stage progression
              if (score >= STAGES[currentStage].targetScore && currentStage < STAGES.length - 1) {
                currentStage++;
                stageNameEl.textContent = `Stage: ${STAGES[currentStage].name}`;
              }
            }
          } else if (topY > field.clientHeight) {
            clearInterval(fall);
            el.remove();
          }
        }, speed);

        spawnTimer = setTimeout(spawnItem, 650 + Math.random() * 500);
      };

      spawnItem();
    },
    destroy() {
      isRunning = false;
      clearTimeout(spawnTimer);
      clearInterval(gameTick);
    }
  });
})();