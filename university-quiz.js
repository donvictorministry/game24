(function () {
  const widgetId = "university-quiz";
  const SCHOLAR_QUESTIONS = [
    { q: "In which epistle does Paul establish justification by faith using Abraham as the prototype?", opts: ["Galatians", "Romans", "Ephesians", "Colossians"], ans: 1, verse: "Romans 4:3", vText: "Abraham believed God, and it was credited to him as righteousness." },
    { q: "The translation of the Hebrew Scriptures into Greek (Septuagint) occurred during which period?", opts: ["Persian", "Hellenistic", "Roman", "Byzantine"], ans: 1, verse: "Colossians 4:16", vText: "The Septuagint bridged the Old Testament into the Greco-Roman world." },
    { q: "The theological term 'Hypostatic Union' specifically defines which orthodox Christological doctrine?", opts: ["The Trinity", "Christ's two complete natures in one divine person", "Christ's ascension", "The resurrection body"], ans: 1, verse: "Colossians 2:9", vText: "In Christ all the fullness of the Deity lives in bodily form." },
    { q: "Which church council formally ratified the 27 books of the New Testament canon in AD 397?", opts: ["Council of Nicaea", "Council of Carthage", "Council of Chalcedon", "Council of Ephesus"], ans: 1, verse: "2 Timothy 3:16", vText: "All Scripture is God-breathed and profitable for doctrine." },
    { q: "In Isaiah 53, which Hebrew term designates the 'Suffering Servant' who justifies many?", opts: ["Mashiach", "Eved", "Nagid", "Kohen"], ans: 1, verse: "Isaiah 53:11", vText: "By his knowledge my righteous servant (Eved) will justify many." }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "University Bible Quiz",
    iconSvg: `<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>`,
    mount(container, onScoreUpdate) {
      let qIdx = 0;
      let score = 0;

      const render = () => {
        if (qIdx >= SCHOLAR_QUESTIONS.length) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">Academic Laurels!</h2>
              <p style="font-size:20px;">You completed the University Theological Examination. Score: ${score} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartUnivQuiz">Retake Exam</button>
            </div>
          `;
          container.querySelector('#restartUnivQuiz').onclick = () => { qIdx = 0; score = 0; onScoreUpdate(0); render(); };
          return;
        }

        const q = SCHOLAR_QUESTIONS[qIdx];
        container.innerHTML = `
          <div style="padding:20px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px;">
            <div class="md3-card">
              <h3 class="card-title">Question ${qIdx + 1} of ${SCHOLAR_QUESTIONS.length}</h3>
              <p class="card-text">${q.q}</p>
            </div>
            <div id="univChoicesList" style="display:flex;flex-direction:column;gap:12px;"></div>

            <!-- 3-Second Auto Popup Modal for Scripture Verification -->
            <div id="univVersePopup" class="md3-card" style="display:none;background:rgba(223,30,90,0.1);border:2px solid #DF1E5A;text-align:center;">
              <h4 style="font-size:20px;font-weight:700;color:#DF1E5A;" id="univVerseRef"></h4>
              <p class="card-text" id="univVerseText" style="font-style:italic;margin-top:4px;"></p>
            </div>
          </div>
        `;

        const choicesDiv = container.querySelector('#univChoicesList');
        const popup = container.querySelector('#univVersePopup');
        const popupRef = container.querySelector('#univVerseRef');
        const popupText = container.querySelector('#univVerseText');

        q.opts.forEach((optText, i) => {
          const btn = document.createElement('button');
          btn.className = 'md3-btn md3-btn-secondary';
          btn.textContent = optText;
          btn.onclick = () => {
            choicesDiv.querySelectorAll('button').forEach(b => b.disabled = true);
            if (i === q.ans) {
              btn.style.backgroundColor = '#146C2E';
              btn.style.color = '#FFFFFF';
              score += 50;
              onScoreUpdate(score);
            } else {
              btn.style.backgroundColor = '#B3261E';
              btn.style.color = '#FFFFFF';
              choicesDiv.children[q.ans].style.backgroundColor = '#146C2E';
              choicesDiv.children[q.ans].style.color = '#FFFFFF';
            }

            // Display 3-Second Auto-Advancing Verse Popup Modal
            popupRef.textContent = q.verse;
            popupText.textContent = `"${q.vText}"`;
            popup.style.display = 'block';

            setTimeout(() => {
              qIdx++;
              render();
            }, 3000);
          };
          choicesDiv.appendChild(btn);
        });
      };

      render();
    },
    destroy() {}
  });
})();