// Copyright 2023, 2025 StatblockWizard
"use strict";
window.addEventListener('load', StartNewViewer, false);

var Viewer;
var Content = [];
let StatblockWizard;
let Statblock;
let StatblockGroup;
let StatblockSection;
let StatblockTable1;
let StatblockTable2;
let StatblockTable3;
let StatblockTablesClasses = '';
let StatblockName = '';
let inGroup = false;
let inSection = false;
let SectionPosition = 'last';
let currentzoom = '100%';
let transparency = 0;

function StartNewViewer() {
    document.getElementById('svgimg').addEventListener('load', svgimgOnLoadhandler);
    Content = DBgetStatblockWizard();
    if (Content[0].version != CurrentVersionNumber()) { updateStatblock2024(Content) };
    if (StartViewer()) {
        // allow dropping of json file
        Viewer.addEventListener('dragover', (event) => {
            event.preventDefault();
        })
        Viewer.addEventListener('drop', (event) => {
            if (event.dataTransfer.files.length == 1) {
                var fr = new FileReader();
                fr.onload = function () { ProcessFileViewer(fr.result) }
                fr.readAsText(event.dataTransfer.files[0]);
            }
            event.preventDefault();
        })
    };
}

function StartViewer() {
    Viewer = document.getElementById('StatblockWizardViewer');
    if (Viewer) {
        Viewer.innerHTML = '';
        CreateViewerContent();
        CreateViewerFooter();
        return true
    }
    return false
}

function CreateViewerContent() {
    StatblockWizard = DIV('StatblockWizard');
    Statblock = DIV('StatblockWizard-Content');
    CreateStatblockHtml();
    StatblockWizard.setAttribute('title', `Stat block of ${StatblockName}. See https://statblockwizard.github.io/Legal.html`);
    StatblockWizard.appendChild(Statblock);
    Viewer.appendChild(StatblockWizard);
}

function CreateViewerFooter() {
    let d = DIV('center');

    let openCreator = INPUTbutton('Creator', 'c', 'Open the Creator to edit the current stat block, or to create a totally new one.');
    d.appendChild(openCreator);
    openCreator.addEventListener('click', () => {
        window.location.replace('2024Creator.html');
    });

    let togglecolumns = INPUTbutton('Columns', '1', 'Switch between 1 and 2 column view. The selected option affects the JSON, HTML, and PNG file export.');
    d.appendChild(togglecolumns);
    togglecolumns.addEventListener('click', () => {
        Viewer.firstElementChild.classList.toggle('StatblockWizard-SingleColumn');
        Content[0].columns = 3 - Content[0].columns;
        DBsetStatblockWizard(Content);
    });

    let Transparent = INPUTbutton('Transparent', 't', 'Loop through normal, semi transparent, and fully transparent backgrounds. The selected option affects the HTML and PNG file export.');
    d.appendChild(Transparent);
    Transparent.addEventListener('click', () => {
        switch (transparency) {
            case 0:
                transparency++;
                Viewer.firstElementChild.classList.add('StatblockWizard-SemiTransparent');                
                break;
            case 1:
                transparency++;
                Viewer.firstElementChild.classList.remove('StatblockWizard-SemiTransparent');
                Viewer.firstElementChild.classList.add('StatblockWizard-Transparent');
                break;
            default:
                transparency = 0;
                Viewer.firstElementChild.classList.remove('StatblockWizard-Transparent');
                break;        
        }
    });

    let seljson = INPUTfile('.statblockwizard.json');
    if (seljson) {
        seljson.addEventListener('change', function () {
            var fr = new FileReader();
            fr.onload = function () { ProcessFileViewer(fr.result) }
            if (this.files[0] != '') {
                fr.readAsText(this.files[0])
                this.value = ''
                this.content = ''
            }
        })
    }
    let upjson = INPUTbutton('Upload JSON', 'u', 'Load a StatblockWizard json file to show the contained stat block.');
    d.appendChild(upjson);
    upjson.addEventListener('click', () => {
        seljson.click();
    });

    d.appendChild(SPAN('Download:', 'downloadoptionstext'))

    let dljsonbutton = INPUTbutton('JSON', 'j', 'Download the current stat block to a StatblockWizard json file. This file will contain all data that is required to later view or edit the stat block again. The name of the stat block will be used for the name of the file.');
    d.appendChild(dljsonbutton);
    dljsonbutton.addEventListener('click', () => {
        downloadjson(Content, StatblockName);
    });

    let dlhtmlbutton = INPUTbutton('HTML', 'h', 'Download the stat block as a StatblockWizard partial html file, containing a DIV element that you can use in your own html files. The file needs a style sheet!');
    d.appendChild(dlhtmlbutton);
    dlhtmlbutton.addEventListener('click', () => {
        downloadhtml(Viewer.firstElementChild, StatblockName);
    });

    let dlcss = INPUTbutton('CSS', 's', 'Show the styling information that defines how StatblockWizard stat blocks look. You are free to use, edit, or redistribute this at your own risk.');
    d.appendChild(dlcss);
    dlcss.addEventListener('click', () => {
        downloadcss();
    });

    // let dlsvg = INPUTbutton('SVG', 'g', 'Download the stat block as a StatblockWizard SVG file. This gives you the best image resolution. WARNING: the SVG format used is not widely supported. Test this for your preferred software. Modern browsers support the format.');
    // d.appendChild(dlsvg);
    // dlsvg.addEventListener('click', () => {
    //     downloadAsImageSVG(StatblockName);
    // });

    let dlpng = INPUTbutton('PNG', 'p', 'Download the stat block as a StatblockWizard PNG image file. The image is larger than you may expect, to give you good resolution.');
    d.appendChild(dlpng);
    dlpng.addEventListener('click', () => {
        downloadAsImagePNG(StatblockName);
    });

    Viewer.appendChild(d);
}

function CreateStatblockHtml() {
    StatblockName = 'monster';
    CreatingStatblock = true;
    inGroup = false;
    inSection = false;
    Content.forEach(element => {
        switch (element.type) {
            case 'version':
                //if (element.version != CurrentVersionNumber()) { updateStatblock2024(Content) };
                switch (element.columns) {
                    case 1: StatblockWizard.classList.add('StatblockWizard-SingleColumn');
                        break;
                    case 2: StatblockWizard.classList.remove('StatblockWizard-SingleColumn');
                        break;
                }
                break;
            case 'group':
                StatblockGroup = DIV(element.css);
                inGroup = true;
                AddToStatblockHtml(Osection(element));
                break;
            case 'groupend':
                if (inGroup) {
                    if (Ogroupend(StatblockGroup, element)) // do not add empty sections!
                    { AddHtmlTo(Statblock, StatblockGroup, 'last'); };
                };
                inGroup = false;
                break;
            case 'section':
                StatblockSection = DIV(element.css);
                inSection = true;
                SectionPosition = 'last';
                AddToStatblockHtml(Osection(element));
                break;
            case 'sectionend':
                if (inSection) {
                    if (Osectionend(StatblockSection, element)) // do not add empty sections!
                    {
                        if (inGroup) {
                            AddHtmlTo(StatblockGroup, StatblockSection, 'last');
                        } else {
                            AddHtmlTo(Statblock, StatblockSection, SectionPosition);
                        }
                    };
                };
                inSection = false;
                break;
            case 'tablesection':
                StatblockSection = DIV(element.css);
                inSection = true;
                SectionPosition = 'last';
                AddToStatblockHtml(Otablesection(element));
                break;
            case 'tablesectionend':
                if (inSection) {
                    if (Otablesectionend(StatblockSection, element)) // do not add empty sections!
                    {
                        if (inGroup) {
                            AddHtmlTo(StatblockGroup, StatblockSection, 'last');
                        } else {
                            AddHtmlTo(Statblock, StatblockSection, SectionPosition);
                        }
                    };
                };
                inSection = false;
                break;
            case 'string':
                AddToStatblockHtml(Ostring(element));
                break;
            case 'ac2024':
                AddToStatblockHtml(Oac2024(element));
                break;
            case 'ability2024':
                AddToStatblockHtml(Oability2024(element))
                break;
            case 'skills5e':
                AddToStatblockHtml(Oskills5e(element));
                break;
            case 'senses5e':
                AddToStatblockHtml(Osenses5e(element));
                break;
            case 'languages5e':
                AddToStatblockHtml(Olanguages5e(element));
                break;
            case 'cr5e':
                AddToStatblockHtml(Ocr5e(element));
                break;
            case 'image':
                AddToStatblockHtml(Oimage(element), element.position);
                break;
            default:
                break;
        }
    });
    CreatingStatblock = false;
}

// #region Tools
function AddToStatblockHtml(html, position = 'last') {
    html.normalize();
    if (inSection) {
        AddHtmlTo(StatblockSection, html, position);
        if (position == 'first') { SectionPosition = position };
    } else {
        AddHtmlTo(Statblock, html, position);
    }
}

function CatchAttackNameInSpan(text, css) {
    let s = SPAN();
    let uptopos = text.length;
    let dotpos = text.indexOf('.');
    switch (dotpos) {
        case (uptopos - 1):
            s.appendChild(TEXTNODE(text));
            addClassnames(s, css);
            break;
        case -1: // missing dot - append one
            s.appendChild(TEXTNODE(`${text}.`));
            addClassnames(s, css);
            break;
        default:
            let splittedname = text.slice(0, dotpos + 1).trim();
            let remainder = text.slice(splittedname.length).trim();
            s.appendChild(((css) ? SPAN(splittedname, css) : TEXTNODE(splittedname)));
            s.appendChild(TEXTNODE(remainder));
            addClassnames(s, 'nbspafter');
            break;
    }
    return s;
}

function CatchSpellNamesInSpan(t, spellnamecss) {
    return CatchWordsInCss(t, ['(', '*'], spellnamecss);
}


function CatchSkillsInSpan(t, skillcss) {
    return CatchWordsInCss(t, ['+', '-'], skillcss);
}

function CatchLanguages(t) {
    return CatchWordsInCss(t, []);
}

function CatchWordsInCss(t, splitters, css) {
    let s = SPAN();

    // let tlist = t.split(','); // do not spit at commas within parenthesis
    let tlist = [];
    var remainder = t;
    let commapos;
    let comma2pos;
    let par1pos;
    let par2pos;
    do {
        commapos = remainder.indexOf(',');
        par1pos = remainder.indexOf('(');
        par2pos = remainder.indexOf(')', par1pos);
        comma2pos = remainder.indexOf(',', par2pos);
        if ((commapos >= 0) && (par1pos >= 0) && (par1pos < commapos)) {
            commapos = ((par2pos > par1pos) && (comma2pos > par2pos)) ? comma2pos : -1;
        }

        if (commapos >= 0) {
            tlist.push(remainder.slice(0, commapos));
            remainder = remainder.slice(commapos + 1);
        } else {
            tlist.push(remainder);
            remainder = '';
        };
    } while (remainder != '');

    do {
        let thistext = tlist.shift().trim();
        let uptopos = thistext.length;
        splitters.forEach(splitter => {
            let splitterpos = thistext.indexOf(splitter);
            if (splitterpos >= 0) {
                if (splitterpos < uptopos) {
                    uptopos = splitterpos;
                }
            }
        });
        let splittedname = thistext.slice(0, uptopos).trim();
        let remainder = thistext.slice(splittedname.length).trim();
        s.appendChild(((css) ? SPAN(splittedname, css) : TEXTNODE(splittedname)));
        if (remainder != '') { s.appendChild(SPAN(remainder, 'nbspbefore')); };
        if (tlist.length > 0) { s.appendChild(TEXTNODE(', ')); }
    } while (tlist.length > 0);
    return s;
}

