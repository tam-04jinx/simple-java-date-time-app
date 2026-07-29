const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");
const timezoneElement = document.querySelector("#timezone");
const timezoneListElement = document.querySelector("#timezone-list");
const selectedTimeElement = document.querySelector("#selected-time");
const citySelectElement = document.querySelector("#city-select");
const languageSelectElement = document.querySelector("#language-select");
const locationSelectElement = document.querySelector("#location-select");
const cityCountElement = document.querySelector("#city-count");
const timeSpreadElement = document.querySelector("#time-spread");
const meetingWindowElement = document.querySelector("#meeting-window");
const favoriteListElement = document.querySelector("#favorite-list");
const shareButton = document.querySelector("#share-button");
const shareStatusElement = document.querySelector("#share-status");
const daylightCanvasElement = document.querySelector("#daylight-canvas");
const sunlightStatusElement = document.querySelector("#sunlight-status");
const themeButtons = document.querySelectorAll(".theme-button");
const modeButtons = document.querySelectorAll(".mode-button");
const refreshButton = document.querySelector("#refresh-button");
const analogClockCaptionElement = document.querySelector("#analog-clock-caption");
const analogHourHandElement = document.querySelector("#analog-hour-hand");
const analogMinuteHandElement = document.querySelector("#analog-minute-hand");
const analogSecondHandElement = document.querySelector("#analog-second-hand");

const cityCoordinates = {
    Austin: [30.2672, -97.7431],
    "New York": [40.7128, -74.0060],
    "Los Angeles": [34.0522, -118.2437],
    "Mexico City": [19.4326, -99.1332],
    "Sao Paulo": [-23.5505, -46.6333],
    London: [51.5074, -0.1278],
    Paris: [48.8566, 2.3522],
    Cairo: [30.0444, 31.2357],
    Dubai: [25.2048, 55.2708],
    Hyderabad: [17.3850, 78.4867],
    Singapore: [1.3521, 103.8198],
    "Hong Kong": [22.3193, 114.1694],
    Tokyo: [35.6762, 139.6503],
    Seoul: [37.5665, 126.9780],
    Sydney: [-33.8688, 151.2093],
    Auckland: [-36.8485, 174.7633]
};

const languageLabels = {
    en: { en: "English", es: "Spanish", fr: "French", hi: "Hindi", ja: "Japanese" },
    es: { en: "Inglés", es: "Español", fr: "Francés", hi: "Hindi", ja: "Japonés" },
    fr: { en: "Anglais", es: "Espagnol", fr: "Français", hi: "Hindi", ja: "Japonais" },
    hi: { en: "अंग्रेज़ी", es: "स्पेनिश", fr: "फ़्रेंच", hi: "हिन्दी", ja: "जापानी" },
    ja: { en: "英語", es: "スペイン語", fr: "フランス語", hi: "ヒンディー語", ja: "日本語" }
};

const localizedCityNames = {
    es: {
        Austin: "Austin",
        "New York": "Nueva York",
        "Los Angeles": "Los Ángeles",
        "Mexico City": "Ciudad de México",
        "Sao Paulo": "São Paulo",
        London: "Londres",
        Paris: "París",
        Cairo: "El Cairo",
        Dubai: "Dubái",
        Hyderabad: "Hyderabad",
        Singapore: "Singapur",
        "Hong Kong": "Hong Kong",
        Tokyo: "Tokio",
        Seoul: "Seúl",
        Sydney: "Sídney",
        Auckland: "Auckland"
    },
    fr: {
        Austin: "Austin",
        "New York": "New York",
        "Los Angeles": "Los Angeles",
        "Mexico City": "Mexico",
        "Sao Paulo": "São Paulo",
        London: "Londres",
        Paris: "Paris",
        Cairo: "Le Caire",
        Dubai: "Dubaï",
        Hyderabad: "Hyderabad",
        Singapore: "Singapour",
        "Hong Kong": "Hong Kong",
        Tokyo: "Tokyo",
        Seoul: "Séoul",
        Sydney: "Sydney",
        Auckland: "Auckland"
    },
    hi: {
        Austin: "ऑस्टिन",
        "New York": "न्यूयॉर्क",
        "Los Angeles": "लॉस एंजेलिस",
        "Mexico City": "मेक्सिको सिटी",
        "Sao Paulo": "साओ पाउलो",
        London: "लंदन",
        Paris: "पेरिस",
        Cairo: "काहिरा",
        Dubai: "दुबई",
        Hyderabad: "हैदराबाद",
        Singapore: "सिंगापुर",
        "Hong Kong": "हांगकांग",
        Tokyo: "टोक्यो",
        Seoul: "सियोल",
        Sydney: "सिडनी",
        Auckland: "ऑकलैंड"
    },
    ja: {
        Austin: "オースティン",
        "New York": "ニューヨーク",
        "Los Angeles": "ロサンゼルス",
        "Mexico City": "メキシコシティ",
        "Sao Paulo": "サンパウロ",
        London: "ロンドン",
        Paris: "パリ",
        Cairo: "カイロ",
        Dubai: "ドバイ",
        Hyderabad: "ハイデラバード",
        Singapore: "シンガポール",
        "Hong Kong": "香港",
        Tokyo: "東京",
        Seoul: "ソウル",
        Sydney: "シドニー",
        Auckland: "オークランド"
    }
};

