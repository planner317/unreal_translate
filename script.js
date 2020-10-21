let DOM = {
    originalText: document.getElementById("originalText"),
    modifyText: document.getElementById("modifyText"),
    delString: document.getElementById("delString"),
    numStrOriginal: document.getElementById("numStrOriginal"),
    plural: document.getElementById("plural"),
    brackets_figur: document.getElementById("brackets_figur"),
    bracketsUp: document.getElementById("bracketsUp"),
    delSpaceBrackets: document.getElementById("delSpaceBrackets"),
    delBrackets: document.getElementById("delBrackets"),
    delEmpty: document.getElementById("delEmpty"),
    dropEmpty: document.getElementById("dropEmpty"),
    addOrig: document.getElementById("addOrig"),
    button: document.getElementById("button"),
    status1: document.getElementById("status"),
    exclusion: document.getElementById("exclusion"),
    exclusionChesk: document.getElementById("exclusionChesk"),
    textBeforeModify: document.getElementById("textBeforeModify"),
    textBeforeOriginal: document.getElementById("textBeforeOriginal"),
}

DOM.originalText.addEventListener("scroll", updateHeigt)
DOM.modifyText.addEventListener("scroll", updateHeigt)


function updateHeigt(e) {
    if (e.target.id == "originalText") {
        modifyText.scroll(modifyText.scrollLeft, originalText.scrollTop)
    } else {
        originalText.scroll(originalText.scrollLeft, modifyText.scrollTop)
    }
}

let modify = new Modify();

DOM.button.addEventListener("click", () => {
    DOM.status1.innerText = "подождите"
    setTimeout(modify.run, 10)
})




function Modify() {
    let origStings, modiStrings, countW
    this.run = () => {

        if (DOM.delEmpty.checked)
            DOM.modifyText.value = DOM.modifyText.value.replaceAll(`\n\n`, `\n`)

        origStings = DOM.originalText.value.match(/(^.*$)/mg)       // массив строк из оригинала
        modiStrings = DOM.modifyText.value.match(/(^.*$)/mg)        // массив строк из перевода

        if (origStings.length != modiStrings.length) { alert("колличество строк не совподает"); return }

        for (let i = 0; i < origStings.length; i++) {
            countW = origStings[i].replace(/\<.+?\>|\{.+?\}|\|plural\(.+?\)|\W/gi, "")
            if (DOM.delString.checked) {
                origStings[i]
                if (countW.length < +DOM.numStrOriginal.value) { // если меньше задоного на странице
                    modiStrings[i] = "---"
                    continue
                }
            }

            if (DOM.plural.checked) {
                modiStrings[i] = modiStrings[i].replace(/\|plural\(one=(.+?),.+?\)/g, "$1")
            }

            if (DOM.brackets_figur.checked) {
                modiStrings[i] = modiStrings[i].replace(/\{(.*?)\}/g, "{[_$1_]}")
            }

            if (DOM.bracketsUp.checked) {
                modiStrings[i] = modiStrings[i].replace(/\b[A-Z]{2,}\b/g, "[_$&_]")
            }

            if (DOM.delSpaceBrackets.checked) {
                modiStrings[i] = modiStrings[i].replaceAll("[_ ", "[_")
                modiStrings[i] = modiStrings[i].replaceAll(" _]", "_]")
            }

            if (DOM.delBrackets.checked) {
                modiStrings[i] = modiStrings[i].replace(/\[_(.*?)_\]/g, "$1")
            }

            if (DOM.dropEmpty.checked) {
                if (modiStrings[i] == "---") modiStrings[i] = origStings[i]
            }

            if (DOM.addOrig.checked) {
                if (modiStrings[i] != origStings[i])
                    if (modiStrings[i] == "---") modiStrings[i] = origStings[i]
                    else if (!modiStrings[i].includes("@param")) modiStrings[i] = origStings[i] + DOM.textBeforeModify.value + modiStrings[i]

            }

            //////////////// Словарь исключений
            if (DOM.exclusionChesk.checked) {
                let exclusion = DOM.exclusion.value.split(/\s+/i)
                exclusion.forEach(e => {
                    //  e = e.toLowerCase()
                    let regexp = new RegExp("\\b" + e + "\\b|\\b" + e + "s\\b", "gi")
                    modiStrings[i] = modiStrings[i].replace(regexp, "[_$&_]")
                })
            }

        }
        DOM.status1.innerText = "ok"
        DOM.modifyText.value = modiStrings.join("\n")

    }
}