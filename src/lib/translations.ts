export type Language = "en" | "ur" | "hi";

export const translations = {
  en: {
    // Layout / Nav
    home: "Home",
    signIn: "Sign In",
    signOut: "Sign Out",
    admin: "Admin",
    villages: "Villages",
    about: "About Us",
    search: "Search",

    // About Page
    aboutTitle: "Preserving Our Heritage",
    aboutSubtitle: "A collaborative digital archive mapping the descendants of Hazrat Sheikh Hasan Baba, bridging generations and connecting family branches.",
    aboutMissionTitle: "Our Mission",
    aboutMissionText: "The goal of this project is to digitize and preserve the family lineage of Hazrat Sheikh Hasan Baba. For generations, this knowledge has been passed down orally or kept in delicate paper manuscripts (Shajrahs). By moving this to a collaborative digital platform, we ensure our history is accessible to all descendants globally.",
    aboutCollabTitle: "A Collaborative Effort",
    aboutCollabText: "This tree is continually growing thanks to contributions from family members across different villages. Designated editors work to ensure accuracy, while anyone can view and trace their ancestry back to the roots.",
    aboutDevTitle: "Developed by Danish Ahmad",
    aboutDevText: "This platform was lovingly created to serve the community, honoring our ancestors and making it easier for future generations to discover their roots. If you find this project valuable, consider contributing your own family branch!",
    aboutContact: "Contact me at: ",

    // HomePage
    searchPeople: "Search people...",
    villageDirectory: "Village Directory",
    people: "people",
    users: "users",
    totalPeople: "Total People",
    totalVillages: "Villages",
    registeredUsers: "Registered Users",
    filterVillages: "Filter villages by name or spelling...",
    noVillagesMatch: "No villages found matching your search.",
    mainTitle: "Hazrat Sheikh Hasan\nBaba Family Tree",
    mainSubtitle: "A collaborative, digital archive mapping the descendants of Hazrat Sheikh Hasan Baba across various village branches.",
    originalShajrah: "View Original Shajrah (PDF)",

    // VillagePage
    backToVillages: "Back to Villages",
    addPerson: "Add Person",
    villageNotFound: "Village not found.",
    loadingVillage: "Loading village data...",
    addGuidance: "Want to add your family to the tree? Please Sign In and request editor access, or contact an administrator to submit changes.",

    // AdminPage
    adminDashboard: "Admin Dashboard",
    villageStats: "Village Stats",
    searchVillages: "Search villages...",
    noVillagesFound: "No villages found matching",
    userManagement: "User Management",
    searchUsers: "Search users...",
    noName: "No Name",
    updateRole: "Update Role",
    nameEmail: "Name / Email",
    role: "Role",
    assignedVillage: "Assigned Village",
    actions: "Actions",
    none: "-- None --",
    noUsersFound: "No users found matching",

    // Tree/Lineage
    selectPersonToViewAncestry: "Select a person to view ancestry",
    noPeopleFound: "No people found.",
    ancestryPath: "Ancestry Path",
    loadingLineage: "Loading lineage...",
    
    // Person Details

    generation: "Generation",
    genealogy: "Genealogy",
    father: "Father",
    unknownRoot: "Unknown / Root",
    childrenCount: "Children Count",


    // Add Person Form
    addTo: "Add to",
    sharedFather: "Shared Father (Applies to all people added below)",
    searchFather: "Search or select father...",
    noneNewBranch: "None (New Family Branch)",
    noMatchingPeople: "No matching people found.",
    englishName: "English Name",
    urduName: "Urdu Name",
    hindiName: "Hindi Name",
    addSiblingChild: "Add Sons",
    cancel: "Cancel",
    addPeople: "Add People",
    edit: "Edit",
    save: "Save",

    // Village Management
    villageManagement: "Village Management",
    addVillage: "Add Village",
    editVillage: "Edit Village",
    deleteVillage: "Delete Village",
    villageName: "Village Name",
    villageSlug: "URL Slug",
    alternateSpellings: "Alternate Spellings (comma separated)",
    confirmDeleteVillage: "Are you sure you want to delete this village? All people in this village will also be deleted. This cannot be undone."
  },
  ur: {
    // Layout / Nav
    home: "ہوم",
    signIn: "سائن ان کریں",
    signOut: "سائن آؤٹ کریں",
    admin: "ایڈمن",
    villages: "گاؤں",
    about: "ہمارے بارے میں",
    search: "تلاش کریں",

    // About Page
    aboutTitle: "ہماری وراثت کا تحفظ",
    aboutSubtitle: "حضرت شیخ حسن بابا کی نسل کا نقشہ بنانے والا ایک ڈیجیٹل آرکائیو، جو نسلوں کو جوڑتا ہے اور خاندانی شاخوں کو ملاتا ہے۔",
    aboutMissionTitle: "ہمارا مقصد",
    aboutMissionText: "اس پروجیکٹ کا مقصد حضرت شیخ حسن بابا کے شجرہ نسب کو ڈیجیٹل کرنا اور محفوظ کرنا ہے۔ نسل در نسل، یہ علم زبانی منتقل ہوتا رہا ہے یا نازک کاغذی مسودوں (شجروں) میں محفوظ رکھا گیا ہے۔ اسے ایک مشترکہ ڈیجیٹل پلیٹ فارم پر منتقل کرکے، ہم اس بات کو یقینی بناتے ہیں کہ ہماری تاریخ عالمی سطح پر تمام اولادوں تک پہنچ سکے۔",
    aboutCollabTitle: "ایک مشترکہ کوشش",
    aboutCollabText: "یہ شجرہ مختلف گاؤں کے خاندان کے افراد کی شراکت کی بدولت مسلسل بڑھ رہا ہے۔ نامزد ایڈیٹرز درستگی کو یقینی بنانے کے لیے کام کرتے ہیں، جبکہ کوئی بھی اپنے آباؤ اجداد کو جڑوں تک دیکھ اور تلاش کر سکتا ہے۔",
    aboutDevTitle: "دانش احمد کی طرف سے تیار کردہ",
    aboutDevText: "یہ پلیٹ فارم کمیونٹی کی خدمت، ہمارے آباؤ اجداد کا احترام کرنے، اور آنے والی نسلوں کے لیے اپنی جڑوں کو دریافت کرنا آسان بنانے کے لیے محبت سے بنایا گیا تھا۔ اگر آپ کو یہ پروجیکٹ قیمتی لگتا ہے، تو اپنی خاندانی شاخ میں حصہ ڈالنے پر غور کریں!",
    aboutContact: "مجھ سے رابطہ کریں: ",

    // HomePage
    searchPeople: "لوگوں کو تلاش کریں...",
    villageDirectory: "گاؤں کی ڈائریکٹری",
    people: "لوگ",
    users: "صارفین",
    totalPeople: "کل لوگ",
    totalVillages: "گاؤں",
    registeredUsers: "رجسٹرڈ صارفین",
    filterVillages: "نام یا ہجے کے لحاظ سے گاؤں فلٹر کریں...",
    noVillagesMatch: "آپ کی تلاش کے مطابق کوئی گاؤں نہیں ملا۔",
    mainTitle: "حضرت شیخ حسن بابا\nشجرہ نسب",
    mainSubtitle: "حضرت شیخ حسن بابا کی اولاد کا مختلف گاؤں کی شاخوں میں نقشہ بنانے والا ایک باہمی تعاون پر مبنی، ڈیجیٹل آرکائیو۔",
    originalShajrah: "اصل شجرہ دیکھیں (PDF)",

    // VillagePage
    backToVillages: "گاؤں پر واپس جائیں",
    addPerson: "شخص شامل کریں",
    villageNotFound: "گاؤں نہیں ملا۔",
    loadingVillage: "گاؤں کا ڈیٹا لوڈ ہو رہا ہے...",
    addGuidance: "کیا آپ اپنے خاندان کو شجرہ میں شامل کرنا چاہتے ہیں؟ براہ کرم سائن ان کریں اور ایڈیٹر تک رسائی کی درخواست کریں، یا تبدیلیاں جمع کرانے کے لیے کسی ایڈمنسٹریٹر سے رابطہ کریں۔",

    // AdminPage
    adminDashboard: "ایڈمن ڈیش بورڈ",
    villageStats: "گاؤں کے اعدادوشمار",
    searchVillages: "گاؤں تلاش کریں...",
    noVillagesFound: "کوئی گاؤں نہیں ملا",
    userManagement: "صارفین کا انتظام",
    searchUsers: "صارفین تلاش کریں...",
    noName: "کوئی نام نہیں",
    updateRole: "کردار اپ ڈیٹ کریں",
    nameEmail: "نام / ای میل",
    role: "کردار",
    assignedVillage: "مقرر کردہ گاؤں",
    actions: "اقدامات",
    none: "-- کوئی نہیں --",
    noUsersFound: "کوئی صارف نہیں ملا",

    // Tree/Lineage
    selectPersonToViewAncestry: "شجرہ نسب دیکھنے کے لیے کسی شخص کا انتخاب کریں",
    noPeopleFound: "کوئی لوگ نہیں ملے۔",
    ancestryPath: "شجرہ نسب کا راستہ",
    loadingLineage: "نسب لوڈ ہو رہا ہے...",
    
    // Person Details

    generation: "نسل",
    genealogy: "شجرہ نسب",
    father: "والد",
    unknownRoot: "نامعلوم / جڑ",
    childrenCount: "بچوں کی تعداد",


    // Add Person Form
    addTo: "میں شامل کریں",
    sharedFather: "مشترکہ والد (نیچے شامل کیے گئے تمام افراد پر لاگو ہوتا ہے)",
    searchFather: "والد تلاش کریں یا منتخب کریں...",
    noneNewBranch: "کوئی نہیں (نئی خاندانی شاخ)",
    noMatchingPeople: "کوئی مماثل لوگ نہیں ملے۔",
    englishName: "انگریزی نام",
    urduName: "اردو نام",
    hindiName: "ہندی نام",
    addSiblingChild: "بیٹے شامل کریں",
    cancel: "منسوخ کریں",
    addPeople: "لوگ شامل کریں",
    edit: "ترمیم کریں",
    save: "محفوظ کریں",

    // Village Management
    villageManagement: "گاؤں کا انتظام",
    addVillage: "گاؤں شامل کریں",
    editVillage: "گاؤں میں ترمیم کریں",
    deleteVillage: "گاؤں حذف کریں",
    villageName: "گاؤں کا نام",
    villageSlug: "یو آر ایل سلگ",
    alternateSpellings: "متبادل ہجے (کوما سے الگ کریں)",
    confirmDeleteVillage: "کیا آپ واقعی اس گاؤں کو حذف کرنا چاہتے ہیں؟ اس گاؤں کے تمام لوگ بھی حذف ہو جائیں گے۔ یہ واپس نہیں ہو سکتا۔"
  },
  hi: {
    // Layout / Nav
    home: "होम",
    signIn: "साइन इन करें",
    signOut: "साइन आउट करें",
    admin: "व्यवस्थापक",
    villages: "गांव",
    about: "हमारे बारे में",
    search: "खोजें",

    // About Page
    aboutTitle: "हमारी विरासत का संरक्षण",
    aboutSubtitle: "हज़रत शेख हसन बाबा के वंशजों का मानचित्रण करने वाला एक सहयोगी डिजिटल संग्रह, जो पीढ़ियों को जोड़ता है और पारिवारिक शाखाओं को मिलाता है।",
    aboutMissionTitle: "हमारा मिशन",
    aboutMissionText: "इस परियोजना का लक्ष्य हज़रत शेख हसन बाबा के वंश को डिजिटाइज़ और संरक्षित करना है। पीढ़ियों से, यह ज्ञान मौखिक रूप से पारित किया गया है या नाजुक कागजी पांडुलिपियों (शजरा) में रखा गया है। इसे एक सहयोगी डिजिटल प्लेटफॉर्म पर ले जाकर, हम सुनिश्चित करते हैं कि हमारा इतिहास विश्व स्तर पर सभी वंशजों के लिए सुलभ हो।",
    aboutCollabTitle: "एक सहयोगी प्रयास",
    aboutCollabText: "विभिन्न गांवों के परिवार के सदस्यों के योगदान के कारण यह पेड़ लगातार बढ़ रहा है। नामित संपादक सटीकता सुनिश्चित करने के लिए काम करते हैं, जबकि कोई भी अपनी वंशावली को जड़ों तक देख और खोज सकता है।",
    aboutDevTitle: "दानिश अहमद द्वारा विकसित",
    aboutDevText: "यह मंच समुदाय की सेवा करने, हमारे पूर्वजों का सम्मान करने और आने वाली पीढ़ियों के लिए अपनी जड़ों को खोजने में आसान बनाने के लिए प्यार से बनाया गया था। यदि आपको यह परियोजना मूल्यवान लगती है, तो अपनी पारिवारिक शाखा में योगदान करने पर विचार करें!",
    aboutContact: "मुझसे संपर्क करें: ",

    // HomePage
    searchPeople: "लोगों को खोजें...",
    villageDirectory: "गांव निर्देशिका",
    people: "लोग",
    users: "उपयोगकर्ता",
    totalPeople: "कुल लोग",
    totalVillages: "गांव",
    registeredUsers: "पंजीकृत उपयोगकर्ता",
    filterVillages: "नाम या वर्तनी से गांवों को फ़िल्टर करें...",
    noVillagesMatch: "आपकी खोज से मेल खाने वाला कोई गांव नहीं मिला।",
    mainTitle: "हज़रत शेख हसन बाबा\nवंशावली",
    mainSubtitle: "विभिन्न गांव की शाखाओं में हज़रत शेख हसन बाबा के वंशजों का मानचित्रण करने वाला एक सहयोगी, डिजिटल संग्रह।",
    originalShajrah: "मूल वंशावली देखें (PDF)",

    // VillagePage
    backToVillages: "गांवों पर वापस जाएं",
    addPerson: "व्यक्ति जोड़ें",
    villageNotFound: "गांव नहीं मिला।",
    loadingVillage: "गांव का डेटा लोड हो रहा है...",
    addGuidance: "क्या आप अपने परिवार को वंशावली में जोड़ना चाहते हैं? कृपया साइन इन करें और संपादक की पहुंच का अनुरोध करें, या बदलाव सबमिट करने के लिए किसी व्यवस्थापक से संपर्क करें।",

    // AdminPage
    adminDashboard: "व्यवस्थापक डैशबोर्ड",
    villageStats: "गांव के आंकड़े",
    searchVillages: "गांवों को खोजें...",
    noVillagesFound: "कोई गांव नहीं मिला",
    userManagement: "उपयोगकर्ता प्रबंधन",
    searchUsers: "उपयोगकर्ताओं को खोजें...",
    noName: "कोई नाम नहीं",
    updateRole: "भूमिका अपडेट करें",
    nameEmail: "नाम / ईमेल",
    role: "भूमिका",
    assignedVillage: "आवंटित गांव",
    actions: "कार्रवाई",
    none: "-- कोई नहीं --",
    noUsersFound: "कोई उपयोगकर्ता नहीं मिला",

    // Tree/Lineage
    selectPersonToViewAncestry: "वंशावली देखने के लिए एक व्यक्ति चुनें",
    noPeopleFound: "कोई लोग नहीं मिले।",
    ancestryPath: "वंशावली पथ",
    loadingLineage: "वंशावली लोड हो रही है...",
    
    // Person Details

    generation: "पीढ़ी",
    genealogy: "वंशावली",
    father: "पिता",
    unknownRoot: "अज्ञात / मूल",
    childrenCount: "बच्चों की संख्या",


    // Add Person Form
    addTo: "में जोड़ें",
    sharedFather: "साझा पिता (नीचे जोड़े गए सभी लोगों पर लागू होता है)",
    searchFather: "पिता खोजें या चुनें...",
    noneNewBranch: "कोई नहीं (नई पारिवारिक शाखा)",
    noMatchingPeople: "कोई मेल खाने वाले लोग नहीं मिले।",
    englishName: "अंग्रेजी नाम",
    urduName: "उर्दू नाम",
    hindiName: "हिंदी नाम",
    addSiblingChild: "बेटे जोड़ें",
    cancel: "रद्द करें",
    addPeople: "लोग जोड़ें",
    edit: "संपादित करें",
    save: "सहेजें",

    // Village Management
    villageManagement: "गाँव प्रबंधन",
    addVillage: "गाँव जोड़ें",
    editVillage: "गाँव संपादित करें",
    deleteVillage: "गाँव हटाएं",
    villageName: "गाँव का नाम",
    villageSlug: "यूआरएल स्लग",
    alternateSpellings: "वैकल्पिक वर्तनी (अल्पविराम से अलग)",
    confirmDeleteVillage: "क्या आप वाकई इस गाँव को हटाना चाहते हैं? इस गाँव के सभी लोग भी हटा दिए जाएंगे। यह वापस नहीं किया जा सकता।"
  }
};

export type TranslationKey = keyof typeof translations.en;
