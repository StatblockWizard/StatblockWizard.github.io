// Copyright 2023 StatblockWizard
var CreatingStatblock = false;
var currentID = 0;

window.addEventListener('load', CreateHomeLinks, false);

function StatblockWizardDemo() {
    return JSON.parse(
        `[{"type":"section","caption":"General","showcaption":false,"css":"section general","captioncss":""},{"type":"string","caption":"Name","showcaption":false,"defaultvalue":"","css":"title","captioncss":"","value":"Statblock Wizard"},{"type":"string","caption":"Size / Type / Alignment","showcaption":false,"defaultvalue":"","css":"sizetypealignment","captioncss":"","value":"Medium construct (software), lawful neutral"},{"type":"string","caption":"Armor Class","showcaption":true,"defaultvalue":"","css":"feature armorclass","captioncss":"keyword","value":"10"},{"type":"string","caption":"Hit Points","showcaption":true,"defaultvalue":"","css":"feature hitpoints","captioncss":"keyword","value":"4"},{"type":"string","caption":"Speed","showcaption":true,"defaultvalue":"30 ft.","css":"feature speed","captioncss":"keyword","value":"30 ft."},{"type":"sectionend","content":"static","values":[]},{"type":"section","caption":"Abilities","showcaption":false,"css":"section abilities","captioncss":""},{"type":"ability5e","caption":"STR","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"10"},{"type":"ability5e","caption":"DEX","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"10"},{"type":"ability5e","caption":"CON","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"10"},{"type":"ability5e","caption":"INT","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"10"},{"type":"ability5e","caption":"WIS","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"10"},{"type":"ability5e","caption":"CHA","css":"ability","captioncss":"abilityname","numberscss":"abilitynumbers","scorecss":"abilityscore","modifiercss":"abilitymodifier","value":"10"},{"type":"sectionend","content":"static","values":[]},{"type":"section","caption":"Features","showcaption":false,"css":"section features","captioncss":""},{"type":"string","caption":"Saving Throws","showcaption":true,"defaultvalue":"","css":"feature savingthrows","captioncss":"keyword","value":""},{"type":"skills5e","caption":"Skills","showcaption":true,"defaultvalue":"","css":"feature skills","captioncss":"keyword","skillcss":"skill","value":""},{"type":"string","caption":"Damage Vulnerabilities","showcaption":true,"defaultvalue":"","css":"feature vulnerabilities","captioncss":"keyword","value":""},{"type":"string","caption":"Damage Resistances","showcaption":true,"defaultvalue":"","css":"feature resistances","captioncss":"keyword","value":""},{"type":"string","caption":"Damage Immunities","showcaption":true,"defaultvalue":"","css":"feature immunities","captioncss":"keyword","value":""},{"type":"string","caption":"Condition Immunities","showcaption":true,"defaultvalue":"","css":"feature immunities","captioncss":"keyword","value":""},{"type":"senses5e","caption":"Senses","showcaption":true,"defaultvalue":"","css":"feature senses","captioncss":"keyword","value":"passive Perception 10"},{"type":"languages5e","caption":"Languages","showcaption":true,"defaultvalue":"","css":"feature languages","captioncss":"keyword","value":"Common, HTML, CSS, JavaScript"},{"type":"cr5e","caption":"Challenge","proficiencycaption":"Proficiency Bonus","css":"feature crproficiency","crcss":"cr","captioncss":"keyword","proficiencycss":"proficiency","proficiencycaptioncss":"keyword","value":"1"},{"type":"sectionend","content":"static","values":[]},{"type":"section","caption":"Characteristics (like Personality Traits, Ideals, Bonds, Flaws) ","showcaption":false,"css":"section characteristics","captioncss":""},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[]},{"type":"section","caption":"Special Traits","showcaption":false,"css":"section specialtraits","captioncss":""},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"StatblockWizard Viewer.","value":"The Viewer is where you see the formatted statblock. Here you can download the statblock in several file formats, to use wherever you need it."},{"type":"namedstring","caption":"Statblock Creator.","value":"The Creator is the place where you create or edit the content of your statblock."}]},{"type":"section","caption":"Actions","showcaption":true,"css":"section actions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack5e"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Viewer Actions.","value":"In the Viewer, these actions are available:"},{"type":"list","listtype":"dl","values":[{"dt":"Creator.","dd":"Open the Creator to edit the current statblock, or to create a totally new one."},{"dt":"Columns.","dd":"Switch between 1 and 2 column view. The selected option affects the HTML, SVG, and PNG file export."},{"dt":"Transparent.","dd":"Switch between normal and transparent backgrounds. The selected option affects the HTML, SVG, and PNG file export."},{"dt":"Upload JSON.","dd":"Load a StatblockWizard json file to show the contained statblock."},{"dt":"JSON.","dd":"Download the current statblock to a StatblockWizard json file. This file will contain all data that is required to later view or edit the statblock again. The name of the statblock will be used for the name of the file."},{"dt":"HTML.","dd":"Download the statblock as a StatblockWizard partial html file, containing a DIV element that you can use in your own html files. The file needs a style sheet!"},{"dt":"CSS.","dd":"Show the styling information that defines how StatblockWizard statblocks look. You are free to use, edit, or redistribute this at your own risk."},{"dt":"SVG.","dd":"Download the statblock as a StatblockWizard SVG file. This gives you the best image resolution. <strong>WARNING:</strong> the SVG format used is not widely supported. Test this for your preferred software. Modern browsers support the format."},{"dt":"PNG.","dd":"Download the statblock as a StatblockWizard PNG image file. The image is larger than you may expect, to give you good resolution."}]},{"type":"namedstring","caption":"Creator Actions.","value":"In the Creator, these actions are available:"},{"type":"list","listtype":"dl","values":[{"dt":"New Statblock.","dd":"Start a completely new statblock."},{"dt":"Upload JSON.","dd":"Load a previously exported StatblockWizard json file into this page, so you can edit it."},{"dt":"Viewer.","dd":"Open the Viewer using the current statblock. There you can download it in several file formats."}]}]},{"type":"section","caption":"Bonus Actions","showcaption":true,"css":"section bonusactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Home Logo.","value":"Select the logo in the top of the screen to get back to the app's startup page."}]},{"type":"section","caption":"Reactions","showcaption":true,"css":"section reactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Hover (*).","value":"Each button in this app shows extra information if you hover your mouse pointer over it."},{"type":"namedstring","caption":"Shortcut Keys (*, **).","value":"You can use a keyboard to select many functions. The Hover feature shows the appropriate keys."},{"type":"namedstring","caption":"Drag & Drop (*).","value":"You can drop a StatblockWizard json file on the viewer page to upload it."},{"type":"namedstring","caption":"*","value":"StatblockWizard's reactions only work if supported by your device."},{"type":"namedstring","caption":"**","value":"Shortcut keys depend on your browser. Usually you need to press a key combination, like Alt+key or Control+Option+key"}]},{"type":"section","caption":"Legendary Actions","showcaption":true,"css":"section legendaryactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack5e"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Home Page.","value":"On the home page, you can select one of these 4 actions:"},{"type":"list","listtype":"dl","values":[{"dt":"View an existing Statblock.","dd":"Open the Viewer to see an existing Statblock."},{"dt":"Create or edit a Statblock.","dd":"Open the Creator to work on a Statblock."},{"dt":"Legal information.","dd":"Shows copyright information."},{"dt":"Clear Saved Statblock.","dd":"Remove all data that was stored by this app from your browser's storage. This will enable the Demo Statblock in the Viewer."}]}]},{"type":"section","caption":"Epic Actions","showcaption":true,"css":"section epicactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack5e"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[{"type":"namedstring","caption":"Image.","value":"StatblockWizard supports one image in the statblock, which is embedded in the JSON, HTML, SVG, and PNG files. The image in the PNG file usually has reduced resolution."},{"type":"namedstring","caption":"Print.","value":"If you use your browser's Print action from the Viewer, a printer-friendly styling with less color will be used. The image is not printed."}]},{"type":"section","caption":"Lair Actions","showcaption":true,"css":"section lairactions","captioncss":"sectionheader"},{"type":"sectionend","content":"dynamic","contenttypes":[{"name":"feature","type":"namedstring"},{"name":"attack","type":"attack5e"},{"name":"plain text","type":"text"},{"name":"list","type":"list"}],"values":[]},{"type":"section","caption":"Supplemental","showcaption":false,"css":"section supplemental","captioncss":""},{"type":"image","caption":"Image","showcaption":false,"css":"image","value":"data:image/png;base64,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"},{"type":"sectionend","content":"static","values":[]},{"type":"css","fortype":"namedstring","css":"line namedstring","captioncss":"keyword"},{"type":"css","fortype":"text","css":"line text"},{"type":"css","fortype":"attack5e","css":"line weapon","captioncss":"keyword","attackcss":"attack","hitcss":"hit"},{"type":"css","fortype":"list","forsubtype":"ul","listcss":"line list-ul","css":"listitem","captioncss":"keyword"},{"type":"css","fortype":"list","forsubtype":"ol","listcss":"line list-ol","css":"listitem","captioncss":"keyword"},{"type":"css","fortype":"list","forsubtype":"dl","listcss":"line list-dl","css":"listitem","captioncss":"keyword"},{"type":"css","fortype":"list","forsubtype":"spells5e","listcss":"line list-spells5e","captioncss":"spellliststart","css":"spelllist","spellcss":"spell"}]`
    );
}

