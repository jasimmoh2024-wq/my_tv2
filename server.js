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
    <a href="http://tyqw.site:2052/10675785266958/99039021857485/677012"><img src="https://upload.wikimedia.org/wikipedia/fr/2/2f/BeIN_Sports_1_%282014%29.png?utm_source=fr.wikipedia.org&utm_campaign=index&utm_content=original" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="beIN Sports 4"></a>

    <a href="http://tyqw.site:2052/10675785266958/99039021857485/677013"><img src="https://static.wikia.nocookie.net/logopedia/images/8/87/BeIN_Sports_2_2014.png/revision/latest?cb=20230616100740" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="beIN Sports 2"></a>

    <a href="http://tyqw.site:2052/10675785266958/99039021857485/677014"><img src="https://w7.pngwing.com/pngs/600/309/png-transparent-bein-sports-1-bein-channels-network-bein-sports-2-others-purple-violet-text.png" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="beIN Sports 3"></a>

    <a href="http://tyqw.site:2052/10675785266958/99039021857485/677015"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN1sJwVTzRUcNoisrDinSPlK9oAzgTCEg7KlIX-IPEQGatghCrwg&s&ec=121966410" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="beIN Sports 4"></a>

    <a href="http://tyqw.site:2052/10675785266958/99039021857485/677016"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSToODTKqCc6GJBe8yjVFE8xX_lmQcQLAfaJX33p9SMTZGrTQFCJA&s&ec=121966410" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="beIN Sports 3"></a>

    <a href="http://tyqw.site:2052/10675785266958/99039021857485/677017"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjF_-oHiU9X1EVEjcc-BCHfSoYiXYqJT-teybZZbFI40qPoo11Jg&s&ec=121966410" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="beIN Sports 6"></a>

    <a href="http://tyqw.site:2052/10675785266958/99039021857485/677018"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGJnE8PMtIjCmAWIlq3ei3SsS811x91tli8T8kiJ9rNcX3gDA3ag&s&ec=121966410" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="beIN Sports 7"></a>

    <a href="http://tyqw.site:2052/10675785266958/99039021857485/677019"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5P1vtFKkZjFS570q9OD0I-a7qTl1Ma2akfTxnnvAgN0BYaSbykw&s&ec=121966410" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="beIN Sports 8"></a>

    <a href="https://iptv-proxy-wjpz.onrender.com/live/9.m3u8"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRowPfUbfV8VxIyaCf01srLAutIXe3j0PGSPRvYALL6T0NlseNYH9AVyqLI9fSTDf8&s=10&ec=121966410" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="Alwan Sport 1"></a>
       
    <a href="https://iptv-proxy-wjpz.onrender.com/live/10.m3u8"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRowPfUbfV8VxIyaCf01srLAutIXe3j0PGSPRvYALL6T0NlseNYH9AVyqLI9fSTDf8&s=10&ec=121966410" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="Alwan Sport 2"></a>

    <a href="https://iptv-proxy-wjpz.onrender.com/live/11.m3u8"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRowPfUbfV8VxIyaCf01srLAutIXe3j0PGSPRvYALL6T0NlseNYH9AVyqLI9fSTDf8&s=10&ec=121966411" style="height: 70px; width: auto; display: block; margin: 0 auto;" alt="Alwan Sport 3"></a>

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
