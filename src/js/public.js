// 获取openid

$.GetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

window.openId = $.GetQueryString('openid')

// console.log('openId:', window.openId);

// 测试用
window.openId = 'o-IOqxK0lxh9KSLbpxdU8QKILd9Q'


// 无限滚动的懒加载
class ScrollLoad {
    constructor(opt) {
        opt.scrollContanier = $(opt.scrollContanier)
        if (opt.listContanier != undefined) {
            opt.listContanier = $(opt.listContanier)
        }

        // 默认参数
        const DEFAULT = {
            maxload: 1000, //最大条数
            perload: 27, //每次分页条数
            loading: false, //加载等待
            currentPage: 1, //当前页
            listContanier: opt.scrollContanier, //list容器，默认等于scroll容器
            scrollContanier: opt.scrollContanier
        }

        opt = $.extend({}, DEFAULT, opt)

        // 将opt参数解构给this
        for (let key in opt) {
            if (opt.hasOwnProperty(key)) {
                this[key] = opt[key]
            }
        }

        // 创建loading
        this.preloader = $(`
            <div class="infinite-scroll-preloader">
                <div class="preloader"></div>
            </div>
        `).appendTo(this.listContanier)

        // 调整最大页数
        if (this.perload > this.maxload) {
            this.perload = this.maxload
        }

        // 开启滚动监听
        this.scrollContanier.on('scroll', () => {
            this.scroll()
        });

        // 首次加载
        this.ajax({
            skip: 1, //当前页
            limit: this.perload //每页条数
        }, (data) => {
            if (data.length) {
                this.currentPage++;
                this.render(data)
            }
            if (data.length <= this.perload) {
                this.finish();
            }
        })
    }

    // 滚动逻辑
    scroll() {
        // 滚动到接近底部时加载数据
        if (this.scrollContanier.scrollTop() + this.scrollContanier.height() + 100 < this.scrollContanier[0].scrollHeight) {
            return
        }

        // 如果正在加载，则退出
        if (this.loading) return;

        // 超出最大限制
        if (this.listContanier.children().length >= this.maxload) {
            this.finish();
            return;
        }

        // 设置flag
        this.loading = true;

        this.ajax({
            skip: this.currentPage, //当前页
            limit: this.perload //每页条数
        }, (data) => {
            // 重置加载flag
            this.loading = false;

            // 数据加载完
            if (data.length <= 0) {
                this.finish();
                return;
            }

            this.currentPage++;
            this.render(data)

        })
    }

    // 刷新数据
    reload() {
        // 滚动条置顶
        this.scrollContanier[0].scrollTop = 0;

        // 回复loading的效果
        this.preloader.html('<div class="preloader"></div>')

        // 当前页从1开始
        this.currentPage = 1;

        // 重置状态
        this.loading = false;

        // 开启无限加载
        this.scrollContanier.on('scroll', () => {
            this.scroll()
        })

        // loading效果
        $.showIndicator()

        this.ajax({
            skip: 1, //当前页
            limit: this.perload //每页条数
        }, (data) => {
            this.listContanier.empty()
            if (data.length) {
                this.currentPage++;
                this.render(data)
            } else {
                this.finish();
            }
            $.hideIndicator();
        })
    }

    // 加载完成
    finish() {
        // 关闭滚动监听
        this.scrollContanier.off('scroll')

        // 删除加载提示符
        this.preloader.text('已经到底了！');
    }

    // 进行渲染
    render(data) {
        // 根据每页条数限制data长度
        // 后台返回的数据，有可能超过自定分页长度
        if (this.perload < data.length) {
            data.length = this.perload
        }
        let html = this.template(data)

        // 添加新条目
        this.listContanier.append(html);

        // 将loader移动到列表末
        this.preloader.appendTo(this.listContanier)

    }
}


// $ 下的公共方法

// 生成影视详情的url
$.getMovDetails = function (id) {
    // http://localhost:3000/html/articleDetails.html?articleId=1&oldOpenId=123
    return `./movieDetails.html?movieId=${id}&oldOpenId=${window.openId}`
}

// 生成文章详情
$.getArtDetails = function (id) {
    return `./articleDetails.html?articleId=${id}&oldOpenId=${window.openId}`
}



$.msg = function (opts, timeout) {
    let text = opts.text || opts
    let title = opts.title || '温馨提示'
    let callback = opts.callback

    if (timeout === undefined) {
        timeout = opts.timeout || 2000
    }

    let $tpl = $(`
        <div class="mask">
            <div class="msg">
                <p class="msg-title">${title}</p>
                <p class="msg-text">${text}</p>
            </div>
        </div>
    `);

    $('body').append($tpl)

    if (timeout) {
        setTimeout(function () {
            $tpl.remove()
            if (callback) {
                callback()
            }
        }, timeout);
    }
}

// jq 对象新增方法
$.fn.init = function (data) {

    for (let i = 0; i < this.length; i++) {
        let thisJq = $(this[i])
            // console.log(thisJq);
        if (this[i].localName === 'img') {
            thisJq.attr('src', data)
        } else if (thisJq.val() == undefined) {
            thisJq.text(data)
        } else {
            thisJq.val(data)
        }
        thisJq.removeClass('hide').show()
    }

}



// 影视详情跳转
$(document).on('click', '.getMovie', function () {
    function _updateDetailsPage(res) {
        let $page = $('.movieDetails')
        $page.find('.pic').attr('src', res.MOVIE.poster)
    }

    let $this = $(this)
    let movieId = $this.attr('movieId')
    $.ajax({
        type: "get",
        url: "http://118.178.136.60:8001/rest/index/getMovie",
        data: {
            movieId: movieId
        },
        success: function (res) {
            console.log(res);
            _updateDetailsPage(res);
        },
        error: function (e) {
            console.log('影视详情页获取失败。', e);
        }
    });
})