// #region 5e
function CR5e() { // each element is [cr (xp), proficiency bonus]
    return [
        { "value": "-1", "text": "--", "proficiencybonus": "0" },
        { "value": "0", "text": "0 (0 XP)", "proficiencybonus": "+2" },
        { "value": "1", "text": "0 (10 XP)", "proficiencybonus": "+2" },
        { "value": "2", "text": "1/8 (25 XP)", "proficiencybonus": "+2" },
        { "value": "3", "text": "1/4 (50 XP)", "proficiencybonus": "+2" },
        { "value": "4", "text": "1/2 (100 XP)", "proficiencybonus": "+2" },
        { "value": "5", "text": "1 (200 XP)", "proficiencybonus": "+2" },
        { "value": "6", "text": "2 (450 XP)", "proficiencybonus": "+2" },
        { "value": "7", "text": "3 (700 XP)", "proficiencybonus": "+2" },
        { "value": "8", "text": "4 (1,100 XP)", "proficiencybonus": "+2" },
        { "value": "9", "text": "5 (1,800 XP)", "proficiencybonus": "+3" },
        { "value": "10", "text": "6 (2,300 XP)", "proficiencybonus": "+3" },
        { "value": "11", "text": "7 (2,900 XP)", "proficiencybonus": "+3" },
        { "value": "12", "text": "8 (3,900 XP)", "proficiencybonus": "+3" },
        { "value": "13", "text": "9 (5,000 XP)", "proficiencybonus": "+4" },
        { "value": "14", "text": "10 (5,900 XP)", "proficiencybonus": "+4" },
        { "value": "15", "text": "11 (7,200 XP)", "proficiencybonus": "+4" },
        { "value": "16", "text": "12 (8,400 XP)", "proficiencybonus": "+4" },
        { "value": "17", "text": "13 (10,000 XP)", "proficiencybonus": "+5" },
        { "value": "18", "text": "14 (11,500 XP)", "proficiencybonus": "+5" },
        { "value": "19", "text": "15 (13,000 XP)", "proficiencybonus": "+5" },
        { "value": "20", "text": "16 (15,000 XP)", "proficiencybonus": "+5" },
        { "value": "21", "text": "17 (18,000 XP)", "proficiencybonus": "+6" },
        { "value": "22", "text": "18 (20,000 XP)", "proficiencybonus": "+6" },
        { "value": "23", "text": "19 (22,000 XP)", "proficiencybonus": "+6" },
        { "value": "24", "text": "20 (25,000 XP)", "proficiencybonus": "+6" },
        { "value": "25", "text": "21 (33,000 XP)", "proficiencybonus": "+7" },
        { "value": "26", "text": "22 (41,000 XP)", "proficiencybonus": "+7" },
        { "value": "27", "text": "23 (50,000 XP)", "proficiencybonus": "+7" },
        { "value": "28", "text": "24 (62,000 XP)", "proficiencybonus": "+7" },
        { "value": "29", "text": "25 (75,000 XP)", "proficiencybonus": "+8" },
        { "value": "30", "text": "26 (90,000 XP)", "proficiencybonus": "+8" },
        { "value": "31", "text": "27 (105,000 XP)", "proficiencybonus": "+8" },
        { "value": "32", "text": "28 (120,000 XP)", "proficiencybonus": "+8" },
        { "value": "33", "text": "29 (135,000 XP)", "proficiencybonus": "+9" },
        { "value": "34", "text": "30 (155,000 XP)", "proficiencybonus": "+9" }
    ];
}

