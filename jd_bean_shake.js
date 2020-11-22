// 京豆摇一摇
const {Env} = require('../utils/Env')
const $ = new Env('京豆摇一摇');
const notify = $.isNode() ? require('../utils/sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('../utils/jdCookie') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr.push($.getdata('CookieJD'));
  cookiesArr.push($.getdata('CookieJD2'));
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.expenseBean = 0;
      $.errorMsg = '';
      $.isLogin = true;
      $.nickName = '';
      $.remainLotteryTimes = 999
      $.rewardBeanAmount = 0
      await TotalBean()
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
        $.setdata('', `CookieJD${i ? i + 1 : ""}`);//cookie失效，故清空cookie。
        if ($.isNode()) await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        continue
      }
      do {
        let {data, message} = await shakeBean();
        if (data) {
          $.rewardBeanAmount += data['rewardBeanAmount'] || 0
          $.remainLotteryTimes = Number(data['remainLotteryTimes'])
        } else {
          $.msg(`失败！原因：${message}`)
          $.remainLotteryTimes = 0
        }
      } while ($.remainLotteryTimes > 0)
      await showMsg()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

function shakeBean() {
  return new Promise(async resolve => {
    const url = `https://api.m.jd.com/?t=${new Date().getTime()}&appid=sharkBean&functionId=vvipclub_shaking_lottery&body=%7B%7D`
    const options = {
      "url": url,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": url,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */

/******************** 转换器 ********************/
let isQuantumultX=$task!=undefined;let isSurge=$httpClient!=undefined;let isLoon=isSurge&&typeof $loon!=undefined;var $task=isQuantumultX?$task:{};var $httpClient=isSurge?$httpClient:{};var $prefs=isQuantumultX?$prefs:{};var $persistentStore=isSurge?$persistentStore:{};var $notify=isQuantumultX?$notify:{};var $notification=isSurge?$notification:{};if(isQuantumultX){var errorInfo={error:"",};$httpClient={get:(url,cb)=>{var urlObj;if(typeof url=="string"){urlObj={url:url,}}else{urlObj=url}
$task.fetch(urlObj).then((response)=>{cb(undefined,response,response.body)},(reason)=>{errorInfo.error=reason.error;cb(errorInfo,response,"")})},post:(url,cb)=>{var urlObj;if(typeof url=="string"){urlObj={url:url,}}else{urlObj=url}
url.method="POST";$task.fetch(urlObj).then((response)=>{cb(undefined,response,response.body)},(reason)=>{errorInfo.error=reason.error;cb(errorInfo,response,"")})},}}
if(isSurge){$task={fetch:(url)=>{return new Promise((resolve,reject)=>{if(url.method=="POST"){$httpClient.post(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error,})}else{resolve(null,{error:error,})}})}else{$httpClient.get(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error,})}else{resolve(null,{error:error,})}})}})},}}
if(isQuantumultX){$persistentStore={read:(key)=>{return $prefs.valueForKey(key)},write:(val,key)=>{return $prefs.setValueForKey(val,key)},}}
if(isSurge){$prefs={valueForKey:(key)=>{return $persistentStore.read(key)},setValueForKey:(val,key)=>{return $persistentStore.write(val,key)},}}
if(isQuantumultX){$notify=((notify)=>{return function(title,subTitle,detail,url=undefined){detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;notify(title,subTitle,detail)}})($notify);$notification={post:(title,subTitle,detail,url=undefined)=>{detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;$notify(title,subTitle,detail)},}}
if(isSurge&&!isLoon){$notification.post=((notify)=>{return function(title,subTitle,detail,url=undefined){detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;notify.call($notification,title,subTitle,detail)}})($notification.post);$notify=(title,subTitle,detail,url=undefined)=>{detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;$notification.post(title,subTitle,detail)}}
if(isLoon){$notify=(title,subTitle,detail,url=undefined)=>{$notification.post(title,subTitle,detail,url)}}
/******************** 转换器 ********************/*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            $.nickName = data['base'].nickname;
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function showMsg() {
  $.msg($.name, `账号${$.index} ${$.nickName || $.UserName}`, `本次共获得京豆：${$.rewardBeanAmount}`)
}
