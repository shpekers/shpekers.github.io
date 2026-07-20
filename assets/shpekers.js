/* ==========================================
   SHPEKERS Framework · Scripts
   ========================================== */
(function(){
  'use strict';

  var SHPEKERS = window.SHPEKERS = {};
  var readyCallbacks = [];

  /* --- Preloader --- */
  var PRELOADER_MIN = 1000;
  var PRELOADER_MAX = 4000;

  function hidePreloader(){
    var p = document.getElementById('preloader');
    var page = document.getElementById('page');
    if(p && !p.classList.contains('hidden')){
      p.classList.add('hidden');
      if(page) page.classList.add('visible');
      readyCallbacks.forEach(function(cb){
        try{ cb(); }catch(e){ console.error(e); }
      });
    }
  }
  window.addEventListener('load', function(){ setTimeout(hidePreloader, PRELOADER_MIN); });
  setTimeout(hidePreloader, PRELOADER_MAX);

  SHPEKERS.onReady = function(cb){
    if(typeof cb === 'function') readyCallbacks.push(cb);
  };

  /* --- Toast --- */
  SHPEKERS.toast = function(message, duration){
    var toast = document.getElementById('toast');
    if(!toast){
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.setAttribute('role','status');
      toast.setAttribute('aria-live','polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message || 'Готово';
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function(){ toast.classList.remove('show'); }, duration || 1800);
  };

  /* --- Copy to clipboard --- */
  SHPEKERS.copy = function(text, successMsg){
    var msg = successMsg || 'Скопировано';
    var done = function(){ SHPEKERS.toast(msg); };
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text).then(done).catch(fb);
    } else fb();
    function fb(){
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position='fixed';ta.style.opacity='0';
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand('copy'); }catch(e){}
      ta.remove();
      done();
    }
  };

  /* Хелпер для inline onclick */
  window.copyById = function(id, msg){
    var el = document.getElementById(id);
    if(el) SHPEKERS.copy(el.textContent.trim(), msg);
  };

  /* --- Ad Block --- */
  var AD_KEY = 'shpekers_ad_closed_at';
  var AD_HIDE = 6 * 60 * 60 * 1000; // 6 часов
  var AD_DELAY = 1500;

  function shouldShowAd(){
    try{
      var t = localStorage.getItem(AD_KEY);
      if(!t) return true;
      return (Date.now() - parseInt(t,10)) > AD_HIDE;
    }catch(e){ return true; }
  }

  SHPEKERS.onReady(function(){
    if(!shouldShowAd()) return;
    var ad = document.getElementById('ad');
    if(!ad) return;
    setTimeout(function(){ ad.classList.add('visible'); }, AD_DELAY);
  });

  window.closeAd = function(){
    var ad = document.getElementById('ad');
    if(!ad) return;
    ad.classList.add('closing');
    try{ localStorage.setItem(AD_KEY, Date.now().toString()); }catch(e){}
    setTimeout(function(){ if(ad.parentNode) ad.parentNode.removeChild(ad); }, 500);
  };
})();