const translations = {
    en: {
        heroEyebrow: "Live global timeboard",
        appTitle: "World Clock",
        themeAria: "Color theme",
        themeAurora: "Aurora",
        themeSunset: "Sunset",
        themeMidnight: "Midnight",
        modeAria: "Display mode",
        modeDark: "Dark",
        modeLight: "Light",
        serverDate: "Server Date",
        serverTime: "Server Time",
        serverTimezone: "Server timezone:",
        analogClock: "Analog Clock",
        focusedLocationClock: "Focused Location Clock",
        loading: "Loading...",
        refreshesEverySecond: "Refreshes every second",
        favoriteCities: "Favorite cities",
        copyShareLink: "Copy Share Link",
        autosaveStatus: "Selections save automatically",
        languageLabel: "Language",
        locationLabel: "Focus location",
        cityPickerLabel: "Choose cities to show on the map",
        cityHelp: "Hold Cmd on Mac or Ctrl on Windows to select multiple cities. Click a card or map pin to spotlight a city.",
        mapHeading: "Selected cities on the map",
        mapAria: "Interactive world map",
        legendAria: "Day and night legend",
        calculatingSunlight: "Calculating sunlight",
        day: "Day",
        twilight: "Twilight",
        night: "Night",
        mapShadow: "Map shadow",
        selectedTimeZones: "Selected Time Zones",
        refreshNow: "Refresh Now",
        mapOffline: "Map offline",
        cardsStillLive: "City cards still update live.",
        sunlightStatus: "Curved day/night line · sun over {latitude} {longitude}",
        unavailable: "Unavailable",
        backendCheck: "Check the Java backend",
        unableTimeZones: "Unable to load time zones.",
        unableCityTimes: "Unable to load city times.",
        selectCityPrompt: "Select a city on the map to see the local time.",
        selectFromDropdown: "Select cities from the dropdown to show them on the map.",
        favoriteEmpty: "Mark cards as favorites to pin them here.",
        noCitiesSelected: "No cities selected.",
        citySingular: "city",
        cityPlural: "cities",
        selected: "selected",
        waitingData: "Waiting for city data",
        meetingPending: "Meeting window pending",
        addCitiesSpread: "Add cities to compare time spread",
        addCitiesMeeting: "Add cities for meeting insight",
        hourSpread: "{spread} hour spread across selected cities",
        allWorkHours: "All selected cities are in work hours",
        someWorkHours: "{count}/{total} selected cities are in work hours",
        workHours: "Work hours",
        afterHours: "After hours",
        workOk: "Work OK",
        removeFavorite: "Remove {city} favorite",
        addFavorite: "Add {city} favorite",
        shareCopied: "Share link copied"
    },
    es: {
        heroEyebrow: "Panel horario global en vivo",
        appTitle: "Reloj Mundial",
        themeAria: "Tema de color",
        themeAurora: "Aurora",
        themeSunset: "Atardecer",
        themeMidnight: "Medianoche",
        modeAria: "Modo de pantalla",
        modeDark: "Oscuro",
        modeLight: "Claro",
        serverDate: "Fecha del servidor",
        serverTime: "Hora del servidor",
        serverTimezone: "Zona horaria del servidor:",
        analogClock: "Reloj analogico",
        focusedLocationClock: "Reloj de ubicacion principal",
        loading: "Cargando...",
        refreshesEverySecond: "Se actualiza cada segundo",
        favoriteCities: "Ciudades favoritas",
        copyShareLink: "Copiar enlace",
        autosaveStatus: "Las selecciones se guardan automaticamente",
        languageLabel: "Idioma",
        locationLabel: "Ubicacion principal",
        cityPickerLabel: "Elige ciudades para mostrar en el mapa",
        cityHelp: "Mantén Cmd en Mac o Ctrl en Windows para seleccionar varias ciudades. Haz clic en una tarjeta o pin para destacar una ciudad.",
        mapHeading: "Ciudades seleccionadas en el mapa",
        mapAria: "Mapa mundial interactivo",
        legendAria: "Leyenda de dia y noche",
        calculatingSunlight: "Calculando luz solar",
        day: "Dia",
        twilight: "Crepusculo",
        night: "Noche",
        mapShadow: "Sombra del mapa",
        selectedTimeZones: "Zonas horarias seleccionadas",
        refreshNow: "Actualizar ahora",
        mapOffline: "Mapa sin conexion",
        cardsStillLive: "Las tarjetas de ciudad siguen actualizandose.",
        sunlightStatus: "Linea curva de dia/noche · sol sobre {latitude} {longitude}",
        unavailable: "No disponible",
        backendCheck: "Revisa el backend Java",
        unableTimeZones: "No se pudieron cargar las zonas horarias.",
        unableCityTimes: "No se pudieron cargar las horas de las ciudades.",
        selectCityPrompt: "Selecciona una ciudad en el mapa para ver la hora local.",
        selectFromDropdown: "Selecciona ciudades en el desplegable para mostrarlas en el mapa.",
        favoriteEmpty: "Marca tarjetas como favoritas para fijarlas aqui.",
        noCitiesSelected: "No hay ciudades seleccionadas.",
        citySingular: "ciudad",
        cityPlural: "ciudades",
        selected: "seleccionadas",
        waitingData: "Esperando datos de ciudad",
        meetingPending: "Ventana de reunion pendiente",
        addCitiesSpread: "Agrega ciudades para comparar la diferencia horaria",
        addCitiesMeeting: "Agrega ciudades para ver reuniones",
        hourSpread: "Diferencia de {spread} horas entre ciudades seleccionadas",
        allWorkHours: "Todas las ciudades seleccionadas estan en horario laboral",
        someWorkHours: "{count}/{total} ciudades seleccionadas estan en horario laboral",
        workHours: "Horario laboral",
        afterHours: "Fuera de horario",
        workOk: "Laboral OK",
        removeFavorite: "Quitar {city} de favoritos",
        addFavorite: "Agregar {city} a favoritos",
        shareCopied: "Enlace copiado"
    },
    fr: {
        heroEyebrow: "Tableau horaire mondial en direct",
        appTitle: "Horloge Mondiale",
        themeAria: "Theme couleur",
        themeAurora: "Aurore",
        themeSunset: "Coucher",
        themeMidnight: "Minuit",
        modeAria: "Mode d'affichage",
        modeDark: "Sombre",
        modeLight: "Clair",
        serverDate: "Date serveur",
        serverTime: "Heure serveur",
        serverTimezone: "Fuseau serveur :",
        analogClock: "Horloge analogique",
        focusedLocationClock: "Horloge du lieu cible",
        loading: "Chargement...",
        refreshesEverySecond: "Actualisation chaque seconde",
        favoriteCities: "Villes favorites",
        copyShareLink: "Copier le lien",
        autosaveStatus: "Selections enregistrees automatiquement",
        languageLabel: "Langue",
        locationLabel: "Lieu cible",
        cityPickerLabel: "Choisir les villes a afficher sur la carte",
        cityHelp: "Maintenez Cmd sur Mac ou Ctrl sur Windows pour choisir plusieurs villes. Cliquez une carte ou une epingle pour cibler une ville.",
        mapHeading: "Villes selectionnees sur la carte",
        mapAria: "Carte mondiale interactive",
        legendAria: "Legende jour et nuit",
        calculatingSunlight: "Calcul de la lumiere solaire",
        day: "Jour",
        twilight: "Crepuscule",
        night: "Nuit",
        mapShadow: "Ombre carte",
        selectedTimeZones: "Fuseaux horaires selectionnes",
        refreshNow: "Actualiser",
        mapOffline: "Carte hors ligne",
        cardsStillLive: "Les cartes de ville restent a jour.",
        sunlightStatus: "Ligne courbe jour/nuit · soleil sur {latitude} {longitude}",
        unavailable: "Indisponible",
        backendCheck: "Verifier le backend Java",
        unableTimeZones: "Impossible de charger les fuseaux horaires.",
        unableCityTimes: "Impossible de charger les heures des villes.",
        selectCityPrompt: "Selectionnez une ville sur la carte pour voir l'heure locale.",
        selectFromDropdown: "Selectionnez des villes dans la liste pour les afficher sur la carte.",
        favoriteEmpty: "Marquez des cartes comme favorites pour les epingler ici.",
        noCitiesSelected: "Aucune ville selectionnee.",
        citySingular: "ville",
        cityPlural: "villes",
        selected: "selectionnees",
        waitingData: "En attente des donnees de ville",
        meetingPending: "Fenetre de reunion en attente",
        addCitiesSpread: "Ajoutez des villes pour comparer l'ecart horaire",
        addCitiesMeeting: "Ajoutez des villes pour l'indice de reunion",
        hourSpread: "Ecart de {spread} heures entre les villes selectionnees",
        allWorkHours: "Toutes les villes selectionnees sont en heures de travail",
        someWorkHours: "{count}/{total} villes selectionnees sont en heures de travail",
        workHours: "Heures de travail",
        afterHours: "Hors horaires",
        workOk: "Travail OK",
        removeFavorite: "Retirer {city} des favoris",
        addFavorite: "Ajouter {city} aux favoris",
        shareCopied: "Lien copie"
    },
    hi: {
        heroEyebrow: "लाइव वैश्विक समय बोर्ड",
        appTitle: "विश्व घड़ी",
        themeAria: "रंग थीम",
        themeAurora: "ऑरोरा",
        themeSunset: "सूर्यास्त",
        themeMidnight: "मिडनाइट",
        modeAria: "डिस्प्ले मोड",
        modeDark: "डार्क",
        modeLight: "लाइट",
        serverDate: "सर्वर तारीख",
        serverTime: "सर्वर समय",
        serverTimezone: "सर्वर समय क्षेत्र:",
        analogClock: "एनालॉग घड़ी",
        focusedLocationClock: "मुख्य स्थान की घड़ी",
        loading: "लोड हो रहा है...",
        refreshesEverySecond: "हर सेकंड अपडेट होता है",
        favoriteCities: "पसंदीदा शहर",
        copyShareLink: "शेयर लिंक कॉपी करें",
        autosaveStatus: "चयन अपने आप सेव होते हैं",
        languageLabel: "भाषा",
        locationLabel: "मुख्य स्थान",
        cityPickerLabel: "मैप पर दिखाने के लिए शहर चुनें",
        cityHelp: "कई शहर चुनने के लिए Mac पर Cmd या Windows पर Ctrl दबाएं। किसी शहर को हाइलाइट करने के लिए कार्ड या पिन पर क्लिक करें।",
        mapHeading: "मैप पर चुने गए शहर",
        mapAria: "इंटरैक्टिव विश्व मैप",
        legendAria: "दिन और रात की लेजेंड",
        calculatingSunlight: "सूर्य प्रकाश की गणना हो रही है",
        day: "दिन",
        twilight: "संध्या",
        night: "रात",
        mapShadow: "मैप शैडो",
        selectedTimeZones: "चुने गए समय क्षेत्र",
        refreshNow: "अभी रिफ्रेश करें",
        mapOffline: "मैप ऑफलाइन है",
        cardsStillLive: "शहर कार्ड फिर भी लाइव अपडेट होते हैं।",
        sunlightStatus: "मुड़ी दिन/रात रेखा · सूरज {latitude} {longitude} पर",
        unavailable: "उपलब्ध नहीं",
        backendCheck: "Java backend जांचें",
        unableTimeZones: "समय क्षेत्र लोड नहीं हो सके।",
        unableCityTimes: "शहरों के समय लोड नहीं हो सके।",
        selectCityPrompt: "लोकल समय देखने के लिए मैप पर शहर चुनें।",
        selectFromDropdown: "मैप पर दिखाने के लिए dropdown से शहर चुनें।",
        favoriteEmpty: "यहां पिन करने के लिए कार्ड को favorite करें।",
        noCitiesSelected: "कोई शहर चयनित नहीं।",
        citySingular: "शहर",
        cityPlural: "शहर",
        selected: "चयनित",
        waitingData: "शहर डेटा की प्रतीक्षा",
        meetingPending: "मीटिंग विंडो लंबित",
        addCitiesSpread: "समय अंतर की तुलना के लिए शहर जोड़ें",
        addCitiesMeeting: "मीटिंग संकेत के लिए शहर जोड़ें",
        hourSpread: "चुने शहरों में {spread} घंटे का अंतर",
        allWorkHours: "सभी चुने शहर work hours में हैं",
        someWorkHours: "{count}/{total} चुने शहर work hours में हैं",
        workHours: "Work hours",
        afterHours: "After hours",
        workOk: "Work OK",
        removeFavorite: "{city} favorite हटाएं",
        addFavorite: "{city} favorite जोड़ें",
        shareCopied: "शेयर लिंक कॉपी हुआ"
    },
    ja: {
        heroEyebrow: "ライブ世界タイムボード",
        appTitle: "世界時計",
        themeAria: "カラーテーマ",
        themeAurora: "オーロラ",
        themeSunset: "サンセット",
        themeMidnight: "ミッドナイト",
        modeAria: "表示モード",
        modeDark: "ダーク",
        modeLight: "ライト",
        serverDate: "サーバー日付",
        serverTime: "サーバー時刻",
        serverTimezone: "サーバータイムゾーン:",
        analogClock: "アナログ時計",
        focusedLocationClock: "フォーカス地点の時計",
        loading: "読み込み中...",
        refreshesEverySecond: "毎秒更新",
        favoriteCities: "お気に入り都市",
        copyShareLink: "共有リンクをコピー",
        autosaveStatus: "選択は自動保存されます",
        languageLabel: "言語",
        locationLabel: "フォーカス地点",
        cityPickerLabel: "地図に表示する都市を選択",
        cityHelp: "複数選択はMacではCmd、WindowsではCtrlを押します。カードまたはピンをクリックすると都市を強調します。",
        mapHeading: "地図上の選択都市",
        mapAria: "インタラクティブ世界地図",
        legendAria: "昼夜凡例",
        calculatingSunlight: "日照を計算中",
        day: "昼",
        twilight: "薄明",
        night: "夜",
        mapShadow: "地図の影",
        selectedTimeZones: "選択したタイムゾーン",
        refreshNow: "今すぐ更新",
        mapOffline: "地図はオフラインです",
        cardsStillLive: "都市カードはライブ更新されます。",
        sunlightStatus: "曲線の昼夜ライン · 太陽は {latitude} {longitude} 上",
        unavailable: "利用不可",
        backendCheck: "Javaバックエンドを確認してください",
        unableTimeZones: "タイムゾーンを読み込めません。",
        unableCityTimes: "都市時刻を読み込めません。",
        selectCityPrompt: "地図で都市を選択すると現地時刻が表示されます。",
        selectFromDropdown: "地図に表示する都市をドロップダウンから選択してください。",
        favoriteEmpty: "カードをお気に入りにするとここに固定されます。",
        noCitiesSelected: "都市が選択されていません。",
        citySingular: "都市",
        cityPlural: "都市",
        selected: "選択中",
        waitingData: "都市データを待機中",
        meetingPending: "会議時間の確認待ち",
        addCitiesSpread: "時差を比較する都市を追加してください",
        addCitiesMeeting: "会議の目安を見る都市を追加してください",
        hourSpread: "選択都市間の時差は{spread}時間",
        allWorkHours: "選択したすべての都市が勤務時間内です",
        someWorkHours: "{count}/{total} の都市が勤務時間内です",
        workHours: "勤務時間",
        afterHours: "時間外",
        workOk: "勤務OK",
        removeFavorite: "{city}をお気に入りから削除",
        addFavorite: "{city}をお気に入りに追加",
        shareCopied: "共有リンクをコピーしました"
    }
};

