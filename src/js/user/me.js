// 个人中心

{

    const $uploadPicker = $('#headpicUpload'); //头像input file
    const $headimg = $('#headerImg'); //头像img

    // 我的页面数据
    $.page_me_reload = function () {
        $.ajax({
            url: "http://wechat.94joy.com/wx/rest/user/index",
            data: {
                openId: $.openId
            },
            success: function (res) {
                // headerImg头像，nickName微信昵称，lucreAmount收益余额，充值余额rechargeAmount
                console.log('个人中心首页数据：', res);
                if (res.STATUS == 1 && res.DATA) {
                    let data = res.DATA
                    for (let key in data) {
                        $('#' + key).text(data[key])
                    }

                    let rechargeAmountVal = Number($('#rechargeAmount').text())
                    let lucreAmountVal = Number($('#lucreAmount').text())
                    let total = (rechargeAmountVal + lucreAmountVal).toFixed(2)
                    $('#total').text(total)
                    $('.headpic').init(data.headerImg)

                    let pieData = [{
                        name: '收益余额',
                        color: '#F36C60',
                        value: lucreAmountVal
                    }, {
                        name: '充值余额',
                        color: '#FFC107',
                        value: rechargeAmountVal
                    }]

                    makePie(pieData);

                } else {
                    $.alert('用户信息读取失败')
                }
            }
        });
    }

    $.page_me_reload()


    // 我的二维码
    $.ajax({
        url: "http://wechat.94joy.com/wx/rest/user/getQrcode",
        data: {
            openId: $.openId
        },
        success: function (res) {
            // console.log(res);
            $('#myqrcode').init(res.code)
        },
        error: function (e) {
            console.error('我的二维码加载失败', e);
        }
    });

    // 账户余额
    function makePie(data) {
        // 拼图
        let newdata = []
        for (let i = 0; i < data.length; i++) {
            newdata.push({
                value: data[i].value,
                itemStyle: {
                    normal: {
                        color: data[i].color
                    }
                }
            })
        }

        let option = {
            silent: true,
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: newdata
            }]
        };

        window.echarts.init($('.echart')[0]).setOption(option);
    }




    //头像上传
    $uploadPicker.change(function () {
        function _updateImg(imgUrl) {
            $.ajax({
                url: "http://118.178.136.60:8001/rest/user/updateImg",
                data: {
                    openId: $.openId,
                    img: imgUrl
                },
                success: function (res) {
                    if (res.STATUS == 1) {
                        $.toast("头像上传成功");
                    } else {
                        $.alert('上传失败，请稍后再试！')
                    }
                },
                error: () => {
                    $.alert('上传失败，请稍后再试！')
                    console.error('接口部分头像上传失败')
                },
                complete: () => {
                    $.hidePreloader();
                }
            });
        }

        let formdata = new FormData();
        let v_this = $(this);
        let fileObj = v_this.get(0).files;
        let url = "http://118.178.136.60:8080/ercsvc-upload/upload";
        let localImgSrc = window.URL.createObjectURL($uploadPicker[0].files[0]);
        formdata.append("imgFile", fileObj[0]);
        $.showPreloader('正在上传头像')
        $.ajax({
            url: url,
            type: 'post',
            data: formdata,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success: (data) => {
                console.log('上传结果：', data);
                if (data[0].result) {
                    $headimg.attr('src', localImgSrc); //更新新头像
                    _updateImg('http://wechat.94joy.com/image' + data[0].result)
                }
            },
            error: () => {
                $.alert('上传失败，请稍后再试！')
                console.error('ftp部分头像上传失败')
                $.hidePreloader();
            }
        });
        return false;
    });



}