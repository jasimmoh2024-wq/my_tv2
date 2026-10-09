const express = require('express');
const axios = require('axios');
const app = express();

// 1. تحديد منفذ البورت المتوافق إجبارياً مع خوادم Render
const PORT = process.env.PORT || 3000;

// 2. تفعيل CORS الشامل لمنع أي حظر للشبكة مع تطبيق الـ APK
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    next();
});

// 3. قاعدة بيانات القنوات الحقيقية الخاصة بك
// ⚠️ ملاحظة: استبدل الروابط التجريبية بالأسفل بروابط اشتراكك الحقيقية لكي تعمل القنوات
const channels = {
    "1": {
        name: "beIN Sports 1",
        logo: "https://icons8.com",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677012"
    },
    "2": {
        name: "beIN Sports 2",
        logo: "https://icons8.com",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677013"
    },
    "3": {
        name: "beIN Sports 3",
        logo: "https://icons8.com",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677014"
    },
    "4": {
        name: " 4",
        logo: "https://icons8.com",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677015"
    },
    "5": {
        name: "5",
        logo: "https://icons8.com",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677016"
    },
    "6": {
        name: "6",
        logo: "https://icons8.com",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677017"
    },
    "7": {
        name: " 7",
        logo: "https://icons8.com",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677018"
    },
    "8": {
        name: " 8",
        logo: "https://icons8.com",
        url: "http://tyqw.site:2052/10675785266958/99039021857485/677019"
    }
};

// 4. مسار جلب قائمة القنوات الحقيقية للواجهة
app.get('/channel/info-all', (req, res) => {
    res.json(channels);
});

// 5. مسار معالجة وحقن البث المباشر وتخطي حظر سيرفرات Xtream
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
                // تزوير الترويسات ليوهم سيرفر Xtream أن الطلب قادم من ExoPlayer رسمي ونظام أندرويد
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
        if (!res.headersSent) {
            res.status(500).send('تعذر جلب البث، تأكد من صحة روابط القنوات.');
        }
    }
});

// 6. دالة فحص سلامة السيرفر لمنصة Render (مهمة جداً لنجاح الـ Deploy)
app.get('/', (req, res) => {
    res.status(200).send('Server is Live and Running!');
});

// 7. تشغيل السيرفر بالصيغة القياسية لـ Render لحل مشكلة الانهيار نهائياً
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