const defaultSelectedCities = ["Austin", "New York", "London", "Hyderabad", "Tokyo", "Sydney"];
const workdayStartHour = 9;
const workdayEndHour = 17;
const daylightRenderScale = 0.5;

let latestTimeZones = [];
let selectedCity = loadInitialLocation();
let selectedCities = loadInitialCities();
let favoriteCities = loadFavoriteCities();
let currentLanguage = loadInitialLanguage();
let worldMap;
let cityMarkers = {};
let mapAvailable = false;
let daylightAnimationFrame;

function loadInitialCities() {
    const sharedCities = new URLSearchParams(window.location.search).get("cities");
    if (sharedCities) {
        return sharedCities.split(",").filter(Boolean);
    }

    const savedCities = JSON.parse(localStorage.getItem("worldClockSelectedCities") || "null");
    return Array.isArray(savedCities) && savedCities.length > 0 ? savedCities : [...defaultSelectedCities];
}

function loadInitialLocation() {
    return new URLSearchParams(window.location.search).get("location")
        || localStorage.getItem("worldClockLocation")
        || "Austin";
}

function loadInitialLanguage() {
    const params = new URLSearchParams(window.location.search);
    const sharedLanguage = params.get("lang");
    const savedLanguage = localStorage.getItem("worldClockLanguage");
    const browserLanguage = navigator.language?.slice(0, 2);
    return [sharedLanguage, savedLanguage, browserLanguage, "en"].find(language => translations[language]) || "en";
}

