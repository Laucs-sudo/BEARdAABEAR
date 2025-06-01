var timeSiteLoaded = 0;
document.addEventListener('DOMContentLoaded', () => {
    timeSiteLoaded = Date.now();
});

function getTimeSpentOnSite() { return (Date.now() - timeSiteLoaded); }

// Initialize Particles.js
particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 40,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": ["#ff6e00", "#ffb347", "#ff8930"]
        },
        "shape": {
            "type": ["circle", "triangle"],
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
        },
        "opacity": {
            "value": 0.5,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 0.5,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 5,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 2,
                "size_min": 0.3,
                "sync": false
            }
        },
        "line_linked": {
            "enable": false
        },
        "move": {
            "enable": true,
            "speed": 1.5,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": true,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "bubble"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "bubble": {
                "distance": 150,
                "size": 8,
                "duration": 2,
                "opacity": 0.8,
                "speed": 3
            },
            "push": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

// Rotating messages in title
const messages = [
    {text: "omg hi!!!!!", emoji: "🐻"},
    {text: "i paid 10$ to have this", emoji: "💰"},
    {text: "check out my youtube", emoji: "📺"},
    {text: "beardabear.com on top", emoji: "🏆"},
    {text: "hey...", emoji: "👋"},
    {text: "beardabear in the house!!!! (woo)", emoji: "🐻"},
    {text: "you can review the website in the top right corner", emoji: "🐻"},
    {text: "(distant clapping)", emoji: "👏"}
];

const titleText = document.querySelector(".title .text");
const titleEmoji = document.querySelector(".title .emoji");

function updateTitle() {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    titleText.textContent = msg.text;
    titleText.setAttribute("data-text", msg.text);
    titleEmoji.textContent = msg.emoji;
    
    // Add animation classes
    titleText.classList.add("animate__animated", "animate__rubberBand");
    titleEmoji.classList.add("animate__animated", "animate__tada");
    
    // Remove animation classes after animation completes
    setTimeout(() => {
        titleText.classList.remove("animate__animated", "animate__rubberBand");
        titleEmoji.classList.remove("animate__animated", "animate__tada");
    }, 1000);
}

setInterval(updateTitle, 3000);
updateTitle(); // Initial update

// Background music
let bgMusic;

// Simple music setup with direct approach
function setupMusic() {
    // Create audio element directly in HTML to help with autoplay
    const audioElement = document.createElement('audio');
    audioElement.src = './static/groovy.ogg';
    audioElement.loop = true;
    audioElement.volume = 0.5; // Medium volume by default
    audioElement.autoplay = true; // Try autoplay
    audioElement.id = 'bgMusic';
    document.body.appendChild(audioElement);
    
    // Store reference for later use
    bgMusic = audioElement;
    
    const volumeSlider = document.querySelector('.volume-slider');
    volumeSlider.value = bgMusic.volume * 100;
    
    // Connect volume slider to music and update icon
    function updateVolumeIcon() {
        const volumeIcon = document.querySelector('.volume-icon');
        const volume = bgMusic.volume;
        
        if (volume === 0) {
            volumeIcon.textContent = '🔇'; // Muted
        } else if (volume < 0.33) {
            volumeIcon.textContent = '🔈'; // Low volume
        } else if (volume < 0.67) {
            volumeIcon.textContent = '🔉'; // Medium volume
        } else {
            volumeIcon.textContent = '🔊'; // High volume
        }
    }
    
    // Add click function to toggle mute
    document.querySelector('.volume-icon').addEventListener('click', () => {
        if (bgMusic.volume > 0) {
            bgMusic.savedVolume = bgMusic.volume;
            bgMusic.volume = 0;
            volumeSlider.value = 0;
        } else {
            bgMusic.volume = bgMusic.savedVolume || 0.5;
            volumeSlider.value = bgMusic.volume * 100;
        }
        updateVolumeIcon();
    });
    
    // Connect volume slider to music and update icon
    volumeSlider.addEventListener('input', () => {
        bgMusic.volume = volumeSlider.value / 100;
        updateVolumeIcon();
    });
    
    // Initialize icon
    updateVolumeIcon();
    
    // Force play on first interaction if autoplay failed
    document.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play();
        }
    }, { once: true });
}

// Call our function to start music immediately
window.addEventListener('load', setupMusic);

// Bear counter functionality
let bearsCaught = 0;
let baseSpawnInterval = 3000; // Start with one bear every 3 seconds
let currentSpawnInterval = baseSpawnInterval;
let spawnTimer;

function updateBearCounter() {
    // Don't update the counter if it's been disabled (after 500 bears event)
    if (window.bearCounterDisabled) return;
    
    document.querySelector('.bear-counter .count').textContent = bearsCaught;
    
    // Check for celebration at 100 bears
    if (bearsCaught === 100 && !window.celebrationTriggered) {
        window.celebrationTriggered = true;
        triggerCelebration();
    }
    
    // Check for the 300 bear special event
    if (bearsCaught === 300 && !window.thousandTriggered) {
        window.thousandTriggered = true;
        triggerThousandEvent();
    }
    
    // Unlimited bears with progressive spawn rates
    // The more bears caught, the more spawn
    const newInterval = Math.max(10, Math.floor(3000 / (1 + bearsCaught * 0.8)));
    
    if (newInterval !== currentSpawnInterval) {
        currentSpawnInterval = newInterval;
        clearInterval(spawnTimer);
        
        // Calculate bears per spawn - higher for more bears caught
        const bearsPerSpawn = Math.max(1, Math.min(10, Math.floor(bearsCaught / 5)));
        
        // Always use batch spawning for efficiency
        spawnTimer = setInterval(() => {
            for (let i = 0; i < bearsPerSpawn; i++) {
                createFallingBear();
            }
        }, newInterval);
    }
}

