// Variables

const styleSheet = document.getElementById('theme');

const themeBtn = document.getElementById('theme-btn');
const fullScreenBtn = document.getElementById('fullscreen-btn');
const printBtn = document.getElementById('print-btn');
const downloadBtn = document.getElementById('download-btn');

const wordCount = document.getElementById('word-count');

const savePopUp = document.getElementById('saved-popup');

const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.getElementById('settings-menu');

const text = document.querySelector('textarea');

window.onload = function start() {
    text.value = '';
    
    let getText = localStorage.getItem('text');
    text.value = getText;

    let getTheme = localStorage.getItem('theme');
    if (getTheme == null) { getTheme = 'Dark' }
    themeBtn.innerHTML = getTheme;
    styleSheet.setAttribute('href', `themes/${getTheme.toLowerCase()}.css`);
    
    let getFont = localStorage.getItem('font');
    if (getFont == null) { getFont = 'monospace' }
    document.getElementById('font').value = getFont;
    text.style.fontFamily = getFont;

    let getFontSize = localStorage.getItem('fontSize');
    if (getFontSize == null) { getFontSize = '12pt' }
    document.getElementById('font-size').value = getFontSize;
    text.style.fontSize = getFontSize;

    const updateSave = setInterval(save, 20000);
    const updateCounts = setInterval(count, 1);
}

// Settings

settingsBtn.onclick = function toggleSettings() {
    if (settingsMenu.style.display == 'block') {
        settingsMenu.style.display = 'none';
        text.style.minHeight = '92.8vh';
    } else {
        settingsMenu.style.display = 'block';
        text.style.minHeight = '87.6vh';
    }
}

document.getElementById('font').oninput = function updateFont() {
    let newFont = document.getElementById('font').value;
    localStorage.setItem('font', newFont);
    text.style.fontFamily = newFont;
}

document.getElementById('font-size').oninput = function updateFontSize() {
    let newFontSize = document.getElementById('font-size').value;
    localStorage.setItem('fontSize', newFontSize);
    text.style.fontSize = newFontSize;
}

// Reset All Settings and Text

document.getElementById('reset').onclick = function reset() {
    let confrm = confirm('Are you sure?  This will reset everything, including your writing.');
    if (confrm == true) {
        localStorage.clear();

        text.value = '';
        styleSheet.setAttribute('href', 'themes/dark.css');
        text.style.fontFamily = 'monospace';
        text.style.fontSize = '12pt';

        themeBtn.innerHTML = 'Dark';
        document.getElementById('font').value = 'monospace';
        document.getElementById('font-size').value = '12pt';
    }
    else { return };
}

// Manual Saving

document.getElementById('save-btn').onclick = function() { save(); }

// Saves Text to LocalStorage

function save() {
    let value = text.value;
    localStorage.setItem('text', value);
    
    savePopUp.style.display = 'inline';
    setTimeout(function() { savePopUp.style.display = 'none'}, 3000 )
}

// Toggles Theme

themeBtn.onclick = function changeTheme() {
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
}

// Fullscreen

fullScreenBtn.onclick = function toggleFullScreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
        document.documentElement.msRequestFullscreen();
    }

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// File Uploader Function

function readNewFile(input) {
    let file = input.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file);
  
    fileReader.onload = function showNewFile() {
      text.value += fileReader.result;
    };

    fileReader.onerror = function displayError() {
        alert('Something Went Wrong. Please try again.');
    };
};

// Printing

printBtn.onclick = function print() { window.print() }

// Download Function

downloadBtn.onclick = function download() {
    let textValue = text.value;
    let downloadLink = document.createElement('a');
    
    downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textValue));
    downloadLink.setAttribute('download', prompt('What do you want to name your file?') + '.txt');

    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);

    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Word Count

function count() {
    let value = text.value;
    let chars = value.length;
    let words = value.trim().split(/\s+/).length;
    if (chars == 0 && words == 1) {
        wordCount.innerHTML = '0 Words';
    } else if (words == 1) {
        wordCount.innerHTML = words + ' Word';
    } else {
        wordCount.innerHTML = words + ' Words';
    }
}