let activeCase = 'hub';

function switchCase(caseNum) {
    activeCase = caseNum;
    document.querySelectorAll('.case-view').forEach(v => v.style.display = 'none');
    
    const sb = document.getElementById('main-sidebar');
    if (caseNum === 'hub') {
        document.getElementById('case-hub-view').style.display = 'block';
        sb.style.display = 'none';
    } else {
        document.getElementById(`case-${caseNum}-view`).style.display = 'block';
        sb.style.display = 'flex';
        document.getElementById('case-selector').value = caseNum;
        
        const titles = {
            '404': 'Case 404: The Silence of Blackwood Manor',
            '405': 'Case 405: The Heir Who Never Died',
            '406': 'Case 406: The Last Passenger'
        };
        document.getElementById('sidebar-case-title').innerText = titles[caseNum];
    }
}

function switchCaseAndOpen(caseNum, tabId) {
    switchCase(caseNum);
    openTab(tabId);
}

function openTab(tabId) {
    if (activeCase === 'hub') return;
    const view = document.getElementById(`case-${activeCase}-view`);
    view.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const navButtons = document.querySelectorAll('.sidebar button');
    navButtons.forEach(btn => btn.classList.remove('active-nav'));

    const target = view.querySelector(`#${tabId}-${activeCase}`);
    if (target) target.classList.add('active');

    event.currentTarget.classList.add('active-nav');
}

window.addEventListener('DOMContentLoaded', () => {
    switchCase('hub');
    
    ['404', '405', '406'].forEach(c => {
        const nf = document.getElementById(`detective-notes-${c}`);
        if (nf && localStorage.getItem(`case${c}_notes`)) {
            nf.value = localStorage.getItem(`case${c}_notes`);
        }
        if (nf) {
            nf.addEventListener('input', () => {
                localStorage.setItem(`case${c}_notes`, nf.value);
            });
        }
    });
});