// Epic celebration function when reaching 100 bears
function triggerCelebration() {
    // Play epic sound - multiple explosions for intensity
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const celebrationSound = new Audio('./static/explosion.ogg');
            celebrationSound.volume = 0.8;
            celebrationSound.play();
        }, i * 200);
    }
    
    // Create rainbow overlay
    const rainbowOverlay = document.createElement('div');
    rainbowOverlay.className = 'rainbow-celebration-overlay';
    document.body.appendChild(rainbowOverlay);
    
    // Add rainbow styles
    const celebrationStyle = document.createElement('style');
    celebrationStyle.textContent = `
        .rainbow-celebration-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, rgba(255,0,0,0.3), rgba(255,165,0,0.3), rgba(255,255,0,0.3), rgba(0,128,0,0.3), rgba(0,0,255,0.3), rgba(75,0,130,0.3), rgba(238,130,238,0.3));
            background-size: 700% 700%;
            animation: rainbow-move 4s linear infinite;
            pointer-events: none;
            z-index: 9000;
        }
        
        @keyframes rainbow-move {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        
        .celebration-text {
            position: fixed;
            color: white;
            font-weight: bold;
            font-size: 50px;
            text-align: center;
            width: 100%;
            z-index: 10000;
            font-family: 'Comic Sans MS', cursive;
            filter: drop-shadow(0 0 10px #000);
            animation: celebration-pulse 0.5s infinite alternate;
            pointer-events: none;
        }
        
        .mini-celebration-text {
            position: fixed;
            color: white;
            font-weight: bold;
            font-size: 30px;
            z-index: 9900;
            font-family: 'Comic Sans MS', cursive;
            filter: drop-shadow(0 0 5px #000);
            animation: mini-text-animation 4s forwards;
            pointer-events: none;
            white-space: nowrap;
        }
        
        @keyframes celebration-pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }
        
        @keyframes mini-text-animation {
            0% { opacity: 0; transform: scale(0.1) rotate(0deg); }
            20% { opacity: 1; transform: scale(1) rotate(${Math.random() * 40 - 20}deg); }
            80% { opacity: 1; transform: translateY(-100px) rotate(${Math.random() * 80 - 40}deg); }
            100% { opacity: 0; transform: translateY(-200px) scale(0.5) rotate(${Math.random() * 180 - 90}deg); }
        }
        
        .confetti {
            position: fixed;
            width: 15px;
            height: 15px;
            background-color: var(--color);
            opacity: 0.7;
            z-index: 9500;
            pointer-events: none;
            animation: fall linear forwards;
        }
        
        @keyframes fall {
            to { transform: translateY(100vh) rotate(360deg); }
        }
    `;
    document.head.appendChild(celebrationStyle);
    
    // Add celebration text
    const texts = [
        '100 BEARS!!!',
        'CONGRATULATIONS!!!',
        'YOU ARE AMAZING!!!',
        'BEAR MASTER!!',
        'WOW SO MANY BEARS!'
    ];
    
    // Create and animate celebration texts with more intensity
    texts.forEach((text, index) => {
        setTimeout(() => {
            // Main celebration text
            const textEl = document.createElement('div');
            textEl.className = 'celebration-text';
            textEl.style.top = `${30 + index * 15}%`;
            textEl.textContent = text;
            document.body.appendChild(textEl);
            
            // Add flying mini-texts in random positions
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const miniText = document.createElement('div');
                    miniText.className = 'mini-celebration-text';
                    miniText.textContent = text;
                    miniText.style.left = `${Math.random() * 80 + 10}%`;
                    miniText.style.top = `${Math.random() * 80 + 10}%`;
                    miniText.style.transform = `rotate(${Math.random() * 40 - 20}deg) scale(${Math.random() * 0.5 + 0.5})`;
                    document.body.appendChild(miniText);
                    
                    // Remove after animation
                    setTimeout(() => miniText.remove(), 4000);
                }, i * 300);
            }
            
            // Remove after animation
            setTimeout(() => textEl.remove(), 5000);
        }, index * 800);
    });
    
    // Create explosions all over the screen - even more now
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createExplosionParticles(x, y);
        }, i * 200);
    }
    
    // Make random bears appear and explode automatically
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const bear = document.createElement('img');
            bear.src = './static/bear.gif';
            bear.className = 'auto-exploding-bear';
            bear.style.position = 'fixed';
            bear.style.left = `${Math.random() * 80 + 10}%`;
            bear.style.top = `${Math.random() * 80 + 10}%`;
            bear.style.width = '70px';
            bear.style.height = '70px';
            bear.style.transform = `rotate(${Math.random() * 360}deg)`;
            bear.style.zIndex = '9800';
            document.body.appendChild(bear);
            
            // Explode after a short delay
            setTimeout(() => {
                const rect = bear.getBoundingClientRect();
                createExplosionParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
                bear.remove();
            }, Math.random() * 2000 + 500);
        }, i * 300);
    }
    
    // Create even more confetti
    createConfetti(500);
    
    // Add spinning bears in background
    for (let i = 0; i < 20; i++) {
        const spinningBear = document.createElement('img');
        spinningBear.src = './static/bear.gif';
        spinningBear.className = 'celebration-spinning-bear';
        spinningBear.style.position = 'fixed';
        spinningBear.style.left = `${Math.random() * 100}%`;
        spinningBear.style.top = `${Math.random() * 100}%`;
        spinningBear.style.width = `${Math.random() * 50 + 30}px`;
        spinningBear.style.height = spinningBear.style.width;
        spinningBear.style.opacity = '0.7';
        spinningBear.style.zIndex = '8000';
        spinningBear.style.pointerEvents = 'none';
        
        // Add unique spinning animation
        const spinDuration = Math.random() * 8 + 4;
        const spinDirection = Math.random() > 0.5 ? 1 : -1;
        spinningBear.style.animation = `spin-bear ${spinDuration}s infinite linear`;
        
        document.body.appendChild(spinningBear);
        
        // Add spin keyframes
        const spinStyle = document.createElement('style');
        spinStyle.textContent = `
            @keyframes spin-bear {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(${180 * spinDirection}deg) scale(1.3); }
                100% { transform: rotate(${360 * spinDirection}deg) scale(1); }
            }
        `;
        document.head.appendChild(spinStyle);
        
        // Remove after celebration
        setTimeout(() => {
            spinningBear.remove();
            spinStyle.remove();
        }, 10000);
    }
    
    // Add rainbow background to all elements
    document.querySelectorAll('.button, .title, .loves-list, .description-text, .bear-counter, .fanart-container').forEach(el => {
        el.style.animation = 'rainbow-move 4s linear infinite';
        el.style.backgroundImage = 'linear-gradient(90deg, rgba(255,0,0,0.5), rgba(255,165,0,0.5), rgba(255,255,0,0.5), rgba(0,128,0,0.5), rgba(0,0,255,0.5), rgba(75,0,130,0.5), rgba(238,130,238,0.5))';
        el.style.backgroundSize = '700% 700%';
    });
    
    // Shake the screen a bit
    document.body.style.animation = 'shake 0.5s infinite';
    celebrationStyle.textContent += `
        @keyframes shake {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(5px, 5px) rotate(1deg); }
            50% { transform: translate(0, 0) rotate(0eg); }
            75% { transform: translate(-5px, 5px) rotate(-1deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }
    `;
    
    // Make bears spawn faster during celebration
    const originalInterval = currentSpawnInterval;
    clearInterval(spawnTimer);
    spawnTimer = setInterval(() => {
        for (let i = 0; i < 20; i++) {
            createFallingBear();
        }
    }, 200);
    
    // End celebration after 10 seconds
    setTimeout(() => {
        rainbowOverlay.remove();
        document.body.style.animation = '';
        document.querySelectorAll('.button, .title, .loves-list, .description-text, .bear-counter, .fanart-container').forEach(el => {
            el.style.animation = '';
            el.style.backgroundImage = '';
            el.style.backgroundSize = '';
        });
        
        // Restore spawn rate
        clearInterval(spawnTimer);
        spawnTimer = setInterval(() => {
            const bearsPerSpawn = Math.max(1, Math.min(10, Math.floor(bearsCaught / 5)));
            for (let i = 0; i < bearsPerSpawn; i++) {
                createFallingBear();
            }
        }, originalInterval);
    }, 10000);
}

// Create confetti
function createConfetti(count) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = `-50px`;
            confetti.style.width = `${Math.random() * 15 + 5}px`;
            confetti.style.height = confetti.style.width;
            confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => confetti.remove(), 5000);
        }, i * 20);
    }
}

