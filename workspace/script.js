// Variables

const styleSheet = document.getElementById('theme');

const themeBtn = document.getElementById('theme-btn');
const printBtn = document.getElementById('print-btn');
const saveAsBtn = document.getElementById('save-as-btn');
const saveAsNameInp = document.getElementById('save-as-name')
const errorElem = document.getElementById('error');
const fileUploadInp = document.getElementById('file-uploader');

const wordCount = document.getElementById('word-count');

const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.getElementById('settings-menu');

const text = document.querySelector('textarea');

window.addEventListener('load', function start() {
    text.value = '';
    text.style.height = `${window.innerHeight * 0.97}px`;

    let getText = localStorage.getItem('text');
    text.value = getText;

    let getTheme = localStorage.getItem('theme');
    if (getTheme == null) { getTheme = 'Dark' }
    themeBtn.innerHTML = getTheme;
    styleSheet.setAttribute('href', `themes/${getTheme.toLowerCase()}.css`);
    
    let getFont = localStorage.getItem('font');
    if (getFont == null) { getFont = 'Consolas' }
    document.getElementById('font').value = getFont;
    text.style.fontFamily = getFont;

    let getFontSize = localStorage.getItem('fontSize');
    if (getFontSize == null) { getFontSize = '12pt' }
    document.getElementById('font-size').value = getFontSize;
    text.style.fontSize = getFontSize;

    const updateSave = setInterval(save, 20000);
    const updateCounts = setInterval(count, 1);
});

window.addEventListener('resize', function resize() {
    text.style.height = `${window.innerHeight * 0.97}px`;
});

// Settings

/// Toggles Settings Menu.  The setTimeout function solves a minor bug with the scrollbar appearing briefly. 
settingsBtn.addEventListener('click', function toggleSettings() {
    text.style.height = `${window.innerHeight * 0.90}px`;
    setTimeout(function() {
        if (settingsMenu.style.display == 'none') {
            text.style.height = `${window.innerHeight * 0.90}px`;
            settingsMenu.style.display = 'block';
        } else if (settingsMenu.style.display == 'block') {
            text.style.height = `${window.innerHeight * 0.97}px`;
            settingsMenu.style.display = 'none';
        }    
    }, 100);
});

document.getElementById('font').addEventListener('input', function updateFont() {
    let newFont = document.getElementById('font').value;
    localStorage.setItem('font', newFont);
    text.style.fontFamily = newFont;
});

document.getElementById('font-size').addEventListener('input', function updateFontSize() {
    let newFontSize = document.getElementById('font-size').value;
    localStorage.setItem('fontSize', newFontSize);
    text.style.fontSize = newFontSize;
});

/// Toggles Theme
themeBtn.addEventListener('click', function changeTheme() {
    let themeType = document.getElementById('theme').getAttribute('href');
    if (themeType == 'themes/light.css') {
        styleSheet.setAttribute('href', 'themes/dark.css');
        localStorage.setItem('theme', 'Dark');
        themeBtn.innerHTML = 'Dark';
    } else if (themeType == 'themes/dark.css') {
        styleSheet.setAttribute('href', 'themes/solarized.css');
        localStorage.setItem('theme', 'Solarized');
        themeBtn.innerHTML = 'Solarized';
    } else if (themeType == 'themes/solarized.css') {
        styleSheet.setAttribute('href', 'themes/light.css');
        localStorage.setItem('theme', 'Light');
        themeBtn.innerHTML = 'Light'
    }
});

/// Reset All Settings and Text
document.getElementById('reset').addEventListener('click', function reset() {
    localStorage.clear();

    text.value = '';
    styleSheet.setAttribute('href', 'themes/dark.css');
    text.style.fontFamily = 'Consolas';
    text.style.fontSize = '12pt';

    themeBtn.innerHTML = 'Dark';
    document.getElementById('font').value = 'Consolas';
    document.getElementById('font-size').value = '12pt';
});

// Manual Saving

