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
    DBreplaceDifferentVersionStatblock(forVersion);
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
    DBreplaceDifferentVersionStatblock(forVersion);
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

function getStatblockContentElementIndex(inStatblock, type, caption) {
    let i = 1;
    let found = false;
    while (!found && (i < inStatblock.length - 1)) {
        i++;
        found = (inStatblock[i - 1].type.toLowerCase() == type.toLowerCase()) && (inStatblock[i - 1].caption.toLowerCase() == caption.toLowerCase())
    }
    return ((found) ? (i - 1) : -1);
}

function SetElementValue(id, value) {
    let e = document.getElementById(id);
    if (e) { e.value = (value == '--') ? 'None' : value; };
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
    let r = /^([^\.]+\.)/i;
    return (text.replace(r, '<span class="' + fullClassname('likeyword') + '">$1</span>').replace(/^\.\s*/, ''));
}

function StatblockWizardVersion(Statblock) {
    let version = Statblock.filter((element) => (element.type == "version"))
    return ((version.length == 0) ? versionOriginal : (version[0].version).slice(0, 4));
}

function pasteHandler(caption, pastevalue, fullvalue) {
    if (pastevalue == '' || !pastevalue) return false;
    let success = false;
    let inputs = document.getElementsByTagName('input');
    let input = 0;
    while (!success && input < inputs.length) {
        let swcaption = inputs[input].getAttribute('swcaption');
        if (swcaption) {
            let f = fullvalue.toLowerCase().substring(0, swcaption.length);
            if (swcaption.toLowerCase() == caption.toLowerCase() || (swcaption.toLowerCase() == f && swcaption.length > caption.length)) {
                if (swcaption.toLowerCase() == f && swcaption.length > caption.length) pastevalue = removeCaption(fullvalue, swcaption).trim();
                let swtype = inputs[input].getAttribute('swtype');
                switch (swtype) {
                    case "fixedcaption":
                        SetElementValue(inputs[input].id, pastevalue);
                        success = true;
                        break;
                    case "number":
                        SetElementValue(inputs[input].id, pastevalue);
                        success = true;
                        break;
                    case "ac2024":
                        {
                            let r = /(.+)Initiative(.+)/i;
                            let matches = pastevalue.match(r);
                            if (matches && (matches.length == 3)) {
                                SetElementValue(inputs[input].id, matches[1].trim());
                                pasteHandler('initiative', matches[2].trim(), pastevalue);
                            } else {
                                SetElementValue(inputs[input].id, pastevalue);
                            }
                            success = true;
                            break;
                        }
                    case "ability2024":
                        {
                            pastevalue = pastevalue.replace(/[−]/ig, '-');
                            let r = /(\d*)\s*([\+\-\d]*)\s*([\+\-\d]*)/i;
                            let matches = pastevalue.match(r);
                            if (matches && (matches.length == 4)) {
                                SetElementValue(inputs[input].id, matches[1]);
                                SetElementValue(`${inputs[input].id}-mod`, matches[2]);
                                SetElementValue(`${inputs[input].id}-save`, matches[3]);
                            }
                            success = true;
                            break;
                        }
                }
            }
        }
        input++;
    }
    return success;
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

function DBreplaceDifferentVersionStatblock(forVersion) {
    let oldversion = DBStatblockWizardVersion();
    if (forVersion != oldversion) {
        if (oldversion == versionNone) {
            DBclearStatblockWizard(); // there may have been a corrupt stat block
        } else {
            let newDemoStatblock;
            switch (forVersion) {
                case versionOriginal:
                    newDemoStatblock = GetStatblocWizardDemoOriginal();
                    break;
                case version2024:
                    newDemoStatblock = GetStatblocWizardDemo2024();
                    break;
            };
            DBsetStatblockWizard(newDemoStatblock);
        }
    }
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
        let pastedlines = paste.split(/\n/g)
        paste = `${input.value.substring(0, input.selectionStart)}${paste}${input.value.substring(input.selectionEnd)}`;
        paste = paste.replace(/\s+/ig, ' ').replace(/[\u0002\ufffe]/g, '').trim();

        let swtype = input.getAttribute('swtype');
        let dot = paste.indexOf('.');
        let colon = paste.indexOf(':');
        switch (swtype) {
            case 'fixedcaption':
                let caption = input.getAttribute('swcaption');
                if (caption.toLowerCase() == 'name' && pastedlines.length > 1) {
                    paste = pastedlines.shift(); // the first line should be the name'
                    let lastability = '';
                    pastedlines.forEach(line => {
                        let m = line.match(/^\s*([a-z]*)(.*)/i);
                        if (['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'].includes(m[1].toLowerCase())) {
                            m[2] = `${m[1]} ${m[2]}`;
                            m[1] = 'creature info';
                        }
                        if (lastability != '') {
                            m[2] = m[2].replace(/\(.*\)/i, '').trim();
                            m[1] = lastability;
                            line = `${m[1]} ${m[2]}`;
                            lastability = '';
                        } else {
                            if (['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(m[1].toLowerCase()) && m[2].trim() == '') lastability = m[1];
                        }
                        pasteHandler(m[1].toLowerCase(), m[2].replace(/\s+/ig, ' ').trim(), line.trim());
                    });
                } else {
                    paste = removeCaption(paste, caption);
                    if (paste == '--') paste = 'None';
                }
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
                let rd = /^[\d]*[\.\:]+/;
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
            case 'ac2024':
                {
                    let r = /AC\s*(.+)Initiative(.+)/i;
                    let matches = paste.match(r);
                    if (matches && (matches.length == 3)) {
                        paste = matches[1].trim();
                        pasteHandler('initiative', matches[2].trim(), paste);
                    } else {
                        let accaption = input.getAttribute('swcaption');
                        paste = removeCaption(paste, accaption);
                    }
                }
                break;
            case 'ability2024':
                {
                    paste = paste.replace(/[−]/ig, '-');
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
                let r = /(.*)\.\s*(Melee Attack Roll\:|Ranged Attack Roll\:|Melee or Ranged Attack Roll\:)(.*)Hit\:(.*)/i;
                let matches = paste.match(r);
                if (matches.length == 5) {
                    let valueids = JSON.parse(input.getAttribute('swvalueids'));
                    SetElementValue(valueids[0], attacktype2024value(matches[2].trim()));
                    SetElementValue(valueids[1], matches[3].trim());
                    SetElementValue(valueids[2], matches[4].trim());
                    paste = matches[1].replace(/\.([^\s])/ig, '. $1').trim() + '.';
                }
                break;
            case "save2024":
                {
                    let s = /(.*)(Strength Saving Throw\:|Dexterity Saving Throw\:|Constitution Saving Throw\:|Intelligence Saving Throw\:|Wisdom Saving Throw\:|Charisma Saving Throw\:)(.*)/i
                    let matches = paste.match(s);
                    if (matches.length != 4) { break; }
                    let svalueids = JSON.parse(input.getAttribute('swvalueids'));
                    SetElementValue(svalueids[0], savetype2024value(matches[2].trim()));

                    let rem = matches[3].trim();
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
                    paste = matches[1].replace(/\.([^\s])/ig, '. $1').trim();
                }
                break;
            case 'reaction2024':
                {
                    if (colon >= 0 && (colon < dot || dot == -1)) { dot = colon; };
                    if (dot < 0) { break; };
                    let pastevalue = paste.slice(dot + 1).trim();
                    if (pastevalue.length == 0) { break; };
                    let r = /Trigger\:(.*)Response[\:—](.*)/i;
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

// #region Demo Statblocks
function GetStatblocWizardDemoOriginal() {
    return JSON.parse(
        `[{"type":"section","caption":"General","showcaption":false,"css":"section general","captioncss":""},{"type":"string","caption":"Name","showcaption":false,"defaultvalue":"","css":"title","captioncss":"","value":"Statblock Wizard"},{"type":"string","caption":"Size / Type / Alignment","showcaption":false,"defaultvalue":"","css":"sizetypealignment","captioncss":"","value":"Medium construct (software), lawful neutral"},{"type":"string","caption":"Armor Class","showcaption":true,"defaultvalue":"","css":"feature armorclass","captioncss":"keyword","value":"11"},{"type":"string","caption":"Hit Points","showcaption":true,"defaultvalue":"","css":"feature hitpoints","captioncss":"keyword","value":"11 (2d8 + 2)"},{"type":"string","caption":"Speed","showcaption":true,"defaultvalue":"30 ft.","css":"feature speed","captioncss":"keyword","value":"30 ft."},{"type":"sectionend","content":"static","values":[]},{"type":"section","caption":"Abilities","showcaption":false,"css":"section abilities","captioncss":""},{"type":"ability5e","caption":"STR","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"8","defaultvalue":""},{"type":"ability5e","caption":"DEX","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"13","defaultvalue":""},{"type":"ability5e","caption":"CON","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"12","defaultvalue":""},{"type":"ability5e","caption":"INT","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"15","defaultvalue":""},{"type":"ability5e","caption":"WIS","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"10","defaultvalue":""},{"type":"ability5e","caption":"CHA","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"14","defaultvalue":""},{"type":"sectionend","content":"static","values":[]},{"type":"section","caption":"Features","showcaption":false,"css":"section features","captioncss":""},{"type":"string","caption":"Saving Throws","showcaption":true,"defaultvalue":"","css":"feature savingthrows","captioncss":"keyword","value":""},{"type":"skills5e","caption":"Skills","showcaption":true,"defaultvalue":"","css":"feature skills","captioncss":"keyword","skillcss":"skill","value":""},{"type":"string","caption":"Damage Vulnerabilities","showcaption":true,"defaultvalue":"","css":"feature vulnerabilities","captioncss":"keyword","value":""},{"type":"string","caption":"Damage Resistances","showcaption":true,"defaultvalue":"","css":"feature resistances","captioncss":"keyword","value":""},{"type":"string","caption":"Damage Immunities","showcaption":true,"defaultvalue":"","css":"feature immunities","captioncss":"keyword","value":""},{"type":"string","caption":"Condition Immunities","showcaption":true,"defaultvalue":"","css":"feature immunities","captioncss":"keyword","value":""},{"type":"senses5e","caption":"Senses","showcaption":true,"defaultvalue":"","css":"feature senses","captioncss":"keyword","value":"passive Perception 10"},{"type":"languages5e","caption":"Languages","showcaption":true,"defaultvalue":"","css":"feature languages","captioncss":"keyword","value":"Common, HTML, CSS, JavaScript"},{"type":"cr5e","caption":"Challenge","proficiencycaption":"Proficiency Bonus","css":"feature crproficiency","crcss":"cr","captioncss":"keyword","proficiencycss":"proficiency","proficiencycaptioncss":"keyword","value":"1"},{"type":"sectionend","content":"static","values":[]},{"type":"section","caption":"Characteristics (like Personality Traits, Ideals, Bonds, Flaws) ","showcaption":false,"css":"section characteristics","captioncss":""},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[]},{"type":"section","caption":"Special Traits","showcaption":false,"css":"section specialtraits","captioncss":""},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"StatblockWizard Viewer.","value":"The Viewer is where you see or download the formatted stat block."},{"type":"namedstring","caption":"StatblockWizard Creator.","value":"The Creator is the place where you create or edit the content of your stat block. You enter the text, StatblockWizard handles the layout."}]},{"type":"section","caption":"Actions","showcaption":true,"css":"section actions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack5e"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Viewer Actions.","value":"In the Viewer, these actions are available:"},{"type":"list","listtype":"dl","values":[{"dt":"Creator.","dd":"Open the Creator."},{"dt":"Columns.","dd":"Toggle between 1 and 2 column view. The selected option affects the HTML and PNG file export."},{"dt":"Transparent.","dd":"Toggle between normal and transparent backgrounds. The selected option affects the HTML and PNG file export."},{"dt":"Upload JSON.","dd":"Load a StatblockWizard json file."},{"dt":"JSON.","dd":"Download as a StatblockWizard json file. This contains everything required to later view or edit the stat block again. The name of the stat block will be used for the name of the file."},{"dt":"HTML.","dd":"Download as a StatblockWizard partial html file, containing a DIV element that you can use in your own html files. The file needs a style sheet!"},{"dt":"CSS.","dd":"Get the style sheet that is used by StatblockWizard. You are free to use, edit, or redistribute this CSS file. The referenced fonts are available on the internet under the SIL Open Font License."},{"dt":"PNG.","dd":"Download the StatblockWizard PNG image file. Some browsers need the zoom level to be 100% to calculate the image size correctly."}]},{"type":"namedstring","caption":"Creator Actions.","value":"In the Creator, these actions are available:"},{"type":"list","listtype":"dl","values":[{"dt":"New Stat block.","dd":"Start a completely new stat block."},{"dt":"Upload JSON.","dd":"Load a StatblockWizard json file."},{"dt":"Viewer.","dd":"Open the Viewer."}]}]},{"type":"section","caption":"Bonus Actions","showcaption":true,"css":"section bonusactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Home Logo.","value":"Select the logo in the top of the screen to get back to the app's startup page."}]},{"type":"section","caption":"Reactions","showcaption":true,"css":"section reactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"text","value":"StatblockWizard's reactions only work if supported by your device and browser."},{"type":"namedstring","caption":"Hover.","value":"Each button in this app shows extra information if you hover your mouse pointer over it."},{"type":"namedstring","caption":"Shortcut Keys.","value":"You can use a keyboard to select many functions. The Hover feature shows the appropriate keys. Usually you need to press a key combination, like Alt+key or Control+Option+key. "},{"type":"namedstring","caption":"Drag & Drop.","value":"You can drop a StatblockWizard json file on the viewer page to upload it."}]},{"type":"section","caption":"Legendary Actions","showcaption":true,"css":"section legendaryactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack5e"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Home Page.","value":"On the home page, you can select one of these 4 actions:"},{"type":"list","listtype":"dl","values":[{"dt":"View a stat block.","dd":"Open the Viewer to see the current stat block."},{"dt":"Create or edit a stat block.","dd":"Open the Creator to work on the Stat block."},{"dt":"Legal information.","dd":"Shows legal information."},{"dt":"Clear saved stat block.","dd":"Remove all data that was stored by this app from your browser's storage. This will enable the Demo Stat block in the Viewer."}]}]},{"type":"section","caption":"Epic Actions","showcaption":true,"css":"section epicactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack5e"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Image.","value":"StatblockWizard supports one image in the stat block, which is embedded in the JSON and HTML files. It is also shown in the PNG files."},{"type":"text","value":"You can position the image in selected locations in the stat block."},{"type":"namedstring","caption":"Print.","value":"Use your browser's Print action from the Viewer to print the stat block using a printer-friendly styling with less color. The image is not printed. If you want to print a full-color version or one including the image, use the PNG file."}]},{"type":"section","caption":"Lair Actions","showcaption":true,"css":"section lairactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack5e"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[]},{"type":"section","caption":"Supplemental","showcaption":false,"css":"section supplemental","captioncss":""},{"type":"image","caption":"Image","showcaption":false,"css":"image","value":"data:image/png;base64,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","maxheight":20,"position":"last","alignment":"center","credits":"- ©2023 StatblockWizard"},{"type":"sectionend","content":"static","values":[]},{"type":"css","fortype":"namedstring","css":"line namedstring","captioncss":"keyword"},{"type":"css","fortype":"text","css":"line text"},{"type":"css","fortype":"attack5e","css":"line weapon","captioncss":"keyword","attackcss":"attack","hitcss":"hit"},{"type":"css","fortype":"list","forsubtype":"ul","listcss":"line list-ul","css":"listitem","captioncss":"keyword"},{"type":"css","fortype":"list","forsubtype":"ol","listcss":"line list-ol","css":"listitem","captioncss":"keyword"},{"type":"css","fortype":"list","forsubtype":"dl","listcss":"line list-dl","css":"listitem","captioncss":"keyword"},{"type":"css","fortype":"list","forsubtype":"spells5e","listcss":"line list-spells5e","captioncss":"spellliststart","css":"spelllist","spellcss":"spell"}]`
    );
}

function GetStatblocWizardDemo2024() {
    return JSON.parse(
        `[{"type":"version","version":"2024.2","columns":2},{"type":"group","css":"header"},{"type":"section","caption":"General","showcaption":false,"css":"section general","captioncss":""},{"type":"string","caption":"Name","showcaption":false,"defaultvalue":"","css":"title","captioncss":"","value":"Statblock Wizard"},{"type":"string","caption":"Creature info","showcaption":false,"defaultvalue":"","css":"sizetypetagsalignment","captioncss":"","value":"Medium Construct (software), Lawful Neutral"},{"type":"sectionend","content":"static","values":[]},{"type":"groupend"},{"type":"group","css":"core"},{"type":"section","caption":"","showcaption":false,"css":"section general2","captioncss":""},{"type":"string","caption":"AC","showcaption":true,"defaultvalue":"","css":"feature armorclass","captioncss":"keyword","value":"11"},{"type":"string","caption":"Initiative","showcaption":true,"defaultvalue":"","css":"feature initiative","captioncss":"keyword","value":"+1 (11)"},{"type":"sectionend","content":"static","values":[]},{"type":"section","caption":"","showcaption":false,"css":"section general3","captioncss":""},{"type":"string","caption":"HP","showcaption":true,"defaultvalue":"","css":"feature hp","captioncss":"keyword","value":"11 (2d8 + 2)"},{"type":"string","caption":"Speed","showcaption":true,"defaultvalue":"","css":"feature speed","captioncss":"keyword","value":"30 ft."},{"type":"sectionend","content":"static","values":[]},{"type":"tablesection","caption":"Abilities","showcaption":false,"css":"section abilities","captioncss":"","tablecss":"abilitiesblock"},{"type":"ability2024","caption":"Str","modcaption":"mod","savecaption":"save","defaultvalue":"","css":"ability","captioncss":"abilityname physicalabilities","scorecss":"abilityscore physicalabilities","modifiercss":"abilitymodifier physicalmods","savecss":"abilitysave physicalmods","number":1,"value":{"score":"8","mod":"-1","save":"-1"}},{"type":"ability2024","caption":"Dex","modcaption":"mod","savecaption":"save","defaultvalue":"","css":"ability","captioncss":"abilityname physicalabilities","scorecss":"abilityscore physicalabilities","modifiercss":"abilitymodifier physicalmods","savecss":"abilitysave physicalmods","number":2,"value":{"score":"13","mod":"+1","save":"+3"}},{"type":"ability2024","caption":"Con","modcaption":"mod","savecaption":"save","defaultvalue":"","css":"ability","captioncss":"abilityname physicalabilities","scorecss":"abilityscore physicalabilities","modifiercss":"abilitymodifier physicalmods","savecss":"abilitysave physicalmods","number":3,"value":{"score":"12","mod":"+1","save":"+1"}},{"type":"ability2024","caption":"Int","modcaption":"mod","savecaption":"save","defaultvalue":"","css":"ability","captioncss":"abilityname mentalabilities","scorecss":"abilityscore mentalabilities","modifiercss":"abilitymodifier mentalmods","savecss":"abilitysave mentalmods","number":1,"value":{"score":"15","mod":"+2","save":"+4"}},{"type":"ability2024","caption":"Wis","modcaption":"mod","savecaption":"save","defaultvalue":"","css":"ability","captioncss":"abilityname mentalabilities","scorecss":"abilityscore mentalabilities","modifiercss":"abilitymodifier mentalmods","savecss":"abilitysave mentalmods","number":2,"value":{"score":"10","mod":"+0","save":"+0"}},{"type":"ability2024","caption":"Cha","modcaption":"mod","savecaption":"save","defaultvalue":"","css":"ability","captioncss":"abilityname mentalabilities","scorecss":"abilityscore mentalabilities","modifiercss":"abilitymodifier mentalmods","savecss":"abilitysave mentalmods","number":3,"value":{"score":"14","mod":"+2","save":"+2"}},{"type":"tablesectionend","content":"static"},{"type":"section","caption":"Features","showcaption":false,"css":"section features","captioncss":""},{"type":"skills5e","caption":"Skills","showcaption":true,"defaultvalue":"","css":"feature skills","captioncss":"keyword","skillcss":"skill","value":""},{"type":"string","caption":"Vulnerabilities","showcaption":true,"defaultvalue":"","css":"feature vulnerabilities","captioncss":"keyword","value":""},{"type":"string","caption":"Resistances","showcaption":true,"defaultvalue":"","css":"feature resistances","captioncss":"keyword","value":""},{"type":"string","caption":"Immunities","showcaption":true,"defaultvalue":"","css":"feature immunities","captioncss":"keyword","value":""},{"type":"string","caption":"Gear","showcaption":true,"defaultvalue":"","css":"feature gear","captioncss":"keyword","value":""},{"type":"senses5e","caption":"Senses","showcaption":true,"defaultvalue":"","css":"feature senses","captioncss":"keyword","value":"Passive Perception 10"},{"type":"languages5e","caption":"Languages","showcaption":true,"defaultvalue":"","css":"feature languages","captioncss":"keyword","value":"Common, HTML, CSS, JavaScript"},{"type":"string","caption":"CR","showcaption":true,"defaultvalue":"","css":"feature cr","captioncss":"keyword","value":"0 (XP 10; PB +2)"},{"type":"sectionend","content":"static","values":[]},{"type":"groupend"},{"type":"group","css":"body"},{"type":"section","caption":"Characteristics (like Personality Traits, Ideals, Bonds, Flaws) ","showcaption":false,"css":"section characteristics","captioncss":""},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[]},{"type":"section","caption":"Traits","showcaption":true,"css":"section traits","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"StatblockWizard Viewer.","value":"The Viewer is where you see or download the formatted stat block."},{"type":"namedstring","caption":"StatblockWizard Creator.","value":"The Creator is the place where you create or edit the content of your stat block. You enter the text, StatblockWizard handles the layout."}]},{"type":"section","caption":"Actions","showcaption":true,"css":"section actions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack2024"},{"name":"saving throw","type":"save2024"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Viewer Actions.","value":"In the Viewer, these actions are available:"},{"type":"list","listtype":"dl","values":[{"dt":"Creator.","dd":"Open the Creator."},{"dt":"Columns","dd":"Toggle between 1 and 2 column view. The selected option affects the JSON, HTML, and PNG file export."},{"dt":"Transparent.","dd":"Loop through normal, semi transparent, and fully transparent backgrounds. The selected option affects the HTML and PNG file export."},{"dt":"Upload JSON.","dd":"Load a StatblockWizard json file."},{"dt":"JSON.","dd":"Download as a StatblockWizard json file. This contains everything required to later view or edit the stat block again. The name of the stat block will be used for the name of the file."},{"dt":"HTML.","dd":"Download as a StatblockWizard partial html file, containing a DIV element that you can use in your own html files. The file needs a style sheet!"},{"dt":"CSS.","dd":"Get the style sheet that is used by StatblockWizard. You are free to use, edit, or redistribute this CSS file. The referenced fonts are available on the internet under the SIL Open Font License."},{"dt":"PNG.","dd":"Download the StatblockWizard PNG image file. Some browsers need the zoom level to be 100% to calculate the image size correctly."}]},{"type":"namedstring","caption":"Creator Actions.","value":"In the Creator, these actions are available:"},{"type":"list","listtype":"dl","values":[{"dt":"New Stat Block.","dd":"Start a completely new stat block."},{"dt":"Upload JSON.","dd":"Load a StatblockWizard json file."},{"dt":"Viewer.","dd":"Save the current stat block in the browser's local storage, then show it in the Viewer."}]}]},{"type":"section","caption":"Bonus Actions","showcaption":true,"css":"section bonusactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack2024"},{"name":"saving throw","type":"save2024"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Home Logo.","value":"Select the logo in the top of the screen to get back to the app's startup page."}]},{"type":"section","caption":"Reactions","showcaption":true,"css":"section reactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"reaction","type":"reaction2024"},{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack2024"},{"name":"saving throw","type":"save2024"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"text","value":"StatblockWizard's reactions only work if supported by your device and browser."},{"type":"reaction2024","caption":"Hover.","trigger":"You hover your mouse pointer over a button.","response":"Extra information about this button's function is shown in a tooltip."},{"type":"namedstring","caption":"Shortcut Keys.","value":"You can use a keyboard to select many functions. The Hover feature shows the appropriate keys. Depending on your browser, you need to press a key combination, like Alt+key or Control+Option+key."},{"type":"reaction2024","caption":"Drag & Drop.","trigger":"You drop a StatblockWizard json file on the current stat block in the Viewer.","response":"The file is loaded and the stat block is shown."}]},{"type":"section","caption":"Legendary Actions","showcaption":true,"css":"section legendaryactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"legendary text","type":"legendarytext"},{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack2024"},{"name":"saving throw","type":"save2024"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"legendarytext","value":"Legendary Action Uses: 1. Immediately after opening the home page, StatblockWizard can expend a use to take one of the following actions. StatblockWizard regains all spended uses at the start of each of its turns."},{"type":"namedstring","caption":"Version Selection.","value":"Select the Original version or the 2024 version of the stat blocks. Your selection impacts the 'View' and 'Create or edit' Legendary actions."},{"type":"namedstring","caption":"View a stat block.","value":"Open the Viewer to see your current stat block."},{"type":"namedstring","caption":"Create or edit a stat block.","value":"Open the Creator to work on the stat block."},{"type":"namedstring","caption":"Legal information.","value":"Shows information about usage options and licenses. Send us a message using the email link at the top."},{"type":"namedstring","caption":"Clear saved stat block.","value":"Remove all data that was stored by this app from your browser's storage. If there is no stored stat block, the Creator and the Viewer will default to the 'Statblock Wizard' demo stat block."}]},{"type":"section","caption":"Epic Actions","showcaption":true,"css":"section epicactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack2024"},{"name":"saving throw","type":"save2024"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Image.","value":"StatblockWizard supports one image in the stat block, which is embedded in the JSON and HTML files. It is also shown in the PNG files."},{"type":"text","value":"<strong>Note:</strong> Stat blocks of this style usually have no image."},{"type":"namedstring","caption":"Print.","value":"Use your browser's Print action from the Viewer to print the stat block using a printer-friendly styling with less color. The image is not printed. If you want to print a full-color version or to include the image, use the PNG file."}]},{"type":"groupend"},{"type":"section","caption":"Supplemental","showcaption":false,"css":"section supplemental","captioncss":""},{"type":"image","caption":"Image","showcaption":false,"css":"image","maxheight":0,"position":"last","alignment":"center","beforeclass":"core","value":"","credits":""},{"type":"sectionend","content":"static","values":[]},{"type":"css","fortype":"namedstring","css":"line namedstring","captioncss":"keyword"},{"type":"css","fortype":"text","css":"line text"},{"type":"css","fortype":"legendarytext","css":"line legendarytext"},{"type":"css","fortype":"attack2024","css":"line attack","captioncss":"keyword","attackcss":"attacktype","hitcss":"hit"},{"type":"css","fortype":"save2024","css":"line savingthrow","captioncss":"keyword","savetypecss":"savingthrowtype","saveresultcss":"savingthrowresult"},{"type":"css","fortype":"reaction2024","css":"line reaction","captioncss":"keyword","triggercss":"trigger","responsecss":"response"},{"type":"css","fortype":"list","forsubtype":"ul","listcss":"line list-ul","css":"listitem","captioncss":"keyword"},{"type":"css","fortype":"list","forsubtype":"ol","listcss":"line list-ol","css":"listitem","captioncss":"keyword"},{"type":"css","fortype":"list","forsubtype":"dl","listcss":"line list-dl","css":"listitem","captioncss":"keyword"},{"type":"css","fortype":"list","forsubtype":"spells5e","listcss":"line list-spells5e","captioncss":"spellliststart","css":"spelllist","spellcss":"spell"}]`
    );
}
