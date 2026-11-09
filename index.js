const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";
const ADMIN_PASS = process.env.ADMIN_PASS || "change-me";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// ===== حط روابطك المرخصة هنا فقط =====
const CHANNELS = [
  {"name":"1 - bein sport 1","url":"http://jbfgrjbn.fhkadvnp.com:80/live/7901885855/7610043061/4011.m3u8"},
  {"name":"2 - bein sport 2","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/16"},
  {"name":"3 - bein sport 3","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953587"},
  {"name":"4 - bein sport 4","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953586"},
  {"name":"5 - bein sport 5","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953585"},
  {"name":"6 - bein sport 6","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953584"},
  {"name":"7 - bein sport 7","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953583"},
  {"name":"8 - bein sport 8","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953582"},
  {"name":"9 - ALWAN SPORT 1","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276543"},
  {"name":"10 - ALWAN SPORT 2","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276542"},
  {"name":"11 - ALWAN SPORT 3","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276541"},
  {"name":"12 - ALWAN SPORT 4","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276540"},
  {"name":"13 - ALWAN SPORT 5","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276539"},
  {"name":"14 - ALWAN SPORT 6","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276538"},
  {"name":"15 - ALWAN SPORT 7","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276537"},
  {"name":"16 - ALWAN SPORT 8","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276536"},
  {"name":"17 - STARZPLAY SPORTS 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/67376"},
  {"name":"18 - STARZPLAY SPORTS 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/67378"},
  {"name":"19 - Thamanya Sport 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/646086"},
  {"name":"20 - Thamanya Sport 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/646087"},
  {"name":"21 - Alwan Aflam 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/649714"},
  {"name":"22 - Alwan Aflam 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/649715"},
  {"name":"23 - Alwan Aflam 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/649716"},
  {"name":"24 - Alwan Aflam 4","url":"http://tyqw.site:2052/10675785266958/99039021857485/649717"},
  {"name":"25 - ALWAN TURKEY","url":"http://tyqw.site:2052/10675785266958/99039021857485/649718"},
  {"name":"26 - Alwan Documentary","url":"http://tyqw.site:2052/10675785266958/99039021857485/649719"},
  {"name":"27 - ALWAN ATFAL","url":"http://tyqw.site:2052/10675785266958/99039021857485/649720"},
  {"name":"28 - ALWAN MOSALSALAT","url":"http://tyqw.site:2052/10675785266958/99039021857485/649721"},
  {"name":"29 - ALWAN MOSALSALAT +","url":"http://tyqw.site:2052/10675785266958/99039021857485/649725"},
  {"name":"30 - ALWAN ANIME","url":"http://tyqw.site:2052/10675785266958/99039021857485/649726"},
  {"name":"31 - BEIN MOVIES 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/427"},
  {"name":"32 - BEIN MOVIES 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/428"},
  {"name":"33 - BEIN MOVIES 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/429"},
  {"name":"34 - BEIN MOVIES 4","url":"http://tyqw.site:2052/10675785266958/99039021857485/430"},
  {"name":"35 - BEIN SERIES 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/431"},
  {"name":"36 - BEIN SERIES 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/432"},
  {"name":"37 - BEIN DRAMA","url":"http://tyqw.site:2052/10675785266958/99039021857485/433"},
  {"name":"38 - vivo OSCAR","url":"http://tyqw.site:2052/10675785266958/99039021857485/192835"},
  {"name":"39 - vivo CLUB","url":"http://tyqw.site:2052/10675785266958/99039021857485/192834"},
  {"name":"40 - vivo CINEMA 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/192833"},
  {"name":"41 - vivo CINEMA 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192832"},
  {"name":"42 - vivo SHOWTIME","url":"http://tyqw.site:2052/10675785266958/99039021857485/192836"},
  {"name":"43 - vivo PLUS","url":"http://tyqw.site:2052/10675785266958/99039021857485/192837"},
  {"name":"44 - vivo SHOWTIME 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192836"},
  {"name":"45 - vivo MOVIES","url":"http://tyqw.site:2052/10675785266958/99039021857485/192838"},
  {"name":"46 - vivo SENTRAL","url":"http://tyqw.site:2052/10675785266958/99039021857485/192839"},
  {"name":"47 - vivo WAR TIME","url":"http://tyqw.site:2052/10675785266958/99039021857485/192840"},
  {"name":"48 - signal Comedy","url":"http://tyqw.site:2052/10675785266958/99039021857485/192634"},
  {"name":"49 - signal ACTION","url":"http://tyqw.site:2052/10675785266958/99039021857485/192633"},
  {"name":"50 - signal Cinema","url":"http://tyqw.site:2052/10675785266958/99039021857485/192635"},
  {"name":"51 - signal AFLAM","url":"http://tyqw.site:2052/10675785266958/99039021857485/192636"},
  {"name":"52 - signal CLASSIC","url":"http://tyqw.site:2052/10675785266958/99039021857485/192637"},
  {"name":"53 - signal 90s AR","url":"http://tyqw.site:2052/10675785266958/99039021857485/192638"},
  {"name":"54 - signal VOX","url":"http://tyqw.site:2052/10675785266958/99039021857485/192639"},
  {"name":"55 - signal GOLD","url":"http://tyqw.site:2052/10675785266958/99039021857485/192640"},
  {"name":"56 - signal ANIME AR","url":"http://tyqw.site:2052/10675785266958/99039021857485/192642"},
  {"name":"57 - SHAHID ACTION 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/192749"},
  {"name":"58 - SHAHID ANIME 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/192746"},
  {"name":"59 - SHAHID ANIME 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192745"},
  {"name":"60 - SHAHID Comedy","url":"http://tyqw.site:2052/10675785266958/99039021857485/192739"},
  {"name":"61 - SHAHID ACTION 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192739"},
  {"name":"62 - SHAHID MARVEL","url":"http://tyqw.site:2052/10675785266958/99039021857485/192740"},
  {"name":"63 - SHAHID ASIAN","url":"http://tyqw.site:2052/10675785266958/99039021857485/192742"},
  {"name":"64 - SHAHID BOLLYWOOD","url":"http://tyqw.site:2052/10675785266958/99039021857485/192743"},
  {"name":"65 - ACTION MOVIES","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1396793"},
  {"name":"66 - SHAHID FILMS 1","url":"https://shd-amg-fast.edgenextcdn.net/tx001/playlist.m3u8"},
  {"name":"67 - SHAHID FILMS 2","url":"https://shd-amg-fast.edgenextcdn.net/tx007/playlist.m3u8"},
  {"name":"68 - SHAHID 1","url":"https://shd-amg-fast.edgenextcdn.net/tx017/playlist.m3u8"},
  {"name":"69 - SHAHID 2","url":"https://shd-amg-fast.edgenextcdn.net/tx015/playlist.m3u8"},
  {"name":"70 - SHAHID 3","url":"https://shd-amg-fast.edgenextcdn.net/tx014/playlist.m3u8"},
  {"name":"71 - SHAHID 4","url":"https://shd-amg-fast.edgenextcdn.net/tx010/playlist.m3u8"},
  {"name":"72 - SHAHID 5","url":"https://shd-amg-fast.edgenextcdn.net/tx013/playlist.m3u8"},
  {"name":"73 - SHAHID 6","url":"https://shd-amg-fast.edgenextcdn.net/tx003/playlist.m3u8"},
  {"name":"74 - SHAHID 7","url":"https://shd-amg-fast.edgenextcdn.net/tx005/playlist.m3u8"},
  {"name":"75 - SHAHID 8","url":"https://shd-amg-fast.edgenextcdn.net/tx008/playlist.m3u8"},
  {"name":"76 - SHAHID 9","url":"https://shd-amg-fast.edgenextcdn.net/tx009/playlist.m3u8"},
  {"name":"77 - THRILLER Movies","url":"https://shd-amg-fast.edgenextcdn.net/tx011/playlist.m3u8"},
  {"name":"78 - WILD","url":"http://tyqw.site:2052/10675785266958/99039021857485/625061"},
  {"name":"79 - travelXP","url":"http://stream.mcquack.net/451/index.m3u8"},
  {"name":"80 - trave","url":"http://tyqw.site:2052/10675785266958/99039021857485/625063"},
  {"name":"81 - Asharq Documentary 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/625069"},
  {"name":"82 - Animal Planet","url":"http://tyqw.site:2052/10675785266958/99039021857485/625075"},
  {"name":"83 - H HISORY","url":"http://tyqw.site:2052/10675785266958/99039021857485/625076"},
  {"name":"84 - Discovery","url":"http://tyqw.site:2052/10675785266958/99039021857485/625080"},
  {"name":"85 - Asharq Documentary 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/625067"},
  {"name":"86 - Al Jazeera Documents","url":"https://live-hls-apps-ajd-fa.getaj.net/AJD/index.m3u8"},
  {"name":"87 - Kids Music 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/193350"},
  {"name":"88 - Kids Music 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/193347"},
  {"name":"89 - Kids Music 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/193346"},
  {"name":"90 - Kids Music 4","url":"http://tyqw.site:2052/10675785266958/99039021857485/193348"},
  {"name":"91 - TOM And jerry 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/193324"},
  {"name":"92 - TOM And jerry 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/193323"},
  {"name":"93 - TOM And jerry 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/193321"},
  {"name":"94 - Nickelodeon 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/151195"},
  {"name":"95 - Nickelodeon 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/151192"},
  {"name":"96 - pink panther 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/193316"},
  {"name":"97 - pink panther 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/193317"},
  {"name":"98 - test","url":"http://tyqw.site:2052/10675785266958/99039021857485/677084"}
];