const suspectData = {
    // Case 404
    'julian': { 
        name: "Julian Blackwood", 
        greeting: "“Look, Detective, I don't have all night. Make your 8 questions quick.”", 
        clues: ["Library", "Coat Button", "Thomas Vale"], 
        hintText: "MANDATORY SYSTEM HINT: You are running low on questions. Ask Julian specifically: 'How did your button end up in the study?' or check his coat thread.", 
        persona: "You are Julian Blackwood in 1894. Arrogant, flirty, sarcastic, deeply in debt. You must give clear clues in your answers: admit you were in the library looking for the will, and if asked about your coat button or thread in the study, bluntly state that the thread was dry because you lost that button days ago while arguing in the hallway, proving you weren't there during the murder. Keep answers punchy (2-3 sentences)." 
    },
    'clara': { 
        name: "Clara Whitmore", 
        greeting: "“I... I will answer what I can, Detective. Please hurry.”", 
        clues: ["Private Meeting", "Wet Gloves", "Scream at 11:51"], 
        hintText: "MANDATORY SYSTEM HINT: Press Clara on her alibi. Ask her: 'Why were your gloves wet?' or about her visit to the cemetery.", 
        persona: "You are Clara Whitmore in 1894. Scared, hesitant, polite, grieving Lord Blackwood's missing son. You stutter when nervous. When questioned, explicitly reveal your clues: state that your gloves were wet because you visited Thomas Vale's cemetery grave during the storm, and confirm you heard the scream at 11:51 PM. Keep answers concise (2-3 sentences)." 
    },
    'adrian': { 
        name: "Dr. Adrian Vale", 
        greeting: "“I am at your disposal, Detective. Though I suggest we are brief.”", 
        clues: ["Blackout Alibi", "Thomas Vale", "Lavender Sugar"], 
        hintText: "MANDATORY SYSTEM HINT: Rattle the doctor's composure. Ask him directly: 'Why was lavender sugar found in the second glass?'", 
        persona: "You are Dr. Adrian Vale, the secret killer. Cold, polite, strictly logical, calculating. Your father was Thomas Vale. Drop subtle hints: claim you were alone in your bedroom during the blackout. If asked about lavender sugar, act momentarily rattled and defensive, letting slip that you keep it in your medical kit. Keep answers brief (2-3 sentences)." 
    },
    'eleanor': { 
        name: "Mrs. Eleanor Graves", 
        greeting: "“I have served this house for 28 years. I will tolerate exactly 8 questions.”", 
        clues: ["10:55 PM Visit", "Boiler Accident", "Who is the killer?"], 
        hintText: "MANDATORY SYSTEM HINT: Interrogate her about the past. Ask her: 'Who helped Arthur disappear?' or 'What happened to Thomas Vale?'", 
        persona: "You are Mrs. Eleanor Graves, strict housekeeper. Stern, commanding, highly observant. Give direct clues: confirm you visited Lord Blackwood at 10:55 PM and he was alive, mention the old boiler accident that killed Thomas Vale, and hint that Dr. Adrian Vale is hiding his true identity. Keep answers direct (2-3 sentences)." 
    },

    // Case 405
    'julian405': { 
        name: "Julian Blackwood", 
        greeting: "“Make it fast. Henry's death doesn't mean I killed him.”", 
        clues: ["Arthur Blackwood", "Archive Room", "Inheritance"], 
        hintText: "MANDATORY SYSTEM HINT: Ask Julian about who he saw near the crime scene: 'Were you near the archive and who did you see?'", 
        persona: "You are Julian Blackwood in Case 405. Defensive and arrogant. Drop clear clues: admit you demanded Henry's documents because if Arthur is alive, you lose your inheritance. State clearly that you saw Victor Hale lurking near the archive room corridor around 10:20 PM. Keep answers short (2-3 sentences)." 
    },
    'clara405': { 
        name: "Clara Whitmore", 
        greeting: "“The photograph... someone stole it. What do you want?”", 
        clues: ["Anonymous Letter", "Henry's Refusal", "The Archive"], 
        hintText: "MANDATORY SYSTEM HINT: Ask Clara about her messages: 'What did your anonymous letter say about Arthur?'", 
        persona: "You are Clara Whitmore in Case 405. Anxious and determined. Give explicit clues: state that your anonymous letter said 'Arthur did not abandon you,' that Henry refused to give you the documents, and that you never entered the archive room. Keep answers concise (2-3 sentences)." 
    },
    'eleanor405': { 
        name: "Mrs. Eleanor Graves", 
        greeting: "“Another tragedy in this house. Ask your questions.”", 
        clues: ["Old File", "Arthur's Disappearance", "Victor Hale"], 
        hintText: "MANDATORY SYSTEM HINT: Ask Mrs. Graves about the estate manager: 'Who helped Arthur disappear?'", 
        persona: "You are Mrs. Eleanor Graves in Case 405. Stern and solemn. Provide direct clues: state that Henry asked you to find an old file on Arthur's disappearance, and reveal that Victor Hale was the one who helped Arthur vanish 20 years ago. Keep answers concise (2-3 sentences)." 
    },
    'victor405': { 
        name: "Victor Hale", 
        greeting: "“I have nothing to hide, Detective. Ask what you came for.”", 
        clues: ["Why Return?", "Gold Thread Glove", "Stopped Clock 10:16"], 
        hintText: "MANDATORY SYSTEM HINT: Trap Victor on his timeline knowledge. Ask him: 'Why did the clock stop at 10:16 PM?'", 
        persona: "You are Victor Hale, the killer of Henry Collins in Case 405. Nervous and trying to stay composed. Drop guilty hints: if pressed about the time of death or the archive clock, accidentally slip up and mention that the clock stopped at 10:16 PM, a detail only the murderer tampering with the scene would know. Keep answers short (2-3 sentences)." 
    },

    // Case 406
    'mara406': { 
        name: "Mara Voss", 
        greeting: "“I'm busy, Detective. Make your questions count.”", 
        clues: ["Edward's Corruption Files", "Station Cafe Meeting", "8:25 PM Train Ticket"], 
        hintText: "MANDATORY SYSTEM HINT: Check her alibi. Ask her: 'Did you leave the station before the murder?'", 
        persona: "You are Mara Voss, politician's assistant. Controlled, private, slightly defensive. Provide clear clues: admit Edward Harrow investigated your employer, confirm you met him briefly at the cafe, but give the solid alibi that your train ticket proves you left the station at 8:25 PM before the murder occurred. Keep answers brief (2-3 sentences)." 
    },
    'samuel406': { 
        name: "Samuel Reed", 
        greeting: "“The Midnight Express runs on schedule, Detective. What is it?”", 
        clues: ["Repaired Uniform", "Cabin 7 Access", "The Missing Grey Coat"], 
        hintText: "MANDATORY SYSTEM HINT: Confront him with physical evidence. Ask him: 'What was Edward wearing?' to catch his coat slip-up.", 
        persona: "You are Samuel Reed, railway conductor and the secret killer of Case 406. Professional and calm, but hiding guilt. Drop accidental clues: if questioned about Edward's appearance or belongings, slip up and mention his grey coat before anyone else knew it was missing from the crime scene. Keep answers short (2-3 sentences)." 
    },
    'leo406': { 
        name: "Leo Harrow", 
        greeting: "“If this is about the money, I already told you everything.”", 
        clues: ["Argument with Edward", "Luggage Room", "CCTV Alibi"], 
        hintText: "MANDATORY SYSTEM HINT: Verify his whereabouts. Ask him: 'Were you near the luggage room and what does the CCTV show?'", 
        persona: "You are Leo Harrow, Edward's unemployed brother. Defensive, stressed, broke. Give clear factual clues: admit you argued with Edward about money near the luggage room at 8:15 PM, but state clearly that station CCTV footage proves you left the premises at 8:18 PM. Keep answers concise (2-3 sentences)." 
    },
    'eliza406': { 
        name: "Eliza Morrow", 
        greeting: "“The station cafe is closed, Detective. Speak quickly.”", 
        clues: ["Closing Time Lie", "Her Secret Son", "Who pushed the trolley?"], 
        hintText: "MANDATORY SYSTEM HINT: Ask her about what her son witnessed: 'Who did your son see pushing the luggage trolley?'", 
        persona: "You are Eliza Morrow, station cafe owner. Quiet, observant, protective. Drop crucial clues: admit you lied about your cafe closing time, and reveal that your young son was hiding at the station and saw Samuel Reed pushing the heavy trunk trolley toward Cabin 7. Keep answers concise (2-3 sentences)." 
    }
};
let currentSuspectKey = '';
let questionsRemaining = 8;

