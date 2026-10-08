const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل CORS للسماح لتطبيق الـ APK بالاتصال بدون حظر
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    next();
});

// 1. هنا مصفوفة القنوات (تضع روابطك الحقيقية هنا)
const channels = {
   "1": {
    "name": "بي إن سبورت 1",
    "logo": "https://lo1.in/bss/bsS1.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677012"
  },
  "2": {
    "name": "بي إن سبورت 2",
    "logo": "https://lo1.in/bss/bsS2.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677013"
  },
  "3": {
    "name": "أم بي سي 1",
    "logo": "https://lo1.in/bss/bs3.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677014"
  },
    // باقي القنوات...
};

// دالة جلب معلومات كل القنوات للواجهة
app.get('/channel/info-all', (req, res) => {
    res.json(channels);
});


// 2. 👇 هنا تضع الأوامر التي استفسرت عنها بالضبط لقراءة وتمرير البث المباشر 👇
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

        const contentType = response.headers['content-type'] || 'video/mp2t';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Cache-Control', 'no-cache');
        
        if (response.headers['accept-ranges']) {
            res.setHeader('Accept-Ranges', response.headers['accept-ranges']);
        }

        response.data.pipe(res);

    } catch (error) {
        console.error("خطأ البث المباشر:", error.message);
        res.status(500).send('خطأ في الاتصال بسيرفر البث المباشر');
    }
});
// 👆 نهاية الأوامر 👆


// دالة فحص سلامة السيرفر لمنصة Render
app.get('/', (req, res) => {
    res.status(200).send('Server is Live and Running!');
});

// تشغيل السيرفر
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
