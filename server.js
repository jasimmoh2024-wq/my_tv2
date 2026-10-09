const express = require('express');
const http = require('http');
const { URL } = require('url');
const app = express();

const PORT = process.env.PORT || 3000;

// تفعيل الـ CORS لتشغيل المشغل في صفحة الـ HTML بدون حظر
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// مصفوفة القنوات الآمنة والمخفية داخل السيرفر (لن يراها المستخدم أبداً)
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

// إرسال أسماء القنوات والشعارات فقط للواجهة بدون إرسال الروابط الحقيقية (حماية 100%)
app.get('/channel/info-all', (req, res) => {
    const safeChannels = {};
    Object.keys(channels).forEach(id => {
        safeChannels[id] = { name: channels[id].name, logo: channels[id].logo };
    });
    res.json(safeChannels); 
});

// استقبال طلب البث وسحب الميديا فريم بـ فريم وإعادة ضخها للمستخدم بخفاء كامل
app.get('/live/:id', (req, res) => {
    let channelId = req.params.id;
    if (channelId.endsWith('.ts')) channelId = channelId.replace('.ts', '');

    const channel = channels[channelId];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    const targetUrl = `${channel.url}?output=ts`;
    const parsedUrl = new URL(targetUrl);

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
            // أهم خطوة: محاكاة تطبيق أندرويد حقيقي لتخطي حظر السيرفر الأصلي ومنع التأخير
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; LivePlayer) ExoPlayerLib/2.18.1',
            'X-Forwarded-For': '1.1.1.1', // خداع السيرفر بأن الطلب قادم من مستخدم عادي وليس من خادم Render
            'Accept': '*/*',
            'Connection': 'keep-alive'
        }
    };

    const proxyReq = http.get(options, (proxyRes) => {
        // تمرير ترويسات الفيديو المناسبة للمتصفح والمشغلات
        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Connection', 'keep-alive');

        // تمرير البيانات المباشرة بدون حفظ (Streaming Pipe)
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        console.error("خطأ وسيط البث:", err.message);
        if (!res.headersSent) res.status(500).send('خطأ اتصال بالسيرفر الأصلي');
    });

    // إنهاء الاتصال فور خروج المستخدم لتوفير الباندويث ومنع الكراش
    req.on('close', () => {
        proxyReq.destroy();
    });
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