function startInterrogation(caseNum, suspectKey) {
    currentSuspectKey = suspectKey;
    questionsRemaining = 8;
    document.getElementById(`q-count-${caseNum}`).innerText = questionsRemaining;
    
    const ui = document.getElementById(`user-input-${caseNum}`);
    const sb = document.getElementById(`send-btn-${caseNum}`);
    ui.disabled = false;
    sb.disabled = false;
    ui.placeholder = "Ask your question...";
    
    document.getElementById(`suspect-menu-${caseNum}`).style.display = 'none';
    document.getElementById(`interrogation-session-${caseNum}`).style.display = 'block';
    
    const suspect = suspectData[suspectKey];
    document.getElementById(`current-suspect-name-${caseNum}`).innerText = "INTERROGATING: " + suspect.name.toUpperCase();

    const cb = document.getElementById(`chat-box-${caseNum}`);
    cb.innerHTML = ''; 
    
    addMessage(caseNum, suspect.greeting, 'ai');

    const ca = document.getElementById(`clue-area-${caseNum}`);
    ca.innerHTML = '';
    suspect.clues.forEach(clue => {
        const btn = document.createElement('button');
        btn.innerText = "Ask about: " + clue;
        btn.onclick = () => { ui.value = clue; ui.focus(); };
        ca.appendChild(btn);
    });
}

function backToMenu(caseNum) {
    document.getElementById(`interrogation-session-${caseNum}`).style.display = 'none';
    document.getElementById(`suspect-menu-${caseNum}`).style.display = 'flex';
}

function addMessage(caseNum, text, sender, isSystem = false) {
    const cb = document.getElementById(`chat-box-${caseNum}`);
    const msgDiv = document.createElement('p');
    
    if (isSystem) {
        msgDiv.className = 'system-msg';
        msgDiv.innerHTML = text;
    } else {
        msgDiv.className = sender === 'user' ? 'user-msg' : 'ai-msg';
        let prefix = sender === 'user' ? '<strong>You:</strong> ' : `<strong>${suspectData[currentSuspectKey].name.split(' ')[0]}:</strong> `;
        msgDiv.innerHTML = prefix + text;
    }
    cb.appendChild(msgDiv);
    cb.scrollTop = cb.scrollHeight;
}