function loadFavoriteCities() {
    const savedFavorites = JSON.parse(localStorage.getItem("worldClockFavoriteCities") || "null");
    return Array.isArray(savedFavorites) ? savedFavorites : ["Austin", "London"];
}

function persistSelections() {
    localStorage.setItem("worldClockSelectedCities", JSON.stringify(selectedCities));
    localStorage.setItem("worldClockFavoriteCities", JSON.stringify(favoriteCities));
    localStorage.setItem("worldClockLocation", selectedCity);
    localStorage.setItem("worldClockLanguage", currentLanguage);
}

function updateUrlState() {
    const url = new URL(window.location.href);
    url.searchParams.set("cities", selectedCities.join(","));
    url.searchParams.set("theme", document.body.dataset.theme || "aurora");
    url.searchParams.set("mode", document.body.dataset.mode || "dark");
    url.searchParams.set("lang", currentLanguage);
    if (selectedCity) {
        url.searchParams.set("location", selectedCity);
    }
    window.history.replaceState({}, "", url);
}

function translate(key, values = {}) {
    const phrase = translations[currentLanguage]?.[key] || translations.en[key] || key;
    return phrase.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

function getCityLabel(city) {
    return localizedCityNames[currentLanguage]?.[city] || city;
}

function getLanguageLabel(language) {
    return languageLabels[currentLanguage]?.[language] || languageLabels.en[language] || language;
}

function renderLanguageOptions() {
    if (!languageSelectElement) {
        return;
    }

    Array.from(languageSelectElement.options).forEach(option => {
        option.textContent = getLanguageLabel(option.value);
    });
    languageSelectElement.value = currentLanguage;
}

function applyLanguage(language) {
    currentLanguage = translations[language] ? language : "en";
    document.documentElement.lang = currentLanguage;
    renderLanguageOptions();

    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = translate(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
        element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
    });

    if (latestTimeZones.length > 0) {
        renderCitySelect(latestTimeZones);
        renderLocationSelect(latestTimeZones);
        syncCitySelect();
        syncLocationSelect();
        renderSelectedView();
        updateInsights();
        scheduleDaylightRender();
    }

    persistSelections();
    updateUrlState();
}

