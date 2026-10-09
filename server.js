const express = require('express');
const axios = require('axios');
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
// استبدل الروابط التجريبية (http://xtream-server.com...) بروابط اشتراكك الحقيقية لكي تعمل القنوات
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

// مسار جلب البيانات بصيغة JSON القياسية المستقرة جداً على Render
app.get('/channel/info-all', (req, res) => {
    res.json(channels); 
});

// المسار العبقري الجديد: السيرفر يستقبل الرابط على شكل /live/:id ويفحص الامتداد تلقائياً
app.get('/live/:id', async (req, res) => {
    let channelId = req.params.id;
    
    // إذا كان الرابط ينتهي بـ .ts أو .m3u8 نقوم بقصه برمجياً فوراً لمعرفة الرقم الأصلي للقناة
    if (channelId.endsWith('.ts')) { channelId = channelId.replace('.ts', ''); }
    if (channelId.endsWith('.m3u8')) { channelId = channelId.replace('.m3u8', ''); }

    const channel = channels[channelId];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    try {
        const response = await axios({
            method: 'get',
            url: channel.url,
            responseType: 'stream',
            timeout: 20000, 
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; LivePlayer) ExoPlayerLib/2.18.1',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            }
        });

        const contentType = response.headers['content-type'] || 'video/mp2t';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        if (response.headers['accept-ranges']) {
            res.setHeader('Accept-Ranges', response.headers['accept-ranges']);
        }

        response.data.pipe(res);

    } catch (error) {
        console.error("خطأ البث المباشر:", error.message);
        if (!res.headersSent) {
            res.status(500).send('تعذر جلب البث، تأكد من صحة روابط القنوات.');
        }
    }
});

app.get('/', (req, res) => {
    res.status(200).send('Server is Live and Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
