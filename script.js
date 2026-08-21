// --- TAB NAVIGATION --- //
function openTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    const navButtons = document.querySelectorAll('.sidebar button');
    navButtons.forEach(btn => btn.classList.remove('active-nav'));

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    event.currentTarget.classList.add('active-nav');
}

// --- DETECTIVE'S NOTEPAD (AUTO-SAVE) --- //
const notesField = document.getElementById('detective-notes');
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('case404_notes')) {
        notesField.value = localStorage.getItem('case404_notes');
    }
});
notesField.addEventListener('input', () => {
    localStorage.setItem('case404_notes', notesField.value);
});


// --- AI PERSONAS, BEHAVIORS, & CLUES --- //
const suspectData = {
    julian: {
        name: "Julian Blackwood",
        greeting: "“Look, Detective, I don't have all night. Make your 5 questions quick.”",
        clues: ["Library", "Coat Button", "Thomas Vale"],
        hint: "Julian seems guarded about his coat. Ask him why his BUTTON THREAD was dry.",
        persona: `You are Julian Blackwood. 
        Personality: Extremely arrogant, slightly flirty, sarcastic, and highly defensive about your debts. 
        Rules: 
        1. Keep answers short (1-3 sentences). 
        2. You were in the library during the blackout looking for the will. 
        3. If asked about the button in the study, mock the detective and say the thread was dry, proving you lost it days ago. 
        4. Never break character.`
    },
    clara: {
        name: "Clara Whitmore",
        greeting: "“I... I will answer what I can, Detective. But please, hurry.”",
        clues: ["Private Meeting", "Wet Gloves", "Scream at 11:51"],
        hint: "Clara is hiding where she went during the storm. Ask about her WET GLOVES.",
        persona: `You are Clara Whitmore. 
        Personality: Scared, hesitant, polite, and deeply grieving for Lord Blackwood's missing son. You stutter slightly when nervous.
        Rules: 
        1. Keep answers short (1-3 sentences). 
        2. You met Blackwood to ask about his son. He said the son is alive.
        3. Your gloves are wet because you visited Thomas Vale's grave in the cemetery during the storm.
        4. You didn't scream, but you saw a shadow outside the study window.
        5. Never break character.`
    },
    adrian: {
        name: "Dr. Adrian Vale",
        greeting: "“I am at your disposal, Detective. Though I suggest we are brief.”",
        clues: ["Blackout Alibi", "Thomas Vale", "Lavender Sugar"],
        hint: "Dr. Vale is perfectly composed. Rattle him by asking about the LAVENDER SUGAR in the second glass.",
        persona: `You are Dr. Adrian Vale, the secret killer. You will firmly deny it. 
        Personality: Cold, polite, strictly logical, and calculating.
        Rules: 
        1. Keep answers short (1-3 sentences). 
        2. Your father was Thomas Vale, killed by Blackwood 25 years ago. You hate Blackwood but hide it well.
        3. Claim you were in your bedroom during the blackout.
        4. If asked about lavender sugar, act momentarily surprised/rattled, then say you only use it in your tea. (This is the clue that proves you poisoned the glass).
        5. Never break character.`
    },
    eleanor: {
        name: "Mrs. Eleanor Graves",
        greeting: "“I have served this house for 28 years. I will tolerate exactly 5 questions.”",
        clues: ["10:55 PM Visit", "Boiler Accident", "Who is the killer?"],
        hint: "Mrs. Graves knows a massive secret. Ask her WHO Thomas Vale's son is.",
        persona: `You are Mrs. Eleanor Graves, the loyal but strict housekeeper. 
        Personality: Stern, commanding, highly observant, and impatient with fools.
        Rules: 
        1. Keep answers short (1-3 sentences). 
        2. You brought firewood at 10:55 PM.
        3. You know Thomas Vale's death was ordered by Lord Blackwood.
        4. You know Dr. Adrian Vale is Thomas Vale's secret son. 
        5. If accused, tell the detective strictly to "Look at the time the watch stopped."
        6. Never break character.`
    }
};

// --- INTERROGATION LOGIC & LIMITS --- //
const chatBox = document.getElementById('chat-box');
const clueArea = document.getElementById('clue-area');
const suspectMenu = document.getElementById('suspect-menu');
const interrogationSession = document.getElementById('interrogation-session');
const currentSuspectNameHeader = document.getElementById('current-suspect-name');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const qCountText = document.getElementById('q-count');

let currentSuspect = '';
let questionsRemaining = 5;

function startInterrogation(suspectId) {
    currentSuspect = suspectId;
    questionsRemaining = 5;
    qCountText.innerText = questionsRemaining;
    
    // Enable input if it was disabled
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.placeholder = "Type your question for the suspect...";
    
    suspectMenu.style.display = 'none';
    interrogationSession.style.display = 'block';
    
    const suspect = suspectData[suspectId];
    currentSuspectNameHeader.innerText = "INTERROGATING: " + suspect.name.toUpperCase();

    chatBox.innerHTML = ''; 
    addMessage(suspect.greeting, 'ai');

    // Load Clue Suggestions
    clueArea.innerHTML = '';
    suspect.clues.forEach(clue => {
        const btn = document.createElement('button');
        btn.innerText = "Ask about: " + clue;
        btn.onclick = () => {
            userInput.value = clue;
            userInput.focus();
        };
        clueArea.appendChild(btn);
    });
}

function backToMenu() {
    interrogationSession.style.display = 'none';
    suspectMenu.style.display = 'flex';
}

