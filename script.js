// Grabbing all screens
const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const finalScreen = document.getElementById("final-screen");
const finalMessage = document.getElementById("final-message");

const mapleBg = document.querySelector(".maple-bg");

const mapleScenes = {
    orbis: "images/Orbis.png",
    henesys: "images/Henesys.png",
    china: "images/China.png",
    ellinia: "images/Ellinia.png",
    leafre: "images/Leafre.png",
    noResponse: "images/No response.jpg"
};


// Grab buttons
const startBtn = document.getElementById("startBtn");
const yesBtn = document.getElementById("yesBtn");
const yesForeverBtn = document.getElementById("yesForeverBtn");
const noBtn = document.getElementById("noBtn");
const note = document.getElementById("love-note");
const finalText = document.getElementById("final-text");
const noOverlay = document.getElementById("no-overlay");
const noText = document.getElementById("no-text");


const heartTransition = document.getElementById("heart-transition");
const heartReveal = document.getElementById("heart-reveal");

const noMessages = [
    "Oy!! You're stuck with me.. in this life and the next 😁", 
    "I don't think that was the right answer 🤔🤔",
    "You've just won yourself 5 million kisses as punishment 😜",
    "Basbi how could you *le gasp* 😭😭"
]

let noMessageIndex = 0;


const sounds = {
    click: new Audio("sounds/click.wav"),
    pop: new Audio("sounds/pop.wav"),
    sparkle: new Audio("sounds/sparkle.wav"),
    walk: new Audio("sounds/walk.mp3"),
    no: new Audio("sounds/huh.mp3"),
    start: new Audio("sounds/Start screen.mp3"),
    question: new Audio("sounds/Question screen.mp3"),
    yay: new Audio("sounds/yay.mp3"),
    type: new Audio("sounds/typewriter.mp3")
};

sounds.start.loop = true;
sounds.question.loop = true;

// handles how soft the music comes in
sounds.start.volume = 0.6; 
sounds.question.volume = 0.6;
sounds.sparkle.volume = 0.25;
sounds.pop.volume = 0.25;
sounds.click.volume = 0.8;
sounds.yay.volume = 0.5;
sounds.type.volume = 0.6;

sounds.type.preload = "auto";

function playSound(name) {
    if (!sounds[name]) return;
    sounds[name].currentTime = 0;
    sounds[name].play();
}

function fadeOutSound(audio, duration = 1200) {
    const step = audio.volume / (duration / 50);
    const fade = setInterval(() => {
       if (audio.volume > step) {
        audio.volume -= step;
       } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(fade);
       }
    }, 50);
}

const audioUnlock = document.getElementById("audio-unlock");
audioUnlock.addEventListener("click", () => {
    playSound("start");
    sounds.start.volume = 0.5;
    audioUnlock.remove(); // remove overlay forever
});

function setMapleScene(scene) {
    mapleBg.classList.add("fade");
    setTimeout(() => {
        mapleBg.style.backgroundImage = `url("${mapleScenes[scene]}")`;
        mapleBg.classList.remove("fade");
    }, 400);
}


// Start button
startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    playSound("click");
    // sounds.start.currentTime = 0;
    // sounds.start.play();

    document.body.classList.add("maple-cursor");

    document.getElementById("replayBtn").classList.remove("hidden");

    // show heart overlay 

    heartTransition.classList.add("show");

        setTimeout(() => {
        startScreen.classList.add("hidden");

        questionScreen.classList.remove("hidden");

        requestAnimationFrame(() => {
            questionScreen.classList.add("visible");
        });

        // fade heart away 
        heartTransition.classList.remove("show");
            sounds.start.loop = true;
            fadeOutSound(sounds.start);

            sounds.question.currentTime = 0;
            sounds.question.volume = 0;
            sounds.question.play();

            // fade in question music
            let v = 0;
            const fadeIn = setInterval(() => {
                v += 0.05;
                sounds.question.volume = Math.min(v, 0.6);
                if (v >= 0.6) clearInterval(fadeIn);
            }, 60);
            animateQuestionScreen();
        }, 600);
});

// Yes button
yesBtn.addEventListener("click", () => {
    fadeOutSound(sounds.question);
    stopPetals();
    setMapleScene("henesys");
    playSound("pop");

    showCardThenReveal("yes");
    launchHearts();
});

//Yes Forever button
yesForeverBtn.addEventListener("click", () => {
    fadeOutSound(sounds.question);
    stopPetals();
    setMapleScene("leafre");
    playSound("sparkle");
    launchHearts();

    showCardThenReveal("forever");
    
});

