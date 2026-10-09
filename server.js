const express = require('express');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const app = express();

const PORT = process.env.PORT || 3000;

// تفعيل CORS الشامل للسماح للمتصفح بالوصول الكامل للبث
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// مصفوفة القنوات بالـ IP المباشر (تأكد من كتابة الـ IP الصحيح هنا بدلاً من الدومين)
const channels = {
    "1": { name: "beIN Sports 1", logo: "https://lo1.in/bss/bsS1.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677012" },
    "2": { name: "beIN Sports 2", logo: "https://lo1.in/bss/bsS2.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677013" },
    "3": { name: "beIN Sports 3", logo: "https://lo1.in/bss/bs3.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677014" },
    "4": { name: "beIN Sports 4", logo: "https://lo1.in/bss/bs4.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677015" },
    "5": { name: "beIN Sports 5", logo: "https://lo1.in/bein/beinn5.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677016" },
    "6": { name: "beIN Sports 6", logo: "https://lo1.in/bein/beinn6.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677017" },
    "7": { name: "beIN Sports 7", logo: "https://lo1.in/bss/BEIN SPORTS 07.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677018" },
    "8": { name: "beIN Sports 8", logo: "https://lo1.in/bss/bss8.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677019" }
};

app.get('/channel/info-all', (req, res) => {
    res.json(channels); 
});

app.get('/live/:id', (req, res) => {
    let channelId = req.params.id;
    if (channelId.endsWith('.ts')) { channelId = channelId.replace('.ts', ''); }

    const channel = channels[channelId];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    const targetUrl = `${channel.url}?output=ts`;
    const parsedUrl = new URL(targetUrl);
    
    // إجبار النظام على استخدام http العادي المتوافق مع منفذ سيرفر البث الخارجي 2052
    const client = http; 

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        }
    };

    const proxyReq = client.get(options, (proxyRes) => {
        // إرجاع ترويسات متوافقة مع مشغلات بث الويب والـ MPEG-TS
        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        console.error("Proxy Error:", err.message);
        if (!res.headersSent) res.status(500).send('خطأ اتصال بالسيرفر الأصلي');
    });

    req.on('close', () => { proxyReq.destroy(); });
});

app.get('/', (req, res) => res.status(200).send('Proxy Server Running!'));
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
