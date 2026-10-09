const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. تفعيل CORS للسماح لتطبيق الهاتف بجلب البيانات والبث بدون أي حظر حماية
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    next();
});

// 2. قاعدة بيانات قنواتك الحقيقية
// ⚠️ تذكير: استبدل روابط http://xtream-server.com بروابط اشتراكك الحقيقية لكي تعمل القنوات
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
    }
};

// 3. دالة جلب معلومات كل القنوات للواجهة تلقائياً
app.get('/channel/info-all', (req, res) => {
    res.json(channels);
});

// 4. دالة معالجة وحقن البث المباشر وتخطي حظر سيرفرات Xtream
app.get('/channel/stream/:id', async (req, res) => {
    const channel = channels[req.params.id];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    try {
        // تم تعديل الخدعة هنا لتوهم السيرفر الأصلي أن الطلب قادم من ExoPlayer ونظام أندرويد لتخطي حظر الـ HTTP/1.1
        const response = await axios({
            method: 'get',
            url: channel.url,
            responseType: 'stream',
            timeout: 15000, 
            headers: {
                'User-Agent': 'ExoPlayerLib/2.18.1 (Linux;Android 13) ExoPlayerAdapter',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Icy-MetaData': '1'
            }
        });

        // قراءة صيغة البث الحقيقية وتمريرها تلقائياً
        const contentType = response.headers['content-type'] || 'video/mp2t';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Cache-Control', 'no-cache');
        
        if (response.headers['accept-ranges']) {
            res.setHeader('Accept-Ranges', response.headers['accept-ranges']);
        }

        // ضخ الدفق المباشر إلى تطبيق الهاتف
        response.data.pipe(res);

    } catch (error) {
        console.error("خطأ حظر Xtream أو اتصال:", error.message);
        if (error.response) {
            res.status(error.response.status).send(`خطأ من السيرفر الأصلي: ${error.response.status}`);
        } else {
            res.status(500).send('تعذر الاتصال بسيرفر Xtream، تأكد من صحة روابط القنوات.');
        }
    }
});

// دالة فحص سلامة السيرفر لمنصة Render
app.get('/', (req, res) => {
    res.status(200).send('Server is Live and Running!');
});

// تشغيل السيرفر
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