['404', '405', '406'].forEach(c => {
    const ui = document.getElementById(`user-input-${c}`);
    if (ui) {
        ui.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(c); });
    }
});

async function sendMessage(caseNum) {
    if (questionsRemaining <= 0) return;
    const ui = document.getElementById(`user-input-${caseNum}`);
    const text = ui.value.trim();
    if (!text) return;

    questionsRemaining--;
    document.getElementById(`q-count-${caseNum}`).innerText = questionsRemaining;

    addMessage(caseNum, text, 'user');
    ui.value = '';
    
    if (questionsRemaining === 2) {
        setTimeout(() => {
            addMessage(caseNum, `🚨 <strong>[SYSTEM ASSIST ALERT]</strong><br>${suspectData[currentSuspectKey].hintText}`, 'system', true);
        }, 500);
    }

    if (questionsRemaining === 0) {
        ui.disabled = true;
        document.getElementById(`send-btn-${caseNum}`).disabled = true;
        ui.placeholder = "No questions remaining.";
    }

    const typingId = "typing-" + Date.now();
    const typingIndicator = document.createElement('p');
    typingIndicator.className = 'ai-msg';
    typingIndicator.id = typingId;
    typingIndicator.innerHTML = `<strong>${suspectData[currentSuspectKey].name.split(' ')[0]}:</strong> ...`;
    document.getElementById(`chat-box-${caseNum}`).appendChild(typingIndicator);

    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: text,
                persona: suspectData[currentSuspectKey].persona 
            })
        });

        const data = await response.json();
        document.getElementById(typingId).remove();
        addMessage(caseNum, data.reply || "System Error: Suspect is silent.", 'ai');

        if (questionsRemaining === 0) {
            setTimeout(() => {
                addMessage(caseNum, "[SYSTEM: Interrogation terminated. Right to remain silent invoked.]", 'system', true);
            }, 1000);
        }
    } catch (error) {
        document.getElementById(typingId).remove();
        addMessage(caseNum, "System Error: Connection lost.", 'ai');
    }
}

function checkVerdict(caseNum, suspect) {
    const resultText = document.getElementById(`verdict-result-${caseNum}`);
    const buttons = document.getElementById(`verdict-buttons-${caseNum}`);
    
    buttons.style.display = 'none'; 
    resultText.style.display = 'block';

    if (caseNum === '404') {
        if (suspect === 'Adrian') {
            resultText.innerHTML = `
                <h2 style="color: #2ea043;">🟥 DR. ADRIAN VALE (CORRECT!)</h2><br>
                <p>Dr. Vale poisoned Lord Blackwood to avenge his father, Thomas Vale, and created a fake locked-room mystery using lavender sugar and a clean key.</p><br>
                <h2 style="color: #e3b341;">🔓 CASE 405 UNLOCKED</h2>
                <p>Switch to Case 405 in the sidebar to investigate Henry Collins' murder!</p>
            `;
        } else {
            resultText.innerHTML = `
                <h2 style="color: #ff7b72;">INCORRECT DEDUCTION</h2>
                <p>Review the timeline, dry footprint, clean key, and lavender sugar.</p>
                <button onclick="resetVerdict('${caseNum}')" style="margin-top: 15px; background: #161b22; color: #58a6ff; border: 1px solid #30363d; padding: 10px; cursor: pointer;">← Try Again</button>
                <button onclick="revealAnswer('${caseNum}', 'Adrian')" style="margin-top: 15px; margin-left: 10px; background: #21262d; color: #e3b341; border: 1px solid #30363d; padding: 10px; cursor: pointer;">Reveal Answer</button>
            `;
        }
    } else if (caseNum === '405') {
        if (suspect === 'Victor') {
            resultText.innerHTML = `
                <h2 style="color: #2ea043;">CORRECT! VICTOR HALE IS THE KILLER.</h2><br>
                <p>Victor Hale stopped the archive clock at 10:16 PM to fake the time of death. During interrogation, he slipped up and revealed he knew the exact time of death—a detail only the killer could know.</p><br>
                <h3 style="color: #58a6ff;">CASE 405 CLOSED ✓</h3>
            `;
        } else {
            resultText.innerHTML = `
                <h2 style="color: #ff7b72;">INCORRECT DEDUCTION</h2>
                <p>The clock was deliberately stopped, and only one suspect knew the exact time without being told.</p>
                <button onclick="resetVerdict('${caseNum}')" style="margin-top: 15px; background: #161b22; color: #58a6ff; border: 1px solid #30363d; padding: 10px; cursor: pointer;">← Try Again</button>
                <button onclick="revealAnswer('${caseNum}', 'Victor')" style="margin-top: 15px; margin-left: 10px; background: #21262d; color: #e3b341; border: 1px solid #30363d; padding: 10px; cursor: pointer;">Reveal Answer</button>
            `;
        }
    } else if (caseNum === '406') {
        if (suspect === 'Samuel') {
            resultText.innerHTML = `
                <h2 style="color: #2ea043;">CORRECT! SAMUEL REED IS THE KILLER.</h2><br>
                <p>Samuel Reed killed Edward Harrow to hide railway corruption, hid the body in a trunk on a trolley, placed him in Cabin 7, and slipped up by mentioning Edward's missing grey coat before anyone knew it was gone.</p><br>
                <h3 style="color: #58a6ff;">ALL CASES COMPLETED! CONGRATULATIONS, DETECTIVE.</h3>
            `;
        } else {
            resultText.innerHTML = `
                <h2 style="color: #ff7b72;">INCORRECT DEDUCTION</h2>
                <p>One person had access to the station, luggage trolleys, railway uniform, and Cabin 7.</p>
                <button onclick="resetVerdict('${caseNum}')" style="margin-top: 15px; background: #161b22; color: #58a6ff; border: 1px solid #30363d; padding: 10px; cursor: pointer;">← Try Again</button>
                <button onclick="revealAnswer('${caseNum}', 'Samuel')" style="margin-top: 15px; margin-left: 10px; background: #21262d; color: #e3b341; border: 1px solid #30363d; padding: 10px; cursor: pointer;">Reveal Answer</button>
            `;
        }
    }
}

