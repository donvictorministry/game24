(function () {
  const widgetId = "scripture-memory";
  const VERSES = [
    { ref: "John 3:16", text: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.", missing: "begotten", choices: ["begotten", "earthly", "distant", "mortal"] },
    { ref: "Romans 8:28", text: "And we know that all things work together for good to those who love God, to those who are the called according to His purpose.", missing: "purpose", choices: ["wealth", "purpose", "reputation", "leisure"] },
    { ref: "Proverbs 3:5", text: "Trust in the LORD with all your heart, and lean not on your own understanding.", missing: "heart", choices: ["might", "heart", "doubt", "pride"] },
    { ref: "Philippians 4:13", text: "I can do all things through Christ who strengthens me.", missing: "strengthens", choices: ["praises", "strengthens", "judges", "ignores"] },
    { ref: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want.", missing: "shepherd", choices: ["critic", "shepherd", "spectator", "general"] },
    { ref: "Ephesians 2:8", text: "For by grace you have been saved through faith, and that not of yourselves; it is the gift of God.", missing: "grace", choices: ["works", "grace", "tradition", "lineage"] },
    { ref: "Joshua 1:9", text: "Have I not commanded you? Be strong and of good courage; do not be afraid, nor be dismayed, for the LORD your God is with you wherever you go.", missing: "courage", choices: ["fear", "courage", "sorrow", "pride"] },
    { ref: "Galatians 5:22", text: "But the fruit of the Spirit is love, joy, peace, longsuffering, kindness, goodness, faithfulness.", missing: "faithfulness", choices: ["envy", "faithfulness", "ambition", "wrath"] },
    { ref: "Hebrews 11:1", text: "Now faith is the substance of things hoped for, the evidence of things not seen.", missing: "evidence", choices: ["doubt", "evidence", "confusion", "illusion"] },
    { ref: "2 Timothy 3:16", text: "All Scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness.", missing: "profitable", choices: ["optional", "profitable", "burdensome", "temporary"] }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Scripture Memory",
    iconSvg: `<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>`,
    mount(container, onScoreUpdate) {
      let vIdx = 0;
      let score = 0;

      const render = () => {
        if (vIdx >= VERSES.length) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">Memory Master!</h2>
              <p style="font-size:20px;">You have committed key scriptures to the tablet of your heart! Score: ${score} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartMem">Memorize Again</button>
            </div>
          `;
          container.querySelector('#restartMem').onclick = () => { vIdx = 0; score = 0; onScoreUpdate(0); render(); };
          return;
        }

        const v = VERSES[vIdx];
        const blankedText = v.text.replace(v.missing, "_____");

        container.innerHTML = `
          <div style="padding:20px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px;">
            <div class="md3-card">
              <h3 class="card-title">${v.ref}</h3>
              <p class="card-text" style="font-size:21px;font-style:italic;">"${blankedText}"</p>
              <p class="card-text" style="color:#DF1E5A;font-weight:700;margin-top:12px;">Select the missing scripture word:</p>
            </div>
            <div id="memWordChoices" style="display:flex;flex-direction:column;gap:12px;"></div>
          </div>
        `;

        const choicesDiv = container.querySelector('#memWordChoices');
        v.choices.forEach((choice) => {
          const btn = document.createElement('button');
          btn.className = 'md3-btn md3-btn-secondary';
          btn.textContent = choice;
          btn.onclick = () => {
            choicesDiv.querySelectorAll('button').forEach(b => b.disabled = true);
            if (choice === v.missing) {
              btn.style.backgroundColor = '#146C2E';
              btn.style.color = '#FFFFFF';
              score += 20;
              onScoreUpdate(score);
            } else {
              btn.style.backgroundColor = '#B3261E';
              btn.style.color = '#FFFFFF';
            }
            setTimeout(() => { vIdx++; render(); }, 1100);
          };
          choicesDiv.appendChild(btn);
        });
      };

      render();
    },
    destroy() {}
  });
})();