// The special 500 bear event
function triggerThousandEvent() {
    // Stop all sounds
    stopAllSounds();
    
    // Save original body content
    const originalContent = document.body.innerHTML;
    
    // Create black screen overlay
    const blackScreen = document.createElement('div');
    blackScreen.style.position = 'fixed';
    blackScreen.style.top = '0';
    blackScreen.style.left = '0';
    blackScreen.style.width = '100%';
    blackScreen.style.height = '100%';
    blackScreen.style.backgroundColor = '#000';
    blackScreen.style.zIndex = '100000';
    blackScreen.id = 'thousand-event-screen';
    
    // Clear body and add black screen
    document.body.innerHTML = '';
    document.body.appendChild(blackScreen);
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#000';
    
    // After 3 seconds, start fading in the horse
    setTimeout(() => {
        // Create the horse image
        const horse = document.createElement('img');
        horse.src = './static/horse.png';
        horse.style.position = 'fixed';
        horse.style.top = '50%';
        horse.style.left = '50%';
        horse.style.transform = 'translate(-50%, -50%)';
        horse.style.width = '300px';
        horse.style.opacity = '0';
        horse.style.transition = 'opacity 7s linear';
        horse.style.zIndex = '100001';
        document.body.appendChild(horse);
        
        // Play the correct slow sound - reversesploot.wav
        const slowSound = new Audio('./static/reversesploot.wav');
        slowSound.volume = 1.0; // Full volume
        slowSound.play();
        
        // Start fade in
        setTimeout(() => {
            horse.style.opacity = '1';
        }, 100);
        
        // After horse is fully faded in
        setTimeout(() => {
            // Create an entry overlay container EXACTLY like the original
            const entryContainer = document.createElement('div');
            entryContainer.className = 'entrything-container';
            entryContainer.style.position = 'fixed';
            entryContainer.style.top = '25%'; // Lowered - not so far above the horse
            entryContainer.style.left = '50%';
            entryContainer.style.transform = 'translate(-50%, -50%)';
            entryContainer.style.display = 'flex';
            entryContainer.style.flexDirection = 'column';
            entryContainer.style.alignItems = 'center';
            entryContainer.style.animation = 'float 3s infinite ease-in-out';
            entryContainer.style.zIndex = '100002';
            document.body.appendChild(entryContainer);
            
            // Create entrything button with EXACT same properties as the original
            const entrything = document.createElement('img');
            entrything.src = './static/entrything.png';
            entrything.className = 'entrything';
            entrything.style.width = '200px';
            entrything.style.height = '200px';
            entrything.style.borderRadius = '30px';
            entrything.style.cursor = 'pointer';
            entrything.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            entrything.style.animation = 'wobble 2s infinite ease-in-out';
            entrything.style.filter = 'drop-shadow(0 0 10px rgba(255, 110, 0, 0.7))';
            entrything.style.willChange = 'transform';
            entrything.style.position = 'relative';
            entryContainer.appendChild(entrything);
            
            // Add wobble animation definition - exactly like original
            const wobbleStyle = document.createElement('style');
            wobbleStyle.textContent = `
                @keyframes wobble {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(5deg); }
                }
            `;
            document.head.appendChild(wobbleStyle);
            
            // Create click counter with EXACT same styling as original
            const clickCounter = document.createElement('div');
            clickCounter.className = 'click-counter';
            clickCounter.textContent = 'Clicks: 0/100';
            clickCounter.style.marginTop = '20px';
            clickCounter.style.color = 'white';
            clickCounter.style.fontSize = '24px';
            clickCounter.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
            clickCounter.style.position = 'relative';
            clickCounter.style.fontWeight = 'bold';
            clickCounter.style.transformOrigin = 'center';
            clickCounter.style.transition = 'all 0.3s';
            entryContainer.appendChild(clickCounter);
            
            // Add pulse animation for counter - exactly like original
            const counterStyle = document.createElement('style');
            counterStyle.textContent = `
                @keyframes counterPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.5); }
                    100% { transform: scale(1); }
                }
                
                .click-counter.updated {
                    animation: counterPulse 0.5s ease-in-out;
                    animation-fill-mode: both;
                    color: #ff6e00;
                    text-shadow: 0 0 15px rgba(255, 110, 0, 0.9);
                }
                
                @keyframes float {
                    0% { transform: translate(-50%, -50%) translateY(0px); }
                    50% { transform: translate(-50%, -50%) translateY(-10px); }
                    100% { transform: translate(-50%, -50%) translateY(0px); }
                }
            `;
            document.head.appendChild(counterStyle);
            
            // Add sound effect function using the correct files
            const playSplootSound = (pitch = 1.0) => {
                const sound = new Audio('./static/horsesound.ogg');
                sound.playbackRate = pitch;
                sound.volume = 0.5;
                sound.play();
            };
            
            // Add click handler to entrything with EXACT physics like original site start button
            let clickCount = 0;
            
            // Initialize click sound player
            const clickSplootSound = new Audio('./static/sploot.wav');
            
            entrything.addEventListener('click', (e) => {
                clickCount++;
                
                // Update click counter with pulse effect
                clickCounter.textContent = `Clicks: ${clickCount}/100`;
                clickCounter.classList.remove('updated');
                void clickCounter.offsetWidth; // Trigger reflow
                clickCounter.classList.add('updated');
                
                // Play click sound from start of site
                const clickSound = new Audio('./static/sploot.wav');
                clickSound.volume = 0.7;
                clickSound.play();
                
                // Physics animation exactly like the original - bouncy physics
                entrything.style.transform = 'scale(0.8) rotate(10deg)';
                setTimeout(() => {
                    entrything.style.transform = '';
                }, 100);
                
                // When reached 100 clicks
                if (clickCount >= 100) {
                    // Hide entrything with simpler effect for performance
                    entrything.style.display = 'none';
                    clickCounter.style.display = 'none';
                    
                    // Play explosion sound
                    const explosionSound = new Audio('./static/explosion.ogg');
                    explosionSound.volume = 0.7;
                    explosionSound.play();
                    
                    // Add explosion effect
                    const explosion = document.createElement('img');
                    explosion.src = './static/explosion.gif?t=' + Date.now(); // Force new load
                    explosion.style.position = 'fixed';
                    explosion.style.top = '50%';
                    explosion.style.left = '50%';
                    explosion.style.transform = 'translate(-50%, -50%)';
                    explosion.style.width = '500px';
                    explosion.style.height = '500px';
                    explosion.style.zIndex = '100003';
                    document.body.appendChild(explosion);
                    
                    // Restore original content after explosion
                    setTimeout(() => {
                        // Restore original content
                        document.body.innerHTML = originalContent;
                        
                        // Find the bear counter and set it to "no"
                        setTimeout(() => {
                            const bearCounterElement = document.querySelector('.bear-counter .count');
                            if (bearCounterElement) {
                                bearCounterElement.textContent = 'no';
                            }
                            
                            // Make bear counter unaffected by future updates
                            window.bearCounterDisabled = true;
                            
                            // Start kid.ogg sound
                            const kidSound = new Audio('./static/kid.ogg');
                            kidSound.volume = 1.0;
                            kidSound.play();
                            
                            // Spam the website with tons of bears to crash it
                            const spamBears = () => {
                                // Create 500 bears at once - this should start crashing the website
                                for (let i = 0; i < 500; i++) {
                                    setTimeout(() => createFallingBear(), Math.random() * 100);
                                }
                            };
                            
                            // Start with an initial wave
                            spamBears();
                            
                            // Continue spawning bears rapidly
                            const bearSpamInterval = setInterval(spamBears, 200);
                            
                            // After 3.44 seconds, go back to black screen with horse staring
                            setTimeout(() => {
                                clearInterval(bearSpamInterval);
                                
                                // Stop all sounds including kid.ogg
                                stopAllSounds();
                                
                                // Black screen again
                                document.body.innerHTML = '';
                                const blackScreen = document.createElement('div');
                                blackScreen.style.position = 'fixed';
                                blackScreen.style.top = '0';
                                blackScreen.style.left = '0';
                                blackScreen.style.width = '100vw';
                                blackScreen.style.height = '100vh';
                                blackScreen.style.backgroundColor = '#000';
                                blackScreen.style.zIndex = '100000';
                                document.body.appendChild(blackScreen);
                                document.body.style.margin = '0';
                                document.body.style.overflow = 'hidden';
                                document.body.style.backgroundColor = '#000';
                                
                                // Add staring horse - immediately visible
                                const horse = document.createElement('img');
                                horse.src = './static/horse.png';
                                horse.style.position = 'fixed';
                                horse.style.top = '50%';
                                horse.style.left = '50%';
                                horse.style.transform = 'translate(-50%, -50%)';
                                horse.style.width = '300px';
                                horse.style.zIndex = '100001';
                                document.body.appendChild(horse);
                                
                                // Play the correct slow sound - reversesploot.wav
                                const slowSound = new Audio('./static/reversesploot.wav');
                                slowSound.volume = 1.0; // Full volume
                                slowSound.play();
                                
                                // Nothing else happens after this point
                            }, 3440); // Exactly 3.44 seconds as requested
                        }, 500);
                    }, 1500);
                }
            });
        }, 7000); // After horse fade-in is complete
    }, 3000); // 3 seconds after black screen
}

// Helper to stop all audio
function stopAllSounds() {
    // Stop background music
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.pause();
    }
    
    // Stop all audio elements
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
    });
}

// Create a pool of audio objects for explosion sounds to prevent issues
const explosionSoundPool = [];
const maxSoundPoolSize = 10;

// Pre-create a pool of audio elements
for (let i = 0; i < maxSoundPoolSize; i++) {
    const sound = new Audio('./static/explosion.ogg');
    sound.volume = 0.3;
    sound.preload = 'auto';
    explosionSoundPool.push({
        audio: sound,
        available: true
    });
}