const subCache = new Map();

// ===== بناء كل الصيغ الممكنة للرابط الاصلي =====
// هذا يحل مشكلة الروابط بدون امتداد
function buildCandidates(url){
  const u = url.trim();
  const list = [u];
  if(!u.endsWith('.m3u8') && !u.endsWith('.ts')) list.push(u + '.m3u8');
  if(u.includes('/live/')) list.push(u.replace('/live/','/'));
  if(!u.includes('/live/') && u.split('/').length >= 5){
    // جرب صيغة /live/user/pass/id
    try{
      const p = new URL(u);
      const parts = p.pathname.split('/').filter(Boolean);
      if(parts.length >= 3){
        list.push(`${p.origin}/live/${parts.join('/')}.m3u8`.replace('.m3u8.m3u8','.m3u8'));
      }
    }catch(e){}
  }
  return [...new Set(list)];
}

function parseCookies(req){
  const c = {};
  (req.headers.cookie || '').split(';').forEach(p=>{
    const i = p.indexOf('=');
    if(i>-1) c[p.slice(0,i).trim()] = decodeURIComponent(p.slice(i+1).trim());
  });
  return c;
}
function isAdmin(req){
  const cookies = parseCookies(req);
  return cookies.admin_auth === Buffer.from(ADMIN_PASS).toString('base64');
}
function requireAdmin(req,res,next){
  if(isAdmin(req)) return next();
  return res.redirect('/login');
}