function InitStatblockTables(classes) {
    StatblockTable1 = [];
    StatblockTable2 = [];
    StatblockTable3 = [];
    StatblockTablesClasses = classes;
}

function ClearStatblockTables() {
    StatblockTable1 = null;
    StatblockTable2 = null;
    StatblockTable3 = null;
    StatblockTablesClasses = null;
}
// #endregion Tools

// #region Output
function Ostring(element) {
    if (element.value) {
        let p = P('', element.css);
        if (element.showcaption) { p.appendChild(SPAN(element.caption, element.captioncss)); };
        p.appendChild(SPAN(element.value));
        if (element.css == 'title') { StatblockName = element.value.replace(/<[^>]*>/g, ' ') };
        return p;
    };
    return emptyNode();
}

function Ogroup(element) {
    return emptyNode();
}

function Ogroupend(group, element) {
    let result = false;
    result = (StatblockGroup.innerHTML != '');
    return result;
}

function Osection(element) {
    if (element.showcaption) {
        let d = DIV(element.captioncss);
        d.appendChild(TEXTNODE(element.caption));
        return d;
    }
    return emptyNode();
}

function Osectionend(section, element) {
    let result = false;
    switch (element.content) {
        case 'dynamic':
            if (element.values) {
                element.values.forEach(value => {
                    let csselement = findcsselement(Content, value.type, value.listtype);
                    switch (value.type) {
                        case "namedstring":
                            if (Qnamedstring(value)) {
                                AddToStatblockHtml(Onamedstring(value, csselement));
                                result = true;
                            }
                            break;
                        case "text":
                            AddToStatblockHtml(Otext(value, csselement));
                            result = true;
                            break;
                        case "legendarytext":
                            AddToStatblockHtml(Otext(value, csselement));
                            result = true;
                            break;
                        case "list":
                            AddToStatblockHtml(Olist(value, csselement));
                            result = true;
                            break;
                        case "attack2024":
                            AddToStatblockHtml(Oattack2024(value, csselement));
                            result = true;
                            break;
                        case "save2024":
                            AddToStatblockHtml(Osave2024(value, csselement));
                            result = true;
                            break;
                        case "reaction2024":
                            AddToStatblockHtml(Oreaction2024(value, csselement));
                            result = true;
                            break;
                        case "spells5e":
                            AddToStatblockHtml(Ospells5e(value, csselement));
                            result = true;
                            break;
                        default:
                            break;
                    }

                });
            }
            break;
        case 'static':
            result = (StatblockSection.innerHTML != '');
            break;
        default:
            break;
    }
    return result;
}

function Otablesection(element) {
    InitStatblockTables(element.tablecss);
    if (element.showcaption) {
        let d = DIV(element.captioncss);
        d.appendChild(TEXTNODE(element.caption));
        return d;
    }
    return emptyNode();
}

function Otablesectionend(element) {
    let result1 = OStatblockTable(StatblockTable1)
    let result2 = OStatblockTable(StatblockTable2)
    let result3 = OStatblockTable(StatblockTable3)
    ClearStatblockTables();
    return (result1 || result2 || result3);
}

function Oability2024(element) {
    if (element.value && ((element.value.score + element.value.mod + element.value.save) != '')) {
        let tr = TR(element.css);
        tr.appendChild(TD(element.caption, element.captioncss));
        tr.appendChild(TD(element.value.score, element.scorecss));
        tr.appendChild(TD(element.value.mod, element.modifiercss));
        tr.appendChild(TD(element.value.save, element.savecss));
        switch (element.number) {
            case 1:
                if (StatblockTable1.length == 0) StatblockTable1.push(OStatblockTableHead(element));
                StatblockTable1.push(tr);
                break;
            case 2:
                if (StatblockTable2.length == 0) StatblockTable2.push(OStatblockTableHead(element));
                StatblockTable2.push(tr);
                break;
            case 3:
                if (StatblockTable3.length == 0) StatblockTable3.push(OStatblockTableHead(element));
                StatblockTable3.push(tr);
                break;
        }
    };
    return emptyNode();
}

function OStatblockTableHead(element) {
    let tr = TR();
    tr.appendChild(TH());
    tr.appendChild(TH());
    tr.appendChild(TH(element.modcaption));
    tr.appendChild(TH(element.savecaption));
    return tr;
}

function OStatblockTable(StatblockTable) {
    if (StatblockTable.length > 0) {
        let t = TABLE(StatblockTablesClasses);
        let thead = document.createElement('thead');
        thead.appendChild(StatblockTable.shift());
        let tbody = document.createElement('tbody');
        while (StatblockTable.length > 0)
            tbody.appendChild(StatblockTable.shift());
        t.appendChild(thead);
        t.appendChild(tbody);
        AddToStatblockHtml(t);
        return true;
    }
    return false;
}

function Oskills5e(element) {
    if (element.value) {
        let p = P('', element.css);
        if (element.showcaption) { p.appendChild(SPAN(element.caption, element.captioncss)); };
        p.appendChild(CatchSkillsInSpan(element.value, element.skillcss));
        return p;
    };
    return emptyNode();
}


function Oac2024(element) {
    // for now just use Ostring
    return Ostring(element);
}

function Osenses5e(element) {
    // for now just use Ostring
    return Ostring(element);
}

function Olanguages5e(element) {
    if (element.value) {
        let p = P('', element.css);
        if (element.showcaption) { p.appendChild(SPAN(element.caption, element.captioncss)); };
        p.appendChild(CatchLanguages(element.value));
        return p;
    };
    return emptyNode();
}

function Ocr5e(element) {
    if (element.value) {
        if (element.value >= 0) {
            let cr = CR5e().filter((v) => { return (v.value == element.value) })[0];
            let p = P('', element.css);
            let scr = SPAN('', element.crcss);
            scr.appendChild(SPAN(element.caption, element.captioncss));
            scr.appendChild(TEXTNODE(cr.text));
            p.appendChild(scr);

            let sproficiency = SPAN('', element.proficiencycss);
            sproficiency.appendChild(SPAN(element.proficiencycaption, element.proficiencycaptioncss));
            sproficiency.appendChild(TEXTNODE(cr.proficiencybonus));
            p.appendChild(sproficiency);
            return p;
        }
    };
    return emptyNode();
}

function Oimage(element) {
    if (element.value) {
        let imagetitle = `Image of ${StatblockName}`;
        if (element.credits) imagetitle = `${imagetitle} ${element.credits}`;
        let im = IMG(element.value, imagetitle, element.css);
        if (element.maxheight && element.maxheight > 0) im.setAttribute('style', `max-height:${element.maxheight}mm;`);
        if (element.alignment && element.alignment != 'center') addClassnames(im, `${element.css}-${element.alignment}`);
        addClassnames(im, `${element.css}-${element.position}`)
        return im;
    }
    return emptyNode();
}


function Qnamedstring(value) {
    return ((value.caption != '') && (value.value != ''));
}

function Onamedstring(value, csselement) {
    let l = P('', csselement.css);
    l.appendChild(SPAN(value.caption, csselement.captioncss))
    l.appendChild(SPAN(value.value));
    return l;
}

function Otext(value, csselement) {
    let v = value.value;
    if (v && (v != '')) {
        return P(v, csselement.css);
    }
    return emptyNode();
}

function Olist(value, csselement) {
    let v = value.values;
    if (v && (v != '')) {
        switch (value.listtype) {
            case 'ul':
            case 'ol':
                return LISTulol(value.listtype, v, csselement.listcss, csselement.css);
                break;
            case 'dl':
                return LISTdl(v, csselement.listcss, csselement.captioncss, csselement.css);
                break;
            case 'spells5e':
                return LISTspells5e(v, csselement.listcss, csselement.captioncss, csselement.css, csselement.spellcss);
                break;
        }
        return P(v, csselement.css);
    }
    return emptyNode();
}

function Oattack2024(value, csselement) {
    let c = value.caption;
    let at = value.attacktype;
    let a = value.attack;
    let h = value.hit;
    if ((c + at + a + h) != '') {
        let l = P('', csselement.css);
        l.appendChild(CatchAttackNameInSpan(c, csselement.captioncss));
        l.appendChild(SPAN(attacktype2024()[at].text, csselement.attackcss));
        l.appendChild(SPAN(a));
        l.appendChild(SPAN('Hit:', csselement.hitcss));
        l.appendChild(SPAN(h));
        return l;
    }
    return emptyNode();
}

function Osave2024(value, csselement) {
    let c = value.caption;
    let st = value.savetype;
    let dc = value.savedc;
    let f = value.failure;
    let f2 = value.secondfailure;
    let s = value.success;
    let fs = value.failureorsuccess;
    if ((c + st + dc + f + f2 + s + fs) != '') {
        // "captioncss": "keyword", "savetypecss": "savingthrowtype", "saveresultcss": "savingthrowresult"
        let l = P('', csselement.css);
        l.appendChild(CatchAttackNameInSpan(c, csselement.captioncss));
        l.appendChild(SPAN(savetype2024()[st].text, csselement.savetypecss));
        l.appendChild(SPAN(dc));
        if (f != '') {
            if (f2 == '') {
                l.appendChild(SPAN('Failure:', csselement.saveresultcss));
                l.appendChild(SPAN(f));
            } else {
                l.appendChild(SPAN('First Failure:', csselement.saveresultcss));
                l.appendChild(SPAN(f));
                l.appendChild(SPAN('Second Failure:', csselement.saveresultcss));
                l.appendChild(SPAN(f2));    
            }
        }
        if (s != '') {
            l.appendChild(SPAN('Success:', csselement.saveresultcss));
            l.appendChild(SPAN(s));
        }
        if (fs != '') {
            l.appendChild(SPAN('Failure or Success:', csselement.saveresultcss));
            l.appendChild(SPAN(fs));
        }
        return l;
    }
    return emptyNode();
}

function Oreaction2024(value, csselement) {
    let c = value.caption;
    let t = value.trigger;
    let r = value.response;
    if ((c + t + r) != '') {
        let l = P('', csselement.css);
        l.appendChild(CatchAttackNameInSpan(c, csselement.captioncss));
        l.appendChild(SPAN('Trigger:', csselement.triggercss));
        l.appendChild(SPAN(t));
        l.appendChild(SPAN('Response:', csselement.responsecss));
        l.appendChild(SPAN(r));
        return l;
    }
    return emptyNode();
}

