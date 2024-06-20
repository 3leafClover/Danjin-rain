document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const counters = {
        base: 0,
        maroon: 0,
        green: 0,
        blue: 0,
        rainbow: 0
    };

    let fd = 3000;
    let fd1 = 6000;
    const images = [
        { src: 'danjin.png', probability: 0.8089931, type: 'base' },  
        { src: 'danjin-maroon.png', probability: 0.13, type: 'maroon' },  
        { src: 'danjin-green.png', probability: 0.06, type: 'green' },  
        { src: 'danjin-blue.png', probability: 0.001, type: 'blue' },  
        { src: 'danjin-rainbow.png', probability: 0.0000069, type: 'rainbow' }
    ];

    const explosionGifUrl = 'https://i.gifer.com/origin/62/623cdcca882db2d7efa8d32424a61d29_w200.gif'; // URL of your explosion GIF
    let dropImageInterval = 100;
    let dropImageIntervalId;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomImage() {
        const rand = Math.random();
        let cumulativeProbability = 0;
        for (const image of images) {
            cumulativeProbability += image.probability;
            if (rand < cumulativeProbability) {
                return image;
            }
        }
        return images[images.length - 1];  // Fallback to the last image
    }

    function updateCounter(type) {
        counters[type]++;
        document.getElementById(type).textContent = counters[type];
        localStorage.setItem('counters', JSON.stringify(counters)); // Save to local storage
    }

    function loadCounters() {
        const savedCounters = localStorage.getItem('counters');
        if (savedCounters) {
            const parsedCounters = JSON.parse(savedCounters);
            for (const type in parsedCounters) {
                counters[type] = parsedCounters[type];
                document.getElementById(type).textContent = counters[type];
            }
        }
    }

    function showExplosion(x, y) {
        const explosion = document.createElement('img');
        explosion.src = explosionGifUrl;
        explosion.style.position = 'absolute';
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        explosion.style.width = '190px';  // Adjust size as needed
        explosion.style.pointerEvents = 'none';  // Ensure clicks pass through to other elements

        container.appendChild(explosion);

        // Remove explosion GIF after it plays (assuming 1 second duration)
        setTimeout(() => {
            container.removeChild(explosion);
        }, 200);  // Adjust duration as needed
    }

    function dropImage() {
        const image = getRandomImage();
        const img = document.createElement('img');
        img.src = image.src;
        img.style.width = `${getRandomInt(70, 150)}px`;
        img.style.opacity = `${getRandomInt(57, 100)}%`;
        img.style.left = `${getRandomInt(0, window.innerWidth - 100)}px`;
        img.style.top = `-${img.style.width}`;

        // Add click event to update the counter
        img.addEventListener('click', (event) => {
            updateCounter(image.type);
            container.removeChild(img);
            if (image.type === 'base') {
                const x = event.clientX - img.width / 2; // Center the explosion at the click
                const y = event.clientY - img.height / 2; // Center the explosion at the click
                showExplosion(x, y);
            }
        });

        container.appendChild(img);

        const fallDuration = getRandomInt(fd, fd1);  // Adjust fall duration by fd and fd1
        img.style.transition = `transform ${fallDuration}ms linear`;
        requestAnimationFrame(() => {
            img.style.transform = `translateY(${window.innerHeight + parseInt(img.style.width)}px)`;
        });

        setTimeout(() => {
            if (container.contains(img)) {
                container.removeChild(img);
            }
        }, fallDuration + 100);
    }

    loadCounters(); // Load counters from local storage when the page is loaded

    dropImageIntervalId = setInterval(dropImage, dropImageInterval);  // Drop an image every interval

    function playAudioLoop(url) {
        let audio = new Audio(url);
        audio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        audio.play();
    }

    playAudioLoop('dj-Nate - Thermodynamix.mp3');

    function flip() {
        console.log("Event 3: Danjins raining upside down.");
        container.style.transform = "rotate(180deg)";

        setTimeout(() => {
            container.style.transform = "";
            console.log("Event 3 ended: Danjins back to normal.");
        }, 120000); // Lasts for 2 minutes
    }

    function speedup() {
        console.log("Speedup event: Faster spawn rate and falling speed.");
        clearInterval(dropImageIntervalId);
        fd = 1500;  // Speed up falling duration
        fd1 = 300;  // Speed up falling duration
        dropImageInterval =15;  // Double the spawn rate

        dropImageIntervalId = setInterval(dropImage, dropImageInterval);

        setTimeout(() => {
            clearInterval(dropImageIntervalId);
            fd = 3000;  // Reset falling duration
            fd1 = 6000;  // Reset falling duration
            dropImageInterval = 100;  // Reset spawn rate

            dropImageIntervalId = setInterval(dropImage, dropImageInterval);
            console.log("Speedup event ended: Reset spawn rate and falling speed.");
        }, 120000); // Lasts for 2 minutes
    }

    function randomEvent() {
        const events = [flip, speedup];
        const randomIndex = Math.floor(Math.random() * events.length);
        events[randomIndex]();
    }

    setInterval(randomEvent, 300000); // Trigger a random event every 10 minutes

    const eventCdSpan = document.getElementById('event-cd');
    const eventInterval = 300000; // 10 minutes in milliseconds
    let countdown = eventInterval / 1000; // Convert to seconds

    function updateCountdown() {
        eventCdSpan.textContent = `Next event in: ${countdown} seconds`;
        countdown--;
        if (countdown < 0) {
            countdown = eventInterval / 1000; // Reset countdown to 10 minutes in seconds
        }
    }

    setInterval(updateCountdown, 1000); // Update countdown every second

});
