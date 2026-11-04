const express = require('express');
const axios = require('axios');
const app = express();

const SHEET_ID = '1YdDOSnw2Vjimg_7bik3j9uANjQMnQUWQT2_uvw9mSEU';
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;

// مصفوفتك - الصقها كلها هنا
const CHANNELS = [
  {"name":"1 - bein sport 1","logo":"https://lo1.in/bss/bsS1.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677003"},
  {"name":"2 - bein sport 2","logo":"https://lo1.in/bss/bsS2.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677004"},
  {"name":"3 - bein sport 3","logo":"https://lo1.in/bss/bs3.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677005.m3u8"},
  {"name":"4 - bein sport 4","logo":"https://lo1.in/bss/bs4.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677006.m3u8"},
  {"name":"5 - bein sport 5","logo":"https://lo1.in/bein/beinn5.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677007.m3u8"},
  {"name":"6 - bein sport 6","logo":"https://lo1.in/bein/beinn6.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677008.m3u8"},
  {"name":"7 - bein sport 7","logo":"https://lo1.in/bss/BEIN SPORTS 07.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677009.m3u8"},
  {"name":"8 - bein sport 8","logo":"https://lo1.in/bss/bss8.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677010.m3u8"},
  {"name":"9 - ALWAN SPORT 1","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649689.m3u8"},
  {"name":"10 - ALWAN SPORT 2","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649690.m3u8"},
  {"name":"11 - ALWAN SPORT 3","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649691.m3u8"},
  {"name":"12 - ALWAN SPORT 4","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649692.m3u8"},
  {"name":"13 - ALWAN SPORT 5","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649693.m3u8"},
  {"name":"14 - ALWAN SPORT 6","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649694.m3u8"},
  {"name":"15 - ALWAN SPORT 7","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649695.m3u8"},
  {"name":"16 - ALWAN SPORT 8","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649696.m3u8"},
  {"name":"17 - STARZPLAY SPORTS 1","logo":"https://lo1.in/stplay1/adp1.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/67376.m3u8"},
  {"name":"18 - STARZPLAY SPORTS 2","logo":"https://lo1.in/stplay1/sadh2.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/67378.m3u8"},
  {"name":"19 - Thamanya Sport 1","logo":"https://images.seeklogo.com/logo-png/51/1/thmanyah-logo-png_seeklogo-518881.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/646086.m3u8"},
  {"name":"20 - Thamanya Sport 2","logo":"https://images.seeklogo.com/logo-png/51/1/thmanyah-logo-png_seeklogo-518881.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/646087.m3u8"},
  {"name":"21 - Alwan Aflam 1","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649714.m3u8"},
  {"name":"22 - Alwan Aflam 2","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649715.m3u8"},
  {"name":"23 - Alwan Aflam 3","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649716.m3u8"},
  {"name":"24 - Alwan Aflam 4","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649717.m3u8"},
  {"name":"25 - ALWAN TURKEY","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649718.m3u8"},
  {"name":"26 - Alwan Documentary","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649719.m3u8"},
  {"name":"27 - ALWAN ATFAL","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649720.m3u8"},
  {"name":"28 - ALWAN MOSALSALAT","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649721.m3u8"},
  {"name":"29 - ALWAN MOSALSALAT +","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649725.m3u8"},
  {"name":"30 - ALWAN ANIME","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649726.m3u8"},
  {"name":"31 - BEIN MOVIES 1","logo":"https://lo1.in/beinn/beinm1pre0.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/427.m3u8"},
  {"name":"32 - BEIN MOVIES 2","logo":"https://lo1.in/beinn/beinm2act0.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/428.m3u8"},
  {"name":"33 - BEIN MOVIES 3","logo":"https://lo1.in/beinn/bm3.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/429.m3u8"},
  {"name":"34 - BEIN MOVIES 4","logo":"https://lo1.in/beinn/beinm4famm.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/430.m3u8"},
  {"name":"35 - BEIN SERIES 1","logo":"https://lo1.in/beinn/beinser100.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/431.m3u8"},
  {"name":"36 - BEIN SERIES 2","logo":"https://lo1.in/beinn/beinser20.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/432.m3u8"},
  {"name":"37 - BEIN DRAMA","logo":"https://lo1.in/beinn/beindra0.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/433.m3u8"},
  {"name":"38 - vivo OSCAR","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192835.m3u8"},
  {"name":"39 - vivo CLUB","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192834.m3u8"},
  {"name":"40 - vivo CINEMA 1","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192833.m3u8"},
  {"name":"41 - vivo CINEMA 2","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192832.m3u8"},
  {"name":"42 - vivo SHOWTIME","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192836.m3u8"},
  {"name":"43 - vivo PLUS","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192837.m3u8"},
  {"name":"44 - vivo SHOWTIME 2","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192836.m3u8"},
  {"name":"45 - vivo MOVIES","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192838.m3u8"},
  {"name":"46 - vivo SENTRAL","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192839.m3u8"},
  {"name":"47 - vivo WAR TIME","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192840.m3u8"},
  {"name":"48 - signal Comedy","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192634.m3u8"},
  {"name":"49 - signal ACTION","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192633.m3u8"},
  {"name":"50 - signal Cinema","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192635.m3u8"},
  {"name":"51 - signal AFLAM","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192636.m3u8"},
  {"name":"52 - signal CLASSIC","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192637.m3u8"},
  {"name":"53 - signal 90s AR","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192638.m3u8"},
  {"name":"54 - signal VOX","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192639.m3u8"},
  {"name":"55 - signal GOLD","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192640.m3u8"},
  {"name":"56 - signal ANIME AR","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192642.m3u8"},
  {"name":"57 - SHAHID ACTION 1","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192749.m3u8"},
  {"name":"58 - SHAHID ANIME 1","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192746.m3u8"},
  {"name":"59 - SHAHID ANIME 2","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192745.m3u8"},
  {"name":"60 - SHAHID Comedy","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192739.m3u8"},
  {"name":"61 - SHAHID ACTION 2","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192739.m3u8"},
  {"name":"62 - SHAHID MARVEL","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192740.m3u8"},
  {"name":"63 - SHAHID ASIAN","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192742.m3u8"},
  {"name":"64 - SHAHID BOLLYWOOD","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192743.m3u8"},
  {"name":"65 - ACTION MOVIES","logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnCnyZPaaBaB1owfAyrhVdObsfr8PwJdrzJDKTKMLXB5ps3xDqti7Q2Cqh&s=10","url":"http://jbfgrjbn.fhkadvnp.com:80/live/7901885855/7610043061/1396793.m3u8"},
  {"name":"66 - SHAHID FILMS 1","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx001/playlist.m3u8"},
  {"name":"67 - SHAHID FILMS 2","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx007/playlist.m3u8"},
  {"name":"68 - SHAHID 1","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx017/playlist.m3u8"},
  {"name":"69 - SHAHID 2","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx015/playlist.m3u8"},
  {"name":"70 - SHAHID 3","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx014/playlist.m3u8"},
  {"name":"71 - SHAHID 4","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx010/playlist.m3u8"},
  {"name":"72 - SHAHID 5","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx013/playlist.m3u8"},
  {"name":"73 - SHAHID 6","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx003/playlist.m3u8"},
  {"name":"74 - SHAHID 7","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx005/playlist.m3u8"},
  {"name":"75 - SHAHID 8","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx008/playlist.m3u8"},
  {"name":"76 - SHAHID 9","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx009/playlist.m3u8"},
  {"name":"77 - THRILLER Movies","logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnCnyZPaaBaB1owfAyrhVdObsfr8PwJdrzJDKTKMLXB5ps3xDqti7Q2Cqh&s=10","url":"https://shd-amg-fast.edgenextcdn.net/tx011/playlist.m3u8"},
  {"name":"78 - WILD","logo":"https://lo1.in/FCB/osnngp.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625061.m3u8"},
  {"name":"79 - travelXP","logo":"https://images.seeklogo.com/logo-png/63/1/travelxp-logo-png_seeklogo-632248.png","url":"http://stream.mcquack.net/451/index.m3u8"},
  {"name":"80 - trave","logo":"https://images.seeklogo.com/logo-png/32/1/travel-channel-logo-png_seeklogo-326359.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625063.m3u8"},
  {"name":"81 - Asharq Documentary 1","logo":"https://tlfaz.com/wp-content/uploads/2023/03/Asharq-Documentary.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625069.m3u8"},
  {"name":"82 - Animal Planet","logo":"https://lo1.in/ger/ANIMAL PLANET.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625075.m3u8"},
  {"name":"83 - H HISORY","logo":"https://logos-world.net/wp-content/uploads/2023/07/History-Logo.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625076.m3u8"},
  {"name":"84 - Discovery","logo":"https://logos-world.net/wp-content/uploads/2022/01/Discovery-Channel-Logo-2009.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625080.m3u8"},
  {"name":"85 - Asharq Documentary 1","logo":"https://tlfaz.com/wp-content/uploads/2023/03/Asharq-Documentary.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625067.m3u8"},
  {"name":"86 - Al Jazeera Documents","logo":"https://i1.sndcdn.com/avatars-epnszgJqJz87Hupm-SB4uiw-t1080x1080.jpg","url":"https://live-hls-apps-ajd-fa.getaj.net/AJD/index.m3u8"},
  {"name":"87 - Kids Music 1","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193350.m3u8"},
  {"name":"88 - Kids Music 2","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193347.m3u8"},
  {"name":"89 - Kids Music 3","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193346.m3u8"},
  {"name":"90 - Kids Music 4","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193348.m3u8"},
  {"name":"91 - TOM And jerry 1","logo":"https://i.pinimg.com/originals/4f/cb/c8/4fcbc802581380b68951ad455b3e7208.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193324.m3u8"},
  {"name":"92 - TOM And jerry 2","logo":"https://i.pinimg.com/originals/4f/cb/c8/4fcbc802581380b68951ad455b3e7208.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193323.m3u8"},
  {"name":"93 - TOM And jerry 3","logo":"https://i.pinimg.com/originals/4f/cb/c8/4fcbc802581380b68951ad455b3e7208.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193321.m3u8"},
  {"name":"94 - Nickelodeon 1","logo":"https://m.eyeofriyadh.com/news_images/2015/11/630659467.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/151195.m3u8"},
  {"name":"95 - Nickelodeon 2","logo":"https://m.eyeofriyadh.com/news_images/2015/11/630659467.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/151192.m3u8"},
  {"name":"96 - pink panther 1","logo":"https://elyafgroup.com/cdn/shop/products/PINK-PANTHER_1080x.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193316.m3u8"},
  {"name":"97 - pink panther 2","logo":"https://elyafgroup.com/cdn/shop/products/PINK-PANTHER_1080x.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193317.m3u8"}
];

