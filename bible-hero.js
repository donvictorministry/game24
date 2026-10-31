(function () {
  const widgetId = "bible-hero";
  const HERO_DATA = [
    {
      name: "David the King",
      battles: [
        { enemy: "Goliath of Gath", question: "With what weapon did David openly confront the blaspheming giant?", choices: ["A royal chariot", "The name of the LORD of Hosts with a sling", "Saul's bronze armor", "A mercenary army"], ans: 1 },
        { enemy: "The Lion & Bear", question: "Who delivered David when he defended his father's flock?", choices: ["His own sharp wits", "The LORD who delivers from the paw of the beasts", "Saul's spearmen", "Local hunters"], ans: 1 },
        { enemy: "Fugitive Cave of Adullam", question: "How did David treat King Saul when he had the chance to take his life?", choices: ["He struck Saul immediately", "He spared the LORD's anointed", "He betrayed Israel to Moab", "He seized the crown by force"], ans: 1 }
      ]
    },
    {
      name: "Esther the Queen",
      battles: [
        { enemy: "Haman's Deadly Edict", question: "What bold spiritual discipline did Esther commission before approaching the king?", choices: ["Three days of fasting and prayer", "Bribery of the palace guards", "Military rebellion", "Fleeing into the provinces"], ans: 0 },
        { enemy: "The Golden Scepter", question: "What words expressed Esther's resolute surrender to God's providence?", choices: ["'I will survive at any cost'", "'If I perish, I perish'", "'The law is too harsh'", "'I demand an audience'"], ans: 1 },
        { enemy: "The Royal Banquet", question: "How was Haman's wicked conspiracy exposed?", choices: ["Through Esther's courageous revelation to King Ahasuerus", "A palace servant's gossip", "An accidental discovery", "A foreign invasion"], ans: 0 }
      ]
    },
    {
      name: "Daniel the Prophet",
      battles: [
        { enemy: "Babylonian Royal Defilement", question: "Why did Daniel resolve not to defile himself with the king's royal food?", choices: ["He preferred vegetarian diets", "To honor God's holy dietary covenants", "He was staging a protest", "The food tasted poor"], ans: 1 },
        { enemy: "The King's Forgotten Dream", question: "Where did Daniel turn when Nebuchadnezzar ordered the execution of the wise men?", choices: ["He pleaded with God in heaven for mystery and mercy", "He tried to invent a story", "He fled to Egypt", "He bribed Arioch"], ans: 0 },
        { enemy: "The Den of Lions", question: "Why was Daniel found completely unharmed the morning after being cast to the lions?", choices: ["He fought the lions", "God sent His angel and shut the lions' mouths", "The lions were sleeping", "Darius secretly fed them"], ans: 1 }
      ]
    }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Bible Hero Arena",
    iconSvg: `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>`,
    mount(container, onScoreUpdate) {
      let heroIdx = 0;
      let battleIdx = 0;
      let score = 0;

      const render = () => {
        if (heroIdx >= HERO_DATA.length) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">Arena Victor!</h2>
              <p style="font-size:20px;">You have conquered all hero encounters through biblical truth! Score: ${score} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartArenaBtn">Battle Again</button>
            </div>
          `;
          container.querySelector('#restartArenaBtn').onclick = () => { heroIdx = 0; battleIdx = 0; score = 0; onScoreUpdate(0); render(); };
          return;
        }

        const hero = HERO_DATA[heroIdx];
        const battle = hero.battles[battleIdx];

        container.innerHTML = `
          <div style="padding:20px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px;">
            <div class="md3-card">
              <h3 class="card-title">${hero.name}</h3>
              <p class="card-text" style="color:#DF1E5A;font-weight:700;">Challenge: ${battle.enemy}</p>
              <p class="card-text">${battle.question}</p>
            </div>
            <div id="heroBattleChoices" style="display:flex;flex-direction:column;gap:12px;"></div>
          </div>
        `;

        const choicesDiv = container.querySelector('#heroBattleChoices');
        battle.choices.forEach((text, i) => {
          const btn = document.createElement('button');
          btn.className = 'md3-btn md3-btn-secondary';
          btn.textContent = text;
          btn.onclick = () => {
            choicesDiv.querySelectorAll('button').forEach(b => b.disabled = true);
            if (i === battle.ans) {
              btn.style.backgroundColor = '#146C2E';
              btn.style.color = '#FFFFFF';
              score += 25;
              onScoreUpdate(score);
            } else {
              btn.style.backgroundColor = '#B3261E';
              btn.style.color = '#FFFFFF';
              choicesDiv.children[battle.ans].style.backgroundColor = '#146C2E';
              choicesDiv.children[battle.ans].style.color = '#FFFFFF';
            }
            setTimeout(() => {
              battleIdx++;
              if (battleIdx >= hero.battles.length) {
                battleIdx = 0;
                heroIdx++;
              }
              render();
            }, 1200);
          };
          choicesDiv.appendChild(btn);
        });
      };

      render();
    },
    destroy() {}
  });
})();