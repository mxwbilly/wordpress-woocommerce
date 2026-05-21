document.addEventListener('DOMContentLoaded', function () {
    const pageName = window.location.pathname.split('/').pop() || '';
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    const savedLang = localStorage.getItem('greensmart-lang');
    const lang = (urlLang === 'zh' || savedLang === 'zh') ? 'zh' : 'en';
    const detailPages = new Set([
        'bamboo-fiber-planter.html',
        'self-watering-ceramic-planter.html',
        'stackable-nursery-tray.html',
        'terracotta-planter.html',
        'balcony-planter-box.html',
        'hanging-coir-basket.html'
    ]);

    function mountLanguageSwitcher(currentLang) {
        const switcher = document.createElement('div');
        switcher.className = 'lang-switcher detail-lang-switcher';
        switcher.innerHTML = `
            <button type="button" class="lang-btn${currentLang === 'en' ? ' active' : ''}" data-lang="en">EN</button>
            <button type="button" class="lang-btn${currentLang === 'zh' ? ' active' : ''}" data-lang="zh">中文</button>
        `;

        switcher.addEventListener('click', function (event) {
            const target = event.target.closest('.lang-btn');
            if (!target) return;
            const nextLang = target.dataset.lang;
            if (nextLang === currentLang) return;

            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.set('lang', nextLang);
            window.location.href = nextUrl.toString();
        });

        document.body.appendChild(switcher);
    }

    const translations = {
        'bamboo-fiber-planter.html': {
            title: '环保竹纤维花盆 | GreenSmart',
            description: '面向东南亚批发买家的环保竹纤维花盆系列。',
            h1: '环保竹纤维花盆',
            intro: '这条系列适合注重环保定位、运输更轻、以及终端陈列友好配色的批发买家。',
            points: [
                '自然纹理与干净成型外观',
                '适合家居装饰、礼品与连锁零售',
                '支持 OEM 标识、标签与外箱定制'
            ],
            specsTitle: '推荐批发规格',
            specsRows: [
                ['材质', '竹纤维复合材料'],
                ['表面工艺', '哑光自然色或喷涂工艺'],
                ['尺寸范围', '从桌面小盆到中型装饰花盆'],
                ['MOQ 参考', '100 件起'],
                ['可定制项', '颜色、Logo、吊牌、外箱唛头']
            ],
            buyerTitle: '适合买家类型',
            tags: ['礼品店', '家居装饰零售', '环保产品线', '连锁门店']
        },
        'self-watering-ceramic-planter.html': {
            title: '自动浇水陶瓷花盆 | GreenSmart',
            description: '适用于批发零售与 OEM 项目的自动浇水陶瓷花盆。',
            h1: '自动浇水陶瓷花盆',
            intro: '定位中高端室内花盆品类，适合现代零售、礼品项目，以及强调低维护养护体验的买家。',
            points: [
                '蓄水仓结构，可选导水绳方案',
                '部分款式可开发可视水位窗',
                '适合新加坡与马来西亚市场定位'
            ],
            specsTitle: '推荐批发规格',
            specsRows: [
                ['材质', '釉面陶瓷 + 内置蓄水结构'],
                ['颜色', '白色、灰色、砂色及 OEM 定制色'],
                ['尺寸范围', '桌面到中型室内花盆'],
                ['MOQ 参考', '50 件起'],
                ['可定制项', '礼盒、标签、Logo、表面工艺']
            ],
            buyerTitle: '适合买家类型',
            tags: ['生活方式零售', '礼品渠道', '中高端室内线', '百货渠道']
        },
        'stackable-nursery-tray.html': {
            title: '可堆叠育苗盘套装 | GreenSmart',
            description: '面向种植与农资批发买家的可堆叠育苗盘系列。',
            h1: '可堆叠育苗盘套装',
            intro: '面向商业种植、育苗分销与实用型园艺渠道，强调堆叠效率与运输空间利用。',
            points: [
                '可堆叠结构，节省仓储与运输体积',
                '可提供再生塑料方案，满足实用批发线',
                '契合印尼与菲律宾市场需求'
            ],
            specsTitle: '推荐批发规格',
            specsRows: [
                ['材质', '再生或常规 PP / PE 塑料'],
                ['托盘形式', '穴盘、套叠盘、育苗组合'],
                ['尺寸范围', '多种孔位与盘深'],
                ['MOQ 参考', '500 件起'],
                ['可定制项', '颜色、包装、外箱唛头']
            ],
            buyerTitle: '适合买家类型',
            tags: ['苗圃', '种植户', '农资供应', '育苗分销商']
        },
        'terracotta-planter.html': {
            title: '透气陶土花盆 | GreenSmart',
            description: '适合经典零售与户外种植线的透气陶土花盆。',
            h1: '透气陶土花盆',
            intro: '经典陶土系列，适合香草、多肉与暖湿气候园艺场景，具备稳定陈列价值。',
            points: [
                '多孔陶土有助于根系透气',
                '自然红陶色外观，经典园艺风格',
                '适用于零售、装饰与户外产品线'
            ],
            specsTitle: '推荐批发规格',
            specsRows: [
                ['材质', '高温烧制天然陶土'],
                ['形式', '圆盆可配托盘与相关配件'],
                ['尺寸范围', '小型装饰到中型种植规格'],
                ['MOQ 参考', '100 件起'],
                ['可定制项', '贴标、外箱、混装包装']
            ],
            buyerTitle: '适合买家类型',
            tags: ['园艺零售', '户外装饰', '香草种植', '经典产品线']
        },
        'balcony-planter-box.html': {
            title: '阳台蔬菜种植箱 | GreenSmart',
            description: '适用于城市园艺与住宅项目的阳台种植箱。',
            h1: '阳台蔬菜种植箱',
            intro: '适合公寓阳台、小空间种植零售套装以及住宅工程配套的长条种植箱。',
            points: [
                '长条结构，适合紧凑城市空间',
                '可提供托盘与内胆组合方案',
                '适配住宅项目与阳台园艺推广'
            ],
            specsTitle: '推荐批发规格',
            specsRows: [
                ['材质', '耐候塑料或复合材料'],
                ['形式', '种植箱 + 托盘或支撑配套'],
                ['尺寸范围', '阳台、窗台与项目尺寸'],
                ['MOQ 参考', '20 件起'],
                ['可定制项', '颜色、包装、项目尺寸调整']
            ],
            buyerTitle: '适合买家类型',
            tags: ['城市园艺零售', '住宅项目', '景观供应', '种植套装']
        },
        'hanging-coir-basket.html': {
            title: '椰棕悬挂花篮 | GreenSmart',
            description: '适用于装饰与立体园艺系列的椰棕悬挂花篮。',
            h1: '椰棕悬挂花篮',
            intro: '自然风格悬挂花篮，适合装饰零售、庭院陈列与立体园艺产品组合。',
            points: [
                '椰棕内胆，天然材质纹理明显',
                '可选金属链与挂钩配件方案',
                '适合园艺中心与生态装饰产品线'
            ],
            specsTitle: '推荐批发规格',
            specsRows: [
                ['材质', '椰棕内胆 + 金属框架'],
                ['形式', '圆形花篮 + 悬挂链条组合'],
                ['尺寸范围', '零售装饰与庭院陈列规格'],
                ['MOQ 参考', '100 件起'],
                ['可定制项', '链条颜色、标签、包装、混装']
            ],
            buyerTitle: '适合买家类型',
            tags: ['园艺中心', '庭院装饰零售', '季节性陈列', '立体园艺']
        }
    };

    const focusTranslations = {
        'bamboo-fiber-planter.html': {
            leftTitle: '买家优先关注',
            leftItems: [
                ['环保声明依据', '建议先确认竹纤维配比与可提供的合规文件。'],
                ['颜色一致性', '建议先约定批次色差范围，避免混色补货争议。'],
                ['外箱防护强度', '建议确认跌落测试标准，降低运输破损索赔。'],
                ['OEM起订与费用', '提前确认 Logo 工艺与制版/开模费用规则。']
            ],
            rightTitle: '建议询价信息',
            rightItems: [
                ['目标市场', '国家 + 渠道（零售、连锁、电商）建议一次说明。'],
                ['规格组合', '建议注明口径/高度组合及各规格数量占比。'],
                ['包装方式', '确认散装外箱、零售彩盒或条码陈列包装。'],
                ['贸易条款', '提供目的港、Incoterm 与目标出货月份。']
            ]
        },
        'self-watering-ceramic-planter.html': {
            leftTitle: '买家优先关注',
            leftItems: [
                ['渗漏风险', '建议确认蓄水仓密封与搬运倾斜时溢水表现。'],
                ['配件寿命', '提前明确导水绳/内件更换方案，便于复购。'],
                ['釉面品控', '量产前锁定针孔与色差判定标准。'],
                ['礼盒抗摔', '礼品渠道建议提前确定内衬与外箱结构。']
            ],
            rightTitle: '建议询价信息',
            rightItems: [
                ['SKU结构', '明确桌面款与中型款比例，便于精准报价。'],
                ['价格定位', '区分标准线与礼品线目标零售价区间。'],
                ['品牌需求', '说明 Logo 位置、标签语言与说明卡需求。'],
                ['交期节点', '建议同时给样品节点与首批上市时间。']
            ]
        },
        'stackable-nursery-tray.html': {
            leftTitle: '买家优先关注',
            leftItems: [
                ['塑料厚度', '建议按穴盘型号确认单件克重与壁厚。'],
                ['堆叠承压', '确认托盘在整托运输中的抗压表现。'],
                ['耐候要求', '区分室内育苗与户外暴晒使用场景。'],
                ['套叠效率', '关注每箱装量与整柜装载数量。']
            ],
            rightTitle: '建议询价信息',
            rightItems: [
                ['孔位规格', '提供孔数、盘深与排水孔形式。'],
                ['材料方案', '说明再生料比例与颜色偏好。'],
                ['使用周期', '一次性还是多季复用会影响推荐方案。'],
                ['物流计划', '目的港、分批出货与安全库存要求。']
            ]
        },
        'terracotta-planter.html': {
            leftTitle: '买家优先关注',
            leftItems: [
                ['破损控制', '建议先约定可接受破损率与索赔流程。'],
                ['吸水率', '按当地气候与植物品类确认陶土孔隙等级。'],
                ['色调一致性', '红陶批次色差范围建议先锁定。'],
                ['季节耐受性', '提前确认高温/低温环境使用边界。']
            ],
            rightTitle: '建议询价信息',
            rightItems: [
                ['套装结构', '是否需花盆+托盘组合请一次说明。'],
                ['渠道定位', '园艺零售、家居装饰或工程供货。'],
                ['包装方案', '隔板箱、蜂窝纸或收缩膜套装方式。'],
                ['备货节奏', '旺季窗口与补货周期建议提前给出。']
            ]
        },
        'balcony-planter-box.html': {
            leftTitle: '买家优先关注',
            leftItems: [
                ['承重能力', '湿土满载下箱体与底部加强表现。'],
                ['排水设计', '确认溢流路径，避免阳台渗水投诉。'],
                ['抗UV褪色', '按目标市场日晒强度设定耐候标准。'],
                ['配件匹配', '托盘、挂架与支撑件兼容性需确认。']
            ],
            rightTitle: '建议询价信息',
            rightItems: [
                ['项目场景', '住宅项目、零售套装或景观工程。'],
                ['尺寸目标', '长宽高与有效种植深度建议明确。'],
                ['销售单位', '单只、套装或工程混托发货方式。'],
                ['交付安排', '分批到货节奏与安装时间窗口。']
            ]
        },
        'hanging-coir-basket.html': {
            leftTitle: '买家优先关注',
            leftItems: [
                ['链条防锈', '潮湿气候下建议确认防锈等级。'],
                ['椰棕内胆规格', '纤维厚度与密度影响保水表现。'],
                ['悬挂安全', '需明确承重上限与挂钩强度。'],
                ['季节陈列包装', '春季促销常需货架友好包装方案。']
            ],
            rightTitle: '建议询价信息',
            rightItems: [
                ['尺寸组合', '口径、深度与链条长度建议一起提供。'],
                ['框架表面', '黑色、古铜、喷粉或镀锌方案。'],
                ['内胆形式', '预装椰棕或分开包装请提前说明。'],
                ['销售节奏', '目标上架月份与补货频次规划。']
            ]
        }
    };

    const content = translations[pageName];
    const backBtn = document.querySelector('.detail-copy .btn.btn-secondary');
    const quoteBtn = document.querySelector('.detail-cta-bar .btn.btn-primary');

    if (backBtn) {
        backBtn.href = `index.html?lang=${encodeURIComponent(lang)}#products`;
        backBtn.textContent = lang === 'zh' ? '返回首页产品区' : 'Back to Homepage';
    }
    if (quoteBtn) {
        quoteBtn.href = `index.html?lang=${encodeURIComponent(lang)}#contact`;
        quoteBtn.textContent = lang === 'zh' ? '获取批发报价' : 'Request Quote';
    }
    localStorage.setItem('greensmart-lang', lang);
    mountLanguageSwitcher(lang);

    if (lang !== 'zh' || !content || !detailPages.has(pageName)) {
        return;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', content.description);
    }
    document.title = content.title;
    document.documentElement.lang = 'zh-CN';

    const heading = document.querySelector('.detail-copy h1');
    const intro = document.querySelector('.detail-copy > p');
    const pointItems = document.querySelectorAll('.detail-points li');
    const specsHeading = document.querySelector('.detail-card h2');
    const tableRows = document.querySelectorAll('.detail-spec-table tr');
    const buyerHeading = document.querySelectorAll('.detail-card h3')[0];
    const tagItems = document.querySelectorAll('.detail-tags span');
    const focusCards = document.querySelectorAll('.detail-focus .detail-card');

    if (heading) heading.textContent = content.h1;
    if (intro) intro.textContent = content.intro;
    pointItems.forEach((item, index) => {
        const icon = item.querySelector('i');
        item.textContent = content.points[index] || item.textContent;
        if (icon) {
            item.prepend(icon);
            item.insertBefore(document.createTextNode(' '), icon.nextSibling);
        }
    });
    if (specsHeading) specsHeading.textContent = content.specsTitle;
    tableRows.forEach((row, index) => {
        const th = row.querySelector('th');
        const td = row.querySelector('td');
        const line = content.specsRows[index];
        if (!line) return;
        if (th) th.textContent = line[0];
        if (td) td.textContent = line[1];
    });
    if (buyerHeading) buyerHeading.textContent = content.buyerTitle;
    tagItems.forEach((tag, index) => {
        tag.textContent = content.tags[index] || tag.textContent;
    });

    const focus = focusTranslations[pageName];
    if (focus && focusCards.length >= 2) {
        const leftHeading = focusCards[0].querySelector('h3');
        const rightHeading = focusCards[1].querySelector('h3');
        const leftList = focusCards[0].querySelector('.detail-mini-list');
        const rightList = focusCards[1].querySelector('.detail-mini-list');
        if (leftHeading) leftHeading.textContent = focus.leftTitle;
        if (rightHeading) rightHeading.textContent = focus.rightTitle;

        if (leftList) {
            leftList.innerHTML = focus.leftItems
                .map(([label, text]) => `<li><strong>${label}：</strong>${text}</li>`)
                .join('');
        }
        if (rightList) {
            rightList.innerHTML = focus.rightItems
                .map(([label, text]) => `<li><strong>${label}：</strong>${text}</li>`)
                .join('');
        }
    }
});
