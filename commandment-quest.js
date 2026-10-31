(function () {
  const widgetId = "commandment-quest";
  const COMMANDMENTS = [
    { num: 1, text: "You shall have no other gods before Me.", ref: "Exodus 20:3", meaning: "Exclusive worship and adoration belong to the Creator alone." },
    { num: 2, text: "You shall not make for yourself a carved image.", ref: "Exodus 20:4", meaning: "God is Spirit; we must not reduce Him to physical idols." },
    { num: 3, text: "You shall not take the name of the LORD your God in vain.", ref: "Exodus 20:7", meaning: "Revering God's holy character, word, and name in all speech." },
    { num: 4, text: "Remember the Sabbath day, to keep it holy.", ref: "Exodus 20:8", meaning: "Setting aside dedicated sacred rest and worship unto the Lord." },
    { num: 5, text: "Honor your father and your mother.", ref: "Exodus 20:12", meaning: "Respecting parental guidance and divine authority in the family." },
    { num: 6, text: "You shall not murder.", ref: "Exodus 20:13", meaning: "Protecting the sanctity of human life made in the image of God." },
    { num: 7, text: "You shall not commit adultery.", ref: "Exodus 20:14", meaning: "Guarding covenant fidelity and moral purity in holy matrimony." },
    { num: 8, text: "You shall not steal.", ref: "Exodus 20:15", meaning: "Honoring the property, labor, and provisions of others." },
    { num: 9, text: "You shall not bear false witness against your neighbor.", ref: "Exodus 20:16", meaning: "Speaking pure truth, rejecting slander, deceit, and lies." },
    { num: 10, text: "You shall not covet.", ref: "Exodus 20:17", meaning: "Cultivating godly contentment, rejecting greedy desires." }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Commandments Quest",
    iconSvg: `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>`,
    mount(container, onScoreUpdate) {
      let idx = 0;
      let score = 0;

      const render = () => {
        if (idx >= COMMANDMENTS.length) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">Decalogue Mastered!</h2>
              <p style="font-size:20px;">You have inscribed the holy Law upon your heart! Score: ${score} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartCmd">Study Again</button>
            </div>
          `;
          container.querySelector('#restartCmd').onclick = () => { idx = 0; score = 0; onScoreUpdate(0); render(); };
          return;
        }

        const c = COMMANDMENTS[idx];
        container.innerHTML = `
          <div style="padding:20px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px;">
            <div class="md3-card">
              <h3 class="card-title">Commandment ${c.num} (${c.ref})</h3>
              <p class="card-text" style="font-size:21px;font-weight:700;">"${c.text}"</p>
              <p class="card-text" style="color:#DF1E5A;margin-top:10px;">${c.meaning}</p>
            </div>
            <button class="md3-btn md3-btn-primary" id="reciteCmdBtn">Inscribe Upon My Heart</button>
          </div>
        `;

        container.querySelector('#reciteCmdBtn').onclick = () => {
          score += 20;
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