document.getElementById('save-btn').addEventListener('click', function() { save(); });

// Saves Text to LocalStorage

function save() {
    let value = text.value;
    localStorage.setItem('text', value);
    
    document.getElementById('save-btn').innerHTML = 'Saved!'
    setTimeout(function() { document.getElementById('save-btn').innerHTML = 'Save' }, 3000 )
}

// Download/Save As Function

let fileName;
let fileNameOpened = false;

saveAsBtn.addEventListener('click', function() { download() });

function download() {
    if (fileNameOpened == true) {
        saveAsBtn.innerHTML = 'Save As';
        fileName = saveAsNameInp.value;
        let textValue = text.value;
        let downloadLink = document.createElement('a');
    
        downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textValue));
        downloadLink.setAttribute('download', fileName + '.txt');

        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);

        downloadLink.click();
        document.body.removeChild(downloadLink);
        saveAsNameInp.style.display = 'none';
        fileNameOpened = false;
        fileName = '';
    } else {
        saveAsBtn.innerHTML = 'Download';
        saveAsNameInp.style.display = 'inline';
        fileNameOpened = true;
    }
};

function saveAs() {
    toolbar.style.display = 'block';
    download();
}

saveAsNameInp.addEventListener('keypress', function(e) {
    if (e.which == 13) { download() }
    else { return }
})

// File Opener Function

fileUploadInp.addEventListener('change', function() { readNewFile(this) })

function readNewFile(userFile) {
    let file = userFile.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file);

    const supportedTypes = ['text/plain', 'text/css', 'text/html', 'text/javascript', 'application/json']

    fileReader.addEventListener('load', function showNewFile() {
        if (supportedTypes.indexOf(file.type) > -1) { text.value += fileReader.result }
        else {
            errorElem.innerHTML = 'This file type is not supported.';
            setTimeout(hideError, 3000);
            fileUploadInp.value = '';
        }
    });

    fileReader.addEventListener('error', function displayError() {
        errorElem.innerHTML = 'Something Went Wrong. Please try again.';
    });
};

// Printing

printBtn.addEventListener('click', function print() { window.print() });

// Word Count

function count() {
    let value = text.value;
    let chars = value.length;
    let words = value.trim().split(/\s+/).length;
    if (chars == 0 && words == 1) {
        wordCount.innerHTML = '0 Words';
    } else if (words == 1) {
        wordCount.innerHTML = `${words} Word`;
    } else {
        wordCount.innerHTML = `${words} Words`;
    }

    if (words > 10000) {
        wordCount.style.fontSize = '90%';
    }
}

// Keyboard Shortcuts

const toolbar = document.getElementById('toolbar');

document.addEventListener('keydown', function toggletoolbar(e) {
    if (e.ctrlKey && e.which == 32) { // Toggles toolbar on Command/Ctrl + Space
        if (toolbar.style.display != 'block') {
            toolbar.style.display = 'block';
            text.style.height = `${window.innerHeight * 0.94}px`;
        } else if (toolbar.style.display = 'block') {
            toolbar.style.display = 'none';
            text.style.height = `${window.innerHeight * 0.97}px`;
        }
        settingsMenu.style.display = 'none';
    } else if (e.ctrlKey && e.shiftKey && e.which == 83) { // Triggers saveAs function on Command/Ctrl + Shift + S
        saveAs();
    } else if (e.ctrlKey && e.which == 83) { // Triggers save function on Command/Ctrl + S
        save();
    } else if (e.ctrlKey && e.which == 79) { // Triggers file opening function on Command/Ctrl + O
        fileUploadInp.click();
    } else if (e.ctrlKey && e.which == 80) { // Triggers print function on Command/Ctrl + P
        print();
    } else { return }
});

// Error Handling

window.addEventListener('error', function(err) {
    errorElem.innerHTML = `Error: ${err.message}`
    setTimeout(hideError, 5000);
});

function hideError() { errorElem.innerHTML = '' }