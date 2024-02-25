
const text = `Предварительные выводы неутешительны новая модель организационной деятельности позволяет выполнить важные задания по разработке новых принципов формирования материально-технической и кадровой базы. Мы вынуждены отталкиваться от того, что внедрение современных методик позволяет оценить значение поставленных обществом задач. Наше дело не так однозначно, как может показаться: сплочённость команды профессионалов предопределяет высокую востребованность прогресса профессионального сообщества.

Таким образом, постоянное информационно-пропагандистское обеспечение нашей деятельности выявляет срочную потребность переосмысления внешнеэкономических политик. Идейные соображения высшего порядка, а также повышение уровня гражданского сознания представляет собой интересный эксперимент проверки поэтапного и последовательного развития общества. Задача организации, в особенности же разбавленное изрядной долей эмпатии, рациональное мышление способствует повышению качества вывода текущих активов. Принимая во внимание показатели успешности, сплочённость команды профессионалов однозначно фиксирует необходимость анализа существующих паттернов поведения. Современные технологии достигли такого уровня, что постоянное информационно-пропагандистское обеспечение нашей деятельности создаёт предпосылки для распределения внутренних резервов и ресурсов.`

const inputEl = document.querySelector('#input')
const textEl =document.querySelector('#textExample')

const lines = getLines(text)

let letterId = 1 // ID of letter in text

let startMoment = null // Time of start action
let started = false // Start action

let letterCounter = 0 // Count of push the key
let letterCounter_error = 0 // Errors counts of push the key

// Init update input and listener the key
init()
function init() {

    update()

    // Focus after reboot
    inputEl.focus()

    // Listener keydown
    inputEl.addEventListener('keydown', function (e) {

        const currentLineNumber = getCurrentLineNumber()
        const currentLetter = getCurrentLetter()

        const element = document.querySelector('[data-key ="' + e.key + '"]')

        const isKey = e.key === currentLetter.original
        const isEnter = e.key === 'Enter' && currentLetter.original === '\n'

        if (e.key !== 'shift') {
            letterCounter = letterCounter + 1
        }

        if (!started) {
            started = true
            startMoment = Date.now()
        }

        if (e.key.startsWith('F') && e.key.length > 1) {
            return
        }

        if (element) {
            element.classList.add('hint')
        }

        if (isKey || isEnter) {
            letterId = letterId +1
            update()
        }
        else {
            e.preventDefault()

            if (e.key !== 'shift') {

                letterCounter_error = letterCounter_error + 1

                for (const line of lines) {
                    for (const letter of line) {
                        if (letter.original === currentLetter.original) {
                            letter.success = false
                        }
                    }
                }

                update()
            }
        }

        if(currentLineNumber !== getCurrentLineNumber()) {

            inputEl.value = ''
            e.preventDefault()

            const time = Date.now() - startMoment
            document.querySelector('#wordSpeed').textContent = Math.round(60000 * letterCounter / time)
            document.querySelector('#errorPercent').textContent = Math.floor(10000 * letterCounter_error / letterCounter) / 100

            started = false
            letterCounter = 0
            letterCounter_error = 0
        }
    })

    // Listener keyup
    inputEl.addEventListener('keyup', function (e) {

        const element = document.querySelector('[data-key ="' + e.key + '"]')

        if (element) {
            element.classList.remove('hint')
        }

    })
}

// Push line of text
function getLines(text) {

    const lines = []
    let line = []
    let idCounter = 0

    for (const originalLetter of text) {

        idCounter = idCounter + 1

        let letter = originalLetter

        if (letter === ' ') {
            letter = '°'
        }

        if (letter === '\n') {
            letter = '¶\n'
        }

        line.push({
            id: idCounter,
            label: letter,
            original: originalLetter,
            success: true
        })

        if (line.length >= 70 || letter === "¶\n") {
            lines.push(line)
            line = []
        }
    }

    if (line.length > 0) {
        lines.push(line)
    }

    return lines
}

// Create line to HTML and make class "done"
function lineToHTML(line) {

    const divElement = document.createElement('div')
    divElement.classList.add('line')

    for (const letter of line) {
        const spanEl = document.createElement('span')
        spanEl.textContent = letter.label
        divElement.append(spanEl)

        if (letterId > letter.id) {
            spanEl.classList.add('done')
        } else if (!letter.success) {
            spanEl.classList.add('hint')
        }
    }

    return divElement
}

// Get current line
function getCurrentLineNumber() {

    for (let i = 0; i < lines.length; i++) {
        for (const letter of lines[i]) {
            if (letter.id === letterId) {
                return i
            }
        }
    }
}

// Update letter and make class "hidden"
function update() {

    const currentLineNumber = getCurrentLineNumber()

    textEl.innerHTML = ''

    for (let i = 0; i < lines.length; i++) {

        const html = lineToHTML(lines[i])
        textEl.append(html)

        if (i < currentLineNumber || i > currentLineNumber + 2) {
            html.classList.add('hidden')
        }
    }
}

// Get current letter
function getCurrentLetter() {

    for (const line of lines) {
        for (const letter of line) {
            if (letterId === letter.id) {
                return letter
            }
        }
    }
}