// Old No Button
// noBtn.addEventListener("mousemove", moveNoButton);
// noBtn.addEventListener("click", () => {
    //     setMapleScene("noResponse");
    //     alert("Oy!! You're stuck with me.. in this life and the next 😁");
    //     // Move after click so the alert can fire
    //     setTimeout(() => {
        //         moveNoButton();
        //     }, 200);
        // });
        
// New No Button
noBtn.addEventListener("mousemove", moveNoButton);
noBtn.addEventListener("click", () => {
    setTimeout(() => {
        playSound("no");
    }, 120);
    
    noOverlay.classList.remove("hidden");
    noText.innerText = "";


    // message rotation
    const message = noMessages[noMessageIndex];
    noMessageIndex = (noMessageIndex + 1) % noMessages.length;

    setTimeout(() => {
        typeText(noText, message, 40);
    }, 800);

    setTimeout(() => {
        noOverlay.classList.add("hidden");

        // reset question screen
        animateQuestionScreen();
    }, 5000);
});


function moveNoButton() {
    const button = noBtn;
    const padding = 12;

    const dialog = document.getElementById("dialogue-box");
    const dialogRect = dialog.getBoundingClientRect();
    const btnRect = button.getBoundingClientRect();

    // Horizontal bounds
    const minX = dialogRect.left + padding;
    const maxX = dialogRect.right - btnRect.width - padding;
    // Vertical bounds
    const minY = dialogRect.bottom + 8;
    const maxY = dialogRect.bottom + 80;

    const randomX = minX + Math.random() * (maxX - minX);
    const randomY = minY + Math.random() * (maxY - minY);

    button.style.position = "fixed";
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
}

// old move button, a bit hard to click and moves offscreen
// function moveNoButton() {
//     const button = noBtn;
//     const padding = 20;

//     const maxX = window.innerWidth - button.offsetWidth - padding;
//     const maxY = window.innerHeight - button.offsetHeight - padding; 

//     const randomX = Math.random() * maxX;
//     const randomY = Math.random() * maxY;

//     button.style.position = "absolute";
//     button.style.left = `${randomX}px`;
//     button.style.top = `${randomY}px`;
// }



// Configuration object test
const finalMessages = {
    yes: {
        note: "You just made me the happiest person on earth 😍😍😍",
        final: null,
        action: null
    },
    forever: {
        note: "You're stuck with me forever, let's get married!! 💍",
        final: "Let's do it!! 😘",
        action: launchHearts
    }
};


//creating two new functions to show final message 
function showCardThenReveal(choice) {

    const finalDialog = document.getElementById("final-dialog");
    finalDialog.style.display = "block";

   //startScreen.classList.add("hidden");

    questionScreen.classList.add("hidden");

    finalScreen.classList.remove("hidden");

    note.style.display = "block";
    finalText.style.display = "none";

  //note.classList.add("visible");
    
    const photos = document.getElementById("photo-memories");
    if (photos) {
        photos.classList.remove("hidden");
        photos.classList.add("show");
    }

    setTimeout(() => {
        note.classList.add("fade-out");
        if (photos) {
            photos.classList.remove("show");
        }

        setTimeout(() => {
            note.classList.remove("fade-out");
            note.innerText = "";
            startFinalReveal(choice);
        }, 1500); // This number controls how long the delay is until the final message types out 
    }, 800); //This number controls how long the love note stays on screen
}

function startFinalReveal(choice) {
    const result = finalMessages[choice];

    
    note.innerText = "";
    finalText.innerText = "";
    note.style.display = "block";
    finalText.style.display = "none";
    // heartReveal.classList.add("hidden");

    // This types the love note out
    typeText(note, result.note, 50, () => {
        if (choice === "forever") {
            setMapleScene("china");
            setTimeout(() => {
                note.style.display = "none";
                
               
             heartReveal.classList.remove("hidden");

             setTimeout(() => {
                const yay = sounds.yay;
                yay.pause();
                yay.currentTime = 0;
                yay.play();
             }, 100);
             finalText.style.display = "block";
             finalText.innerText = "";

               typeText(finalText, result.final, 60, () => {
                if (result.action) result.action();
               });
            }, 3000);
        }
    });

}

// Petals falling
let petalInterval = null;

function startPetals() {
    if (petalInterval) return;

    petalInterval = setInterval(() => {
       const petal = document.createElement("div");
       petal.className = "petal";
       petal.textContent = "🌸"; 

       petal.style.left = Math.random() * window.innerWidth + "px";
       petal.style.setProperty("--drift", `${Math.random() * 80 - 40}px`);
       petal.style.animationDuration = `${8 + Math.random() * 6}s`;

       document.body.appendChild(petal);

       setTimeout(() => petal.remove(), 16000);
    }, 1800); // one petal every 1.8s
}

function stopPetals() {
    clearInterval(petalInterval);
    petalInterval = null;
}

