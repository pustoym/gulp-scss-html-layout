# Гайд по работе со сборкой
1. HTML комплируется из компонентов плагином `gulp-file-include`
1. PNG \ JPG автоматически не ужимаются, webp не создается.
При необходимости используйте `npm run webp` и `npm run imagemin`
Webp - создание в source, imagemin - оптимизация в build
3. Добавлены дополнительные вотчеры, чтобы при изменении js и картинок не приходилось перезапускать сборку


## Gulp-file-include
Позволяет передавать переменные в html-инклюды

❗ Важное уточнение. Если проект крупный, множестно расширяемых компонентов — используй `pug` или другой шаблонизатор, заточенный под такие задачи. Этот плагин не решит тех задач, которые стоят перед шаблонизаторами.

### Стандартный include
Синтексис инклюда

```html
  @@include("source/html/components/card.html")
```

### Использования переменных.
Важно понимать, что `gulp-file-include` подчиняется законам javascript, но у него есть свои особенности и ограничения.

#### Объявление переменной
1. Локальное

```html
  @@include("source/html/components/card.html", {
    "title": "text",
    "mod": "tall"
  })
```

❗ Если внутри одного инклюда используется другой инклюд - переменная переданная в родителя не может быть прочитана у потомков. Чтобы решить эту проблему требуется создать цепочку передачи переменных.

```html
  @@include("source/html/components/card-child.html", {
    "title": "@@text"
  })
```

2. Глобальное

Глобальное объявление переменных доступно только в `gulpfile.js`, объявить глобальную переменную на страницу невозможно.