// ===== تسجيل دخول =====
app.get('/login', (req, res) => {
  if(isAdmin(req)) return res.redirect('/admin');
  res.send(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>دخول</title>
  <style>*{box-sizing:border-box}body{font-family:'Segoe UI',Tahoma,sans-serif;background:#070b14;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;color:#fff}
  .box{background:#0f172a;border:1px solid #1e293b;width:100%;max-width:380px;padding:30px;border-radius:22px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5)}
  h2{margin:0 0 8px;font-size:22px} p{color:#94a3b8;font-size:13px;margin:0 0 20px}
  input{width:100%;padding:13px;border:1px solid #334155;border-radius:12px;font-size:16px;outline:none;margin-bottom:12px;background:#020617;color:#fff}
  button{width:100%;padding:13px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;border:none;border-radius:12px;font-weight:800;font-size:15px;cursor:pointer}
  .err{color:#f87171;font-size:13px;margin-top:10px}
  .remember{display:flex;align-items:center;gap:8px;justify-content:flex-start;margin:2px 0 14px;font-size:13px;color:#cbd5e1}
  .remember input{width:auto!important;margin:0!important}
  </style></head><body><div class="box"><h2>🎬 لوحة التحكم</h2><p>اكتب باسورد اللوحة للدخول</p>
  <form method="POST" action="/login"><input type="password" name="pass" placeholder="الباسورد" required autofocus><label class="remember"><input type="checkbox" name="remember" checked> ابقى داخل 30 يوم</label><button>دخول</button></form>
  ${req.query.err ? '<div class="err">باسورد غلط</div>' : ''}</div></body></html>`);
});
app.post('/login', (req, res) => {
  if(req.body.pass === ADMIN_PASS){
    const token = Buffer.from(ADMIN_PASS).toString('base64');
    res.setHeader('Set-Cookie', `admin_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${req.body.remember==='on'?30*24*60*60:0}`);
    return res.redirect('/admin');
  }
  res.redirect('/login?err=1');
});
app.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'admin_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.redirect('/login');
});

async function getSubscriber(code) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}&select=*`, { headers });
  const data = await r.json();
  return data[0];
}
async function checkDevice(req, code, macParam, skipLock){
  const sub = await getSubscriber(code);
  if(!sub) return { ok:false, msg:"Code not found" };
  if(!sub.active) return { ok:false, msg:"Account disabled" };
  if(sub.expiry && new Date(sub.expiry) < new Date()) return { ok:false, msg:"Expired" };
  const ip = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
  const mac = (macParam || '').toString().trim().toUpperCase();
  const now = new Date().toISOString();
  const lastSeen = sub.last_seen ? new Date(sub.last_seen).getTime() : 0;
  const diffMin = (Date.now() - lastSeen) / 60000;
  if(skipLock){
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    return { ok:true, sub };
  }
  if(!mac){
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    return { ok:true, sub };
  }
  const fingerprint = crypto.createHash('md5').update(mac).digest('hex');
  if(sub.device_id){
    if(sub.device_id !== fingerprint && diffMin < 2) return { ok:false, msg:"يعمل على جهاز اخر", sub };
    if(sub.device_id !== fingerprint && diffMin >= 2){
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ device_id: fingerprint, mac_address: mac, device_ip: ip, last_seen: now }) });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    }
  } else {
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ device_id: fingerprint, mac_address: mac, device_ip: ip, last_seen: now }) });
  }
  return { ok:true, sub };
}