// Launching hearts function
function launchHearts() {
    const heartCount = 50;

    for (let i = 0; i < heartCount; i++)
    {

        const heart = document.createElement("div");
        heart.classList.add("heart-particle");
        heart.innerText = "❤️";

        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight - 20;

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heart.style.fontSize = `${Math.random() * 2- + 20}px`;
        heart.style.animationDuration = `${Math.random() *1.5 + 1.5}s`;

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 3000);
    }
}


// testing new question screen animation
function animateQuestionScreen() {
    setMapleScene("orbis");
    startPetals(); 

    const you = document.getElementById("you");
    const her = document.getElementById("her");

    const dialogue = document.getElementById("dialogue-box");
    const answers = document.getElementById("answers");

    const characters = document.querySelector(".characters");

    const herRect = her.getBoundingClientRect();
    const youStartRect = you.getBoundingClientRect();
    const containerRect = characters.getBoundingClientRect();
    const gap = 12;

    const targetX = herRect.left - containerRect.left - youStartRect.width - gap;
    
    // Reset position
    you.style.transition = "none";
    you.style.left = "-100px";
    dialogue.classList.add("hidden");
    answers.classList.add("hidden");

    // force reflow
    setTimeout(() => {
        void you.offsetWidth;
        
        // walk in
        you.classList.add("walking");
        you.style.transition = "left 2s linear";

        you.style.left = `${targetX}px`
        setTimeout(() => {
            you.classList.remove("walking");
        }, 2000);
    
        // after walking, show dialog
        setTimeout(() => {

            setTimeout(() => {
                you.classList.add("lean");
            }, 300); // this delays whatever is inside the set time out

            dialogue.classList.remove("hidden");
            const youRect = you.getBoundingClientRect();
     
            dialogue.style.left = youRect.left + youRect.width / 2 + "px";
            dialogue.style.top = youRect.top - dialogue.offsetHeight - 10 + "px";
            dialogue.style.transform = "translateX(-50%)";
           
           // show answer buttons after short delay
           setTimeout(() => {
            answers.classList.remove("hidden");
           }, 800);
        }, 2000);
        
    }, 1500); // this delays my character walking in
}

// Old animate question screen
/*function animateQuestionScreen() {
    const questionText = document.getElementById("question-text");
    const buttons = document.querySelectorAll(".button-row button");

    // reset animations
    questionText.className = "";
    buttons.forEach(btn => btn.className = "");

    // trigger reflow (forces animation restart)
    void questionText.offsetWidth;

    questionText.classList.add("fade-in", "fade-delay-1");

    buttons.forEach((btn, index) => {
        btn.classList.add("fade-in", `fade-delay-${index + 2}`);
    });
}*/

// Typewriter effect function
function typeText(element, text, speed = 45, callback) {
    let index = 0;
    element.innerText = "";

    const interval = setInterval(() => {
       if (index < text.length) {
        const char = text.charAt(index);
        element.innerText += char === " " ? "\u00A0" : char;

        if (char !== " " && index % 3 === 0) {
            sounds.type.pause();
            sounds.type.currentTime = 0;
            sounds.type.play();
        }
        index++;
       } else {
        sounds.type.pause();
        sounds.type.currentTime = 0;
        clearInterval(interval);
        if (callback) callback();
       }
    }, speed);
}


const snowContainer = document.querySelector(".initials-snow");

if (snowContainer) {
    setInterval(() => {
       const el = document.createElement("div");
       el.className = "initial";
       el.innerText = Math.random() > 0.5 ? "V" : "A";
       
       el.style.left = Math.random() * 100 + "vw";
       el.style.animationDuration = Math.random() * 6 + 6 + "s";

       if (Math.random() > 0.6) {
        const sparkle = document.createElement("span");
        sparkle.className = "sparkle";
        sparkle.innerText = "✨";
        sparkle.style.left = "12px";
        sparkle.style.top = "12px";
        el.appendChild(sparkle);
       }
       snowContainer.appendChild(el);

       setTimeout(() => el.remove(), 12000);
    }, 700);
}

const replayBtn = document.getElementById("replayBtn");
 replayBtn.addEventListener("click", () => {
     playSound("click");
     fadeOutSound(sounds.start);
     window.location.reload();
});
 
let herClickCount = 0;
const EASTER_EGG_CLICKS = 3;

const herCharacter = document.getElementById("her");

herCharacter.addEventListener("click", () => {
    herClickCount++;
    playSound("pop");

    if (herClickCount === EASTER_EGG_CLICKS) {
        triggerEasterEgg();
    }
});

function triggerEasterEgg() {
    playSound("Sparkle");

    alert("Secret unlocked \nYou're really stuck with me now ;)")
    herClickCount = 0;
}