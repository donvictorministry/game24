(function () {
  const widgetId = "prophet-timeline";
  const PROPHETS = [
    { name: "Elijah", era: "9th Century BC", theme: "Confronted Ahab, defeated the 450 prophets of Baal on Mount Carmel." },
    { name: "Elisha", era: "9th Century BC", theme: "Asked for a double portion of the Spirit, performed miracles of grace." },
    { name: "Jonah", era: "8th Century BC", theme: "Sent to call the brutal Assyrian city of Nineveh to repentance." },
    { name: "Amos", era: "8th Century BC", theme: "A shepherd who called for justice to roll down like waters." },
    { name: "Hosea", era: "8th Century BC", theme: "His covenant marriage mirrored God's faithful love to unfaithful Israel." },
    { name: "Isaiah", era: "8th Century BC", theme: "Prophesied the virgin birth and the Suffering Servant in Isaiah 53." },
    { name: "Micah", era: "8th Century BC", theme: "Foretold the Messiah's birth in the humble town of Bethlehem." },
    { name: "Jeremiah", era: "7th Century BC", theme: "The weeping prophet who proclaimed the coming New Covenant." },
    { name: "Ezekiel", era: "6th Century BC", theme: "Saw visions of God's glory in Babylon and the valley of dry bones." },
    { name: "Daniel", era: "6th Century BC", theme: "Revealed God's everlasting Kingdom conquering worldly empires." }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Prophets Timeline",
    iconSvg: `<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>`,
    mount(container, onScoreUpdate) {
      let idx = 0;
      let score = 0;

      const render = () => {
        if (idx >= PROPHETS.length) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">Prophetic Era Mastered!</h2>
              <p style="font-size:20px;">You have walked through the prophetic timeline. Score: ${score} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartProphets">Traverse Again</button>
            </div>
          `;
          container.querySelector('#restartProphets').onclick = () => { idx = 0; score = 0; onScoreUpdate(0); render(); };
          return;
        }

        const p = PROPHETS[idx];
        container.innerHTML = `
          <div style="padding:20px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px;">
            <div class="md3-card">
              <div style="color:#DF1E5A;font-weight:700;">Epoch ${idx + 1} of ${PROPHETS.length} (${p.era})</div>
              <h3 class="card-title" style="margin-top:6px;">${p.name}</h3>
              <p class="card-text">${p.theme}</p>
            </div>
            <button class="md3-btn md3-btn-primary" id="studyProphetBtn">Advance Prophetic Timeline</button>
          </div>
        `;

        container.querySelector('#studyProphetBtn').onclick = () => {
          score += 25;
          onScoreUpdate(score);
          idx++;
          render();
        };
      };

      render();
    },
    destroy() {}
  });
})();