function createExplosionParticles(x, y) {
    // Create an explosion using the explosion.gif instead of particles
    const explosion = document.createElement('img');
    
    // Force the GIF to restart by adding a timestamp parameter
    explosion.src = `./static/explosion.gif?t=${Date.now()}_${Math.random()}`;
    explosion.className = 'bear-explosion';
    explosion.style.position = 'fixed';
    explosion.style.left = (x - 50) + 'px'; // Center the explosion
    explosion.style.top = (y - 50) + 'px';
    explosion.style.width = '100px';
    explosion.style.height = '100px';
    explosion.style.zIndex = '5000';
    explosion.style.pointerEvents = 'none';
    
    // Play sound from pool
    playExplosionSound();
    
    document.body.appendChild(explosion);
    
    // Remove after animation completes - exactly 0.8 seconds for the gif duration
    setTimeout(() => {
        explosion.remove();
    }, 800);
}

function playExplosionSound() {
    // Create a completely new Audio element each time to ensure overlapping
    const explosionSound = new Audio('./static/explosion.ogg');
    explosionSound.volume = 0.3;
    
    // Force play to ensure it works
    const playPromise = explosionSound.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(e => {
            console.log('Explosion sound play failed, trying alternative:', e);
            // Try again with user interaction event handler
            document.addEventListener('click', function clickHandler() {
                explosionSound.play();
                document.removeEventListener('click', clickHandler);
            }, { once: true });
        });
    }
    
    // Keep a reference to prevent garbage collection
    window.lastExplosionSound = explosionSound;
}