function addMessage(text, sender, isSystem = false) {
    const msgDiv = document.createElement('p');
    
    if (isSystem) {
        msgDiv.className = 'system-msg';
        msgDiv.innerHTML = text;
    } else {
        msgDiv.className = sender === 'user' ? 'user-msg' : 'ai-msg';
        let prefix = sender === 'user' ? '<strong>You:</strong> ' : `<strong>${suspectData[currentSuspect].name.split(' ')[0]}:</strong> `;
        msgDiv.innerHTML = prefix + text;
    }
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Allow Enter key to send
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    if (questionsRemaining <= 0) return;
    
    const text = userInput.value.trim();
    if (!text) return;

    // Deduct a question
    questionsRemaining--;
    qCountText.innerText = questionsRemaining;

    addMessage(text, 'user');
    userInput.value = '';
    
    // System Hint Logic (Triggers when 2 questions are left / 3 asked)
    if (questionsRemaining === 2) {
        setTimeout(() => {
            addMessage(`[SYSTEM ASSIST: ${suspectData[currentSuspect].hint}]`, 'system', true);
        }, 500);
    }

    // Disable input if out of questions
    if (questionsRemaining === 0) {
        userInput.disabled = true;
        sendBtn.disabled = true;
        userInput.placeholder = "Interrogation complete. No questions remaining.";
    }

    // Show typing indicator
    const typingId = "typing-" + Date.now();
    const typingIndicator = document.createElement('p');
    typingIndicator.className = 'ai-msg';
    typingIndicator.id = typingId;
    typingIndicator.innerHTML = `<strong>${suspectData[currentSuspect].name.split(' ')[0]}:</strong> ...`;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Send to Netlify/Groq Backend
    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: text,
                persona: suspectData[currentSuspect].persona 
            })
        });

        const data = await response.json();
        document.getElementById(typingId).remove();
        addMessage(data.reply || "System Error: The suspect refuses to speak.", 'ai');

        if (questionsRemaining === 0) {
            setTimeout(() => {
                addMessage("[SYSTEM: Interrogation terminated. The suspect has invoked their right to remain silent.]", 'system', true);
            }, 1000);
        }

    } catch (error) {
        document.getElementById(typingId).remove();
        addMessage("System Error: Connection to suspect lost.", 'ai');
    }
}

// --- FINAL VERDICT LOGIC --- //
function checkVerdict(suspect) {
    const resultText = document.getElementById('verdict-result');
    const buttons = document.getElementById('verdict-buttons');
    
    buttons.style.display = 'none'; 
    resultText.style.display = 'block';

    if (suspect === 'Adrian') {
        resultText.innerHTML = `
            <h2 style="color: #2ea043;">🟥 DR. ADRIAN VALE</h2><br>
            <h3 style="color: #58a6ff;">THE TRUTH</h3>
            <p>Dr. Vale entered the study during the blackout.<br>He used his position as Lord Blackwood's doctor to gain access.<br>The poison was added directly to the drink.<br>Lord Blackwood realised something was wrong.<br>A struggle followed.<br>At 11:47 PM, he fell against the desk.<br>His watch struck the floor.</p><br>
            <h3 style="color: #58a6ff;">THE LOCKED ROOM</h3>
            <p>Dr. Vale left the study and created a false locked-room mystery.<br>The key was manipulated and dropped inside.<br>But it was too clean.<br>That was the mistake.</p><br>
            <h3 style="color: #58a6ff;">THE FALSE CLUES</h3>
            <p>Dr. Vale planted:<br>👣 The dry footprint — to suggest an outsider.<br>🔘 Julian's button — to frame the nephew.<br>The button's dry thread exposed the trick.</p><br>
            <h3 style="color: #58a6ff;">THE MOTIVE</h3>
            <p>Twenty-five years earlier, Lord Blackwood arranged the death of Thomas Vale.<br>Thomas's son grew up without knowing the truth.<br>That son was:<br>Dr. Adrian Vale.<br>Dr. Vale discovered the truth.<br>And on the night Lord Blackwood planned to confess—<br>Adrian decided that confession was not enough.</p><br>
            <h3 style="color: #58a6ff;">🕯️ CASE CLOSED?</h3>
            <p>Dr. Vale is arrested.<br>But before he is taken away, a final document is discovered.<br>Lord Blackwood's missing son—<br>may still be alive.<br>And somewhere outside Blackwood Manor—<br>another person knows the truth.</p><br>
            <hr style="border: 1px solid #30363d; margin: 20px 0;"><br>
            <h2 style="color: #e3b341;">🔓 NEXT CASE UNLOCKED</h2>
            <p>CASE 405: THE HEIR WHO NEVER DIED<br>Some mysteries do not end when the killer is found...</p>
        `;
    } else {
        resultText.innerHTML = `
            <h2 style="color: #ff7b72;">INCORRECT DEDUCTION</h2>
            <p>While this suspect had secrets, the physical evidence contradicts their involvement. Review the timeline, the dry footprint, the clean key, and the lavender sugar.</p>
            <button onclick="resetVerdict()" style="margin-top: 15px; background: #161b22; color: #58a6ff; border: 1px solid #30363d; padding: 10px; border-radius: 6px; cursor: pointer;">← Re-examine Suspects</button>
        `;
    }
}

function resetVerdict() {
    document.getElementById('verdict-result').style.display = 'none';
    document.getElementById('verdict-buttons').style.display = 'flex';
}