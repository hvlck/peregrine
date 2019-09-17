// Variables

const styleSheet = document.getElementById('theme');

const themeBtn = document.getElementById('theme-btn')
const downloadBtn = document.getElementById('download-btn');

const text = document.querySelector('textarea');

const savePopUp = document.getElementById('saved-popup');
const settingsMenu = document.getElementById('settings-menu');

window.onload = function start() {
    text.value = '';
    
    let getText = localStorage.getItem('text');
    text.value = getText;

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

function readNewFile(input) {
    let file = input.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file);
  
    fileReader.onload = function showNewFile() {
      text.value = fileReader.result;
    };

    fileReader.onerror = function displayError() {
        alert('Something Went Wrong. Please try again.');
    };
};

// Manual Saving

document.getElementById('save-btn').onclick = function() { save(); }

// Toggles Theme

themeBtn.onclick = function changeTheme() {
    let themeType = document.getElementById('theme').getAttribute('href');
    if (themeType == 'themes/light.css') {
        styleSheet.setAttribute('href', 'themes/light-solarized.css');
        themeBtn.innerHTML = 'Light Solarized';
    } else if (themeType == 'themes/light-solarized.css') {
        styleSheet.setAttribute('href', 'themes/dark.css');
        themeBtn.innerHTML = 'Dark';
    } else if (themeType == 'themes/dark.css') {
        styleSheet.setAttribute('href', 'themes/dark-solarized.css');
        themeBtn.innerHTML = 'Dark Solarized'
    } else if (themeType == 'themes/dark-solarized.css') {
        styleSheet.setAttribute('href', 'themes/light.css');
        themeBtn.innerHTML = 'Light'
    }
}

// Automatic Theme Changer

let hr = new Date();
if (hr.getHours() >= 18 || hr.getHours() <= 7) {
    styleSheet.setAttribute('href', 'themes/dark.css')
    themeBtn.innerHTML = 'Dark';
} else {
    styleSheet.setAttribute('href', 'themes/light.css')
    themeBtn.innerHTML = 'Light'
}

// Character and Word Count

function count() {
    let value = text.value;
    let chars = value.length;
    if (chars == 1) {
        document.getElementById('char-count').innerHTML = chars + ' Character';
    } else {
        document.getElementById('char-count').innerHTML = chars + ' Characters';
    }
    let words = value.trim().split(/\s+/).length;
    if (chars == 0 && words == 1) {
        document.getElementById('word-count').innerHTML = '0 Words';
    } else if (words == 1) {
        document.getElementById('word-count').innerHTML = words + ' Word';
    } else {
        document.getElementById('word-count').innerHTML = words + ' Words';
    }
}

// Settings

document.getElementById('settings-btn').onclick = function toggleSettings() {
    if (settingsMenu.style.display == 'block') {
        settingsMenu.style.display = 'none';
    } else {
        settingsMenu.style.display = 'block';
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
    let confrm = confirm('Are you sure?  This will reset everything, including your text.');
    if (confrm == true) {
        localStorage.clear();

        text.value = '';
        text.style.fontFamily = 'monospace';
        text.style.fontSize = '12pt';

        document.getElementById('font').value = 'monospace';
        document.getElementById('font-size').value = '12pt';
    }
    else { return };
}

// Saves Text to LocalStorage

function save() {
    let value = text.value;
    localStorage.setItem('text', value);
    savePopUp.style.display = 'inline';

    setTimeout(function() { savePopUp.style.display = 'none'}, 3000 )
}

// Download Function

downloadBtn.onclick = function download() {
    let fileName = 'text';

    let txtValue = text.value;
    let blob = new Blob([txtValue], {type: 'text/plain'});
    let url = URL.createObjectURL(blob);
    
    let link = document.createElement('a');
    link.download = fileName;
    link.href = url;

    document.body.appendChild(link)
    link.click();
}