async function songFinder() {
    try {
        const song = document.querySelector("#searchbar1").value;
        const artist = document.querySelector("#searchbar2").value;
        
        if (!song || !artist) {
            throw new Error("Preencha os campos de música e artista.");
        }

        const response = await fetch(
            `https://musicbrainz.org/ws/2/recording/?query=recording:${encodeURIComponent(song)}+AND+artist:${encodeURIComponent(artist)}&fmt=json`,
            {
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "SeuApp/1.0 (contato@exemplo.com)"
                }
            }
        );

        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

        const dados = await response.json();
        if (!dados.recordings || dados.recordings.length === 0) {
            throw new Error("Música não encontrada.");
        }

        const musica = dados.recordings[0];
        const releaseId = musica.releases?.[0]?.id;

        if (releaseId) {
            const coverArtUrl = `https://coverartarchive.org/release/${releaseId}/front-500`;
            
            const img = new Image();
            img.src = coverArtUrl;
            img.onload = () => {
            
                document.querySelector("#albumCover").src = coverArtUrl;
                document.querySelector("#albumCover").style.display = "block";
            };
            img.onerror = () => {
                document.querySelector("#albumCover").src = "https://i.pinimg.com/originals/a6/27/66/a62766d407d8e7aae9d20d8204cb6b07.gif";
                console.log("Capa não encontrada no Cover Art Archive.");
            };
        }

        document.querySelector("#songName").textContent = musica.title;
        document.querySelector("#artist").textContent = musica["artist-credit"]?.[0]?.name || "N/A";
        document.querySelector("#album").textContent = musica.releases?.[0]?.title || "N/A";
        document.querySelector("#length").textContent = musica.length 
            ? `${Math.floor(musica.length / 60000)}:${String(Math.floor((musica.length % 60000) / 1000)).padStart(2, '0')}` 
            : "N/A";
        document.querySelector("#artist").textContent = musica["artist-credit"]?.slice(0).map(a => a.name).join(", ") || "N/A";
       
    } catch (error) {
        console.error("Erro:", error.message);
        alert(`Erro: ${error.message}`);
    }
}