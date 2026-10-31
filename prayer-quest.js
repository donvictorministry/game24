(function () {
  const widgetId = "prayer-quest";
  const SCENARIOS = [
    { text: "Your employer directs you to alter financial numbers to conceal a mistake. Scripture advises:", options: ["Comply quietly to protect your salary", "Stand firm in truthful integrity before God", "Pass the task to an unsuspecting coworker", "Report anonymously without praying"], correct: 1, verse: "Proverbs 11:1 - Dishonest scales are an abomination to the LORD." },
    { text: "A close friend bitterly betrays your confidence in public. What prayer posture does Jesus instruct?", options: ["Pray for vengeance and retribution", "Bless them and pray for their spiritual restoration", "Cut off all communication permanently", "Retaliate with equal public exposure"], correct: 1, verse: "Luke 6:28 - Bless those who curse you, pray for those who mistreat you." },
    { text: "Experiencing deep anxiety regarding future provision, how should your heart petition God?", options: ["Worry anxiously until a breakthrough comes", "With prayer, petition, and thanksgiving, make requests known", "Cease praying because God already knows everything", "Depend exclusively on secular loans"], correct: 1, verse: "Philippians 4:6 - In everything by prayer and supplication with thanksgiving let your requests be made known to God." },
    { text: "When struggling with persistent unforgiveness toward an offending parent, God calls you to:", options: ["Wait until the parent apologizes completely", "Forgive freely as God in Christ forgave you", "Harbor the grievance silently", "Excuse the sin as trivial without forgiving"], correct: 1, verse: "Ephesians 4:32 - Forgiving one another, just as God in Christ forgave you." },
    { text: "You observe systemic injustice harming vulnerable people in your community. Biblical prayer leads to:", options: ["Passive withdrawal from public concern", "Intercession coupled with doing justice and loving mercy", "Violent opposition outside the law", "Complaining about leadership on social media"], correct: 1, verse: "Micah 6:8 - He has shown you, O mortal, what is good: To act justly and to love mercy and to walk humbly with your God." },
    { text: "Temptation urges you to compromise your moral purity to fit in with peers. How do you pray?", options: ["Claim God's promise that a way of escape is provided", "Yield now and repent later next Sunday", "Blame your circumstances on God", "Isolate completely from society"], correct: 0, verse: "1 Corinthians 10:13 - God is faithful; he will not let you be tempted beyond what you can bear." },
    { text: "A family member hardened against the Gospel mocks your faith. What is the biblical intercession?", options: ["Argue bitterly until they submit", "Ask the Father to draw them by the Holy Spirit", "Abandon them as unreachable", "Pray for God to strike them with judgment"], correct: 1, verse: "John 6:44 - No one can come to me unless the Father who sent me draws them." },
    { text: "Facing religious hostility for confessing Christ at your university or workplace, what was the apostles' prayer?", options: ["Pray for divine escape from preaching", "Pray for supernatural boldness to continue speaking truth", "Curse the authorities", "Conceal all Christian identification"], correct: 1, verse: "Acts 4:29 - Enable your servants to speak your word with great boldness." },
    { text: "You feel completely inadequate and unequipped for a ministry calling. You pray for:", options: ["God to call someone else more talented", "His grace and power, which is made perfect in weakness", "Immediate worldly recognition", "Validation from social status"], correct: 1, verse: "2 Corinthians 12:9 - My grace is sufficient for you, for my power is made perfect in weakness." },
    { text: "During a season of spiritual dryness where God feels distant, the Psalmist models:", options: ["Giving up prayer entirely", "Panting after God as the deer pants for streams of water", "Chasing sensory emotionalism", "Assuming God has permanently departed"], correct: 1, verse: "Psalm 42:1-2 - As the deer pants for streams of water, so my soul pants for you, my God." }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Prayer Quest",
    iconSvg: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>`,
    mount(container, onScoreUpdate) {
      let currentIdx = 0;
      let totalScore = 0;

      const render = () => {
        if (currentIdx >= SCENARIOS.length) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">Quest Complete!</h2>
              <p style="font-size:20px;">You have walked through 10 scriptural prayers. Final Score: ${totalScore} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartQuest">Embark Again</button>
            </div>
          `;
          container.querySelector('#restartQuest').onclick = () => { currentIdx = 0; totalScore = 0; onScoreUpdate(0); render(); };
          return;
        }

        const item = SCENARIOS[currentIdx];
        container.innerHTML = `
          <div style="padding:20px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px;">
            <div class="md3-card">
              <h3 class="card-title">Quest Dilemma ${currentIdx + 1} of ${SCENARIOS.length}</h3>
              <p class="card-text">${item.text}</p>
            </div>
            <div id="questOptionsBox" style="display:flex;flex-direction:column;gap:12px;"></div>
            <div id="questFeedback" class="md3-card" style="display:none;background:rgba(223,30,90,0.08);border-color:#DF1E5A;">
              <h3 class="card-title" style="font-size:20px;">Biblical Verdict</h3>
              <p class="card-text" id="questFeedbackText"></p>
            </div>
          </div>
        `;

        const box = container.querySelector('#questOptionsBox');
        item.options.forEach((optText, idx) => {
          const btn = document.createElement('button');
          btn.className = 'md3-btn md3-btn-secondary';
          btn.textContent = optText;
          btn.onclick = () => {
            box.querySelectorAll('button').forEach(b => b.disabled = true);
            const feedback = container.querySelector('#questFeedback');
            const feedbackText = container.querySelector('#questFeedbackText');
            if (idx === item.correct) {
              btn.style.backgroundColor = '#146C2E';
              btn.style.color = '#FFFFFF';
              totalScore += 20;
              onScoreUpdate(totalScore);
            } else {
              btn.style.backgroundColor = '#B3261E';
              btn.style.color = '#FFFFFF';
              box.children[item.correct].style.backgroundColor = '#146C2E';
              box.children[item.correct].style.color = '#FFFFFF';
            }
            feedbackText.textContent = item.verse;
            feedback.style.display = 'block';
            setTimeout(() => { currentIdx++; render(); }, 2800);
          };
          box.appendChild(btn);
        });
      };

      render();
    },
    destroy() {}
  });
})();