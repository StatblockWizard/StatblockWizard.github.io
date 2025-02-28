// Copyright 2025 StatblockWizard
var currentID = 0;
var CreatingStatblock = false;
const versionNone = 'None';
const versionOriginal = 'Original';
const version2024 = '2024';
var currentVersion;

window.addEventListener('load', CreateHomeLinks, false);

// #region Tools
function CreateHomeLinks() {
    let h = document.getElementsByClassName('homelink');
    if (h) {
        for (var i = 0; i < h.length; i++) {
            h[i].addEventListener('click', () => {
                window.location.replace(`index.html`);
            });
            h[i].accessKey = 'w';
            h[i].alt = `Open the StatblockWizard homepage. (shortcut key: ${h[i].accessKey})`;
            h[i].title = `Open the StatblockWizard homepage. (shortcut key: ${h[i].accessKey})`;
        }
    }
}

function OpenViewer(forVersion) {
    DBclearDifferentVersionStatblock(forVersion);
    currentVersion = forVersion;
    switch (currentVersion) {
        case version2024:
            window.location.replace('2024Viewer.html');
            break;
        default:
            window.location.replace('Viewer.html');
            break;
    }
}

function OpenCreator(forVersion) {
    DBclearDifferentVersionStatblock(forVersion);
    currentVersion = forVersion;
    switch (currentVersion) {
        case version2024:
            window.location.replace('2024Creator.html');
            break;
        default:
            window.location.replace('Creator.html');
            break;
    }
}

function removeids(fromarrayofobjects) {
    fromarrayofobjects.forEach(o => {
        delete o.id;
    })
}

function downloadjson(what, filename) {
    const file = new Blob([JSON.stringify(what)], { type: 'application/json' });
    const fileURL = URL.createObjectURL(file);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', fileURL);
    linkElement.setAttribute('download', `${filename}.statblockwizard.json`);
    linkElement.click();
}

function findcsselement(definitionlist, type, subtype) {
    let foundelement = null;
    definitionlist.forEach(element => {
        if (element.type == 'css') {
            if (element.fortype == type) {
                if ((type == 'list') && (subtype) && (element.forsubtype)) {
                    if (element.forsubtype == subtype) { foundelement = element; }
                } else {
                    foundelement = element;
                }
            }
        }
    });
    return foundelement;
}

function SetElementValue(id, value) {
    let e = document.getElementById(id);
    if (e) { e.value = value; };
}

function GetElementValue(id) {
    let e = document.getElementById(id);
    if (e) { return e.value.replace(/\s[\s]+/ig, ' ') };
    return '';
}

function GetElementSrc(id) {
    let e = document.getElementById(id);
    if (e) { if (ImageAvailable()) { return e.src } };
    return '';
}

function ImageAvailable() {
    let l = document.getElementById('imagecontainer');
    if (l) { return (!l.classList.contains('unavailable')) };
    return false;
}

function removeCaption(from, caption) {
    if (caption) {
        let r = RegExp(`^${caption}[\:.]*`, 'i');
        return from.replace(r, '');
    } else
        return from;
}

function PutKeywordsInSpan(text) {
    let r = /(^|\s)(Melee or Ranged Attack Roll|Melee Attack Roll|Ranged Attack Roll|Hit|Strength Saving Throw|Dexterity Saving Throw|Constitution Saving Throw|Intelligence Saving Throw|Wisdom Saving Throw|Charisma Saving Throw|Failure|Success|Failure or Success|Trigger|Response)\:/ig;
    return (text.replace(r, '$1<span class="' + fullClassname('italic') + '">$2:</span>'));
}

function PutTitleInSpan(text) {
    let r = /^([^\.]*\.)/i;
    return (text.replace(r, '<span class="' + fullClassname('likeyword') + '">$1</span>'));
}

function StatblockWizardVersion(Statblock) {
    let version = Statblock.filter((element) => (element.type == "version"))
    return ((version.length == 0) ? versionOriginal : (version[0].version).slice(0, 4));
}

// #endregion Tools

// #region DB
function DBsetStatblockWizard(value) {
    let currentv = window.localStorage.getItem('StatblockWizard');
    if (!currentv) {
        if (!DBConfirmWrite()) { throw (': user prevented storage of data.'); }
    }
    window.localStorage.setItem('StatblockWizard', JSON.stringify(value));
}

function DBConfirmWrite() {
    return window.confirm("This action will store stat block data in your browser, necessary for the app to function. See the 'Legal information' page to learn more.\n\nDo you allow this storage?");
}

function DBgetStatblockWizard() {
    let v = window.localStorage.getItem('StatblockWizard');
    if (!v) { return StatblockWizardDemo(); };
    return (JSON.parse(v));
}