function Ospells5e(value, csselement) { //deprecated
    let c = value.caption;
    let t = value.value;
    if ((c + t) != '') {
        let l = P('', csselement.css);
        l.appendChild(SPAN(c, csselement.startcss))
        l.appendChild(CatchSpellNamesInSpan(t, csselement.spellnamecss));
        return l;
    }
    return emptyNode();
}

function LISTspells5e(values, listclassnames, termclassnames, descclassnames, spellcss) {
    let vs = [];
    values.forEach(v => {
        vs.push({ dt: v.dt, dd: CatchSpellNamesInSpan(v.dd, spellcss).outerHTML });
    })
    return LISTdl(vs, listclassnames, termclassnames, descclassnames);
}
// #endregion Output

// #region Export
function downloadhtml(html, filename) {
    const file = new Blob([html.outerHTML], { type: 'text/html' });
    const fileURL = URL.createObjectURL(file);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', fileURL);
    linkElement.setAttribute('download', `${filename}.statblockwizard.html`);
    linkElement.click();
}

function downloadcss() {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', 'css/StatblockWizard.css');
    linkElement.setAttribute('download', 'StatblockWizard.css');
    linkElement.click();
}

function downloadAsImageSVG(filename) {
    CreateSVG('svg', filename);
}

function downloadAsImagePNG(filename) {
    currentzoom = document.body.style.zoom;
    document.body.style.zoom = '100%';
    CreateSVG('png', filename);
}