// Create falling bears
function createFallingBear() {
    // Don't create bears during the special event with the horse
    if (document.getElementById('thousand-event-screen')) {
        return;
    }
    
    const bear = document.createElement('img');
    bear.src = './static/bear.gif';
    bear.className = 'falling-bear';
    
    // Random starting position
    const startX = Math.random() * (window.innerWidth - 50);
    bear.style.left = startX + 'px';
    bear.style.top = '-50px';
    
    // Add hover handler
    let isHovered = false;
    bear.addEventListener('mouseenter', () => {
        if (!isHovered) {
            isHovered = true;
            
            // Create explosion effect at current bear position
            const rect = bear.getBoundingClientRect();
            createExplosionParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
            
            // Remove bear immediately
            bear.remove();
            
            // Increment counter
            bearsCaught++;
            updateBearCounter();
        }
    });
    
    document.body.appendChild(bear);
    
    // Animate falling with random speed and rotation
    const fallDuration = Math.random() * 3 + 4;
    
    // Generate random rotation direction and amount
    const rotateDirection = Math.random() > 0.5 ? 1 : -1;
    const startRotation = Math.floor(Math.random() * 60) * rotateDirection;
    const rotationAmount = 360 + Math.floor(Math.random() * 720) * rotateDirection;
    
    // Create unique keyframe animation name for this bear
    const animationName = `fallFromSky_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create custom keyframes for this bear - go 20% past the floor
    const keyframeStyle = document.createElement('style');
    keyframeStyle.textContent = `
        @keyframes ${animationName} {
            0% { transform: translateY(-100vh) rotate(${startRotation}deg); }
            100% { transform: translateY(120vh) rotate(${startRotation + rotationAmount}deg); }
        }
    `;
    document.head.appendChild(keyframeStyle);
    
    // Apply the custom animation
    bear.style.animation = `${animationName} ${fallDuration}s linear`;
    
    // Remove the keyframe style when animation ends and also the bear
    bear.addEventListener('animationend', () => {
        // Remove the keyframe style to prevent buildup
        keyframeStyle.remove();
        // Let it go past the floor but then remove it
        setTimeout(() => bear.remove(), 500);
    });
    setTimeout(() => {
        if (document.body.contains(bear)) {
            bear.remove();
        }
    }, 10000);
}

// Start spawning bears
spawnTimer = setInterval(createFallingBear, currentSpawnInterval);

// Add style for bear explosion and chicken elements
const styleEl = document.createElement('style');
styleEl.textContent = `
    .bear-explosion {
        position: fixed;
        pointer-events: none;
        z-index: 5000;
    }
    
    .chicken, .chicken-text {
        display: none; /* Hide any remaining elements */
    }
    
    .friend-button img {
        width: 40px;
        height: 40px;
        vertical-align: middle;
        margin-left: 10px;
        border-radius: 5px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .friend-button img:hover {
        transform: scale(1.2) rotate(5deg);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .friend-button img:active {
        transform: scale(0.9);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: all 0.1s ease;
    }
`;
document.head.appendChild(styleEl);

// Chicken jokey mode when pressing C
document.addEventListener('keydown', (e) => {
    // Feature removed
});

function createChicken() {
    // Feature removed
}

function createChickenText() {
    // Feature removed
}

// Create and manage the fan art gallery
const fanartSlideshow = document.getElementById('fanart-slideshow');
const prevButton = document.getElementById('prev-fanart');
const nextButton = document.getElementById('next-fanart');
const artistNameElement = document.querySelector('.artist-name');

let currentSlide = 0;
let slides = [];

// Fan art excitement phrases
const excitementPhrases = [
    "WOW AMAZING!",
    "SO COOL!",
    "I LOVE THIS!",
    "INCREDIBLE!",
    "AWESOME ART!",
    "FANTASTIC!",
    "LOOK AT THIS!",
    "BEAUTIFUL!",
    "TALENTED ARTIST!",
    "THIS IS GREAT!"
];

// Load fan art from the static/fanart directory
function loadFanArt() {
    const fanartFiles = [
        { file: "Anchu Bastian.png", artist: "Anchu Bastian" },
        { file: "AngelSpeaksSpanish 2.png", artist: "AngelSpeaksSpanish" },
        { file: "AngelSpeaksSpanish.jpg", artist: "AngelSpeaksSpanish" },
        { file: "Cheri Catherine.png", artist: "Cheri Catherine" },
        { file: "Commission.jpg", artist: "Commission" },
        { file: "Deth Ender.jpg", artist: "Deth Ender" },
        { file: "Dimka.png", artist: "Dimka" },
        { file: "DustTheDumbass.png", artist: "DustTheDumbass" },
        { file: "EEF1234 2.png", artist: "EEF1234" },
        { file: "EEF1234.png", artist: "EEF1234" },
        { file: "Fritz.png", artist: "Fritz" },
        { file: "Molly-Mae.png", artist: "Molly-Mae" },
        { file: "MrMLG.png", artist: "MrMLG" },
        { file: "Mystic.jpg", artist: "Mystic" },
        { file: "NoProblamo.png", artist: "NoProblamo" },
        { file: "Theweirdguy69.png", artist: "Theweirdguy69" },
        { file: "Vide0 2.png", artist: "Vide0" },
        { file: "bakedwithguts.png", artist: "bakedwithguts" },
        { file: "espxn.png", artist: "espxn" },
        { file: "flashkylo.png", artist: "flashkylo" },
        { file: "flashkylo2.png", artist: "flashkylo" },
        { file: "fritz 0.png", artist: "fritz" },
        { file: "fritz 2.png", artist: "fritz" },
        { file: "fritz 3.png", artist: "fritz" },
        { file: "fritz 4.png", artist: "fritz" },
        { file: "gr00vedude.png", artist: "gr00vedude" },
        { file: "mariigames.png", artist: "mariigames" },
        { file: "mariigames2.png", artist: "mariigames" },
        { file: "mystic.allspark.png", artist: "mystic.allspark" },
        { file: "s3d30 2.jpg", artist: "s3d30" },
        { file: "s3d30 3.jpg", artist: "s3d30" },
        { file: "s3d30.jpg", artist: "s3d30" },
        { file: "sludgeprograms.png", artist: "sludgeprograms" },
        { file: "the.mrtornado.png", artist: "the.mrtornado" },
        { file: "vide0_ 2.png", artist: "vide0_" },
        { file: "vide0_ 3.jpg", artist: "vide0_" },
        { file: "vide0_ 4.png", artist: "vide0_" },
        { file: "vide0_ 5.png", artist: "vide0_" },
        { file: "vide0_ 6.png", artist: "vide0_" },
        { file: "wick_candlestick.png", artist: "wick_candlestick" },
        { file: "williwilliam111.png", artist: "williwilliam111" },
        { file: "zmk12.png", artist: "zmk12" },
        { file: "𝐕𝐢𝐝𝐞ø 3.png", artist: "𝐕𝐢𝐝𝐞ø" },
        { file: "𝐕𝐢𝐝𝐞ø.png", artist: "𝐕𝐢𝐝𝐞ø" }
    ];
    
    // Shuffle the array for randomized viewing
    shuffleArray(fanartFiles);
    
    // Create slides for each image
    fanartFiles.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'fanart-slide';
        
        const img = document.createElement('img');
        img.className = 'fanart-image';
        img.src = `./static/fanart/${item.file}`;
        img.alt = `Fan art by ${item.artist}`;
        img.dataset.artist = item.artist;
        
        // Add loading and error handling
        img.onerror = () => {
            img.src = './static/bear.png'; // Fallback image
            img.alt = 'Image failed to load';
        };
        
        slide.appendChild(img);
        fanartSlideshow.appendChild(slide);
        slides.push(slide);
    });
    
    // Show first slide
    if (slides.length > 0) {
        showSlide(0);
    }
}

// Show specific slide by index
function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Handle wrapping
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Show current slide
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
        
        // Update artist name with "Artist: " prefix
        const img = slides[currentSlide].querySelector('img');
        if (img && img.dataset.artist) {
            artistNameElement.textContent = "Artist: " + img.dataset.artist;
            
            // Display random excitement text with animations
            showExcitementText();
        }
    }
}

// Show random excitement text with animation
function showExcitementText() {
    const excitementText = document.createElement('div');
    excitementText.className = 'excitement-text rainbow-text';
    excitementText.textContent = excitementPhrases[Math.floor(Math.random() * excitementPhrases.length)];
    
    // Position excitement text randomly around the gallery
    const container = document.querySelector('.fanart-container');
    const rect = container.getBoundingClientRect();
    
    const posX = rect.left + Math.random() * rect.width;
    const posY = rect.top + Math.random() * rect.height;
    
    excitementText.style.left = `${posX}px`;
    excitementText.style.top = `${posY}px`;
    
    // Add to body and animate
    document.body.appendChild(excitementText);
    
    // Apply random animation
    const isRight = Math.random() > 0.5;
    excitementText.style.animation = isRight 
        ? 'slide-right 2s forwards' 
        : 'slide-left 2s forwards';
    
    // Remove after animation completes
    setTimeout(() => {
        excitementText.remove();
    }, 2000);
}

// Event listeners for navigation
prevButton.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    createParticleBurst(prevButton.getBoundingClientRect().left, prevButton.getBoundingClientRect().top);
    prevButton.classList.add('spin');
    setTimeout(() => prevButton.classList.remove('spin'), 500);
});

nextButton.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    createParticleBurst(nextButton.getBoundingClientRect().left, nextButton.getBoundingClientRect().top);
    nextButton.classList.add('spin');
    setTimeout(() => nextButton.classList.remove('spin'), 500);
});

// Horse sound effect functionality
document.querySelector(".horse").addEventListener("click", (event) => {
    // Play sound effect
    const audio = new Audio('./static/sploot.ogg');
    audio.volume = 0.5;
    audio.play();
    
    // Add particle burst effect
    createParticleBurst(event.clientX, event.clientY, 10);
    
    // Create a horse clone
    createHorseClone();
});

// Create a horse clone
function createHorseClone() {
    const horse = document.createElement("div");
    horse.className = "horse";
    
    // Position randomly on screen
    horse.style.left = Math.random() * (window.innerWidth - 100) + "px";
    horse.style.bottom = Math.random() * (window.innerHeight - 100) + "px";
    
    // Randomize appearance
    horse.style.transform = `scale(${0.8 + Math.random() * 0.4}) rotate(${Math.random() * 20 - 10}deg)`;
    horse.style.filter = `hue-rotate(${Math.random() * 360}deg) drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.4))`;
    horse.style.animation = `bobbing ${2 + Math.random() * 2}s ease-in-out infinite ${Math.random()}s`;
    
    document.body.appendChild(horse);
    
    // Add click handler to the clone
    horse.addEventListener("click", (event) => {
        // Play sound effect
        const audio = new Audio('./static/sploot.ogg');
        audio.volume = 0.5;
        audio.play();
        
        // Add explosion effect
        createParticleBurst(event.clientX, event.clientY, 10);
        
        // Remove the clone with a fancy effect
        horse.style.transform = "scale(0) rotate(720deg)";
        horse.style.opacity = "0";
        setTimeout(() => horse.remove(), 500);
    });
    
    return horse;
}

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Entry mechanism functionality
let clickCount = 0;
const entryOverlay = document.getElementById('entryOverlay');
const entrything = document.getElementById('entrything');
const clickCounter = document.getElementById('clickCounter');
const explosion = document.getElementById('explosion');
const mainContent = document.getElementById('mainContent');
let clickSound;

// Pre-load sploot sound for immediate playback
const splotAudio = new Audio('./static/sploot.ogg');
splotAudio.volume = 0.5;
splotAudio.load(); // Preload the audio file

// Global flag to control music, NEVER modify this except in startBackgroundMusic
window.musicAlreadyPlaying = false;

function startBackgroundMusic() {
    // CRITICAL: If music is already playing or has been initialized, DO NOTHING
    if (window.musicAlreadyPlaying) {
        console.log('Music already playing, ignoring additional start request');
        return;
    }
    
    // Set the flag IMMEDIATELY to prevent any future calls
    window.musicAlreadyPlaying = true;
    console.log('Starting music for the first time');
    
    // KILL ALL AUDIO - even ones we don't know about
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
        try {
            audio.pause();
            audio.currentTime = 0;
            audio.remove();
        } catch(e) {}
    });
    
    // Clean container completely
    const container = document.getElementById('audio-container');
    if (container) container.innerHTML = '';
    
    // Slight delay to ensure everything is cleaned up
    setTimeout(() => {
        // Create completely new audio element with NO connection to any previous element
        const bgMusic = document.createElement('audio');
        bgMusic.id = 'uniqueBgMusic' + Date.now(); // Unique ID every time
        bgMusic.loop = true;
        bgMusic.volume = 0.5;
        
        // Add source manually
        const source = document.createElement('source');
        source.src = './static/groovy.ogg';
        source.type = 'audio/ogg';
        bgMusic.appendChild(source);
        
        // Add to container
        if (container) container.appendChild(bgMusic);
        
        // Show volume controls
        const volumeControl = document.getElementById('volumeControl');
        if (volumeControl) volumeControl.style.display = 'flex';
        
        // Set up new volume slider with all new event listeners
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            const newSlider = volumeSlider.cloneNode(true);
            if (volumeSlider.parentNode) {
                volumeSlider.parentNode.replaceChild(newSlider, volumeSlider);
            }
            
            newSlider.addEventListener('input', () => {
                const value = newSlider.value / 100;
                if (bgMusic) bgMusic.volume = value;
                updateVolumeIcon(value);
            });
        }
        
        // Play with error handling - do NOT use promises here to avoid any chance
        // of the music trying to play multiple times
        try {
            const playResult = bgMusic.play();
            if (playResult && playResult.catch) {
                playResult.catch(err => {
                    console.error('Music play error caught:', err);
                });
            }
            console.log('Music started successfully');
        } catch (e) {
            console.error('Music start error:', e);
        }
    }, 100);
}

// Helper function to update volume icon
function updateVolumeIcon(volume) {
    const icon = document.getElementById('volumeIcon');
    if (!icon) return;
    
    if (volume === 0) {
        icon.textContent = '🔇';
    } else if (volume < 0.33) {
        icon.textContent = '🔈';
    } else if (volume < 0.67) {
        icon.textContent = '🔉';
    } else {
        icon.textContent = '🔊';
    }
}

// Prevent ANY music from playing anywhere except through our controlled function
// Block ALL attempts to play audio
const originalAudioPlay = Audio.prototype.play;
Audio.prototype.play = function() {
    // Only allow audio to play if it's explicitly from our controlled function
    // or if it's a sound effect (not music)
    if (this.src && this.src.includes('groovy.ogg') && !window.musicAlreadyPlaying) {
        console.log('BLOCKED unauthorized music play attempt');
        return Promise.reject('Music blocked - use startBackgroundMusic only');
    }
    
    // Allow other sounds like explosion and sploot
    return originalAudioPlay.apply(this);
};

// Function to play the sound with pitch adjustment
function playSplootSound(pitchMultiplier) {
    // Create a new audio element each time for pitch adjustment
    const audio = new Audio('./static/sploot.ogg');
    audio.volume = 0.5;
    
    // Set the playback rate to adjust pitch (force number type conversion)
    audio.preservesPitch = false; // Important for pitch shifting
    audio.playbackRate = Number(pitchMultiplier);
    
    // Log the pitch value to ensure it's working
    console.log('Playing sploot with pitch:', audio.playbackRate);
    
    // Force audio to play
    audio.play().catch(e => {
        console.log('Audio play error:', e);
        // Fallback method if the first one fails
        splotAudio.play().catch(err => console.log('Fallback audio error:', err));
    });
}

// Physics variables for the entrything button
// EDIT THIS VALUE: Higher = faster progression, lower = slower progression
// Try values between 0.01 (very slow progression) and 0.1 (fast progression)
const SPEED_PROGRESSION_FACTOR = 5; // <-- MODIFY THIS VALUE ONLY

let dx = 0, dy = 0;
let vx = 0, vy = 0;
let rotation = 0;
let vrotation = 0;
let scale = 1;
let vscale = 0;
const friction = 0.99; // Extremely high friction for much slower movement
const gravity = 0.04; // Drastically reduced gravity
const springFactor = 0.015; // Drastically reduced spring factor
const rotationSpring = 0.015;
const scaleSpring = 0.008;
let animating = false;

function updatePhysics() {
    if (!animating) return;
    
    // Apply spring forces to move back to center
    vx += (-dx * springFactor);
    vy += (-dy * springFactor + gravity);
    vrotation += (-rotation * rotationSpring);
    vscale += ((1 - scale) * scaleSpring);
    
    // Apply velocities with higher friction for more responsive feel
    dx = dx * friction + vx;
    dy = dy * friction + vy;
    rotation = rotation * friction + vrotation;
    scale = scale * friction + vscale;
    
    // Apply limits
    rotation = Math.max(-45, Math.min(45, rotation));
    scale = Math.max(0.5, Math.min(1.5, scale));
    
    // Apply transform with forced style application
    entrything.style.cssText = `
        transform: translate(${dx}px, ${dy}px) rotate(${rotation}deg) scale(${scale});
        transition: none !important;
        animation: none !important;
    `;
    
    // Stronger dampening to ensure it stops more quickly
    vx *= 0.92;
    vy *= 0.92;
    vrotation *= 0.92;
    vscale *= 0.92;
    
    // Stop when movement becomes very small
    if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1 && Math.abs(vrotation) < 0.1 && Math.abs(vscale) < 0.01 && 
        Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(rotation) < 1 && Math.abs(scale - 1) < 0.01) {
        animating = false;
        // Reset button to original appearance
        entrything.classList.remove('entrything-physics');
        entrything.style.cssText = '';
        // Resume wobble animation
        entrything.style.animation = 'wobble 2s infinite ease-in-out';
    } else {
        requestAnimationFrame(updatePhysics);
    }
}

entrything.addEventListener('click', (e) => {
    // Stop any existing animations and CSS transitions
    entrything.style.animation = 'none';
    entrything.style.transition = 'none';
    
    // Remove wobble animation temporarily
    entrything.classList.add('entrything-physics');
    
    clickCount++;
    
    // Update click counter with dynamic effect - allow overlapping animations
    clickCounter.textContent = `Clicks: ${clickCount}/10`;
    clickCounter.classList.remove('updated');
    void clickCounter.offsetWidth; // Trigger reflow
    clickCounter.classList.add('updated');
    
    // Create particle burst on each click
    const rect = entrything.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createParticleBurst(x, y, 15);
    
    // Play click sound with normal pitch increase
    const pitchMultiplier = 0.8 + (clickCount * 0.2); // 0.8, 1.0, 1.2, 1.4, 1.6
    playSplootSound(pitchMultiplier);
    
    // Reset physics values
    dx = 0;
    dy = 0;
    rotation = 0;
    scale = 0.7; // Start with squish
    
    // Calculate force direction based on where the button was clicked
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // SIMPLIFIED APPROACH: First click is very slow, then gradually increases based on SPEED_PROGRESSION_FACTOR
    
    // Base values for the first click - these will be very slow
    const baseVelocityX = 0.5;
    const baseVelocityY = 0.5;
    const baseRotation = 2;
    const baseScale = 0.02;
    
    // Calculate multiplier based on click count - first click will use base values
    const velocityMultiplier = 1 + (clickCount - 1) * SPEED_PROGRESSION_FACTOR;
    
    // Apply the multiplier directly to all motion values
    vx = ((e.clientX - centerX) / rect.width) * baseVelocityX * velocityMultiplier;
    vy = ((e.clientY - centerY) / rect.height) * baseVelocityY * velocityMultiplier - 1;
    vrotation = (Math.random() - 0.5) * baseRotation * velocityMultiplier;
    vscale = baseScale * velocityMultiplier;
    
    // Ensure animation is running
    animating = true;
    
    // Force an immediate animation frame
    updatePhysics();
    
    // When 10 clicks are reached, show explosion and reveal site
    if (clickCount >= 10) {
        // Hide entrything with fancy effect
        entrything.style.transform = 'scale(2) rotate(720deg)';
        entrything.style.opacity = '0';
        clickCounter.style.transform = 'scale(2)';
        clickCounter.style.opacity = '0';
        
        // Show explosion
        explosion.style.display = 'block';
        
        // Play explosion sound
        const explosionSound = new Audio('./static/explosion.ogg');
        explosionSound.volume = 0.7;
        explosionSound.play();
        
        // Dissolve background
        entryOverlay.classList.add('dissolving');
        
        // After explosion animation, show main content
        setTimeout(() => {
            // Hide explosion GIF after it's played once
            explosion.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Add reveal class to main-content to trigger animations
            document.querySelector('.main-content').classList.add('revealed');
            
            // This is the ONLY place we will ever start music
            setTimeout(() => {
                // First, make sure ANY existing audio is completely silenced
                document.querySelectorAll('audio').forEach(audio => {
                    audio.pause();
                    audio.currentTime = 0;
                });
                console.clear(); // Clear any console messages to make debugging easier
                console.log('=== STARTING MUSIC AFTER ENTRY ANIMATION ===');
                startBackgroundMusic();
            }, 800); // Increased delay to be absolutely sure
        }, 1500);
    }
});

// Initialize fan art gallery when page loads
window.addEventListener('load', () => {
    loadFanArt();
    
    // Add minimize buttons to fanart container and bear counter
    addMinimizeButtons();
    
    // Auto-advance slides every 6 seconds (25% faster than before)
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 6000);
});

// Create particle burst effect
// Add minimize buttons to fan art gallery and bear counter
function addMinimizeButtons() {
    // Add minimize button to fanart container
    const fanartContainer = document.querySelector('.fanart-container');
    if (fanartContainer) {
        const fanartMinimizeBtn = document.createElement('button');
        fanartMinimizeBtn.className = 'minimize-btn';
        fanartMinimizeBtn.textContent = '-';
        
        // Create maximize button that will be shown when minimized
        const fanartMaximizeBtn = document.createElement('button');
        fanartMaximizeBtn.className = 'maximize-btn';
        fanartMaximizeBtn.textContent = '+';
        fanartMaximizeBtn.style.left = '50px';
        fanartMaximizeBtn.style.top = '50%';
        fanartMaximizeBtn.style.transform = 'translateY(-50%)';
        fanartMaximizeBtn.style.display = 'none';
        document.body.appendChild(fanartMaximizeBtn);
        
        // Add click handlers
        fanartMinimizeBtn.addEventListener('click', () => {
            fanartContainer.classList.add('minimized');
            fanartMaximizeBtn.style.display = 'flex';
        });
        
        fanartMaximizeBtn.addEventListener('click', () => {
            fanartContainer.classList.remove('minimized');
            fanartMaximizeBtn.style.display = 'none';
        });
        
        fanartContainer.appendChild(fanartMinimizeBtn);
    }
    
    // Add minimize button to bear counter
    const bearCounter = document.querySelector('.bear-counter');
    if (bearCounter) {
        const counterMinimizeBtn = document.createElement('button');
        counterMinimizeBtn.className = 'minimize-btn';
        counterMinimizeBtn.textContent = '-';
        
        // Create maximize button that will be shown when minimized
        const counterMaximizeBtn = document.createElement('button');
        counterMaximizeBtn.className = 'maximize-btn';
        counterMaximizeBtn.textContent = '+';
        counterMaximizeBtn.style.right = '50px';
        counterMaximizeBtn.style.top = '50%';
        counterMaximizeBtn.style.transform = 'translateY(-50%)';
        counterMaximizeBtn.style.display = 'none';
        document.body.appendChild(counterMaximizeBtn);
        
        // Add click handlers
        counterMinimizeBtn.addEventListener('click', () => {
            bearCounter.classList.add('minimized');
            counterMaximizeBtn.style.display = 'flex';
        });
        
        counterMaximizeBtn.addEventListener('click', () => {
            bearCounter.classList.remove('minimized');
            counterMaximizeBtn.style.display = 'none';
        });
        
        bearCounter.appendChild(counterMinimizeBtn);
    }
}

function createParticleBurst(x, y, count = 20) {
    // Reduce particle count for performance
    const actualCount = Math.min(count, 15);
    
    for (let i = 0; i < actualCount; i++) {
        const particle = document.createElement("div");
        particle.style.position = "fixed";
        particle.style.width = `${Math.random() * 8 + 3}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = `hsl(${Math.random() * 60 + 20}, 100%, 50%)`;
        particle.style.borderRadius = "50%";
        particle.style.pointerEvents = "none";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.zIndex = "2000";
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 80 + 40; 
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        document.body.appendChild(particle);
        
        let opacity = 1;
        let scale = 1;
        
        function animateParticle() {
            if (opacity <= 0) {
                particle.remove();
                return;
            }
            
            const currentLeft = parseFloat(particle.style.left);
            const currentTop = parseFloat(particle.style.top);
            
            particle.style.left = (currentLeft + vx) + 'px';
            particle.style.top = (currentTop + vy) + 'px';
            
            opacity -= 0.02;
            scale += 0.02;
            
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${scale})`;
            
            requestAnimationFrame(animateParticle);
        }
        
        requestAnimationFrame(animateParticle);
    }
}

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Review functionality
const reviewButton = document.getElementById('reviewButton');
const reviewModal = document.getElementById('reviewModal');
const closeModal = document.querySelector('.close-modal');
const sendReviewButton = document.getElementById('sendReviewButton');
const reviewText = document.getElementById('reviewText');
const reviewStatus = document.getElementById('reviewStatus');

// Temporarily disable the review system for safe deployment
// Disable and gray out the send button
document.addEventListener('DOMContentLoaded', async function () {
    const reviewApiServerConfig = await getServerConfig();
    if (!reviewApiServerConfig.canUserReview) {
        const sendButton = document.getElementById('sendReviewButton');
        const reviewInfo = document.querySelector('.review-info');

        if (sendButton) {
            sendButton.disabled = true;
            sendButton.style.opacity = "0.5";
            sendButton.style.cursor = "not-allowed";
            sendButton.title = "Reviews are temporarily disabled";
        }
        
        if (reviewInfo) { 
            reviewInfo.textContent = "(Reviews temporarily disabled)"; 
        }
    }
});

const isLocalhost = (window.location.hostname === "127.0.0.1") || (window.location.hostname === "localhost");
const reviewApiClientConfig = { 
    apiUrl: isLocalhost ? 'http://localhost:3002' : 'https://api.beardabear.com',
    apiKey: "24ff18a3679bdf6b0633a9db492117a0"
};

async function getServerConfig() {
    const response = await fetch(`${reviewApiClientConfig.apiUrl}/api/v1/config`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    
    return await response.json();
}

// Add a function to check if a user can leave a review (cooldown)
const canUserReview = () => {
    const lastReviewTime = localStorage.getItem('lastReviewTime');
    if (!lastReviewTime) return true;
    
    const now = new Date().getTime();
    const timeSinceLastReview = now - parseInt(lastReviewTime);
const oneMinuteInMs = 1; // 1 ms cooldown!
    
    return timeSinceLastReview > oneMinuteInMs;
};

// Track when user submits a review
const setUserReviewTime = () => {
    localStorage.setItem('lastReviewTime', new Date().getTime().toString());
};

// Get remaining cooldown time
const getRemainingCooldownTime = () => {
    const lastReviewTime = parseInt(localStorage.getItem('lastReviewTime'));
    const now = new Date().getTime();
const oneMinuteInMs = 1; // 1 ms cooldown!
    return Math.ceil(timeLeftMs / 1000);
};

// Open modal when review button is clicked
reviewButton.addEventListener('click', () => {
    reviewModal.style.display = 'flex';
    reviewText.focus();
    
    // Check if user is on cooldown
    if (!canUserReview()) {
        const timeLeftSec = getRemainingCooldownTime();
        reviewStatus.textContent = `Please wait ${timeLeftSec} seconds before submitting another review.`;
        reviewStatus.style.color = '#ff6600';
        sendReviewButton.disabled = true;
        
        // Update the counter every second
        const countdownInterval = setInterval(() => {
            const timeLeftSec = getRemainingCooldownTime();
            if (timeLeftSec <= 0) {
                reviewStatus.textContent = '';
                sendReviewButton.disabled = false;
                clearInterval(countdownInterval);
            } else {
                reviewStatus.textContent = `Please wait ${timeLeftSec} seconds before submitting another review.`;
            }
        }, 1000);
        
        // Clear interval if modal is closed
        closeModal.addEventListener('click', () => {
            clearInterval(countdownInterval);
        }, { once: true });
    } else {
        reviewStatus.textContent = '';
        sendReviewButton.disabled = false;
    }
});

// Close modal when X is clicked
closeModal.addEventListener('click', () => {
    reviewModal.style.display = 'none';
    reviewStatus.textContent = '';
    reviewText.value = '';
});

// Close modal when clicking outside the content
reviewModal.addEventListener('click', (e) => {
    if (e.target === reviewModal) {
        reviewModal.style.display = 'none';
        reviewStatus.textContent = '';
        reviewText.value = '';
    }
});

// Send review to the bot's API
sendReviewButton.addEventListener('click', async () => {
    const reviewApiServerConfig = await getServerConfig();
    if (!reviewApiServerConfig.canUserReview) {
        reviewStatus.textContent = 'Reviews are temporarily disabled. Check back soon!';
        reviewStatus.style.color = '#ff6600';
        return;
    }
    
    // The code below won't run due to the early return
    // Check cooldown again
    if (!canUserReview()) {
        reviewStatus.textContent = 'Please wait before submitting another review.';
        reviewStatus.style.color = '#ff0000';
        return;
    }
    
    const review = reviewText.value.trim();
    
    if (!review) {
        reviewStatus.textContent = 'Please enter a review!';
        reviewStatus.style.color = '#ff0000';
        return;
    }
    
    try {
        // Disable the button during processing
        sendReviewButton.disabled = true;
        reviewStatus.textContent = 'Sending review...';
        reviewStatus.style.color = '#7d4900';
        
        // Prepare the request data
        const requestData = {
            review: review,
            username: 'Website User', // You could collect usernames if desired
            userInfo: {
                browser: navigator.userAgent,
                screenSize: `${window.screen.width}x${window.screen.height}`,
                timeOnSite: getTimeSpentOnSite()
            }
        };
        
        // IMPORTANT NOTE: In a real production system, you would NOT include the API key directly in client-side code
        // Instead, you would have your backend server handle this authentication
        // This implementation is for demo purposes only
        
        // For demo purposes, we're using a simulated server response
        // Comment this out and uncomment the fetch call below for real API integration
        // simulateServerResponse(requestData);
        
        const response = await fetch(`${reviewApiClientConfig.apiUrl}/api/v1/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': reviewApiClientConfig.apiKey
            },
            body: JSON.stringify(requestData)
        });
        
        const responseData = await response.json();
        if (response.ok || (response.status >= 200 && response.status <= 203)) {
            localStorage.setItem('lastReviewId', responseData.id);
            reviewStatus.textContent = 'Review sent successfully! Thank you!';
            reviewStatus.style.color = '#00aa00';
            reviewText.value = '';
            
            // Show the response section
            const responseSection = document.getElementById('responseSection');
            if (responseSection) {
                responseSection.style.display = 'block';
            }
            
            // Set cooldown timer
            setUserReviewTime();
            
            // Close modal after a delay
            setTimeout(() => {
                reviewModal.style.display = 'none';
                reviewStatus.textContent = '';
            }, 2000);
            
            // Show thank you effect
            createThankYouEffect();
        } else {
            throw new Error(responseData.error || 'Failed to send review');
        }
    } catch (error) {
        console.error('Error sending review:', error);
        reviewStatus.textContent = 'Error sending review. Please try again later.';
        reviewStatus.style.color = '#ff0000';
    } finally {
        // Re-enable the button
        setTimeout(() => {
            sendReviewButton.disabled = false;
        }, 2000);
    }
});

