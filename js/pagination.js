(function(){

    var pagination = function (opt) {

        this.options = {
            container: opt.container,
            pageNow: opt.pageNow || 1,
            pageTotal: opt.pageTotal || 20,
            pageDisplay: opt.pageDisplay || 5
        }

        this.config = {
            showNumMin: 1,
            showNumMax: 5,
            showNumCurrent: 1,
            showIndex: 0
        }

        this.init();
    }

    pagination.prototype = {
        pageNowNum: parseInt(window.location.search.replace(/\?page=/g,'')) || 1,
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
            pageHtml += '<span class="page-progress"><span class="now">'+ self.config.showNumCurrent +'</span>/<span class="total">'+ self.options.pageTotal +'</span>页</span>'
            pageHtml += '<span class="page-goto"><input type="tel" class="page-number-text"><button class="btn btn-page-goto">跳转</button></span>';

            self.options.container.innerHTML = pageHtml;
        },
        gotoPage: function (ele) {
            this.config.showNumCurrent = ele.getAttribute('data-page');
            if(this.config.showNumCurrent == this.pageNowNum){
                return;
            }
            window.location.search = '?page=' + this.config.showNumCurrent;
        },
        jumpPage: function (ele) {;
            this.config.showNumCurrent = ele.value;
            if(this.config.showNumCurrent){
                if(this.config.showNumCurrent > this.options.pageTotal){
                    this.config.showNumCurrent = this.options.pageTotal;
                }else if(this.config.showNumCurrent < 1){
                    this.config.showNumCurrent = 1;
                }
                window.location.search = '?page=' + this.config.showNumCurrent;
            }else{
                alert('请输入页数！')
            }
        },
        matchNum: function (ele) {
            ele.value = ele.value.replace(/\D+/g,'');
        },
        prevPage: function (ele) {
            this.pageNowNum -= 1;
            this.config.showNumCurrent = this.pageNowNum;
            window.location.search = '?page=' + this.config.showNumCurrent;
        },
        nextPage: function (ele) {
            this.pageNowNum += 1;
            this.config.showNumCurrent = this.pageNowNum;
            window.location.search = '?page=' + this.config.showNumCurrent;
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

            for(var i = 0; i < pageItem.length; i += 1){
                element.removeClass(pageItem[i], "page-item-current");
                element.addClass(pageItem[self.config.showIndex], "page-item-current");
            }

            if(self.pageNowNum == 1){
                element.hide(pagePrevItem);
            }else if(self.pageNowNum == self.options.pageTotal){
                element.hide(pageNextItem);
            }
        }
    }

    window.pagination = pagination;
})()