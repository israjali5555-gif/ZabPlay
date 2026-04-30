// === 1. SPLASH SCREEN LOGIC ===
window.addEventListener('load', function() {
    setTimeout(function() {
        const splash = document.getElementById('zabplay-splash');
        if(splash) {
            splash.style.transition = 'opacity 0.6s ease';
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 600);
        }
    }, 2500); 
});

// === 2. VIDEO FEED LOGIC (MASTER FIX) ===
const videoFeed = document.getElementById('main-video-feed');
const API_KEY = 'AIzaSyDq0kXgyqtOFXPjytI5yw5tuIZYl-xuTFs'; // Wahi API Key jo index.html mein thi
let isLoading = false;
let nextPageToken = ''; 
let loadedVideoIds = new Set();

// Smart Keywords for Infinite Variety
const searchKeywords = [
    "latest hindi movies 2026", "new south indian movies dubbed", 
    "trending songs 2026", "new bollywood movie trailers", 
    "popular web series episodes", "superhit comedy movies"
];

async function loadUnlimitedFeed() {
    if (isLoading) return;
    isLoading = true;

    // Loading indicator dikhao
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'block';

    // Har baar random keyword uthao taaki variety mile
    const randomQuery = searchKeywords[Math.floor(Math.random() * searchKeywords.length)];

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(randomQuery)}&type=video&pageToken=${nextPageToken}&key=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            nextPageToken = data.nextPageToken || ''; // Agle page ki chabi save karo

            data.items.forEach(item => {
                const vId = item.id.videoId;
                
                // FIXED: Agar video ID already hai, toh skip karo
                if (!vId || loadedVideoIds.has(vId)) return;
                loadedVideoIds.add(vId);

                const title = item.snippet.title;
                const author = item.snippet.channelTitle;
                const thumb = item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : item.snippet.thumbnails.medium.url;

                // Random views and duration for look and feel
                const views = (Math.random() * 50 + 1).toFixed(1) + "M";
                const dur = Math.floor(Math.random() * 60 + 10) + ":" + Math.floor(Math.random() * 59).toString().padStart(2, '0');

                const card = document.createElement('div');
                card.className = 'video-card';
                card.onclick = () => window.location.href = `player.html?v=${vId}`;
                card.innerHTML = `
                    <div class="thumbnail-container">
                        <img src="${thumb}">
                        <span style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.8); color:white; padding:2px 5px; border-radius:4px; font-size:12px;">${dur}</span>
                    </div>
                    <div class="video-info">
                        <div class="channel-icon" style="background-image: url('https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random'); background-size: cover; width: 40px; height: 40px; border-radius: 50%;"></div>
                        <div class="video-text">
                            <h3 style="font-size: 15px; margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${title}</h3>
                            <p style="font-size: 12px; color: #aaa; margin: 5px 0 0 0;">${author} • ${views} views • Trending</p>
                        </div>
                    </div>`;
                videoFeed.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Feed Error:", error);
    } finally {
        isLoading = false;
        if (loadingEl) loadingEl.style.display = 'none';
    }
}

// === 3. INFINITE SCROLL (ADVANCED) ===
// Ise monitor karne ke liye ek sentinel div HTML mein hona chahiye
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading && (nextPageToken || videoFeed.innerHTML === '')) {
        loadUnlimitedFeed();
    }
}, { threshold: 0.1 });

// Initialize Observer
window.addEventListener('DOMContentLoaded', () => {
    const sentinel = document.getElementById('sentinel');
    if (sentinel) observer.observe(sentinel);
    else loadUnlimitedFeed(); // Fallback agar sentinel na ho
});

// === 4. OTHER FUNCTIONS ===
function logout() { 
    localStorage.removeItem('isLoggedIn'); 
    window.location.href = 'login.html'; 
}

function checkUploadPermission() { 
    alert("ZabPlay: Upload feature coming soon!"); 
}
