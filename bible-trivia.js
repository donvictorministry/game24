(function () {
  const widgetId = "bible-trivia";
  const TRIVIA_QUESTIONS = [
    { cat: "Pentateuch", q: "On which mountain did God deliver the Ten Commandments to Moses?", opts: ["Mount Carmel", "Mount Sinai", "Mount Hermon", "Mount Ararat"], ans: 1 },
    { cat: "Pentateuch", q: "How many people were aboard Noah's ark during the great deluge?", opts: ["4", "6", "8", "12"], ans: 2 },
    { cat: "Historical", q: "Which judge defeated Midian with only 300 men holding trumpets and torches?", opts: ["Samson", "Gideon", "Jephthah", "Barak"], ans: 1 },
    { cat: "Historical", q: "Who was the first anointed king of the United Kingdom of Israel?", opts: ["David", "Saul", "Solomon", "Rehoboam"], ans: 1 },
    { cat: "Prophets", q: "Which prophet confronted King Ahab on Mount Carmel regarding Baal?", opts: ["Elisha", "Elijah", "Jeremiah", "Amos"], ans: 1 },
    { cat: "Prophets", q: "Which prophet spent three days and three nights in the belly of a great fish?", opts: ["Jonah", "Joel", "Micah", "Hosea"], ans: 0 },
    { cat: "Gospels", q: "In what town was our Lord Jesus Christ born according to Micah's prophecy?", opts: ["Nazareth", "Bethlehem", "Jerusalem", "Capernaum"], ans: 1 },
    { cat: "Gospels", q: "Who baptized Jesus in the Jordan River, declaring 'Behold the Lamb of God'?", opts: ["Peter", "John the Baptist", "James", "Nicodemus"], ans: 1 },
    { cat: "Epistles", q: "Which apostle authored the epistle to the Romans and Galatians?", opts: ["Peter", "Paul", "John", "Jude"], ans: 1 },
    { cat: "Epistles", q: "What is the primary theme expounded across the Epistle to the Hebrews?", opts: ["The superiority and supremacy of Christ", "Temple tax collection", "Genealogical records", "Military conquests"], ans: 0 }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Bible Trivia Challenge",
    iconSvg: `<path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>`,
    mount(container, onScoreUpdate) {
      let qIdx = 0;
      let score = 0;
      let lives = 3;

      const render = () => {
        if (qIdx >= TRIVIA_QUESTIONS.length || lives <= 0) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">${lives > 0 ? "Trivia Triumph!" : "Challenge Finished"}</h2>
              <p style="font-size:20px;">Final Score: ${score} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartTrivia">Play Again</button>
            </div>
          `;
          container.querySelector('#restartTrivia').onclick = () => { qIdx = 0; score = 0; lives = 3; onScoreUpdate(0); render(); };
          return;
        }

        const q = TRIVIA_QUESTIONS[qIdx];
        container.innerHTML = `
          <div style="padding:20px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px;">
            <div class="md3-card">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="color:#DF1E5A;font-weight:700;">${q.cat}</span>
                <span style="color:#B3261E;font-weight:700;">Lives: ${lives}</span>
              </div>
              <h3 class="card-title">Question ${qIdx + 1} of ${TRIVIA_QUESTIONS.length}</h3>
              <p class="card-text">${q.q}</p>
            </div>
            <div id="triviaChoicesList" style="display:flex;flex-direction:column;gap:12px;"></div>
          </div>
        `;

        const listDiv = container.querySelector('#triviaChoicesList');
        q.opts.forEach((choice, i) => {
          const btn = document.createElement('button');
          btn.className = 'md3-btn md3-btn-secondary';
          btn.textContent = choice;
          btn.onclick = () => {
            listDiv.querySelectorAll('button').forEach(b => b.disabled = true);
            if (i === q.ans) {
              btn.style.backgroundColor = '#146C2E';
              btn.style.color = '#FFFFFF';
              score += 20;
              onScoreUpdate(score);
            } else {
              btn.style.backgroundColor = '#B3261E';
              btn.style.color = '#FFFFFF';
              listDiv.children[q.ans].style.backgroundColor = '#146C2E';
              listDiv.children[q.ans].style.color = '#FFFFFF';
              lives--;
            }
            setTimeout(() => { qIdx++; render(); }, 1100);
          };
          listDiv.appendChild(btn);
        });
      };

      render();
    },
    destroy() {}
  });
})();