// ═══════════════════════════════════════════════════════
//  ZenCode Astro Calc Core
//  地理、时间与真太阳时计算核心逻辑
// ═══════════════════════════════════════════════════════

export const ZenAstro = (function() {

  // ── 1. 精確節氣表（精確到分鐘） ──────────────────────────
  const JQTBL_PRECISE={
    1950:[[6,17,29],[4,7,9],[6,23,9],[5,17,3],[6,12,15],[6,8,31],[8,4,24],[8,2,8],[8,17,37],[8,20,45],[8,0,38],[7,18,17]],
    1951:[[6,22,33],[4,12,54],[6,5,11],[5,23,5],[6,18,39],[6,14,34],[7,10,59],[8,8,35],[8,23,1],[8,2,28],[8,5,53],[7,0,2]],
    // ... (JQTBL_PRECISE 的完整數據，請從首页复制到這裡) ...
    2029:[[5,3,27],[3,9,34],[6,5,23],[4,22,53],[5,17,11],[6,12,47],[7,10,9],[7,7,23],[7,22,56],[8,1,27],[7,5,30],[6,22,41]],
    2030:[[5,9,33],[4,15,25],[6,11,4],[5,5,32],[5,22,39],[6,18,1],[7,15,13],[7,12,32],[8,3,56],[8,7,6],[7,11,0],[7,4,40]]
  };

  // ── 2. 地理編碼與真太陽時 ─────────────────────────────
  
  // 地點經度字典估算
  const CITY_LNG={
    '北京':116.4,'天津':117.2,'石家莊':114.5,'太原':112.5,'呼和浩特':111.7,
    '瀋陽':123.4,'大連':121.6,'長春':125.3,'哈爾濱':126.5,'吉林':126.5,
    '上海':121.5,'南京':118.8,'杭州':120.2,'蘇州':120.6,'無錫':120.3,
    '寧波':121.5,'合肥':117.3,'福州':119.3,'廈門':118.1,'南昌':115.9,
    '濟南':117.1,'青島':120.4,'鄭州':113.6,'武漢':114.3,'長沙':113.0,
    '廣州':113.3,'深圳':114.1,'佛山':113.1,'東莞':113.7,'珠海':113.6,
    '南寧':108.3,'海口':110.3,'三亞':109.5,'重慶':106.5,'成都':104.1,
    '貴陽':106.7,'昆明':102.7,'拉薩':91.1,'西安':108.9,'蘭州':103.8,
    '西寧':101.8,'銀川':106.3,'烏魯木齊':87.6,'台北':121.5,'高雄':120.3,
    '香港':114.2,'澳門':113.5,'新加坡':103.8,'馬來西亞':101.7,'吉隆坡':101.7,
    '紐約':-74.0,'洛杉磯':-118.2,'舊金山':-122.4,'溫哥華':-123.1,
    '倫敦':-0.1,'巴黎':2.3,'悉尼':151.2,'墨爾本':145.0,'東京':139.7,
  };
  const PROV_LNG={
    '黑龍江':128,'吉林':125,'遼寧':123,'內蒙古':112,'新疆':86,'西藏':91,
    '青海':98,'甘肅':103,'寧夏':106,'陝西':109,'山西':112,'河北':115,
    '北京':116,'天津':117,'山東':118,'河南':114,'湖北':114,'安徽':117,
    '江蘇':119,'上海':122,'浙江':120,'江西':116,'湖南':112,'廣東':113,
    '廣西':108,'福建':118,'海南':110,'四川':103,'重慶':107,'貴州':107,
    '雲云南':102,'台灣':121,'香港':114,'澳門':113,
  };

  let _geoLng = null;
  let _geoLat = undefined;
  let _geoLabel = '';
  const _geoCache = {};

  // 取地點經度
  function getLngByPlace(place){
    if(!place) return null;
    const bp = place.replace(/省|市|縣|區|自治區|特別行政區/g,'');
    for(const[k,v] of Object.entries(CITY_LNG)){ if(bp.includes(k.replace(/市/g,''))) return v; }
    for(const[k,v] of Object.entries(PROV_LNG)){ if(place.includes(k)) return v; }
    return null;
  }

  // 真太陽時校正
  function correctSolarTime(hour, minute, inplaceLng, tzOffset=8){
    if(inplaceLng===null) return{hour,minute,adjusted:false,diffMin:0,lng:null};
    const diffMin=Math.round(inplaceLng*4 - tzOffset*60);
    const total=((hour*60+minute+diffMin)%1440+1440)%1440;
    return{hour:Math.floor(total/60),minute:Math.floor(total%60),adjusted:true,diffMin,lng:inplaceLng};
  }

  // 地理編碼
  async function geocodePlace(place, onSuccess, onError, onFinally) {
    if (!place || place.length < 2) return;
    if (_geoCache[place] !== undefined) {
      _geoLng   = _geoCache[place].lng;
      _geoLat   = _geoCache[place].lat;
      _geoLabel = _geoCache[place].label;
      if(onSuccess) onSuccess({lng: _geoLng, lat: _geoLat, label: _geoLabel});
      if(onFinally) onFinally();
      return;
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1&accept-language=zh`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'zh,en' } });
      const data = await res.json();

      if (data && data.length > 0) {
        const item = data[0];
        _geoLng   = parseFloat(item.lon);
        _geoLat   = parseFloat(item.lat);
        _geoLabel = item.display_name.split(',').slice(0,3).join(',');
      } else {
        _geoLng   = getLngByPlace(place);
        _geoLat   = undefined;
        _geoLabel = '';
      }
      _geoCache[place] = { lng: _geoLng, lat: _geoLat, label: _geoLabel };
      if(onSuccess) onSuccess({lng: _geoLng, lat: _geoLat, label: _geoLabel});
    } catch(e) {
      _geoLng   = getLngByPlace(place);
      _geoLat   = undefined;
      _geoLabel = '';
      if(onError) onError(e);
    } finally {
      if(onFinally) onFinally();
    }
  }

  // ── 3. 日曆換算與 JDN ──────────────────────────────
  const LD=(function(){ /* ... (LD 的数据，从首页复制到这里) ... */ })();
  function lunarToSolar(ly,lm,ld,isLeap){
    // ... (lunarToSolar 的完整逻辑，从首页复制到这里) ...
  }
  function jdn(y,m,d){ /* ... (jdn 的完整逻辑，从首页复制到这里) ... */ }

  // ── 4. 公開 API ─────────────────────────────────────────
  return {
    correctSolarTime,
    geocodePlace,
    lunarToSolar,
    jdn,
    // 公開狀態
    getLng: () => _geoLng,
    getLat: () => _geoLat,
    getLabel: () => _geoLabel,
  };

})();
