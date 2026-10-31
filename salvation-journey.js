(function () {
  const widgetId = "salvation-journey";
  const STATIONS = [
    { title: "1. The Creation Covenant", desc: "God created the heavens and earth in holiness, establishing man in His holy image.", test: "What was man's original mandate?", options: ["To worship creation", "To tend the garden and walk in fellowship with God", "To conquer other lands", "To build cities"], ans: 1 },
    { title: "2. The Fall of Humanity", desc: "Through disobedience, sin entered the world, and death through sin, severing man from God.", test: "What happened to all mankind in Adam?", options: ["Nothing spiritual", "All sinned and fell short of the glory of God", "Man became divine", "Death was abolished"], ans: 1 },
    { title: "3. The Law & Conviction", desc: "The holy Law of God was given through Moses to reveal God's holiness and expose our utter guilt.", test: "What is the primary function of the Law regarding salvation?", options: ["To justify the flesh", "To be our schoolmaster to lead us to Christ", "To replace grace", "To elevate angels"], ans: 1 },
    { title: "4. The Incarnation of the Son", desc: "The Word became flesh and dwelt among us, fully God and fully man, born of a virgin without sin.", test: "Why was Christ's sinless humanity necessary?", options: ["To be an unblemished sacrificial Lamb", "To experience worldly wealth", "To study philosophy", "To avoid bodily death"], ans: 0 },
    { title: "5. The Atoning Crucifixion", desc: "Christ bore our sins in His own body on the tree, satisfying divine justice on our behalf.", test: "What did Jesus cry out on the cross when atonement was finished?", options: ["'Save me Father'", "'It is finished'", "'Wait for tomorrow'", "'I will return soon'"], ans: 1 },
    { title: "6. The Victorious Resurrection", desc: "On the third day, Jesus rose bodily from the grave, breaking the power of death and satan.", test: "What does Christ's resurrection guarantee for all who believe?", options: ["Worldly political power", "Our own future bodily resurrection and justification", "Immunity from earthly trials", "Universal wealth"], ans: 1 },
    { title: "7. Justification by Faith", desc: "We are justified freely by His grace through faith alone, not of our own works or merit.", test: "How was Abraham justified before God?", options: ["By his works", "Abraham believed God, and it was credited as righteousness", "By circumcision first", "By temple sacrifices"], ans: 1 },
    { title: "8. Regeneration & Holy Spirit", desc: "Born again of the Spirit, believers receive a new heart and the indwelling Advocate.", test: "What does the Holy Spirit produce in the believer's life?", options: ["Pride", "The fruit of love, joy, peace, and holiness", "Fear of man", "Love of the world"], ans: 1 },
    { title: "9. Sanctification & Perseverance", desc: "Set apart for God, believers mortify sin and walk daily in discipleship and holiness.", test: "How does Jesus call true disciples to follow Him?", options: ["Take up your cross daily and follow Me", "Live however you please", "Accumulate earthly riches", "Reject baptism"], ans: 0 },
    { title: "10. Eternal Glorification", desc: "At Christ's return, believers will see Him face to face and reign with Him in the new heaven and earth.", test: "What will God wipe away from the eyes of the redeemed in eternity?", options: ["Only bodily hunger", "Every tear, for death and sorrow will be no more", "The memory of grace", "The names of the saints"], ans: 1 }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Salvation Journey",
    iconSvg: `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>`,
    mount(container, onScoreUpdate) {
      let currentStep = 0;
      let score = 0;

      const render = () => {
        if (currentStep >= STATIONS.length) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">Journey Completed!</h2>
              <p style="font-size:20px;">You have studied and confessed the complete redemption journey. Score: ${score} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartSalvation">Walk Again</button>
            </div>
          `;
          container.querySelector('#restartSalvation').onclick = () => { currentStep = 0; score = 0; onScoreUpdate(0); render(); };
          return;
        }

        const s = STATIONS[currentStep];
        container.innerHTML = `
          <div style="padding:20px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px;">
            <div class="md3-card">
              <h3 class="card-title">${s.title}</h3>
              <p class="card-text">${s.desc}</p>
              <p class="card-text" style="color:#DF1E5A;font-weight:700;margin-top:12px;">${s.test}</p>
            </div>
            <div id="salvationChoices" style="display:flex;flex-direction:column;gap:12px;"></div>
          </div>
        `;

        const choicesDiv = container.querySelector('#salvationChoices');
        s.options.forEach((optText, idx) => {
          const btn = document.createElement('button');
          btn.className = 'md3-btn md3-btn-secondary';
          btn.textContent = optText;
          btn.onclick = () => {
            choicesDiv.querySelectorAll('button').forEach(b => b.disabled = true);
            if (idx === s.ans) {
              btn.style.backgroundColor = '#146C2E';
              btn.style.color = '#FFFFFF';
              score += 25;
              onScoreUpdate(score);
            } else {
              btn.style.backgroundColor = '#B3261E';
              btn.style.color = '#FFFFFF';
              choicesDiv.children[s.ans].style.backgroundColor = '#146C2E';
              choicesDiv.children[s.ans].style.color = '#FFFFFF';
            }
            setTimeout(() => { currentStep++; render(); }, 1200);
          };
          choicesDiv.appendChild(btn);
        });
      };

      render();
    },
    destroy() {}
  });
})();