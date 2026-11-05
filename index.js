const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);

const SUPABASE_URL = process.env.SUPABASE_URL || "https://djrljivwmwywammiuixr.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_pHEayYHNNS-sPM4-sepq0A_jvpdgaUi";
const ADMIN_PASS = process.env.ADMIN_PASS || "jasim1241979@";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// ===== قنواتك هنا - بس اسم + رابط، بدون شعار =====
const CHANNELS = [
  {"name":"1 - bein sport 1","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677057.m3u8"},
  {"name":"2 - bein sport 2","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677058.m3u8"},
  {"name":"3 - bein sport 3","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677059.m3u8"},
  {"name":"4 - bein sport 4","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677060.m3u8"},
  {"name":"5 - bein sport 5","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677061.m3u8"},
  {"name":"6 - bein sport 6","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677062.m3u8"},
  {"name":"7 - bein sport 7","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677063.m3u8"},
  {"name":"8 - bein sport 8","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677064.m3u8"},
];

function isBrowser(req){
  if(req.query.player === '1' || req.query.player === 'true') return false;
  const fetchMode = (req.headers['sec-fetch-mode'] || '').toLowerCase();
  const fetchDest = (req.headers['sec-fetch-dest'] || '').toLowerCase();
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  if(ua.includes('vlc') || ua.includes('exoplayer') || ua.includes('tivimate') || ua.includes('okhttp') || ua.includes('dalvik') || ua.includes('lavf') || ua.includes('ffmpeg') || ua.includes('libvlc')) return false;
  if(fetchMode === 'navigate' && fetchDest === 'document') return true;
  return false;
}
function fakePlayer(res){
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  return res.send(`<!DOCTYPE html><html lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title></title><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;background:#000;overflow:hidden}body{display:flex;align-items:center;justify-content:center}video{width:100%;height:100%;background:#000;object-fit:contain}</style></head><body><video autoplay muted playsinline controls></video><script>document.addEventListener('contextmenu',e=>e.preventDefault());document.addEventListener('keydown',e=>{if(e.key==='F12'||(e.ctrlKey&&e.shiftKey)||(e.ctrlKey&&e.key==='u'))e.preventDefault();});</script></body></html>`);
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

app.get('/login', (req, res) => {
  if(isAdmin(req)) return res.redirect('/admin');
  res.send(`
  <!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>دخول الموزع</title>
  <style>body{font-family:'Segoe UI',Tahoma,sans-serif;background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}
  .box{background:#fff;width:100%;max-width:360px;padding:28px;border-radius:18px;text-align:center}
  h2{margin:0 0 6px} p{color:#64748b;font-size:13px;margin:0 0 18px}
  input{width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:12px;font-size:16px;outline:none;margin-bottom:12px;box-sizing:border-box}
  button{width:100%;padding:12px;background:#2563eb;color:#fff;border:none;border-radius:12px;font-weight:bold;font-size:15px;cursor:pointer}
  .err{color:#dc2626;font-size:13px;margin-top:10px}
  .remember{display:flex;align-items:center;gap:8px;justify-content:flex-start;margin:2px 0 14px;font-size:13px;color:#334155;cursor:pointer}
  .remember input{width:auto !important;margin:0 !important;padding:0 !important;accent-color:#2563eb}
  </style></head>
  <body><div class="box"><h2>🔐 دخول الموزع</h2><p>اكتب باسورد اللوحة للدخول</p>
  <form method="POST" action="/login" autocomplete="off">
    <input type="text" name="fakeuser" style="display:none" tabindex="-1" autocomplete="off">
    <input type="password" name="pass" placeholder="الباسورد" autocomplete="new-password" autocapitalize="off" autocorrect="off" spellcheck="false" required autofocus>
    <label class="remember"><input type="checkbox" name="remember" checked> ☑️ حفظ تسجيل الدخول - ابقى داخل 30 يوم</label>
    <button>دخول</button>
  </form>
  ${req.query.err ? '<div class="err">باسورد غلط، حاول مرة ثانية</div>' : ''}
  <p style="margin-top:14px;font-size:11px">اذا ما اخترت حفظ، من تسد المتصفح راح يقفل</p>
  </div></body></html>`);
});

app.post('/login', (req, res) => {
  if(req.body.pass === ADMIN_PASS){
    const token = Buffer.from(ADMIN_PASS).toString('base64');
    if(req.body.remember === 'on'){
      res.setHeader('Set-Cookie', `admin_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30*24*60*60}`);
    } else {
      res.setHeader('Set-Cookie', `admin_auth=${token}; Path=/; HttpOnly; SameSite=Lax`);
    }
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

async function sendPlaylist(req, res){
  if(isBrowser(req)) return fakePlayer(res);
  const code = req.query.code;
  if (!code) return res.status(403).send("No code");
  const sub = await getSubscriber(code);
  if (!sub) return res.status(403).send("Code not found");
  if (!sub.active) return res.status(403).send("Account disabled - الاشتراك موقوف");
  if (sub.expiry && new Date(sub.expiry) < new Date()) return res.status(403).send("Expired - انتهى اشتراكك");

  const ip = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
  const ua = (req.headers['user-agent'] || '').toString();
  const macParam = (req.query.mac || req.query.device || '').toString().trim().toUpperCase();
  const now = new Date().toISOString();

  // ===== حماية ضد مشاركة الرابط - بصمة الجهاز =====
  // البصمة = IP + نوع المشغل + الماك اذا موجود
  // اذا المشترك شير الرابط، الجهاز الثاني راح تكون بصمته مختلفة، فينحظر
  const fingerprint = crypto.createHash('md5').update(ip + '|' + ua + '|' + macParam).digest('hex');
  const lastSeen = sub.last_seen ? new Date(sub.last_seen).getTime() : 0;
  const diffMin = (Date.now() - lastSeen) / 60000;

  if(sub.device_id){
    // اذا الجهاز محجوز و البصمة مختلفة و الجهاز الاول بعده فعال (اخر 10 دقايق)
    // يعني جهاز ثاني يحاول يشغل بنفس الوقت - نحظره
    if(sub.device_id !== fingerprint && diffMin < 10){
      return res.status(403).send("هذا الاشتراك يعمل على جهاز اخر - اطفئ الجهاز الاول او انتظر 10 دقائق");
    }
    // اذا البصمة مختلفة و مرت 10 دقايق - نسمحله و ننقل الحجز للجهاز الجديد
    if(sub.device_id !== fingerprint && diffMin >= 10){
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ device_id: fingerprint, mac_address: macParam || sub.mac_address, device_ip: ip, last_seen: now }) });
    } else {
      // نفس الجهاز - تحديث اخر ظهور فقط
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    }
  } else {
    // اول جهاز يشغل - نحجز البصمة عليه
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ device_id: fingerprint, mac_address: macParam || null, device_ip: ip, last_seen: now }) });
  }

  let m3u = "#EXTM3U\n";
  CHANNELS.forEach(c => {
    m3u += `#EXTINF:-1 tvg-id="${c.name}" tvg-name="${c.name}" group-title="Live",${c.name}\n${c.url}\n`;
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/x-mpegURL; charset=utf-8');
  res.setHeader('Content-Disposition', 'inline; filename="playlist.m3u8"');
  res.send(m3u);
}

app.get('/playlist', sendPlaylist);
app.get('/playlist.m3u8', sendPlaylist);
app.get('/playlist.m3u', sendPlaylist);

app.get('/admin', requireAdmin, (req, res) => {
  res.send(`
  <!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>لوحة تحكم</title>
  <style>
  *{box-sizing:border-box}
  body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:20px}
  .wrap{max-width:1000px;margin:auto}
  .header{background:#fff;padding:18px 20px;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.06);display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px}
  .header h2{margin:0;font-size:19px}
  .header span{font-size:12px;background:#dcfce7;color:#166534;padding:5px 10px;border-radius:20px}
  .logout{background:#fee2e2;color:#991b1b;padding:8px 14px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:13px}
  .card{background:#fff;padding:16px;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.06);margin-bottom:14px}
  .card h3{margin:0 0 12px;font-size:15px}
  label{font-size:12px;color:#64748b;display:block;margin-bottom:4px}
  input{padding:8px 10px;margin-bottom:10px;width:100%;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc}
  input:focus{border-color:#2563eb;background:#fff}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .btn{padding:10px;border:none;border-radius:10px;font-weight:bold;cursor:pointer;font-size:14px;width:100%}
  .btn-add{background:#2563eb;color:#fff}
  .btn-export{background:#0f172a;color:#fff}
  .btn-small{width:auto;padding:6px 10px;font-size:12px;border-radius:8px;margin:2px;border:none;cursor:pointer;font-weight:bold}
  .btn-green{background:#dcfce7;color:#166534}
  .btn-red{background:#fee2e2;color:#991b1b}
  .btn-gray{background:#f1f5f9;color:#334155}
  .btn-orange{background:#fef3c7;color:#92400e}
  .btn-blue{background:#dbeafe;color:#1e40af}
  table{width:100%;background:#fff;border-collapse:collapse;border-radius:16px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.06)}
  th{background:#f8fafc;padding:10px;font-size:12px;color:#64748b}
  td{padding:10px;border-top:1px solid #f1f5f9;text-align:center;font-size:12px;vertical-align:middle}
  .badge{padding:4px 8px;border-radius:20px;font-size:11px;white-space:nowrap}
  .on{background:#dcfce7;color:#166534}.off{background:#fee2e2;color:#991b1b}
  .mac-input{width:130px !important;margin:0 !important;font-size:11px !important;direction:ltr;text-align:center}
  .date-input{width:125px !important;margin:0 !important;font-size:12px !important}
  @media(max-width:700px){.grid{grid-template-columns:1fr}}
  </style></head>
  <body><div class="wrap">
  <div class="header"><h2>📺 لوحة تحكم المشتركين</h2><div style="display:flex;gap:8px;align-items:center"><span>● حماية جهاز واحد - ضد مشاركة الرابط</span><a class="logout" href="/logout">🔓 خروج</a></div></div>
  <div class="card"><h3>➕ اضافة مشترك جديد</h3>
  <div class="grid">
  <div><label>اسم المشترك</label><input id="name" placeholder=" " autocomplete="off"></div>
  <div><label>كود المشترك</label><input id="code" placeholder=" " autocomplete="off"></div>
  <div><label>MAC الرسيفر (اختياري - اتركه فارغ)</label><input id="mac" placeholder="اتركه فارغ، السيرفر راح يبصم الجهاز اوتوماتيك" style="direction:ltr" autocomplete="off"></div>
  <div><label>تاريخ الانتهاء</label><input id="expiry" type="date"></div>
  </div>
  <button class="btn btn-add" onclick="addSub()">+ اضافة مشترك</button>
  </div>
  <div class="card"><h3>🔍 بحث</h3><input id="search" placeholder="ابحث بالاسم او الكود او MAC..." oninput="load()" style="margin-bottom:0" autocomplete="off"></div>
  <div class="card" style="display:flex;gap:10px"><button class="btn btn-export" onclick="load()">تحديث القائمة</button><button class="btn btn-export" style="background:#fff;color:#0f172a;border:1px solid #e2e8f0" onclick="exportCSV()">📥 تصدير اكسل CSV</button></div>
  <div id="list"></div>
  <div id="debug" class="card" style="display:none;color:#991b1b;font-size:12px;white-space:pre-wrap"></div>
  </div>
  <script>
  function showErr(t){ const d=document.getElementById('debug'); d.style.display='block'; d.textContent=t; }
  function formatLast(s){
    if(!s) return 'لم يدخل بعد';
    const d=new Date(s);
    const now=new Date();
    const diffMin=Math.floor((now-d)/60000);
    if(diffMin<1) return 'الان 🟢';
    if(diffMin<60) return 'قبل '+diffMin+' دقيقة';
    if(diffMin<1440) return 'قبل '+Math.floor(diffMin/60)+' ساعة';
    return d.toLocaleString('ar-IQ',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
  }
  async function load(){
    const q=document.getElementById('search').value||'';
    const r=await fetch('/api/subs?q='+encodeURIComponent(q));
    if(r.status===401){ location.href='/login'; return; }
    const data=await r.json();
    if(data.error){ showErr('خطأ بالقراءة: '+JSON.stringify(data)); return; }
    if(!data.length){document.getElementById('list').innerHTML='<div class="card" style="text-align:center;color:#64748b">لا يوجد مشتركين بعد</div>';return;}
    let h='<table><tr><th>الاسم / الكود</th><th>بصمة الجهاز</th><th>تعديل الانتهاء</th><th>اخر ظهور</th><th>حالة</th><th>اجراء</th></tr>';
    data.forEach(s=>{
      h+=\`<tr>
        <td><b>\${s.name}</b><br><span style="direction:ltr;color:#64748b">\${s.code}</span><br><button class="btn-small btn-blue" onclick="copyLink('\${s.code}')">📋 نسخ رابط VLC</button><br><button class="btn-small btn-green" onclick="copyExo('\${s.code}')">▶️ نسخ رابط ExoPlayer</button></td>
        <td><span style="font-size:10px;direction:ltr">\${s.device_id ? s.device_id.slice(0,8)+'...' : 'لم يرتبط بعد'}</span><br><span style="color:#64748b;font-size:10px">MAC: \${s.mac_address||'-'}</span><br><button class="btn-small btn-blue" onclick="saveMac('\${s.code}')">حفظ MAC</button></td>
        <td><input class="date-input" type="date" id="date-\${s.code}" value="\${s.expiry||''}"><br><button class="btn-small btn-green" onclick="saveDate('\${s.code}')">💾 حفظ التاريخ</button></td>
        <td>\${formatLast(s.last_seen)}<br><span style="color:#64748b;font-size:10px">IP: \${s.device_ip||'-'}</span><br><button class="btn-small btn-gray" onclick="load()">🔄 تحديث اخر ظهور</button></td>
        <td><span class="badge \${s.active?'on':'off'}">\${s.active?'✅ فعال':'⛔ موقوف'}</span></td>
        <td><button class="btn-small btn-orange" onclick="resetDevice('\${s.code}')">🔓 فك ربط الجهاز</button><br><button class="btn-small btn-gray" onclick="toggle('\${s.code}',\${!s.active})">ايقاف/تشغيل</button><button class="btn-small btn-red" onclick="delSub('\${s.code}')">حذف</button></td>
      </tr>\`;
    });
    document.getElementById('list').innerHTML=h+'</table>';
  }
  function copyLink(code){
    const base=location.origin+'/playlist?code='+code+'&player=1';
    navigator.clipboard.writeText(base);
    alert('تم نسخ رابط VLC:\\n'+base+'\\n\\nملاحظة: الرابط بدون MAC، السيرفر راح يبصم اول جهاز يشغله ويمنع الثاني');
  }
  function copyExo(code){
    const base=location.origin+'/playlist.m3u8?code='+code+'&player=1';
    navigator.clipboard.writeText(base);
    alert('تم نسخ رابط ExoPlayer:\\n'+base);
  }
  async function addSub(){
    const body={name:document.getElementById('name').value,code:document.getElementById('code').value,mac_address:document.getElementById('mac').value.toUpperCase(),expiry:document.getElementById('expiry').value};
    if(!body.name||!body.code) return alert('اكتب الاسم والكود');
    const r=await fetch('/api/subs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const j=await r.json();
    if(!r.ok || j.error || j.message){ alert('فشل الاضافة: '+JSON.stringify(j)); showErr(JSON.stringify(j,null,2)); return; }
    alert('تمت الاضافة ✅'); document.getElementById('name').value=''; document.getElementById('code').value=''; document.getElementById('mac').value=''; load();
  }
  async function saveDate(code){
    const expiry=document.getElementById('date-'+code).value;
    if(!expiry) return alert('اختار تاريخ');
    await fetch('/api/update-date',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,expiry})});
    alert('تم تعديل التاريخ الى '+expiry+' ✅'); load();
  }
  async function saveMac(code){
    const mac=prompt('اكتب MAC الجديد (اختياري)');
    if(mac===null) return;
    await fetch('/api/update-mac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,mac_address:mac.toUpperCase()})});
    alert('تم حفظ MAC ✅'); load();
  }
  async function toggle(code,active){
    await fetch('/api/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,active})});
    load();
  }
  async function resetDevice(code){
    if(!confirm('تفك ربط الجهاز لهذا المشترك؟ راح يسمح لجهاز جديد يشغل'))return;
    await fetch('/api/reset-device',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});
    alert('تم فك الربط ✅ الجهاز الجديد راح ينحجز من اول تشغيل'); load();
  }
  async function delSub(code){
    if(!confirm('متأكد حذف؟'))return;
    await fetch('/api/subs?code='+code,{method:'DELETE'});
    load();
  }
  function exportCSV(){ window.open('/api/export'); }
  load();
  </script></body></html>`);
});

app.get('/api/subs', requireAdmin, async (req, res) => {
  let url = `${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc&limit=1000`;
  if (req.query.q) url += `&or=(name.ilike.*${encodeURIComponent(req.query.q)}*,code.ilike.*${encodeURIComponent(req.query.q)}*,mac_address.ilike.*${encodeURIComponent(req.query.q)}*)`;
  const r = await fetch(url, { headers });
  const j = await r.json();
  if(!r.ok) return res.status(r.status).json(j);
  res.json(j);
});

app.post('/api/subs', requireAdmin, async (req, res) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, { method: 'POST', headers, body: JSON.stringify({ name: req.body.name, code: req.body.code, mac_address: req.body.mac_address || null, expiry: req.body.expiry || null, active: true }) });
  const j = await r.json();
  if(!r.ok) return res.status(r.status).json(j);
  res.json(j);
});

app.post('/api/update-date', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ expiry: req.body.expiry }) });
  res.json({ ok: true });
});

app.post('/api/update-mac', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: req.body.mac_address || null }) });
  res.json({ ok: true });
});

app.post('/api/toggle', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ active: req.body.active }) });
  res.json({ ok: true });
});

app.post('/api/reset-device', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: null, device_id: null, device_ip: null, last_seen: null }) });
  res.json({ ok: true });
});

app.delete('/api/subs', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.query.code}`, { method: 'DELETE', headers });
  res.json({ ok: true });
});

app.get('/api/export', requireAdmin, async (req, res) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc`, { headers });
  const data = await r.json();
  let csv = "name,code,mac_address,active,expiry,last_seen,device_ip\n";
  data.forEach(s => csv += `"${s.name}","${s.code}","${s.mac_address||''}",${s.active},${s.expiry},"${s.last_seen||''}","${s.device_ip||''}"\n`);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
  res.send(csv);
});

app.get('/', (req, res) => {
  if(isBrowser(req)) return fakePlayer(res);
  res.send("TV Server - Supabase OK");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running " + PORT));
