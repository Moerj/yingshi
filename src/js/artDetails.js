// 文章详情

{

    $.showPreloader();

    $.ajax({
        type: "get",
        url: "http://118.178.136.60:8001/rest/index/getArticle",
        data: {
            articleId: $.GetQueryString('articleId'),
            openId: window.openId,
            oldOpenId: $.GetQueryString('oldOpenId')
        },
        success: function (res) {
            // console.log(res);
            if (res.STATUS == 1) {
                render(res)
            } else {
                $.alert('文章详情不存在！', function () {
                    $.router.back();
                })
            }
        },
        error: (e) => {
            let str = `文章详情获取失败，稍后再试！`
            console.log(str, e);
            $.alert(str, function () {
                $.router.back()
            })
        },
        complete: () => {
            $.hidePreloader();
        }
    });

    function render(res) {
        const data = res.ARTICLE
            // console.log(data);
        $('.text').append(data.context)
        $('.time').text(data.updateTime)
        $('.Title').text(data.title)

        // 判断是否会员，然后隐藏二维码
        if (res.IS_SUBSCRIBE) {
            $('#SUBSCRIBE').hide()
        }
    }
}