// For demonstration purposes: simulate server response
function simulateServerResponse(requestData) {
    console.log('Simulating server processing of review:', requestData);
    
    // Generate a fake review ID
    const reviewId = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
    
    // Store the review ID for checking responses later
    localStorage.setItem('lastReviewId', reviewId);
    
    // Update UI as if the request succeeded
    reviewStatus.textContent = 'Review sent successfully! Thank you!';
    reviewStatus.style.color = '#00aa00';
    reviewText.value = '';
    
    // Set cooldown timer
    setUserReviewTime();
    
    // Close modal after a delay
    setTimeout(() => {
        reviewModal.style.display = 'none';
        reviewStatus.textContent = '';
    }, 2000);
    
    // Show thank you effect
    createThankYouEffect();
}

// Create thank you effect with bear animations
function createThankYouEffect() {
    // Create explosion of bears as thanks
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const bear = document.createElement('img');
            bear.src = './static/bear.gif';
            bear.style.position = 'fixed';
            bear.style.width = '50px';
            bear.style.height = '50px';
            bear.style.zIndex = '9998';
            bear.style.top = `${Math.random() * 100}%`;
            bear.style.left = `${Math.random() * 100}%`;
            bear.style.transform = 'rotate(0deg)';
            bear.style.transition = 'all 0.5s ease-in-out';
            
            document.body.appendChild(bear);
            
            // Animate bears
            setTimeout(() => {
                bear.style.transform = `rotate(${Math.random() * 360}deg) scale(2)`;
                bear.style.opacity = '0';
            }, 100);
            
            // Remove bears after animation
            setTimeout(() => {
                bear.remove();
            }, 1000);
        }, i * 100);
    }
    
    // Create thank you text
    const thankYouText = document.createElement('div');
    thankYouText.textContent = 'Thank You!';
    thankYouText.style.position = 'fixed';
    thankYouText.style.top = '50%';
    thankYouText.style.left = '50%';
    thankYouText.style.transform = 'translate(-50%, -50%) scale(0)';
    thankYouText.style.color = 'var(--primary)';
    thankYouText.style.fontSize = '60px';
    thankYouText.style.fontWeight = 'bold';
    thankYouText.style.zIndex = '9999';
    thankYouText.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
    thankYouText.style.transition = 'all 0.5s ease-in-out';
    
    document.body.appendChild(thankYouText);
    
    // Animate thank you text
    setTimeout(() => {
        thankYouText.style.transform = 'translate(-50%, -50%) scale(1.5)';
    }, 100);
    
    setTimeout(() => {
        thankYouText.style.transform = 'translate(-50%, -50%) scale(0)';
    }, 1500);
    
    setTimeout(() => {
        thankYouText.remove();
    }, 2000);
}