function getDayPhase(dateTime) {
    const hour = getHourFromDateTime(dateTime);

    if (hour >= 6 && hour < 18) {
        return { icon: "☀", label: translate("day"), value: "day" };
    }

    if ((hour >= 5 && hour < 6) || (hour >= 18 && hour < 20)) {
        return { icon: "◐", label: translate("twilight"), value: "twilight" };
    }

    return { icon: "☾", label: translate("night"), value: "night" };
}

function getWorkWindow(dateTime) {
    const hour = getHourFromDateTime(dateTime);
    const friendly = hour >= workdayStartHour && hour < workdayEndHour;
    return {
        friendly,
        label: friendly ? translate("workHours") : translate("afterHours"),
        badge: friendly ? translate("workOk") : translate("afterHours")
    };
}

function applyTheme(theme) {
    document.body.dataset.theme = theme;
    themeButtons.forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.theme === theme));
    });
    localStorage.setItem("worldClockTheme", theme);
    updateUrlState();
}

function applyMode(mode) {
    const resolvedMode = mode === "light" ? "light" : "dark";
    document.body.dataset.mode = resolvedMode;
    modeButtons.forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.mode === resolvedMode));
    });
    localStorage.setItem("worldClockMode", resolvedMode);
    updateUrlState();
}

function initializeMap() {
    if (typeof L === "undefined") {
        document.querySelector("#world-map").innerHTML = `
            <div class="map-fallback">
                <span>${translate("mapOffline")}</span>
                <strong>${translate("cardsStillLive")}</strong>
            </div>
        `;
        scheduleDaylightRender();
        return;
    }

    worldMap = L.map("world-map", {
        worldCopyJump: true,
        scrollWheelZoom: false
    }).setView([20, 10], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 6,
        minZoom: 2,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(worldMap);

    worldMap.on("move zoom resize", scheduleDaylightRender);
    mapAvailable = true;
    scheduleDaylightRender();
}

function scheduleDaylightRender() {
    if (daylightAnimationFrame) {
        cancelAnimationFrame(daylightAnimationFrame);
    }

    daylightAnimationFrame = requestAnimationFrame(renderDaylightTerminator);
}

function renderDaylightTerminator() {
    daylightAnimationFrame = null;

    if (!daylightCanvasElement) {
        return;
    }

    const mapElement = document.querySelector("#world-map");
    const bounds = mapElement.getBoundingClientRect();
    const width = Math.max(1, Math.floor(bounds.width * daylightRenderScale));
    const height = Math.max(1, Math.floor(bounds.height * daylightRenderScale));

    daylightCanvasElement.width = width;
    daylightCanvasElement.height = height;

    const context = daylightCanvasElement.getContext("2d", { willReadFrequently: true });
    const image = context.createImageData(width, height);
    const solar = getSolarPosition(new Date());

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const point = [x / daylightRenderScale, y / daylightRenderScale];
            const latLng = mapAvailable
                ? worldMap.containerPointToLatLng(point)
                : approximateLatLngFromPixel(x, y, width, height);
            const altitude = getSolarAltitude(latLng.lat, latLng.lng, solar);
            const index = (y * width + x) * 4;
            const shade = getDaylightShade(altitude);

            image.data[index] = shade[0];
            image.data[index + 1] = shade[1];
            image.data[index + 2] = shade[2];
            image.data[index + 3] = shade[3];
        }
    }

    context.putImageData(image, 0, 0);

    if (sunlightStatusElement) {
        sunlightStatusElement.textContent = translate("sunlightStatus", {
            latitude: formatLatitude(solar.declination),
            longitude: formatLongitude(solar.subsolarLongitude)
        });
    }
}