function CreateSVG(imgtype, filename) {
    let scale;
    switch (imgtype) {
        case "png":
            scale = 300 / 96; // convert from 96 dpi to 300 dpi
            break;
        case "svg":
            scale = 1;
            break;
        default:
            return
    };

    var requiredimgwidth;
    var requiredimgheight;
    requiredimgwidth = StatblockWizard.clientWidth + 2 * StatblockWizard.clientLeft + 4;
    requiredimgheight = StatblockWizard.clientHeight + 2 * StatblockWizard.clientTop + 4;

    let imgdiv = document.createElement('div');
    imgdiv.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    imgdiv.setAttribute('style', 'border:0;padding:0;');
    let style = document.createElement('style');
    style.innerHTML = GetImgCSS();
    imgdiv.appendChild(style);
    imgdiv.insertAdjacentHTML('beforeend', StatblockWizard.outerHTML);

    let imgregex = /(<img[^>]*)>/i;
    let brhrregex = /(<[bh]r)>/ig;
    let replaceby = '$1/>';

    let svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${requiredimgwidth * scale}" height="${requiredimgheight * scale}" style="font-size:16px;">
        <foreignObject 
            style="
                width:${requiredimgwidth}px;
                height:${requiredimgheight}px;
                transform:scale(${scale});
            "
        >${imgdiv.outerHTML.replace(imgregex, replaceby).replace(brhrregex, replaceby)}
        </foreignObject>
    </svg>
    `;

    switch (imgtype) {
        case "png":
            let StatblockImage = document.getElementById('svgimg');
            StatblockImage.setAttribute('imgexporttype', imgtype);
            StatblockImage.setAttribute('imgexportname', filename);
            StatblockImage.setAttribute('imgexportstylewidth', requiredimgwidth);
            StatblockImage.setAttribute('imgexportstyleheight', requiredimgheight);
            StatblockImage.setAttribute('imgexportwidth', requiredimgwidth * scale);
            StatblockImage.setAttribute('imgexportheight', requiredimgheight * scale);

            StatblockImage.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
            break;
        case "svg":
            const imageBlob = new Blob([svg], { type: 'data:image/svg+xml' });
            const imageURL = URL.createObjectURL(imageBlob)
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', imageURL);
            linkElement.setAttribute('download', `${filename}.statblockwizard.svg`);
            linkElement.click();
            break;
        default:
            return
    };
}

function svgimgOnLoadhandler() {
    let StatblockImage = document.getElementById('svgimg');
    let imgtype = StatblockImage.getAttribute('imgexporttype');
    let imgexportname = StatblockImage.getAttribute('imgexportname');
    switch (imgtype) {
        case 'png':
            let imgexportstylewidth = StatblockImage.getAttribute('imgexportstylewidth');
            let imgexportstyleheight = StatblockImage.getAttribute('imgexportstyleheight');
            let imgexportwidth = StatblockImage.getAttribute('imgexportwidth');
            let imgexportheight = StatblockImage.getAttribute('imgexportheight');
            downloadPNG(StatblockImage, imgexportstylewidth, imgexportstyleheight, imgexportwidth, imgexportheight, imgexportname);
            break;
    }
    document.body.style.zoom = currentzoom;
}

function downloadPNG(StatblockImage, imgexportstylewidth, imgexportstyleheight, imgexportwidth, imgexportheight, filename) {
    var canvas;
    var ctx;
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.style.width = imgexportstylewidth;
    canvas.style.height = imgexportstyleheight;
    canvas.width = imgexportwidth;
    canvas.height = imgexportheight;
    ctx.drawImage(StatblockImage, 0, 0);
    var a = document.createElement('a');
    a.href = canvas.toDataURL(`image/png`);
    a.download = `${filename}.statblockwizard.png`;
    a.click();
}

function GetImgCSS() {
    return `
    :root {
        --StatblockWizardBorder: #bcbcbc;
        --StatblockWizardMonstername: #700000;
        --StatblockWizardScreenborder: #600000;
        --StatblockWizardCoreText: #600000;
        --StatblockWizardText: #020202;
        --StatblockWizardBackground: #f8f4f0;
        --StatblockWizardAbilitiesRow1: #f8e8e0;
        --StatblockWizardAbilitiesRow2: #d0d0d0;
        --StatblockWizardModsRow1: #e8d0d0;
        --StatblockWizardModsRow2: #d8c0c0;
        --StatblockWizardSectionHeader: #500000;
        --StatblockWizardGrey: #696969;
        --StatblockWizardBoxShadow: #d0d0d0;
    }
    
    /* latin-ext */
    @font-face {
        font-family: 'StatblockWizard Sans';
        font-style: normal;
        font-weight: 400;
        src: local('StatblockWizard Sans'), url(data:font/woff2;base64,ZDA5R01nQUJBQUFBQUM0UUFBMEFBQUFBZGpnQUFDMjVBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUdvRVVHNXNzSElGS0JtQUFoMG9LZ1pOUS1Yd0xoV29BQVRZQ0pBT0xCZ1FnQllSbUI1bDdHNUJsQl9EbWlWcnVWbFhvR0VqLWtRajd3VW10TG9xeXlTa0ZfXy1uSkIxak9GWU5STkhmNm9lb3hHVGNvMFV6YXRreEVsay1aZ2FtbFFzTDBSSExDdzZQSHBfV2JQdFNad0dSNEE0Tk9IRXhRVHlLekc4RWxhaEVkZjRlM1E0b3hwMHJxOGJsNUI5VW1XWWZLNnhOX1B4NTRER3ZsZjJKM0Rvb3EyM2wwRGw3VTMtZE5ORmI1MDJSZE93d3RfM1Q5U3Y3UHNnTGQ1cEZYYnJJRVJyN0pKZjRZdXpMZmpOXzl5NUVwSmt0TUNnQ0d4ZVZTbmx5c1dGSkJQTUR2ODNfYzduWEJDeEFNRUdkVkFtb1lCQWxJUXBZaVJXelZpN0tSVHFYNWQ2cWZYdlJidlB2Yi01RnJzSzk1enIwNl9mYnYxS3hNNHQ0V3lJZVRiZmkwc1JTc2tSSU5LWkRhM1lUZlBscFA3Y2xMSXIxalVwbGxVU2ZsRWlJRTFILVZPemRYZWswUE1HekFCRGNZTGhiZGJ4dVh6TUpuTXlRN3F2S2s1QWdaMXBiUmRyUXJxb0FTOEhjZmdnaUJtRllORFZiTktSbUxzSk5yYlg3REtFeVgybTBJaDRxSmVEVGlaNXBabnJxSzNveU9DX2t5UWNWNmlfWDhtQ3pDZjhlNVlHZ2dMSUtRWGQ4dGFfeEZZNm16cW05LUpNdnpIYy04T3ItdnpFMzFCcVBSaWdra2lmcW1mM043XzV0LS1BbExIUTBFU3FsNFptU3dHRHBMcnhRQVJuV3VUX20tVTdIMF9VTHh3NXlscjVDV1lsTkdjdURGS2FWYThUR3BMTHM4RjhDZ0IyNHFEZ3dCUDVfZjZycmY3NVZBeVNWMkVFY2xnTFFoTFRMRDc3MF90TTNTTElkU1NHU1ZaRDhRNkN2X3lOamM1U1V5S2NUQU1zaGdDa25Vd0hZSGRiT0hVYkFkYzB5ZE9ycHRIY2Z1OWZ2Zi0zVnZ2Y25Od2l1cUZZVnlPY0tOMHBITGJ3ay03dG5DcnhOZ2NoLXR4dFZJQmtoUzhjenFpcFN0dkE4emFrdDNPc2ZvZk5KS2t3NnAwSlhfc1BjRUdUZENOMG1nZFhzbEotTklXMEhxdl9sU2tJZUdWdi04bE9iaDlJNlVXU0N5UVl6bktLVnk4ZlhsWFljcTFiNzN2T3FsZUlZakQ1RHJ2OEVCVmdkZ0JJS0I0VklJSU13eTRCd2NVRVVLNGFZYkFyRUNpc2dOdGtNY2RnUmlKTUdJSDd3QTV4el9nX3hxMV9oWEhVVnpvZ1JPQTg4Z1Bqb0V5UUJTQURnUWdrRkVrWmlJWkVtQVJKNWtpRVFZRlZ1bmJERGpyQzVJZTNjZVhzVFNDLWNWVGNDODdKcVp3dUV3d0F6Qm9IZTdodTNiMFFDMzZYbnQtY05XQmFBQUpYazlfMnNYdjNkaWxFRUNCeXdFbTdwU3hoWWZuZlpHNktFQVRINjdJa0hPZi1nU0lULUFCaFhCemxWbXVRWjhvZ0lyZUVMQTZvaGI1Z0dTbHhjeGpQYWlOd3lVQXBmRmJiSUZHSTFMUndCMDc5THYyNHI4NnJMNHJqd2owd3AtOTFGNnFLTVo4S0NGblBKMGpqMUl4eWhKakc2cVRIc2phRWl6MG5mbFhzZUxTMjZYUFZkOFRvVk1rLU9YTkdwM0JLZHgweUppUy1KV29BaU9GRUtySUhFUkJLdUtFNWNFc04zV0NYWHpYZmNGVHB6aXdxR2lWbHkxTnFPMkJDYTJKZDBaVm1CTlo4OFhfRWZxc1MxczFqeW5IanFmTDdmWUM5TWdYb0VOejlMVkdxeWZRMFlGRDFDenFlbTcyd0RFSm5Sa0dZeXdMckxCc1l0SmJOTzctWkFCaWFLdmJCTHZUTUc4Um1DTEVVcUNsX1FQQVZuN0RuVm9ROFcwQW4tQkhySVVyMTRUaWVrbTVEdWZNSVRkOEpYd1p4TTBsdVIyWW1RZ2U4WG9tVFNBbHpJb3RGQm8xRVdvaENrMDAzNkRQVzhkRm9vMkdJSHNVNWVUVnA4Nld1Mmw3dkRIXzZSNWFZUk9mNTFYNUdIa1NxTFBBcTc0TVRCd2NFVGs4RlRTQlJLSlEyQmpRdEJxVktJVGxNUXpMRVEwV0lyLU9peldZQXR0Z3V5d3g1LTlqcUk1SmdCT0tkOEFlZEwwU3JGTjg3emNxSFZFTU4taF9xblZZcExycUc1WWNQYzJiS29IbnFGNm8xUHZJd2h5MENORDBJRWNnSVFDdS1FSnBadjRzSVVHRmI0Z2lPSWhILWtrYUltSVFtd3lDSkRnOE5KYWtDOE1oVndLbUh6NWdsaXF0UmJrWjBtd1pzTW01OHBOcnh1TGNGVXN3WEVoU0FVRXR3bzFDYll5RGFMME9oQWczQVJtVDdnd1I5UTVCTzhBM0dYYkY1R0JOb0p5V3VHdmViampRXzhmZlNScjBfR3dEX0FRSVJBRkR3cE9rb1lZU0FsSnJFb09RQVZ3aUJDLVBTMWtQOUp2bXJiV2xsYzBmdUVvRjdhejhiellUeWlVcTVZRjlUNUhLWUlmMlQ1Rk1PSEZmRnFpZUpCRTRHU3NzdEFGQnpvZGVpNHpGdFdPRlNKdTRkNGxWZlYyX2IwdVNBSDVMZ19jZmhQNC1LY2U3NDBiREFQOUU1TlpSZ2xqaFdNN3ltRXlxZlJfT01ZTkpMRGdDODQ5WnJMQVpsOC0yVmxXdk1iSmhRcUpqX0NiX2xkZVVZd2RjV2lvNktCQlU3c3dBa0lxQjhrZndGLUM1VEFRNFFON0wyb09BcHBmT2lWQ05LZ0E5Y2lpOGdjTlVCT2dMT2k4bzN2cGZyUklJMHpmcWNuUFhEMW41LUV5QlFrV2JTaVNMeEVPaUtCUm16b1RBZ0tCZ0VsRUVBUWdZWVlBQnd3d2NnWFV1QWlBUUtaeUdrWFBGQ0E0RUZDQ0FvTVdDakFRNDR5VWZWRkc0ckZJbzlFV0ZLMDNMRlRrWGRCY09IU3VmektGVmxreHYzc2xmUG1qZldPTERpa3R2OUNnQkFqRnZpR1BvSUFEU1dSb0F4SmhxUEY3VUpPbzB4NEliOTZoRU0tOHQ2UGM3OFNfZlBJUVFPMWVXVGI4WlBZVmtFaDVGcHlYeFFzRGo3TnpBRFpDZEZjdFF2X2hJSjlsM0duSmx4cUpGTlIzb0t6SVBRYk84N2gyNE5lZHFXbkNSZ2NoRk5Heno1UXR1cDl3NzRGdkMyVUtucEVoSkRGODVMQTdLUnppWUdXSDlMTEM5VDlsUThjeTI5aE9ZTTBjYUJXODBKUkRNWGhNQWJZQ0NnQUhIeVkxZ0ZxakNjdTlXaThRYi1aNEswMTVERkFQcTlWd05aUW9BQmZaMzBveEliMXdLdl9NbXBlLUJpMEtsanc1SmZLNlpuNTVReWxHb1BGaHl2aHI0aEtMRjBWYklsR3I0aGVLM29qbUdHSEYzN0U0SUlIcmVpQkhuWjQ4TmtoT2xHSW9oU25KR1dvUUdWcVVOdDhlYjdNR0xBMWpXMEJaTi00amM1cFg3YmxjSDdNaGR6S1NFYnpJbV95b1dpbl9uRFJ5OUdyUm0tSWFVWnM4SUFSUWg2NWFNQk02R0NDNWNNU3FaLW5FdFcwODVFZlZNVHFqSExJOFUxWGxfel9fNWE0LXBQMTBiZHkwMjdPellueXpzSEZ6QlI4LUFqV093VUI0QUpuZ2dHQWhVNHJteFM5WEw1UWpMSkhWR1BYczBoQ3hzREVnZUtTTWNJcmNYallwRlExT3hHQ0syOXZ4X1NPRzUwa3RkRGxXdy0xYlhuZmVmMmc3clNtczFxR3RQMVB4emtOWnd4ZE5QS3pzVjlNX0dyaEQydl8yTGhrNjdLamF3NnUyamthVWNvenZLR3NXa0tWcVZYLTVma19yV3IzMUh1ZzJSUGpQZGZxbWRlT1JLclRHeE85MS1XdHFRRzRNd2hNQ3c3bXhBZm14aGZteFI5NjRnZExFMlJ4QW1CRktQb1NhbVdvVm9WbWRjS3NTYmpOaWJFdDhYYUdyZF9lQ095UHlMNElrOHBsc284MmhVSHFoQ0pYVFBETzJrUllsMGpyRTJWRG9tME1YYUl2WlB2TkZKX1lER3Z4bE1JcDg0T0haUW1XN0N0S1gxUDdrY1pQdEFaWm5HZDFnZFB2Y3Z3cDE5X0szVkxodGhyX3FUV3F6bjBOSG1yMFNKUEgycnpRN3FVT3IwenlRYmN4bUI0VVpnYURXZkdDMmZHR0JTSEF3aEJoU1FKaGVVTDBobVJMNG16Tk9OdkR0Q3NjQnlKMk1CSl9oV3hIV0Q0TDEtN3c3QWtfMXBpVEFjaDFnUG9TWkFHdzl1TWFiSENYQnF1OUJKYl9CRmdDQ2dxQmdfeUFsQkRGRkRBT2otY3o2V1gwZXNRMHhKQ0lPcTU1VEVPYTJMSlItbUlLOUdKMk4yOUd5VkNIQzRxWlRyM1EtSzV2Wk1TaVdURXhhQjB5SXpPLUNFQTNoVW1peE15akVmXzd3Y0Q4bmNuS3FKQ2ZsaERGZFpnWXFLR1U4ZUl6WHA2TWx4c2RxRkdJSHktSEJXSWNLNUZLMlpMU3FLNEJzdGpLeVJsWmtpdmhlNlRxS3JmTjNGYTUzeGtxTFBVS01ybE41NVdpMTFDcWxpcUI1S1h0ZEF6QVhnNGVtU01IMEhROU4wNTZZX3ZBU19XQmxtcXJGcFkzYWlfV3NBdE9tMS1WQS13TXVXYlpnQ1ZXSVFQUU1uMVRZWjMtZU42bG1xOXlqNlpyVWpOVUV6eUdCaUJtaUZoQmJCaG9TMlNEMHdadmRpc1NxbEsxb2JRcFJLVU1rRHJqdHBhajRyYU95Q2pPZks4cXpJclJ6TUtIdlpPdkZBbk5XcE8wdGZyWkZLNWdkUWxYMEFHdzR4eWxVRklPY2hLbElYVEIwOTlqVFpIRFNZSWVKZ3JjZF9uZXg1a3M4aVhSVXYzWUtVdy1wT3lYMDBiWDF2RTdvQ2tUM3JDdEdpY0hMUWdCQTRFRlhTVWIydExLUU10R0pHVGp6TmVBaG1WeWdNeVF3ZmtEMHVldW5sMHJENWxzSkVCdVlQNlZSWmdjQVZmRjRnWU83MFhGdkotVXVncWNuZzRuWVpPanlIVURxYURrUXhodnh5THBvQTRNY2R1cEdya0szelhpRTdsMkpNTzh5MDh4QUNabTRlazZzbmtYdGZlVmVWV2pqbTBNdUliOUxBZTJYMWJMcS1zMGVLRWh0SUFDbG1ESFNDQWRQcjdWR0ljUG9uSS1UQ3Jkam9sR3lObUhTMmdQRk5tTURrdWZwZk1UMVd3RDQ1OGh0T0EzQzZSdlBvbjJDdmZvVU5mUlBFY0FxcUFiM2I4ZFJMekxYWF92NHdZcW95Q0Q2RWt4b0plN1dmWEJ5WG1jOXQzd2pkLUFfNkl5THpHdlY4Z0JxcUFUai16S3cxTUxMQl9OTk5DUkZVcHJjTGFIUFk0VjVFZzJDVFY2TVcwNXV5MXlmdHJjSU9xVERRZnhXQVoxYV9HVUt0STN4RUJIODR0eUNKLTFKUWJyYkx2VlNSNmxROTRPN3NOdVpDNkl1MVJ5VHFRZ1l5ZlYteWdNWW5vRDhsZER4dXhKMFpMcUxQMEJ2aWVVZU9mc3VlV1dFSThsbjAtT3ZDOGVuOEhtaVdRczNZWkx5WEZ4eXBKYnprZzdLVkZtUUlLTGQtN051ZW5PRExFdE1wUTJOQm9lbUR5Sk9Oa042N3lxdVlZZmFSWVBhVEZnQzhadlZsOUZENThsYnhoUmoyWWNCMDMwT1JuTkxRLVZ4SUs3czdhaml3Y2pSWGVBblZVU19WYklYbHIyNjcwaU9YcHJ1UG1PcGFXWFlLZFVtRDl5QmxLTTdzeTlnVzFCOHNqX3U3OUJqelMtTkVSeGpsN3BEUkxuSHBzdHRlOGxPZzcycndURngxS084MWZjeWFUVVQzOG1pVEdFa0FRam9UWkRlb3VtSUoyTThGQnFMTEV4UkRObDZFanREQmdxdHhfYTJXOWQwQ1dveW45Z0dkV2loMjhWUXJsNkY5MlJrLUhzTXB1TkhvUHVfSVNGWXlHaDE4SjQ0TVNWWjFvWWtuYWc0UTA0Y0NKRWxMQy1DMktLeXdTajZOQW1HN3BkZ0FVcHFmZ1lUUDRhNmtYbDZLMXV1cm5kMU4yaHJ1OWhGSk5SbnpEM0FsSnh6cmg4dUdYeTVKeTNsbWFRVVJWNm53U2U4VmlMVjRvWDRyYUhNWTJSTl9jX1JxeGkwMW5vLWhhOUJ6dFZBRlRTczVSWFdDd2VZcUE0TTQ4UVU5VDd0dlpjNnhzbnQ4U0otOVRsMWlFWFhKVUZ6THRaTE50bDlxYk9JRGt5Z0RDYVMxaF9VZHotS3N3VW5DSkxKdkprVm1aR2MydHV5VW1pTE1LM2FJdUtVdTQ5SDZsVkhjbXBZQ01oQUJQZTR2TmVaZHlsU3d4S2FmR3gyLWl1UUlFQ2otYnBrdW1iTER5TWtCR05jM1laUHFKV2ZwMkpldWtBSWFzdVdkQTY5VndLR1NmNFJBQ25hYXAzVEwxeFJzaWVWWVZZTjNTNGlvZExiWVVfMFhpNWNNY3pzNkd6TG41U3U1alF6U0UyS0NMeXh0N2VaSU81OGRMXy13M1U1T3F3eGhIeXN6UnV0bkhGSTVBd3dDU1FZZlF5blZNWUVleHJ2UEhuNjEzMHNIaUh1VGRWTjBmUzEtTXBOajZ6ZExFRkdzVk1GWlgwMkp4Uk1FU09udVNuaWR4RGs0Q1h5ckhSZTZNcUV4RzczTWZHdHVJb1V4Vy1ZUnNEZnpPLWlvcFoyUk90ckJQYkM2OV9WLVcybG1OVm1BcTFPd0VyZjktZEhXVFF3eU13QjFkNURDbGpKRHQ3Q05PUGNrREc0LTdWNnprYmRiYlNvOTc4Q2NSbjlpdnE0NnZRam1KaEM3LUR1bHdidHI1UFFISUZXb2lxVW14aDlLQXd0LVgyRUxjTVo4S0JwRDAwYzNHQlVySFFvS0xTWjFhR0x5SmFHM2RWcmdCX215MVM0R2F4cU93Q1NCeUExSi0tSmNzLXlZaHZzMFgwTy1MSjB5eTJxN05hMm1MNmo3YnpsMDR4N2VQYnh1RVVUQW5TeDVqQ1NYRGNGME9EcjctZ0ozUnN5RzFVRHVFczdfTHNROFJRTllpTFlSNERiWDFmZFZVU2dxSHJ3SUs0WkJXWkp6ZENscWpNRWlrQ3pZb1VjQWVTek9ZU0pNSkgtSkxwY2daS3BZZ2dDRi1yaUd4T2trcHk4N2hBVWNRaDFBNkhXYk5rbDIwR3Nza2hlLUlnSXlTWHJvbHNQM1dyUVNXWHp6cVNMd2o5TWlUUWdqOW5GZ2pwakJOZTZWbVdsTzk2VkE0QmI3Y3I0SDJBdXZIb2UxeEZtQmcwVjFIOTBxbU5Xa3hQSXJjSzZQSkJ3UGUydUwyRm9iUHVidGJ1b3ZsMFVlbk1uS29qU1R1cTVQS3NKMnAxMXRDTzFEdXg1eVJwSEw4RDMyUEdTRjZqSm5DOEc1M3l1c0JKb09uZ2s1VEd3TGhSMjBaeXItZWx0QndubVh6U0ZDMGFmOVpoME0zQ2U1M3NEOFRPMHRjVkJlcUdxT2dLR2dRamlLUjljQnV4OEZnUW1YUmowQWc2RGppLU9IeGU0TUkxNXFpUDFaWlkxc1R4WnEzcGxSOGhISk9hWVNjZ3JqYWxiR1JTeGtiMC11akdZNXBsbnlJUkcyaEpGdmNiNTA3UlUwVXpoMk0zNE5tVFhMWjAtZ0Q0S2FlMnlVTW5PYTlna1Bobl8wRWZaMHBtZDZadlVtVHpmT0gwSGtnNW5TcG05X2FiTWxTakJ0ZU1GRS1NQlNtNWNFeGNtTHZNTVczSjhTVGlWcUxCV3FFMEVQUVBOV0ZvRDNjck8zUlNrUmRwaTdOR2tqbVIyREZHeEdNRGVsNUtCOS04R3BTcy0wVXlVZks4U2FPbkZhMlJaSjMzcEZsY3JkOTFzTy1zQl9TeVpERmxEcFE0cmRXcWxPZUpRZ3ZFczZJYUpldDZJWEJXXzBmQmxOeDBocmZvMjM1bFZXc3lZcDZUVUlQSmEtU0RtTGhFTS1ILVBQNUo3ZFB2VHItWGQyRjQyajA0MXhMdE9YMkVoZEtiM21EXzlsN183THE2dkJRdjQ0TFVzNF9UemtKaDcwLTZLbnFTUVNrUlp6N0M5bG5zZW5WYVRpdkhNbTFTaFRzaldacHNFOW1yQ2UwNUpXbmExT0trM0hiSXhqdG5abG5XTmpaWTE4N0pkcVVVaWI4N3ZWRVR3MDByVmt1N25FN0pwRUpObWlpRGRmTzNwZ29KRlBiMnI5dThaOVBtVFFkWHUzWFdqdlpGVTZlMnotMnctcU9aWW1RTnZ6VzlmU1F4dFc2QWEtLU03NWhRaE1fdHliS3ViV3l3cjUyZm5hY3Zsbjd6eDBKTm5GUmJvWloxT2FlTzc2MlBleEd6ZjdIaExfS05PbTQtaVlza0libDczWEtKbk0xc0xfeUc3MDZ1LXlLM1BVNmVvTGFlZFY5TUdsZmlVUFNaVkFZYVpDNDlfX2JCNnBLZjNPUG5fdnhNb1FONGthcHBKVWREOVVleG8tUV80LTB1cWU3TnJPZjdOSEN4aEZYZHJzUm1QeU13cm5jRHZfNUNlTzZEamNiNVdJelpWdVp5bE9YX2NKTnhIaWIycnBYbGdSWHZuTzR5cnEtdk42NlpudVYwVGNzeXJhbXZONjJmNW5LYVZibGEwU1RubFBxbC1ma3ljNHJUMnZybGFhR3c5eXRMYzF5cTIxemI0Mmxxd3N5VnVVNjEwWlNyeUMyRnd0NEx1dHBZWlpiZTVpaldCWDBXVmJxWlBKRlMwR0xQVGxOcnNoUHNMUkRJWjEyeV9XSGpTdmtKR3BOU0hIc1dfN0NFX2VCX2JJMVlLc3NzNGF0VUhuN2M2U3RtaGpCUm04Q24tNFp0S0dhVm5ZOVRTMlJ5dDBjQ3R5eG5qRGVNWnl5Z3hlc2E1S25kOWJOY2N4enNRbjA4ajItSVp4YzY1bVROcW5mXzBwWERqa1hMY19WVmMwbjFjN0YtYXNQT3dpcGJZZFZ4YXNNSmJHNXd3MHA5VmRiODVWV1ZpM29DekYxWWRiQzVxM3dSREg0YVhGSGdQdlU4MnZBQ3czWU50MTJuOGdaWGZBS0JOSi1xTk82UUZGQkxUUEFEUGpYTHJNbGE1dDRRUlBmWndlWm0wSDk2UTZsa0t3c2NUVVZjZlQwYWtjV2hhT0otRWM2ZkZGQ3VFbkhJd01iSG1oa2YwQXJ0a1BOSEpJLVF5V1NYVmZTMHVaUmRwYWtHZlVwbVRXR1dzdEpBZnlvYWUtOUFNRjVkcTFLMVpUblZiUTJxTkxFLVp0NXE3YjBvdmw3SWRDZTVuRFc2MkUwdUJjSEJnTmN0UmMxekp6dVU3ZVdwaWR5cmIxSG5WNjRoZlIzNmxaVk4wNnRWMmtfMzUwV3pIc1U3a19JTWxSQ0sxOVNucExZNXN0TGFQS21KSlZYZGRVVGZiVE5teXkweXh2VnZPMzA3TS1wY1BHWkpzeVVuWkdWQy1VNXRtZ2F6V19TNUdkUjFyNkwzUi1wTDdiVzYycDN3VWkxbzFhWFQ4NzJ3bmZtUjlDZy0xc0hVOGVRU3U0c2pJU3NHOTZaWEJWYlJaU0tyZ3kxbEJaMExKMVB0a3RJY3R5SlZvTEkyQzYxSHVNTnktVmM4M2xkeS1iQjhvdEdWd296bGlOd0I2SF9mWkFyTElnRG5rUE5IbklkaEUwcnR4dklTbVpPal8wWWN2MHRmRHM2aDdGdm84TmgteDQtbllndVhfbGRZUHhQMjRJVUw1RFhPSnRMUGZsaTNfR0NIQzV3amVtOEQtc3dxNUNYZHVKOXZULUJiemNyeWhBcWRwYndsUmNRR2pEcldfbmY5Ql9CaGpTcXRMY3NwN2RxblNxbTJLanV6cE9yNTFLWGJhbHh1VzIxNm1yM1c3YkxYUVBiNTRfcGFGTTlZdk5LS2VXRThtZU5JaXRWR2hTSHVfZ2xla3hxNm1UNkd4MlpmbVhub1VwT2NFMVVmYURxZUVFalhTcFltd2M5NFdRbVROLS1OanNFVGY2Q0hJY3k5a1JyR0tvNHFQOU1oc05NSE9tYm5NWVI3STZsWFh1emo2eGhuaEN5MkpwTUZvX2pNbEFJejBaeG14ZndtaGdWemRITUNCTUFsX24zOG8ySVVydVB0cHZJU21ZdWpQeWhtZmhaZVlNSEx3NHBTclNMWU91LXUyMFJySTJvcnNMWkE3U3dMTGN0S214V2tiY1BhQXJRVlJscm1yTHRWQm14MmdHNHUxaG1vNzlPaFVQQnowT25qZ2VvMm1SLW44TUhPSDBkeUtnbUhhS2J0MkRhU2FXc3VJV3VBR0xobjFmT0J6aC1iY0VkblU2UDAxWkZ6T1FHVDJkMDhqa1E3azNRWE9WUTlBY0Y1Qm5VZ2hDcG9HdjBlSW43YlRNYVhHcE1ENmhLb2Z3YUhQcjJtVlZxQ1h5MHhFMU82RHRnd1dZUGpWdDd5amNiUTRYOU5fejVpbURxX0c2NzhGaHIzMnhOdDZMNFNzQUJKNGtUTEZzems3M0FZdEdtNXJkeU02ZDJWTG10U29pS3pUcHpVNFM3VkdqWEZxdHlPc25XcWRiQVp6cDA1UXMxUkVabFBHSzNjY2lpYy1tY0lSZEIwNldjUV84YmFQYlZBcy1MN1psdHB2U3RvMURPNlhQQk9hYTRsRTVMWEZ0MmRWTk42cW5qQ180eDNrY1ZYRXNoX25malVmaGNmOWkwMTlPbXJ6R3hOZUdtWWVNdElacUlkYlhXMVNscmRyV2FWZVNSTGFLWko2aVd3Q1B6UUIzc292YTdlZXlSNklGbE9tUDVwQ1BxcjhpWGVROWtUSS12M0trV3hLX0Z3NmU4WG1vZDM0a24wQ2RidFBoWE4xRkFobWc1bEJXb0RweGVwSTdZT1VhV0xJdDhwRmhicGMwTy01VzhqaWpoaXh6cmRtdFUxSUlZdWs4OHJkTFZWSEFvTF9OVXlnalJ0NnFONFpSSG41c3Zoci1QbFd5VjBMeWZiUmpBc1dQZFVJMHB3RkpSVjk3bTNkODNybWV4cWNJVWJGcTZ0SlpkVW1tUkNwMXNFdHlUZFNYbTR1R3Q1WTlCcjNhcHVDUWdhUzBwRUtYUUZaS0l4YzFFdWZWUWRjZmdVVmFsTmhFd1Bua2tNdnVwRWlWSS1zVExmRERXcmVGWXVtVG90MG90bkRPTTFEbDRteXFnWlhnVlhWb3RXZ3dtZk04bVp2cWJXaXpEX2hVNnFtbEVxeVk0N3Z5Q21qcXViMlhld3YxbV9ydHVSbzNmVmR2cTBkbU5Obm9td0drODYteWZKMGw4ZEZERWMzbG5uWVk4M2lTVGhwN3BUbnJwNnM3TlpGVEtacGlaZHVhSjdPbTl0cHI2R2VQR1pfYUdtbndJMWZkWEUtQTYtUGJHVmx0UThtSGlCYWVGeUV0VEhxdk5VYVlXWjdHTnNfWDhVZFNDRW9PZ3hYN3A0Qk0xbnltdGRqMzZzcjFUc2c1NW13cGNTYkJZc194QkpQUk9DWjU2SF9VN2NkUWlmbXExRVdpTzlyc3cyX1FENFVzcllDb1VoOGRGd2RxS2tvR3hxWFdTTUNtZk5LVXFMbTdEdDc5dTJLR2xxdHVKNGRhRlpFLXRnb3UycjhHSHRBUlVxRVFkN2N2MlZWZWxJa21hNGN1MWt4QlpGQmxiaUxCbFFEVGlSM0pMYi1OUWFtN0s1TlBsRlNoMEdaWUVoeGFEOTY0aGJLYzAyamE0dVBMYmg3bGF6c3I0OFdibzJQbGZPZHZIMkVsZUptV2ZDVk1iY1c3YkxZSWFsX0ZXUmo4WmJ4RFpESVZSZllDcTV6Q1dNbjlvSkJUbUpXaUJRTTZnREpBSnpFbkxmM2N2T2JRUGZ4djg4TzR6dzR4TUwxQWtOWmkxaDJ5aURmNS1LcVRqOFpmSkh2LXRuY2RzSl9OdkZ2VXIyVF82czl0Vzh5cXpjXzdYVTNWWDdTR1A1T2J4TWROTHRQeWtrWFFnNG80aXJBaER0UTNUaTlGLUgtdlhKTUhNLWQ5cW5KNF93RFA0UkgwVWRJT0dacTgyWExpSXJhVFFpbFVhZ1VXY2ZFWng3LU9QVHdLSHZTTkcySHdkaUM1ZU9GTlJQcXlDeVkwWHhWVTVJVE91LVdmaDdUWnJDU2JRSUIydFRJNlRqVlNYa0doa294aHBkRVVnSDUxX2dSSTUtM0RvVXlub1o5SGtacjFxdnlnMWh6ajVWNVAyVFZjVnBpYzFXMDk4b0xiZkNtTDRWVnhORlBSTk1DTzNKdl9SZGxKY1c4X3NGRlhHYjlYNVFrMWxod2hhUHVKZUw1NmptbUhjWC1TbmpfQ1FCVTR0Y3VZSjktdHZhczNzTnNXcHl1aEJlLVpqYTA2V0R2WnNsRllubjVDN1loRmpjRUxJbUhrSE12MUxNZTdweUdjYUMxZzU4N0Q4VGtVS21BTmxfaDVwT2ZKemRTUnpYemlfZnRjWFl6VVUwV2xSNVFOLXZQa2owUnptam5yMXFzOC1mcXF1ZTZaRzQ0LVZXcFRJeG40VDFtTG44ekpRMFNWR09ORkZRU0pmaEt2cFhleVdhclJwanZ0MFpxdlRSYVd4cHlYdDRTblZlUVZsNFppUTh4QmMzVFcwT1lQdWFVTE9sUUJ0XzV0aFFxRE04SWJWY2xkaVc1VWhxTDB0TjBTUVpzcjB0cUVObmg4MHZaeXJzbUxTV2kzemxmTldsNnFwdDBfY1N5azdqSnlQejNjaDhfT1NJWDhKaUk2Sml3ekJFVkVRczdPa1BUYVRyRzFUeHZJNWpSUjBIdGQ1WFdsTnlZU3BlQWREbUstZFFkYjZaeF9DaXZLV0ZYNlZHUmZOVEZMbnduUU5UTHNOTXN4VjdNZEtPbDlrQkZKWUxEejJzanhDeEhUNVc2cVU4bFI0TnlfUDMyR3F6UWpmOEdiMXFEeW5hclpTMFRFX3ZDWHZRRkZ1a1RZQlVrOF9QNWFyWHMyNm40aXR1Ymp3Wk9IdTFkbTNqdk1ZOWhSUjhIUk5mcVNaNExXM053bGN6aVcxVFpqOG5zakpWYjU5WHRMeV81NURFNGl0aWY1czRkbzR3UHZYUWZLbFpmcFl0bndrS0tVOVJsb1REVFJGZmp6SFNwbWE2LVlOLVdnOHBwNmJTSmJkeXQzNWlmb3hWSktsbEpLZmtvR1NidlRtNlQ3SVVRYWYzNmNacldKZ0o1a254UjBXS296THBFeXZUZ3FWWTR5M1lSM2YtaDd5UG1vOW1yam5GekRNX2Nic2VGejhaenNEOFhfa2JzNWgyQzVLOFdKQ3FDQTQzZzJ0N1JvSVoyelZaVlV4WG1ZdlNrdEo4OHlhNzg3Z3ZERTBuRzJ4aURaM0swTmlVZFNmaGJnZUhwd3pZanEwSlpRbE5URFhLSEdlUGpFdVBmVy1PZmEtSmpET05pMVB4TlBIQ0FyWXdrU1ZzeGdpVGdEcTVYOTJ0LVpqX3hLOHVNYUFPYmpTYjNSVkZpUUtIaGNlTnY5ZURPbVA3SkgwNm95NlRiOGNPS2d2Um5HV1doTjgzOXJSSGNsVTZhV3FDb1cyUHBGWUNyc2taNDh5WUtpUGVqRTZhYkd0VmtOVW1Ucm8zLUgyOU5uZkNNWVpvMnpSMjdvdUJyX3pBLTZycXBCZmhiWG42M3FlR3lBUTZsZEZJdC00SDNOOVY5MHFkOGlYbFM5b1BsQWRXcDNoV0dubkxpSVhpV0dmdTBzbmRPVXR0VVpUaHZkV0dJd0VIczMycklJQnRqZHNXdHI0OWs2ZkR1TTliaGFmNGV1eDQ1eFA2dURGT0xGeF84S0tGbjJndGRocWo0TGR5eVJMSmQtcWJZdkl0WGlTclhjWXhNTThab0lRUG9jMGV0WGRGdG1KWnhaS3VnNTZBU2xsWm41RzNMSUI2NkZqZzRQT2k5NE1tMFI5VnB3NjE2aGRfOEJfYjg4SDBYbWN5dTVKVjlfaDZiTnZtN0hpdFNkOHRXZllkMGFpWGFGR0xNMWNkOEJWYWV2UTl0T1B4Z3NQMVNNMVpISjVIT3V6ZXRjbkpQVnhzM3VUaUhTNGFPVm9RcnpMSmZMRmpRM0JybUx1b1piTU1MdjR3U3llZnBUTnpuZjVfU0gxQWRPcWZxWmRYeGR4c0JYVF93Y1ZMaF9nR3RFWjg0TkxZUUhKQUFxN1BNbmhtTERXRGIwWlZrOUk5Y1VtWjZlcmtiQTh6alpONlRuenVNeDNEbktuVEdESVR6UXo0eXUtUGZaclpScWxmV0FSTFl5OU5LOHJCM0VNcl9rWmJEcVlIZHJxcTBwSXpNaTFsdFllTE11T015ZkgwZlVHNGVWb1dFSWMyclZ1ejVETUlPclcyZldUcEROdTVydkUxMVpuUndrZGdRMTdiWXVlOGk2aHJQTll3dEg2WlhEYy1kN3FTbTRzeE1La2o4bV8tSFJ6YUdGSVpMclRKME5MVG9aRFE0bUJQMkNUQk1oZzU5OEh2SWFRVm9nNjJYQ000VFl6dG8tbmd5TlV3TnpfWlB4bDZEaHNySEZSeUxaLWhIOGRLV3Y0dEktYlE4aVFXbWFIWDh1RUhvOEhtb2pwdjhIZzNuRlNYd1FZVzJvTXcya01hdFJUMkFNN1JpRFNxbFVha3RneGxsdEN2S1pTdlF5V0t0TDkwUENVVEhJT2FjNVN2VnZtWGRQRy1VTXItVTZINzNfTXY4YnVfQXJwcWZ0ZExFcy1KR25SZ0VmTjVPaTdRdi1pWjhKekVjdUtXcXhFem04blRjb0FyX1p6SF9WeXFuc3JsZlU2bUlaR1JRS1BCOGJVSWZNV3RZSE1xdUp3MkRydHREdmwtZVBoOWN1amw0M3N2Z3pSeE1HZl9mbW5fNzduN040THkyXzZpdFRNVVMwNTdnSjJLWlM3aW5jRDk0WFZERVRibnlmUVRrSHR6NHAwX3lXUnBMRVh0blJETGNfTUVfMTBvbWJLTFZ5aVAxTExLNkNfbmxWbEplMGxrZnN0Q01tbWh2cE9WM1k1NF81SFdqNVRGT0xZZWFzNlI5QWJ5dXRHNWpueE5kbU5HNlFTZDk5X1ptTjBldDJDV2hacU9PVHZMNnBCLWVfSWxsMk91eHBZbVhiODlkVV96NUpLM2lfQ2ljZHR2RDVPdUVCS0UwU3R1MThSY0xDbTZYR2JHNXZ6eTR2cFpjNVRXRHFpN0ZqZHBxaXp6OTFnd3p2MzUta1hkeW10ZnFuMFdyZ2F1QXdTSWFhclZpeVQ0N2k3QVBZQ2pSd0liZDQ0b0lvOGtUZzYtOElKR2dOQUJSZ2dSQ3FZbGtzR2FDMEM4ZEVGa0RCb1JpZERNVjQxREl2UFdVbzBWbDloekJNQkhvc1ZYUzZTTU5VY0dybHpneFU5cnhNQ0lzZmhyQzNQWk0zQkJOUHl5VW13RXYxVXpNWUtFcUNYMDZJckVSQWZ3b1VHcW9xUTVwbGw2bWxrQlNZQ1dTQ05Ca3BkbUMxUlVNNGs1RjEwUmF4MVFSNGtSSk9oLWo5Z0tEN2dnV3ZCQ0lySVF2MVVXY1dIUUZWRjBZSlpoTDhKcWxZS01oR3BvWWMxRmo1QmdyblZRQUkxc1ZzVVRneDRoM3ZWS2pFWVFpcmFJbGoxSDd2R0FDOV93QmRfaFNrSTFSeGF5WkkyV1VEV0hSNnk1eGFBUm50UTdnRFdhcHlxTnVEQm9STUpCRXFZZGd1ZUFMSjlyZ1d5R2szQ2RFT01JSVd5SjBBSUpZY1VacVMxU3diLWdFYUdBSkVwbnhKY2RCeVNKWGd4d0NjUkc5eXU0QUZZY09IR0dFMGFrRVJhSUkwVG9BRXdZaDlPeU05TzE4VzU4cm9aVGQ3ZWFKbkZ6S2tLQ3dnZ3F4cWtQeW1saUtObkJXbzZIRWxWWUFUQWV5eEdTeDYydGhFQVNyd1d5bDlNSUlydUVxUVhDWXNaWlY0UlNUeExDTUNLTGd4R2lnb1NMYXdDckdsamxQbWVFT250WjRld1ZjQTF6RU90a1FVZk8xSzN5RGh3Y0k3a3RyYXdtWk55RjVLOVFaY1ZaRC1GUHJ2V2tBQnBQc25jVjlKQU5LWUFySTVNMXpZUnZKcnRBN0Rod2xfdWMtWnJQLVJhWEl0QU1xV1BCQ2swUmFnYlBXWEdLRUZrQVdMMHRNUU1SYVFIM09IUFNDRGNiNUlKR3pINklIWlVmcWJKVWZrXzc0UC05LXlObDZtWHlOUk9hSHRUTld2MWdYVHpxem9XNmphbGM2ZXY0ejhldnZnV292WUhEZ1NkcllQN0djZ3hyUUVGdDBUUlkxclR6QmIyRU5pN1BVQWhxLTVaM2pyeWllc2xHVlVSN09JeXdGM0pkYzM4N28wd195Q1ZMSUhJaUJ0UXhaVF9JLXhRSU5GaEU3bDdON0hjejJ3TVlZZkZ5aDYyMXFXNTJGRFFmSV91MlVhUnJkZmpIODF1UUF6cGpfa0JXUldtc3dMTXRud2ZJeG0yZkY4aUdiVUVmbFNjMkk2aDBZNGhjNkFCNXBUMnlHQ0ZXUVBkdzU0d2w3R21RRXVyMlhLQ1FqMDFyeXg0dFZOaVg5NEpBUVdjQ0h5Ym94LTdxcG5FMHdaN2wyVnVySGE2dDJ3UFlDX2t5eG9nM1RjRjNWal9PSFpYSENBVkdiM2RRdFVuYTluTGg0NUVnXzhZRE9Ybm5RRlV2c01pU2VhTksyQm1nd1lMeGFJSWRpekdFSHljMmhBcnE3X2JBZUs1Z19rSGVvMG5BT0FVbjc1eDktNm9YZFdVR0FjWi1hZ19zVHQ0NTNGVzlUa0pfRHVkbzlRR1hCa2NwNTlYOUppWXg3eXpmMXhCRWNpRTZjemlnci01Z2RHaUFhT2lmR2dLTHBDak95Vk5DSHk1OWZFQTB5SUZkVFRDVUIwM2tmWFVIbHpDQTBlWDdPRUhlNkFtZHc4SHZKQnE2WDU2TFFYYXBYLVkxU0hCOWN6UElSalU2TjRKc1hKY09Od21hZDNJenlJamVtRVJXTkkwS2hxN2tiRGJhdVRUZTYzcW52emZPNjl4aUZEVWotTkJMbmFCLWFtTFpWQU1VWTJ1ZS1hMFJrY0NQT2t6SmdpNnJ4MXJrNG5SUVQ5ZFhlZTEtVW4zQVc0dzJMLVZPLXZLLUJ1eFd2THlKRUQ1STZjVTZrSnRydEN3LW93Wm8wM2JLTF9aVTM3eVk3bm9lZVc3TW5IeFctdXFPSDNWUWVTWnQtd0hoSm8xS1E2dklRVlVMOEpDTTRnSW5MMldzR0J1dVg5Q0hTX0o0OTVfMUZtMmpXenNLc01FOEVSc2FxR2VhMkZkM1ZqLU1NQjA1MjhTLXV0TTIwSnVSdm5xei1pX29JSTgwc2E5RzNVRG5NRWlWaklEME1vd3plX3pLODdfTlZPTHNWZEhaTktkMGszcG1lUWhRcV9YOFg2X3o1WmZ5bTBEUmZ3RnZubjVnRWZEZUJhMkt2OU9fbjVXdFBRUTBIRUJBdl9sX0NsWS1HcEpPYnd6eFpJWnpZaTFWWUFqVTF0Q3lLU3dWV2RWeWFpQVU1aEd2dDZVbFZlSVR2SUZlT3ZBUm5fOGwwWHktTGlZcHNpb1pLem9VdDJnaXEwZGVoNkRteW96VlpnUjVRMVljemd3UkZvOG9Ud2d6VGpSYkJjV1lRYThZdko3UDhaalRHRGc3bGJQaUlLSjFQbWVLRUxsVFpKeG9TRzZ0WWJUOGhwQzk2UDVqMGw2dDROdTFpa1RIWXhFZHhPTHE0Wjh1SnI0Wk9ISXhDWnFaQTQwZXhvalAySXRVWllGVm93engwa0dtTXUyYUVZNzlLZlRNR0FYLW0zZTV5M1NnNXRPLUdLRlFZcl9NNHNTRjRnWTJLdXF4S1p6MEhubG9KUnNUQjlqSUdJT05Va3lRbnFYMlVWYTNGSUJITFNidDFjR1VYWXJCZHhUbGNkVFJoVlFxVWZIb3FKb0RHMkZqc05HT2hWUmZyLVlCVVVuUHd0UklTM2VPdjQ0aWpJRXBmaEFOTmJfVUdLOHk5b2VWRUNxZUVfbjVrYXk0cm8xQS1peVpBWjB4QWhTdTZtb3VMVHlqWnM4VVRvd1RMUjAzcl9IRnNZYlI2S3diNDNqM29tZFhYS2FwRHhsS251eUotTXdTNVEzMWZIVDJsb1phVGM4Wmlqd1ZnbEtSSE9FbF84cVRlLWxyVlloVXFoU1pVYUFhUXl2Q1AtdFJ3TFNadXptbjJrQkJ4dEpDdzhqZDJlN3J1QTV0bjYyMjJWRHN2dGhPdkNyaG5ObTY1eDh2Qk9RNlN4RFU4SUY0RXJtQUFpc0RFbHBsNGRmLXVTaHI5UkRSaWF5SEU1Q0FlaWliSHd0ajBucGVxcFRXODk0ZXpNaTRHMEZ3a1U2Uk9wNlNLTEtEUjd0Nm0zZGFOcUVPM3FRM2JhdDJ0VVFjakd4Y1duVnA1MUhOcFVLTERsbmF0Ukp3cWxhclM1TUs3WEpWYXplYjlWWXRHS1NFeEdUa1ZPcTA2dVFSOEFrZEpGekk1WXNsVTJsV29WRzFtTmVnX1NUVlJseE9QZ1U1U2NsNjYtZVhocDZXZzhvclZYTkhMOFlnMEZ0bE1DNVZ4cVhZNjBxSWZYZGtFRlJSa2staktxaFc2dm5reGpzdDBXd1N5dERDazZ3WXowU0ZoRmUxNHRoZEVST2ZkUlNxTUJWQ0E5NGNDWEx3TWJxMlhxYzZqQUNpSTNWMWdxa3dKb3c2ZVNZcnpaNUcydnFLcHQxYWx4RE9rN09iZXhfLVFaYnJnRFlRajRtRmpZT0xoMDlBU0VSTVFpcUJuRUtpSkVvcFV1a1pHSm1ZWmJDd3NySEw1SkFsbTVOTGpseDU4aFVxMXIwWjhtQ1lscDNCaWNQcGN2ZXJ0WF9XNF9VQklBUWpLSVlUSkVYSHRMRWNqeThRaXNRU2FVSzdYS0ZVcVRWYW5kNWdOSmt6QUt2TjduQzYzQjZ2RDZ1bXJxR3BwYTJqcTZkdllHaGtiSklGbXBsYldGcFoyOWphMlRzNE9qbTd3SzRJRHVBSlJCS1pRcVhSMl9IbXhtQ3ljaUFjYmo2Y0x4Q0t4QkpwQ19oeVFpTGlLbU5vOUhFeWNncEtkRDgxRFMwZFBRTWpFM1BjTkNzYk80ZDNGQ2NYTnc4dkgzOGZDRUVoWVJGUk1YRUpTU25wVEtTc25MeUNvcEt5aXFxYXVvYW1scmFPcmg0S2pjSGk4QVFpS1p0TW9kTG9EQ2FMemVIeS1BS2hTQ3lSeXVRS3BVcXQwZXIwQnFQSmJMSGFjdTBPcHh3QUlSaEJzYWFOUm53U3BFS3A4bmdnWkVYVmRNTzBiTWYxZkFBUkpwUnhJWlUyMW5sLUVFWnhrbVo1VVZaMW8ybV9ObGJEeEtRNllxOG11TUE0dXZTR2F6TXNGYWdPU3BGN1hfNEx2SGVoMnFIdFNIalA5elBweGpicXZ3VzhfTjlXbUlOU25hTTJKZ1IwR3pVSU5xa3UzbElMck5iWmkwb1RzMmxxODlPVm15dWw1dlljMDN5VVp2cm8wTGdldjE5bHRQMUlPOXRzakFqdS1jcHB2djByZVhUVVZxTENfNnVYemhXYnFHdExLZ2RNMTZuTnJYbnREUFpqdnF6UnM4dGF5azRkRTk4VkdPQnhZQU1hT0xMaVlfMHk0S2g5MVhndm9jWE5HWmE1UVREYXBzMmdHZXY3MjNhaVloV09iY2JiZUdkV3EyT3hONFZrejlGVTdDVGxOcHFZczZyMEduYlV0SGFubXBzR3M1MWhscUliNG1HMXVzcC0yd3ZhbWF0ZkxNX1R5dldNMXhDR3M4a05OZk9PeDRzRmg2eVN6ZEwzVXl3OXQ1c0d5XzdwY3NES3k4WG41ZmZfZjYyNnpFR1pvempaN0NmU1hMckxMOEJ6dFA3VEJEY0JyWGZRc181YlhITVNfTkZhUzJncmZiRzhIYldoT081LWNYNDJfbUJudTFMYWZaRnRIa3FsSzU4cmo0c2hxU2JIRkFkLWdsZjQ5R0Z3RUdZcmIxa240TEFQNGlFLWptWnZYb0RORkZ4MVliSTlBQVFCemczckVBS0ZHZ2JoWnh6aVJCdDFhWmpvRjlGSVBtbC1UX3NoWnQ1RHh1RU5fVkotYklMOXA5QnRFcVJPU0ZsZGVsTFhkNnBuNFpyUTVucWhpRzhNLWpxdlNkQXhGSl9Qa1U1LWVrTjA5bTRpTUhUTlY2TVFOOHl2bFA3cVlMcEpYbi13OWpVTHpaNjZZQVZiWEJMOHhtQ3ZkUnFtMmRhOVM2Y3BCd2ZIT0dXbm1vTmdCTlZjVDJTNTJJR3RPRGw0cTk5NFhrODhFd1FIWEw3NW5mcUhNRENFalE1S1R4TjdLcHRpZjN1TE5HLVZ1T09QdlVYLTgwdmZrcjdfaDBsTjdmY3EyTmdNbmxUSjNPVEN4eXlERzFpdWZYMDFYN2p0cm5EbkdqbUVvS1Nwb1RyREhlV2RJX2IyaU9mOGdQdjUxd0FGSVNGWUdCSEJ4SEJ4UW9LVXBLUm9hVlpsT1dKZzFvTlFUZ2Riak1OTEVsMl9hMWtPOXdYZTZaOWU4WXVzMUNF) format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    
    /* latin */
    @font-face {
        font-family: 'StatblockWizard Sans';
        font-style: normal;
        font-weight: 400;
        src: local('StatblockWizard Sans'), url(data:font/woff2;base64,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) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    
.StatblockWizard {
    font-family: 'StatblockWizard Sans', Arial, Helvetica, sans-serif;
    color: var(--StatblockWizardText);
    background-color: var(--StatblockWizardBackground);
    columns: 2;
    gap: 8mm;
    width: 173mm;
    padding: 2mm;
    break-inside: avoid-page;
    clear: both;

    font-size: 0.8em;
    font-weight: 300;
    font-kerning: auto;
    letter-spacing: 0.02em;
    border: 3px var(--StatblockWizardBorder) double;
    border-radius: 6px;
    box-shadow: 2px 2px 4px var(--StatblockWizardBoxShadow);

    margin-top: 0;
    margin-bottom: 4px;
    margin-left: 0;
    margin-right: 0;
    padding: 0 7px 7px;
}

.StatblockWizard-SingleColumn {
    columns: 1;
    min-width: 100px;
    width: 84mm;
}

.StatblockWizard-Content {
    position: relative;
}

.StatblockWizard-Transparent {
    background-color: transparent;
    --StatblockWizardBackground: #f8f4f0;
    --StatblockWizardAbilitiesRow1: #f8e8e0;
    --StatblockWizardAbilitiesRow2: #d0d0d0;
    --StatblockWizardModsRow1: #e8d0d0;
    --StatblockWizardModsRow2: #d8c0c0;
}

.StatblockWizard-SemiTransparent {
    --StatblockWizardBackground: #f8f4f0c0;
    --StatblockWizardAbilitiesRow1: #f8e8e0c0;
    --StatblockWizardAbilitiesRow2: #d0d0d0c0;
    --StatblockWizardModsRow1: #e8d0d0c0;
    --StatblockWizardModsRow2: #d8c0c0c0;
}

.StatblockWizard-likeyword,
.StatblockWizard-keyword {
    font-weight: bold;
    letter-spacing: 0.02em;
}

.StatblockWizard-nbspbefore::before,
.StatblockWizard-nbspafter::after,
.StatblockWizard-keyword::after {
    content: '\u00a0';
}

.StatblockWizard-header {
    column-span: all;
}

.StatblockWizard-title {
    font-family: 'StatblockWizard Sans', Arial, Helvetica, sans-serif;
    font-size: 1.7em;
    font-variant: small-caps;
    font-weight: bold;
    letter-spacing: 0.06em;

    color: var(--StatblockWizardMonstername);
    padding: 0;
    margin: 0;
    width: 100%;
    border-bottom: 1px var(--StatblockWizardScreenborder) solid;
}

.StatblockWizard-sizetypetagsalignment {
    font-style: italic;
    color: var(--StatblockWizardGrey);
    margin-top: 2px;
    margin-bottom: 3px;
    padding-bottom: 2px;
}

.StatblockWizard-core {
    color: var(--StatblockWizardCoreText);
}

.StatblockWizard-general,
.StatblockWizard-general2,
.StatblockWizard-general3 {
    break-inside: avoid;
    border: none;
}

.StatblockWizard-general2 {
    width: 100%;
    columns: 2;
}

.StatblockWizard-abilities {
    box-sizing: border-box;
    break-inside: avoid;

    display: flex;
    flex-grow: initial;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    clear: both;
    border: none;
}

.StatblockWizard-abilitiesblock {
    border-collapse: collapse;
    margin: 3px 0;
}

.StatblockWizard-physicalabilities {
    background-color: var(--StatblockWizardAbilitiesRow1);
}
.StatblockWizard-physicalmods {
    background-color: var(--StatblockWizardModsRow1);
}

.StatblockWizard-mentalabilities {
    background-color: var(--StatblockWizardAbilitiesRow2);
}
.StatblockWizard-mentalmods {
    background-color: var(--StatblockWizardModsRow2);
}

.StatblockWizard-abilitiesblock th {
    font-size: 1em;
    font-weight: lighter;
    text-transform: lowercase;
    font-variant: small-caps;
    text-align: right;
    text-align-last: right;
    padding-right: 1px;
    color: var(--StatblockWizardGrey);
}

.StatblockWizard-ability {
    text-align: center;
    width: 2.5cm;
    padding: 1px 4px;
}

.StatblockWizard-abilityname {
    font-weight: bold;
    font-variant: small-caps;
    letter-spacing: 0.05em;
    text-align: left;
    padding-left: 3px;
    width: 1.5em;
}

.StatblockWizard-abilityscore {
    text-align: right;
    padding-right: 3px;
    width: 1.5em;
}

.StatblockWizard-abilitymodifier {
    text-align: right;
    padding-right: 3px;
    width: 1.5em;
}

.StatblockWizard-abilitysave {
    text-align: right;
    padding-right: 3px;
    width: 1.5em;
}

.StatblockWizard-features {
    border: none;
    margin-bottom: 2px;
    break-inside: avoid-column;
}

.StatblockWizard-feature {
    text-indent: -1em;
    padding-left: 1em;

    margin-top: 1px;
    margin-bottom: 2px;
}

.StatblockWizard-crproficiency {
    text-indent: 0;
    padding-left: 0;
}

.StatblockWizard-cr {
    margin-right: 3px !important;
    break-inside: avoid;
    break-after: auto;
}

.StatblockWizard-proficiency {
    break-inside: avoid;
}

.StatblockWizard-sectionheader {
    color: var(--StatblockWizardSectionHeader);
    font-variant: small-caps;
    font-size: 1.4em;
    letter-spacing: 0.02em;
    break-inside: avoid;
    break-after: avoid;

    width: 100%;
    margin-top: 10px;
    margin-bottom: 1px;
    border-bottom: 1px var(--StatblockWizardScreenborder) solid;
}

.StatblockWizard-characteristics {
    border-bottom: 2px var(--StatblockWizardScreenborder) solid;
    margin-bottom: 2px;
    break-inside: avoid-column;
}

.StatblockWizard-sectionheader+.StatblockWizard-line {
    break-before: avoid;
}

.StatblockWizard-line {
    margin-top: 5px;
    margin-bottom: 2px;
}

.StatblockWizard-line+.StatblockWizard-text {
    text-indent: 1em;
    margin-top: 2px;
    margin-bottom: 2px;
}

.StatblockWizard-sectionheader+.StatblockWizard-line {
    margin-top: 2px;
}

.StatblockWizard-attacktype,
.StatblockWizard-hit,
.StatblockWizard-savingthrowtype,
.StatblockWizard-savingthrowresult,
.StatblockWizard-trigger,
.StatblockWizard-response,
.StatblockWizard-italic {
    font-style: italic;
}

.StatblockWizard-hit::before,
.StatblockWizard-savingthrowresult::before,
.StatblockWizard-response::before {
    content: ' ';
}

.StatblockWizard-attacktype::after,
.StatblockWizard-hit::after,
.StatblockWizard-savingthrowtype::after,
.StatblockWizard-savingthrowresult::after,
.StatblockWizard-trigger::after,
.StatblockWizard-response::after {
    content: '\u00a0';
}

.StatblockWizard-detailline {
    text-indent: -1em;
    padding-left: 1em;
    margin: 0;
}

.StatblockWizard-namedstring .StatblockWizard-keyword,
.StatblockWizard-attack .StatblockWizard-keyword,
.StatblockWizard-savingthrow .StatblockWizard-keyword,
.StatblockWizard-reaction .StatblockWizard-keyword {
        font-style: italic;
}

.StatblockWizard-legendarytext {
    font-style: italic;
    color: var(--StatblockWizardGrey);
}

.StatblockWizard-spellliststart {
    font-weight: bold;
}

.StatblockWizard-spellliststart::after {
    content: '\u00a0';
}

.StatblockWizard-spell {
    font-style: italic;
    break-before: avoid-column;
}

.StatblockWizard-list-ol {
    margin-top: 0;
    padding: 0 0 0 1em;
    list-style-type: decimal;
    list-style-position: outside;
    break-before: avoid-column;
    counter-reset: itemcounter;
}

ol li.StatblockWizard-listitem {
    counter-increment: itemcounter;
}

ol li.StatblockWizard-listitem::marker {
    content: counter(itemcounter) ": ";
    font-weight: bold;
}

.StatblockWizard-list-ul {
    margin-top: 0;
    padding: 0 0 0 1em;
    list-style-type: disc;
    list-style-position: outside;
    break-before: avoid-column;
}

dl.StatblockWizard-list {
    margin-top: 5px;
    margin-bottom: 2px;
}

.StatblockWizard-line+dl.StatblockWizard-list {
    margin-top: 2px;
}

dt.StatblockWizard-keyword,
dt.StatblockWizard-spellliststart {
    float: left;
    clear: left;
}

dt.StatblockWizard-keyword::after {
    content: '\u00a0';
}

dd.StatblockWizard-listitem,
dd.StatblockWizard-spelllist {
    margin-left: 1em;
}

.StatblockWizard-supplemental {
    width: 100%;
}

.StatblockWizard-image {
    display: block;
    border: none;
    padding: 0;
    max-width: 60mm;
    margin: 0 auto;
}

.StatblockWizard-image-left {
    margin: 0 auto 0 0;
}

.StatblockWizard-image-right {
    margin: 0 0 0 auto;
}

.StatblockWizard-image-first {
    margin-bottom: 1mm;
}

.StatblockWizard-image-last {
    margin-top: 1mm;
}

.StatblockWizard hr {
    margin: 2px 0;
    border-style: none;
    border-top: 0;
    border-right: 0;
    border-left: 0;
    border-bottom: 1px var(--StatblockWizardScreenborder) solid;
}`;
}
// #endregion Export