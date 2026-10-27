import { Product, AddonProduct } from './types';

export const COMPLEMENTARY_ADDONS: AddonProduct[] = [
  {
    id: 'addon-cedar-shoetree',
    nameFr: 'Embauchoirs en cèdre rouge massif',
    nameAr: 'قوالب أحذية من خشب الأرز الأحمر الأصلي',
    priceMAD: 380,
    image: '/images/craft_leather_sole_1792953851868.jpg',
    descriptionFr: 'Absorbe l’humidité, tend les plis d’aisance et conserve la forme originelle de la tige en cuir.',
    descriptionAr: 'يمتص الرطوبة ويحافظ على انسيابية الجلد وشكله الأصلي لفترة تدوم طويلاً.',
  },
  {
    id: 'addon-beeswax-cream',
    nameFr: 'Crème nourrissante à la cire d’abeille & carnauba (50ml)',
    nameAr: 'كريم مغذي بفرنيش شمع النحل والكرنوبا (50 مل)',
    priceMAD: 190,
    image: '/images/craft_leather_grain_1792953850533.jpg',
    descriptionFr: 'Nourrit en profondeur sans saturer la fleur du cuir. Formule traditionnelle sans silicone.',
    descriptionAr: 'يغذي ألياف الجلد بعمق دون سد المسام. تركيبة تقليدية طبيعية خالية من السيليكون.',
  },
];

