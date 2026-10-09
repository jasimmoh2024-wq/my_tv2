const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// تفعيل CORS الشامل لمنع أي حظر للشبكة مع تطبيق الـ APK
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    next();
});

// قاعدة بيانات القنوات الحقيقية الخاصة بك
// ⚠️ ملاحظة: استبدل روابط http://xtream-server.com بروابط اشتراكك الحقيقية لكي تعمل القنوات
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
  }
};

// مسار جلب قائمة القنوات الحقيقية للواجهة
app.get('/channel/info-all', (req, res) => {
    res.json(channels);
});

// مسار معالجة وحقن البث المباشر الذكي المتوافق مع امتداد طلب Xtream و ExoPlayer
app.get('/channel/stream/:id', async (req, res) => {
    // السحر هنا: إزالة امتداد .ts من المعرف الحركي إذا أرسله المشغل لكي نصل للمعرف الأصلي في قاعدة البيانات
    let channelId = req.params.id;
    if (channelId.endsWith('.ts')) {
        channelId = channelId.replace('.ts', '');
    }

    const channel = channels[channelId];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    try {
        // محاكاة طلب البث الحي الصريح بإضافة صيغة التمرير الافتراضية لـ Xtream
        const finalUrl = channel.url.includes('?') ? `${channel.url}&output=ts` : `${channel.url}?output=ts`;

        const response = await axios({
            method: 'get',
            url: finalUrl,
            responseType: 'stream',
            timeout: 25000, 
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; LivePlayer) ExoPlayerLib/2.18.1',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            }
        });

        // حقن ترويسة الفيديو المباشر لإرضاء نواة الأندرويد
        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        if (response.headers['accept-ranges']) {
            res.setHeader('Accept-Ranges', response.headers['accept-ranges']);
        }

        response.data.pipe(res);

    } catch (error) {
        console.error("خطأ البث المباشر الممرر عبر Xtream:", error.message);
        if (!res.headersSent) {
            res.status(500).send('خطأ في جلب دفق القناة، تأكد من اشتراك Xtream الخاص بك.');
        }
    }
});

app.get('/', (req, res) => {
    res.status(200).send('Server is Live and Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