function resetVerdict(caseNum) {
    document.getElementById(`verdict-result-${caseNum}`).style.display = 'none';
    document.getElementById(`verdict-buttons-${caseNum}`).style.display = 'flex';
}

function revealAnswer(caseNum, killerName) {
    checkVerdict(caseNum, killerName);
}

// --- PROPER CINEMATIC MYSTERY SOUNDTRACK ---
let caseAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf756.mp3?filename=dark-mystery-trailer-110663.mp3');
caseAudio.loop = true;
caseAudio.volume = 0.5;
let isAudioPlaying = false;

function toggleAudio() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioLabel = document.getElementById('current-audio-label');
    
    if (isAudioPlaying) {
        caseAudio.pause();
        isAudioPlaying = false;
        audioBtn.innerText = "Play Ambient";
        audioLabel.innerText = "Muted";
    } else {
        caseAudio.play().then(() => {
            isAudioPlaying = true;
            audioBtn.innerText = "Mute Ambient";
            audioLabel.innerText = "Playing Mystery Soundtrack";
        }).catch(e => {
            alert("Click anywhere on the page first, then click Play Ambient.");
        });
    }
}

function switchCase(caseNum) {
    activeCase = caseNum;
    document.querySelectorAll('.case-view').forEach(v => v.style.display = 'none');
    
    const sb = document.getElementById('main-sidebar');
    const audioLabel = document.getElementById('current-audio-label');

    if (caseNum === 'hub') {
        document.getElementById('case-hub-view').style.display = 'block';
        sb.style.display = 'none';
        if (isAudioPlaying && audioLabel) {
            audioLabel.innerText = "Playing Mystery Soundtrack (Hub)";
        }
    } else {
        document.getElementById(`case-${caseNum}-view`).style.display = 'block';
        sb.style.display = 'flex';
        document.getElementById('case-selector').value = caseNum;
        
        const titles = {
            '404': 'Case 404: The Silence of Blackwood Manor',
            '405': 'Case 405: The Heir Who Never Died',
            '406': 'Case 406: The Last Passenger'
        };
        document.getElementById('sidebar-case-title').innerText = titles[caseNum];

        if (isAudioPlaying && audioLabel) {
            audioLabel.innerText = `Playing Case ${caseNum} Soundtrack`;
        }
    }
}