function getSolarPosition(date) {
    const dayStart = Date.UTC(date.getUTCFullYear(), 0, 0);
    const dayOfYear = Math.floor((date.getTime() - dayStart) / 86400000);
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (utcHours - 12) / 24);
    const declination = 0.006918
        - 0.399912 * Math.cos(gamma)
        + 0.070257 * Math.sin(gamma)
        - 0.006758 * Math.cos(2 * gamma)
        + 0.000907 * Math.sin(2 * gamma)
        - 0.002697 * Math.cos(3 * gamma)
        + 0.00148 * Math.sin(3 * gamma);
    const equationOfTime = 229.18 * (
        0.000075
        + 0.001868 * Math.cos(gamma)
        - 0.032077 * Math.sin(gamma)
        - 0.014615 * Math.cos(2 * gamma)
        - 0.040849 * Math.sin(2 * gamma)
    );
    const subsolarLongitude = normalizeLongitude((720 - utcHours * 60 - equationOfTime) / 4);

    return { declination: toDegrees(declination), subsolarLongitude };
}

function getSolarAltitude(latitude, longitude, solar) {
    const lat = toRadians(Math.max(-85, Math.min(85, latitude)));
    const declination = toRadians(solar.declination);
    const hourAngle = toRadians(normalizeLongitude(longitude - solar.subsolarLongitude));
    const altitude = Math.asin(
        Math.sin(lat) * Math.sin(declination)
        + Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle)
    );

    return toDegrees(altitude);
}

function getDaylightShade(altitude) {
    if (altitude >= 8) {
        const glow = Math.min(1, (altitude - 8) / 28);
        return [255, 235, 172, Math.round(18 + glow * 30)];
    }

    if (altitude >= -6) {
        const twilight = (altitude + 6) / 14;
        return [38, 84, 132, Math.round(124 - twilight * 84)];
    }

    const depth = Math.min(1, Math.abs(altitude + 6) / 22);
    return [0, 8, 24, Math.round(128 + depth * 82)];
}

function approximateLatLngFromPixel(x, y, width, height) {
    return {
        lat: 85 - (y / height) * 170,
        lng: -180 + (x / width) * 360
    };
}

function formatLongitude(longitude) {
    const absoluteLongitude = Math.round(Math.abs(longitude));
    if (absoluteLongitude === 0 || absoluteLongitude === 180) {
        return `${absoluteLongitude}°`;
    }

    return longitude > 0 ? `${absoluteLongitude}°E` : `${absoluteLongitude}°W`;
}

function formatLatitude(latitude) {
    const absoluteLatitude = Math.round(Math.abs(latitude));
    if (absoluteLatitude === 0) {
        return "0°";
    }

    return latitude > 0 ? `${absoluteLatitude}°N` : `${absoluteLatitude}°S`;
}