function DBclearStatblockWizard() {
    let v = window.localStorage.getItem('StatblockWizard');
    if (v) {
        window.localStorage.removeItem('StatblockWizard');
    }
}

function DBStatblockWizardVersion() {
    let v = window.localStorage.getItem('StatblockWizard');
    if (!v) { return versionNone; };
    let s = JSON.parse(v);
    if (!Array.isArray(s)) { return versionNone; };
    return (StatblockWizardVersion(s));
}

function DBclearDifferentVersionStatblock(forVersion) {
    if (forVersion != DBStatblockWizardVersion()) DBclearStatblockWizard();
}

function ProcessFileCreator(filecontent) {
    var newContent = JSON.parse(filecontent);
    if (newContent) {
        if (Array.isArray(newContent)) {
            DBsetStatblockWizard(newContent);
            OpenCreator(StatblockWizardVersion(newContent));
        }
    }
}

function ProcessFileViewer(filecontent) {
    var newContent = JSON.parse(filecontent);
    if (newContent) {
        if (Array.isArray(newContent)) {
            DBsetStatblockWizard(newContent);
            OpenViewer(StatblockWizardVersion(newContent));
        }
    }
}
// #endregion DB

// #region UI
function BR() {
    return document.createElement('br');
}

function COMMENT(text) {
    return document.createComment(text);
}

function DIV(classnames) {
    let div = document.createElement('div');
    addClassnames(div, classnames);
    return div;
}

function FIGCAPTION(caption, classnames) {
    let fc = document.createElement('figcaption');
    fc.innerHTML = caption;
    addClassnames(fc, classnames);
    return fc;
}

function FIGURE(src, caption, alt, classnames, imgclassnames, captionclassnames) {
    let f = document.createElement('figure');
    addClassnames(f, classnames);
    f.appendChild(IMGset(`${src} 3.125x`, alt, imgclassnames));
    f.appendChild(FIGCAPTION(caption, captionclassnames));
    return f;
}

function H1(text, classnames) {
    let h1 = document.createElement('h1');
    h1.innerHTML = text;
    addClassnames(h1, classnames);
    return h1;
}

function H2(text, classnames) {
    let h2 = document.createElement('h2');
    h2.innerHTML = text;
    addClassnames(h2, classnames);
    return h2;
}

function HR(classnames) {
    let hr = document.createElement('hr');
    addClassnames(hr, classnames);
    return hr;
}

function IMG(src, alt, classnames) {
    let i = document.createElement('img');
    i.src = src;
    i.alt = alt;
    i.title = alt;
    addClassnames(i, classnames);
    return i;
}

function IMGset(srcset, alt, classnames) {
    let i = document.createElement('img');
    i.srcset = srcset;
    i.alt = alt;
    i.title = alt;
    addClassnames(i, classnames);
    return i;
}

function INPUTbutton(text, accessKey, alt, classnames) {
    let input = document.createElement('input');
    input.setAttribute("type", "button");
    if (accessKey) {
        input.setAttribute('accessKey', accessKey);
        alt = `${alt} (shortcut key: ${accessKey})`;
    };
    if (alt) {
        input.setAttribute('alt', alt);
        input.setAttribute('title', alt);
    };
    input.value = text;
    addClassnames(input, classnames);
    return input;
}

function INPUTnumber(minvalue, maxvalue, defaultvalue, classnames) {
    var input = document.createElement('input');
    input.setAttribute("type", "number");
    if (minvalue) { input.setAttribute("min", minvalue); };
    if (maxvalue) { input.setAttribute("max", maxvalue); };
    if (Number.isInteger(defaultvalue)) { input.setAttribute('value', defaultvalue) };
    addClassnames(input, classnames);
    return input;
}

function INPUTfile(accept) {
    let ifs = document.createElement('input');
    ifs.setAttribute('type', 'file');
    if (accept) ifs.setAttribute('accept', accept);
    return ifs;
}