// ===== Playlist - كل الروابط تطلع من سيرفرك انت فقط =====
async function sendPlaylist(req, res){
  const code = req.query.code;
  if (!code) return res.status(403).send("No code");
  const check = await checkDevice(req, code, req.query.mac || '', true);
  if(!check.ok) return res.status(403).send(check.msg);
  const host = req.get('host');
  const proto = req.protocol;
  let m3u = "#EXTM3U\n";
  CHANNELS.forEach((c,i) => {
    const proxiedUrl = `${proto}://${host}/live/${code}/${code}/${i+1}`;
    m3u += `#EXTINF:-1 tvg-id="${c.name}" tvg-name="${c.name}" group-title="Live",${c.name}\n${proxiedUrl}\n`;
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/x-mpegURL; charset=utf-8');
  res.send(m3u);
}
app.get('/playlist', sendPlaylist);
app.get('/playlist.m3u8', sendPlaylist);
app.get('/playlist.m3u', sendPlaylist);

// ===== Xtream API =====
app.get('/player_api.php', async (req, res) => {
  const username = req.query.username || '';
  const password = req.query.password || '';
  const action = req.query.action || '';
  if(!username || password !== username) return res.json({ user_info:{ auth:0, status:"Banned" }, server_info:{} });
  const isList = ['get_live_categories','get_live_streams','get_vod_categories','get_vod_streams','get_series_categories','get_series'].includes(action);
  const check = await checkDevice(req, username, req.query.mac || '', isList);
  if(!check.ok) return res.json({ user_info:{ auth:0, status:"Banned", message: check.msg }, server_info:{} });
  const sub = check.sub;
  const host = req.get('host'); const proto = req.protocol;
  const serverInfo = { url: host, port: "443", https_port: "443", server_protocol: "https", timezone: "Asia/Baghdad", timestamp_now: Math.floor(Date.now()/1000), time_now: new Date().toISOString() };
  if(isList){
    if(action.includes('categories')) return res.json([{ category_id:"1", category_name:"Live", parent_id:0 }]);
    if(action === 'get_live_streams'){
      return res.json(CHANNELS.map((c,i)=>({ num: i+1, name: c.name, stream_type:"live", stream_id: i+1, stream_icon:"", category_id:"1", direct_source: `${proto}://${host}/live/${username}/${password}/${i+1}`, tv_archive:0 })));
    }
    return res.json([]);
  }
  const exp = sub.expiry ? Math.floor(new Date(sub.expiry).getTime()/1000) : Math.floor(Date.now()/1000)+365*24*3600;
  return res.json({ user_info:{ username, password, auth:1, status:"Active", exp_date:String(exp), is_trial:"0", active_cons:"1", max_connections:"1", allowed_output_formats:["m3u8","ts"] }, server_info: serverInfo });
});

// ===== اعادة كتابة m3u8 - كل المقاطع ترجع عبر البروكسي =====
function rewriteM3u8(text, targetUrl, req, userForAuth){
  const host = req.get('host'); const proto = req.protocol;
  return text.split('\n').map(line=>{
    const t = line.trim();
    if(!t) return line;
    if(t.startsWith('#EXT-X-KEY') && t.includes('URI="')){
      return t.replace(/URI="([^"]+)"/g,(m,uri)=>{
        let full=uri; try{ full=new URL(uri,targetUrl).toString(); }catch(e){}
        return `URI="${proto}://${host}/proxy?url=${encodeURIComponent(full)}&u=${userForAuth||''}"`;
      });
    }
    if(t.startsWith('#EXT-X-MAP') && t.includes('URI="')){
      return t.replace(/URI="([^"]+)"/g,(m,uri)=>{
        let full=uri; try{ full=new URL(uri,targetUrl).toString(); }catch(e){}
        return `URI="${proto}://${host}/proxy?url=${encodeURIComponent(full)}&u=${userForAuth||''}"`;
      });
    }
    if(t.startsWith('#')) return line;
    let full=t; try{ full=new URL(t,targetUrl).toString(); }catch(e){}
    return `${proto}://${host}/proxy?url=${encodeURIComponent(full)}&u=${userForAuth||''}`;
  }).join('\n');
}