function normalizeLongitude(longitude) {
    return ((longitude + 540) % 360) - 180;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

async function loadDateTime() {
    try {
        const [dateTimeResponse, timeZonesResponse] = await Promise.all([
            fetch("/api/datetime"),
            fetch("/api/timezones")
        ]);

        if (!dateTimeResponse.ok || !timeZonesResponse.ok) {
            throw new Error("Could not load date and time");
        }

        const dateTime = await dateTimeResponse.json();
        latestTimeZones = await timeZonesResponse.json();
        selectedCities = selectedCities.filter(city => latestTimeZones.some(timeZone => timeZone.city === city));
        if (selectedCities.length === 0) {
            selectedCities = [...defaultSelectedCities];
        }
        if (!latestTimeZones.some(timeZone => timeZone.city === selectedCity)) {
            selectedCity = selectedCities[0] || latestTimeZones[0]?.city || "";
        }
        if (selectedCity && !selectedCities.includes(selectedCity)) {
            selectedCities = [...selectedCities, selectedCity];
        }

        dateElement.textContent = dateTime.date;
        timeElement.textContent = dateTime.time;
        timezoneElement.textContent = dateTime.timeZone;
        renderCitySelect(latestTimeZones);
        renderLocationSelect(latestTimeZones);
        syncCitySelect();
        syncLocationSelect();
        renderSelectedView();
        updateInsights();
        scheduleDaylightRender();
        persistSelections();
        updateUrlState();
    } catch (error) {
        dateElement.textContent = translate("unavailable");
        timeElement.textContent = translate("unavailable");
        timezoneElement.textContent = translate("backendCheck");
        timezoneListElement.innerHTML = `<p class='error'>${translate("unableTimeZones")}</p>`;
        selectedTimeElement.textContent = translate("unableCityTimes");
        console.error(error);
    }
}

function renderCitySelect(timeZones) {
    citySelectElement.innerHTML = timeZones
        .map(timeZone => `
            <option value="${timeZone.city}" ${selectedCities.includes(timeZone.city) ? "selected" : ""}>
                ${getCityLabel(timeZone.city)}
            </option>
        `)
        .join("");
}

function renderLocationSelect(timeZones) {
    if (!locationSelectElement) {
        return;
    }

    locationSelectElement.innerHTML = timeZones
        .map(timeZone => `
            <option value="${timeZone.city}">
                ${getCityLabel(timeZone.city)}
            </option>
        `)
        .join("");
}

function syncCitySelect() {
    Array.from(citySelectElement.options).forEach(option => {
        option.selected = selectedCities.includes(option.value);
    });
}

function syncLocationSelect() {
    if (locationSelectElement) {
        locationSelectElement.value = selectedCity;
    }
}

function getSelectedTimeZones() {
    return latestTimeZones.filter(timeZone => selectedCities.includes(timeZone.city));
}

function renderSelectedView() {
    const selectedTimeZones = getSelectedTimeZones();

    if (!selectedTimeZones.some(timeZone => timeZone.city === selectedCity)) {
        selectedCity = selectedTimeZones[0]?.city || "";
    }

    renderFavorites();
    renderMapMarkers(selectedTimeZones);
    renderTimeZones(selectedTimeZones);
    showSelectedCity(selectedCity);
    syncLocationSelect();
}

function renderMapMarkers(timeZones) {
    if (!mapAvailable) {
        return;
    }

    Object.values(cityMarkers).forEach(marker => marker.remove());
    cityMarkers = {};

    timeZones
        .filter(timeZone => cityCoordinates[timeZone.city])
        .forEach(timeZone => {
            const phase = getDayPhase(timeZone.dateTime);
            const workWindow = getWorkWindow(timeZone.dateTime);
            const cityLabel = getCityLabel(timeZone.city);
            const marker = L.marker(cityCoordinates[timeZone.city], {
                icon: L.divIcon({
                    className: "day-night-marker-wrap",
                    html: `
                        <span class="day-night-marker is-${phase.value}" aria-label="${cityLabel} is in ${phase.label.toLowerCase()}">
                            ${phase.icon}
                        </span>
                    `,
                    iconSize: [38, 38],
                    iconAnchor: [19, 19],
                    tooltipAnchor: [0, -18]
                })
            })
                .addTo(worldMap)
                .bindTooltip(`${cityLabel}: ${timeZone.time} · ${phase.label} · ${workWindow.label}`, {
                    direction: "top",
                    offset: [0, -12]
                })
                .on("click", () => focusLocation(timeZone.city, { shouldPan: false }));

            cityMarkers[timeZone.city] = marker;
        });
}

function showSelectedCity(city) {
    const timeZone = latestTimeZones.find(item => item.city === city);

    if (!timeZone) {
        selectedTimeElement.textContent = latestTimeZones.length > 0 ? translate("selectFromDropdown") : translate("selectCityPrompt");
        renderAnalogClock();
        return;
    }

    const workWindow = getWorkWindow(timeZone.dateTime);
    selectedTimeElement.innerHTML = `
        <span class="city">${getCityLabel(timeZone.city)}</span>
        <strong>${timeZone.time}</strong>
        <span>${timeZone.date}</span>
        <span>${getDayPhase(timeZone.dateTime).label} · ${workWindow.label}</span>
        <small>${timeZone.zoneId}</small>
    `;

    const marker = cityMarkers[timeZone.city];
    if (marker) {
        marker.openTooltip();
    }

    document.querySelectorAll(".timezone-card").forEach(card => {
        card.classList.toggle("is-active", card.dataset.city === timeZone.city);
    });
    syncLocationSelect();
    renderAnalogClock(timeZone);
}

function renderAnalogClock(timeZone) {
    if (!analogClockCaptionElement || !analogHourHandElement || !analogMinuteHandElement || !analogSecondHandElement) {
        return;
    }

    if (!timeZone) {
        analogClockCaptionElement.textContent = translate("loading");
        return;
    }

    const [hourValue = 0, minuteValue = 0, secondValue = 0] = timeZone.time24Hour.split(":").map(Number);
    const hours = hourValue % 12;
    const minutes = minuteValue;
    const seconds = secondValue;
    const milliseconds = 0;
    const preciseSeconds = seconds + milliseconds / 1000;
    const preciseMinutes = minutes + preciseSeconds / 60;
    const preciseHours = hours + preciseMinutes / 60;

    analogHourHandElement.style.transform = `translateX(-50%) rotate(${preciseHours * 30}deg)`;
    analogMinuteHandElement.style.transform = `translateX(-50%) rotate(${preciseMinutes * 6}deg)`;
    analogSecondHandElement.style.transform = `translateX(-50%) rotate(${preciseSeconds * 6}deg)`;
    analogClockCaptionElement.textContent = `${getCityLabel(timeZone.city)} · ${timeZone.time} · ${timeZone.zoneId}`;
}

function focusLocation(city, options = {}) {
    if (!city) {
        return;
    }

    selectedCity = city;
    if (!selectedCities.includes(city)) {
        selectedCities = [...selectedCities, city];
        syncCitySelect();
    }

    renderSelectedView();
    updateInsights();
    persistSelections();
    updateUrlState();

    if (options.shouldPan !== false && mapAvailable && cityCoordinates[city]) {
        worldMap.flyTo(cityCoordinates[city], Math.max(worldMap.getZoom(), 4), { duration: 0.8 });
    }
}

function renderFavorites() {
    if (favoriteCities.length === 0) {
        favoriteListElement.innerHTML = `<span class='favorite-empty'>${translate("favoriteEmpty")}</span>`;
        return;
    }

    favoriteListElement.innerHTML = favoriteCities
        .filter(city => latestTimeZones.some(timeZone => timeZone.city === city))
        .map(city => `
            <button class="favorite-chip" type="button" data-city="${city}">
                ${getCityLabel(city)}
            </button>
        `)
        .join("");

    favoriteListElement.querySelectorAll(".favorite-chip").forEach(button => {
        button.addEventListener("click", () => focusLocation(button.dataset.city));
    });
}

function renderTimeZones(timeZones) {
    if (timeZones.length === 0) {
        timezoneListElement.innerHTML = `<p class='error'>${translate("noCitiesSelected")}</p>`;
        return;
    }

    timezoneListElement.innerHTML = timeZones
        .map(timeZone => {
            const phase = getDayPhase(timeZone.dateTime);
            const workWindow = getWorkWindow(timeZone.dateTime);
            const favorite = favoriteCities.includes(timeZone.city);
            const cityLabel = getCityLabel(timeZone.city);
            return `
            <article class="timezone-card is-${phase.value} ${workWindow.friendly ? "is-work-friendly" : "is-after-hours"}" data-city="${timeZone.city}" data-work-label="${workWindow.badge}">
                <button class="favorite-button" type="button" aria-pressed="${favorite}" aria-label="${favorite ? translate("removeFavorite", { city: cityLabel }) : translate("addFavorite", { city: cityLabel })}" data-city="${timeZone.city}">
                    ${favorite ? "★" : "☆"}
                </button>
                <button class="timezone-card-main" type="button" data-city="${timeZone.city}">
                    <span class="city">${cityLabel}</span>
                    <strong>${timeZone.time}</strong>
                    <span>${timeZone.date}</span>
                    <span>${phase.label} · ${workWindow.label}</span>
                    <small>${timeZone.zoneId}</small>
                </button>
            </article>
        `;
        })
        .join("");

    timezoneListElement.querySelectorAll(".timezone-card-main").forEach(card => {
        card.addEventListener("click", () => focusLocation(card.dataset.city));
    });

    timezoneListElement.querySelectorAll(".favorite-button").forEach(button => {
        button.addEventListener("click", () => toggleFavorite(button.dataset.city));
    });
}

function toggleFavorite(city) {
    favoriteCities = favoriteCities.includes(city)
        ? favoriteCities.filter(item => item !== city)
        : [...favoriteCities, city];

    renderFavorites();
    renderTimeZones(getSelectedTimeZones());
    showSelectedCity(selectedCity);
    persistSelections();
}

function getHourFromDateTime(dateTime) {
    return Number(dateTime.match(/T(\d{2})/)?.[1] || 0);
}

function updateInsights() {
    const selectedTimeZones = getSelectedTimeZones();
    const cityLabel = selectedTimeZones.length === 1 ? translate("citySingular") : translate("cityPlural");

    cityCountElement.textContent = `${selectedTimeZones.length} ${cityLabel} ${translate("selected")}`;

    if (selectedTimeZones.length < 2) {
        timeSpreadElement.textContent = translate("addCitiesSpread");
        meetingWindowElement.textContent = translate("addCitiesMeeting");
        return;
    }

    const hours = selectedTimeZones
        .map(timeZone => getHourFromDateTime(timeZone.dateTime))
        .sort((first, second) => first - second);
    const gaps = hours.map((hour, index) => {
        const nextHour = hours[(index + 1) % hours.length];
        return (nextHour - hour + 24) % 24;
    });
    const spread = 24 - Math.max(...gaps);
    const workFriendlyCount = selectedTimeZones.filter(timeZone => getWorkWindow(timeZone.dateTime).friendly).length;

    timeSpreadElement.textContent = translate("hourSpread", { spread });
    meetingWindowElement.textContent = workFriendlyCount === selectedTimeZones.length
        ? translate("allWorkHours")
        : translate("someWorkHours", { count: workFriendlyCount, total: selectedTimeZones.length });
}

function copyShareLink() {
    updateUrlState();
    const shareUrl = window.location.href;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            shareStatusElement.textContent = translate("shareCopied");
        });
        return;
    }

    shareStatusElement.textContent = shareUrl;
}

citySelectElement.addEventListener("change", () => {
    selectedCities = Array.from(citySelectElement.selectedOptions).map(option => option.value);
    renderSelectedView();
    updateInsights();
    persistSelections();
    updateUrlState();
});

languageSelectElement.addEventListener("change", () => applyLanguage(languageSelectElement.value));
locationSelectElement.addEventListener("change", () => focusLocation(locationSelectElement.value));
refreshButton.addEventListener("click", loadDateTime);
shareButton.addEventListener("click", copyShareLink);
themeButtons.forEach(button => {
    button.addEventListener("click", () => applyTheme(button.dataset.theme));
});
modeButtons.forEach(button => {
    button.addEventListener("click", () => applyMode(button.dataset.mode));
});

applyLanguage(currentLanguage);
applyTheme(new URLSearchParams(window.location.search).get("theme") || localStorage.getItem("worldClockTheme") || "aurora");
applyMode(new URLSearchParams(window.location.search).get("mode") || localStorage.getItem("worldClockMode") || "dark");
initializeMap();
loadDateTime();
setInterval(loadDateTime, 1000);
setInterval(scheduleDaylightRender, 60000);