```js
  gulp.task(`html`, function () {
  return gulp.src([`source/html/*.html`])
    .pipe(fileinclude({
      prefix: `@@`,
      basepath: `@root`,
      context: {
        featuresCardTitle: "text",
        featuresCardMod: "tall"
      }
    }))
    .pipe(gulp.dest(`build`));
  });
```

Глобальную переменную можно переопределить для конкретного инклюда просто передав её в него с другим значением.

❗ Тщательно подбирайте нейминг для глобальных переменных. Не `navLinks`, а `headerNavLinks`, чтобы любой разработчик мог уже в gulp понять область применения этой глобальной переменной. Также нельзя передавать в глобал переменную `mod`.

#### Обращение к переменной

```html
  <div class="card">
    <h1>@@title</h1>
  </div>
```

### Условия
Переменные и условия можно вставить буквально куда угодно. В классы, атрибуты и пр.

Чаще всего условия будут применяться, чтобы добавить модификатор к компоненту или если на одной странице в компонент переменная передается, а на другой нет.

```html
  <div class="card @@if (context.mod) { card--@@mod }">
    @@if (context.title) {
      <h1>@@title</h1>
    }
  </div>
```

Также условия понадобятся для того чтобы `header` на разных страницах имел разные активные ссылки, а на главной логотип был без `href`(старый плагин так не умел, а некоторые заказчики просили отобразить смену пунктов меню и для этого приходилось плодить компонент шапки).

В текущей сборке в `header` уже добавлены условия для решения этой задачи. Вам остается лишь копипастить пункты меню до нужного количества увеичивая индексы `context.headerActiveLinkIndex === 2` &rarr; `context.headerActiveLinkIndex === 3`.

#### Почему в условиях стоит применять `(context.mod)`, а не `(mod)` как указано в спецификации плагина?
Проблема может возникнуть, если компонент на одной странице передается с переменной, а на другой без + если данная переменная отсутствует в глобале в `gulpfile.js`.
Если в таком случае написать `@@if (mod) { header--@@mod }`, то сборка выдаст ошибку 'mod is not defined', ведь на одной из страниц мы его не передаем.

Решение этой проблемы - использование объекта `context`, который в этом плагине отвечает за попадание переменных в глобал `@@if (context.mod) { header--@@mod }`.

❗ Нельзя в переменных использовать дефис `test-1`, если в компоненте вы их вызываете через `context.test-1`

### Циклы.
Циклы в этом плагине очень недружелюбны, по ним нет адекватной информации в спецификации.

**В 99% случаев если на проекте необходимы циклы и такого рода компоненты - лучше использовать `pug`.**

Но все же полезно будет узнать, что еще умеет этот плагин.

Плагин парсит @@if раньше чем @@for. Соответственно если поместить @@if внутрь @@for, к примеру, `@@if (headerActiveLinkIndex == `+i+`)` - консоль выдаст ошибку, ведь на момент парсинга условия переменная `i` от цикла еще не была создана. Выход из этой проблемы - использование тернарного оператора.

```html
  <nav class="main-nav">
    <ul class="main-nav__list">
      @@for (var i = 0; i < headerLinks.length; i++) {
        `+(i == headerActiveLinkIndex ?
        '<li class="main-nav__item"><a class="main-nav__link  main-nav__link--active">'+headerNavLinks[i].text+'</a></li>' :
        '<li class="main-nav__item"><a class="main-nav__link" href="'+headerNavLinks[i].href+'">'+headerNavLinks[i].text+'</a></li>')+`
      }
    </ul>
  </nav>
```

Также в gulp необходимо задать глобальные переменные, чтобы не копипастить их на каждую страницу, что нарушало бы логику компонентности

```
  context: {
    headerActiveLinkIndex: null,
    headerNavLinks: [
      {
        "text": "О компании",
        "href": "about.html"
      },
      {
        "text": "Каталог",
        "href": "catalog.html"
      },
      {
        "text": "Контакты",
        "href": "contacts.html"
      }
     ]
```

headerActiveLinkIndex переопределяется для каждого компонента по необходимости. Если же мы не задаем эту переменную для определенной страницы - сборка не выдаст ошибку. Ведь в глобале есть `null`.

---

## Модалки
В сборку добавлена сущность модалок.

`html/base/modal.html` + `sass/blocks/modal.scss` + `js/utils/modal.js` + `js/modules/init-modals.js`

Также в main.html добавлены две модалки для примера.

### Создаем модалку
1. В html для интерактивных элементов вызывающих модалку вам необходимо добавить `data-modal="x"`.
2. В инклюд передаем `name` соответствующий второй части имени файла модалки в `html/components/modal-name` и соответствующий тому что вы передали в 1 пункте, который также автоматически создаст модификатор у модалки `modal--@@name`
3. Передаем `fitContent`, если у вас стоит задача, чтобы модалка подстраивалась под ширину контента
4. Передаем `mod`, если нам необходим дополнительный модификатор (к примеру, `no-overlay`)

```html
  <!-- вызов модалки -->
  <a href="#" data-modal="success"></a>

  <!-- инклюд модалки -->
  @@include("source/html/base/modal.html", {
    "name": "success",
    "fitContent": true,
    "mod": "some-mod"
  })
```

В `js/modules/init-modals.js` необходимо найти модалку + ссылки на нее и передать как аргументы в `setupModal()`.

```js
  // аргументы setupModal(modal, closeCallback, modalBtns, openCallback, noPrevDefault)
  // возможна инициализация только с первыми аргументом,
  // если вам нужно открывать модалку в другом месте под какими-нибудь условиями
  const initModals = () => {
    if (modalFeedback && modalFeedbackBtns.length) {
      setupModal(modalFeedback, false, modalFeedbackBtns, false, false);
    }
    if (modalSuccess && modalSuccessBtns.length) {
      setupModal(modalSuccess, false, modalSuccessBtns);
    }
  };
```

Готово. Остается поправить стили через модификатор при необходимости.
Также стоит учесть, если на проекте в разных модалках одинаковый размер заголовков, вертикальные отступы и т.д. - такие элементы имеет смысл внести в базу `sass/blocks/modal.scss`, а не стилизовать каждый раз отдельно для каждой модалки.

❗ Новые базовые модификаторы пишем в `sass/blocks/modal.scss`, а под каждую новую модалку, если ей требуется дополнительная стилизация стоит создавать новый scss файл, а не плодить модификаторы в базовом `modal.scss`.

---
