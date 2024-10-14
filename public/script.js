async function fetchProgress() {
    try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        displayProgress(data);
    } catch (error) {
        console.error('Error fetching progress:', error);
    }
}

function displayProgress(progress) {
    const discordMessage = document.getElementById('discord-message');
    let content = '<h2>World of Warcraft Raid Progress</h2>';
    
    progress.forEach(boss => {
        content += `
            <div>
                <strong>${boss.boss}</strong>: ${boss.progress}%
                <div class="progress-bar">
                    <div class="progress" style="width: ${boss.progress}%"></div>
                </div>
            </div>
        `;
    });
    
    discordMessage.innerHTML = content;
}

fetchProgress();