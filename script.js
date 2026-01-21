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

    // Arayüzü kilitle ve başlat
    btn.disabled = true;
    btn.style.opacity = "0.5";
    statusArea.classList.remove('hidden');
    resultBox.innerText = "Bağlanıyor...";

    try {
        // API'den veriyi çek
        const response = await fetch(`https://free.zirveexec.com/api_public.php?site=${site}`);
        const data = await response.text();

        loader.innerText = "REKLAMLAR AYIKLANIYOR...";

        // TEMİZLEME FİLTRESİ
        let lines = data.split('\n');
        let cleanLines = lines.filter(line => {
            let l = line.trim().toLowerCase();
            // İçinde : olanları al (user:pass), reklam olabilecek her şeyi at
            return l.includes(':') && 
                   !l.includes('http') && 
                   !l.includes('t.me') && 
                   !l.includes('@') && 
                   !l.includes('join') &&
                   !l.includes('owner') &&
                   l.length > 5;
        });

        let finalContent = cleanLines.join('\n').trim();

        if (finalContent.length < 5) {
            loader.innerText = "LOG BULUNAMADI!";
            resultBox.innerText = "Aranan siteye ait temiz veri yok.";
        } else {
            loader.innerText = "LOG TEMİZLENDİ, İNDİRİLİYOR...";
            resultBox.innerText = finalContent;
            // Dosyayı indir
            dosyayiIndir(site, finalContent);
        }

    } catch (error) {
        loader.innerText = "BAĞLANTI HATASI!";
        resultBox.innerText = "API şu an meşgul veya kapalı.";
    } finally {
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}

function dosyayiIndir(siteAdi, icerik) {
    const blob = new Blob([icerik], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Tarih damgası (21-01-2026 gibi)
    const d = new Date();
    const tarih = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
    
    // DOSYA ADI: Her zaman tekel_ ile başlar
    a.href = url;
    a.download = `tekel_${siteAdi}_${tarih}.txt`;
    
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
