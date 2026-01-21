async function logSorgula() {
    const site = document.getElementById('siteInput').value;
    const btn = document.getElementById('sorguBtn');
    const statusArea = document.getElementById('statusArea');
    const resultBox = document.getElementById('resultBox');
    const loader = document.getElementById('loader');

    if (!site) {
        alert("Sorgulamak için bir site adı yazmalısın!");
        return;
    }

    btn.disabled = true;
    btn.style.opacity = "0.5";
    statusArea.classList.remove('hidden');
    resultBox.innerText = "Sunucuya bağlanılıyor...";

    // API adresi ve Proxy birleşimi
    const targetUrl = `https://free.zirveexec.com/api_public.php?site=${site}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error('API Yanıt Vermedi');
        
        const data = await response.text();
        loader.innerText = "REKLAMLAR AYIKLANIYOR...";

        let lines = data.split('\n');
        let cleanLines = lines.filter(line => {
            let l = line.trim().toLowerCase();
            return l.includes(':') && 
                   !l.includes('http') && 
                   !l.includes('t.me') && 
                   !l.includes('@') && 
                   !l.includes('join') &&
                   l.length > 5;
        });

        let finalContent = cleanLines.join('\n').trim();

        if (finalContent.length < 5) {
            loader.innerText = "LOG BULUNAMADI!";
            resultBox.innerText = "Bu siteye ait temiz log verisi dönmedi.";
        } else {
            loader.innerText = "LOG TEMİZLENDİ, İNDİRİLİYOR...";
            resultBox.innerText = finalContent;
            dosyayiIndir(site, finalContent);
        }

    } catch (error) {
        loader.innerText = "BAĞLANTI HATASI!";
        resultBox.innerText = "API veya Proxy şu an yanıt vermiyor. Lütfen az sonra tekrar deneyin.";
        console.error("Hata:", error);
    } finally {
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}

function dosyayiIndir(siteAdi, icerik) {
    const blob = new Blob([icerik], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date();
    const tarih = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
    
    a.href = url;
    a.download = `tekel_${siteAdi}_${tarih}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
