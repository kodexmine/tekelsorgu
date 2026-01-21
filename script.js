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
    resultBox.innerText = "Veri çekiliyor (Yöntem 2)...";
    loader.innerText = "SUNUCUYA BAĞLANILIYOR...";

    // API adresi
    const api_url = `https://free.zirveexec.com/api_public.php?site=${site}`;
    
    // AllOrigins Proxy kullanarak CORS engelini aşma
    const proxy_url = `https://api.allorigins.win/get?url=${encodeURIComponent(api_url)}`;

    try {
        const response = await fetch(proxy_url);
        if (!response.ok) throw new Error('Proxy Hatası');
        
        const json = await response.json(); // AllOrigins veriyi JSON içinde 'contents' olarak döndürür
        const data = json.contents;

        if (!data || data.includes("error")) {
            loader.innerText = "API HATASI!";
            resultBox.innerText = "API şu an boş dönüyor veya hatalı.";
            return;
        }

        loader.innerText = "TEMİZLENİYOR...";

        let lines = data.split('\n');
        let cleanLines = lines.filter(line => {
            let l = line.trim().toLowerCase();
            return l.includes(':') && 
                   !l.includes('http') && 
                   !l.includes('t.me') && 
                   !l.includes('@') && 
                   l.length > 5;
        });

        let finalContent = cleanLines.join('\n').trim();

        if (finalContent.length < 5) {
            loader.innerText = "LOG BULUNAMADI!";
            resultBox.innerText = "Filtreleme sonrası veri kalmadı. Ham veri:\n" + data.substring(0, 50);
        } else {
            loader.innerText = "BAŞARILI! İNDİRİLİYOR...";
            resultBox.innerText = finalContent;
            dosyayiIndir(site, finalContent);
        }

    } catch (error) {
        loader.innerText = "PROXY HATASI!";
        resultBox.innerText = "Lütfen tarayıcınızın gizli sekmesinden deneyin veya API'nin açık olduğundan emin olun.";
        console.error("Hata detayı:", error);
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
