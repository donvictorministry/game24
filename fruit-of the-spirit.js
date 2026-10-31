(function () {
  const widgetId = "fruit-of the-spirit";
  const FRUITS = [
    { name: "Love", verse: "1 Cor 13:4-7", desc: "Patient, kind, never boastful; the supernatural bond of Christian perfection." },
    { name: "Joy", verse: "Psalm 16:11", desc: "An abiding gladness rooted in God's unchanging presence, regardless of trial." },
    { name: "Peace", verse: "John 14:27", desc: "The tranquility of soul given by Christ which surpasses all understanding." },
    { name: "Patience", verse: "Romans 12:12", desc: "Steadfast forbearance in adversity, waiting upon the Lord without complaint." },
    { name: "Kindness", verse: "Titus 3:4", desc: "A tender, benevolent disposition reflecting God's kindness toward us in Christ." },
    { name: "Goodness", verse: "Psalm 23:6", desc: "Active moral integrity and generosity flowing from God's holy nature." },
    { name: "Faithfulness", verse: "Lam 3:22-23", desc: "Steadfast loyalty, dependability, and unswerving commitment to God's covenants." },
    { name: "Gentleness", verse: "Phil 4:5", desc: "Humble, meek strength under divine submission, refusing worldly arrogance." },
    { name: "Self-Control", verse: "Gal 5:23", desc: "Disciplining bodily passions and impulses through the power of the Holy Spirit." }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Fruit of the Spirit Garden",
    iconSvg: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>`,
    mount(container, onScoreUpdate) {
      let idx = 0;
      let score = 0;

      const render = () => {
        if (idx >= FRUITS.length) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">Spiritual Harvest!</h2>
              <p style="font-size:20px;">All nine fruits are flourishing in your heart! Score: ${score} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartGarden">Tend Garden Again</button>
            </div>
          `;
          container.querySelector('#restartGarden').onclick = () => { idx = 0; score = 0; onScoreUpdate(0); render(); };
          return;
        }

        const f = FRUITS[idx];
        container.innerHTML = `
          <div style="padding:20px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px;">
            <div class="md3-card">
              <div style="color:#DF1E5A;font-weight:700;">Galatians 5:22-23 (${f.verse})</div>
              <h3 class="card-title" style="margin-top:6px;">Fruit ${idx + 1}: ${f.name}</h3>
              <p class="card-text">${f.desc}</p>
            </div>
            <button class="md3-btn md3-btn-primary" id="waterFruitBtn">Water with Prayer & Cultivate</button>
          </div>
        `;

        container.querySelector('#waterFruitBtn').onclick = () => {
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