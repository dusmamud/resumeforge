import type { Dict } from './en';
import { BRAND } from '../../brand';

const tr: Dict = {
  dir: 'ltr' as 'ltr' | 'rtl',
  meta: {
    siteName: BRAND.name,
    landingTitle: `${BRAND.name} — %100 Ücretsiz Özgeçmiş & CV Oluştur`,
    landingDescription: `${BRAND.name} ücretsiz bir çevrimiçi özgeçmiş oluşturucudur. Bilgilerinizi girin, bir şablon seçin ve profesyonel özgeçmişinizi PDF olarak indirin — kayıt gerekmez. Verileriniz asla tarayıcınızdan çıkmaz.`,
    builderTitle: `Özgeçmiş Oluştur — ${BRAND.name}`,
    builderDescription: `${BRAND.name}'in ücretsiz özgeçmiş oluşturucusuyla özgeçmişinizi oluşturun. Birden çok şablon, canlı önizleme, anında PDF indirme. Hesap yok, ücret yok.`,
    aboutTitle: `Hakkında — ${BRAND.name}`,
    aboutDescription: `${BRAND.name} nedir ve neden temiz, iyi yapılandırılmış bir özgeçmiş size daha fazla mülakat kazandırır.`,
    privacyTitle: `Gizlilik Politikası — ${BRAND.name}`,
    privacyDescription: `${BRAND.name} gizlilik politikası: özgeçmiş verileriniz tarayıcınızda kalır. Hiçbir şey yüklenmez.`,
  },
  nav: {
    home: 'Ana Sayfa',
    builder: 'Özgeçmiş Oluştur',
    about: 'Hakkında',
    theme: 'Tema',
    themeLight: 'Açık',
    themeDark: 'Koyu',
    themeSystem: 'Sistem',
    language: 'Dil',
    createNow: 'Hemen Oluştur',
  },
  hero: {
    badge: '%100 Ücretsiz · Kayıt Yok · Tasarım gereği özel',
    titleA: '',
    titleHighlight: '%100 Ücretsiz Özgeçmiş',
    titleB: '& CV Oluşturun',
    subtitle:
      'Dakikalar içinde profesyonel bir özgeçmiş oluşturun. Bilgilerinizi girin, bir şablon seçin ve özgeçmişinizi PDF olarak indirin — tamamen ücretsiz, hesap gerekmez.',
    ctaPrimary: 'Hemen Oluştur — ücretsiz',
    ctaSecondary: 'Nasıl çalışır',
  },
  steps: {
    title: 'Özgeçmişinizi 3 basit adımda oluşturun',
    subtitle: 'Tasarım becerisi gerekmez — akışı takip edin.',
    items: [
      {
        title: 'Hemen Oluştur’a tıklayın',
        text: 'Tek tıkla yeni bir özgeçmişe başlayın. Başlamak için temiz ve profesyonel şablonlarımızdan birini seçin.',
      },
      {
        title: 'Bilgilerinizi girin',
        text: 'İletişim bilgilerinizi, iş deneyiminizi, eğitiminizi ve becerilerinizi ekleyin. Her şey tarayıcınıza otomatik kaydedilir.',
      },
      {
        title: 'PDF’inizi indirin',
        text: 'Özgeçmişinizi canlı önizlemede görün, ince ayar yapın ve baskıya hazır PDF’i indirin — sonsuza dek ücretsiz.',
      },
    ],
  },
  why: {
    title: 'Neden bizi seçmelisiniz',
    subtitle: 'Mülakat kazandıran bir özgeçmiş için ihtiyacınız olan her şey.',
    items: [
      {
        icon: 'ph:gift',
        title: '%100 Ücretsiz',
        text: 'Her özellik ücretsiz, sonsuza dek. Premium plan yok, kilitli şablon yok, PDF’inizde filigran yok.',
      },
      {
        icon: 'ph:cursor-click',
        title: 'Kullanımı Kolay',
        text: 'Basit bir yönlendirmeli form işi yapar. Yazı yazabiliyorsanız burada harika bir özgeçmiş oluşturabilirsiniz.',
      },
      {
        icon: 'ph:sliders-horizontal',
        title: 'Basit Özelleştirme',
        text: 'Şablon değiştirin, vurgu renklerini ve yazı tiplerini değiştirin, bölümleri tek tıkla açıp kapatın.',
      },
      {
        icon: 'ph:lightning',
        title: 'Hızlı & Güvenilir',
        text: 'Özgeçmişiniz yazarken otomatik kaydedilir. Sekmeyi kapatıp geri dönün — taslağınız hâlâ orada.',
      },
      {
        icon: 'ph:download-simple',
        title: 'Anında İndirme',
        text: 'İşiniz bittiği anda temiz, baskıya hazır bir PDF dışa aktarın. Bekleme yok, e-posta doğrulaması yok.',
      },
      {
        icon: 'ph:lock-key',
        title: 'Güvenli & Özel',
        text: 'Verileriniz tarayıcınızın yerel depolamasında kalır. Hiçbir şey yüklenmez, hesap asla gerekmez.',
      },
    ],
  },
  faq: {
    title: 'Sık sorulan sorular',
    subtitle: 'Yaygın sorulara hızlı yanıtlar.',
    items: [
      {
        q: 'Özgeçmiş oluşturucuyu kullanmak için tasarım becerisine ihtiyacım var mı?',
        a: 'Hayır. Oluşturucu, temiz ve profesyonelce tasarlanmış şablonlar kullanır, bu nedenle biçimlendirme sizin için hazırdır. Sadece bilgilerinizi girin, yerleşim, boşluk ve tipografiyi oluşturucu halleder.',
      },
      {
        q: 'Özgeçmişime profil fotoğrafı ekleyebilir miyim?',
        a: 'Evet. Kişisel bilgiler bölümüne bir fotoğraf yükleyebilir ve herhangi bir şablon için açıp kapatabilirsiniz. Fotoğraf isteğe bağlıdır — birçok işe alım uzmanı fotoğrafsız özgeçmişleri tercih eder.',
      },
      {
        q: 'Özgeçmişimi oluşturmak veya indirmek için kayıt olmam gerekiyor mu?',
        a: 'Kayıt gerekmez. Hesap oluşturmadan veya e-postanızı paylaşmadan özgeçmişinizi tamamen ücretsiz oluşturabilir ve PDF’i indirebilirsiniz.',
      },
      {
        q: 'Gerçekten ücretsiz mi?',
        a: 'Evet — tüm şablonlar ve PDF indirmeleri dahil her özellik ücretsizdir. Premium katman veya gizli ücret yok.',
      },
      {
        q: 'İndirdikten sonra özgeçmişimi düzenleyebilir miyim?',
        a: 'Kesinlikle. Taslağınız tarayıcınıza otomatik kaydedilir, böylece oluşturucuyu istediğiniz zaman yeniden açabilir, değişiklik yapabilir ve güncellenmiş bir PDF indirebilirsiniz.',
      },
      {
        q: 'Kendi özel bölümlerimi ekleyebilir miyim?',
        a: 'Evet. Düz metin veya madde işaretleriyle özel bölümler ekleyebilirsiniz — sertifikalar, projeler, gönüllü çalışmaları veya işe alım uzmanlarının görmesini istediğiniz her şey için kullanışlıdır.',
      },
    ],
  },
  ctaBand: {
    title: 'Özgeçmişinizi oluşturmaya hazır mısınız?',
    text: 'Dakikalar içinde profesyonel özgeçmişler oluşturan binlerce iş arayana katılın — ücretsiz, özel, kayıt yok.',
    button: 'Özgeçmişimi Oluştur',
  },
  footer: {
    tagline: `${BRAND.name} ücretsiz bir çevrimiçi özgeçmiş oluşturucudur. Kayıt gerekmez — verileriniz tarayıcınızda kalır.`,
    usefulTitle: 'Faydalı Bağlantılar',
    importantTitle: 'Önemli',
    followTitle: 'Bizi Takip Edin',
    rights: 'Tüm hakları saklıdır.',
  },
  about: {
    title: `${BRAND.name} Hakkında`,
    p1: `${BRAND.name}, tek bir basit iş için yapılmış ücretsiz bir çevrimiçi özgeçmiş oluşturucudur: tasarım becerisi olmadan ve ücret ödemeden hızlıca profesyonel bir özgeçmiş oluşturmanıza yardımcı olmak.`,
    p2: 'İşe alım uzmanları genellikle bir özgeçmişi taramak için yalnızca birkaç saniye harcar, bu nedenle yapı ve okunabilirlik süslemeden daha önemlidir. Buradaki her şablon bu fikir etrafında inşa edilmiştir — temiz başlıklar, net bölümler ve hem insan okuyucular hem de aday takip sistemleri için çalışan bir yerleşim.',
    p3: 'Kayıt yok ve hiçbir şey yüklenmiyor. Özgeçmiş verileriniz kendi tarayıcınızda yaşar, böylece yazdıklarınız size ait kalır.',
  },
  privacy: {
    title: 'Gizlilik Politikası',
    intro: 'Bu politika, bu siteyi kullandığınızda verilerinize ne olduğunu açıklar. Kısa versiyonu: neredeyse hiçbir şey — her şey cihazınızda kalır.',
    items: [
      {
        h: 'Özgeçmiş verileriniz tarayıcınızda kalır',
        p: 'Oluşturucuya yazdığınız bilgiler — adınız, iletişim bilgileriniz, deneyiminiz ve eğitiminiz — yalnızca kendi cihazınızdaki tarayıcınızın yerel depolamasında saklanır. Bu verileri hiçbir sunucuya göndermiyoruz.',
      },
      {
        h: 'Hiçbir şey yüklenmez',
        p: 'Profil fotoğrafı gibi eklediğiniz dosyalar tarayıcınızda yerel olarak işlenir ve hiçbir yere yüklenmez. Bilgilerinizi tutan bir arka uç hesabı veya veritabanı yoktur.',
      },
      {
        h: 'Hesap yok, takip yok',
        p: 'Oluşturucuyu kullanmak için bir hesaba ihtiyacınız yok, bu nedenle ad, e-posta veya şifre toplamıyoruz. Sizi profilleyen reklam veya üçüncü taraf analiz araçları kullanmıyoruz.',
      },
      {
        h: 'İletişim',
        p: 'Bu politika veya verileriniz hakkında sorularınız varsa, Hakkında sayfasındaki iletişim bilgileri aracılığıyla bize ulaşabilirsiniz.',
      },
    ],
  },
  notFound: {
    title: 'Sayfa bulunamadı',
    text: 'Aradığınız sayfa mevcut değil veya taşınmış.',
    button: 'Ana sayfaya dön',
  },
  builder: {
    title: 'Özgeçmişinizi Oluşturun',
    metaDesc: 'Canlı önizlemeli ücretsiz özgeçmiş oluşturucu. Bilgilerinizi girin, bir şablon seçin, PDF indirin — kayıt yok.',
    templateTitle: 'Bir şablon seçin',
    templateSubtitle: 'Bir tasarım seçin — istediğiniz zaman değiştirebilirsiniz.',
    templates: {
      minimal: { name: 'Minimal', desc: 'Temiz ve basit, maksimum okunabilirlik.' },
      professional: { name: 'Profesyonel', desc: 'Kurumsal roller için klasik yerleşim.' },
      modern: { name: 'Modern', desc: 'Cesur başlıklı ferah tasarım.' },
      classic: { name: 'Klasik', desc: 'Resmi sektörler için zamansız serif stili.' },
    },
    customizeTitle: 'Özelleştir',
    accentLabel: 'Vurgu rengi',
    fontLabel: 'Yazı tipi',
    fontOptions: { poppins: 'Poppins', inter: 'Inter', serif: 'Serif' },
    showPhotoLabel: 'Fotoğrafı göster',
    sections: {
      personal: 'Kişisel Bilgiler',
      summary: 'Profesyonel Özet',
      experience: 'İş Deneyimi',
      education: 'Eğitim',
      skills: 'Beceriler',
      languages: 'Diller',
      custom: 'Özel Bölümler',
    },
    personal: {
      fullName: 'Ad Soyad',
      jobTitle: 'Ünvan',
      email: 'E-posta',
      phone: 'Telefon',
      location: 'Konum',
      photo: 'Fotoğraf',
      photoUpload: 'Fotoğraf yükle',
      photoChange: 'Fotoğrafı değiştir',
      photoRemove: 'Kaldır',
    },
    summary: {
      label: 'Özet',
      placeholder: 'Deneyiminiz, güçlü yönleriniz ve kariyer hedefleriniz hakkında kısa bir paragraf…',
    },
    experience: {
      add: 'Deneyim ekle',
      jobTitle: 'Ünvan',
      company: 'Şirket',
      startDate: 'Başlangıç tarihi',
      endDate: 'Bitiş tarihi',
      present: 'Devam ediyor',
      description: 'Açıklama',
      descriptionHint: 'Satır başına bir başarı',
      remove: 'Kaldır',
      moveUp: 'Yukarı taşı',
      moveDown: 'Aşağı taşı',
    },
    education: {
      add: 'Eğitim ekle',
      degree: 'Derece / Yeterlilik',
      school: 'Okul / Üniversite',
      year: 'Yıl',
      remove: 'Kaldır',
      moveUp: 'Yukarı taşı',
      moveDown: 'Aşağı taşı',
    },
    skills: {
      label: 'Beceriler',
      hint: 'Becerileri virgülle ayırın',
      placeholder: 'örn. İletişim, JavaScript, Proje Yönetimi',
    },
    languages: {
      label: 'Diller',
      hint: 'Dilleri virgülle ayırın',
      placeholder: 'örn. İngilizce, Hintçe, İspanyolca',
    },
    custom: {
      addSection: 'Özel bölüm ekle',
      sectionTitle: 'Bölüm başlığı',
      typeLabel: 'Tür',
      typeText: 'Metin',
      typeBullets: 'Madde işaretleri',
      contentLabel: 'İçerik',
      remove: 'Bölümü kaldır',
    },
    actions: {
      downloadPdf: 'PDF İndir',
      fillSample: 'Örnek veri doldur',
      clear: 'Tümünü temizle',
      saved: 'Kaydedildi',
      confirmClear: 'Tüm verileri temizlemek istediğinize emin misiniz?',
    },
    tabs: {
      edit: 'Düzenle',
      preview: 'Önizleme',
    },
    previewTitle: 'Canlı önizleme',
  },
};

export default tr;
