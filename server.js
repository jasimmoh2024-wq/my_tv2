const express = require('express');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const app = express();

const PORT = process.env.PORT || 3000;

// تفعيل CORS الشامل لمنع أي حظر للشبكة
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    next();
});

// ⚠️ قاعدة بيانات القنوات الحقيقية الخاصة بك
// استبدل روابط http://xtream-server.com بروابط اشتراكك الحقيقية لكي تعمل القنوات
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

// مسار جلب قائمة القنوات للواجهة
app.get('/channel/info-all', (req, res) => {
    res.json(channels); 
});

// مسار معالجة البث الذكي المحدث والمستقر بدون تفجير أو حجز باستخدام نواة HTTP
app.get('/live/:id', (req, res) => {
    let channelId = req.params.id;
    
    // قص الامتدادات لمعرفة الآيدي الصافي
    if (channelId.endsWith('.ts')) { channelId = channelId.replace('.ts', ''); }
    if (channelId.endsWith('.m3u8')) { channelId = channelId.replace('.m3u8', ''); }

    const channel = channels[channelId];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    // محاكاة طلب البث الحي وإجبار Xtream على المخرج الحي لـ ts
    const targetUrl = channel.url.includes('?') ? `${channel.url}&output=ts` : `${channel.url}?output=ts`;
    
    // تحليل الرابط لمعرفة الهوست والبروتوكول
    const parsedUrl = new URL(targetUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; LivePlayer) ExoPlayerLib/2.18.1',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        },
        timeout: 20000
    };

    // إرسال طلب البث بطريقة الأنابيب المباشرة فريم بفريم (Streaming Pipe)
    const proxyReq = client.get(options, (proxyRes) => {
        // تمرير ترويسات الفيديو الحقيقية لـ ExoPlayer
        res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'video/mp2t');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        if (proxyRes.headers['accept-ranges']) {
            res.setHeader('Accept-Ranges', proxyRes.headers['accept-ranges']);
        }

        // ضخ الميديا حياً وتلقائياً دون انتظار تجميع الملف
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        console.error("خطأ البث المباشر الخارجي للـ Node:", err.message);
        if (!res.headersSent) {
            res.status(500).send('تعذر الاتصال بسيرفر Xtream، تفقد الروابط المكتوبة.');
        }
    });

    // إغلاق الاتصال مع السيرفر الأصلي فور خروج المستخدم من القناة لمنع استهلاك الباندويث
    req.on('close', () => {
        proxyReq.destroy();
    });
});

app.get('/', (req, res) => {
    res.status(200).send('Server is Live and Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