// ===== البروكسي الحقيقي - يوزع الفيديو، ما يرشد للمصدر =====
// ابدا ما نسوي redirect هنا
async function proxyStream(req, res, targetUrl, userForAuth){
  // جرب كل الصيغ لحد ما وحدة تشتغل
  const candidates = buildCandidates(targetUrl);
  let lastErr = null;
  for(const cand of candidates){
    try{
      const fetchHeaders = { 'User-Agent':'Mozilla/5.0 (VLC/3.0.20 LibVLC/3.0.20)', 'Accept':'*/*', 'Accept-Encoding':'identity', 'Connection':'keep-alive' };
      if(req.headers.range) fetchHeaders['Range']=req.headers.range;
      const r = await fetch(cand, { headers: fetchHeaders, redirect:'follow' });
      if(!r.ok){ lastErr = r.status; continue; }
      const contentType = r.headers.get('content-type') || '';
      res.setHeader('Access-Control-Allow-Origin','*');
      res.setHeader('Cache-Control','no-cache, no-store');
      res.setHeader('X-Accel-Buffering','no');
      if(r.headers.get('accept-ranges')) res.setHeader('Accept-Ranges', r.headers.get('accept-ranges'));
      if(!r.body) continue;
      const reader = r.body.getReader();
      const firstRead = await reader.read();
      if(firstRead.done) continue;
      const firstChunk = Buffer.from(firstRead.value);
      const firstText = firstChunk.toString('utf8',0,Math.min(firstChunk.length,2000));
      const isM3u8 = firstText.includes('#EXTM3U') || contentType.includes('mpegurl') || contentType.includes('x-mpegURL') || cand.endsWith('.m3u8');
      if(isM3u8){
        let chunks=[firstChunk];
        while(true){
          const {done,value}=await reader.read(); if(done) break;
          chunks.push(Buffer.from(value));
          if(Buffer.concat(chunks).length>2*1024*1024) break;
        }
        const fullText = Buffer.concat(chunks).toString('utf8');
        // اذا الملف رجع فاضي او مو m3u8 حقيقي، جرب الصيغة اللي بعدها
        if(!fullText.includes('#EXTM3U')) continue;
        const rewritten = rewriteM3u8(fullText, cand, req, userForAuth);
        res.setHeader('Content-Type','application/vnd.apple.mpegurl');
        return res.send(rewritten);
      }
      // اذا كان ts مباشر، ابثه من سيرفري
      res.setHeader('Content-Type', contentType || 'video/MP2T');
      req.on('close',()=>{ try{reader.cancel();}catch(e){} });
      if(!res.writableEnded) res.write(firstChunk);
      while(true){
        const {done,value}=await reader.read(); if(done) break;
        if(!res.writableEnded) res.write(Buffer.from(value)); else break;
      }
      return res.end();
    }catch(e){ lastErr=e; continue; }
  }
  if(!res.headersSent) return res.status(502).send("Upstream error: "+lastErr);
  try{res.end();}catch(_){}
}

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if(!targetUrl) return res.status(400).send("No url");
  const u = req.query.u;
  if(u){
    const cached = subCache.get(u);
    if(!cached || Date.now()-cached.time>15*60*1000){
      const check = await checkDevice(req, u, req.query.mac||'', true);
      if(!check.ok) return res.status(403).send(check.msg);
      subCache.set(u,{time:Date.now()});
    }
  }
  return proxyStream(req, res, decodeURIComponent(targetUrl), u);
});

// بدون امتداد و مع امتداد - الاثنين يشتغلون، والاثنين بروكسي
app.get('/live/:user/:pass/:id', async (req, res) => {
  const { user, pass, id } = req.params;
  if(pass !== user) return res.status(403).send("Auth failed");
  const cached = subCache.get(user);
  if(!cached || Date.now()-cached.time>15*60*1000){
    const check = await checkDevice(req, user, req.query.mac||'', true);
    if(!check.ok) return res.status(403).send(check.msg);
    subCache.set(user,{time:Date.now()});
  }
  const idx = parseInt(id.replace('.m3u8','').replace('.ts','')) - 1;
  const ch = CHANNELS[idx];
  if(!ch) return res.status(404).send("Channel not found");
  res.setHeader('Cache-Control','no-cache');
  // ابدا ما نسوي redirect - دائما بروكسي
  return proxyStream(req, res, ch.url, user);
});

// ===== Stalker =====
async function stalkerHandler(req, res){
  const action = req.query.action || req.body.action || '';
  const mac = (req.query.mac || req.body.mac || '').toString().toUpperCase();
  const token = req.query.token || req.body.token || '';
  if(action==='handshake') return res.json({ js:{ token:"123456", random:"abcdef", not_valid_token:0 } });
  const login = (req.query.login || req.body.login || token || '').toString();
  if(action==='get_profile') return res.json({ js:{ id:1, name: login||"User", login, mac, status:2, tariff_plan:"Premium" } });
  if(!login) return res.json({ js:{ data:[] } });
  const check = await checkDevice(req, login, mac, true);
  if(!check.ok) return res.json({ js:{ error: check.msg } });
  if(action==='get_all_channels' || action==='get_ordered_list'){
    const data = CHANNELS.map((c,i)=>({ id:String(i+1), name:c.name, number:String(i+1), tv_genre_id:"1", cmd:`${req.protocol}://${req.get('host')}/live/${login}/${login}/${i+1}`, cmd_1:`${req.protocol}://${req.get('host')}/live/${login}/${login}/${i+1}`, logo:"" }));
    return res.json({ js:{ total_items:data.length, max_page_items:500, data } });
  }
  if(action==='create_link'){
    const chId = parseInt(req.query.ch_id || req.body.ch_id || '1')-1;
    const url = `${req.protocol}://${req.get('host')}/live/${login}/${login}/${chId+1}`;
    return res.json({ js:{ id:String(chId+1), cmd:url, type:"live", error:"" } });
  }
  if(action==='get_genres' || action==='get_tv_genres') return res.json({ js:[{ id:"1", title:"Live", alias:"live" }] });
  return res.json({ js:{} });
}
app.get('/stalker_portal/server/load.php', stalkerHandler);
app.post('/stalker_portal/server/load.php', stalkerHandler);
app.get('/portal.php', stalkerHandler);
app.post('/portal.php', stalkerHandler);
app.get('/c/', stalkerHandler);

