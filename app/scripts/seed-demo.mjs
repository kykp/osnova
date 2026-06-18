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

async function svgToPng(svg) {
  return sharp(Buffer.from(svg)).png().toBuffer()
}

async function jpegPlaceholder(width, height, bg, fg, text) {
  const escaped = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const fontSize = Math.round(Math.min(width, height) / 9)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${bg}"/>
    <text x="${width / 2}" y="${height / 2 + fontSize / 3}" font-family="Arial,Helvetica,sans-serif"
          font-size="${fontSize}" font-weight="700" fill="${fg}" text-anchor="middle">${escaped}</text>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

async function uploadImage(name, buffer, alt) {
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype: 'image/png', name, size: buffer.length },
    overrideAccess: true,
  })
}

function makePdf(title) {
  const escape = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  const lines = [
    `Это демо-документ: ${title}`,
    '',
    'Сгенерирован сидером для проверки блока «Документы».',
  ]

  const stream =
    `BT /F1 18 Tf 72 740 Td (${escape(lines[0])}) Tj ET\n` +
    `BT /F1 12 Tf 72 700 Td (${escape(lines[2])}) Tj ET`
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
  parts.push(Buffer.from(`trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`, 'binary'))

  return Buffer.concat(parts)
}

async function uploadPdf(name, title) {
  const buffer = makePdf(title)
  return payload.create({
    collection: 'documents',
    data: {
      title,
      description: 'Демонстрационный документ. Создан сидером для проверки блока.',
      publishedAt: new Date().toISOString(),
    },
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
    const list = await payload.find({
      collection,
      where: collection === 'pages' ? { slug: { equals: DEMO_PAGE_SLUG } } : {},
      limit: 1000,
      overrideAccess: true,
    })
    const matchDemo = (d) => {
      if (collection === 'pages') return d.slug === DEMO_PAGE_SLUG
      if (collection === 'news') return d.slug?.startsWith('demo-')
      if (collection === 'documents') return d.filename?.startsWith('demo-')
      if (collection === 'staff') return d.firstName === 'Демо' || d.lastName?.startsWith('Демо')
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
  await teardown() // idempotent
  console.log('Seeding demo…')

  /* 1. Media */
  console.log('Uploading media…')
  const cardImg1 = await uploadImage(
    'demo-card-1.png',
    await jpegPlaceholder(800, 600, '#2563eb', 'white', 'Услуга 1'),
    'Демо-картинка плитки 1',
  )
  const cardImg2 = await uploadImage(
    'demo-card-2.png',
    await jpegPlaceholder(800, 600, '#7c3aed', 'white', 'Услуга 2'),
    'Демо-картинка плитки 2',
  )
  const cardImg3 = await uploadImage(
    'demo-card-3.png',
    await jpegPlaceholder(800, 600, '#0891b2', 'white', 'Услуга 3'),
    'Демо-картинка плитки 3',
  )

  const photo1 = await uploadImage(
    'demo-photo-1.png',
    await jpegPlaceholder(400, 400, '#94a3b8', 'white', 'А.К.'),
    'Анна Котова, фото',
  )
  const photo2 = await uploadImage(
    'demo-photo-2.png',
    await jpegPlaceholder(400, 400, '#64748b', 'white', 'М.С.'),
    'Михаил Седов, фото',
  )
  const photo3 = await uploadImage(
    'demo-photo-3.png',
    await jpegPlaceholder(400, 400, '#475569', 'white', 'Е.Л.'),
    'Елена Лоскутова, фото',
  )

  const partner1 = await uploadImage(
    'demo-partner-1.png',
    await jpegPlaceholder(400, 200, '#f3f4f6', '#374151', 'ALPHA'),
    'Партнёр Alpha',
  )
  const partner2 = await uploadImage(
    'demo-partner-2.png',
    await jpegPlaceholder(400, 200, '#f3f4f6', '#374151', 'BETA'),
    'Партнёр Beta',
  )
  const partner3 = await uploadImage(
    'demo-partner-3.png',
    await jpegPlaceholder(400, 200, '#f3f4f6', '#374151', 'GAMMA'),
    'Партнёр Gamma',
  )
  const partner4 = await uploadImage(
    'demo-partner-4.png',
    await jpegPlaceholder(400, 200, '#f3f4f6', '#374151', 'DELTA'),
    'Партнёр Delta',
  )
  const partner5 = await uploadImage(
    'demo-partner-5.png',
    await jpegPlaceholder(400, 200, '#f3f4f6', '#374151', 'OMEGA'),
    'Партнёр Omega',
  )

  const newsCover1 = await uploadImage(
    'demo-news-1.png',
    await jpegPlaceholder(1200, 750, '#16a34a', 'white', 'Новость 1'),
    'Обложка новости 1',
  )
  const newsCover2 = await uploadImage(
    'demo-news-2.png',
    await jpegPlaceholder(1200, 750, '#ea580c', 'white', 'Новость 2'),
    'Обложка новости 2',
  )
  const newsCover3 = await uploadImage(
    'demo-news-3.png',
    await jpegPlaceholder(1200, 750, '#0ea5e9', 'white', 'Новость 3'),
    'Обложка новости 3',
  )

  const slide1 = await uploadImage(
    'demo-slide-1.png',
    await jpegPlaceholder(1600, 900, '#1e3a8a', 'white', 'Слайд 1'),
    'Слайд 1',
  )
  const slide2 = await uploadImage(
    'demo-slide-2.png',
    await jpegPlaceholder(1600, 900, '#831843', 'white', 'Слайд 2'),
    'Слайд 2',
  )
  const slide3 = await uploadImage(
    'demo-slide-3.png',
    await jpegPlaceholder(1600, 900, '#064e3b', 'white', 'Слайд 3'),
    'Слайд 3',
  )

  const imageBlockImg = await uploadImage(
    'demo-image.png',
    await jpegPlaceholder(1400, 900, '#334155', 'white', 'Фотография'),
    'Иллюстрация раздела',
  )

  const ctaBg = await uploadImage(
    'demo-cta-bg.png',
    await jpegPlaceholder(1600, 600, '#0f172a', '#cbd5e1', 'Фон CTA'),
    'Фон CTA',
  )

  /* 2. Staff */
  console.log('Creating staff…')
  await payload.create({
    collection: 'staff',
    data: {
      lastName: 'Котова',
      firstName: 'Анна',
      middleName: 'Викторовна',
      position: 'Руководитель направления',
      bio: 'Возглавляет направление работы с клиентами с 2018 года. Отвечает за стратегию развития и обучение команды.',
      photo: photo1.id,
      sortOrder: 10,
    },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'staff',
    data: {
      lastName: 'Седов',
      firstName: 'Михаил',
      middleName: 'Александрович',
      position: 'Главный специалист',
      bio: 'Эксперт по техническим вопросам. В компании 8 лет.',
      photo: photo2.id,
      sortOrder: 20,
    },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'staff',
    data: {
      lastName: 'Лоскутова',
      firstName: 'Елена',
      middleName: 'Сергеевна',
      position: 'Менеджер по работе с клиентами',
      bio: 'Отвечает за поддержку клиентов и координацию работы внутренних команд.',
      photo: photo3.id,
      sortOrder: 30,
    },
    overrideAccess: true,
  })

  /* 3. News (published) */
  console.log('Creating news…')
  await payload.create({
    collection: 'news',
    data: {
      title: 'Открытие нового направления',
      slug: 'demo-otkrytie-napravleniya',
      excerpt: 'С 1 сентября мы запускаем новое направление работы для клиентов из регионов.',
      cover: newsCover1.id,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      _status: 'published',
    },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'news',
    data: {
      title: 'Победа в отраслевом конкурсе',
      slug: 'demo-pobeda-v-konkurse',
      excerpt: 'Наша команда заняла первое место в номинации «Лучший продукт года».',
      cover: newsCover2.id,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      _status: 'published',
    },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'news',
    data: {
      title: 'Расписание работы на ноябрь',
      slug: 'demo-raspisanie-na-noyabr',
      excerpt: 'Публикуем график работы офиса на ноябрь. Просим обратить внимание на даты праздничных дней.',
      cover: newsCover3.id,
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      _status: 'published',
    },
    overrideAccess: true,
  })

  /* 4. Documents */
  console.log('Creating documents…')
  await uploadPdf('demo-ustav.pdf', 'Устав организации')
  await uploadPdf('demo-polozhenie.pdf', 'Положение о работе')
  await uploadPdf('demo-otchet.pdf', 'Отчёт о деятельности за 2025 год')

  /* 5. The page itself */
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
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
          direction: 'ltr',
          textFormat: 0,
        },
      ],
      direction: 'ltr',
    },
  })

  const layout = [
    {
      blockType: 'hero',
      heading: 'Добро пожаловать в демо-витрину Osnova',
      subheading: 'На этой странице собраны все блоки конструктора — посмотри, как они выглядят живьём, и собирай свой сайт из тех же кубиков.',
      cta: { label: 'Узнать больше', url: '#process' },
    },
    {
      blockType: 'process',
      heading: 'Как мы работаем',
      subheading: 'Понятный путь от первого касания до результата.',
      variant: 'horizontal',
      steps: [
        { title: 'Знакомство', description: 'Обсуждаем задачу и собираем требования.', icon: '☎️' },
        { title: 'Подготовка', description: 'Готовим план и согласовываем сроки.', icon: '📋' },
        { title: 'Реализация', description: 'Делаем работу, держим в курсе.', icon: '⚙️' },
        { title: 'Запуск', description: 'Передаём результат и сопровождаем.', icon: '🚀' },
      ],
    },
    {
      blockType: 'features',
      heading: 'Преимущества',
      subheading: 'Что вы получаете, работая с нами.',
      variant: 'icons-grid',
      items: [
        { icon: '🚀', title: 'Быстрый старт', description: 'Запускаем работу в течение 24 часов после оплаты.' },
        { icon: '💎', title: 'Прозрачные цены', description: 'Никаких скрытых платежей и доплат «по ходу проекта».' },
        { icon: '🛡️', title: 'Гарантия результата', description: 'Возвращаем деньги, если результат не достигнут.' },
        { icon: '⚡', title: 'Поддержка 24/7', description: 'Отвечаем на запросы в любое время суток.' },
      ],
    },
    {
      blockType: 'cards',
      heading: 'Наши услуги',
      items: [
        { title: 'Консультация', description: 'Очная встреча или онлайн-разбор задачи.', image: cardImg1.id },
        { title: 'Сопровождение', description: 'Регулярная работа над проектом «под ключ».', image: cardImg2.id },
        { title: 'Аудит', description: 'Глубокий анализ текущего состояния и план действий.', image: cardImg3.id },
      ],
    },
    {
      blockType: 'stats',
      heading: 'Цифры о нас',
      items: [
        { value: '15+', label: 'лет на рынке' },
        { value: '500+', label: 'выполненных проектов' },
        { value: '98%', label: 'клиентов возвращаются' },
        { value: '12', label: 'специалистов в команде' },
      ],
    },
    {
      blockType: 'testimonials',
      heading: 'Что говорят клиенты',
      variant: 'cards',
      items: [
        {
          quote: 'Работали с командой на протяжении полутора лет — за это время ни одного срыва сроков. Рекомендуем.',
          author: 'Александр Михайлов',
          role: 'Директор по развитию, ООО «Прогресс»',
          photo: photo1.id,
        },
        {
          quote: 'Подход «всё под ключ» помог нам сосредоточиться на основном бизнесе. Очень благодарны.',
          author: 'Ирина Краснова',
          role: 'Управляющий партнёр, «Краснов и партнёры»',
          photo: photo2.id,
        },
      ],
    },
    {
      blockType: 'team',
      heading: 'Команда',
      subheading: 'Люди, с которыми вы будете работать.',
      limit: 0,
    },
    {
      blockType: 'partners',
      heading: 'Нам доверяют',
      items: [
        { logo: partner1.id, name: 'Alpha' },
        { logo: partner2.id, name: 'Beta' },
        { logo: partner3.id, name: 'Gamma' },
        { logo: partner4.id, name: 'Delta' },
        { logo: partner5.id, name: 'Omega' },
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
      heading: 'Документы',
      limit: 5,
    },
    {
      blockType: 'faq',
      heading: 'Частые вопросы',
      items: [
        {
          question: 'Сколько стоит работа?',
          answer: 'Стоимость зависит от объёма задачи. После короткой консультации мы пришлём смету.',
        },
        {
          question: 'Сколько времени занимает запуск?',
          answer: 'От 1 до 4 недель в зависимости от сложности. Точный срок согласуем после знакомства.',
        },
        {
          question: 'Можно ли оплатить частями?',
          answer: 'Да, типовая схема — 50% предоплата, 50% после сдачи. Для крупных проектов разбиваем на этапы.',
        },
        {
          question: 'Работаете ли вы с другими регионами?',
          answer: 'Да, работаем удалённо со всей Россией и странами СНГ.',
        },
      ],
    },
    {
      blockType: 'video',
      heading: 'Короткое видео о нас',
      provider: 'youtube',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ratio: '16:9',
      caption: 'Демо-видео для проверки блока.',
    },
    {
      blockType: 'slider',
      heading: 'Галерея',
      autoplay: true,
      slides: [
        { image: slide1.id, caption: 'Первый слайд' },
        { image: slide2.id, caption: 'Второй слайд' },
        { image: slide3.id, caption: 'Третий слайд' },
      ],
    },
    {
      blockType: 'image',
      image: imageBlockImg.id,
      caption: 'Пример отдельной картинки с подписью',
    },
    {
      blockType: 'richText',
      content: lex(
        'Это блок «Контент — Текст». Сюда удобно положить длинный абзац: миссию, историю организации, юридическую информацию. В реальной странице это будет полноценный редактор с заголовками, списками и форматированием.',
      ),
    },
    {
      blockType: 'contacts',
      heading: 'Контакты',
      address: 'Москва, ул. Тверская, 1',
      mapProvider: 'yandex',
      mapZoom: 15,
      showSettingsContacts: true,
      workingHours: 'Пн–Пт: 9:00–18:00\nСб–Вс: выходной',
    },
    {
      blockType: 'contactForm',
      heading: 'Оставьте заявку',
      description: 'Мы свяжемся с вами в ближайшее время.',
      showMessageField: true,
      submitLabel: 'Отправить',
      successMessage: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
      consentText: 'Я согласен на обработку персональных данных',
      consentPolicyUrl: '',
    },
    {
      blockType: 'cta',
      heading: 'Готовы начать?',
      subheading: 'Заполните форму выше или напишите нам напрямую — ответим в течение часа.',
      button: { label: 'Связаться сейчас', url: '#contactForm' },
      background: ctaBg.id,
    },
  ]

  const page = await payload.create({
    collection: 'pages',
    data: {
      title: 'Демо-главная',
      slug: DEMO_PAGE_SLUG,
      layout,
      meta: {
        title: 'Демо-главная Osnova',
        description: 'Демонстрация всех блоков конструктора страниц на одной странице.',
      },
      _status: 'published',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'settings',
    data: { homePage: page.id },
    overrideAccess: true,
  })

  console.log('Done. Demo page id:', page.id, '— set as Settings.homePage.')
  console.log('Open http://localhost:3000/')
}

if (action === 'setup') await setup()
else if (action === 'teardown') await teardown()
else throw new Error(`Unknown action: ${action}. Use setup | teardown.`)

process.exit(0)
