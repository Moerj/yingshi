// 收益明细
setTimeout(function () {


    // 收益明细页数据
    function entry() {
        new ScrollLoad({

            cache:false,

            scrollContanier: '#profitScrollContanier', //滚动父容器
            listContanier: '#profitList',
            // maxload: 10,
            // perload: 7,

            // 配置渲染模板
            template: (data) => {
                let html = '';
                for (let i = 0; i < data.length; i++) {
                    let d = data[i]

                    // 推客名
                    let name = d.one_level_amount || d.second_level_amount || d.three_level_amount || ''

                    let details // 收益详情
                    let classType // 推客等级
                    let amount //额度

                    switch (Number(d.type)) {
                        case 1:
                            classType = 'one'
                            details = `从一级推客${name}获取收益`
                            amount = d.charge_amount
                            break;
                        case 2:
                            classType = 'two'
                            details = `从二级推客${name}获取收益`
                            amount = d.charge_amount
                            break;
                        case 3:
                            classType = 'three'
                            details = `从三级推客${name}获取收益`
                            amount = d.charge_amount
                            break;
                        case 4:
                            details = `提现`
                            amount = d.profit_amount
                            classType = 'other'
                            break;
                        case 5:
                            details = `消费`
                            amount = d.profit_amount
                            classType = 'other'
                            break;
                        case 6:
                            details = `充值`
                            amount = d.charge_amount
                            classType = 'other'
                            break;
                        default:

                            break;
                    }

                    // 时间
                    let addTime = d.add_time.split(' ')
                    let day = addTime[0]
                    let time = addTime[1]


                    // 创建模板
                    html += `
                    <li class=${classType}>
                        <div class="date">
                            <div class="day">${day}</div>
                            <div class="time">${time}</div>
                        </div>
                        <div class="info">
                            <img class="i1" src=${d.image||'../images/icon/user.png'} alt="">
                            <div class="i2">
                                <span class="num">${d.charge_amount?'+':'-'}${amount}</span>
                                <span class="text">${details}</span>
                            </div>
                        </div>
                    </li>
                    `
                }
                return html
            },

            ajax: function (callback) {

                $.ajax({
                    url: 'http://www.funying.cn/wx/rest/pay/detail',
                    data: {
                        openId: $.openId,
                        skip: this.currentPage, //当前页
                        limit: this.perload //每页条数
                    },
                    success: (res) => {
                        console.log('收益明细：', res);
                        if (res.STATUS == 1) {
                            callback(res.data)

                            // 昨日收益
                            let yestAmt = res.yestAmt
                            yestAmt = yestAmt >= 0 ? `+${yestAmt}` : `-${yestAmt}`
                            $('#profit-yestAmt').text($.formatAmount(yestAmt))

                            // 累计收益
                            // $('#profit-LucreAmt').text($.formatAmount(res.LucreAmt))
                            $('#profit-LucreAmt').text($.formatAmount(res.oneAmt + res.secondAmt + res.threeAmt))

                            // 推客收益总和
                            $('#profit-oneAmt').text($.formatAmount(res.oneAmt))
                            $('#profit-secondAmt').text($.formatAmount(res.secondAmt))
                            $('#profit-threeAmt').text($.formatAmount(res.threeAmt))


                        } else {
                            console.log('收益明细没有数据');
                        }
                    },
                    error: (e) => {
                        console.log(e);
                        $.alert('刷新失败，请稍后再试！')
                    },
                    complete: () => {}
                });
            }
        })
    }


    // 推客明细
    function twitter(pageId, type) {
        let TYPE
        switch (Number(type)) {
            case 1:
                TYPE = '一'
                break;
            case 2:
                TYPE = '二'
                break;
            case 3:
                TYPE = '三'
                break;

            default:
                break;
        }
        $(pageId).find('.pageName').text(`我的${TYPE}级推客`)

        new ScrollLoad({
            scrollContanier: `${pageId} .con2`, //滚动父容器
            listContanier: `${pageId} .list`,
            cache:false,
            // maxload: 10,
            // perload: 7,

            // 配置渲染模板
            template: (data) => {
                let html = '';
                for (let i = 0; i < data.length; i++) {
                    let d = data[i]

                    // 推客名
                    let name = d.one_level_amount || d.second_level_amount || d.three_level_amount || '未知推客'

                    // 创建模板
                    html += `
                    <li>
                        <div class="info">
                            <img src=${d.image || '../images/icon/user.png'}>
                            <div class="text">
                                <span class="name">${name}</span>
                                <span class="num">+${d.charge_amount}</span>
                            </div>
                        </div>
                    </li>
                    `
                }
                return html
            },

            ajax: function (callback) {
                
                $.ajax({
                    url: 'http://www.funying.cn/wx/rest/pay/twitterDetail',
                    data: {
                        type: type,
                        openId: $.openId,
                        skip: this.currentPage, //当前页
                        limit: this.perload //每页条数
                    },
                    success: (res) => {
                        console.log(type + '级推客：', res);
                        if (res.STATUS == 1) {
                            callback(res.data)

                            // 昨日收益
                            if (res.month) {
                                let month = $.formatAmount(res.month)
                                month = month >= 0 ? `+${month}` : `-${month}`
                                $(`${pageId} .con1 .num`).text(month)
                            }

                            // 累计收益
                            if (res.totalAmt) {
                                $(`${pageId} .con1 .total`).text($.formatAmount(res.totalAmt))
                            }

                        } else {
                            console.log(`${TYPE}级推客没有数据`);
                        }
                    },
                    error: (e) => {
                        console.log(e);
                        $.alert('刷新失败，请稍后再试！')
                    },
                    complete: () => {}
                });
            }
        })
    }

    function pageLoadAll() {
        entry()
        twitter('#page-profit-1', 1)
        twitter('#page-profit-2', 2)
        twitter('#page-profit-3', 3)
    }


    $.pageInit({
        hash: 'page-profit',
        entry: '#entry-profit',
        init: () => {
            pageLoadAll()
        }
    })


}, 100);