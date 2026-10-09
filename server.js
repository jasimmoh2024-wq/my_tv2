const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. تفعيل CORS الشامل لمنع أي حظر للشبكة مع تطبيق الـ APK
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    next();
});

// 2. قاعدة بيانات القنوات الحقيقية الخاصة بك
// ⚠️ ملاحظة: استبدل الروابط التجريبية بالأسفل بروابط اشتراكك الحقيقية لكي تعمل القنوات
const channels = {
  "1": {
    "name": "beIN Sports 1 ",
    "logo": "https://lo1.in/bss/bsS1.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677012"
  },
  "2": {
    "name": "beIN Sports 2",
    "logo": "https://lo1.in/bss/bsS2.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677013"
  },
  "3": {
    "name": "beIN Sports 3",
    "logo": "https://lo1.in/bss/bs3.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677014"
  },
  "4": {
    "name": "beIN Sports 4",
    "logo": "https://lo1.in/bss/bs4.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677015"
  },
  "5": {
    "name": "beIN Sports 5",
    "logo": "https://lo1.in/bein/beinn5.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677016"
  },
  "6": {
    "name": "beIN Sports 6",
    "logo": "https://lo1.in/bein/beinn6.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677017"
  },

// 3. مسار جلب قائمة القنوات الحقيقية للواجهة
app.get('/channel/info-all', (req, res) => {
    res.json(channels);
});

// 4. مسار معالجة البث المباشر المحصن لمنع انهيار السيرفر وتخطي حظر Xtream
app.get('/channel/stream/:id', async (req, res) => {
    const channel = channels[req.params.id];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    try {
        const response = await axios({
            method: 'get',
            url: channel.url,
            responseType: 'stream',
            timeout: 20000, // مهلة اتصال 20 ثانية لمنع التعليق
            headers: {
                // إيهام السيرفر المزوّد أن الطلب قادم من تطبيق أندرويد رسمي
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; LivePlayer) ExoPlayerLib/2.18.1',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            }
        });

        // قراءة الترويسات وتمرير نوع محتوى الفيديو الحقيقي لـ ExoPlayer
        const contentType = response.headers['content-type'] || 'video/mp2t';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        if (response.headers['accept-ranges']) {
            res.setHeader('Accept-Ranges', response.headers['accept-ranges']);
        }

        // ضخ دفق الفيديو مباشرة إلى مشغل الهاتف
        response.data.pipe(res);

    } catch (error) {
        console.error("خطأ البث المباشر:", error.message);
        
        // منع انهيار السيرفر عبر إرجاع استجابة آمنة بدلاً من إيقاف الخدمة
        if (!res.headersSent) {
            res.status(500).send('تعذر جلب البث، تأكد من صحة روابط القنوات المكتوبة بالسيرفر.');
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
