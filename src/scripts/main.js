document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const contactForm = document.getElementById('contactForm');
    const productMultiSelect = contactForm?.querySelector('[data-multi-select]') || null;
    const backToTop = document.getElementById('backToTop');
    const langButtons = document.querySelectorAll('.lang-btn');
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const siteConfig = window.GREENSMART_CONFIG || {};
    const detailPageFiles = new Set([
        'bamboo-fiber-planter.html',
        'self-watering-ceramic-planter.html',
        'stackable-nursery-tray.html',
        'terracotta-planter.html',
        'balcony-planter-box.html',
        'hanging-coir-basket.html'
    ]);
    const abParam = new URLSearchParams(window.location.search).get('ab');
    const heroTitleVariant = (abParam === 'hero-b' || abParam === 'b') ? 'hero_b' : 'hero_a';
    const heroTitleVariants = {
        hero_a: {
            en: 'Wholesale Flower Pots & Self-Watering Planters from China',
            zh: '中国花盆与自动浇水花盆批发',
            vi: 'Chau hoa si va chau tuoi nuoc tu dong tu Trung Quoc',
            th: 'ขายส่งกระถางต้นไม้และกระถางรดน้ำอัตโนมัติจากจีน',
            id: 'Pot bunga grosir dan planter self-watering dari China'
        },
        hero_b: {
            en: 'Reliable OEM Flower Pots with Fast Export Delivery',
            zh: '支持OEM定制与快速交付的花盆供应商',
            vi: 'Nha cung cap chau hoa OEM dang tin cay, giao hang xuat khau nhanh',
            th: 'ซัพพลายเออร์กระถาง OEM ที่เชื่อถือได้ พร้อมส่งออกรวดเร็ว',
            id: 'Pemasok pot bunga OEM andal dengan pengiriman ekspor cepat'
        }
    };

    function initGa4(measurementId) {
        if (!measurementId) {
            return;
        }

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };

        if (!document.querySelector('script[data-greensmart-ga4]')) {
            const gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
            gaScript.setAttribute('data-greensmart-ga4', '1');
            document.head.appendChild(gaScript);
        }

        if (!window.__greensmartGaConfigured) {
            window.gtag('js', new Date());
            window.gtag('config', measurementId, { send_page_view: true });
            window.__greensmartGaConfigured = true;
        }
    }

    function trackEvent(eventName, params = {}) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }
        if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push({ event: eventName, ...params });
        }
    }

    function getTrackingLabel(element, fallback = 'unknown') {
        const text = element.textContent ? element.textContent.trim() : '';
        return text || fallback;
    }

    function getTrackingSection(element) {
        const section = element.closest('section');
        return section?.id || 'unknown_section';
    }

    function withTrackingMeta(params = {}) {
        return {
            ab_variant: heroTitleVariant,
            ...params
        };
    }

    function applyHeroTitleVariant(lang) {
        const heroTitleNode = document.querySelector('[data-i18n="hero_title"]');
        if (!heroTitleNode) {
            return;
        }

        const variantBundle = heroTitleVariants[heroTitleVariant] || heroTitleVariants.hero_a;
        heroTitleNode.textContent = variantBundle[lang] || variantBundle.en || heroTitleNode.textContent;
    }

    function updateDetailPageLinks(lang) {
        document.querySelectorAll('a[href]').forEach((anchor) => {
            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            const [pathWithQuery, hashPart] = href.split('#');
            const [basePath] = pathWithQuery.split('?');
            if (!detailPageFiles.has(basePath)) {
                return;
            }

            const hashSuffix = hashPart ? `#${hashPart}` : '';
            anchor.setAttribute('href', `${basePath}?lang=${encodeURIComponent(lang)}${hashSuffix}`);
        });
    }

    initGa4(siteConfig.gaMeasurementId);
    const defaultInquiryApiUrl = siteConfig.inquiryApiUrl
        || ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? '/api/inquiries' : '');

    function updateProductMultiSelectDisplay() {
        if (!productMultiSelect) {
            return;
        }

        const trigger = productMultiSelect.querySelector('[data-multi-select-trigger]');
        const checkedOptions = Array.from(productMultiSelect.querySelectorAll('input[name="product"]:checked'));
        if (!trigger) {
            return;
        }

        const placeholderText = trigger.dataset.placeholderText || trigger.textContent || '';
        if (!checkedOptions.length) {
            trigger.textContent = placeholderText;
            return;
        }

        const labels = checkedOptions
            .map((input) => input.closest('label')?.querySelector('span')?.textContent?.trim() || '')
            .filter(Boolean);

        if (labels.length <= 2) {
            trigger.textContent = labels.join(' / ');
            return;
        }

        trigger.textContent = `${labels.slice(0, 2).join(' / ')} +${labels.length - 2}`;
    }

    function initProductMultiSelect() {
        if (!productMultiSelect) {
            return;
        }

        const trigger = productMultiSelect.querySelector('[data-multi-select-trigger]');
        const checkboxes = productMultiSelect.querySelectorAll('input[name="product"]');
        if (!trigger || !checkboxes.length) {
            return;
        }

        const closeMultiSelect = () => {
            productMultiSelect.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
        };

        trigger.addEventListener('click', function () {
            const isOpen = productMultiSelect.classList.toggle('is-open');
            trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', function () {
                productMultiSelect.classList.remove('is-invalid');
                updateProductMultiSelectDisplay();
            });
        });

        document.addEventListener('click', function (event) {
            if (!productMultiSelect.contains(event.target)) {
                closeMultiSelect();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeMultiSelect();
            }
        });

        updateProductMultiSelectDisplay();
    }

    const dictionaries = {
        en: {
            title: 'Wholesale Flower Pots & Self-Watering Planters Manufacturer | GreenSmart',
            description: 'Wholesale flower pots, self-watering planters, nursery trays, balcony planter boxes, and hanging baskets made in China for Southeast Asia importers.',
            keywords: 'wholesale flower pots, self watering planter manufacturer, bamboo fiber planter supplier, nursery pots bulk, balcony planter box OEM, hanging basket exporter',
            strings: {
                floating_whatsapp: 'WhatsApp Us',
                nav_products: 'Products',
                nav_factory: 'Proof & Terms',
                nav_services: 'OEM & Export',
                nav_reviews: 'Buyer Feedback',
                nav_contact: 'Contact',
                nav_products_mobile: 'Products',
                nav_factory_mobile: 'Proof & Terms',
                nav_services_mobile: 'OEM & Export',
                nav_reviews_mobile: 'Buyer Feedback',
                nav_contact_mobile: 'Contact',
                nav_quote: 'Get Wholesale Quote',
                mobile_whatsapp: 'WhatsApp Chat',
                hero_banner_1: 'RCEP tariff advantage',
                hero_banner_2: 'OEM / private label support',
                hero_banner_3: 'Fast sampling and export packing',
                hero_badge: 'Focused on Southeast Asia B2B buyers',
                hero_title: 'Wholesale Flower Pots & Self-Watering Planters from China',
                hero_subtitle: 'Built for importers, distributors, retail chains, and OEM projects',
                hero_desc: 'Trending product mix for Vietnam, Thailand, Indonesia, Malaysia, Singapore, and the Philippines: self-watering ceramic planters, bamboo fiber pots, nursery trays, balcony planter boxes, and hanging baskets.',
                hero_highlight_1: 'Factory sourcing support',
                hero_highlight_2: 'MOQ and packaging options',
                hero_highlight_3: 'Fast WhatsApp response',
                hero_cta_primary: 'Get Wholesale Quote',
                hero_cta_secondary: 'Talk on WhatsApp',
                hero_stat_1: 'Years in export',
                hero_stat_2: 'Target markets',
                hero_stat_3: 'Private label ready',
                hero_stat_4: 'Regional trade support',
                hero_image_alt: 'Southeast Asia trending planter collection',
                trend_chip_1: 'Self-watering demand',
                trend_chip_2: 'Eco materials',
                trend_chip_3: 'Urban balcony gardening',
                proof_title: 'Factory and export trust points to complete with your real data',
                proof_desc: 'These fields are intentionally visible so the site can be upgraded with verified numbers, certificates, factory photos, and shipping proof before scaling ad spend.',
                proof_card_1_title: 'Factory profile slot',
                proof_card_1_desc: 'Add factory area, workshop count, production lines, and factory photos.',
                proof_card_1_item_1: 'Factory area: update actual sqm',
                proof_card_1_item_2: 'Monthly capacity: update actual volume',
                proof_card_1_item_3: 'Team size: update actual headcount',
                proof_card_2_title: 'Compliance slot',
                proof_card_2_desc: 'Keep space for verified documents used by serious B2B buyers.',
                proof_card_2_item_1: 'Add BSCI / Sedex / ISO if available',
                proof_card_2_item_2: 'Add ROHS / REACH / food-safe notes if relevant',
                proof_card_2_item_3: 'Add packaging and carton test details',
                proof_card_3_title: 'Export terms and delivery',
                proof_card_3_desc: 'Share your standard terms for sample lead time, bulk lead time, and loading ports.',
                proof_card_3_item_1: 'Main ports: Shenzhen / Guangzhou / Xiamen',
                proof_card_3_item_2: 'Sample lead time: 5-7 days (reference)',
                proof_card_3_item_3: 'Bulk lead time: 20-35 days after deposit (reference)',
                proof_card_4_title: 'Social proof slot',
                proof_card_4_desc: 'Reserve space for real buyer cases, container loading photos, and store placements.',
                proof_card_4_item_1: 'Top market case studies by country',
                proof_card_4_item_2: 'Private label packaging examples',
                proof_card_4_item_3: 'Buyer testimonial screenshots or videos',
                trust_assets_title: 'Buyer trust assets you can share in first contact',
                trust_assets_desc: 'Use this block as your first-response checklist so import buyers can quickly verify compliance, shipping reliability, and project fit.',
                trust_doc_title: 'Compliance file pack',
                trust_doc_item_1: 'Company profile, product catalog, and factory photos PDF',
                trust_doc_item_2: 'BSCI / Sedex / ISO and selected test reports (if available)',
                trust_doc_item_3: 'Packaging spec sheet and carton drop-test summary',
                trust_doc_cta: 'Request compliance files',
                trust_shipping_title: 'Shipping and lead-time records',
                trust_shipping_item_1: 'Recent shipment references by country and product category',
                trust_shipping_item_2: 'Sample and bulk lead-time benchmark by season',
                trust_shipping_item_3: 'Main loading ports and Incoterms support scope',
                trust_shipping_cta: 'Request shipping records',
                trust_case_title: 'Buyer case snapshots',
                trust_case_item_1: 'OEM logo and private-label packaging examples',
                trust_case_item_2: 'Retail shelf photos and project installation photos',
                trust_case_item_3: 'Order cycle examples: sample to first container timeline',
                trust_case_cta: 'Get buyer case pack',
                quick_1_title: 'WhatsApp sales',
                quick_1_cta: 'Start chat',
                quick_2_title: 'Call support',
                quick_2_cta: 'Call now',
                quick_3_title: 'Business email',
                quick_3_cta: 'Send email',
                products_title: 'Top-selling planter categories for Southeast Asia',
                products_desc: 'Six product lines aligned with current importer demand: self-watering, sustainable materials, balcony growing, nursery propagation, and decorative hanging planters.',
                product_1_alt: 'Eco bamboo fiber planters',
                product_1_badge: 'Best volume seller',
                product_1_title: 'Eco Bamboo Fiber Flower Pots',
                product_1_desc: 'Popular with Vietnam and Thailand buyers looking for lightweight, sustainable planters with retail-friendly colors.',
                product_1_spec_1: 'Biodegradable blend options',
                product_1_spec_2: 'Matte natural colorways',
                product_1_spec_3: 'OEM logo and carton support',
                product_1_meta_1: 'MOQ slot: 100 pcs',
                product_1_meta_2: 'Use: retail / gifting / home decor',
                featured_badge: 'Featured',
                product_2_alt: 'Self-watering ceramic planter',
                product_2_badge: 'Trend leader',
                product_2_title: 'Self-Watering Ceramic Planters',
                product_2_desc: 'A strong category for Singapore and Malaysia buyers who want premium indoor planters with low-maintenance appeal.',
                product_2_spec_1: 'Reservoir and wick system',
                product_2_spec_2: 'Water-level display option',
                product_2_spec_3: 'Ideal for lifestyle retail',
                product_2_meta_1: 'MOQ slot: 50 pcs',
                product_2_meta_2: 'Use: modern home / gifting / chains',
                product_3_alt: 'Stackable nursery trays',
                product_3_badge: 'Wholesale favorite',
                product_3_title: 'Stackable Nursery Tray Sets',
                product_3_desc: 'Suitable for Indonesia and Philippines buyers managing propagation, seedling distribution, and compact shipping.',
                product_3_spec_1: 'Stack-saving design',
                product_3_spec_2: 'Propagation-friendly cells',
                product_3_spec_3: 'Lower transport footprint',
                product_3_meta_1: 'MOQ slot: 500 pcs',
                product_3_meta_2: 'Use: growers / nurseries / agri supply',
                product_4_alt: 'Terracotta breathable planters',
                product_4_badge: 'Classic seller',
                product_4_title: 'Breathable Terracotta Pots',
                product_4_desc: 'A durable classic for Myanmar and Cambodia buyers who need breathable clay pots with traditional styling.',
                product_4_spec_1: 'Natural airflow for roots',
                product_4_spec_2: 'Kiln-fired clay texture',
                product_4_spec_3: 'Timeless merchandising look',
                product_4_meta_1: 'MOQ slot: 100 pcs',
                product_4_meta_2: 'Use: herbs / succulents / outdoor decor',
                product_5_alt: 'Balcony planter boxes',
                product_5_badge: 'Project use',
                product_5_title: 'Balcony Vegetable Planter Boxes',
                product_5_desc: 'A good match for urban gardening, residential developments, and retail kits aimed at small-space growing.',
                product_5_spec_1: 'Balcony-friendly footprint',
                product_5_spec_2: 'Drainage tray options',
                product_5_spec_3: 'OEM sizing for projects',
                product_5_meta_1: 'MOQ slot: 20 pcs',
                product_5_meta_2: 'Use: apartment retail / landscape / project supply',
                product_6_alt: 'Hanging coconut coir basket',
                product_6_badge: 'New demand',
                product_6_title: 'Hanging Coconut Coir Baskets',
                product_6_desc: 'Designed for decorative retail, patio merchandising, and vertical gardening collections with a natural look.',
                product_6_spec_1: 'Natural coir liner texture',
                product_6_spec_2: 'Hanging chain options',
                product_6_spec_3: 'Suits eco decor programs',
                product_6_meta_1: 'MOQ slot: 100 pcs',
                product_6_meta_2: 'Use: garden retail / decor / patio ranges',
                view_details: 'View Details',
                ask_quote: 'Get Wholesale Quote',
                features_title: 'OEM, packaging, and export support buyers expect',
                features_desc: 'Independent B2B sites convert better when they show how the supplier supports real buying workflows, not only pretty product cards.',
                feature_1_title: 'Compliance-ready planning',
                feature_1_desc: 'Keep space for verified test reports, buyer-required declarations, and product safety notes.',
                feature_2_title: 'Retail and bulk packing',
                feature_2_desc: 'Show support for barcode labels, master cartons, insert cards, and drop-test aware packing.',
                feature_3_title: 'Private label customization',
                feature_3_desc: 'Reserve room for custom colors, logo application, hangtags, and display-ready OEM programs.',
                feature_4_title: 'Sampling and lead-time slots',
                feature_4_desc: 'Display your actual sample cycle, mass-production cycle, and high-season planning rules.',
                feature_5_title: 'Multi-language sales support',
                feature_5_desc: 'Homepage language switching helps early qualification before your team replies in depth.',
                feature_6_title: 'Inquiry qualification workflow',
                feature_6_desc: 'The contact section now leaves room for MOQ, OEM, port, deadline, and company information.',
                markets_title: 'Priority markets and demand directions',
                markets_desc: 'Use these cards as positioning cues and replace trend percentages with your own export data when available.',
                market_1_title: 'Vietnam',
                market_1_desc: 'Retail-ready eco and decorative planters',
                market_2_title: 'Thailand',
                market_2_desc: 'Lifestyle retail and premium planter sets',
                market_3_title: 'Indonesia',
                market_3_desc: 'Propagation trays and practical garden supply',
                market_4_title: 'Philippines',
                market_4_desc: 'Nursery programs and affordable plastic lines',
                market_5_title: 'Malaysia',
                market_5_desc: 'Self-watering and modern indoor planters',
                market_6_title: 'Singapore',
                market_6_desc: 'Premium compact products and gifting ranges',
                reviews_title: 'Buyer feedback placeholders for real case studies',
                reviews_desc: 'Keep the layout, then replace these sample reviews with verified buyer names, order categories, and proof media.',
                review_1_location: 'Hanoi, Vietnam',
                review_1_text: '“Strong fit for chain-store procurement when MOQ, private label, and stable carton quality are handled well.”',
                review_1_product: 'Reference slot: bamboo fiber planter program',
                review_2_location: 'Kuala Lumpur, Malaysia',
                review_2_text: '“Self-watering indoor planters are easier to sell when the supplier provides clear specs, finish choices, and retail packaging support.”',
                review_2_product: 'Reference slot: self-watering ceramic line',
                review_3_location: 'Singapore',
                review_3_text: '“Independent sites convert better once real compliance files, case photos, and exact lead times are visible.”',
                review_3_product: 'Reference slot: compliance and export support',
                faq_title: 'OEM Planter FAQ: MOQ, Lead Time, and Export Terms',
                faq_desc: 'Practical answers for import buyers evaluating OEM flower pots, private label options, MOQ policy, and bulk shipment lead time.',
                faq_q1: 'What is your MOQ for OEM flower pots and private label orders?',
                faq_a1: 'Our MOQ depends on product type and customization depth. For most categories, standard SKUs start from 50-500 pieces, while OEM logo and custom packaging projects usually require higher volumes for stable unit cost.',
                faq_q2: 'How long is sample lead time and bulk production lead time?',
                faq_a2: 'Sample lead time is typically 5-10 days for standard options. Bulk production lead time is usually 20-35 days after deposit and artwork confirmation, with extra buffer recommended during peak season.',
                faq_q3: 'Do you support OEM logo, custom colors, and branded packaging?',
                faq_a3: 'Yes. We support OEM logo printing, custom color programs, barcode labels, insert cards, and retail-ready cartons. Final feasibility depends on product line, quantity, and target shipment schedule.',
                faq_q4: 'Which Incoterms and destination ports can you handle?',
                faq_a4: 'Common terms include FOB and CIF, and we can align shipment planning for major Southeast Asia destination ports. Share your destination port and timeline early to speed up freight and quote confirmation.',
                faq_q5: 'What information is needed to get an accurate wholesale quote quickly?',
                faq_a5: 'Please provide product type, quantity, OEM requirement, destination port, target delivery month, and packaging standard. Complete RFQ details help us return a precise offer within 24 business hours.',
                contact_title: 'Request a wholesale quote',
                contact_desc: 'The inquiry form now reserves the practical fields B2B buyers usually need: company, country, OEM request, target port, and expected order timing.',
                contact_info_1_title: 'Factory and shipping base',
                contact_info_1_desc: 'Shanghai office support, China factory coordination, and export shipping via major South China ports.',
                contact_info_2_title: 'Sales contacts',
                contact_info_3_title: 'Business email',
                contact_info_3_desc: 'Send RFQ details, BOM files, and packaging requests by email for faster quoting.',
                contact_info_4_title: 'Buyer policy snapshot',
                contact_info_4_desc: 'Typical terms: MOQ by SKU, paid samples refundable on bulk order, FOB/CIF support, and 30/70 TT payment.',
                form_name_label: 'Full name',
                form_name_placeholder: 'Your full name',
                form_company_label: 'Company name',
                form_company_placeholder: 'Your company or store name',
                form_email_label: 'Business email',
                form_email_placeholder: 'name@company.com',
                form_phone_label: 'WhatsApp / phone',
                form_phone_placeholder: 'Your contact number',
                form_country_label: 'Buyer country',
                form_country_placeholder: 'Vietnam / Thailand / Indonesia...',
                form_product_label: 'Interested product',
                form_product_placeholder: 'Select one or more products',
                form_product_helper: 'Click to open and select multiple products.',
                form_product_required: 'Please select at least one product.',
                form_product_option_1: 'Eco Bamboo Fiber Flower Pots',
                form_product_option_2: 'Self-Watering Ceramic Planters',
                form_product_option_3: 'Stackable Nursery Tray Sets',
                form_product_option_4: 'Breathable Terracotta Pots',
                form_product_option_5: 'Balcony Vegetable Planter Boxes',
                form_product_option_6: 'Hanging Coconut Coir Baskets',
                form_product_option_7: 'Other / custom inquiry',
                form_quantity_label: 'Estimated quantity',
                form_quantity_placeholder: 'Planned order quantity',
                form_oem_label: 'OEM / private label',
                form_oem_option_0: 'Select one',
                form_oem_option_1: 'Yes, OEM needed',
                form_oem_option_2: 'No, standard product',
                form_oem_option_3: 'Need suggestions first',
                form_port_label: 'Target port / city',
                form_port_placeholder: 'Destination port or city',
                form_date_label: 'Target delivery month',
                form_date_placeholder: 'Example: September 2026',
                form_message_label: 'Requirements',
                form_message_placeholder: 'Tell us size, colors, packaging, certification, and target order timeline.',
                form_submit: 'Get Wholesale Quote',
                form_response_promise: 'We reply within 24 hours (business time).',
                footer_desc: 'Wholesale planter categories for Southeast Asia buyers, with room to add your real factory, compliance, and export proof.',
                footer_products_title: 'Hot categories',
                footer_product_1: 'Bamboo fiber pots',
                footer_product_2: 'Self-watering ceramic',
                footer_product_3: 'Nursery tray sets',
                footer_product_4: 'Terracotta planters',
                footer_support_title: 'Conversion checklist',
                footer_support_1: 'Add real factory data',
                footer_support_2: 'Add verified certificates',
                footer_support_3: 'Add buyer case studies',
                footer_support_4: 'Add shipping and MOQ terms',
                footer_contact_title: 'Contact slots',
                footer_link_1: 'Privacy Policy',
                footer_link_2: 'Terms of Service',
                footer_link_3: 'Cookie Settings'
            }
        },
        zh: {
            title: '花盆批发与自动浇水花盆制造商 | GreenSmart',
            description: '面向东南亚进口商的中国花盆、自动浇水花盆、育苗盘、阳台花箱与悬挂花篮批发供应商。',
            keywords: '花盆批发, 自动浇水花盆, 竹纤维花盆供应商, 育苗盘批发, 阳台花箱OEM, 悬挂花篮出口',
            strings: {
                floating_whatsapp: 'WhatsApp咨询',
                nav_products: '产品系列',
                nav_factory: '资质与条款',
                nav_services: 'OEM与出口服务',
                nav_reviews: '客户反馈',
                nav_contact: '联系我们',
                nav_products_mobile: '产品系列',
                nav_factory_mobile: '资质与条款',
                nav_services_mobile: 'OEM与出口服务',
                nav_reviews_mobile: '客户反馈',
                nav_contact_mobile: '联系我们',
                nav_quote: '获取批发报价',
                mobile_whatsapp: 'WhatsApp沟通',
                hero_banner_1: 'RCEP关税优势',
                hero_banner_2: '支持OEM / 自有品牌',
                hero_banner_3: '快速打样与出口包装',
                hero_badge: '专注东南亚B2B采购商',
                hero_title: '中国花盆与自动浇水花盆批发供应',
                hero_subtitle: '适合进口商、分销商、连锁零售与OEM项目',
                hero_desc: '围绕越南、泰国、印尼、马来西亚、新加坡与菲律宾需求布局：自动浇水陶瓷盆、竹纤维花盆、育苗盘、阳台花箱与悬挂花篮。',
                hero_highlight_1: '支持工厂源头采购',
                hero_highlight_2: 'MOQ与包装方案可配',
                hero_highlight_3: 'WhatsApp快速回复',
                hero_cta_primary: '获取批发报价',
                hero_cta_secondary: 'WhatsApp洽谈',
                hero_stat_1: '出口经验',
                hero_stat_2: '目标市场',
                hero_stat_3: '支持贴牌',
                hero_stat_4: '区域贸易支持',
                hero_image_alt: '面向东南亚热销趋势的花盆组合',
                trend_chip_1: '自动浇水热度高',
                trend_chip_2: '环保材质需求',
                trend_chip_3: '阳台园艺趋势',
                proof_title: '为真实工厂数据预留的信任展示区',
                proof_desc: '这些栏位可继续补充真实数字、证书、工厂照片和出货证明，便于后续放量推广。',
                proof_card_1_title: '工厂资料栏位',
                proof_card_1_desc: '用于补充工厂面积、车间数量、产线配置与工厂实拍。',
                proof_card_1_item_1: '工厂面积：更新真实平方米数',
                proof_card_1_item_2: '月产能：更新真实出货体量',
                proof_card_1_item_3: '团队规模：更新真实人数',
                proof_card_2_title: '合规资质栏位',
                proof_card_2_desc: '为严肃B2B采购商保留认证与测试文件展示空间。',
                proof_card_2_item_1: '如有可补充 BSCI / Sedex / ISO',
                proof_card_2_item_2: '如适用可补充 ROHS / REACH / 食品接触说明',
                proof_card_2_item_3: '补充包装与纸箱测试信息',
                proof_card_3_title: '出口条款与交付',
                proof_card_3_desc: '直接展示样品交期、大货交期与常用装运港口，方便买家快速评估。',
                proof_card_3_item_1: '主要港口：深圳 / 广州 / 厦门',
                proof_card_3_item_2: '样品交期：5-7天（参考）',
                proof_card_3_item_3: '大货交期：定金后20-35天（参考）',
                proof_card_4_title: '社会证明栏位',
                proof_card_4_desc: '为真实买家案例、装柜照片与终端陈列留出位置。',
                proof_card_4_item_1: '按国家展示重点买家案例',
                proof_card_4_item_2: '展示贴牌包装示例',
                proof_card_4_item_3: '放入买家评价截图或视频',
                trust_assets_title: '首次沟通就能发送给买家的信任资料',
                trust_assets_desc: '把这一区作为首轮回复清单，帮助进口买家快速核验合规能力、出货稳定性和项目匹配度。',
                trust_doc_title: '合规文件包',
                trust_doc_item_1: '公司介绍、产品目录与工厂实拍PDF',
                trust_doc_item_2: 'BSCI / Sedex / ISO及相关测试报告（如有）',
                trust_doc_item_3: '包装规格表与纸箱跌落测试摘要',
                trust_doc_cta: '索取合规文件',
                trust_shipping_title: '出货与交期资料',
                trust_shipping_item_1: '按国家和品类展示近期出货参考',
                trust_shipping_item_2: '按淡旺季展示样品与大货交期基准',
                trust_shipping_item_3: '主要装运港口与Incoterms支持范围',
                trust_shipping_cta: '索取出货资料',
                trust_case_title: '买家案例快照',
                trust_case_item_1: 'OEM Logo与贴牌包装案例',
                trust_case_item_2: '终端陈列照片与项目落地照片',
                trust_case_item_3: '从打样到首柜出货的周期案例',
                trust_case_cta: '获取买家案例包',
                quick_1_title: 'WhatsApp销售',
                quick_1_cta: '立即沟通',
                quick_2_title: '电话支持',
                quick_2_cta: '立即拨打',
                quick_3_title: '业务邮箱',
                quick_3_cta: '发送邮件',
                products_title: '面向东南亚的6大热销花盆品类',
                products_desc: '围绕自动浇水、环保材质、阳台种植、育苗繁殖与悬挂园艺等需求布局。',
                product_1_alt: '环保竹纤维花盆',
                product_1_badge: '走量冠军',
                product_1_title: '环保竹纤维花盆',
                product_1_desc: '适合越南与泰国买家，主打轻量、环保与适合零售配色的花盆系列。',
                product_1_spec_1: '可降解材质方案',
                product_1_spec_2: '自然哑光配色',
                product_1_spec_3: '支持OEM标识与纸箱定制',
                product_1_meta_1: 'MOQ栏位：100件起',
                product_1_meta_2: '应用：零售 / 礼品 / 家居装饰',
                featured_badge: '重点推荐',
                product_2_alt: '自动浇水陶瓷花盆',
                product_2_badge: '趋势主推',
                product_2_title: '自动浇水陶瓷花盆',
                product_2_desc: '适合新加坡与马来西亚买家，强调室内高端感与低维护卖点。',
                product_2_spec_1: '储水仓与吸水绳系统',
                product_2_spec_2: '可选水位观察设计',
                product_2_spec_3: '适合生活方式零售',
                product_2_meta_1: 'MOQ栏位：50件起',
                product_2_meta_2: '应用：现代家居 / 礼品 / 连锁零售',
                product_3_alt: '可堆叠育苗盘',
                product_3_badge: '批发常青款',
                product_3_title: '可堆叠育苗盘套装',
                product_3_desc: '适合印尼与菲律宾买家，便于育苗分发与节省运输空间。',
                product_3_spec_1: '可堆叠节省仓储',
                product_3_spec_2: '适合育苗繁殖单元设计',
                product_3_spec_3: '降低运输体积',
                product_3_meta_1: 'MOQ栏位：500件起',
                product_3_meta_2: '应用：种植户 / 苗圃 / 农资渠道',
                product_4_alt: '透气红陶花盆',
                product_4_badge: '经典畅销',
                product_4_title: '透气红陶花盆',
                product_4_desc: '适合缅甸与柬埔寨买家，强调传统外观与陶土透气属性。',
                product_4_spec_1: '天然透气助根系生长',
                product_4_spec_2: '窑烧陶土质感',
                product_4_spec_3: '陈列风格经典耐看',
                product_4_meta_1: 'MOQ栏位：100件起',
                product_4_meta_2: '应用：香草 / 多肉 / 户外装饰',
                product_5_alt: '阳台菜园花箱',
                product_5_badge: '项目适用',
                product_5_title: '阳台菜园花箱',
                product_5_desc: '适合城市园艺、住宅项目与小空间种植零售套装。',
                product_5_spec_1: '适配阳台尺寸',
                product_5_spec_2: '可选托盘排水结构',
                product_5_spec_3: '支持项目尺寸OEM',
                product_5_meta_1: 'MOQ栏位：20件起',
                product_5_meta_2: '应用：公寓零售 / 景观 / 项目供货',
                product_6_alt: '悬挂椰棕花篮',
                product_6_badge: '新增需求',
                product_6_title: '悬挂椰棕花篮',
                product_6_desc: '适合装饰零售、露台陈列与垂直园艺产品组合，强调自然观感。',
                product_6_spec_1: '天然椰棕内衬质感',
                product_6_spec_2: '可选悬挂链条方案',
                product_6_spec_3: '适合环保装饰项目',
                product_6_meta_1: 'MOQ栏位：100件起',
                product_6_meta_2: '应用：园艺零售 / 装饰 / 露台系列',
                view_details: '查看详情',
                ask_quote: '获取批发报价',
                features_title: '采购商真正关心的OEM、包装与出口支持',
                features_desc: '独立站要提升转化，不只展示产品，更要把采购流程支持讲清楚。',
                feature_1_title: '合规准备能力',
                feature_1_desc: '预留测试报告、买家要求声明与产品安全说明展示空间。',
                feature_2_title: '零售与批发包装',
                feature_2_desc: '展示条码贴、外箱、说明卡与跌落测试相关包装支持。',
                feature_3_title: '贴牌定制能力',
                feature_3_desc: '用于展示颜色定制、Logo应用、吊牌与陈列型OEM方案。',
                feature_4_title: '打样与交期栏位',
                feature_4_desc: '展示真实打样周期、量产周期与旺季排单规则。',
                feature_5_title: '多语言销售支持',
                feature_5_desc: '首页语言切换可帮助客户在正式沟通前完成初步筛选。',
                feature_6_title: '询盘分级流程',
                feature_6_desc: '联系表单已为MOQ、OEM、港口、交期与公司信息预留空间。',
                markets_title: '重点市场与需求方向',
                markets_desc: '这些卡片可作为定位展示，后续可替换为你们真实出口数据。',
                market_1_title: '越南',
                market_1_desc: '适合环保与装饰型零售花盆',
                market_2_title: '泰国',
                market_2_desc: '适合生活方式与高端套装零售',
                market_3_title: '印尼',
                market_3_desc: '适合育苗盘与实用园艺供应',
                market_4_title: '菲律宾',
                market_4_desc: '适合苗圃项目与平价塑料线',
                market_5_title: '马来西亚',
                market_5_desc: '适合自动浇水与现代室内花盆',
                market_6_title: '新加坡',
                market_6_desc: '适合高端紧凑型与礼品产品线',
                reviews_title: '可替换为真实客户案例的反馈区',
                reviews_desc: '保留版式后，建议替换成可验证的买家名称、订单品类与证明素材。',
                review_1_location: '越南河内',
                review_1_text: '“当MOQ、贴牌与纸箱稳定性控制得好时，这类产品非常适合连锁零售采购。”',
                review_1_product: '案例栏位：竹纤维花盆项目',
                review_2_location: '马来西亚吉隆坡',
                review_2_text: '“如果供应商能把规格、表面处理与零售包装支持讲清楚，自动浇水室内花盆会更容易卖。”',
                review_2_product: '案例栏位：自动浇水陶瓷线',
                review_3_location: '新加坡',
                review_3_text: '“独立站一旦补齐真实认证文件、案例图片与准确交期，转化通常会明显更好。”',
                review_3_product: '案例栏位：合规与出口支持',
                faq_title: 'OEM花盆采购FAQ：MOQ、交期与出口条款',
                faq_desc: '面向进口买家的实用问答，重点覆盖 OEM 花盆、贴牌合作、MOQ 政策与大货交期。',
                faq_q1: 'OEM花盆和贴牌订单的 MOQ 是多少？',
                faq_a1: 'MOQ 取决于产品品类和定制深度。多数标准款通常从 50-500 件起，若涉及 OEM Logo 和定制包装，通常需要更高起订量以保证单价稳定。',
                faq_q2: '样品交期和大货交期通常多久？',
                faq_a2: '标准选项样品交期通常为 5-10 天。大货交期一般为定金到账并确认稿件后 20-35 天，旺季建议预留额外缓冲。',
                faq_q3: '是否支持 OEM Logo、定制颜色和品牌包装？',
                faq_a3: '支持。我们可提供 OEM Logo、定制配色、条码标签、内卡及零售外箱。最终可行性取决于具体产品线、数量与目标出货周期。',
                faq_q4: '可支持哪些 Incoterms 和目的港？',
                faq_a4: '常用贸易条款包括 FOB、CIF，可配合东南亚主要目的港安排出货。建议尽早提供目的港和时间节点，以加快运费与报价确认。',
                faq_q5: '要快速拿到准确批发报价，需要提供哪些信息？',
                faq_a5: '建议提供产品类型、数量、OEM需求、目的港、目标交付月份和包装标准。RFQ 信息越完整，越有利于我们在 24 个工作小时内给出精准报价。',
                contact_title: '获取批发报价',
                contact_desc: '询盘表单已补充B2B采购常见字段：公司、国家、OEM需求、目的港与交付时间。',
                contact_info_1_title: '工厂与出货基地',
                contact_info_1_desc: '上海团队支持对接，中国工厂协同生产，常规从华南主要港口安排出口。',
                contact_info_2_title: '销售联系方式',
                contact_info_3_title: '业务邮箱',
                contact_info_3_desc: '可通过邮箱发送RFQ、BOM和包装要求，便于更快给出准确报价。',
                contact_info_4_title: '买家政策速览',
                contact_info_4_desc: '常见条款：按SKU设MOQ、样品费可在大货中抵扣、支持FOB/CIF、付款方式30/70 TT。',
                form_name_label: '姓名',
                form_name_placeholder: '请输入姓名',
                form_company_label: '公司名称',
                form_company_placeholder: '请输入公司或店铺名称',
                form_email_label: '企业邮箱',
                form_email_placeholder: 'name@company.com',
                form_phone_label: 'WhatsApp / 电话',
                form_phone_placeholder: '请输入联系方式',
                form_country_label: '采购国家',
                form_country_placeholder: '如 越南 / 泰国 / 印尼',
                form_product_label: '感兴趣产品',
                form_product_placeholder: '请选择一个或多个产品',
                form_product_helper: '点击下拉可多选产品。',
                form_product_required: '请至少选择一个感兴趣产品。',
                form_product_option_1: '环保竹纤维花盆',
                form_product_option_2: '自动浇水陶瓷花盆',
                form_product_option_3: '可堆叠育苗盘套装',
                form_product_option_4: '透气红陶花盆',
                form_product_option_5: '阳台菜园花箱',
                form_product_option_6: '悬挂椰棕花篮',
                form_product_option_7: '其他 / 定制需求',
                form_quantity_label: '预计采购数量',
                form_quantity_placeholder: '请输入计划数量',
                form_oem_label: 'OEM / 自有品牌',
                form_oem_option_0: '请选择',
                form_oem_option_1: '需要OEM',
                form_oem_option_2: '标准产品即可',
                form_oem_option_3: '先需要建议',
                form_port_label: '目的港 / 城市',
                form_port_placeholder: '请输入目的港或城市',
                form_date_label: '目标交付月份',
                form_date_placeholder: '例如 2026年9月',
                form_message_label: '需求说明',
                form_message_placeholder: '请说明尺寸、颜色、包装、认证与交期要求。',
                form_submit: '获取批发报价',
                form_response_promise: '工作时间内24小时回复。',
                footer_desc: '为东南亚采购商准备的花盆独立站框架，可继续补充真实工厂、证书与出口证明。',
                footer_products_title: '热销品类',
                footer_product_1: '竹纤维花盆',
                footer_product_2: '自动浇水陶瓷',
                footer_product_3: '育苗盘套装',
                footer_product_4: '红陶花盆',
                footer_support_title: '转化优化清单',
                footer_support_1: '补充真实工厂数据',
                footer_support_2: '补充认证证书',
                footer_support_3: '补充买家案例',
                footer_support_4: '补充出货与MOQ条款',
                footer_contact_title: '联系方式栏位',
                footer_link_1: '隐私政策',
                footer_link_2: '服务条款',
                footer_link_3: 'Cookie设置'
            }
        },
        vi: {
            title: 'Nha San Xuat Chau Cay Ban Si Va Chau Tuoi Tu Dong | GreenSmart',
            description: 'Nha cung cap chau cay, chau tuoi tu dong, khay uom, thung trong rau ban cong va gio treo tu Trung Quoc cho nha nhap khau Dong Nam A.',
            keywords: 'chau cay ban si, chau tuoi tu dong, nha cung cap chau soi tre, khay uom ban buon, OEM thung trong rau ban cong, gio treo xuat khau',
            strings: {
                floating_whatsapp: 'Tu van WhatsApp',
                nav_products: 'San pham',
                nav_factory: 'Ho so & dieu khoan',
                nav_services: 'OEM va xuat khau',
                nav_reviews: 'Phan hoi nguoi mua',
                nav_contact: 'Lien he',
                nav_products_mobile: 'San pham',
                nav_factory_mobile: 'Ho so & dieu khoan',
                nav_services_mobile: 'OEM va xuat khau',
                nav_reviews_mobile: 'Phan hoi nguoi mua',
                nav_contact_mobile: 'Lien he',
                nav_quote: 'Nhan bao gia si',
                mobile_whatsapp: 'Chat WhatsApp',
                hero_banner_1: 'Loi the thue quan RCEP',
                hero_banner_2: 'Ho tro OEM / nhan rieng',
                hero_banner_3: 'Lay mau nhanh va dong goi xuat khau',
                hero_badge: 'Tap trung vao nguoi mua B2B tai Dong Nam A',
                hero_title: 'Chau Cay Ban Si Va Chau Tuoi Tu Dong Tu Trung Quoc',
                hero_subtitle: 'Danh cho nha nhap khau, nha phan phoi, chuoi ban le va du an OEM',
                hero_desc: 'Danh muc san pham dang co nhu cau cho Viet Nam, Thai Lan, Indonesia, Malaysia, Singapore va Philippines: chau gom tuoi tu dong, chau soi tre, khay uom, thung trong rau ban cong va gio treo.',
                hero_highlight_1: 'Ho tro tim nguon tu nha may',
                hero_highlight_2: 'Co phuong an MOQ va dong goi',
                hero_highlight_3: 'Phan hoi nhanh tren WhatsApp',
                hero_cta_primary: 'Nhan bao gia si',
                hero_cta_secondary: 'Trao doi qua WhatsApp',
                hero_stat_1: 'Nam kinh nghiem xuat khau',
                hero_stat_2: 'Thi truong muc tieu',
                hero_stat_3: 'San sang nhan rieng',
                hero_stat_4: 'Ho tro thuong mai khu vuc',
                hero_image_alt: 'Bo suu tap chau cay theo xu huong Dong Nam A',
                trend_chip_1: 'Nhu cau chau tuoi tu dong',
                trend_chip_2: 'Vat lieu than thien moi truong',
                trend_chip_3: 'Lam vuon ban cong trong do thi',
                proof_title: 'Khu vuc xay dung uy tin voi du lieu nha may that',
                proof_desc: 'Cac o thong tin nay duoc giu lai de bo sung so lieu xac thuc, chung chi, anh nha may va bang chung giao hang truoc khi mo rong quang cao.',
                proof_card_1_title: 'Thong tin nha may',
                proof_card_1_desc: 'Bo sung dien tich nha may, so xuong, day chuyen san xuat va anh chup thuc te.',
                proof_card_1_item_1: 'Dien tich nha may: cap nhat so m2 thuc',
                proof_card_1_item_2: 'Cong suat thang: cap nhat san luong thuc',
                proof_card_1_item_3: 'Quy mo nhan su: cap nhat so nguoi thuc',
                proof_card_2_title: 'Thong tin tuan thu',
                proof_card_2_desc: 'De cho chung chi va tai lieu xac minh ma nguoi mua B2B thuong yeu cau.',
                proof_card_2_item_1: 'Them BSCI / Sedex / ISO neu co',
                proof_card_2_item_2: 'Them ROHS / REACH / ghi chu an toan neu phu hop',
                proof_card_2_item_3: 'Them thong tin kiem tra bao bi va carton',
                proof_card_3_title: 'Dieu khoan xuat khau va giao hang',
                proof_card_3_desc: 'Cong bo ro lead time mau, lead time don lon, va cang xuat thuong dung de nguoi mua danh gia nhanh.',
                proof_card_3_item_1: 'Cang chinh: Shenzhen / Guangzhou / Xiamen',
                proof_card_3_item_2: 'Thoi gian mau: 5-7 ngay (tham chieu)',
                proof_card_3_item_3: 'Thoi gian don lon: 20-35 ngay sau dat coc (tham chieu)',
                proof_card_4_title: 'Bang chung thi truong',
                proof_card_4_desc: 'De cho case study thuc te, anh dong container va hinh trung bay tai diem ban.',
                proof_card_4_item_1: 'Case study theo tung quoc gia',
                proof_card_4_item_2: 'Vi du dong goi nhan rieng',
                proof_card_4_item_3: 'Anh chup danh gia hoac video tu nguoi mua',
                trust_assets_title: 'Bo tai lieu uy tin de gui cho nguoi mua ngay lan lien he dau',
                trust_assets_desc: 'Dung khu nay nhu checklist phan hoi dau tien de nguoi mua nhap khau nhanh chong kiem tra tuan thu, do on dinh giao hang va do phu hop du an.',
                trust_doc_title: 'Bo tai lieu tuan thu',
                trust_doc_item_1: 'Ho so cong ty, catalog san pham va anh nha may dang PDF',
                trust_doc_item_2: 'BSCI / Sedex / ISO va mot so bao cao test (neu co)',
                trust_doc_item_3: 'Bang thong so dong goi va tom tat test roi thung carton',
                trust_doc_cta: 'Yeu cau bo tai lieu tuan thu',
                trust_shipping_title: 'Tai lieu giao hang va lead time',
                trust_shipping_item_1: 'Tham chieu lo hang gan day theo quoc gia va nhom san pham',
                trust_shipping_item_2: 'Moc lead time mau va don lon theo mua cao diem / thap diem',
                trust_shipping_item_3: 'Pham vi ho tro cang xuat chinh va Incoterms',
                trust_shipping_cta: 'Yeu cau tai lieu giao hang',
                trust_case_title: 'Tom tat case nguoi mua',
                trust_case_item_1: 'Vi du OEM logo va dong goi nhan rieng',
                trust_case_item_2: 'Anh trung bay ban le va anh lap dat du an',
                trust_case_item_3: 'Vi du chu ky don hang: tu mau den container dau tien',
                trust_case_cta: 'Nhan bo case nguoi mua',
                quick_1_title: 'WhatsApp kinh doanh',
                quick_1_cta: 'Bat dau chat',
                quick_2_title: 'Ho tro dien thoai',
                quick_2_cta: 'Goi ngay',
                quick_3_title: 'Email kinh doanh',
                quick_3_cta: 'Gui email',
                products_title: '6 dong chau cay ban chay cho Dong Nam A',
                products_desc: 'Tap trung vao chau tuoi tu dong, vat lieu ben vung, trong cay ban cong, khay uom va chau treo trang tri.',
                product_1_alt: 'Chau soi tre than thien moi truong',
                product_1_badge: 'Dong ban theo so luong manh',
                product_1_title: 'Chau Hoa Soi Tre Than Thien Moi Truong',
                product_1_desc: 'Phu hop nguoi mua tai Viet Nam va Thai Lan can dong chau nhe, than thien moi truong va de len mau ban le.',
                product_1_spec_1: 'Tuy chon vat lieu co kha nang phan huy',
                product_1_spec_2: 'Bang mau matte tu nhien',
                product_1_spec_3: 'Ho tro logo OEM va carton',
                product_1_meta_1: 'Moc MOQ: tu 100 pcs',
                product_1_meta_2: 'Ung dung: ban le / qua tang / trang tri nha',
                featured_badge: 'Noi bat',
                product_2_alt: 'Chau gom tuoi tu dong',
                product_2_badge: 'Dan dau xu huong',
                product_2_title: 'Chau Gom Tuoi Tu Dong',
                product_2_desc: 'Dong san pham manh cho nguoi mua tai Singapore va Malaysia muon chau noi that cao cap, de cham soc.',
                product_2_spec_1: 'He thong binh nuoc va day hut',
                product_2_spec_2: 'Tuy chon cua so muc nuoc',
                product_2_spec_3: 'Phu hop kenh ban le phong cach song',
                product_2_meta_1: 'Moc MOQ: tu 50 pcs',
                product_2_meta_2: 'Ung dung: nha hien dai / qua tang / chuoi cua hang',
                product_3_alt: 'Khay uom co the xep chong',
                product_3_badge: 'Duoc ua chuong trong ban buon',
                product_3_title: 'Bo Khay Uom Co The Xep Chong',
                product_3_desc: 'Phu hop nguoi mua tai Indonesia va Philippines quan ly uom cay, phan phoi cay giong va can tiet kiem dien tich van chuyen.',
                product_3_spec_1: 'Thiet ke xep chong tiet kiem cho',
                product_3_spec_2: 'O uom than thien cho nhan giong',
                product_3_spec_3: 'Giam the tich van chuyen',
                product_3_meta_1: 'Moc MOQ: tu 500 pcs',
                product_3_meta_2: 'Ung dung: nha vuon / vuon uom / vat tu nong nghiep',
                product_4_alt: 'Chau dat nung thoang khi',
                product_4_badge: 'Dong co dien ban tot',
                product_4_title: 'Chau Dat Nung Thoang Khi',
                product_4_desc: 'Dong co dien ben cho nguoi mua tai Myanmar va Campuchia can chau dat nung thoang khi voi hinh thuc truyen thong.',
                product_4_spec_1: 'Luu thong khi tu nhien cho re',
                product_4_spec_2: 'Be mat dat nung lo',
                product_4_spec_3: 'Hinh anh trung bay vuot thoi gian',
                product_4_meta_1: 'Moc MOQ: tu 100 pcs',
                product_4_meta_2: 'Ung dung: thao moc / sen da / trang tri ngoai troi',
                product_5_alt: 'Thung trong rau ban cong',
                product_5_badge: 'Dung cho du an',
                product_5_title: 'Thung Trong Rau Ban Cong',
                product_5_desc: 'Phu hop xu huong lam vuon do thi, du an nha o va bo san pham ban le cho khong gian nho.',
                product_5_spec_1: 'Kich thuoc hop cho ban cong',
                product_5_spec_2: 'Tuy chon khay thoat nuoc',
                product_5_spec_3: 'OEM kich thuoc cho du an',
                product_5_meta_1: 'Moc MOQ: tu 20 pcs',
                product_5_meta_2: 'Ung dung: ban le can ho / canh quan / du an',
                product_6_alt: 'Gio treo soi dua',
                product_6_badge: 'Nhu cau moi',
                product_6_title: 'Gio Treo Soi Dua',
                product_6_desc: 'Danh cho ban le trang tri, trung bay patio va bo suu tap lam vuon thang dung voi phong cach tu nhien.',
                product_6_spec_1: 'Chat lieu lot soi dua tu nhien',
                product_6_spec_2: 'Tuy chon xich treo',
                product_6_spec_3: 'Hop bo suu tap trang tri xanh',
                product_6_meta_1: 'Moc MOQ: tu 100 pcs',
                product_6_meta_2: 'Ung dung: ban le vuon / trang tri / patio',
                view_details: 'Xem chi tiet',
                ask_quote: 'Nhan bao gia si',
                features_title: 'Ho tro OEM, dong goi va xuat khau ma nguoi mua mong doi',
                features_desc: 'Website B2B doc lap chuyen doi tot hon khi the hien ro nha cung cap ho tro quy trinh mua hang ra sao, khong chi la hinh dep.',
                feature_1_title: 'Ke hoach san sang cho tuan thu',
                feature_1_desc: 'De cho bao cao kiem tra, tuyen bo theo yeu cau nguoi mua va ghi chu an toan san pham.',
                feature_2_title: 'Dong goi ban le va ban buon',
                feature_2_desc: 'The hien ho tro tem ma vach, thung carton, card huong dan va dong goi chu y test roi.',
                feature_3_title: 'Tuy bien nhan rieng',
                feature_3_desc: 'Danh cho mau sac tuy chinh, in logo, theo nhan treo va chuong trinh OEM trung bay.',
                feature_4_title: 'Thong tin mau va lead time',
                feature_4_desc: 'Hien thi chu ky lam mau, chu ky san xuat va quy tac mua cao diem.',
                feature_5_title: 'Ho tro ban hang da ngon ngu',
                feature_5_desc: 'Chuyen doi ngon ngu tren trang chu giup khach hang loc nhanh truoc khi lam viec chi tiet.',
                feature_6_title: 'Quy trinh sang loc inquiry',
                feature_6_desc: 'Phan lien he da de cho MOQ, OEM, cang dich, deadline va thong tin cong ty.',
                markets_title: 'Thi truong uu tien va huong nhu cau',
                markets_desc: 'Co the dung cac the nay de dinh vi, sau do thay bang du lieu xuat khau thuc te cua ban.',
                market_1_title: 'Viet Nam',
                market_1_desc: 'Chau xanh va trang tri de dua vao ban le',
                market_2_title: 'Thai Lan',
                market_2_desc: 'Ban le phong cach song va bo chau cao cap',
                market_3_title: 'Indonesia',
                market_3_desc: 'Khay uom va nguon hang lam vuon thuc dung',
                market_4_title: 'Philippines',
                market_4_desc: 'Chuong trinh vuon uom va dong nhua gia hop ly',
                market_5_title: 'Malaysia',
                market_5_desc: 'Chau tuoi tu dong va chau noi that hien dai',
                market_6_title: 'Singapore',
                market_6_desc: 'San pham nho gon cao cap va dong qua tang',
                reviews_title: 'Cho danh gia nguoi mua de thay bang case study thuc',
                reviews_desc: 'Giu bo cuc nay roi thay bang ten nguoi mua da xac minh, loai don hang va hinh anh chung minh.',
                review_1_location: 'Ha Noi, Viet Nam',
                review_1_text: '“Rat phu hop cho mua hang chuoi cua hang khi MOQ, nhan rieng va do on dinh cua carton duoc quan ly tot.”',
                review_1_product: 'Vi tri tham chieu: chuong trinh chau soi tre',
                review_2_location: 'Kuala Lumpur, Malaysia',
                review_2_text: '“Chau noi that tuoi tu dong se de ban hon neu nha cung cap dua ra thong so ro rang, lua chon be mat va ho tro dong goi ban le.”',
                review_2_product: 'Vi tri tham chieu: dong chau gom tuoi tu dong',
                review_3_location: 'Singapore',
                review_3_text: '“Trang web doc lap se chuyen doi tot hon khi co file tuan thu that, anh du an va lead time chinh xac.”',
                review_3_product: 'Vi tri tham chieu: ho tro tuan thu va xuat khau',
                faq_title: 'FAQ OEM Chau Cay: MOQ, Lead Time va Dieu Khoan Xuat Khau',
                faq_desc: 'Cau tra loi thuc te cho nguoi mua nhap khau ve chau cay OEM, nhan rieng, chinh sach MOQ va lead time don lon.',
                faq_q1: 'MOQ cho don chau cay OEM va nhan rieng la bao nhieu?',
                faq_a1: 'MOQ phu thuoc vao nhom san pham va muc do tuy chinh. Da so SKU tieu chuan bat dau tu 50-500 pcs, trong khi du an logo OEM va bao bi rieng thuong can so luong cao hon de on dinh don gia.',
                faq_q2: 'Lead time lam mau va lead time san xuat don lon bao lau?',
                faq_a2: 'Lead time lam mau thuong 5-10 ngay cho lua chon tieu chuan. Don lon thuong 20-35 ngay sau khi dat coc va chot artwork, va nen co them buffer vao mua cao diem.',
                faq_q3: 'Ban co ho tro logo OEM, mau sac tuy chinh va bao bi thuong hieu khong?',
                faq_a3: 'Co. Chung toi ho tro in logo OEM, mau tuy chinh, tem barcode, insert card va carton san sang cho ban le. Tinh kha thi cuoi cung phu thuoc vao dong san pham, so luong va lich giao hang.',
                faq_q4: 'Ban ho tro Incoterms nao va cang dich nao?',
                faq_a4: 'Dieu khoan pho bien gom FOB va CIF, va chung toi co the sap xep giao hang den cac cang chinh tai Dong Nam A. Cung cap som cang dich va timeline se giup chot gia nhanh hon.',
                faq_q5: 'Can thong tin gi de nhan bao gia ban si chinh xac nhanh nhat?',
                faq_a5: 'Vui long cung cap loai san pham, so luong, nhu cau OEM, cang dich, thang giao hang muc tieu va tieu chuan dong goi. RFQ day du giup chung toi phan hoi bao gia chinh xac trong 24 gio lam viec.',
                contact_title: 'Yeu cau bao gia si',
                contact_desc: 'Bieu mau inquiry da giu cac truong ma nguoi mua B2B thuong can: cong ty, quoc gia, OEM, cang dich va thoi diem giao hang.',
                contact_info_1_title: 'Nha may va diem xuat hang',
                contact_info_1_desc: 'Ho tro tu van tu van phong Thuong Hai, phoi hop san xuat tai Trung Quoc, va xuat qua cac cang lon mien Nam.',
                contact_info_2_title: 'Thong tin kinh doanh',
                contact_info_3_title: 'Email kinh doanh',
                contact_info_3_desc: 'Gui RFQ, BOM, va yeu cau dong goi qua email de nhan bao gia nhanh va chinh xac hon.',
                contact_info_4_title: 'Tom tat chinh sach mua hang',
                contact_info_4_desc: 'Dieu khoan tham chieu: MOQ theo SKU, phi mau duoc tru vao don lon, ho tro FOB/CIF, thanh toan 30/70 TT.',
                form_name_label: 'Ho ten',
                form_name_placeholder: 'Nhap ho ten day du',
                form_company_label: 'Ten cong ty',
                form_company_placeholder: 'Nhap ten cong ty hoac cua hang',
                form_email_label: 'Email doanh nghiep',
                form_email_placeholder: 'name@company.com',
                form_phone_label: 'WhatsApp / dien thoai',
                form_phone_placeholder: 'Nhap so lien he',
                form_country_label: 'Quoc gia nguoi mua',
                form_country_placeholder: 'Viet Nam / Thai Lan / Indonesia...',
                form_product_label: 'San pham quan tam',
                form_product_placeholder: 'Chon mot hoac nhieu san pham',
                form_product_helper: 'Bam de mo danh sach va chon nhieu san pham.',
                form_product_required: 'Vui long chon it nhat mot san pham.',
                form_product_option_1: 'Chau Hoa Soi Tre Than Thien Moi Truong',
                form_product_option_2: 'Chau Gom Tuoi Tu Dong',
                form_product_option_3: 'Bo Khay Uom Co The Xep Chong',
                form_product_option_4: 'Chau Dat Nung Thoang Khi',
                form_product_option_5: 'Thung Trong Rau Ban Cong',
                form_product_option_6: 'Gio Treo Soi Dua',
                form_product_option_7: 'Khac / nhu cau tuy chinh',
                form_quantity_label: 'So luong du kien',
                form_quantity_placeholder: 'Nhap so luong du kien',
                form_oem_label: 'OEM / nhan rieng',
                form_oem_option_0: 'Chon mot',
                form_oem_option_1: 'Co, can OEM',
                form_oem_option_2: 'Khong, dung hang tieu chuan',
                form_oem_option_3: 'Can tu van them',
                form_port_label: 'Cang dich / thanh pho',
                form_port_placeholder: 'Nhap cang dich hoac thanh pho',
                form_date_label: 'Thang giao hang muc tieu',
                form_date_placeholder: 'Vi du: September 2026',
                form_message_label: 'Yeu cau',
                form_message_placeholder: 'Cho biet kich thuoc, mau sac, dong goi, chung chi va thoi gian dat hang mong muon.',
                form_submit: 'Gui bao gia si',
                form_response_promise: 'Phan hoi trong 24 gio lam viec.',
                footer_desc: 'Khung website chau cay ban si cho nguoi mua Dong Nam A, co san cho viec bo sung nha may that, chung chi va bang chung xuat khau.',
                footer_products_title: 'Danh muc ban chay',
                footer_product_1: 'Chau soi tre',
                footer_product_2: 'Chau gom tuoi tu dong',
                footer_product_3: 'Bo khay uom',
                footer_product_4: 'Chau dat nung',
                footer_support_title: 'Danh sach toi uu chuyen doi',
                footer_support_1: 'Them du lieu nha may that',
                footer_support_2: 'Them chung chi xac minh',
                footer_support_3: 'Them case study nguoi mua',
                footer_support_4: 'Them dieu kien giao hang va MOQ',
                footer_contact_title: 'Cho thong tin lien he',
                footer_link_1: 'Chinh sach bao mat',
                footer_link_2: 'Dieu khoan dich vu',
                footer_link_3: 'Cai dat cookie'
            }
        },
        th: {
            title: 'ผู้ผลิตกระถางต้นไม้ขายส่งและกระถางรดน้ำอัตโนมัติ | GreenSmart',
            description: 'ผู้ผลิตกระถางต้นไม้ กระถางรดน้ำอัตโนมัติ ถาดเพาะกล้า กล่องปลูกผักระเบียง และตะกร้าแขวนจากจีนสำหรับผู้นำเข้าเอเชียตะวันออกเฉียงใต้',
            keywords: 'กระถางต้นไม้ขายส่ง, กระถางรดน้ำอัตโนมัติ, ผู้ผลิตกระถางใยไผ่, ถาดเพาะกล้าขายส่ง, OEM กล่องปลูกผักระเบียง, ตะกร้าแขวนส่งออก',
            strings: {
                floating_whatsapp: 'สอบถามทาง WhatsApp',
                nav_products: 'สินค้า',
                nav_factory: 'ข้อมูลโรงงานและเงื่อนไข',
                nav_services: 'OEM และส่งออก',
                nav_reviews: 'เสียงตอบรับ',
                nav_contact: 'ติดต่อ',
                nav_products_mobile: 'สินค้า',
                nav_factory_mobile: 'ข้อมูลโรงงานและเงื่อนไข',
                nav_services_mobile: 'OEM และส่งออก',
                nav_reviews_mobile: 'เสียงตอบรับ',
                nav_contact_mobile: 'ติดต่อ',
                nav_quote: 'ขอใบเสนอราคาขายส่ง',
                mobile_whatsapp: 'แชต WhatsApp',
                hero_banner_1: 'ข้อได้เปรียบภาษี RCEP',
                hero_banner_2: 'รองรับ OEM / แบรนด์ของลูกค้า',
                hero_banner_3: 'ทำตัวอย่างไวและบรรจุภัณฑ์ส่งออก',
                hero_badge: 'มุ่งเน้นผู้ซื้อ B2B ในเอเชียตะวันออกเฉียงใต้',
                hero_title: 'กระถางต้นไม้ขายส่งและกระถางรดน้ำอัตโนมัติจากจีน',
                hero_subtitle: 'เหมาะสำหรับผู้นำเข้า ผู้จัดจำหน่าย ร้านค้าปลีก และโครงการ OEM',
                hero_desc: 'คัดไลน์สินค้าตามความต้องการของเวียดนาม ไทย อินโดนีเซีย มาเลเซีย สิงคโปร์ และฟิลิปปินส์: กระถางเซรามิกรดน้ำอัตโนมัติ กระถางใยไผ่ ถาดเพาะ กล่องปลูกผักระเบียง และตะกร้าแขวน',
                hero_highlight_1: 'ช่วยประสานงานจากโรงงานต้นทาง',
                hero_highlight_2: 'มีทางเลือกด้าน MOQ และบรรจุภัณฑ์',
                hero_highlight_3: 'ตอบกลับ WhatsApp รวดเร็ว',
                hero_cta_primary: 'ขอใบเสนอราคาขายส่ง',
                hero_cta_secondary: 'คุยผ่าน WhatsApp',
                hero_stat_1: 'ประสบการณ์ส่งออก',
                hero_stat_2: 'ตลาดเป้าหมาย',
                hero_stat_3: 'พร้อมทำแบรนด์ลูกค้า',
                hero_stat_4: 'รองรับการค้าระดับภูมิภาค',
                hero_image_alt: 'ชุดกระถางต้นไม้ตามเทรนด์เอเชียตะวันออกเฉียงใต้',
                trend_chip_1: 'ความต้องการระบบรดน้ำอัตโนมัติ',
                trend_chip_2: 'วัสดุรักษ์โลก',
                trend_chip_3: 'ทำสวนระเบียงในเมือง',
                proof_title: 'พื้นที่แสดงความน่าเชื่อถือที่ควรเติมด้วยข้อมูลจริงของโรงงาน',
                proof_desc: 'ส่วนนี้ตั้งใจเว้นไว้เพื่อใส่ตัวเลขจริง ใบรับรอง รูปโรงงาน และหลักฐานการส่งออก ก่อนขยายงบโฆษณา',
                proof_card_1_title: 'ข้อมูลโรงงาน',
                proof_card_1_desc: 'เพิ่มพื้นที่โรงงาน จำนวนเวิร์กช็อป ไลน์การผลิต และรูปถ่ายจริง',
                proof_card_1_item_1: 'พื้นที่โรงงาน: อัปเดตจำนวนตารางเมตรจริง',
                proof_card_1_item_2: 'กำลังการผลิตต่อเดือน: อัปเดตปริมาณจริง',
                proof_card_1_item_3: 'ขนาดทีม: อัปเดตจำนวนพนักงานจริง',
                proof_card_2_title: 'ข้อมูลการรับรอง',
                proof_card_2_desc: 'เว้นพื้นที่สำหรับเอกสารยืนยันที่ผู้ซื้อ B2B มักขอ',
                proof_card_2_item_1: 'เพิ่ม BSCI / Sedex / ISO หากมี',
                proof_card_2_item_2: 'เพิ่ม ROHS / REACH / ข้อมูลความปลอดภัยหากเกี่ยวข้อง',
                proof_card_2_item_3: 'เพิ่มข้อมูลทดสอบบรรจุภัณฑ์และกล่อง',
                proof_card_3_title: 'เงื่อนไขส่งออกและกำหนดส่งมอบ',
                proof_card_3_desc: 'แสดง lead time ตัวอย่าง, lead time ออเดอร์ใหญ่ และท่าเรือส่งออกหลักอย่างชัดเจน',
                proof_card_3_item_1: 'ท่าเรือหลัก: Shenzhen / Guangzhou / Xiamen',
                proof_card_3_item_2: 'ระยะเวลาทำตัวอย่าง: 5-7 วัน (อ้างอิง)',
                proof_card_3_item_3: 'ระยะเวลาผลิตล็อตใหญ่: 20-35 วันหลังมัดจำ (อ้างอิง)',
                proof_card_4_title: 'หลักฐานทางตลาด',
                proof_card_4_desc: 'เว้นพื้นที่สำหรับเคสลูกค้าจริง รูปบรรจุตู้ และภาพวางขายหน้าร้าน',
                proof_card_4_item_1: 'กรณีศึกษาตามประเทศ',
                proof_card_4_item_2: 'ตัวอย่างบรรจุภัณฑ์แบบแบรนด์ลูกค้า',
                proof_card_4_item_3: 'ภาพหน้าจอรีวิวหรือวิดีโอจากผู้ซื้อ',
                trust_assets_title: 'ชุดเอกสารความน่าเชื่อถือที่ส่งให้ผู้ซื้อได้ตั้งแต่ครั้งแรก',
                trust_assets_desc: 'ใช้ส่วนนี้เป็นเช็กลิสต์ตอบกลับรอบแรก เพื่อให้ผู้นำเข้าตรวจสอบความพร้อมด้านเอกสาร การจัดส่ง และความเหมาะสมของโปรเจกต์ได้เร็วขึ้น',
                trust_doc_title: 'ชุดเอกสารการรับรอง',
                trust_doc_item_1: 'โปรไฟล์บริษัท แคตตาล็อกสินค้า และรูปโรงงานแบบ PDF',
                trust_doc_item_2: 'BSCI / Sedex / ISO และรายงานทดสอบที่เกี่ยวข้อง (ถ้ามี)',
                trust_doc_item_3: 'สเปกบรรจุภัณฑ์และสรุปผลทดสอบตกกล่อง',
                trust_doc_cta: 'ขอเอกสารการรับรอง',
                trust_shipping_title: 'ข้อมูลการจัดส่งและระยะเวลา',
                trust_shipping_item_1: 'ตัวอย่างการส่งออกล่าสุดตามประเทศและหมวดสินค้า',
                trust_shipping_item_2: 'เกณฑ์ lead time สำหรับตัวอย่างและออเดอร์ใหญ่ตามฤดูกาล',
                trust_shipping_item_3: 'ท่าเรือหลักและขอบเขต Incoterms ที่รองรับ',
                trust_shipping_cta: 'ขอข้อมูลการจัดส่ง',
                trust_case_title: 'สรุปเคสลูกค้า',
                trust_case_item_1: 'ตัวอย่าง OEM โลโก้และแพ็กกิ้งแบรนด์ลูกค้า',
                trust_case_item_2: 'ภาพวางขายหน้าร้านและภาพติดตั้งหน้างาน',
                trust_case_item_3: 'ตัวอย่างรอบคำสั่งซื้อ: จากทำตัวอย่างถึงตู้แรก',
                trust_case_cta: 'รับชุดเคสลูกค้า',
                quick_1_title: 'ฝ่ายขาย WhatsApp',
                quick_1_cta: 'เริ่มแชต',
                quick_2_title: 'โทรสอบถาม',
                quick_2_cta: 'โทรเลย',
                quick_3_title: 'อีเมลธุรกิจ',
                quick_3_cta: 'ส่งอีเมล',
                products_title: '6 หมวดกระถางขายดีสำหรับเอเชียตะวันออกเฉียงใต้',
                products_desc: 'ครอบคลุมกระถางรดน้ำอัตโนมัติ วัสดุยั่งยืน การปลูกผักระเบียง ถาดเพาะ และกระถางแขวนตกแต่ง',
                product_1_alt: 'กระถางใยไผ่รักษ์โลก',
                product_1_badge: 'สินค้าปริมาณสูง',
                product_1_title: 'กระถางดอกไม้ใยไผ่รักษ์โลก',
                product_1_desc: 'เหมาะกับผู้ซื้อในเวียดนามและไทยที่ต้องการกระถางน้ำหนักเบา เป็นมิตรต่อสิ่งแวดล้อม และมีโทนสีพร้อมขายปลีก',
                product_1_spec_1: 'มีตัวเลือกวัสดุย่อยสลายได้',
                product_1_spec_2: 'โทนสีแมตต์ธรรมชาติ',
                product_1_spec_3: 'รองรับโลโก้ OEM และกล่องสินค้า',
                product_1_meta_1: 'ช่วง MOQ: เริ่ม 100 ชิ้น',
                product_1_meta_2: 'การใช้งาน: ขายปลีก / ของขวัญ / ตกแต่งบ้าน',
                featured_badge: 'แนะนำ',
                product_2_alt: 'กระถางเซรามิกรดน้ำอัตโนมัติ',
                product_2_badge: 'ผู้นำเทรนด์',
                product_2_title: 'กระถางเซรามิกรดน้ำอัตโนมัติ',
                product_2_desc: 'หมวดสินค้าที่แข็งแรงสำหรับผู้ซื้อในสิงคโปร์และมาเลเซียที่ต้องการกระถางในร่มพรีเมียม ดูแลง่าย',
                product_2_spec_1: 'ระบบถังเก็บน้ำและเชือกดูดน้ำ',
                product_2_spec_2: 'มีตัวเลือกหน้าต่างดูระดับน้ำ',
                product_2_spec_3: 'เหมาะกับค้าปลีกไลฟ์สไตล์',
                product_2_meta_1: 'ช่วง MOQ: เริ่ม 50 ชิ้น',
                product_2_meta_2: 'การใช้งาน: บ้านสมัยใหม่ / ของขวัญ / เชนสโตร์',
                product_3_alt: 'ถาดเพาะกล้าแบบซ้อนได้',
                product_3_badge: 'นิยมในตลาดขายส่ง',
                product_3_title: 'ชุดถาดเพาะกล้าแบบซ้อนได้',
                product_3_desc: 'เหมาะสำหรับผู้ซื้อในอินโดนีเซียและฟิลิปปินส์ที่จัดการเพาะกล้า กระจายต้นกล้า และต้องการประหยัดพื้นที่ขนส่ง',
                product_3_spec_1: 'ดีไซน์ซ้อนเก็บได้',
                product_3_spec_2: 'ช่องเพาะเหมาะกับการขยายพันธุ์',
                product_3_spec_3: 'ลดปริมาตรการขนส่ง',
                product_3_meta_1: 'ช่วง MOQ: เริ่ม 500 ชิ้น',
                product_3_meta_2: 'การใช้งาน: เนอร์สเซอรี / ผู้ปลูก / ร้านอุปกรณ์เกษตร',
                product_4_alt: 'กระถางดินเผาระบายอากาศ',
                product_4_badge: 'คลาสสิกขายดี',
                product_4_title: 'กระถางดินเผาระบายอากาศ',
                product_4_desc: 'สินค้าแนวคลาสสิกที่เหมาะกับผู้ซื้อในเมียนมาและกัมพูชาที่ต้องการกระถางดินเผาระบายอากาศพร้อมสไตล์ดั้งเดิม',
                product_4_spec_1: 'อากาศไหลเวียนดีต่อราก',
                product_4_spec_2: 'ผิวดินเผาจากเตาเผา',
                product_4_spec_3: 'ภาพลักษณ์การวางขายที่คลาสสิก',
                product_4_meta_1: 'ช่วง MOQ: เริ่ม 100 ชิ้น',
                product_4_meta_2: 'การใช้งาน: สมุนไพร / ไม้อวบน้ำ / ตกแต่งกลางแจ้ง',
                product_5_alt: 'กล่องปลูกผักระเบียง',
                product_5_badge: 'เหมาะกับโครงการ',
                product_5_title: 'กล่องปลูกผักระเบียง',
                product_5_desc: 'เหมาะกับเทรนด์ปลูกผักในเมือง โครงการที่อยู่อาศัย และชุดขายปลีกสำหรับพื้นที่ขนาดเล็ก',
                product_5_spec_1: 'ขนาดเหมาะกับระเบียง',
                product_5_spec_2: 'มีตัวเลือกถาดระบายน้ำ',
                product_5_spec_3: 'รองรับ OEM ขนาดตามโครงการ',
                product_5_meta_1: 'ช่วง MOQ: เริ่ม 20 ชิ้น',
                product_5_meta_2: 'การใช้งาน: ขายปลีกคอนโด / ภูมิทัศน์ / โครงการ',
                product_6_alt: 'ตะกร้าแขวนใยมะพร้าว',
                product_6_badge: 'ความต้องการใหม่',
                product_6_title: 'ตะกร้าแขวนใยมะพร้าว',
                product_6_desc: 'ออกแบบมาสำหรับค้าปลีกตกแต่ง การจัดแสดงที่ลานบ้าน และคอลเลกชันสวนแนวตั้งที่มีภาพลักษณ์ธรรมชาติ',
                product_6_spec_1: 'พื้นผิวใยมะพร้าวธรรมชาติ',
                product_6_spec_2: 'มีตัวเลือกโซ่แขวน',
                product_6_spec_3: 'เหมาะกับไลน์ตกแต่งรักษ์โลก',
                product_6_meta_1: 'ช่วง MOQ: เริ่ม 100 ชิ้น',
                product_6_meta_2: 'การใช้งาน: ร้านสวน / ตกแต่ง / ลานบ้าน',
                view_details: 'ดูรายละเอียด',
                ask_quote: 'ขอใบเสนอราคาขายส่ง',
                features_title: 'การสนับสนุนด้าน OEM บรรจุภัณฑ์ และการส่งออกที่ผู้ซื้อคาดหวัง',
                features_desc: 'เว็บไซต์ B2B อิสระจะเปลี่ยนผู้ชมเป็นลูกค้าได้ดีกว่า เมื่อแสดงให้เห็นว่าซัพพลายเออร์รองรับขั้นตอนการซื้อจริงอย่างไร ไม่ใช่แค่มีรูปสวย',
                feature_1_title: 'การเตรียมพร้อมด้านมาตรฐาน',
                feature_1_desc: 'เว้นพื้นที่สำหรับรายงานทดสอบ เอกสารตามที่ผู้ซื้อขอ และข้อมูลความปลอดภัยของสินค้า',
                feature_2_title: 'บรรจุภัณฑ์ค้าปลีกและขายส่ง',
                feature_2_desc: 'แสดงการรองรับฉลากบาร์โค้ด กล่องรวม ใบแทรก และการออกแบบที่คำนึงถึงการทดสอบตกกระแทก',
                feature_3_title: 'การทำแบรนด์ลูกค้า',
                feature_3_desc: 'ใช้สำหรับโชว์การปรับสี โลโก้ ป้ายแขวน และโปรแกรม OEM สำหรับการวางขาย',
                feature_4_title: 'ข้อมูลตัวอย่างและ lead time',
                feature_4_desc: 'แสดงรอบการทำตัวอย่าง รอบการผลิต และกติกาช่วงไฮซีซัน',
                feature_5_title: 'การขายหลายภาษา',
                feature_5_desc: 'การสลับภาษาในหน้าแรกช่วยให้ลูกค้าคัดกรองเบื้องต้นได้ก่อนคุยเชิงลึกกับทีมขาย',
                feature_6_title: 'ขั้นตอนคัดกรอง inquiry',
                feature_6_desc: 'ส่วนติดต่อได้เว้นช่องสำหรับ MOQ, OEM, ท่าเรือปลายทาง, กำหนดส่ง และข้อมูลบริษัทแล้ว',
                markets_title: 'ตลาดหลักและทิศทางความต้องการ',
                markets_desc: 'ใช้การ์ดเหล่านี้เป็นแนวทางการวางตำแหน่ง แล้วค่อยเปลี่ยนเป็นข้อมูลส่งออกจริงของคุณภายหลัง',
                market_1_title: 'เวียดนาม',
                market_1_desc: 'กระถางรักษ์โลกและตกแต่งพร้อมขายปลีก',
                market_2_title: 'ไทย',
                market_2_desc: 'ค้าปลีกไลฟ์สไตล์และชุดกระถางพรีเมียม',
                market_3_title: 'อินโดนีเซีย',
                market_3_desc: 'ถาดเพาะและสินค้าสวนเชิงใช้งาน',
                market_4_title: 'ฟิลิปปินส์',
                market_4_desc: 'โครงการเพาะกล้าและไลน์พลาสติกราคาจับต้องได้',
                market_5_title: 'มาเลเซีย',
                market_5_desc: 'กระถางรดน้ำอัตโนมัติและกระถางในร่มสมัยใหม่',
                market_6_title: 'สิงคโปร์',
                market_6_desc: 'สินค้าขนาดกะทัดรัดระดับพรีเมียมและไลน์ของขวัญ',
                reviews_title: 'พื้นที่ตัวอย่างรีวิวผู้ซื้อสำหรับแทนที่ด้วยเคสจริง',
                reviews_desc: 'คงเลย์เอาต์นี้ไว้ แล้วเปลี่ยนเป็นชื่อผู้ซื้อที่ตรวจสอบได้ ประเภทออเดอร์ และหลักฐานประกอบ',
                review_1_location: 'ฮานอย เวียดนาม',
                review_1_text: '“เหมาะมากกับการจัดซื้อของเชนสโตร์ เมื่อควบคุม MOQ การติดแบรนด์ และความสม่ำเสมอของกล่องได้ดี”',
                review_1_product: 'ช่องอ้างอิง: โปรแกรมกระถางใยไผ่',
                review_2_location: 'กัวลาลัมเปอร์ มาเลเซีย',
                review_2_text: '“กระถางในร่มแบบรดน้ำอัตโนมัติขายง่ายขึ้น เมื่อซัพพลายเออร์ให้ข้อมูลสเปก ตัวเลือกผิวงาน และบรรจุภัณฑ์ค้าปลีกชัดเจน”',
                review_2_product: 'ช่องอ้างอิง: ไลน์เซรามิกรดน้ำอัตโนมัติ',
                review_3_location: 'สิงคโปร์',
                review_3_text: '“เว็บไซต์อิสระจะมีคอนเวอร์ชันดีขึ้นชัดเจน เมื่อมีไฟล์รับรองจริง รูปเคสงาน และ lead time ที่ตรงจริง”',
                review_3_product: 'ช่องอ้างอิง: การรับรองและการส่งออก',
                faq_title: 'FAQ กระถาง OEM: MOQ, Lead Time และเงื่อนไขส่งออก',
                faq_desc: 'คำตอบที่ใช้งานได้จริงสำหรับผู้นำเข้าเกี่ยวกับกระถาง OEM, private label, นโยบาย MOQ และ lead time ออเดอร์ใหญ่',
                faq_q1: 'MOQ สำหรับคำสั่งซื้อกระถาง OEM และ private label เท่าไร?',
                faq_a1: 'MOQ ขึ้นกับประเภทสินค้าและระดับการปรับแต่ง โดยทั่วไปสินค้ามาตรฐานเริ่มที่ 50-500 ชิ้น ส่วนงานที่มีโลโก้ OEM และแพ็กเกจเฉพาะแบรนด์มักต้องใช้ปริมาณสูงกว่าเพื่อให้ต้นทุนต่อชิ้นคงที่',
                faq_q2: 'ระยะเวลาทำตัวอย่างและผลิตล็อตใหญ่ใช้กี่วัน?',
                faq_a2: 'ตัวอย่างมาตรฐานมักใช้ 5-10 วัน ส่วนออเดอร์ล็อตใหญ่โดยทั่วไปใช้ 20-35 วันหลังรับมัดจำและยืนยันอาร์ตเวิร์ก โดยช่วงพีกซีซันควรเผื่อเวลาเพิ่ม',
                faq_q3: 'รองรับโลโก้ OEM, สีพิเศษ และแพ็กเกจแบรนด์ลูกค้าหรือไม่?',
                faq_a3: 'รองรับ เราสามารถทำโลโก้ OEM, โทนสีเฉพาะ, บาร์โค้ด, การ์ดแทรก และกล่องพร้อมขายปลีกได้ ทั้งนี้ความเป็นไปได้สุดท้ายขึ้นกับไลน์สินค้า ปริมาณ และกำหนดส่ง',
                faq_q4: 'รองรับ Incoterms และปลายทางท่าเรือใดบ้าง?',
                faq_a4: 'เงื่อนไขที่ใช้บ่อยคือ FOB และ CIF และเราสามารถวางแผนส่งออกไปท่าเรือหลักในเอเชียตะวันออกเฉียงใต้ได้ การแจ้งปลายทางและ timeline ตั้งแต่ต้นจะช่วยให้ยืนยันค่าขนส่งและราคาได้เร็วขึ้น',
                faq_q5: 'ต้องให้ข้อมูลอะไรเพื่อได้ใบเสนอราคาขายส่งที่แม่นยำเร็วที่สุด?',
                faq_a5: 'โปรดแจ้งประเภทสินค้า ปริมาณ ความต้องการ OEM ท่าเรือปลายทาง เดือนส่งมอบเป้าหมาย และมาตรฐานแพ็กกิ้ง ยิ่ง RFQ ครบถ้วน เรายิ่งเสนอราคาแม่นยำได้ภายใน 24 ชั่วโมงทำการ',
                contact_title: 'ขอใบเสนอราคาขายส่ง',
                contact_desc: 'แบบฟอร์ม inquiry ได้เพิ่มช่องที่ผู้ซื้อ B2B ใช้จริง เช่น บริษัท ประเทศ OEM ท่าเรือปลายทาง และช่วงเวลาส่งมอบ',
                contact_info_1_title: 'โรงงานและฐานจัดส่ง',
                contact_info_1_desc: 'ทีมซัพพอร์ตที่เซี่ยงไฮ้ ประสานงานโรงงานในจีน และส่งออกผ่านท่าเรือหลักทางตอนใต้ของจีน',
                contact_info_2_title: 'ช่องทางฝ่ายขาย',
                contact_info_3_title: 'อีเมลธุรกิจ',
                contact_info_3_desc: 'ส่ง RFQ, BOM และข้อกำหนดแพ็กกิ้งทางอีเมลเพื่อให้เสนอราคาได้เร็วและแม่นยำขึ้น',
                contact_info_4_title: 'สรุปนโยบายสำหรับผู้ซื้อ',
                contact_info_4_desc: 'เงื่อนไขทั่วไป: MOQ ตาม SKU, ค่าตัวอย่างหักคืนได้เมื่อสั่งล็อตใหญ่, รองรับ FOB/CIF, ชำระเงินแบบ 30/70 TT',
                form_name_label: 'ชื่อผู้ติดต่อ',
                form_name_placeholder: 'กรอกชื่อเต็ม',
                form_company_label: 'ชื่อบริษัท',
                form_company_placeholder: 'กรอกชื่อบริษัทหรือร้านค้า',
                form_email_label: 'อีเมลธุรกิจ',
                form_email_placeholder: 'name@company.com',
                form_phone_label: 'WhatsApp / โทรศัพท์',
                form_phone_placeholder: 'กรอกเบอร์ที่ติดต่อได้',
                form_country_label: 'ประเทศผู้ซื้อ',
                form_country_placeholder: 'เวียดนาม / ไทย / อินโดนีเซีย...',
                form_product_label: 'สินค้าที่สนใจ',
                form_product_placeholder: 'เลือกสินค้าได้มากกว่าหนึ่งรายการ',
                form_product_helper: 'คลิกเพื่อเปิดรายการและเลือกได้หลายสินค้า',
                form_product_required: 'กรุณาเลือกอย่างน้อยหนึ่งสินค้า',
                form_product_option_1: 'กระถางดอกไม้ใยไผ่รักษ์โลก',
                form_product_option_2: 'กระถางเซรามิกรดน้ำอัตโนมัติ',
                form_product_option_3: 'ชุดถาดเพาะกล้าแบบซ้อนได้',
                form_product_option_4: 'กระถางดินเผาระบายอากาศ',
                form_product_option_5: 'กล่องปลูกผักระเบียง',
                form_product_option_6: 'ตะกร้าแขวนใยมะพร้าว',
                form_product_option_7: 'อื่นๆ / สั่งทำ',
                form_quantity_label: 'ปริมาณโดยประมาณ',
                form_quantity_placeholder: 'กรอกจำนวนที่วางแผน',
                form_oem_label: 'OEM / แบรนด์ลูกค้า',
                form_oem_option_0: 'เลือกหนึ่งข้อ',
                form_oem_option_1: 'ต้องการ OEM',
                form_oem_option_2: 'ใช้สินค้ามาตรฐานได้',
                form_oem_option_3: 'ต้องการคำแนะนำก่อน',
                form_port_label: 'ท่าเรือ / เมืองปลายทาง',
                form_port_placeholder: 'กรอกท่าเรือหรือเมืองปลายทาง',
                form_date_label: 'เดือนที่ต้องการรับสินค้า',
                form_date_placeholder: 'ตัวอย่าง: กันยายน 2026',
                form_message_label: 'รายละเอียดความต้องการ',
                form_message_placeholder: 'แจ้งขนาด สี บรรจุภัณฑ์ ใบรับรอง และช่วงเวลาที่ต้องการสั่งซื้อ',
                form_submit: 'ขอใบเสนอราคาขายส่ง',
                form_response_promise: 'ตอบกลับภายใน 24 ชั่วโมงในเวลาทำการ',
                footer_desc: 'โครงเว็บไซต์ขายส่งกระถางสำหรับผู้ซื้อเอเชียตะวันออกเฉียงใต้ พร้อมให้เติมข้อมูลโรงงานจริง ใบรับรอง และหลักฐานส่งออก',
                footer_products_title: 'หมวดขายดี',
                footer_product_1: 'กระถางใยไผ่',
                footer_product_2: 'เซรามิกรดน้ำอัตโนมัติ',
                footer_product_3: 'ชุดถาดเพาะ',
                footer_product_4: 'กระถางดินเผา',
                footer_support_title: 'เช็กลิสต์เพิ่มคอนเวอร์ชัน',
                footer_support_1: 'เพิ่มข้อมูลโรงงานจริง',
                footer_support_2: 'เพิ่มใบรับรองที่ตรวจสอบได้',
                footer_support_3: 'เพิ่มเคสลูกค้าจริง',
                footer_support_4: 'เพิ่มเงื่อนไขส่งมอบและ MOQ',
                footer_contact_title: 'ช่องทางติดต่อ',
                footer_link_1: 'นโยบายความเป็นส่วนตัว',
                footer_link_2: 'เงื่อนไขการใช้บริการ',
                footer_link_3: 'การตั้งค่าคุกกี้'
            }
        },
        id: {
            title: 'Produsen Pot Tanaman Grosir & Self-Watering Planter | GreenSmart',
            description: 'Pemasok pot tanaman, self-watering planter, tray semai, planter box balkon, dan hanging basket dari Tiongkok untuk importir Asia Tenggara.',
            keywords: 'pot tanaman grosir, self watering planter, pemasok pot serat bambu, tray semai grosir, OEM planter box balkon, hanging basket ekspor',
            strings: {
                floating_whatsapp: 'Konsultasi WhatsApp',
                nav_products: 'Produk',
                nav_factory: 'Bukti pabrik & ketentuan',
                nav_services: 'OEM & ekspor',
                nav_reviews: 'Ulasan pembeli',
                nav_contact: 'Kontak',
                nav_products_mobile: 'Produk',
                nav_factory_mobile: 'Bukti pabrik & ketentuan',
                nav_services_mobile: 'OEM & ekspor',
                nav_reviews_mobile: 'Ulasan pembeli',
                nav_contact_mobile: 'Kontak',
                nav_quote: 'Minta penawaran grosir',
                mobile_whatsapp: 'Chat WhatsApp',
                hero_banner_1: 'Keuntungan tarif RCEP',
                hero_banner_2: 'Dukungan OEM / private label',
                hero_banner_3: 'Sampling cepat dan kemasan ekspor',
                hero_badge: 'Fokus pada pembeli B2B Asia Tenggara',
                hero_title: 'Pot Tanaman Grosir & Self-Watering Planter dari Tiongkok',
                hero_subtitle: 'Cocok untuk importir, distributor, jaringan retail, dan proyek OEM',
                hero_desc: 'Campuran produk yang sedang dicari di Vietnam, Thailand, Indonesia, Malaysia, Singapura, dan Filipina: planter keramik self-watering, pot serat bambu, tray semai, planter box balkon, dan hanging basket.',
                hero_highlight_1: 'Dukungan sourcing langsung dari pabrik',
                hero_highlight_2: 'Pilihan MOQ dan kemasan',
                hero_highlight_3: 'Respons cepat via WhatsApp',
                hero_cta_primary: 'Minta penawaran grosir',
                hero_cta_secondary: 'Chat via WhatsApp',
                hero_stat_1: 'Tahun pengalaman ekspor',
                hero_stat_2: 'Pasar target',
                hero_stat_3: 'Siap private label',
                hero_stat_4: 'Dukungan perdagangan regional',
                hero_image_alt: 'Koleksi planter sesuai tren Asia Tenggara',
                trend_chip_1: 'Permintaan self-watering',
                trend_chip_2: 'Material ramah lingkungan',
                trend_chip_3: 'Berkebun balkon perkotaan',
                proof_title: 'Bagian kepercayaan yang sebaiknya diisi dengan data pabrik asli',
                proof_desc: 'Kolom ini sengaja ditampilkan agar situs bisa ditingkatkan dengan angka terverifikasi, sertifikat, foto pabrik, dan bukti pengiriman sebelum iklan diperbesar.',
                proof_card_1_title: 'Profil pabrik',
                proof_card_1_desc: 'Tambahkan luas pabrik, jumlah workshop, lini produksi, dan foto pabrik asli.',
                proof_card_1_item_1: 'Luas pabrik: perbarui m2 sebenarnya',
                proof_card_1_item_2: 'Kapasitas bulanan: perbarui volume sebenarnya',
                proof_card_1_item_3: 'Ukuran tim: perbarui jumlah staf sebenarnya',
                proof_card_2_title: 'Bagian kepatuhan',
                proof_card_2_desc: 'Sediakan ruang untuk dokumen verifikasi yang biasa diminta pembeli B2B serius.',
                proof_card_2_item_1: 'Tambahkan BSCI / Sedex / ISO bila tersedia',
                proof_card_2_item_2: 'Tambahkan ROHS / REACH / catatan keamanan bila relevan',
                proof_card_2_item_3: 'Tambahkan detail uji kemasan dan karton',
                proof_card_3_title: 'Ketentuan ekspor dan pengiriman',
                proof_card_3_desc: 'Tampilkan jelas lead time sampel, lead time produksi massal, dan pelabuhan muat utama.',
                proof_card_3_item_1: 'Pelabuhan utama: Shenzhen / Guangzhou / Xiamen',
                proof_card_3_item_2: 'Lead time sampel: 5-7 hari (referensi)',
                proof_card_3_item_3: 'Lead time produksi massal: 20-35 hari setelah DP (referensi)',
                proof_card_4_title: 'Bukti sosial',
                proof_card_4_desc: 'Sisakan ruang untuk studi kasus pembeli asli, foto stuffing container, dan tampilan produk di toko.',
                proof_card_4_item_1: 'Studi kasus pasar utama per negara',
                proof_card_4_item_2: 'Contoh kemasan private label',
                proof_card_4_item_3: 'Screenshot testimoni atau video pembeli',
                trust_assets_title: 'Dokumen kepercayaan yang bisa Anda kirim di kontak pertama',
                trust_assets_desc: 'Gunakan bagian ini sebagai checklist balasan awal agar importir cepat memverifikasi kepatuhan, keandalan pengiriman, dan kecocokan proyek.',
                trust_doc_title: 'Paket dokumen kepatuhan',
                trust_doc_item_1: 'Profil perusahaan, katalog produk, dan foto pabrik dalam PDF',
                trust_doc_item_2: 'BSCI / Sedex / ISO serta laporan uji terpilih (jika tersedia)',
                trust_doc_item_3: 'Lembar spesifikasi kemasan dan ringkasan uji jatuh karton',
                trust_doc_cta: 'Minta dokumen kepatuhan',
                trust_shipping_title: 'Catatan pengiriman dan lead time',
                trust_shipping_item_1: 'Referensi pengiriman terbaru per negara dan kategori produk',
                trust_shipping_item_2: 'Patokan lead time sampel dan massal per musim',
                trust_shipping_item_3: 'Pelabuhan muat utama dan cakupan dukungan Incoterms',
                trust_shipping_cta: 'Minta data pengiriman',
                trust_case_title: 'Snapshot kasus pembeli',
                trust_case_item_1: 'Contoh OEM logo dan kemasan private label',
                trust_case_item_2: 'Foto rak retail dan foto instalasi proyek',
                trust_case_item_3: 'Contoh siklus order: dari sampel hingga kontainer pertama',
                trust_case_cta: 'Dapatkan paket kasus pembeli',
                quick_1_title: 'Sales WhatsApp',
                quick_1_cta: 'Mulai chat',
                quick_2_title: 'Dukungan telepon',
                quick_2_cta: 'Telepon sekarang',
                quick_3_title: 'Email bisnis',
                quick_3_cta: 'Kirim email',
                products_title: '6 kategori planter terlaris untuk Asia Tenggara',
                products_desc: 'Mencakup self-watering planter, material berkelanjutan, urban gardening, tray pembibitan, dan hanging planter dekoratif.',
                product_1_alt: 'Pot serat bambu ramah lingkungan',
                product_1_badge: 'Volume seller',
                product_1_title: 'Pot Bunga Serat Bambu Ramah Lingkungan',
                product_1_desc: 'Disukai pembeli Vietnam dan Thailand yang mencari planter ringan, ramah lingkungan, dan punya warna yang cocok untuk retail.',
                product_1_spec_1: 'Pilihan campuran biodegradable',
                product_1_spec_2: 'Warna matte natural',
                product_1_spec_3: 'Dukungan logo OEM dan karton',
                product_1_meta_1: 'Slot MOQ: mulai 100 pcs',
                product_1_meta_2: 'Penggunaan: retail / gift / dekor rumah',
                featured_badge: 'Unggulan',
                product_2_alt: 'Planter keramik self-watering',
                product_2_badge: 'Pemimpin tren',
                product_2_title: 'Planter Keramik Self-Watering',
                product_2_desc: 'Kategori kuat untuk pembeli Singapura dan Malaysia yang mencari planter indoor premium dengan daya tarik perawatan rendah.',
                product_2_spec_1: 'Sistem reservoir dan sumbu',
                product_2_spec_2: 'Opsi indikator level air',
                product_2_spec_3: 'Ideal untuk retail lifestyle',
                product_2_meta_1: 'Slot MOQ: mulai 50 pcs',
                product_2_meta_2: 'Penggunaan: rumah modern / gift / chain store',
                product_3_alt: 'Tray semai bertumpuk',
                product_3_badge: 'Favorit grosir',
                product_3_title: 'Set Tray Semai Bertumpuk',
                product_3_desc: 'Cocok untuk pembeli Indonesia dan Filipina yang mengelola pembibitan, distribusi bibit, dan pengiriman hemat ruang.',
                product_3_spec_1: 'Desain hemat ruang saat ditumpuk',
                product_3_spec_2: 'Sel ramah propagasi',
                product_3_spec_3: 'Jejak transportasi lebih kecil',
                product_3_meta_1: 'Slot MOQ: mulai 500 pcs',
                product_3_meta_2: 'Penggunaan: nursery / grower / toko pertanian',
                product_4_alt: 'Pot terakota berpori',
                product_4_badge: 'Penjual klasik',
                product_4_title: 'Pot Terakota Berpori',
                product_4_desc: 'Produk klasik yang tahan lama untuk pembeli Myanmar dan Kamboja yang membutuhkan pot tanah liat berpori dengan gaya tradisional.',
                product_4_spec_1: 'Sirkulasi udara alami untuk akar',
                product_4_spec_2: 'Tekstur tanah liat bakar kiln',
                product_4_spec_3: 'Tampilan display yang timeless',
                product_4_meta_1: 'Slot MOQ: mulai 100 pcs',
                product_4_meta_2: 'Penggunaan: herbal / sukulen / dekor outdoor',
                product_5_alt: 'Planter box balkon',
                product_5_badge: 'Untuk proyek',
                product_5_title: 'Planter Box Sayur Balkon',
                product_5_desc: 'Cocok untuk urban gardening, proyek residensial, dan kit retail untuk ruang tanam kecil.',
                product_5_spec_1: 'Ukuran ramah balkon',
                product_5_spec_2: 'Opsi tray drainase',
                product_5_spec_3: 'OEM ukuran untuk proyek',
                product_5_meta_1: 'Slot MOQ: mulai 20 pcs',
                product_5_meta_2: 'Penggunaan: retail apartemen / lanskap / suplai proyek',
                product_6_alt: 'Hanging basket sabut kelapa',
                product_6_badge: 'Permintaan baru',
                product_6_title: 'Hanging Basket Sabut Kelapa',
                product_6_desc: 'Dirancang untuk retail dekoratif, display patio, dan koleksi vertical gardening dengan tampilan natural.',
                product_6_spec_1: 'Tekstur liner sabut alami',
                product_6_spec_2: 'Opsi rantai gantung',
                product_6_spec_3: 'Cocok untuk program dekor hijau',
                product_6_meta_1: 'Slot MOQ: mulai 100 pcs',
                product_6_meta_2: 'Penggunaan: retail taman / dekor / rangkaian patio',
                view_details: 'Lihat detail',
                ask_quote: 'Minta penawaran grosir',
                features_title: 'Dukungan OEM, kemasan, dan ekspor yang diharapkan pembeli',
                features_desc: 'Situs B2B independen akan lebih baik konversinya ketika menunjukkan bagaimana pemasok mendukung alur pembelian nyata, bukan hanya kartu produk yang rapi.',
                feature_1_title: 'Perencanaan siap kepatuhan',
                feature_1_desc: 'Sediakan ruang untuk laporan uji, deklarasi sesuai permintaan pembeli, dan catatan keamanan produk.',
                feature_2_title: 'Kemasan retail dan bulk',
                feature_2_desc: 'Tunjukkan dukungan untuk barcode, master carton, kartu sisipan, dan kemasan yang mempertimbangkan drop test.',
                feature_3_title: 'Kustomisasi private label',
                feature_3_desc: 'Sisakan ruang untuk warna custom, aplikasi logo, hangtag, dan program OEM siap display.',
                feature_4_title: 'Slot sampel dan lead time',
                feature_4_desc: 'Tampilkan siklus sampel, siklus produksi massal, dan aturan musim puncak yang sebenarnya.',
                feature_5_title: 'Dukungan penjualan multi bahasa',
                feature_5_desc: 'Pergantian bahasa di homepage membantu kualifikasi awal sebelum tim Anda membalas lebih detail.',
                feature_6_title: 'Alur kualifikasi inquiry',
                feature_6_desc: 'Bagian kontak sekarang memberi ruang untuk MOQ, OEM, pelabuhan, deadline, dan informasi perusahaan.',
                markets_title: 'Pasar prioritas dan arah permintaan',
                markets_desc: 'Gunakan kartu ini sebagai petunjuk positioning lalu ganti dengan data ekspor aktual Anda bila tersedia.',
                market_1_title: 'Vietnam',
                market_1_desc: 'Pot eco dan dekoratif siap retail',
                market_2_title: 'Thailand',
                market_2_desc: 'Retail lifestyle dan set planter premium',
                market_3_title: 'Indonesia',
                market_3_desc: 'Tray pembibitan dan suplai taman praktis',
                market_4_title: 'Filipina',
                market_4_desc: 'Program nursery dan lini plastik terjangkau',
                market_5_title: 'Malaysia',
                market_5_desc: 'Self-watering dan planter indoor modern',
                market_6_title: 'Singapura',
                market_6_desc: 'Produk premium ringkas dan gift line',
                reviews_title: 'Placeholder ulasan pembeli untuk diganti studi kasus nyata',
                reviews_desc: 'Pertahankan layout ini lalu ganti dengan nama pembeli terverifikasi, kategori order, dan bukti visual.',
                review_1_location: 'Hanoi, Vietnam',
                review_1_text: '“Sangat cocok untuk pengadaan chain store ketika MOQ, private label, dan kestabilan kualitas karton ditangani dengan baik.”',
                review_1_product: 'Slot referensi: program pot serat bambu',
                review_2_location: 'Kuala Lumpur, Malaysia',
                review_2_text: '“Planter indoor self-watering lebih mudah dijual ketika pemasok memberikan spesifikasi jelas, pilihan finishing, dan dukungan kemasan retail.”',
                review_2_product: 'Slot referensi: lini keramik self-watering',
                review_3_location: 'Singapura',
                review_3_text: '“Situs independen akan mengonversi lebih baik setelah file kepatuhan nyata, foto kasus, dan lead time yang akurat terlihat jelas.”',
                review_3_product: 'Slot referensi: dukungan kepatuhan dan ekspor',
                faq_title: 'FAQ Pot OEM: MOQ, Lead Time, dan Ketentuan Ekspor',
                faq_desc: 'Jawaban praktis untuk importir yang mengevaluasi pot OEM, private label, kebijakan MOQ, dan lead time pengiriman massal.',
                faq_q1: 'Berapa MOQ untuk pot OEM dan pesanan private label?',
                faq_a1: 'MOQ bergantung pada jenis produk dan tingkat kustomisasi. Untuk sebagian besar SKU standar, MOQ mulai dari 50-500 pcs. Untuk proyek logo OEM dan kemasan khusus biasanya membutuhkan volume lebih tinggi agar harga stabil.',
                faq_q2: 'Berapa lama lead time sampel dan produksi massal?',
                faq_a2: 'Lead time sampel biasanya 5-10 hari untuk opsi standar. Lead time produksi massal umumnya 20-35 hari setelah DP dan konfirmasi artwork, dengan buffer tambahan saat musim puncak.',
                faq_q3: 'Apakah mendukung logo OEM, warna khusus, dan kemasan bermerek?',
                faq_a3: 'Ya. Kami mendukung cetak logo OEM, program warna khusus, label barcode, insert card, dan karton siap retail. Kelayakan akhir bergantung pada lini produk, jumlah, dan target jadwal kirim.',
                faq_q4: 'Incoterms dan pelabuhan tujuan apa saja yang bisa didukung?',
                faq_a4: 'Ketentuan umum meliputi FOB dan CIF, dan kami dapat menyesuaikan rencana pengiriman untuk pelabuhan utama Asia Tenggara. Berikan pelabuhan tujuan dan timeline lebih awal agar konfirmasi freight dan harga lebih cepat.',
                faq_q5: 'Informasi apa yang dibutuhkan agar cepat mendapat penawaran grosir yang akurat?',
                faq_a5: 'Mohon berikan jenis produk, jumlah, kebutuhan OEM, pelabuhan tujuan, bulan target pengiriman, dan standar kemasan. RFQ yang lengkap membantu kami mengirim penawaran akurat dalam 24 jam kerja.',
                contact_title: 'Minta penawaran grosir',
                contact_desc: 'Form inquiry kini menyiapkan kolom praktis yang biasa dibutuhkan pembeli B2B: perusahaan, negara, OEM, pelabuhan tujuan, dan target waktu pengiriman.',
                contact_info_1_title: 'Pabrik dan basis pengiriman',
                contact_info_1_desc: 'Dukungan tim Shanghai, koordinasi produksi pabrik di China, dan ekspor via pelabuhan utama China Selatan.',
                contact_info_2_title: 'Kontak sales',
                contact_info_3_title: 'Email bisnis',
                contact_info_3_desc: 'Kirim RFQ, file BOM, dan kebutuhan kemasan via email agar penawaran lebih cepat dan akurat.',
                contact_info_4_title: 'Ringkasan kebijakan pembeli',
                contact_info_4_desc: 'Ketentuan umum: MOQ per SKU, biaya sampel bisa dipotong saat order massal, dukungan FOB/CIF, pembayaran 30/70 TT.',
                form_name_label: 'Nama lengkap',
                form_name_placeholder: 'Nama lengkap Anda',
                form_company_label: 'Nama perusahaan',
                form_company_placeholder: 'Nama perusahaan atau toko Anda',
                form_email_label: 'Email bisnis',
                form_email_placeholder: 'name@company.com',
                form_phone_label: 'WhatsApp / telepon',
                form_phone_placeholder: 'Nomor kontak Anda',
                form_country_label: 'Negara pembeli',
                form_country_placeholder: 'Vietnam / Thailand / Indonesia...',
                form_product_label: 'Produk yang diminati',
                form_product_placeholder: 'Pilih satu atau beberapa produk',
                form_product_helper: 'Klik untuk membuka daftar dan pilih beberapa produk.',
                form_product_required: 'Pilih setidaknya satu produk.',
                form_product_option_1: 'Pot Bunga Serat Bambu Ramah Lingkungan',
                form_product_option_2: 'Planter Keramik Self-Watering',
                form_product_option_3: 'Set Tray Semai Bertumpuk',
                form_product_option_4: 'Pot Terakota Berpori',
                form_product_option_5: 'Planter Box Sayur Balkon',
                form_product_option_6: 'Hanging Basket Sabut Kelapa',
                form_product_option_7: 'Lainnya / permintaan custom',
                form_quantity_label: 'Perkiraan jumlah',
                form_quantity_placeholder: 'Jumlah order yang direncanakan',
                form_oem_label: 'OEM / private label',
                form_oem_option_0: 'Pilih satu',
                form_oem_option_1: 'Ya, perlu OEM',
                form_oem_option_2: 'Tidak, produk standar saja',
                form_oem_option_3: 'Perlu saran terlebih dahulu',
                form_port_label: 'Pelabuhan / kota tujuan',
                form_port_placeholder: 'Pelabuhan atau kota tujuan',
                form_date_label: 'Bulan target pengiriman',
                form_date_placeholder: 'Contoh: September 2026',
                form_message_label: 'Kebutuhan',
                form_message_placeholder: 'Jelaskan ukuran, warna, kemasan, sertifikasi, dan target waktu order Anda.',
                form_submit: 'Minta penawaran grosir',
                form_response_promise: 'Kami membalas dalam 24 jam kerja.',
                footer_desc: 'Kerangka situs grosir planter untuk pembeli Asia Tenggara, dengan ruang untuk menambahkan data pabrik asli, sertifikat, dan bukti ekspor.',
                footer_products_title: 'Kategori unggulan',
                footer_product_1: 'Pot serat bambu',
                footer_product_2: 'Keramik self-watering',
                footer_product_3: 'Set tray semai',
                footer_product_4: 'Planter terakota',
                footer_support_title: 'Checklist peningkatan konversi',
                footer_support_1: 'Tambahkan data pabrik asli',
                footer_support_2: 'Tambahkan sertifikat terverifikasi',
                footer_support_3: 'Tambahkan studi kasus pembeli',
                footer_support_4: 'Tambahkan syarat pengiriman dan MOQ',
                footer_contact_title: 'Slot kontak',
                footer_link_1: 'Kebijakan Privasi',
                footer_link_2: 'Syarat Layanan',
                footer_link_3: 'Pengaturan Cookie'
            }
        }
    };

    function applyTranslations(lang) {
        const fallback = dictionaries.en;
        const bundle = dictionaries[lang] || fallback;
        const strings = bundle.strings || {};
        const fallbackStrings = fallback.strings || {};

        function pick(key) {
            return strings[key] || fallbackStrings[key] || '';
        }

        function updateFaqStructuredData() {
            const faqScript = document.getElementById('faqStructuredData');
            if (!faqScript) return;
            const faqQuestions = [
                { q: pick('faq_q1'), a: pick('faq_a1') },
                { q: pick('faq_q2'), a: pick('faq_a2') },
                { q: pick('faq_q3'), a: pick('faq_a3') },
                { q: pick('faq_q4'), a: pick('faq_a4') },
                { q: pick('faq_q5'), a: pick('faq_a5') }
            ].filter((item) => item.q && item.a);

            const faqJsonLd = {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqQuestions.map((item) => ({
                    '@type': 'Question',
                    name: item.q,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.a
                    }
                }))
            };
            faqScript.textContent = JSON.stringify(faqJsonLd);
        }

        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
        document.title = bundle.title || fallback.title;
        if (metaDescription) metaDescription.setAttribute('content', bundle.description || fallback.description);
        if (metaKeywords) metaKeywords.setAttribute('content', bundle.keywords || fallback.keywords);

        document.querySelectorAll('[data-i18n]').forEach((node) => {
            const key = node.getAttribute('data-i18n');
            node.textContent = strings[key] || fallbackStrings[key] || node.textContent;
        });

        const productTrigger = document.querySelector('[data-multi-select-trigger]');
        if (productTrigger) {
            productTrigger.dataset.placeholderText = pick('form_product_placeholder');
        }

        document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
            const key = node.getAttribute('data-i18n-placeholder');
            node.setAttribute('placeholder', strings[key] || fallbackStrings[key] || node.getAttribute('placeholder') || '');
        });

        document.querySelectorAll('[data-i18n-alt]').forEach((node) => {
            const key = node.getAttribute('data-i18n-alt');
            node.setAttribute('alt', strings[key] || fallbackStrings[key] || node.getAttribute('alt') || '');
        });

        applyHeroTitleVariant(lang);
        updateDetailPageLinks(lang);
        updateFaqStructuredData();
        updateProductMultiSelectDisplay();

        langButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.lang === lang);
        });

        localStorage.setItem('greensmart-lang', lang);
    }

    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 360);
        }
    });

    backToTop?.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.toggle('fa-bars', !mobileMenu.classList.contains('active'));
            icon.classList.toggle('fa-times', mobileMenu.classList.contains('active'));
        });
    }

    document.querySelectorAll('.navbar-nav a, .mobile-menu a').forEach((link) => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
                }
                mobileMenu.classList.remove('active');
                const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    langButtons.forEach((button) => {
        button.addEventListener('click', function () {
            applyTranslations(button.dataset.lang);
        });
    });

    document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
        link.addEventListener('click', function () {
            trackEvent('click_whatsapp', withTrackingMeta({
                section: getTrackingSection(this),
                label: getTrackingLabel(this, 'whatsapp'),
                href: this.getAttribute('href') || ''
            }));
        });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
        link.addEventListener('click', function () {
            trackEvent('click_phone', withTrackingMeta({
                section: getTrackingSection(this),
                label: getTrackingLabel(this, 'phone'),
                href: this.getAttribute('href') || ''
            }));
        });
    });

    document.querySelectorAll('.products-grid a[href$=".html"]').forEach((link) => {
        link.addEventListener('click', function () {
            trackEvent('view_product_detail', withTrackingMeta({
                product_url: this.getAttribute('href') || '',
                label: getTrackingLabel(this, 'product_detail')
            }));
        });
    });

    initProductMultiSelect();

    contactForm?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const lang = localStorage.getItem('greensmart-lang') || 'en';
        const formData = new FormData(this);
        const selectedProducts = formData.getAll('product').filter((item) => String(item || '').trim());
        const messages = {
            en: { sending: 'Sending...', sent: 'Inquiry sent', failed: 'Send failed, please try again.' },
            zh: { sending: '发送中...', sent: '询盘已提交', failed: '提交失败，请稍后重试。' },
            vi: { sending: 'Dang gui...', sent: 'Da gui inquiry', failed: 'Gui that bai, vui long thu lai.' },
            th: { sending: 'กําลังส่ง...', sent: 'ส่งคำถามแล้ว', failed: 'ส่งไม่สำเร็จ โปรดลองอีกครั้ง' },
            id: { sending: 'Mengirim...', sent: 'Inquiry terkirim', failed: 'Gagal kirim, silakan coba lagi.' }
        };
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        const current = messages[lang] || messages.en;
        if (!selectedProducts.length) {
            productMultiSelect?.classList.add('is-invalid');
            productMultiSelect?.classList.add('is-open');
            const trigger = productMultiSelect?.querySelector('[data-multi-select-trigger]');
            trigger?.setAttribute('aria-expanded', 'true');
            trigger?.focus();
            return;
        }
        submitButton.disabled = true;
        submitButton.textContent = current.sending;
        productMultiSelect?.classList.remove('is-invalid');
        const payload = Object.fromEntries(formData.entries());
        payload.product = selectedProducts.join(',');
        payload.lang = lang;
        payload.source = 'website';
        payload.pageUrl = window.location.href;

        try {
            if (defaultInquiryApiUrl) {
                const requestHeaders = { 'Content-Type': 'application/json' };
                if (siteConfig.inquiryApiBearer) {
                    requestHeaders.Authorization = `Bearer ${siteConfig.inquiryApiBearer}`;
                }
                const response = await fetch(defaultInquiryApiUrl, {
                    method: 'POST',
                    headers: requestHeaders,
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            } else {
                await new Promise((resolve) => setTimeout(resolve, 800));
            }

            submitButton.textContent = current.sent;
            submitButton.style.backgroundColor = '#28a745';
            trackEvent('submit_inquiry_success', withTrackingMeta({
                lang,
                product: selectedProducts.join('|') || 'unknown',
                country: formData.get('country') || 'unknown'
            }));
            this.reset();
            productMultiSelect?.classList.remove('is-open');
            productMultiSelect?.querySelector('[data-multi-select-trigger]')?.setAttribute('aria-expanded', 'false');
            updateProductMultiSelectDisplay();
        } catch (error) {
            submitButton.textContent = current.failed;
            submitButton.style.backgroundColor = '#dc2626';
            trackEvent('submit_inquiry_failed', withTrackingMeta({
                lang,
                reason: error.message || 'unknown'
            }));
        } finally {
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.backgroundColor = '#22c55e';
                submitButton.disabled = false;
            }, 1800);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.product-card, .feature-card, .review-card, .proof-card, .market-card').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const initialLang = 'en';
    applyTranslations(initialLang);
    trackEvent('ab_variant_exposure', withTrackingMeta({
        test: 'hero_title',
        lang: initialLang
    }));
});