// ===== لوحة احترافية جديدة =====
app.get('/admin', requireAdmin, (req, res) => {
  res.send(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>لوحة التحكم</title>
  <style>
  *{box-sizing:border-box} body{font-family:'Segoe UI',Tahoma,sans-serif;background:#070b14;color:#e2e8f0;margin:0}
  .layout{display:flex;min-height:100vh}
  .sidebar{width:250px;background:#0b1220;border-left:1px solid #1e293b;padding:22px 16px;position:sticky;top:0;height:100vh}
  .logo{font-size:20px;font-weight:900;margin-bottom:6px} .logo span{color:#6366f1}
  .logo-sub{font-size:12px;color:#94a3b8;margin-bottom:24px}
  .nav a{display:block;padding:11px 12px;border-radius:12px;color:#cbd5e1;text-decoration:none;font-size:14px;font-weight:600;margin-bottom:6px}
  .nav a.active,.nav a:hover{background:#1e293b;color:#fff}
  .main{flex:1;padding:22px;max-width:1100px;margin:auto;width:100%}
  .top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px}
  .top h1{margin:0;font-size:22px} .top p{margin:4px 0 0;color:#94a3b8;font-size:13px}
  .logout{background:#1e293b;color:#fff;padding:9px 14px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:700}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
  .stat{background:linear-gradient(135deg,#0f172a,#111827);border:1px solid #1e293b;padding:16px;border-radius:18px}
  .stat small{color:#94a3b8;font-size:12px} .stat b{font-size:26px;display:block;margin-top:6px}
  .green b{color:#22c55e}.blue b{color:#60a5fa}.orange b{color:#fb923c}.red b{color:#f87171}
  .card{background:#0f172a;border:1px solid #1e293b;padding:18px;border-radius:18px;margin-bottom:14px}
  .card h3{margin:0 0 14px;font-size:15px}
  label{font-size:12px;color:#94a3b8;display:block;margin-bottom:5px}
  input{padding:11px;margin-bottom:10px;width:100%;border:1px solid #334155;border-radius:11px;font-size:14px;outline:none;background:#020617;color:#fff}
  input:focus{border-color:#6366f1}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .btn{padding:12px;border:none;border-radius:11px;font-weight:800;cursor:pointer;font-size:14px;width:100%}
  .btn-add{background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff}
  .btn-dark{background:#1e293b;color:#fff}
  .btn-small{width:auto;padding:7px 10px;font-size:12px;border-radius:9px;margin:2px;border:none;cursor:pointer;font-weight:700}
  .b-green{background:#14532d;color:#dcfce7}.b-red{background:#7f1d1d;color:#fee2e2}.b-gray{background:#334155;color:#fff}.b-orange{background:#78350f;color:#fef3c7}.b-blue{background:#1e3a8a;color:#dbeafe}
  table{width:100%;background:#0f172a;border-collapse:collapse;border-radius:16px;overflow:hidden}
  th{background:#020617;padding:12px;font-size:12px;color:#94a3b8} td{padding:12px;border-top:1px solid #1e293b;text-align:center;font-size:12px}
  .badge{padding:5px 9px;border-radius:20px;font-size:11px}.on{background:#14532d;color:#dcfce7}.off{background:#7f1d1d;color:#fee2e2}
  .dot{width:10px;height:10px;border-radius:50%;display:inline-block}
  .search-row{display:flex;gap:10px}
  @media(max-width:800px){.sidebar{display:none}.stats{grid-template-columns:1fr 1fr}.grid{grid-template-columns:1fr}.search-row{flex-direction:column}}
  </style></head>
  <body><div class="layout">
  <div class="sidebar"><div class="logo">📺 STREAM<span> PRO</span></div><div class="logo-sub">لوحة تنظيم المحترفين</div>
  <div class="nav"><a class="active" href="/admin">👥 المشتركين</a><a href="#" onclick="load();return false">🔄 تحديث</a><a href="#" onclick="exportCSV();return false">📥 تصدير CSV</a><a href="/logout">🚪 خروج</a></div>
  <div style="margin-top:24px;background:#111827;border:1px solid #1e293b;padding:14px;border-radius:14px;font-size:12px;color:#94a3b8">💡 <b style="color:#fff">بروكسي مفعل</b><br>المشاهد ما يشوف رابط المصدر ابدا، كل شي يمر من سيرفرك.</div></div>
  <div class="main">
  <div class="top"><div><h1>لوحة تحكم المشتركين</h1><p>تابع المتصلين، اضف مشترك جديد، وتحكم بالاشتراكات</p></div><a class="logout" href="/logout">خروج</a></div>
  <div class="stats"><div class="stat green"><small>🟢 متصل الان</small><b id="stOnline">0</b></div><div class="stat blue"><small>👥 الكل</small><b id="stTotal">0</b></div><div class="stat orange"><small>✅ فعال</small><b id="stActive">0</b></div><div class="stat red"><small>🔴 موقوف / منتهي</small><b id="stBlocked">0</b></div></div>
  <div class="card"><h3>➕ اضافة مشترك جديد</h3><div class="grid"><div><label>اسم المشترك</label><input id="name" placeholder="مثلا: علي"></div><div><label>كود المشترك</label><input id="code" placeholder="مثلا: ali123"></div><div><label>MAC (اختياري)</label><input id="mac" placeholder="اتركه فارغ - يربط اوتوماتيك" style="direction:ltr"></div><div><label>تاريخ الانتهاء</label><input id="expiry" type="date"></div></div><button class="btn btn-add" onclick="addSub()">+ اضافة مشترك</button></div>
  <div class="card"><h3>🔍 بحث</h3><div class="search-row"><input id="search" placeholder="ابحث بالاسم او الكود او MAC..." oninput="load()" style="margin:0"><button class="btn btn-dark" style="width:150px" onclick="load()">تحديث</button></div></div>
  <div id="list"></div><div id="debug" class="card" style="display:none;color:#f87171;font-size:12px;white-space:pre-wrap"></div>
  </div></div>
  <script>
  function showErr(t){const d=document.getElementById('debug');d.style.display='block';d.textContent=t;}
  function getStatus(s){
    if(!s.active) return {dot:'#ef4444', txt:'🔴 موقوف'};
    if(s.expiry && new Date(s.expiry)<new Date()) return {dot:'#ef4444', txt:'🔴 منتهي'};
    if(!s.last_seen) return {dot:'#94a3b8', txt:'⚪ لم يدخل'};
    const diff=Math.floor((new Date()-new Date(s.last_seen))/60000);
    if(diff<=2) return {dot:'#22c55e', txt:'🟢 متصل الان'};
    if(diff<60) return {dot:'#fb923c', txt:'🟠 قبل '+diff+' د'};
    if(diff<1440) return {dot:'#fb923c', txt:'🟠 قبل '+Math.floor(diff/60)+' س'};
    return {dot:'#94a3b8', txt:'⚪ غير متصل'};
  }
  function formatLast(s){
    if(!s) return 'لم يدخل بعد'; const d=new Date(s); const diff=Math.floor((new Date()-d)/60000);
    if(diff<1) return 'الان'; if(diff<60) return 'قبل '+diff+' دقيقة'; if(diff<1440) return 'قبل '+Math.floor(diff/60)+' ساعة';
    return d.toLocaleString('ar-IQ',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
  }
  async function load(){
    const q=document.getElementById('search').value||'';
    const r=await fetch('/api/subs?q='+encodeURIComponent(q));
    if(r.status===401){location.href='/login';return;}
    const data=await r.json(); if(data.error){showErr(JSON.stringify(data));return;}
    const online=data.filter(s=>s.active&&s.last_seen&&(Date.now()-new Date(s.last_seen).getTime())/60000<=2).length;
    const active=data.filter(s=>s.active).length;
    const blocked=data.filter(s=>!s.active||(s.expiry&&new Date(s.expiry)<new Date())).length;
    document.getElementById('stOnline').textContent=online; document.getElementById('stTotal').textContent=data.length;
    document.getElementById('stActive').textContent=active; document.getElementById('stBlocked').textContent=blocked;
    if(!data.length){document.getElementById('list').innerHTML='<div class="card" style="text-align:center;color:#94a3b8">لا يوجد مشتركين بعد</div>';return;}
    let h='<table><tr><th>الحالة</th><th>الاسم / الكود</th><th>الجهاز</th><th>الانتهاء</th><th>اخر ظهور</th><th>اجراء</th></tr>';
    data.forEach(s=>{ const st=getStatus(s);
      h+=\`<tr><td><span class="dot" style="background:\${st.dot}"></span><br>\${st.txt}<br><span class="badge \${s.active?'on':'off'}">\${s.active?'فعال':'موقوف'}</span></td>
      <td><b>\${s.name}</b><br><span style="direction:ltr;color:#94a3b8">\${s.code}</span><br><button class="btn-small b-blue" onclick="copyLink('\${s.code}')">VLC</button><button class="btn-small b-green" onclick="copyExo('\${s.code}')">ExoPlayer</button><br><button class="btn-small b-orange" onclick="copyXtream('\${s.code}')">Xtream</button></td>
      <td>\${s.device_id?s.device_id.slice(0,8)+'...':'لم يرتبط'}<br><span style="color:#94a3b8">\${s.mac_address||'-'}</span><br><button class="btn-small b-blue" onclick="saveMac('\${s.code}')">حفظ MAC</button></td>
      <td><input type="date" id="date-\${s.code}" value="\${s.expiry||''}" style="width:130px;margin:0"><br><button class="btn-small b-green" onclick="saveDate('\${s.code}')">حفظ</button></td>
      <td>\${formatLast(s.last_seen)}<br><span style="color:#94a3b8">\${s.device_ip||'-'}</span></td>
      <td><button class="btn-small b-orange" onclick="resetDevice('\${s.code}')">فك ربط</button><br><button class="btn-small b-gray" onclick="toggle('\${s.code}',\${!s.active})">ايقاف/تشغيل</button><button class="btn-small b-red" onclick="delSub('\${s.code}')">حذف</button></td></tr>\`;
    });
    document.getElementById('list').innerHTML=h+'</table>';
  }
  function copyLink(c){navigator.clipboard.writeText(location.origin+'/playlist?code='+c);alert('تم نسخ رابط VLC');}
  function copyExo(c){navigator.clipboard.writeText(location.origin+'/playlist.m3u8?code='+c);alert('تم نسخ رابط ExoPlayer');}
  function copyXtream(c){const t='Server: '+location.origin+'\\nUsername: '+c+'\\nPassword: '+c; navigator.clipboard.writeText(t); alert(t);}
  async function addSub(){const body={name:document.getElementById('name').value,code:document.getElementById('code').value,mac_address:document.getElementById('mac').value.toUpperCase(),expiry:document.getElementById('expiry').value}; if(!body.name||!body.code) return alert('اكتب الاسم والكود'); const r=await fetch('/api/subs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); const j=await r.json(); if(!r.ok||j.error){alert('فشل: '+JSON.stringify(j));return;} alert('تمت الاضافة'); document.getElementById('name').value='';document.getElementById('code').value='';document.getElementById('mac').value=''; load();}
  async function saveDate(code){const expiry=document.getElementById('date-'+code).value; if(!expiry) return alert('اختار تاريخ'); await fetch('/api/update-date',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,expiry})}); alert('تم التعديل'); load();}
  async function saveMac(code){const mac=prompt('اكتب MAC الجديد'); if(mac===null) return; await fetch('/api/update-mac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,mac_address:mac.toUpperCase()})}); load();}
  async function toggle(code,active){await fetch('/api/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,active})}); load();}
  async function resetDevice(code){if(!confirm('تفك ربط الجهاز؟'))return; await fetch('/api/reset-device',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})}); load();}
  async function delSub(code){if(!confirm('متأكد حذف؟'))return; await fetch('/api/subs?code='+code,{method:'DELETE'}); load();}
  function exportCSV(){window.open('/api/export');}
  load(); setInterval(load,15000);
  </script></body></html>`);
});

app.get('/api/subs', requireAdmin, async (req, res) => {
  let url = `${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc&limit=1000`;
  if (req.query.q) url += `&or=(name.ilike.*${encodeURIComponent(req.query.q)}*,code.ilike.*${encodeURIComponent(req.query.q)}*,mac_address.ilike.*${encodeURIComponent(req.query.q)}*)`;
  const r = await fetch(url, { headers }); const j = await r.json();
  if(!r.ok) return res.status(r.status).json(j); res.json(j);
});
app.post('/api/subs', requireAdmin, async (req, res) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, { method: 'POST', headers, body: JSON.stringify({ name: req.body.name, code: req.body.code, mac_address: req.body.mac_address || null, expiry: req.body.expiry || null, active: true }) });
  const j = await r.json(); if(!r.ok) return res.status(r.status).json(j); res.json(j);
});
app.post('/api/update-date', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ expiry: req.body.expiry }) }); res.json({ ok: true });
});
app.post('/api/update-mac', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: req.body.mac_address || null }) }); res.json({ ok: true });
});
app.post('/api/toggle', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ active: req.body.active }) }); res.json({ ok: true });
});
app.post('/api/reset-device', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: null, device_id: null, device_ip: null, last_seen: null }) }); res.json({ ok: true });
});
app.delete('/api/subs', requireAdmin, async (req, res) => {
  const code = req.query.code || req.body.code;
  if(!code) return res.status(400).json({ error: "no code" });
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'DELETE', headers }); res.json({ ok: true });
});
app.get('/api/export', requireAdmin, async (req, res) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc`, { headers });
  const data = await r.json();
  let csv = "name,code,mac_address,active,expiry,last_seen,device_ip\\n";
  data.forEach(s => csv += `"${s.name}","${s.code}","${s.mac_address||''}",${s.active},${s.expiry},"${s.last_seen||''}","${s.device_ip||''}"\\n`);
  res.setHeader('Content-Type', 'text/csv'); res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv'); res.send(csv);
});
app.get('/', (req, res) => { res.send("TV Server - Online"); });
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running " + PORT));
