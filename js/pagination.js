(function(){

    var queryUrlPara = function() {
        var href = window.location.href,
            search = window.location.search,
            searchParaArr = [],
            urlPara = {};

        if (window.location.search) {
            searchParaArr = window.location.search.substr(1).split('&');
        } else {
            return urlPara;
        }

        for (var i = 0; i < searchParaArr.length; i++) {
            var tempArr = searchParaArr[i].split('=');
            urlPara[tempArr[0]] =  tempArr[1];
        }

        return urlPara;
    }();

    var joinUrlPara = function(urlParaObj) {
        var urlParaStr = '?';

        for (var i in urlParaObj) {
            urlParaStr += i + '=' + urlParaObj[i] + '&';
        }

        urlParaStr = urlParaStr.replace(/\&$/, '');

        return urlParaStr;
    };

    function Pagination(opt) {

        this.options = {
            container: opt.container,
            pageNow: opt.pageNow || 1,
            pageTotal: opt.pageTotal || 1,
            pageDisplay: opt.pageDisplay || 5,
            callback: opt.callback || function(){}
        };

        this.config = {
            showNumMin: 1,
            showNumMax: 5,
            showNumCurrent: 1,
            showIndex: 0
        };

        this.init();
    };

    Pagination.prototype = {
        pageNowNum: queryUrlPara.page/1 || 1,

        render: function () {
            var self = this,
                pageHtml = '';

            pageHtml = '<a href="javascript:;" class="page-prev"><span>上一页</span></a>';

            self.config.showNumMin = self.options.pageNow;
            self.config.showNumMax = self.options.pageDisplay;
            self.config.showNumCurrent = self.pageNowNum;
            self.config.showIndex = self.pageNowNum - 1;

            if(self.options.pageTotal > self.options.pageDisplay){
            // 当前页大于显示的分页数
                if(self.pageNowNum >= self.options.pageDisplay){
                    self.config.showNumMin = self.pageNowNum - Math.floor(self.options.pageDisplay/2);
                    self.config.showNumMax = self.pageNowNum + Math.floor(self.options.pageDisplay/2);
                    self.config.showIndex = self.pageNowNum - (self.pageNowNum - Math.floor(self.options.pageDisplay/2));
                    // 最后几页
                    if(self.pageNowNum >= self.options.pageTotal - self.options.pageDisplay + 2){
                        self.config.showNumMin = self.options.pageTotal - self.options.pageDisplay + 1 ;
                        self.config.showNumMax = self.options.pageTotal;
                        self.config.showIndex = self.options.pageDisplay + (-self.options.pageTotal + self.pageNowNum) - 1;
                    }
                }
            }else{ // 页数小于显示数
                self.config.showNumMax = self.options.pageTotal;
            }

            if(self.pageNowNum > self.options.pageTotal){
                self.config.showIndex = Math.min(self.options.pageDisplay, self.options.pageTotal) - 1;
                self.config.showNumCurrent = self.options.pageTotal;
            }else if(self.pageNowNum < 0){
                self.config.showIndex = 0;
                self.config.showNumCurrent = 1;
            }

            for(var n = self.config.showNumMin; n < self.config.showNumMax + 1; n += 1){
                pageHtml += '<a href="javascript:;" data-page='+ n +' class="page-item"><span>'+ n +'</span></a>';
            }

            pageHtml += '<a href="javascript:;" class="page-next"><span>下一页</span></a>';
            pageHtml += '<span class="page-progress"><span class="now">'+ self.config.showNumCurrent +'</span>/<span class="total">'+ self.options.pageTotal +'</span>页</span>';
            pageHtml += '<span class="page-goto"><input type="tel" class="page-number-text"><button class="btn btn-page-goto">跳转</button></span>';

            self.options.container.innerHTML = pageHtml;
        },

        setUrlPara: function() {
            var urlPara = queryUrlPara;
            urlPara.page = this.config.showNumCurrent;
            window.location.search = joinUrlPara(urlPara);
        },

        matchNum: function (ele) {
            ele.value = ele.value.replace(/\D+/g,'');
        },

        gotoPage: function (ele) {
            this.config.showNumCurrent = ele.getAttribute('data-page');
            if(this.config.showNumCurrent == this.pageNowNum){
                return;
            }
            this.setUrlPara();
        },

        jumpPage: function (ele) {
            this.config.showNumCurrent = ele.value;
            if(this.config.showNumCurrent){
                if(this.config.showNumCurrent > this.options.pageTotal){
                    this.config.showNumCurrent = this.options.pageTotal;
                }else if(this.config.showNumCurrent < 1){
                    this.config.showNumCurrent = 1;
                }
                this.setUrlPara();
            }else{
                alert('请输入页数！');
            }
        },

        prevPage: function (ele) {
            this.pageNowNum -= 1;
            this.config.showNumCurrent = this.pageNowNum;
            this.setUrlPara();
        },

        nextPage: function (ele) {
            this.pageNowNum += 1;
            this.config.showNumCurrent = this.pageNowNum;
            this.setUrlPara();
        },

        init: function () {

            this.render();

            var self = this,
                pageItem = element.byClass('.page-item', self.options.container),
                pagePrevItem = element.byClass('.page-prev', self.options.container)[0],
                pageNextItem = element.byClass('.page-next', self.options.container)[0],
                pageNow = element.byClass('.now', self.options.container)[0],
                pageTotal = element.byClass('.total', self.options.container)[0],
                pageNumberText = element.byClass('.page-number-text', self.options.container)[0],
                pageGotoBtn = element.byClass('.btn-page-goto', self.options.container)[0];

            for(var i = 0; i < pageItem.length; i += 1){
                eventUnit.addEvent(pageItem[i], 'click', function () {
                    self.gotoPage(this);
                });
            }

            // 跳转页
            eventUnit.addEvent(pageGotoBtn, 'click', function () {
                self.jumpPage(pageNumberText);
            });

            // 跳转页过滤
            eventUnit.addEvent(pageNumberText, 'keyup', function () {
                self.matchNum(pageNumberText);
            });

            // 上一页
            eventUnit.addEvent(pagePrevItem, 'click', function () {
                self.prevPage(pagePrevItem);
            });

            // 下一页
            eventUnit.addEvent(pageNextItem, 'click', function () {
                self.nextPage(pageNextItem);
            });

            for(var j = 0; j < pageItem.length; j += 1){
                element.removeClass(pageItem[j], "page-item-current");
                element.addClass(pageItem[self.config.showIndex], "page-item-current");
            }

            if(self.pageNowNum <= 1){
                element.hide(pagePrevItem);
                element.hide(pageNextItem);
            }else if(self.pageNowNum >= self.options.pageTotal){
                element.hide(pageNextItem);
            }

            self.options.callback && self.options.callback(self.pageNowNum);

        }
    };

    window.Pagination = Pagination;
})();