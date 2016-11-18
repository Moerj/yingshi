"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol?"symbol":typeof n};$(function(){function n(n){$("#banner img").each(function(t,e){e.src=n[t].pUrl}),$("#banner a").each(function(t,e){var a=$(e);a.attr("href",$.getMovDetails(n[t].id))}),$("#banner").swiper({loop:!0,autoplay:5e3,pagination:".swiper-pagination"})}function t(n){for(var t="",e=0;e<n.length;e++){var a=n[e];t+='\n            <li>\n            <a href="'+$.getMovDetails(a.id)+'" class="external">\n                <div class="imgbox">\n                    <img src="'+a.poster+'" />\n                    <p class="name">'+(0==a.updateStatus?"更新中":"已完结")+'</p>\n                </div>\n                <p class="text">'+a.introduction+"</p>\n            </a>\n            </li>\n            "}$("#rec1 ul").append(t)}function e(n){$(".recommended-2 a").each(function(t,e){var a=$(e);a.attr("href",$.getArtDetails(n[t].id)),a.find("img").attr("src",n[t].pictrueUrl),a.find(".titleInfo").text(n[t].title),a.find(".content-text").text(n[t].introduction)})}function a(n){for(var t="",e=0;e<n.length;e++){var a=n[e];t+='\n            <li>\n                <a class="external flexlist" href="'+$.getMovDetails(a.id)+'">\n                    <div class="imgbox">\n                        <img src="'+a.poster+'" alt="">\n                    </div>\n                    <div class="info">\n                        <span class="t"><span class="index">0'+(e+1)+"</span>"+a.title+'</span>\n                        <p class="text">'+a.introduction+'</p>\n                        <span class="text2">更新到第'+a.updateSite+"集</span>\n                    </div>\n                </a>\n            </li>\n            "}$("#rankTop").append(t)}function i(n){function t(n,t){for(var e="",a=0;a<t.length;a++){var i=t[0];e+='\n                <li>\n                    <a class="external flexlist" href="'+$.getMovDetails(i.id)+'">\n                        <div class="imgbox">\n                            <img src="'+i.poster+'" >\n                        </div>\n                        <div class="info">\n                            <span class="t"><span class="index">'+(a+1)+"</span>"+i.title+'</span>\n                            <p class="text">'+i.introduction+'</p>\n                            <span class="text2">更新到第'+i.updateSite+"集</span>\n                        </div>\n                    </a>\n                </li>\n                "}$(n).empty().append(e)}$.showPreloader(),$.ajax({type:"get",dataType:"json",url:"http://wechat.94joy.com/wx/rest/index/ranking",success:function(e){1==e.STATUS&&t(n,e.RANK_LIST)},error:function(n){console.log("排行加载出错",n)},complete:function(){$.hidePreloader()}})}$.showPreloader(),$.ajax({type:"get",dataType:"json",url:"http://wechat.94joy.com/wx/rest/index/index",success:function(i){n(i.headerRes),t(i.bestMovies),e(i.mainRes),a(i.rankTop)},error:function(n){console.log("首页加载出错",n),$.alert("首页加载出错，请稍后再试")},complete:function(){$.hidePreloader()}});var s=$(".ranking .tab-link"),o=$(".ranking .hotlist");s.one("click",function(){i(o[$(this).index()])}),$("#rank-indexbtn").one("click",function(){i(o[0])});var r=$(".search-tools input");r.on("input",function(){r.not($(this)).val($(this).val())}),$(document).on("click",".search",function(n){n.stopPropagation();var t=$(this);if(t.hasClass("search-open")&&$(".search-tools").toggleClass("search-show"),t.hasClass("search-btn")){var e=function(){var n=$.trim(t.parent().find("input").val());if(!n)return{v:void 0};var e=$(".search-list ul");$.showPreloader(),$.ajax({type:"get",url:"http://wechat.94joy.com/wx/rest/index/search",data:{searchName:n},dataType:"json",success:function(n){var t="";if(e.empty(),1==n.STATUS){for(var a=n.MOVIES.content,i=0;i<a.length;i++){var s=n.MOVIES.content[i],o=s.id<10?"0"+s.id:s.id;t+='\n                            <li>\n                                <a class="external flexlist" href="'+$.getMovDetails(s.id)+'">\n                                    <div class="imgbox">\n                                        <img src="'+s.poster+'" />\n                                    </div>\n                                    <div class="info">\n                                        <span class="t"><span class="index">'+o+"</span>"+s.title+'</span>\n                                        <p class="text">'+s.introduction+'</p>\n                                        <span class="text2">更新到第'+s.updateSite+"集</span>\n                                    </div>\n                                </a>\n                            </li>\n                           "}e.append(t),e.show()}else e.hide()},error:function(n){console.log(n),$.alert("搜索出错，请稍后再试")},complete:function(){$.hidePreloader()}})}();if("object"===("undefined"==typeof e?"undefined":_typeof(e)))return e.v}})});