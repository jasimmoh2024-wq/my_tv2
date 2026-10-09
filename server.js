const express = require('express');
const http = require('http');
const { URL } = require('url');
const app = express();

const PORT = process.env.PORT || 3000;

// تفعيل CORS الشامل للسماح للمشغل بالوصول إلى البث بدون قيود المتصفح
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// 🔒 مصفوفة القنوات المحقونة والمحمية بالكامل داخل السيرفر (الجزء 1)
const iptvMatrix = [
  { id: "1", name: "beIN Sports 1", logo: "https://lo1.in/bss/bsS1.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677012?output=ts" },
  { id: "2", name: "beIN Sports 2", logo: "https://lo1.in/bss/bsS2.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677013?output=ts" },
  { id: "3", name: "beIN Sports 3", logo: "https://lo1.in/bss/bs3.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677014?output=ts" },
  { id: "4", name: "beIN Sports 4", logo: "https://lo1.in/bss/bs4.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677015?output=ts" },
  { id: "5", name: "beIN Sports 5", logo: "https://lo1.in/bein/beinn5.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677016?output=ts" },
  { id: "6", name: "beIN Sports 6", logo: "https://lo1.in/bein/beinn6.png", url: "http://tyqw.site:2052/10675785266958/99039021857485/677017?output=ts" },
];
// مسار إرسال الأسماء والشعارات فقط لحماية الروابط الأصلية من السرقة
app.get('/channel/info-all', (req, res) => {
    const safeChannels = {};
    Object.keys(channels).forEach(id => {
        safeChannels[id] = { name: channels[id].name, logo: channels[id].logo };
    });
    res.json(safeChannels); 
});

// مسار معالجة سحب البث وإعادة تدفقه بخفاء تام
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
            // محاكاة نظام أندرويد ومشغل ExoPlayer لتخطي جدران حماية الـ IPTV ومنع التعليق
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; LivePlayer) ExoPlayerLib/2.18.1',
            'X-Forwarded-For': '1.1.1.1', 
            'Accept': '*/*',
            'Connection': 'keep-alive'
        }
    };

    const proxyReq = http.get(options, (proxyRes) => {
        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Connection', 'keep-alive');

        // ضخ البيانات فريماً بفريم بشكل مباشر للمشغل
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        console.error("Proxy Error:", err.message);
        if (!res.headersSent) {
            res.status(500).send('تعذر الاتصال بالسيرفر الموزع الرئيسي.');
        }
    });

    req.on('close', () => {
        proxyReq.destroy();
    });
});

app.get('/', (req, res) => {
    res.status(200).send('Proxy Server for 44 Channels is Running and Secured!');
});

app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});