app.get('/playlist.m3u', async (req, res) => {
  const userCode = (req.query.code || "").toString().trim();
  const ua = (req.headers['user-agent'] || "").toLowerCase();

  // كشف المتصفح
  const isBrowser = ua.includes('mozilla') || ua.includes('chrome') || ua.includes('safari') || ua.includes('edge') || ua.includes('firefox');
  const isVLC = ua.includes('vlc') || ua.includes('lavf') || ua.includes('iptv') || ua.includes('ott') || ua.includes('exoplayer') || ua.includes('kodi');

  // اذا متصفح - اظهر صفحة فيديو وهمية
  if (isBrowser && !isVLC) {
    return res.send(`
      <html dir="rtl" style="background:#000;color:#fff;text-align:center;padding-top:50px;font-family:Arial">
        <h2>⚠️ هذا الرابط لا يعمل في المتصفح</h2>
        <p>MY - TV IPTV</p>
        <video controls autoplay muted style="width:80%;max-width:600px;background:#111;margin-top:20px">
          <source src="" type="video/mp4">
        </video>
        <p style="color:#888;margin-top:20px">الكود: ${userCode || 'غير موجود'}</p>
        <script>setTimeout(()=>{document.querySelector('video').pause()},1000)</script>
      </html>
    `);
  }

  res.header('Content-Type','text/plain; charset=utf-8');
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');

  if (!userCode) return res.send('#EXTM3U\n#EXTINF:-1,اكتب الكود');

  try {
    const { data } = await axios.get(SHEET_URL);
    const found = data.find(c => String(c.code).trim() == userCode);
    if (!found) return res.send('#EXTM3U\n#EXTINF:-1,الكود غير موجود');
    if (String(found.active).toUpperCase() !== 'TRUE') {
      return res.send(`#EXTM3U\n#EXTINF:-1,${found.name || ''} حسابك موقوف`);
    }
    if (found.expiry) {
      const today = new Date(); today.setHours(0,0,0,0);
      const exp = new Date(found.expiry); exp.setHours(0,0,0,0);
      if (today > exp) return res.send(`#EXTM3U\n#EXTINF:-1,${found.name || ''} انتهى اشتراكك ${found.expiry}`);
    }

    let m3u = '#EXTM3U\n';
    CHANNELS.forEach(ch => {
      m3u += `#EXTINF:-1 tvg-logo="${ch.logo}" ,${ch.name}\n${ch.url}\n`;
    });
    res.send(m3u);

  } catch (e) {
    console.error(e.message);
    res.send('#EXTM3U\n#EXTINF:-1,خطأ مؤقت');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Running'));
