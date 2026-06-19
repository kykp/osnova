/* eslint-disable no-console */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const projectRoot = path.resolve(path.dirname(filename), '..')
process.chdir(projectRoot)
const configMod = await import(path.join(projectRoot, 'src/payload.config.ts'))
const config = await configMod.default

const action = process.argv[2] || 'setup'
const DEMO_PAGE_SLUG = 'demo-glavnaya'

const payload = await getPayload({ config })

/* ─────────── helpers ─────────── */

async function fetchBytes(url) {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function fetchPicsum(seedKey, w, h) {
  const url = `https://picsum.photos/seed/${encodeURIComponent(seedKey)}/${w}/${h}`
  const raw = await fetchBytes(url)
  return sharp(raw).jpeg({ quality: 80 }).toBuffer()
}

async function fetchAvatar(id, size = 480) {
  const url = `https://i.pravatar.cc/${size}?img=${id}`
  return fetchBytes(url)
}

async function aerocharterLogoPng() {
  // Логотип со стилизованным самолётом + текст «Aerocharter»
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 140">
    <g transform="translate(20, 30)" fill="none" stroke="#0a0a0b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M88 64v-8L52 36V19a6 6 0 0 0-12 0v17L4 56v8l36-10v22l-9 6v6l15-4 15 4v-6l-9-6V54z" />
    </g>
    <text x="120" y="92"
          font-family="-apple-system,BlinkMacSystemFont,'Inter',Arial,sans-serif"
          font-size="58" font-weight="800" fill="#0a0a0b" letter-spacing="-1.2">Aerocharter</text>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

async function wordmarkPng(name) {
  const w = 480
  const h = 160
  const fontSize = Math.max(24, Math.min(46, Math.round((w * 1.4) / Math.max(name.length, 6))))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
    <text x="${w / 2}" y="${h / 2 + fontSize * 0.36}"
          font-family="-apple-system,BlinkMacSystemFont,'Inter',Arial,sans-serif"
          font-size="${fontSize}" font-weight="800" fill="#0a0a0b"
          text-anchor="middle" letter-spacing="-0.5">${name}</text>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

async function uploadImage(name, buffer, alt, mimetype = 'image/jpeg') {
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype, name, size: buffer.length },
    overrideAccess: true,
  })
}

function makePdf(title) {
  const escape = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  const stream =
    `BT /F1 18 Tf 72 740 Td (${escape(title)}) Tj ET\n` +
    `BT /F1 12 Tf 72 700 Td (${escape('Демонстрационный документ Aerocharter')}) Tj ET`
  const streamBuf = Buffer.from(stream, 'binary')

  const parts = []
  const offsets = []
  function push(str) {
    offsets.push(parts.reduce((s, b) => s + b.length, 0))
    parts.push(Buffer.from(str, 'binary'))
  }

  parts.push(Buffer.from('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n', 'binary'))
  push('1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n')
  push('2 0 obj\n<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj\n')
  push(
    '3 0 obj\n<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]' +
      '/Resources<</Font<</F1 5 0 R>>>>/Contents 4 0 R>>\nendobj\n',
  )
  push(`4 0 obj\n<</Length ${streamBuf.length}>>\nstream\n${stream}\nendstream\nendobj\n`)
  push('5 0 obj\n<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>\nendobj\n')

  const xrefStart = parts.reduce((s, b) => s + b.length, 0)
  let xref = 'xref\n0 6\n0000000000 65535 f \n'
  for (const off of offsets) xref += off.toString().padStart(10, '0') + ' 00000 n \n'
  parts.push(Buffer.from(xref, 'binary'))
  parts.push(
    Buffer.from(`trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`, 'binary'),
  )

  return Buffer.concat(parts)
}

async function uploadPdf(name, title, description) {
  const buffer = makePdf(title)
  return payload.create({
    collection: 'documents',
    data: { title, description, publishedAt: new Date().toISOString() },
    file: { data: buffer, mimetype: 'application/pdf', name, size: buffer.length },
    overrideAccess: true,
  })
}