function attacktype5e() {
    return [
        { "value": 0, "text": "Melee Weapon Attack:" },
        { "value": 1, "text": "Ranged Weapon Attack:" },
        { "value": 2, "text": "Melee or Ranged Weapon Attack:" },
        { "value": 3, "text": "Melee Spell Attack:" },
        { "value": 4, "text": "Ranged Spell Attack:" },
        { "value": 5, "text": "Melee or Ranged Spell Attack:" }
    ]
}

function abilitymodifier(score) {
    let x = Math.trunc(score / 2) - 5;
    return ((x < 0) ? x.toString() : `+${x.toString()}`);
}
// #endregion 5e


// #region Tools
function CreateHomeLinks() {
    let h = document.getElementsByClassName('homelink');
    if (h) {
        for (var i=0; i<h.length; i++) {
            h[i].addEventListener('click', () => {
                window.location.replace('../StatblockWizard.html');
            });
            h[i].accessKey = 'w';
            h[i].alt = `Open the StatblockWizard homepage. (shortcut key: ${h[i].accessKey})`;
            h[i].title = `Open the StatblockWizard homepage. (shortcut key: ${h[i].accessKey})`;
        }
    }
}

function AddHtmlTo(existing, addition, position = 'last') {
    if (addition) {
        if (addition.nodeName == '#text') {
            existing.appendChild(addition);
        } else
            if (addition.outerHTML != '') {
                if (position != 'first') {
                    existing.appendChild(addition);
                    existing.insertAdjacentHTML('beforeend', String.fromCharCode(13) + String.fromCharCode(10));
                } else {
                    existing.insertAdjacentHTML('afterbegin', String.fromCharCode(13) + String.fromCharCode(10));
                    existing.insertBefore(addition, existing.firstChild);   
                }
            }
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
                    if (element.forsubtype == subtype) {foundelement = element; }
                } else {
                    foundelement = element;
                }
            }
        }
    });
    return foundelement;
}

