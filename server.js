const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. تفعيل CORS للسماح لتطبيق الـ APK بالاتصال وجلب البيانات والبث بدون حظر
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    next();
});

// قاعدة بيانات القنوات المحمية الخاصة بك
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

// دالة جلب معلومات القناة بالكامل
app.get('/channel/info-all', (req, res) => {
    res.json(channels);
});

// دالة تشغيل البث المحدثة لحل مشكلة المشغل الافتراضي و ExoPlayer
app.get('/channel/stream/:id', async (req, res) => {
    const channel = channels[req.params.id];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    try {
        const response = await axios({
            method: 'get',
            url: channel.url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) / IPTV-Player'
            }
        });

        // التعديل الذكي: قراءة نوع المحتوى الحقيقي القادم من سيرفر Xtream وتمريره مباشرة للمشغل
        const contentType = response.headers['content-type'] || 'video/mp2t';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Cache-Control', 'no-cache');
        
        // دعم طلبات أجزاء الفيديو (Range Requests) الهامة جداً لمشغلات أندرويد لتقديم وتأخير الفيديو بثبات
        if (response.headers['accept-ranges']) {
            res.setHeader('Accept-Ranges', response.headers['accept-ranges']);
        }

        response.data.pipe(res);

    } catch (error) {
        console.error("خطأ البث المباشر:", error.message);
        res.status(500).send('خطأ في الاتصال بسيرفر البث المباشر');
    }
});

app.get('/', (req, res) => {
    res.status(200).send('Server is Live and Running!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