// Helper to construct exactly 3 curated gallery images for luxury presentation
const createGallery = (modelSlug: string, color: string, mainImage: string) => [
  {
    label: 'Vue principale',
    angle: 'side' as const,
    url: mainImage,
    alt: `${modelSlug} ${color} - vue d’ensemble du soulier`,
  },
  {
    label: 'Semelle en cuir',
    angle: 'sole' as const,
    url: '/images/craft_leather_sole_1792953851868.jpg',
    alt: `${modelSlug} semelle en cuir tannage végétal avec fer encastré`,
  },
  {
    label: 'Détail couture & cuir',
    angle: 'stitching' as const,
    url: '/images/craft_welt_stitch_1792953850875.jpg',
    alt: `${modelSlug} macro de la couture trépointe et de la finition artisanale`,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    slug: 'le-royal-richelieu-noir-ebene',
    modelName: 'Le Royal',
    shoeTypeFr: 'Richelieu Oxford à bout droit',
    shoeTypeAr: 'أوكسفورد كلاسيكي ريشيليو برأس مستقيم',
    style: 'oxford',
    occasion: 'wedding',
    colorNameFr: 'Noir Ébène',
    colorNameAr: 'أسود أبنوسي',
    colorHex: '#181716',
    priceMAD: 1950,
    isBestSeller: true,
    width: 'standard',
    images: createGallery('Le Royal', 'Noir Ébène', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'in_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'low_stock' },
      { eu: 43, cm: 27.3, status: 'in_stock' },
      { eu: 44, cm: 28.0, status: 'in_stock' },
      { eu: 45, cm: 28.7, status: 'low_stock' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'Forme classique ajustée. Si vous oscillez entre deux pointures (ex. 41.5), prenez la taille en-dessous (41) si votre pied est fin, ou la taille au-dessus (42) si vous avez un cou-de-pied prononcé.',
    betweenSizesAdviceAr: 'قالب كلاسيكي مضبوط. إذا كنت تتردد بين مقاسين (مثلاً 41 و42)، نوصي باختيار المقاس الأصغر (41) للقدم النحيفة أو الأكبر (42) إذا كان مشط قدمك عريضاً.',
    descriptionFr: 'Le Richelieu archétypal à plastron fermé et bout droit perforé avec discrétion. Dessiné pour les cérémonies solennelles, les conseils d’administration et les tenues formelles exigeant une pureté de ligne absolue.',
    descriptionAr: 'حذاء ريشيليو الأوكسفورد الأكثر فخامة برباط مغلق ورأس مستقيم بنقش هادئ. صُمم للمناسبات الرسمية وحفلات الزفاف والاجتماعات الرفيعة التي تتطلب نقاءً تاماً في المظهر.',
    specs: {
      leatherType: '[PLACEHOLDER : Cuir Box-Calf pleine fleur 1.3–1.5mm]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Montage Goodyear cousu trépointe ressemelable]',
      lining: '[PLACEHOLDER : Doublure intégrale veau naturel sans chrome]',
      sole: '[PLACEHOLDER : Semelle cuir tannage végétal extra-lente + bonbout gomme]',
      lastWidth: '[PLACEHOLDER : Forme Royale - Largeur Standard D/E]',
      finish: '[PLACEHOLDER : Finition glacée à la main aux cires naturelles]'
    },
    careGuideFr: [
      'Insérer immédiatement les embauchoirs en cèdre après chaque port.',
      'Brosser avec un décrottoir en crin de cheval doux avant toute crème.',
      'Hydrater avec une noisette de crème nourrissante tous les 4 à 6 ports.',
      'Laisser reposer au moins 24 heures entre deux utilisations consécutives.'
    ],
    careGuideAr: [
      'وضع قوالب الخشب فور خلع الحذاء لامتصاص الرطوبة ومنع التشققات.',
      'إزالة الغبار بفرشاة شعر الخيل الناعمة قبل وضع أي كريم.',
      'ترطيب الجلد بمسحة خفيفة من كريم شمع النحل كل 4 إلى 6 مرات ارتداء.',
      'ترك الحذاء يرتاح لمدة 24 ساعة على الأقل بين كل ارتدائين.'
    ],
    shippingAdviceFr: 'Livraison gratuite avec essayage sécurisé à domicile. Si la pointure ne vous convient pas, le livreur patiente ou l’échange est pris en charge sans frais.',
    shippingAdviceAr: 'التوصيل مجاني مع إمكانية القياس والتأكد من المقاس في المنزل. في حال عدم ملائمة المقاس، يتم التبديل فوراً ومجاناً.',
    reviews: [
      {
        id: 'rev-01',
        author: 'Karim B.',
        city: 'Casablanca (Anfa)',
        date: '14 Octobre 2026',
        rating: 5,
        title: 'Maintien remarquable dès le premier jour',
        content: 'Très impressionné par la régularité des coutures et la rigidité noble de la semelle. J’avais peur pour le cou-de-pied en commandant en ligne au Maroc, mais la pointure 42 tombe exactement juste.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      },
      {
        id: 'rev-02',
        author: 'Driss T.',
        city: 'Rabat (Souissi)',
        date: '28 Septembre 2026',
        rating: 5,
        title: 'Finitions dignes des grandes maisons',
        content: 'La ligne est sobre et le cuir prend la lumière de façon très subtile. Le service client sur WhatsApp a été exemplaire pour confirmer la pointure avec mes mesures en cm.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-02',
    slug: 'le-consul-derby-cognac-patine',
    modelName: 'Le Consul',
    shoeTypeFr: 'Derby 5 œillets à quartier ouvert',
    shoeTypeAr: 'حذاء ديربي كلاسيكي 5 ثقوب برباط مفتوح',
    style: 'derby',
    occasion: 'work',
    colorNameFr: 'Cognac Patiné',
    colorNameAr: 'كونياك معتق بلمسة طبيعية',
    colorHex: '#9A5B2E',
    priceMAD: 1850,
    isBestSeller: true,
    width: 'standard',
    images: createGallery('Le Consul', 'Cognac Patiné', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'in_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'in_stock' },
      { eu: 43, cm: 27.3, status: 'in_stock' },
      { eu: 44, cm: 28.0, status: 'low_stock' },
      { eu: 45, cm: 28.7, status: 'in_stock' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'Le laçage ouvert du derby offre une tolérance accrue sur le cou-de-pied. Choisissez votre pointure habituelle de souliers de ville.',
    betweenSizesAdviceAr: 'يوفر الرباط المفتوح في حذاء الديربي مرونة إضافية لمنطقة مشط القدم. اختر مقاسك المعتاد في الأحذية الرسمية.',
    descriptionFr: 'Derby polyvalent par excellence. Les quartiers cousus sur l’empeigne permettent un laçage adaptable qui respecte les pieds forts, habillant avec distinction aussi bien un costume en flanelle qu’un pantalon chino en gabardine de coton.',
    descriptionAr: 'حذاء الديربي المتعدد الاستخدامات بتصميم مريح يناسب مختلف أشكال الأقدام بفضل الأربطة المفتوحة. ينسجم بانسيابية مع البدل الرسمية وكذلك الإطلالات اليومية الأنيقة.',
    specs: {
      leatherType: '[PLACEHOLDER : Veau patiné pleine fleur semi-aniline]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Montage cousu Blake sous gravure]',
      lining: '[PLACEHOLDER : Doublure veau souple respirante]',
      sole: '[PLACEHOLDER : Semelle cuir compacte avec patin injecté]',
      lastWidth: '[PLACEHOLDER : Forme Diplomate - Largeur D]',
      finish: '[PLACEHOLDER : Patine artisanale fondue aux huiles essentielles]'
    },
    careGuideFr: [
      'Protéger contre la pluie avec un voile d’imperméabilisant sans silicone.',
      'Appliquer une crème cognac pour raviver les nuances de patine.',
      'Lustrer vigoureusement avec une chamoisine en coton doux.'
    ],
    careGuideAr: [
      'حماية الحذاء من المطر برذاذ حماية طبيعي خالي من السيليكون.',
      'وضع كريم لون كونياك للحفاظ على تدرجات اللون المعتق.',
      'تلميع السطح بقطعة قماش قطنية ناعمة بعد الترطيب.'
    ],
    shippingAdviceFr: 'Livraison sous 24h à Casablanca et Rabat, 24-48h dans toutes les autres villes du Royaume.',
    shippingAdviceAr: 'توصيل خلال 24 ساعة في الدار البيضاء والرباط، و24 إلى 48 ساعة لباقي مدن المملكة.',
    reviews: [
      {
        id: 'rev-03',
        author: 'Mehdi A.',
        city: 'Marrakech (Guéliz)',
        date: '02 Octobre 2026',
        rating: 5,
        title: 'Un confort immédiat sans aucune gêne',
        content: 'Cuir souple mais structuré. Je marche beaucoup lors de mes visites de chantiers et rendez-vous, aucune ampoule. La couleur cognac a de la profondeur.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-03',
    slug: 'le-majorelle-mocassin-havane-brun',
    modelName: 'Le Majorelle',
    shoeTypeFr: 'Mocassin Penny Loafer à barrette',
    shoeTypeAr: 'موكاسين بيني لوفر كلاسيكي بحزام جلدي',
    style: 'loafer',
    occasion: 'work',
    colorNameFr: 'Havane Brun',
    colorNameAr: 'بني هافانا كلاسيكي',
    colorHex: '#4A2A18',
    priceMAD: 1750,
    isBestSeller: true,
    width: 'standard',
    images: createGallery('Le Majorelle', 'Havane Brun', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'in_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'low_stock' },
      { eu: 42, cm: 26.7, status: 'in_stock' },
      { eu: 43, cm: 27.3, status: 'in_stock' },
      { eu: 44, cm: 28.0, status: 'in_stock' },
      { eu: 45, cm: 28.7, status: 'low_stock' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'Le mocassin n’ayant pas de lacets, l’ajustement doit être franc au talon. En cas d’hésitation, prenez une demi-pointure en-dessous.',
    betweenSizesAdviceAr: 'نظراً لعدم وجود أربطة في الموكاسين، يجب أن يكون الحذاء ملتصقاً بالكعب بثبات. ننصح بنصف مقاس أصغر في حالة التردد.',
    descriptionFr: 'Inspiré de l’élégance méditerranéenne décontractée. Coutures retournées sur le tablier, découpe traditionnelle de la barrette pour la pièce de monnaie, et une cambrure qui épouse la voûte plantaire sans faillir.',
    descriptionAr: 'مستوحى من الأناقة المتوسطية الراقية. خياطة بارزة متقنة، وحزام بيني تقليدي يضفي لمسة عصرية مع دعم مريح لقوس القدم طوال النهار.',
    specs: {
      leatherType: '[PLACEHOLDER : Cuir veau pleine fleur gras hydrofuge]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Cousu Blake souple à double surpiqûre]',
      lining: '[PLACEHOLDER : Doublure veau naturelle respirante]',
      sole: '[PLACEHOLDER : Semelle cuir souple avec talon biseauté]',
      lastWidth: '[PLACEHOLDER : Forme Loafer Riviera - Largeur D]',
      finish: '[PLACEHOLDER : Finition cirée havane aux huiles végétales]'
    },
    careGuideFr: [
      'Brossage quotidien pour éliminer le sable fin et la poussière.',
      'Crème nourrissante brun foncé 1 fois par mois.',
      'Toujours utiliser un chausse-pied pour préserver le contrefort du talon.'
    ],
    careGuideAr: [
      'تنظيف دوري بالفرشاة لإزالة الغبار الناعم.',
      'تطبيق كريم ترطيب بني داكن مرة كل شهر.',
      'استخدام مبيسة الحذاء دائماً لحماية كعب الحذاء من التلف.'
    ],
    shippingAdviceFr: 'Expédié sous pli protecteur individuel avec deux pochons en feutre de laine pour le voyage.',
    shippingAdviceAr: 'يُشحن في علبة واقية مع كيسين من القماش الصوفي لحفظ كل حذاء أثناء السفر.',
    reviews: [
      {
        id: 'rev-04',
        author: 'Omar S.',
        city: 'Tanger (Malabata)',
        date: '19 Septembre 2026',
        rating: 5,
        title: 'Maintien impeccable sans glissement du talon',
        content: 'Trouver un mocassin qui ne déchausse pas au talon est rare. Celui-ci est parfaitement équilibré. Très belle patine profonde.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-04',
    slug: 'l-hivernal-bottine-chelsea-marron-chataigne',
    modelName: 'L’Hivernal',
    shoeTypeFr: 'Bottine Chelsea à élastiques latéraux',
    shoeTypeAr: 'بوت تشيلسي كلاسيكي بحزام مطاطي جانبي',
    style: 'boot',
    occasion: 'work',
    colorNameFr: 'Marron Châtaigne',
    colorNameAr: 'بني كستنائي دافئ',
    colorHex: '#522A1E',
    priceMAD: 2200,
    isBestSeller: true,
    width: 'standard',
    images: createGallery('L’Hivernal', 'Marron Châtaigne', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'low_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'in_stock' },
      { eu: 43, cm: 27.3, status: 'in_stock' },
      { eu: 44, cm: 28.0, status: 'in_stock' },
      { eu: 45, cm: 28.7, status: 'low_stock' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'Si vous portez des chaussettes d’hiver en laine mi-épaisses, prenez votre pointure exacte de ville.',
    betweenSizesAdviceAr: 'إذا كنت ترتدي جوارب صوفية شتوية متوسطة السماكة، اختر مقاسك المعتاد في الأحذية الرسمية.',
    descriptionFr: 'Chelsea boot taillée d’une seule pièce de cuir sans découpe superflue (wholecut). Élastiques haute tension qui conservent leur mémoire de forme et languette de tirage discrète à l’arrière.',
    descriptionAr: 'بوت تشيلسي مقصوص من قطعة جلد واحدة دون درزات إضافية. مطاط مرن متين يحتفظ بمرونته مع شريط خلفي متين لسهولة الارتداء والخلع.',
    specs: {
      leatherType: '[PLACEHOLDER : Cuir veau pleine fleur foulonné 1.6mm]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Montage Goodyear storm welt étanche]',
      lining: '[PLACEHOLDER : Doublure veau thermorégulatrice]',
      sole: '[PLACEHOLDER : Semelle commando profilée cuir et gomme]',
      lastWidth: '[PLACEHOLDER : Forme Baroudeur Urbain - Largeur E]',
      finish: '[PLACEHOLDER : Traitement ciré déperlant naturel]'
    },
    careGuideFr: [
      'Laisser sécher naturellement loin de tout radiateur ou source de chaleur directe.',
      'Brosser la poussière après chaque sortie extérieure.'
    ],
    careGuideAr: [
      'ترك الحذاء يجف بشكل طبيعي بعيداً عن مصادر الحرارة المباشرة أو أشعة الشمس.',
      'تنظيف الغبار والأتربة بالفرشاة بعد كل استخدام خارجي.'
    ],
    shippingAdviceFr: 'Livraison express avec remise en mains propres contre signature.',
    shippingAdviceAr: 'توصيل سريع مع تسليم مباشر واستلام يدوي.',
    reviews: [
      {
        id: 'rev-05',
        author: 'Yassine M.',
        city: 'Fès (Atlas)',
        date: '08 Octobre 2026',
        rating: 5,
        title: 'Robuste mais très élégante sous un pantalon',
        content: 'La cheville est bien maintenue sans serrer. La qualité du cuir saute aux yeux dès l’ouverture du coffret.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-05',
    slug: 'le-president-oxford-oxblood-profond',
    modelName: 'Le Président',
    shoeTypeFr: 'Richelieu Wholecut (une seule pièce de cuir)',
    shoeTypeAr: 'أوكسفورد هولكات قطعة واحدة من أفخر الجلود',
    style: 'oxford',
    occasion: 'evening',
    colorNameFr: 'Oxblood Profond',
    colorNameAr: 'عنابي داكن ملكي',
    colorHex: '#5B1F26',
    priceMAD: 2250,
    isBestSeller: true,
    width: 'standard',
    images: createGallery('Le Président', 'Oxblood Profond', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'low_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'in_stock' },
      { eu: 43, cm: 27.3, status: 'low_stock' },
      { eu: 44, cm: 28.0, status: 'in_stock' },
      { eu: 45, cm: 28.7, status: 'made_to_order' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'La forme wholecut est sans coutures sur les flancs : elle épouse le pied comme un gant. Prenez votre pointure exacte.',
    betweenSizesAdviceAr: 'تصميم القطعة الواحدة يغلف القدم بنعومة دون أي درزات جانبية. نوصي بمقاسك المعتاد الدقيق.',
    descriptionFr: 'Le comble du raffinement bottier : façonné à partir d’une seule pièce de peau sélectionnée sans le moindre défaut. Ligne pure, cambrure sculptée et patine oxblood qui révèle ses reflets rubis sous la lumière tamisée.',
    descriptionAr: 'قمة الحرفية في صناعة الأحذية: مصنوع من قطعة واحدة مختارة بعناية فائقة وخالية من أي عيوب. خطوط انسيابية ولون عنابي ملكي يعكس بريقاً ساحراً تحت الإضاءة.',
    specs: {
      leatherType: '[PLACEHOLDER : Box-Calf de premier choix sélection manuelle]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Cousu Goodyear sous gravure fermée]',
      lining: '[PLACEHOLDER : Doublure veau souple pleine fleur]',
      sole: '[PLACEHOLDER : Semelle cuir cousu main sous gravure + sous-bout laiton]',
      lastWidth: '[PLACEHOLDER : Forme Cérémonie - Largeur D]',
      finish: '[PLACEHOLDER : Patine artisanale fondue bordeaux et noir]'
    },
    careGuideFr: [
      'Glaçage du bout dur à l’eau minérale et cire pâte dure.',
      'Crémage régulier au coloris bordeaux pour nourrir le cœur de peau.'
    ],
    careGuideAr: [
      'تلميع زجاجي للرأس الأمامي بالماء النقي وشمع تلميع صلب.',
      'تغذية دورية بكريم عنابي لتغذية أنسجة الجلد من الداخل.'
    ],
    shippingAdviceFr: 'Emballage coffret de prestige avec certificat d’authenticité et numéro de série d’atelier.',
    shippingAdviceAr: 'يصل في صندوق فاخر مع شهادة الجودة ورقم الإصدار الخاص من ورشة الصنع.',
    reviews: [
      {
        id: 'rev-06',
        author: 'Amine K.',
        city: 'Casablanca (Bouskoura)',
        date: '21 Septembre 2026',
        rating: 5,
        title: 'Porté pour mon mariage : complimenté par tous',
        content: 'Une allure exceptionnelle. La nuance oxblood est discrète en journée et somptueuse en soirée. Très confortable pour rester debout des heures.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-06',
    slug: 'l-ambassadeur-derby-noir-brillant',
    modelName: 'L’Ambassadeur',
    shoeTypeFr: 'Derby demi-chasse à plastron renforcé',
    shoeTypeAr: 'حذاء ديربي رسمي مدعم برأس قوي',
    style: 'derby',
    occasion: 'work',
    colorNameFr: 'Noir Brillant',
    colorNameAr: 'أسود لامع أنيق',
    colorHex: '#141414',
    priceMAD: 1900,
    isBestSeller: true,
    width: 'wide',
    images: createGallery('L’Ambassadeur', 'Noir Brillant', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'in_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'in_stock' },
      { eu: 43, cm: 27.3, status: 'in_stock' },
      { eu: 44, cm: 28.0, status: 'in_stock' },
      { eu: 45, cm: 28.7, status: 'low_stock' },
      { eu: 46, cm: 29.3, status: 'low_stock' },
    ],
    betweenSizesAdviceFr: 'Monté sur notre forme généreuse (largeur F). Recommandé pour les pieds larges et les cous-de-pied développés.',
    betweenSizesAdviceAr: 'مصمم على قالبنا العريض (عرض F). مناسب خصيصاً لأصحاب الأقدام الممتلئة وعالية المشط.',
    descriptionFr: 'Conçu pour le diplomate et le voyageur d’affaires qui exige une résistance à toute épreuve sans sacrifier l’élégance. Trépointe saillante et semelle double épaisseur assurant isolation et longévité.',
    descriptionAr: 'صُمم لرجال الأعمال كثيري التنقل ممن ينشدون قوة التحمل والمتانة العالية دون التفريط بالأناقة. نعل مزدوج العزل يضمن الراحة والاستدامة لسنوات.',
    specs: {
      leatherType: '[PLACEHOLDER : Cuir veau grainé pleine fleur robuste]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Montage Goodyear double trépointe]',
      lining: '[PLACEHOLDER : Doublure veau souple pleine épaisseur]',
      sole: '[PLACEHOLDER : Double semelle cuir avec patin gomme Dainite]',
      lastWidth: '[PLACEHOLDER : Forme Confort - Largeur Généreuse F]',
      finish: '[PLACEHOLDER : Nourri aux cires d’imprégnation hydrofuges]'
    },
    careGuideFr: [
      'Nettoyer au savon régénérant doux en cas de pluie ou de boue.',
      'Brossage vigoureux avec brosse palot.'
    ],
    careGuideAr: [
      'تنظيف بصابون الجلود المعتدل عند التعرض للمطر.',
      'فرك السطح بفرشاة التلميع لاستعادة اللمعان الطبيعي.'
    ],
    shippingAdviceFr: 'Livraison express partout au Maroc avec inspection préalable.',
    shippingAdviceAr: 'توصيل فوري مع إمكانية الفحص والتأكد من الجودة قبل الدفع.',
    reviews: [
      {
        id: 'rev-07',
        author: 'Reda C.',
        city: 'Kénitra',
        date: '11 Octobre 2026',
        rating: 5,
        title: 'Enfin un modèle adapté aux pieds larges',
        content: 'Trouver une belle chaussure qui ne me compresse pas les orteils était devenu mission impossible. Ce modèle largeur F est parfait.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-07',
    slug: 'le-tanger-loafer-suede-tabac',
    modelName: 'Le Tanger',
    shoeTypeFr: 'Mocassin à glands en veau velours',
    shoeTypeAr: 'موكاسين شرابات من جلد السويد الناعم',
    style: 'loafer',
    occasion: 'evening',
    colorNameFr: 'Suède Tabac',
    colorNameAr: 'سويد تبغي دافئ',
    colorHex: '#845738',
    priceMAD: 1800,
    isBestSeller: false,
    width: 'standard',
    images: createGallery('Le Tanger', 'Suède Tabac', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'in_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'in_stock' },
      { eu: 43, cm: 27.3, status: 'low_stock' },
      { eu: 44, cm: 28.0, status: 'low_stock' },
      { eu: 45, cm: 28.7, status: 'made_to_order' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'Le veau velours s’assouplit naturellement après 3 à 4 ports. Choisissez votre pointure de ville habituelle.',
    betweenSizesAdviceAr: 'يتكيف جلد السويد مع شكل القدم بعد عدة مرات من الارتداء. اختر مقاسك المعتاد.',
    descriptionFr: 'Tassel loafer d’allure cosmopolite. Le veau velours à poil ras offre un toucher soyeux et résistant, rehaussé de deux glands tressés à la main et d’un lacet passant autour du quartier.',
    descriptionAr: 'موكاسين بشرابات أنيق مستوحى من طراز الشمال الهادئ. جلد سويد مخملي ناعم الملمس مع شرابات مضفورة بعناية تمنح الإطلالة لمسة راقية متفردة.',
    specs: {
      leatherType: '[PLACEHOLDER : Veau velours suédé premium hydrofuge]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Cousu Blake ultraflex]',
      lining: '[PLACEHOLDER : Doublure veau souple non teinte]',
      sole: '[PLACEHOLDER : Semelle cuir simple avec insert gomme invisible]',
      lastWidth: '[PLACEHOLDER : Forme Détente - Largeur D]',
      finish: '[PLACEHOLDER : Traitement protecteur déperlant en atelier]'
    },
    careGuideFr: [
      'Brosser exclusivement avec une brosse en crêpe naturel ou laiton doux.',
      'Imperméabiliser régulièrement pour préserver de la pluie et des taches.'
    ],
    careGuideAr: [
      'استخدام فرشاة كريب طبيعية لتنظيف السطح المخملي.',
      'رش رذاذ العزل المقاوم للماء بانتظام للحماية من البقع.'
    ],
    shippingAdviceFr: 'Livraison soignée avec brosse de nettoyage douce offerte.',
    shippingAdviceAr: 'توصيل مجاني مع فرشاة تنظيف ناعمة مخصصة لجلد السويد.',
    reviews: [
      {
        id: 'rev-08',
        author: 'Hamza N.',
        city: 'Tanger (Centre)',
        date: '04 Octobre 2026',
        rating: 5,
        title: 'Texture veloutée incroyable',
        content: 'Très léger et agréable à porter sans chaussettes ou avec des chaussettes invisibles en fil d’Écosse. Finitions au rendez-vous.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-08',
    slug: 'le-festif-oxford-noir-verni',
    modelName: 'Le Festif',
    shoeTypeFr: 'Richelieu Oxford habillé en cuir verni',
    shoeTypeAr: 'أوكسفورد رسمي بجلد لامع لحفلات الزفاف والسهرة',
    style: 'oxford',
    occasion: 'evening',
    colorNameFr: 'Noir Verni Miroir',
    colorNameAr: 'أسود برنيز عاكس',
    colorHex: '#0B0B0C',
    priceMAD: 2100,
    isBestSeller: false,
    width: 'standard',
    images: createGallery('Le Festif', 'Noir Verni Miroir', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'low_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'in_stock' },
      { eu: 43, cm: 27.3, status: 'in_stock' },
      { eu: 44, cm: 28.0, status: 'low_stock' },
      { eu: 45, cm: 28.7, status: 'made_to_order' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'Le cuir verni n’offre pas d’élasticité : choisissez impérativement la pointure supérieure si vous êtes entre deux tailles.',
    betweenSizesAdviceAr: 'الجلد اللامع قليل المرونة مقارنة بالجلد المطفي، لذا نوصي باختيار المقاس الأكبر في حال الشك.',
    descriptionFr: 'Destiné exclusivement aux smokings, tenues de gala et soirées habillées. Reflet miroir impeccable, œillets borgnes invisibles et lacets plats en soie.',
    descriptionAr: 'مخصص لبدلات السهرة والتوكسيدو والمناسبات الملكية. لمعان عاكس نقي كالمرآة، ثقوب أربطة مخفية وأربطة حريرية فاخرة.',
    specs: {
      leatherType: '[PLACEHOLDER : Cuir veau verni haute brillance sans craquelures]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Montage cousu Blake fin]',
      lining: '[PLACEHOLDER : Doublure veau souple intégrale]',
      sole: '[PLACEHOLDER : Semelle cuir noir satiné avec cambrure fine]',
      lastWidth: '[PLACEHOLDER : Forme Smoking - Largeur D]',
      finish: '[PLACEHOLDER : Laque miroir protectrice hydrofuge]'
    },
    careGuideFr: [
      'Nettoyer simplement avec un chiffon humide en microfibre.',
      'Ne jamais utiliser de brosses dures ni de cires traditionnelles abrasives.'
    ],
    careGuideAr: [
      'مسح الحذاء بقطعة قماش ناعمة مبللة بقليل من الماء.',
      'تجنب استعمال الفرشاة الخشنة أو كريمات التلميع العادية.'
    ],
    shippingAdviceFr: 'Livré dans sa housse de satin protectrice.',
    shippingAdviceAr: 'يصل في غلاف حريري ساتان واقٍ لمنع أي خدوش.',
    reviews: [
      {
        id: 'rev-09',
        author: 'Tariq F.',
        city: 'Rabat',
        date: '25 Septembre 2026',
        rating: 5,
        title: 'Sublime avec mon smoking noir',
        content: 'La brillance est spectaculaire sans faire clinquant ou plastique. On sent la qualité du cuir sous la couche vernie.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-09',
    slug: 'le-nomade-derby-chocolat-mat',
    modelName: 'Le Nomade',
    shoeTypeFr: 'Derby bout droit en cuir suédé chocolat',
    shoeTypeAr: 'ديربي أنيق من جلد الشامواه بلون الشوكولاتة الداكنة',
    style: 'derby',
    occasion: 'work',
    colorNameFr: 'Chocolat Mat',
    colorNameAr: 'شوكولاتة غير لامع',
    colorHex: '#3D281E',
    priceMAD: 1850,
    isBestSeller: false,
    width: 'standard',
    images: createGallery('Le Nomade', 'Chocolat Mat', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'in_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'in_stock' },
      { eu: 43, cm: 27.3, status: 'low_stock' },
      { eu: 44, cm: 28.0, status: 'in_stock' },
      { eu: 45, cm: 28.7, status: 'low_stock' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'Coupe standard très équilibrée. Prenez votre pointure habituelle de souliers habillés.',
    betweenSizesAdviceAr: 'مقاس متوازن تماماً. اختر مقاسك الاعتيادي.',
    descriptionFr: 'Allie la décontraction du cuir velours brun dense à la rigueur d’un bout droit sellier. Parfait pour les journées de travail décontractées et les week-ends soignés.',
    descriptionAr: 'يجمع بين هدوء السويد البني وعراقة الحياكة المتقنة. الخيار المثالي لأيام العمل الأنيقة وعطلات نهاية الأسبوع الراقية.',
    specs: {
      leatherType: '[PLACEHOLDER : Veau velours déperlant résistant]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Montage cousu Blake]',
      lining: '[PLACEHOLDER : Doublure veau naturelle]',
      sole: '[PLACEHOLDER : Semelle cuir avec patin injecté]',
      lastWidth: '[PLACEHOLDER : Forme Classique - Largeur D]',
      finish: '[PLACEHOLDER : Traitement hydrofuge teinté dans la masse]'
    },
    careGuideFr: [
      'Brossage à la brosse laiton souple pour redresser les fibres.',
      'Imperméabilisant tous les 2 mois.'
    ],
    careGuideAr: [
      'تنظيف بفرشاة معدنية ناعمة لتجديد ألياف الشامواه.',
      'تطبيق واقي الرطوبة كل شهرين.'
    ],
    shippingAdviceFr: 'Livraison gratuite dans les 16 grandes métropoles marocaines.',
    shippingAdviceAr: 'توصيل مجاني لجميع الحواضر والمدن المغربية الكبرى.',
    reviews: [
      {
        id: 'rev-10',
        author: 'Samir E.',
        city: 'Agadir (Founty)',
        date: '17 Octobre 2026',
        rating: 5,
        title: 'Élégance discrète et polyvalente',
        content: 'Très agréable au pied. La semelle amortit bien les chocs sur le bitume sans être trop massive.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-10',
    slug: 'le-chancelier-richelieu-bordeaux-patine',
    modelName: 'Le Chancelier',
    shoeTypeFr: 'Richelieu Oxford à plastron lisse',
    shoeTypeAr: 'أوكسفورد ريشيليو ناعم بلون بوردو خمري',
    style: 'oxford',
    occasion: 'wedding',
    colorNameFr: 'Bordeaux Patiné',
    colorNameAr: 'بوردو خمري معتق',
    colorHex: '#4E1D24',
    priceMAD: 2050,
    isBestSeller: false,
    width: 'standard',
    images: createGallery('Le Chancelier', 'Bordeaux Patiné', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'low_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'in_stock' },
      { eu: 43, cm: 27.3, status: 'in_stock' },
      { eu: 44, cm: 28.0, status: 'low_stock' },
      { eu: 45, cm: 28.7, status: 'low_stock' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'Coupe cintrée au cambrion. Si vous avez un pied fort, optez pour la pointure supérieure.',
    betweenSizesAdviceAr: 'تصميم مشدود عند قوس القدم. إذا كانت قدمك عريضة، اختر المقاس الأكبر.',
    descriptionFr: 'La quintessence du style formel nuancé. La teinte bordeaux patinée apporte une distinction chaleureuse qui se marie à merveille avec les costumes gris anthracite et bleu marine.',
    descriptionAr: 'خيار النخبة لمن يبحث عن الفخامة غير التقليدية. يمنح اللون الخمري المعتق تناغماً ساحراً مع البدل الرمادية والزرقاء الداكنة.',
    specs: {
      leatherType: '[PLACEHOLDER : Cuir veau pleine fleur patiné main]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Cousu Goodyear traditionnel]',
      lining: '[PLACEHOLDER : Doublure veau souple respirante]',
      sole: '[PLACEHOLDER : Semelle cuir tannage végétal extra-dur]',
      lastWidth: '[PLACEHOLDER : Forme Ciselée - Largeur D]',
      finish: '[PLACEHOLDER : Patine artisanale fondue bordeaux et noir]'
    },
    careGuideFr: [
      'Nourrir avec une crème bordeaux ou neutre de haute qualité.',
      'Lustrage régulier au gant de laine.'
    ],
    careGuideAr: [
      'تغذية الجلد بكريم بوردو عالي الجودة أو كريم طبيعي شفاف.',
      'تلميع دوري بقفاز من الصوف الخالص.'
    ],
    shippingAdviceFr: 'Livraison express avec confirmation téléphonique systématique.',
    shippingAdviceAr: 'توصيل سريع مع اتصال هاتفي للتأكيد المسبق قبل الشحن.',
    reviews: [
      {
        id: 'rev-11',
        author: 'Nabil L.',
        city: 'Meknès',
        date: '10 Octobre 2026',
        rating: 5,
        title: 'Couleur exceptionnelle sous la lumière du jour',
        content: 'Les reflets bordeaux sont subtils et très nobles. La confection est impeccable et la boîte est très soignée.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-11',
    slug: 'le-sahara-bottine-jodhpur-havane-fume',
    modelName: 'Le Sahara',
    shoeTypeFr: 'Bottine Jodhpur à bride et boucle dorée',
    shoeTypeAr: 'بوت جودبور رسمي بإبزيم نحاسي كلاسيكي',
    style: 'boot',
    occasion: 'evening',
    colorNameFr: 'Havane Fumé',
    colorNameAr: 'هافانا مدخن',
    colorHex: '#4A2F20',
    priceMAD: 2350,
    isBestSeller: false,
    width: 'standard',
    images: createGallery('Le Sahara', 'Havane Fumé', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'low_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'in_stock' },
      { eu: 43, cm: 27.3, status: 'low_stock' },
      { eu: 44, cm: 28.0, status: 'in_stock' },
      { eu: 45, cm: 28.7, status: 'low_stock' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'La bride réglable permet d’ajuster le maintien de la cheville à votre convenance. Prenez votre pointure habituelle.',
    betweenSizesAdviceAr: 'يتيح الحزام القابل للتعديل ضبط الإحكام حول الكاحل بدقة. اختر مقاسك المعتاد.',
    descriptionFr: 'Inspirée de la tradition équestre des gentlemen officiers. Bride traversante fermée par une boucle en laiton massif vieilli et tige élancée qui protège la cheville avec prestance.',
    descriptionAr: 'مستوحى من تقاليد الفروسية الملكية العريقة. حزام جلدي متقاطع ينتهي بإبزيم نحاسي عتيق متين يعانق الكاحل بوقار وهيبة.',
    specs: {
      leatherType: '[PLACEHOLDER : Cuir veau pleine fleur gras 1.6mm]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Montage Goodyear étanche]',
      lining: '[PLACEHOLDER : Doublure veau naturelle anti-échauffement]',
      sole: '[PLACEHOLDER : Semelle cuir épaisse avec patin protecteur]',
      lastWidth: '[PLACEHOLDER : Forme Cavalerie - Largeur E]',
      finish: '[PLACEHOLDER : Patine havane fumée aux reflets ambrés]'
    },
    careGuideFr: [
      'Nettoyer la poussière sur la boucle en laiton avec un chiffon sec.',
      'Hydrater le cuir avec une crème nutritive tous les mois.'
    ],
    careGuideAr: [
      'تنظيف الإبزيم النحاسي بقطعة قماش جافة لمنع تراكم الأتربة.',
      'ترطيب الجلد بانتظام للحفاظ على ليونته وطراوته.'
    ],
    shippingAdviceFr: 'Livraison soignée avec calage individuel des boucles pour éviter tout frottement.',
    shippingAdviceAr: 'تغليف دقيق مع حماية خاصة للإبزيم النحاسي لمنع أي احتكاك أثناء النقل.',
    reviews: [
      {
        id: 'rev-12',
        author: 'Othmane B.',
        city: 'Oujda',
        date: '12 Octobre 2026',
        rating: 5,
        title: 'Une présence incroyable',
        content: 'Le cuir est épais et sent le vrai cuir noble. La boucle est en métal massif et solide. Reçu en 48h à Oujda comme convenu.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  },
  {
    id: 'prod-12',
    slug: 'le-marocain-mocassin-noce-caramel-chaud',
    modelName: 'Le Noceur',
    shoeTypeFr: 'Mocassin habillé à boucle mors de cheval',
    shoeTypeAr: 'موكاسين رسمي بإبزيم لجام الحصان النحاسي',
    style: 'loafer',
    occasion: 'wedding',
    colorNameFr: 'Caramel Chaud',
    colorNameAr: 'كراميل دافئ ومشرق',
    colorHex: '#9E653C',
    priceMAD: 1850,
    isBestSeller: false,
    width: 'standard',
    images: createGallery('Le Noceur', 'Caramel Chaud', '/images/hero_oxford_leather_1792953837188.jpg'),
    availableSizes: [
      { eu: 39, cm: 24.8, status: 'in_stock' },
      { eu: 40, cm: 25.4, status: 'in_stock' },
      { eu: 41, cm: 26.0, status: 'in_stock' },
      { eu: 42, cm: 26.7, status: 'low_stock' },
      { eu: 43, cm: 27.3, status: 'in_stock' },
      { eu: 44, cm: 28.0, status: 'in_stock' },
      { eu: 45, cm: 28.7, status: 'low_stock' },
      { eu: 46, cm: 29.3, status: 'made_to_order' },
    ],
    betweenSizesAdviceFr: 'Maintien souple et accueillant. Prenez votre pointure habituelle de mocassin.',
    betweenSizesAdviceAr: 'قالب مرن ومريح للغاية. اختر مقاسك المعتاد في أحذية الموكاسين.',
    descriptionFr: 'Le mocassin festif par excellence : orné d’un mors de cheval en laiton brossé. Le cuir caramel chaud capte la lumière des festivités marocaines et illumine une djellaba en sousdi de soie ou un costume estival en lin.',
    descriptionAr: 'موكاسين المناسبات الاحتفالية بامتياز: مزين بحلية لجام حصان من النحاس المصقول. لونه الكراميلي المشرق يتماشى بانسجام تام مع الجلباب المغربي الفاخر أو البدلات الصيفية.',
    specs: {
      leatherType: '[PLACEHOLDER : Cuir veau pleine fleur souple teinté dans la masse]',
      leatherOrigin: '[PLACEHOLDER : Tannerie européenne certifiée]',
      construction: '[PLACEHOLDER : Montage cousu Blake souple]',
      lining: '[PLACEHOLDER : Doublure veau intégrale extra-douce]',
      sole: '[PLACEHOLDER : Semelle cuir naturelle souple]',
      lastWidth: '[PLACEHOLDER : Forme Cérémonie Estivale - Largeur D]',
      finish: '[PLACEHOLDER : Cirage naturel lustré au chiffon de laine]'
    },
    careGuideFr: [
      'Nettoyage au chiffon doux après chaque cérémonie.',
      'Garder sous embauchoir en bois pour maintenir la tension du plateau.'
    ],
    careGuideAr: [
      'مسح الحذاء بقطعة قماش ناعمة بعد كل مناسبة.',
      'الحفاظ عليه دائماً داخل القالب الخشبي لحماية شكل الجزء الأمامي.'
    ],
    shippingAdviceFr: 'Expédition sous 24h avec essayage à domicile.',
    shippingAdviceAr: 'شحن فوري خلال 24 ساعة مع تجربة المقاس بالمنزل.',
    reviews: [
      {
        id: 'rev-13',
        author: 'Fouad D.',
        city: 'Casablanca (Gauthier)',
        date: '20 Octobre 2026',
        rating: 5,
        title: 'Parfait avec une djellaba comme avec un costume',
        content: 'Très élégant et très confortable. Le cuir respire bien et la boucle dorée brossée a un très joli rendu sans être tapageuse.',
        verifiedBuyer: true,
        isIncentivized: false,
        sampleNotice: 'Sample content — Données de démonstration'
      }
    ],
    complementaryAddons: COMPLEMENTARY_ADDONS
  }
];