function GetElementValue(id) {
    let e = document.getElementById(id);
    if (e) { return e.value };
    return '';
}

function GetElementSrc(id) {
    let e = document.getElementById(id);
    if (e) { if (!e.parentElement.classList.contains('unavailable')) { return e.src } };
    return '';
}
// #endregion Tools

// #region DB
function DBsetStatblockWizard(value) {
    window.localStorage.setItem('StatblockWizard', JSON.stringify(value))
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
    f.appendChild(IMG(src, alt, imgclassnames));
    f.appendChild(FIGCAPTION(caption, captionclassnames));
    return f;
}

function H1(text, classnames) {
    let h1 = document.createElement('h1');
    h1.innerHTML = text;
    addClassnames(h1, classnames);
    return h1;
}

function H3(text, classnames) {
    let h3 = document.createElement('h3');
    h3.innerHTML = text;
    addClassnames(h3, classnames);
    return h3;
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
    if (defaultvalue) { input.setAttribute('value', defaultvalue) };
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
        lisp.innerHTML = v;
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
        dd.innerHTML = v.dd;
        addClassnames(dd, descclassnames);
        l.appendChild(dd);
    });
    return l;
}

function P(text, classnames) {
    let p = document.createElement('p');
    if (text) { p.innerHTML = text; };
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
    if (text) { span.innerHTML = text; };
    addClassnames(span, classnames);
    return span;
}

function TEXTNODE(text) {
    return (document.createTextNode(text));
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
            if (name != '') { e.classList.add(((CreatingStatblock && (name != 'StatblockWizard')) ? `StatblockWizard-${name}` : name)); };
        });
    };
}
// #endregion UI