// Functions for checking responses
function setupResponseChecking() {
    const checkResponseButton = document.getElementById('checkResponseButton');
    if (!checkResponseButton) return;
    
    // Show the response section when opening the modal if a review exists
    reviewButton.addEventListener('click', () => {
        const responseSection = document.getElementById('responseSection');
        const lastReviewId = localStorage.getItem('lastReviewId');
        
        if (lastReviewId && responseSection) {
            responseSection.style.display = 'block';
        } else if (responseSection) {
            responseSection.style.display = 'none';
        }
    });
    
    checkResponseButton.addEventListener('click', async () => {
        const responseStatus = document.getElementById('responseStatus');
        const responseContainer = document.getElementById('responseContainer');
        const reviewId = localStorage.getItem('lastReviewId');
        
        if (!reviewId) {
            responseStatus.textContent = 'No review found. Please submit a review first.';
            return;
        }
        
        responseStatus.textContent = 'Checking for responses...';
        responseContainer.style.display = 'none';
        
        try {
            // For demonstration purposes - comment out to use simulated responses
            // simulateResponseCheck(reviewId, responseStatus, responseContainer);
            // return;
            
            const response = await fetch(`${reviewApiClientConfig.apiUrl}/api/v1/reviews/${reviewId}/response`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': reviewApiClientConfig.apiKey
                }
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
                if (responseData.hasResponse) {
                    responseStatus.textContent = 'Response found!';
                    responseContainer.style.display = 'block';
                    
                    // Format the date
                    const responseDate = new Date(responseData.timestamp).toLocaleString();
                    
                    responseContainer.innerHTML = `
                        <div class="response-card">
                            <h4>Response from BearDaBear:</h4>
                            <p>${responseData.response}</p>
                            <div class="response-date">${responseDate}</div>
                        </div>
                    `;
                } else {
                    responseStatus.textContent = 'No response yet. Please check again later.';
                    responseContainer.style.display = 'none';
                }
            } else {
                throw new Error(responseData.error || 'Failed to check for responses');
            }
        } catch (error) {
            console.error('Error checking for responses:', error);
            responseStatus.textContent = 'Error checking for responses. Please try again later.';
        }
    });
}

// For demonstration purposes: simulate response check
function simulateResponseCheck(reviewId, responseStatus, responseContainer) {
    console.log('Simulating response check for review:', reviewId);
    
    // 50% chance of having a response
    const hasResponse = Math.random() > 0.5;
    
    setTimeout(() => {
        if (hasResponse) {
            const responseOptions = [
                "Thank you for your review! We're glad you're enjoying the website.",
                "Thanks for the feedback! We appreciate you taking the time to share your thoughts.",
                "We're happy to hear from you! Your review has been noted.",
                "Thank you for your review! We hope you continue to enjoy the website."
            ];
            
            const response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
            
            responseStatus.textContent = 'Response found!';
            responseContainer.style.display = 'block';
            responseContainer.innerHTML = `
                <div class="response-card">
                    <h4>Response from BearDaBear:</h4>
                    <p>${response}</p>
                    <div class="response-date">${new Date().toLocaleString()}</div>
                </div>
            `;
        } else {
            responseStatus.textContent = 'No response yet. Please check again later.';
            responseContainer.style.display = 'none';
        }
    }, 1000);
}

// Initialize the response checking when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setupResponseChecking();
});