/* ─────────── teardown ─────────── */

async function teardown() {
  console.log('Cleaning demo data…')
  await payload.updateGlobal({
    slug: 'settings',
    data: { homePage: null },
    overrideAccess: true,
  })
  for (const collection of ['pages', 'news', 'documents', 'staff', 'form-submissions']) {
    const list = await payload.find({ collection, limit: 1000, overrideAccess: true })
    const matchDemo = (d) => {
      if (collection === 'pages') return d.slug === DEMO_PAGE_SLUG
      if (collection === 'news') return d.slug?.startsWith('demo-')
      if (collection === 'documents') return d.filename?.startsWith('demo-')
      if (collection === 'staff') return d.lastName === 'Демо' || d.firstName === 'Демо' ||
        ['Орлов', 'Соколова', 'Ястребов', 'Кречетова'].includes(d.lastName)
      if (collection === 'form-submissions') return d.source === 'demo'
      return false
    }
    for (const doc of list.docs) {
      if (!matchDemo(doc)) continue
      await payload.delete({ collection, id: doc.id, overrideAccess: true })
      console.log('  deleted', collection, doc.id)
    }
  }
  const media = await payload.find({
    collection: 'media',
    where: { filename: { like: 'demo-' } },
    limit: 1000,
    overrideAccess: true,
  })
  for (const m of media.docs) {
    if (!m.filename?.startsWith('demo-')) continue
    await payload.delete({ collection: 'media', id: m.id, overrideAccess: true })
    console.log('  deleted media', m.filename)
  }
  console.log('Done.')
}

/* ─────────── setup ─────────── */