function INPUTtext(defaultvalue, size, classnames) {
    var input = document.createElement('input');
    input.setAttribute("type", "text");
    if (size > 20) { input.setAttribute("size", size) };
    input.setAttribute('value', defaultvalue);
    addClassnames(input, classnames);

    input.addEventListener('paste', (ce) => {
        let paste = (ce.clipboardData || window.clipboardData).getData('text').toString();
        paste = `${input.value.substring(0, input.selectionStart)}${paste}${input.value.substring(input.selectionEnd)}`;
        paste = paste.replace(/\s[\s]+/ig, ' ').replace(/[\u0002\ufffe]/g, '');

        let swtype = input.getAttribute('swtype');
        let dot = paste.indexOf('.');
        let colon = paste.indexOf(':');
        switch (swtype) {
            case 'fixedcaption':
                let caption = input.getAttribute('swcaption');
                paste = removeCaption(paste, caption);
                break;
            case 'captiondotvalue':
                if (colon >= 0 && (colon < dot || dot == -1)) { dot = colon; };
                if (dot >= 0) {
                    let pastevalue = paste.slice(dot + 1).trim();
                    if (pastevalue.length > 0) {
                        let valueid = input.getAttribute('swvalueid');
                        let valueinput = document.getElementById(valueid);
                        if (valueinput) {
                            valueinput.value = pastevalue.trim();
                            paste = paste.substring(0, dot) + '.';
                        }
                    }
                }
                break;
            case 'captioncolonvalue':
                if (dot >= 0 && (dot < colon || colon == -1)) { colon = dot; };
                if (colon >= 0) {
                    let pastevalue = paste.slice(colon + 1).trim();
                    if (pastevalue.length > 0) {
                        let valueid = input.getAttribute('swvalueid');
                        let valueinput = document.getElementById(valueid);
                        if (valueinput) {
                            valueinput.value = pastevalue.trim();
                            paste = paste.substring(0, colon) + ':';
                        }
                    }
                }
                break;
            case 'ul':
                let rul = /^[^\da-z]/i;
                paste = paste.replace(rul, '');
                break;
            case 'ol':
                let rd = /^[\d]*[\.]+/;
                paste = paste.replace(rd, '');
                break;
            case 'attack5e':
                {
                    if (colon >= 0 && (colon < dot || dot == -1)) { dot = colon; };
                    if (dot < 0) { break; };
                    let pastevalue = paste.slice(dot + 1).trim();
                    if (pastevalue.length == 0) { break; };
                    let r = /(Melee Weapon Attack\:|Ranged Weapon Attack\:|Melee or Ranged Weapon Attack\:|Melee Spell Attack\:|Ranged Spell Attack\:|Melee or Ranged Spell Attack\:)(.*)Hit\:(.*)/i;
                    let matches = pastevalue.match(r);
                    if (matches.length == 4) {
                        let valueids = JSON.parse(input.getAttribute('swvalueids'));
                        SetElementValue(valueids[0], attacktype5evalue(matches[1].trim()));
                        SetElementValue(valueids[1], matches[2].trim());
                        SetElementValue(valueids[2], matches[3].trim());
                        paste = paste.substring(0, dot) + '.';
                    }
                }
                break;
            case 'ability2024':
                {
                    paste = paste.replace(/[−]/ig,'-');
                    let r = /(\d*)\s*([\+\-\d]*)\s*([\+\-\d]*)/i;
                    let matches = paste.match(r);
                    if (matches.length == 4) {
                        let id = input.getAttribute('id');
                        SetElementValue(`${id}-mod`, matches[2]);
                        SetElementValue(`${id}-save`, matches[3]);
                        paste = matches[1];
                    }
                }
                break;
            case 'attack2024':
                if (colon >= 0 && (colon < dot || dot == -1)) { dot = colon; };
                if (dot < 0) { break; };
                let pastevalue = paste.slice(dot + 1).trim();
                if (pastevalue.length == 0) { break; };
                let r = /(Melee Attack Roll\:|Ranged Attack Roll\:|Melee or Ranged Attack Roll\:)(.*)Hit\:(.*)/i;
                let matches = pastevalue.match(r);
                if (matches.length == 4) {
                    let valueids = JSON.parse(input.getAttribute('swvalueids'));
                    SetElementValue(valueids[0], attacktype2024value(matches[1].trim()));
                    SetElementValue(valueids[1], matches[2].trim());
                    SetElementValue(valueids[2], matches[3].trim());
                    paste = paste.substring(0, dot) + '.';
                }
                break;
            case "save2024":
                {
                    if (colon >= 0 && (colon < dot || dot == -1)) { dot = colon; };
                    if (dot < 0) { break; };
                    let pastevalue = paste.slice(dot + 1).trim();
                    if (pastevalue.length == 0) { break; };

                    let s = /(Strength Saving Throw\:|Dexterity Saving Throw\:|Constitution Saving Throw\:|Intelligence Saving Throw\:|Wisdom Saving Throw\:|Constitution Saving Throw\:|)(.*)/i
                    let matches = pastevalue.match(s);
                    if (matches.length != 3) { break; }
                    let svalueids = JSON.parse(input.getAttribute('swvalueids'));
                    SetElementValue(svalueids[0], savetype2024value(matches[1].trim()));

                    let rem = matches[2].trim();
                    // order must be Failure, Success, Failure or Success
                    // but none of them need to be present.
                    let fs = rem.indexOf('Failure or Success:');
                    let ff = rem.indexOf('Failure:');
                    let ss = rem.indexOf('Success:');
                    if (ss > fs && fs > -1) {
                        // false positive, should never happen.
                        ss = -1
                    }
                    if (fs > -1) {
                        SetElementValue(svalueids[4], removeCaption(rem.slice(fs), 'Failure or Success').trim());
                        rem = rem.substring(0, fs).trim();
                    }
                    if (ss > -1) {
                        SetElementValue(svalueids[3], removeCaption(rem.slice(ss), 'Success').trim());
                        rem = rem.substring(0, ss).trim();
                    }
                    if (ff > -1) {
                        SetElementValue(svalueids[2], removeCaption(rem.slice(ff), 'Failure').trim());
                        rem = rem.substring(0, ff).trim();
                    }
                    SetElementValue(svalueids[1], rem.trim());
                    paste = paste.substring(0, dot) + '.';
                }
                break;
            case 'reaction2024':
                {
                    if (colon >= 0 && (colon < dot || dot == -1)) { dot = colon; };
                    if (dot < 0) { break; };
                    let pastevalue = paste.slice(dot + 1).trim();
                    if (pastevalue.length == 0) { break; };
                    let r = /Trigger\:(.*)Response\:(.*)/i;
                    let matches = pastevalue.match(r);
                    if (matches.length == 3) {
                        let valueids = JSON.parse(input.getAttribute('swvalueids'));
                        SetElementValue(valueids[0], matches[1].trim());
                        SetElementValue(valueids[1], matches[2].trim());
                        paste = paste.substring(0, dot).trim() + '.';
                    }
                }
                break;
            default: // do nothing extra
                break;
        }
        input.value = paste.trim();
        ce.preventDefault();
    });
    return input;
}

