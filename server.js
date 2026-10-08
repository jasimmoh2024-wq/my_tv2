const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل CORS للسماح لتطبيق الـ APK بجلب القنوات الحقيقية بدون حظر
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// قاعدة بيانات القنوات المحمية (روابط Xtream المصححة)
const channels = {
    "1": {
        name: "beIN Sports 1",
        logo: "https://lo1.in/bss/bsS1.png",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677012"
    },
    "2": {
        name: "beIN Sports 2",
        logo: "https://lo1.in/bss/bsS2.png",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677013"
    },
    "3": {
        name: "beIN Sports 3",
        logo: "https://lo1.in/bss/bs3.png",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677014"
    },
    "4": {
        name: "beIN Sports 4",
        logo: "https://lo1.in/bss/bs4.png",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677015"
    },
    "5": {
        name: "beIN Sports 5",
        logo: "https://lo1.in/bein/beinn5.png",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677016"
    },
    "6": {
        name: "beIN Sports 6",
        logo: "https://lo1.in/bein/beinn6.png",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677017"
    },
    "7": {
        name: "beIN Sports 7",
        logo: "https://lo1.in/bss/BEIN SPORTS 07.png",
        url: "http://http://tyqw.site:2052/10675785266958/99039021857485/677018"
    },
    "8": {
        name: "beIN Sports 8",
        logo: "https://https://lo1.in/bss/bss8.png",
        url: "http://http://tyqw.site:2052/10675785266958/99039021857485/677019"
    }
};

// دالة جلب معلومات القناة بصيغة متوافقة مع تطبيقات الموبايل والـ WebView
app.get('/channel/info-all', (req, res) => {
    res.json(channels);
});

// دالة تشغيل البث وحمايته وتصحيح نوع الدفق لقنوات Xtream المباشرة
app.get('/channel/stream/:id', async (req, res) => {
    const channel = channels[req.params.id];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    try {
        const response = await axios({
            method: 'get',
            url: channel.url,
            responseType: 'stream',
            headers: {
                // إيهام سيرفر Xtream أن الطلب قادم من مشغل مجاز وليس متصفح لعدم الحظر
                'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) / IPTV-Player'
            }
        });

        // السحر هنا: إجبار ExoPlayer والمتصفحات على تشغيل الرابط كبث مباشر بدلاً من تحميله
        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Cache-Control', 'no-cache');

        response.data.pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في الاتصال بسيرفر البث المباشر');
    }
});

// دالة فحص سلامة السيرفر لمنصة Render
app.get('/', (req, res) => {
    res.status(200).send('Server is Live and Running!');
});

// تشغيل السيرفر مع استقبال الاتصالات على النطاق الشامل لـ Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
