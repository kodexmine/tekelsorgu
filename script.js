async function logSorgula() {
    const site = document.getElementById('siteInput').value;
    const btn = document.getElementById('sorguBtn');
    const resultBox = document.getElementById('resultBox');
    const loader = document.getElementById('loader');

    if (!site) { alert("Lütfen bir site girin!"); return; }

    btn.disabled = true;
    document.getElementById('statusArea').classList.remove('hidden');
    loader.innerText = "BAĞLANTI DENENİYOR...";
    resultBox.innerText = "";

    // API Adresi
    const api_url = `https://free.zirveexec.com/api_public.php?site=${site}`;
    
    // Farklı bir Proxy Deniyoruz (Daha stabil)
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(api_url)}`;

    try {
        const response = await fetch(proxy);
        if (!response.ok) throw new Error('Proxy Bağlantı Hatası');
        
        const json = await response.json();
        const data = json.contents;

        if (!data || data.length < 5) {
            loader.innerText = "API BOŞ!";
            resultBox.innerText = "Sunucudan veri gelmedi. API kapalı olabilir.";
            return;
        }

        loader.innerText = "TEMİZLENİYOR...";

        // Reklam ve Link Temizleme
        let lines = data.split('\n');
        let clean = lines.filter(line => {
            let l = line.trim().toLowerCase();
            return l.includes(':') && !l.includes('http') && !l.includes('t.me');
        }).join('\n').trim();

        if (clean.length > 5) {
            loader.innerText = "BAŞARILI! İNDİRİLİYOR...";
            resultBox.innerText = "Log alındı ve tekel ismiyle indiriliyor...";
            dosyayiIndir(site, clean);
        } else {
            loader.innerText = "TEMİZ VERİ YOK!";
            resultBox.innerText = "Giriş bilgisi bulunamadı.";
        }
    } catch (e) {
        loader.innerText = "HATA!";
        resultBox.innerText = "Hata Detayı: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

function dosyayiIndir(siteAdi, icerik) {
    const blob = new Blob([icerik], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date();
    const tarih = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
    
    // İsmin başında her zaman 'tekel' olacak şekilde ayarlandı
    a.href = url;
    a.download = `tekel_${siteAdi}_${tarih}.txt`;
    
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