function LABEL(forid, text) {
    let l = document.createElement('label');
    l.setAttribute('for', forid);
    l.innerHTML = `${text}: `;
    return l;
}

function LISTulol(type, values, listclassnames, itemclassnames) {
    let l = document.createElement(type);
    addClassnames(l, listclassnames);
    values.forEach(v => {
        let li = document.createElement('li');
        let lisp = SPAN();
        lisp.innerHTML = PutTitleInSpan(PutKeywordsInSpan(v));
        addClassnames(li, itemclassnames);
        li.appendChild(lisp);
        l.appendChild(li);
    });
    return l;
}

function LISTdl(values, listclassnames, termclassnames, descclassnames) {
    let l = document.createElement('dl');
    addClassnames(l, listclassnames);
    values.forEach(v => {
        let dt = document.createElement('dt');
        dt.innerHTML = v.dt;
        addClassnames(dt, termclassnames);
        l.appendChild(dt);
        let dd = document.createElement('dd');
        dd.innerHTML = PutKeywordsInSpan(v.dd);
        addClassnames(dd, descclassnames);
        l.appendChild(dd);
    });
    return l;
}

function P(text, classnames) {
    let p = document.createElement('p');
    if (text) { p.innerHTML = PutKeywordsInSpan(text); };
    addClassnames(p, classnames);
    return p;
}

function SELECT(element, options, classnames) {
    let s = document.createElement('select');
    options.forEach(o => {
        let option = document.createElement('option');
        option.setAttribute('value', o.value);
        let t = document.createTextNode(o.text);
        option.appendChild(t);
        s.appendChild(option);
    });
    addClassnames(s, classnames);
    return s;
}

function SPAN(text, classnames) {
    let span = document.createElement('span');
    if (text && (!classnames || classnames == '')) { text = PutKeywordsInSpan(text); }
    if (text) { span.innerHTML = text; };
    addClassnames(span, classnames);
    return span;
}

function TABLE(classnames) {
    let table = document.createElement('table');
    addClassnames(table, classnames);
    return table
}

function TEXTNODE(text) {
    return (document.createTextNode(text));
}

function TD(text, classnames) {
    let td = document.createElement('td');
    addClassnames(td, classnames);
    if (text) { td.innerHTML = text; };
    return td;
}

function TH(text, classnames) {
    let th = document.createElement('th');
    addClassnames(th, classnames);
    if (text) { th.innerHTML = text; };
    return th;
}

function TR(classnames) {
    let tr = document.createElement('tr');
    addClassnames(tr, classnames);
    return tr;
}

function emptyNode() {
    return TEXTNODE('');
}

function newID() {
    currentID += 1;
    return currentID;
}

function addClassnames(e, c) {
    if (c) {
        let a;
        if (Array.isArray(c)) { a = c } else { a = c.split(' '); };
        a.forEach(name => {
            if (name != '') { e.classList.add(fullClassname(name, CreatingStatblock)); };
        });
    };
}

function fullClassname(name, whileCreatingStatblock = true) {
    return ((whileCreatingStatblock && (name != 'StatblockWizard')) ? `StatblockWizard-${name}` : name)
}
// #endregion UI