"use strict";setTimeout(function(){new ScrollLoad({scrollContanier:".infinite-scroll",listContanier:".find-content",template:function(t){for(var n="",e=0;e<t.length;e++){var a=t[e];n+='\n                <a href="'+$.getMovDetails(a.id)+'" class="find-list external">\n                    <div class="imgbox">\n                        <img src="'+a.poster+'" alt="">\n                        <div class="status">'+$.getUpdateStatus(a.updateStatus)+'</div>\n                    </div>\n                    <p class="name">'+a.title+"</p>\n                </a>\n                "}return n},ajax:function(t){$.ajax({type:"get",url:"http://www.funying.cn/wx/rest/find/all",data:{sort:1,openId:$.openId,skip:this.currentPage,limit:this.perload},success:function(n){n.DATA?t(n.DATA):$.alert("没有数据了")},error:function(t){console.log(t),$.alert("刷新失败，请稍后再试！")}})}})});