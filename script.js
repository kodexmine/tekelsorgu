async function logSorgula() {
    const site = document.getElementById('siteInput').value;
    const btn = document.getElementById('sorguBtn');
    const resultBox = document.getElementById('resultBox');
    const loader = document.getElementById('loader');

    if (!site) { alert("Site girin!"); return; }

    btn.disabled = true;
    document.getElementById('statusArea').classList.remove('hidden');
    loader.innerText = "BAĞLANIYOR...";
    resultBox.innerText = "";

    // API ve Proxy
    const api_url = `https://free.zirveexec.com/api_public.php?site=${site}`;
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(api_url)}`;

    try {
        const response = await fetch(proxy);
        const json = await response.json();
        const data = json.contents;

        if (!data || data.length < 10) {
            loader.innerText = "HATA!";
            resultBox.innerText = "API boş döndü veya site bulunamadı.";
            return;
        }

        // Temizleme işlemi
        let clean = data.split('\n').filter(l => 
            l.includes(':') && !l.includes('http') && !l.includes('t.me')
        ).join('\n').trim();

        if (clean.length > 5) {
            loader.innerText = "LOG İNDİRİLİYOR...";
            resultBox.innerText = clean;
            
            // Dosyayı İndir
            const blob = new Blob([clean], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `tekel_${site}.txt`;
            a.click();
        } else {
            loader.innerText = "TEMİZ VERİ YOK!";
            resultBox.innerText = "Log bulundu ama içinde giriş bilgisi yok.";
        }
    } catch (e) {
        loader.innerText = "BAĞLANTI KESİLDİ!";
        resultBox.innerText = "Proxy veya API şu an yanıt vermiyor.";
    } finally {
        btn.disabled = false;
    }
}
