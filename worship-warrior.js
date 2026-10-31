(function () {
  const widgetId = "worship-warrior";
  let audioCtx = null;

  const HYMNS = [
    { title: "Amazing Grace", notes: ["C4", "F4", "A4", "F4", "A4", "G4", "F4", "D4", "C4"] },
    { title: "Blessed Assurance", notes: ["C4", "E4", "G4", "C5", "B4", "A4", "G4", "E4"] },
    { title: "How Great Thou Art", notes: ["G4", "C5", "E5", "D5", "C5", "A4", "F4", "G4"] }
  ];

  const FREQ_MAP = {
    "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23,
    "G4": 392.00, "A4": 440.00, "B4": 493.88, "C5": 523.25,
    "D5": 587.33, "E5": 659.25
  };

  function playHarmonicTone(freq) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {}
  }

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Worship Warriors",
    iconSvg: `<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>`,
    mount(container, onScoreUpdate) {
      let hymnIdx = 0;
      let noteIdx = 0;
      let score = 0;

      const render = () => {
        if (hymnIdx >= HYMNS.length) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">Worship Ascended!</h2>
              <p style="font-size:20px;">You have harmonized across the hymns of faith. Score: ${score} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartHymnsBtn">Play Again</button>
            </div>
          `;
          container.querySelector('#restartHymnsBtn').onclick = () => { hymnIdx = 0; noteIdx = 0; score = 0; onScoreUpdate(0); render(); };
          return;
        }

        const hymn = HYMNS[hymnIdx];
        const targetNote = hymn.notes[noteIdx];

        container.innerHTML = `
          <div style="padding:20px;height:100%;display:flex;flex-direction:column;justify-content:space-between;text-align:center;">
            <div class="md3-card">
              <h3 class="card-title">${hymn.title}</h3>
              <p class="card-text">Target Note ${noteIdx + 1} of ${hymn.notes.length}</p>
              <div style="font-size:32px;font-weight:800;color:#DF1E5A;margin-top:8px;">${targetNote}</div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%;">
              <button class="md3-btn md3-btn-secondary note-trigger" data-note="C4">C4</button>
              <button class="md3-btn md3-btn-secondary note-trigger" data-note="D4">D4</button>
              <button class="md3-btn md3-btn-secondary note-trigger" data-note="E4">E4</button>
              <button class="md3-btn md3-btn-secondary note-trigger" data-note="F4">F4</button>
              <button class="md3-btn md3-btn-secondary note-trigger" data-note="G4">G4</button>
              <button class="md3-btn md3-btn-secondary note-trigger" data-note="A4">A4</button>
              <button class="md3-btn md3-btn-secondary note-trigger" data-note="B4">B4</button>
              <button class="md3-btn md3-btn-secondary note-trigger" data-note="C5">C5</button>
            </div>
          </div>
        `;

        container.querySelectorAll('.note-trigger').forEach((btn) => {
          btn.onclick = () => {
            const played = btn.getAttribute('data-note');
            if (FREQ_MAP[played]) playHarmonicTone(FREQ_MAP[played]);

            if (played === targetNote) {
              score += 15;
              onScoreUpdate(score);
              btn.style.backgroundColor = '#146C2E';
              btn.style.color = '#FFFFFF';
              setTimeout(() => {
                noteIdx++;
                if (noteIdx >= hymn.notes.length) {
                  noteIdx = 0;
                  hymnIdx++;
                }
                render();
              }, 250);
            } else {
              btn.style.backgroundColor = '#B3261E';
              btn.style.color = '#FFFFFF';
              setTimeout(() => {
                btn.style.backgroundColor = '';
                btn.style.color = '';
              }, 250);
            }
          };
        });
      };

      render();
    },
    destroy() {
      if (audioCtx) { audioCtx.close(); audioCtx = null; }
    }
  });
})();