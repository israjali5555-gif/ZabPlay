// === 1. SPLASH SCREEN LOGIC ===
// Jab page pura load ho jaye, toh 2.5 second baad splash screen hata do
window.addEventListener('load', function() {
    setTimeout(function() {
        const splash = document.getElementById('zabplay-splash');
        if(splash) {
            splash.style.transition = 'opacity 0.6s ease';
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 600);
        }
    }, 2500); // 2.5 Seconds ka wait
});

// === 2. VIDEO FEED LOGIC ===
const videoFeed = document.getElementById('main-video-feed');
let isLoading = false;
const displayedVideos = new Set();

// Ye wo channels hain jahan se movies/videos aayenge
// Maine list wahi rakhi hai jo aapne bhejii thi
const megaChannels = [
    'UCq-Fj5jknLsUf-MWSy4_brA', 'UCffXmS6lX_3-96mE9pYv6nw', 'UCttspZesZIDEwwpVIgoZtWQ', 
    'UC55IWq7n_6oK6-63_XU3T2w', 'UCi2E6n_S8uH566X4G698F_A', 'UCX6OQ3DkcsbYNE6H8uQQuVA',
    'UC2to_M9Wf5m6f5Uf_o6uFcA', 'UCynM4_V99A7l9Zp3_f_S2rQ', 'UC689oVpZOn_N_n_u08v-qkg',
    'UCk8GzjMOrvo8Ky_meK76w6A', 'UC3SshVq_E6eXpA_m4_X3C6Q', 'UC_aEa8K-EOJ3D6gOs7HcyNg',
    'UCpEhnqL0y41EpW2TvWAHD7Q', 'UCm7E7GZz_fB0sZzVbV_yYog', 'UC07-dOwgza1IguKA86jqx9w',
    'UCv2-u_8K-R_O-q6S-P_I8uy', 'UC0T_p-Z9_vLzX7l-L8G_j7A', 'UC89V_8N_f0f_fG_6_v8fS6A',
    'UC-K_S_W2_mX6E_R-zXU_K6A', 'UCF_fDSgPsS7C_S6DAt_oOzA', 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
    'UC7eHUXK_jS7Z-Fui_X7pA-w', 'UC-0p_YvYfE5mS9_rM_fGq6w', 'UCq9LpM_x_bB20-O96h-fX7A',
    'UC3SshVq_E6eXpA_m4_X3C6Q', 'UCU0D87mZ0A1K2uO0C6K9NlA', 'UCCu_996_rF4Fv8C6X4L_O_A'
];

async function loadUnlimitedFeed() {
    if (isLoading) return;
    isLoading = true;

    // Batch size thoda badha diya hai taaki feed jaldi bhare
    const batch = megaChannels.sort(() => 0.5 - Math.random()).slice(0, 15);
    
    const fetchPromises = batch.map(id => 
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${id}&nocache=${Math.random()}`)
        .then(res => res.json())
        .catch(() => ({items: []}))
    );

    const allResults = await Promise.all(fetchPromises);

    allResults.forEach(data => {
        if (data.items) {
            data.items.forEach(video => {
                const vId = video.link.split('v=')[1];
                if (vId && !displayedVideos.has(vId)) {
                    displayedVideos.add(vId);

                    const isM = video.title.toLowerCase().match(/(movie|film|full|drama|episode)/);
                    const dur = isM ? Math.floor(Math.random() * 60 + 120) + ":" + Math.floor(Math.random() * 59).toString().padStart(2, '0') : Math.floor(Math.random() * 8 + 3) + ":" + Math.floor(Math.random() * 59).toString().padStart(2, '0');
                    const views = (Math.random() * 90 + 1).toFixed(1) + "M";

                    const card = document.createElement('div');
                    card.className = 'video-card';
                    card.innerHTML = `
                        <a href="player.html?v=${vId}&t=${encodeURIComponent(video.title)}&c=${encodeURIComponent(video.author)}">
                            <div class="thumbnail-container">
                                <img src="https://img.youtube.com/vi/${vId}/maxresdefault.jpg" onerror="this.src='https://img.youtube.com/vi/${vId}/mqdefault.jpg'">
                                <span class="duration-badge">${dur}</span>
                            </div>
                            <div class="video-info">
                                <img src="https://ui-avatars.com/api/?name=${video.author}&background=random" class="channel-icon">
                                <div class="video-text">
                                    <h3>${video.title}</h3>
                                    <p>${video.author} • ${views} views • Trending</p>
                                </div>
                            </div>
                        </a>`;
                    videoFeed.appendChild(card);
                }
            });
        }
    });
    isLoading = false;
}

// Infinite Scroll logic
window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1500) {
        loadUnlimitedFeed();
    }
};

// Page load hone par feed start karein
window.onload = () => {
    loadUnlimitedFeed();
};

// === 3. OTHER FUNCTIONS ===
function logout() { 
    localStorage.removeItem('isLoggedIn'); 
    window.location.href = 'login.html'; 
}

function checkUploadPermission() { 
    alert("ZabPlay: Upload feature coming soon!"); 
}