async function setup() {
  await teardown()
  console.log('Seeding Aerocharter demo…')

  /* 1. Media */
  console.log('Fetching images (picsum.photos + pravatar.cc)…')
  const cardImg1 = await uploadImage(
    'demo-card-1.jpg',
    await fetchPicsum('aerocharter-business-jet', 1200, 900),
    'Бизнес-джет на стоянке',
  )
  const cardImg2 = await uploadImage(
    'demo-card-2.jpg',
    await fetchPicsum('aerocharter-helicopter', 1200, 900),
    'Вертолёт над городом',
  )
  const cardImg3 = await uploadImage(
    'demo-card-3.jpg',
    await fetchPicsum('aerocharter-group', 1200, 900),
    'Кабина самолёта',
  )

  const photo1 = await uploadImage(
    'demo-photo-1.jpg',
    await fetchAvatar(15),
    'Анна Котова, фото',
  )
  const photo2 = await uploadImage(
    'demo-photo-2.jpg',
    await fetchAvatar(33),
    'Михаил Седов, фото',
  )
  const photo3 = await uploadImage(
    'demo-photo-3.jpg',
    await fetchAvatar(47),
    'Елена Лоскутова, фото',
  )
  const photo4 = await uploadImage(
    'demo-photo-4.jpg',
    await fetchAvatar(53),
    'Дмитрий Ястребов, фото',
  )

  console.log('Generating partner wordmarks…')
  const partner1 = await uploadImage(
    'demo-partner-1.png',
    await wordmarkPng('Aerocharter'),
    'Aerocharter Group',
    'image/png',
  )
  const partner2 = await uploadImage(
    'demo-partner-2.png',
    await wordmarkPng('SkyJet'),
    'SkyJet',
    'image/png',
  )
  const partner3 = await uploadImage(
    'demo-partner-3.png',
    await wordmarkPng('Cloud9'),
    'Cloud9 Aviation',
    'image/png',
  )
  const partner4 = await uploadImage(
    'demo-partner-4.png',
    await wordmarkPng('Aurora Air'),
    'Aurora Air',
    'image/png',
  )
  const partner5 = await uploadImage(
    'demo-partner-5.png',
    await wordmarkPng('Polaris'),
    'Polaris Aviation',
    'image/png',
  )

  const newsCover1 = await uploadImage(
    'demo-news-1.jpg',
    await fetchPicsum('aerocharter-news-fleet', 1600, 1000),
    'Обновление флота',
  )
  const newsCover2 = await uploadImage(
    'demo-news-2.jpg',
    await fetchPicsum('aerocharter-news-route', 1600, 1000),
    'Новый маршрут',
  )
  const newsCover3 = await uploadImage(
    'demo-news-3.jpg',
    await fetchPicsum('aerocharter-news-cabin', 1600, 1000),
    'Обновление салонов',
  )

  const slide1 = await uploadImage(
    'demo-slide-1.jpg',
    await fetchPicsum('aerocharter-slide-takeoff', 1920, 1080),
    'Взлёт',
  )
  const slide2 = await uploadImage(
    'demo-slide-2.jpg',
    await fetchPicsum('aerocharter-slide-cabin-luxury', 1920, 1080),
    'Салон бизнес-класса',
  )
  const slide3 = await uploadImage(
    'demo-slide-3.jpg',
    await fetchPicsum('aerocharter-slide-sunset', 1920, 1080),
    'Полёт на закате',
  )

  const imageBlockImg = await uploadImage(
    'demo-image.jpg',
    await fetchPicsum('aerocharter-hangar-interior', 1600, 1000),
    'Интерьер ангара',
  )

  const ctaBg = await uploadImage(
    'demo-cta-bg.jpg',
    await fetchPicsum('aerocharter-night-runway', 1920, 800),
    'Ночная взлётная полоса',
  )

  /* 1b. Brand: logo + siteTitle в Settings */
  console.log('Updating brand…')
  const brandLogo = await uploadImage(
    'demo-brand-aerocharter.png',
    await aerocharterLogoPng(),
    'Aerocharter — логотип',
    'image/png',
  )

  /* 2. Staff */
  console.log('Creating staff…')
  await payload.create({
    collection: 'staff',
    data: {
      lastName: 'Орлов',
      firstName: 'Артём',
      middleName: 'Сергеевич',
      position: 'Командир воздушного судна',
      bio: 'Налёт более 12 000 часов. Сертификаты на бизнес-джеты Gulfstream, Bombardier, Embraer.',
      photo: photo1.id,
      sortOrder: 10,
    },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'staff',
    data: {
      lastName: 'Соколова',
      firstName: 'Мария',
      middleName: 'Александровна',
      position: 'Руководитель департамента продаж',
      bio: 'Отвечает за корпоративные контракты и индивидуальные программы перелётов.',
      photo: photo2.id,
      sortOrder: 20,
    },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'staff',
    data: {
      lastName: 'Ястребов',
      firstName: 'Дмитрий',
      middleName: 'Викторович',
      position: 'Главный инженер',
      bio: 'Контроль технического состояния флота, регламентные работы, сертификация.',
      photo: photo4.id,
      sortOrder: 30,
    },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'staff',
    data: {
      lastName: 'Кречетова',
      firstName: 'Ольга',
      middleName: 'Игоревна',
      position: 'Старший бортпроводник',
      bio: '15 лет в премиум-сегменте. Координирует команду кабины и сервис на борту.',
      photo: photo3.id,
      sortOrder: 40,
    },
    overrideAccess: true,
  })

  /* 3. News */
  console.log('Creating news…')
  await payload.create({
    collection: 'news',
    data: {
      title: 'Пополнение флота: новый Gulfstream G650 встал на линию',
      slug: 'demo-novyy-gulfstream',
      excerpt:
        'С октября в распоряжении клиентов Aerocharter — флагманский дальнемагистральный бизнес-джет. Дальность 12 000 км без посадки.',
      cover: newsCover1.id,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      _status: 'published',
    },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'news',
    data: {
      title: 'Открыт регулярный маршрут Москва — Сочи на бизнес-джете',
      slug: 'demo-marshrut-sochi',
      excerpt:
        'Расписание: пятница вечер и воскресенье вечер. Стоимость места — от 280 000 ₽. Возможен групповой выкуп.',
      cover: newsCover2.id,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      _status: 'published',
    },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'news',
    data: {
      title: 'Обновление салонов: новые кресла Iacobucci и Wi-Fi на борту',
      slug: 'demo-obnovlenie-salonov',
      excerpt:
        'Закончили модернизацию салонов всех Embraer Legacy в парке. Скорость интернета 25 Мбит/с на пассажира.',
      cover: newsCover3.id,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      _status: 'published',
    },
    overrideAccess: true,
  })

  /* 4. Documents */
  console.log('Creating documents…')
  await uploadPdf(
    'demo-litsenziya.pdf',
    'Сертификат эксплуатанта',
    'Действующий сертификат коммерческого эксплуатанта (СЭ).',
  )
  await uploadPdf(
    'demo-bezopasnost.pdf',
    'Отчёт по безопасности полётов за 2025 год',
    'Сводный отчёт системы менеджмента безопасности (SMS).',
  )
  await uploadPdf(
    'demo-flot.pdf',
    'Описание парка воздушных судов',
    'Перечень и характеристики самолётов и вертолётов в эксплуатации.',
  )

  /* 5. Page layout */
  console.log('Creating page…')
  const lex = (text) => ({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
          ],
          direction: 'ltr',
          textFormat: 0,
        },
      ],
      direction: 'ltr',
    },
  })

  const txt = (text, format = 0) => ({
    type: 'text',
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  })
  const para = (text) => ({
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    textFormat: 0,
    children: [txt(text)],
  })
  const head = (tag, text) => ({
    type: 'heading',
    tag,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [txt(text)],
  })
  const li = (text, value) => ({
    type: 'listitem',
    value,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [txt(text)],
  })
  const ul = (...items) => ({
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    start: 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: items.map((t, i) => li(t, i + 1)),
  })
  const quote = (text) => ({
    type: 'quote',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [txt(text)],
  })
  const richArticle = (nodes) => ({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: nodes,
    },
  })

  const layout = [
    {
      blockType: 'hero',
      heading: 'Частные перелёты без аэропортов и очередей',
      subheading:
        'Aerocharter — аренда бизнес-джетов и вертолётов по всей России. Подача в течение трёх часов после подтверждения, флот собственный, экипажи штатные.',
      cta: { label: 'Рассчитать перелёт', url: '#contactForm' },
    },
    {
      blockType: 'process',
      heading: 'Как мы работаем',
      subheading: 'От заявки до взлёта проходит несколько часов, а не дней.',
      variant: 'horizontal',
      steps: [
        { title: 'Заявка', description: 'Сообщаете маршрут, дату и количество пассажиров.', icon: '✈️' },
        { title: 'Расчёт', description: 'В течение 30 минут присылаем 2–3 варианта борта со ставками.', icon: '📊' },
        { title: 'Подтверждение', description: 'Подписываем договор и принимаем 50% предоплату.', icon: '✅' },
        { title: 'Вылет', description: 'Подача борта на любую полосу в радиусе 3 часов от центра.', icon: '🛫' },
      ],
    },
    {
      blockType: 'features',
      heading: 'Почему клиенты выбирают Aerocharter',
      subheading: 'Не «возим самолётами» — выстраиваем перелёт под конкретную задачу.',
      variant: 'icons-grid',
      items: [
        { icon: '⚡', title: 'Скорость подачи', description: 'Борт готов к вылету через 2–3 часа после подтверждения, в любое время суток.' },
        { icon: '🛡️', title: 'Своя служба безопасности', description: 'Полный SMS-аудит, страхование пассажиров и груза, медицинское сопровождение по запросу.' },
        { icon: '🌐', title: 'География без границ', description: 'Полёты по СНГ, ЕС, Ближнему Востоку и Юго-Восточной Азии. Допуски на 60+ стран.' },
        { icon: '🔒', title: 'Конфиденциальность', description: 'NDA по умолчанию, отдельные терминалы вылета, без публикации пассажирского списка.' },
      ],
    },
    {
      blockType: 'cards',
      heading: 'Что мы возим',
      items: [
        {
          title: 'Бизнес-джеты',
          description: 'Дальние и средне-магистральные борта на 6–14 пассажиров. Gulfstream, Bombardier, Embraer.',
          image: cardImg1.id,
        },
        {
          title: 'Вертолёты',
          description: 'Подача на любую согласованную площадку. Москва—Сочи—Минводы—Калининград и не только.',
          image: cardImg2.id,
        },
        {
          title: 'Групповые рейсы',
          description: 'Полный выкуп борта от 12 до 100 мест: корпоративы, спортивные команды, делегации.',
          image: cardImg3.id,
        },
      ],
    },
    {
      blockType: 'stats',
      heading: 'Цифры о нас',
      items: [
        { value: '14', label: 'лет на рынке' },
        { value: '12 000+', label: 'выполненных рейсов' },
        { value: '60+', label: 'стран в географии полётов' },
        { value: '98%', label: 'клиентов возвращаются' },
      ],
    },
    {
      blockType: 'testimonials',
      heading: 'Что говорят клиенты',
      variant: 'cards',
      items: [
        {
          quote:
            'Сорвалась последняя встреча в Стамбуле — Aerocharter поднял борт за 2 часа 40 минут. К прилёту были уже готовы и хеликоптер до отеля, и переговорная.',
          author: 'Алексей Михайлов',
          role: 'CEO, инвестиционная группа «Север»',
          photo: photo1.id,
        },
        {
          quote:
            'Возили команду на матч в Минск. Восемь человек, оборудование, никаких очередей. Менеджер на связи 24/7 — даже в самолёте.',
          author: 'Ирина Краснова',
          role: 'Директор по PR, ФК «Восход»',
          photo: photo2.id,
        },
      ],
    },
    {
      blockType: 'team',
      heading: 'Команда',
      subheading: 'Пилоты, инженеры и менеджеры с многолетним опытом в премиум-сегменте.',
      limit: 0,
    },
    {
      blockType: 'partners',
      heading: 'Нас выбирают',
      items: [
        { logo: partner1.id, name: 'Aerocharter' },
        { logo: partner2.id, name: 'SkyJet' },
        { logo: partner3.id, name: 'Cloud9' },
        { logo: partner4.id, name: 'Aurora Air' },
        { logo: partner5.id, name: 'Polaris' },
      ],
    },
    {
      blockType: 'newsList',
      heading: 'Новости',
      limit: 3,
      allLinkLabel: 'Все новости →',
      allLinkUrl: '/news',
    },
    {
      blockType: 'documentsList',
      heading: 'Документы и лицензии',
      limit: 5,
    },
    {
      blockType: 'faq',
      heading: 'Частые вопросы',
      items: [
        {
          question: 'Сколько времени занимает подготовка борта?',
          answer:
            'От 2 до 4 часов в зависимости от маршрута и времени суток. В аэропорту базирования — от 90 минут.',
        },
        {
          question: 'Можно ли вылететь из любого аэропорта России?',
          answer:
            'Да, при наличии слотов и допусков. У нас есть готовые согласования с 200+ аэродромами по России и СНГ.',
        },
        {
          question: 'Какая стоимость лётного часа?',
          answer:
            'От 290 000 ₽ для лёгких вертолётов и от 720 000 ₽ для бизнес-джетов. Точную смету готовим под маршрут.',
        },
        {
          question: 'Берёте ли вы животных и крупный груз?',
          answer:
            'Да. Под животных — отдельный контейнер и ветеринар на борту по запросу. Груз — до 1 200 кг в багажном.',
        },
      ],
    },
    {
      blockType: 'video',
      heading: 'Один день из работы экипажа',
      provider: 'youtube',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ratio: '16:9',
      caption: 'Демонстрационное видео (заменить на свой ролик в админке).',
    },
    {
      blockType: 'slider',
      heading: 'Флот в кадре',
      autoplay: true,
      slides: [
        { image: slide1.id, caption: 'Взлётная полоса Внуково-3' },
        { image: slide2.id, caption: 'Салон Gulfstream G650' },
        { image: slide3.id, caption: 'Полёт на закате над Каспием' },
      ],
    },
    {
      blockType: 'image',
      image: imageBlockImg.id,
      caption: 'Собственный ангар в Москве — обслуживание парка 24/7',
    },
    {
      blockType: 'richText',
      content: richArticle([
        head('h2', 'Небо как продолжение офиса'),
        para(
          'Aerocharter начинался в 2011 году с одного борта и простой идеи: деловому человеку важнее всего время. С тех пор мы выполнили более двенадцати тысяч рейсов и научились собирать сложную логистику так, чтобы клиент видел только результат — поданный вовремя трап.',
        ),
        head('h3', 'Как мы работаем'),
        para(
          'За каждым клиентом закреплён личный диспетчер. Он знает ваши предпочтения, держит связь до посадки и решает вопросы, о которых вы можете даже не узнать: слоты, разрешения, погодные альтернативы.',
        ),
        ul(
          'Собственный сертификат эксплуатанта — без посредников между вами и бортом',
          'Прозрачное ценообразование: смета совпадает с договором',
          'Дежурные борты в трёх городах и доступ к мировому флоту партнёров',
        ),
        quote(
          'Мы продаём не километры, а уверенность в том, что вы будете там, где нужно, точно в срок.',
        ),
        head('h4', 'Безопасность прежде всего'),
        para(
          'Каждый рейс проходит двойной контроль готовности, а пилоты регулярно подтверждают допуски на тренажёрах. Подробности — в разделе документов.',
        ),
      ]),
    },
    {
      blockType: 'contacts',
      heading: 'Связаться с нами',
      address: 'Москва, аэропорт Внуково-3, терминал «Премьер»',
      mapProvider: 'yandex',
      mapZoom: 15,
      showSettingsContacts: true,
      workingHours: 'Дежурный диспетчер — 24/7\nОфис — Пн–Пт, 9:00–20:00',
    },
    {
      blockType: 'contactForm',
      heading: 'Запрос на перелёт',
      description:
        'Опишите маршрут и дату — пришлём расчёт в течение 30 минут. Конфиденциально.',
      showMessageField: true,
      submitLabel: 'Отправить запрос',
      successMessage: 'Спасибо! Менеджер свяжется с вами в течение 15 минут.',
      consentText: 'Я согласен на обработку персональных данных',
      consentPolicyUrl: '',
    },
    {
      blockType: 'cta',
      heading: 'Готовы к вылету?',
      subheading: 'Заявку можно оставить в любое время — диспетчер на связи круглосуточно.',
      button: { label: 'Связаться сейчас', url: '#contactForm' },
      background: ctaBg.id,
    },
  ]

  const page = await payload.create({
    collection: 'pages',
    data: {
      title: 'Aerocharter — демо',
      slug: DEMO_PAGE_SLUG,
      layout,
      meta: {
        title: 'Aerocharter — частная авиация, аренда бизнес-джетов и вертолётов',
        description:
          'Демо-главная страница на Osnova: показывает, как из 18 блоков собирается реальный лендинг частной авиакомпании.',
      },
      _status: 'published',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'settings',
    data: {
      homePage: page.id,
      logo: brandLogo.id,
      siteTitle: 'Aerocharter',
      siteDescription:
        'Aerocharter — аренда бизнес-джетов и вертолётов. Подача борта в течение 3 часов, флот собственный, поддержка 24/7.',
      contactPhone: '+7 495 000-00-00',
      contactEmail: 'fly@aerocharter.demo',
    },
    overrideAccess: true,
  })

  console.log('Done. Demo page id:', page.id)
  console.log('Open http://localhost:3000/')
}

if (action === 'setup') await setup()
else if (action === 'teardown') await teardown()
else throw new Error(`Unknown action: ${action}. Use setup | teardown.`)

process.exit(0)
