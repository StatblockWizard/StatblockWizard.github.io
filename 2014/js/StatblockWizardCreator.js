// Copyright 2023, 2025 StatblockWizard
"use strict";
window.addEventListener('load', StartCreator, false);

var Creator;
var Content = [];
var proposedFocusId = '';

function StartNewCreator() {
    Content = StatblockDefinition5e();
    CreateCreatorPage();
}

function StartCreator() {
    Content = DBgetStatblockWizard();
    CreateCreatorPage();
}

function CreateCreatorPage() {
    Creator = document.getElementById('StatblockWizardCreator');
    if (Creator) {
        Creator.innerHTML = '';
        CreateCreatorHeader();
        CreateCreatorContent();
        CreateCreatorFooter();

        HideImageSettingsForPosition();
        activateFirstTitle();
    };
}

function CreateCreatorHeader() {
    Creator.appendChild(HR());
}

function CreateCreatorFooter() {
    Creator.appendChild(HR());
    let d = DIV('center');

    let startnewbutton = INPUTbutton('New Stat block', 'n', 'Start a completely new stat block.');
    d.appendChild(startnewbutton);
    startnewbutton.addEventListener('click', () => {
        StartNewCreator();
    });

    let seljson = INPUTfile('.statblockwizard.json');
    if (seljson) {
        seljson.addEventListener('change', function () {
            var fr = new FileReader();
            fr.onload = function () {
                ProcessFileCreator(fr.result);
            }
            if (this.files[0] != '') {
                fr.readAsText(this.files[0])
                this.value = ''
                this.content = ''
            }
        })
    }
    let upjson = INPUTbutton('Upload JSON', 'u', 'Load a previously exported StatblockWizard json file into this page, so you can edit it.');
    d.appendChild(upjson);
    upjson.addEventListener('click', () => {
        seljson.click();
    });

    let openViewer = INPUTbutton('Viewer', 'v', 'Save the current stat block in the browser\'s local storage, then show it in the Viewer. There you can export it in several file formats.');
    d.appendChild(openViewer);
    openViewer.addEventListener('click', () => {
        UpdateContent();
        removeids(Content);
        DBsetStatblockWizard(Content);
        window.location.replace('Viewer.html');
    });

    Creator.appendChild(d);
}

function CreateCreatorContent() {
    Content.forEach(element => {
        switch (element.type) {
            case 'section':
                AddToCreator(Isection(element));
                break;
            case 'sectionend':
                let savedvalues = element.values;
                AddToCreator(Isectionend(element));
                if (savedvalues) {
                    savedvalues.forEach(value => {
                        Iadd(value.type, value.subtype, element.id, value);
                    });
                };
                break;
            case 'string':
                AddToCreator(Istring(element));
                break;
            case 'ability5e':
                AddToCreator(Iability5e(element));
                break;
            case 'skills5e':
                AddToCreator(Iskills5e(element));
                break;
            case 'senses5e':
                AddToCreator(Isenses5e(element));
                break;
            case 'languages5e':
                AddToCreator(Ilanguages5e(element));
                break;
            case 'cr5e':
                AddToCreator(Icr5e(element));
                break;
            case 'image':
                AddToCreator(Iimage(element));
                break;
            default:
                break;
        }
    });
}

function AddToCreator(html) {
    AddHtmlTo(Creator, html);
}

function UpdateContent() {
    Content.forEach(element => {
        switch (element.type) {
            case 'section':
                Usection(element);
                break;
            case 'sectionend':
                Usectionend(element);
                break;
            case 'string':
                Ustring(element);
                break;
            case 'ability5e':
                Uability5e(element);
                break;
            case 'skills5e':
                Uskills5e(element);
                break;
            case 'senses5e':
                Usenses5e(element);
                break;
            case 'languages5e':
                Ulanguages5e(element);
                break;
            case 'cr5e':
                Ucr5e(element);
                break;
            case 'image':
                Uimage(element);
                break;
            default:
                break;
        }
    });
}

function StatblockDefinition5e() {
    return [
        { "type": "section", "caption": "General", "showcaption": false, "css": "section general", "captioncss": "" }
        , { "type": "string", "caption": "Name", "showcaption": false, "defaultvalue": "", "css": "title", "captioncss": "" }
        , { "type": "string", "caption": "Creature info", "showcaption": false, "defaultvalue": "", "css": "sizetypetagsalignment", "captioncss": "" }
        , { "type": "sectionend", "content": "static" }
        , { "type": "section", "caption": "", "showcaption": false, "css": "section general2", "captioncss": "" }
        , { "type": "string", "caption": "Armor Class", "showcaption": true, "defaultvalue": "", "css": "feature armorclass", "captioncss": "keyword" }
        , { "type": "string", "caption": "Hit Points", "showcaption": true, "defaultvalue": "", "css": "feature hitpoints", "captioncss": "keyword" }
        , { "type": "string", "caption": "Speed", "showcaption": true, "defaultvalue": "30 ft.", "css": "feature speed", "captioncss": "keyword" }
        , { "type": "sectionend", "content": "static" }
        , { "type": "section", "caption": "Abilities", "showcaption": false, "css": "section abilities", "captioncss": "" }
        , { "type": "ability5e", "caption": "STR", "defaultvalue": 10, "css": "ability", "captioncss": "abilityname", "numberscss": "abilitynumbers", "scorecss": "abilityscore", "modifiercss": "abilitymodifier" }
        , { "type": "ability5e", "caption": "DEX", "defaultvalue": 10, "css": "ability", "captioncss": "abilityname", "numberscss": "abilitynumbers", "scorecss": "abilityscore", "modifiercss": "abilitymodifier" }
        , { "type": "ability5e", "caption": "CON", "defaultvalue": 10, "css": "ability", "captioncss": "abilityname", "numberscss": "abilitynumbers", "scorecss": "abilityscore", "modifiercss": "abilitymodifier" }
        , { "type": "ability5e", "caption": "INT", "defaultvalue": 10, "css": "ability", "captioncss": "abilityname", "numberscss": "abilitynumbers", "scorecss": "abilityscore", "modifiercss": "abilitymodifier" }
        , { "type": "ability5e", "caption": "WIS", "defaultvalue": 10, "css": "ability", "captioncss": "abilityname", "numberscss": "abilitynumbers", "scorecss": "abilityscore", "modifiercss": "abilitymodifier" }
        , { "type": "ability5e", "caption": "CHA", "defaultvalue": 10, "css": "ability", "captioncss": "abilityname", "numberscss": "abilitynumbers", "scorecss": "abilityscore", "modifiercss": "abilitymodifier" }
        , { "type": "sectionend", "content": "static" }
        , { "type": "section", "caption": "Features", "showcaption": false, "css": "section features", "captioncss": "" }
        , { "type": "string", "caption": "Saving Throws", "showcaption": true, "defaultvalue": "", "css": "feature savingthrows", "captioncss": "keyword" }
        , { "type": "skills5e", "caption": "Skills", "showcaption": true, "defaultvalue": "", "css": "feature skills", "captioncss": "keyword", "skillcss": "skill" }
        , { "type": "string", "caption": "Damage Vulnerabilities", "showcaption": true, "defaultvalue": "", "css": "feature vulnerabilities", "captioncss": "keyword" }
        , { "type": "string", "caption": "Damage Resistances", "showcaption": true, "defaultvalue": "", "css": "feature resistances", "captioncss": "keyword" }
        , { "type": "string", "caption": "Damage Immunities", "showcaption": true, "defaultvalue": "", "css": "feature immunities", "captioncss": "keyword" }
        , { "type": "string", "caption": "Condition Immunities", "showcaption": true, "defaultvalue": "", "css": "feature immunities", "captioncss": "keyword" }
        , { "type": "senses5e", "caption": "Senses", "showcaption": true, "defaultvalue": "", "css": "feature senses", "captioncss": "keyword" }
        , { "type": "languages5e", "caption": "Languages", "showcaption": true, "defaultvalue": "", "css": "feature languages", "captioncss": "keyword" }
        , { "type": "cr5e", "caption": "Challenge", "proficiencycaption": "Proficiency Bonus", "css": "feature crproficiency", "crcss": "cr", "captioncss": "keyword", "proficiencycss": "proficiency", "proficiencycaptioncss": "keyword" }
        , { "type": "sectionend", "content": "static" }
        , { "type": "section", "caption": "Characteristics (like Personality Traits, Ideals, Bonds, Flaws) ", "showcaption": false, "css": "section characteristics", "captioncss": "" }
        , { "type": "sectionend", "content": "dynamic", "contenttypes": [{ "name": "feature", "type": "namedstring" }, { "name": "plain text", "type": "text" }, { "name": "list", "type": "list" }] }
        , { "type": "section", "caption": "Special Traits", "showcaption": false, "css": "section specialtraits", "captioncss": "" }
        , { "type": "sectionend", "content": "dynamic", "contenttypes": [{ "name": "feature", "type": "namedstring" }, { "name": "plain text", "type": "text" }, { "name": "list", "type": "list" }] }
        , { "type": "section", "caption": "Actions", "showcaption": true, "css": "section actions", "captioncss": "sectionheader" }
        , { "type": "sectionend", "content": "dynamic", "contenttypes": [{ "name": "feature", "type": "namedstring" }, { "name": "attack", "type": "attack5e" }, { "name": "plain text", "type": "text" }, { "name": "list", "type": "list" }] }
        , { "type": "section", "caption": "Bonus Actions", "showcaption": true, "css": "section bonusactions", "captioncss": "sectionheader" }
        , { "type": "sectionend", "content": "dynamic", "contenttypes": [{ "name": "feature", "type": "namedstring" }, { "name": "plain text", "type": "text" }, { "name": "list", "type": "list" }] }
        , { "type": "section", "caption": "Reactions", "showcaption": true, "css": "section reactions", "captioncss": "sectionheader" }
        , { "type": "sectionend", "content": "dynamic", "contenttypes": [{ "name": "feature", "type": "namedstring" }, { "name": "plain text", "type": "text" }, { "name": "list", "type": "list" }] }
        , { "type": "section", "caption": "Legendary Actions", "showcaption": true, "css": "section legendaryactions", "captioncss": "sectionheader" }
        , { "type": "sectionend", "content": "dynamic", "contenttypes": [{ "name": "feature", "type": "namedstring" }, { "name": "attack", "type": "attack5e" }, { "name": "plain text", "type": "text" }, { "name": "list", "type": "list" }] }
        , { "type": "section", "caption": "Epic Actions", "showcaption": true, "css": "section epicactions", "captioncss": "sectionheader" }
        , { "type": "sectionend", "content": "dynamic", "contenttypes": [{ "name": "feature", "type": "namedstring" }, { "name": "attack", "type": "attack5e" }, { "name": "plain text", "type": "text" }, { "name": "list", "type": "list" }] }
        , { "type": "section", "caption": "Lair Actions", "showcaption": true, "css": "section lairactions", "captioncss": "sectionheader" }
        , { "type": "sectionend", "content": "dynamic", "contenttypes": [{ "name": "feature", "type": "namedstring" }, { "name": "attack", "type": "attack5e" }, { "name": "plain text", "type": "text" }, { "name": "list", "type": "list" }] }
        , { "type": "section", "caption": "Supplemental", "showcaption": false, "css": "section supplemental", "captioncss": "" }
        , { "type": "image", "caption": "Image", "showcaption": false, "css": "image", "maxheight": 0, "position": "last", "alignment": "center" }
        , { "type": "sectionend", "content": "static" }
        // below lines are used for setting class names
        , { "type": "css", "fortype": "namedstring", "css": "line namedstring", "captioncss": "keyword" }
        , { "type": "css", "fortype": "text", "css": "line text" }
        , { "type": "css", "fortype": "attack5e", "css": "line weapon", "captioncss": "keyword", "attackcss": "attack", "hitcss": "hit" }
        , { "type": "css", "fortype": "list", "forsubtype": "ul", "listcss": "line list-ul", "css": "listitem", "captioncss": "keyword" }
        , { "type": "css", "fortype": "list", "forsubtype": "ol", "listcss": "line list-ol", "css": "listitem", "captioncss": "keyword" }
        , { "type": "css", "fortype": "list", "forsubtype": "dl", "listcss": "line list-dl", "css": "listitem", "captioncss": "keyword" }
        , { "type": "css", "fortype": "list", "forsubtype": "spells5e", "listcss": "line list-spells5e", "captioncss": "spellliststart", "css": "spelllist", "spellcss": "spell" }
    ];
}

// #region Tools
function updatemodifier(id) {
    let e = document.getElementById(id);
    if (e) {
        let i = e.getAttribute('modifierid')
        let m = document.getElementById(i);
        if (m) { m.innerText = abilitymodifier(e.value); };
    };
}

function activateFirstTitle() {
    let elist = document.getElementsByClassName('title');
    if (elist.length > 0) {
        elist[0].focus();
    }
}

function proposeFocus(id) {
    proposedFocusId = id;
}

function activateProposedFocus() {
    if (proposedFocusId != '') {
        let e = document.getElementById(proposedFocusId);
        if (e) {
            e.focus();
        }
    }
    proposedFocusId = '';
}
// #endregion Tools

// #region Input
function Isection(element) {
    return H2(element.caption);
}

function Isectionend(element) {
    switch (element.content) {
        case 'dynamic':
            let d = DIV();
            let id = newID();
            d.setAttribute('id', id);
            d.setAttribute('elements', '[]');
            element.id = id;
            element.contenttypes.forEach(contenttype => {
                let b = INPUTbutton(`Add ${contenttype.name}`, null, `Add a new ${contenttype.name} section to the current stat block.`);
                b.setAttribute('contenttype', contenttype.type);
                b.setAttribute('beforeid', id);
                b.addEventListener('click', function () {
                    Iadd(this.getAttribute('contenttype'), this.getAttribute('contentsubtype'), this.getAttribute('beforeid'));
                    activateProposedFocus();
                });
                d.appendChild(b);
            });
            return d;
            break;
        case 'static':
            break;
        default:
            break;
    }
    return emptyNode();
}

function Iadd(type, subtype, before, value) {
    let element = findcsselement(Content, type, subtype);
    if (element) {
        let d = DIV('createdelement');
        let id = newID();
        d.setAttribute('id', id);
        d.setAttribute('sectionendid', before);
        d.setAttribute('elementtype', type);

        let d1 = DIV('elementmanager');
        let b = INPUTbutton('x', null, 'Remove this section from the stat block. Any data in this section will be lost.');
        b.addEventListener('click', function () {
            Iremove(id);
        });
        d1.appendChild(b);

        let updown = SPAN('');
        updown.setAttribute('id', `${id}-updown`);
        d1.appendChild(updown);

        d.appendChild(d1);

        let d2 = DIV(['elementinput', type]);
        switch (type) {
            case "namedstring":
                d2.appendChild(Inamedstring(element, id, value));
                break;
            case "text":
                d2.appendChild(Itext(element, id, value));
                break;
            case "list":
                d2.appendChild(Ilist(element, id, value));
                if (value) { IlistSetListtype(id, value.listtype, value.values); };
                break;
            case "weapon5e": // deprecated
            case "attack5e":
                d2.appendChild(Iattack5e(element, id, value));
                break;
            case "spells5e": //deprecated, now use list
                d2.appendChild(Ispells5e(element, id, value));
                break;
            default:
                alert(`Adding a ${type} before id=${before}`);
                break;
        }
        d.appendChild(d2);

        let I = document.getElementById(before);
        if (I) {
            I.insertAdjacentElement('beforebegin', d);

            // to keep track of created new elements
            let se = document.getElementById(before);
            let seelementslist = JSON.parse(se.getAttribute('elements'));
            seelementslist.push(id);
            se.setAttribute('elements', JSON.stringify(seelementslist));
            Icreateupdown(before, seelementslist)
        };

        switch (type) {
            case "namedstring":
                break;
            case "text":
                break;
            case "list":
                if (value) { IlistSetListtype(id, value.listtype, value.values); };
                break;
            case "weapon5e": // deprecated
            case "attack5e":
                break;
            case "spells5e": // deprecated
                break;
            default:
                alert(`Adding a ${type} before id=${before}`);
                break;
        }
    }
}

function Iremove(id) {
    let d = document.getElementById(id);
    if (d) {
        let seid = d.getAttribute('sectionendid');
        let se = document.getElementById(seid);
        if (se) {
            let seelementslist = JSON.parse(se.getAttribute('elements'));
            for (var i = 0; i < seelementslist.length; i++) {
                if (seelementslist[i] == id) {
                    seelementslist.splice(i, 1);
                }
            }
            se.setAttribute('elements', JSON.stringify(seelementslist));
            Icreateupdown(seid, seelementslist)
        }
        Creator.removeChild(d);
    }
}

function Icreateupdown(seid, seelementslist) {
    for (var i = 0; i < seelementslist.length; i++) {
        let s = document.getElementById(`${seelementslist[i]}-updown`);
        if (s) {
            let id = seelementslist[i];
            s.innerHTML = '';
            if (i > 0) {
                let otherid = seelementslist[i - 1];
                let bup = INPUTbutton('up', null, 'Move this section up.');
                bup.addEventListener('click', function () {
                    Iswitch(seid, id, otherid);
                });
                s.appendChild(bup);
            };
            if (i < (seelementslist.length - 1)) {
                let otherid = seelementslist[i + 1];
                let bdown = INPUTbutton('down', null, 'Move this section down.');
                bdown.addEventListener('click', function () {
                    Iswitch(seid, otherid, id); // switch always moves up
                });
                s.appendChild(bdown);
            }
        }
    }
}

function Iswitch(endid, thisid, otherid) {
    // switch always moves up
    // update the html
    let thisdiv = document.getElementById(thisid);
    let otherdiv = document.getElementById(otherid);
    otherdiv.insertAdjacentElement("beforebegin", thisdiv);
    // update the sectionend
    let se = document.getElementById(endid);
    let seelementslist = JSON.parse(se.getAttribute('elements'));
    let thisindex = seelementslist.indexOf(thisid);
    let otherindex = seelementslist.indexOf(otherid);
    seelementslist[thisindex] = otherid;
    seelementslist[otherindex] = thisid;
    se.setAttribute('elements', JSON.stringify(seelementslist));
    // recreate updown buttons
    Icreateupdown(endid, seelementslist);
}

function Istring(element) {
    let p = P();
    let i = INPUTtext(element.defaultvalue, 50, 'aligned full');
    if (element.css == 'title') { addClassnames(i, element.css) };
    let id = newID();
    i.setAttribute('id', id);
    i.setAttribute('swtype', 'fixedcaption');
    i.setAttribute('swcaption', element.caption);
    if (element.value) { i.setAttribute('value', element.value) };
    element.id = id;
    p.appendChild(LABEL(id, element.caption));
    p.appendChild(i);
    proposeFocus(id);
    return p
}

function Iability5e(element) {
    let p = P();
    let i = INPUTnumber(1, 30, element.defaultvalue, 'aligned');
    let id = newID();
    let modifierid = newID();
    i.setAttribute('id', id);
    i.setAttribute('modifierid', modifierid);
    i.setAttribute('onchange', `updatemodifier(${id});`);
    i.setAttribute('swcaption', element.caption);
    i.setAttribute('swtype', 'number');
    if (element.value) { i.setAttribute('value', element.value); };
    element.id = id;
    p.appendChild(LABEL(id, element.caption));
    p.appendChild(i);
    let s = SPAN((element.value) ? abilitymodifier(element.value) : '+0', 'abilitymodifier');
    s.setAttribute('id', modifierid);
    p.insertAdjacentHTML("beforeend", s.outerHTML);
    return p
}

function Iskills5e(element) {
    // for now just use Istring
    return Istring(element);
}

function Isenses5e(element) {
    // for now just use Istring
    return Istring(element);
}

function Ilanguages5e(element) {
    // for now just use Istring
    return Istring(element);
}

function Icr5e(element) {
    let p = P();
    let s = SELECT(element, CR5e(), 'aligned');
    let id = newID();
    s.setAttribute('id', id);
    s.setAttribute('swcaption', element.caption);
    s.setAttribute('swtype', 'cr5e');
    if (element.value) { s.value = element.value; }; //{ s.setAttribute('value', element.value); };
    element.id = id;
    p.appendChild(LABEL(id, element.caption));
    p.appendChild(s);
    return p
}

function Inamedstring(element, id, value) {
    let d = DIV();
    let p1 = P();
    let p2 = P();
    let foric = `${id}-caption`;
    let forit = `${id}-value`;
    let lc = LABEL(foric, 'Feature');
    let ic = INPUTtext('', 0, 'aligned full');
    ic.setAttribute('id', foric);
    ic.setAttribute('name', foric);
    ic.setAttribute('swtype', 'captiondotvalue');
    ic.setAttribute('swvalueid', forit);
    p1.appendChild(lc);
    p1.appendChild(ic);
    d.appendChild(p1);
    proposeFocus(foric);
    let lt = LABEL(forit, 'Text');
    let it = INPUTtext('', 50, 'aligned full');
    it.setAttribute('id', forit);
    it.setAttribute('name', forit);
    p2.appendChild(lt);
    p2.appendChild(it);
    d.appendChild(p2);
    if (value) {
        ic.setAttribute('value', value.caption);
        it.setAttribute('value', value.value);
    };
    return d;
}


function Itext(element, id, value) {
    let d = DIV();
    let p = P();
    let forit = `${id}-value`;
    let lt = LABEL(forit, 'Text');
    let it = INPUTtext('', 50, 'aligned full');
    it.setAttribute('id', forit);
    it.setAttribute('name', forit);
    p.appendChild(lt);
    p.appendChild(it);
    d.appendChild(p);
    proposeFocus(forit);;
    if (value) {
        it.setAttribute('value', value.value)
    };
    return d;
}

function Ilist(element, id, value) {
    let d = DIV();
    let did = `${id}-list`;
    d.setAttribute('id', did);
    if (!value) {
        d.appendChild(TEXTNODE('Type:'));
        let s = SPAN('', 'aligned');
        let tul = INPUTbutton('bullet list', null, 'Create a bullet list in the stat block.');
        s.appendChild(tul);
        tul.addEventListener('click', () => {
            IlistSetListtype(id, 'ul');
        });
        let tol = INPUTbutton('numbered list', null, 'Create a numbered list in the stat block. The list will be numbered automatically.');
        s.appendChild(tol);
        tol.addEventListener('click', () => {
            IlistSetListtype(id, 'ol');
        });
        let tdl = INPUTbutton('keyword list', null, 'Add a keyword list to the stat block. For each list item you will have to provide the keyword and its description.');
        s.appendChild(tdl);
        tdl.addEventListener('click', () => {
            IlistSetListtype(id, 'dl');
        });
        let tspells5e = INPUTbutton('spell list', null, 'Add a spell list to the stat block. For each list item, provide the type/number of spell slots and the list of spells.');
        s.appendChild(tspells5e);
        tspells5e.addEventListener('click', () => {
            IlistSetListtype(id, 'spells5e');
        });

        d.appendChild(s);
    }
    return d;
}

function IlistSetListtype(listid, listtype, values) {
    let d = document.getElementById(`${listid}-list`);
    if (d) {
        let dmgr = document.getElementById(listid).firstElementChild;
        let plus = INPUTbutton('+', null, 'Add a new item to this list.');
        dmgr.appendChild(plus);
        plus.addEventListener('click', () => {
            IlistAddListItem(did, listid, listtype);
            activateProposedFocus();
        });

        d.setAttribute('contentsubtype', listtype);
        d.innerHTML = '';
        let did = `${listid}-listitems`;

        let d2 = DIV();
        d2.setAttribute('id', did);
        d.appendChild(d2);

        if (values) {
            values.forEach(value => { IlistAddListItem(did, listid, listtype, value) });
        } else {
            IlistAddListItem(did, listid, listtype);
            activateProposedFocus();
        }
    }
}

function IlistAddListItem(id, listid, listtype, value) {
    let od = document.getElementById(id);
    if (od) {
        let d = DIV();
        let did = newID();
        d.setAttribute('id', did);
        let minus = INPUTbutton('-', null, 'Remove this item from the list.');
        d.appendChild(minus);
        minus.addEventListener('click', () => {
            let r = document.getElementById(did);
            r.parentElement.removeChild(r);
        });
        let s = SPAN('', `aligned listitem-${listid}`);
        s.setAttribute('forid', did);
        switch (listtype) {
            case "ul":
                s.appendChild(TEXTNODE('\u2022\u00a0'));
                let iul = INPUTtext('', 50);
                iul.setAttribute('id', `${did}-li`);
                iul.setAttribute('swtype', 'ul');
                addClassnames(iul, 'nearfull');
                if (value) { iul.setAttribute('value', value) };
                s.appendChild(iul);
                proposeFocus(`${did}-li`);
                break;
            case "ol":
                s.appendChild(TEXTNODE('8\u00a0'));
                let iol = INPUTtext('', 50);
                iol.setAttribute('id', `${did}-li`);
                iol.setAttribute('swtype', 'ol');
                addClassnames(iol, 'nearfull');
                if (value) { iol.setAttribute('value', value) };
                s.appendChild(iol);
                proposeFocus(`${did}-li`);
                break;
            case "dl":
            case "spells5e":
                let idt = INPUTtext('', 10);
                let iddid = `${did}-dd`;
                idt.setAttribute('id', `${did}-dt`);
                idt.setAttribute('swtype', (listtype == 'dl') ? 'captiondotvalue' : 'captioncolonvalue');
                idt.setAttribute('swvalueid', iddid);
                addClassnames(idt, 'first');
                if (value) { idt.setAttribute('value', value.dt) };
                s.appendChild(idt);
                proposeFocus(`${did}-dt`);

                let idd = INPUTtext('', 30);
                idd.setAttribute('id', iddid);
                addClassnames(idd, 'second');
                if (value) { idd.setAttribute('value', value.dd) };
                s.appendChild(idd);
                break;
        }
        d.appendChild(s);
        od.appendChild(d);
    }
}

function Iattack5e(element, id, value) {
    let d = DIV();
    let foric = `${id}-caption`;
    let foriat = `${id}-attacktype`;
    let foria = `${id}-attack`;
    let forih = `${id}-hit`;
    let lc = LABEL(foric, 'Attack Name');
    let ic = INPUTtext('', 0, 'aligned full');
    ic.setAttribute('id', foric);
    ic.setAttribute('name', foric);
    ic.setAttribute('swtype', 'attack5e');
    ic.setAttribute('swvalueids', JSON.stringify([foriat, foria, forih]));
    let p1 = P();
    p1.appendChild(lc);
    p1.appendChild(ic);
    d.appendChild(p1);
    proposeFocus(foric);

    let lat = LABEL(foriat, 'Attack Type');
    let sat = SELECT(element, attacktype5e(), 'aligned');
    sat.setAttribute('id', foriat);
    let p2 = P();
    p2.appendChild(lat)
    p2.appendChild(sat);
    d.appendChild(p2);

    let la = LABEL(foria, 'Attack');
    let ia = INPUTtext('', 50, 'aligned full');
    ia.setAttribute('id', foria);
    ia.setAttribute('name', foria);
    let p3 = P();
    p3.appendChild(la);
    p3.appendChild(ia);
    d.appendChild(p3);

    let lh = LABEL(forih, 'Hit');
    let ih = INPUTtext('', 50, 'aligned full');
    ih.setAttribute('id', forih);
    ih.setAttribute('name', forih);
    ih.setAttribute('swtype', 'fixedcaption');
    ih.setAttribute('swcaption', 'Hit');
    let p4 = P();
    p4.appendChild(lh);
    p4.appendChild(ih);
    d.appendChild(p4);

    if (value) {
        ic.setAttribute('value', value.caption);
        sat.value = ((value.attacktype) ? value.attacktype : value.weapontype); // for backward compatibility
        ia.setAttribute('value', value.attack);
        ih.setAttribute('value', value.hit);
    };

    return d;
}

function Ispells5e(element, id, value) {
    let d = DIV();
    let foric = `${id}-start`;
    let forit = `${id}-spells`;
    let lc = LABEL(foric, 'Starting text');
    let ic = INPUTtext('', 0, 'aligned full');
    ic.setAttribute('id', foric);
    ic.setAttribute('name', foric);
    d.appendChild(lc);
    d.appendChild(ic);
    proposeFocus(foric);
    d.appendChild(BR());
    let lt = LABEL(forit, 'Spell list');
    let it = INPUTtext('', 50, 'aligned full');
    it.setAttribute('id', forit);
    it.setAttribute('name', forit);
    d.appendChild(lt);
    d.appendChild(it);
    if (value) {
        ic.setAttribute('value', value.caption);
        it.setAttribute('value', value.value);
    };
    return d;
}

function Iimage(element) {
    if (!element.maxheight || element.maxheight < 0) { element.maxheight = 0 };
    if (!element.position || ['first', 'last', 'token'].indexOf(element.position) == -1) { element.position = 'last' };
    if (!element.alignment || ['center', 'left', 'right'].indexOf(element.alignment) == -1) { element.alignment = 'center' };

    let d = DIV();
    let d1 = P();

    let ii = INPUTfile();
    ii.setAttribute('id', 'image-fileinput');
    ii.addEventListener('change', function () {
        var fr = new FileReader();
        fr.onload = function () {
            let iimg = document.getElementById('image');
            iimg.src = this.result;
            HideImageAndSettings(false);
        }
        if (this.files[0] != '') {
            fr.readAsDataURL(this.files[0])
            this.value = ''
            this.content = ''
        }
    })

    let id = newID();
    let isp = SPAN(null, 'aligned');
    let li = LABEL(id, 'Image');
    let ib = INPUTbutton('Select image', 's', 'Select the image file for this StatBlockWizard stat block');
    ib.setAttribute('id', id);
    ib.addEventListener('click', () => {
        ii.click();
    });
    let ie = INPUTbutton('Discard image', 'x', 'Discard this image', 'unavailable');
    ie.setAttribute('id', 'image-discard');
    ie.addEventListener('click', () => {
        let iimg = document.getElementById('image');
        iimg.src = '';
        HideImageAndSettings(true);
    });
    isp.appendChild(ib);
    isp.appendChild(ie);

    d1.appendChild(li);
    d1.appendChild(ii);
    d1.appendChild(isp);

    let ic = DIV('imagecontainer unavailable');
    ic.setAttribute('id', 'imagecontainer');
    let iimg = IMG('', 'A preview of the uploaded image.', 'creatorimage');
    iimg.setAttribute('id', 'image');
    ic.appendChild(iimg);

    let d2id = 'image-maxheight';
    let d2 = P();
    d2.setAttribute('id', 'image-maxheight-p');
    d2.classList.add('unavailable');
    let lheight = LABEL(d2id, 'Max. height (mm)');
    let sheight = SPAN(null, 'aligned');
    let iheight = INPUTnumber(0, 250, element.maxheight);
    iheight.setAttribute('id', d2id);
    let theight = TEXTNODE(' (0 = no max.)');
    sheight.appendChild(iheight);
    sheight.appendChild(theight);
    d2.appendChild(lheight);
    d2.appendChild(sheight);

    let d3id = 'image-position';
    let d3 = P();
    d3.setAttribute('id', 'image-position-p');
    d3.classList.add('unavailable');
    let lposition = LABEL(d3id, 'Position');
    let iposition = SELECT(element, [{ "value": "first", "text": "First" }, { "value": "last", "text": "Last" }, { "value": "token", "text": "Token (top right)" }], 'aligned');
    iposition.setAttribute('id', d3id);
    iposition.value = element.position;
    d3.appendChild(lposition);
    d3.appendChild(iposition);
    iposition.addEventListener('change', function () {
        HideImageSettingsForPosition();
    });

    let d4id = 'image-alignment';
    let d4 = P();
    d4.setAttribute('id', 'image-alignment-p');
    d4.classList.add('unavailable');
    let lalignment = LABEL(d4id, 'Alignment');
    let ialignment = SELECT(element, [{ "value": "center", "text": "Center" }, { "value": "left", "text": "Left" }, { "value": "right", "text": "Right" }], 'aligned');
    ialignment.setAttribute('id', d4id);
    ialignment.value = element.alignment;
    d4.appendChild(lalignment);
    d4.appendChild(ialignment);

    let d5id = 'image-credits';
    let d5 = P();
    d5.setAttribute('id', 'image-credits-p');
    d5.classList.add('unavailable');
    let lcredits = LABEL(d5id, 'Credits');
    let icredits = INPUTtext('', 50, 'aligned full');
    icredits.setAttribute('id', d5id);
    if (element.credits) icredits.value = element.credits;
    d5.appendChild(lcredits);
    d5.appendChild(icredits);

    d.appendChild(d1);
    d.appendChild(ic);
    d.appendChild(d3);
    d.appendChild(d4);
    d.appendChild(d2);
    d.appendChild(d5);

    element.id = id;
    if (element.value) {
        iimg.src = element.value;
        ie.classList.remove('unavailable');
        ic.classList.remove('unavailable');
        d2.classList.remove('unavailable');
        d3.classList.remove('unavailable');
        d4.classList.remove('unavailable');
        d5.classList.remove('unavailable');
    }

    return d;
}

function HideImageAndSettings(hide) {
    let imgd = document.getElementById('image-discard');
    let imgc = document.getElementById('imagecontainer');
    let ipos = document.getElementById('image-position-p');
    let icre = document.getElementById('image-credits-p');
    if (hide) {
        let maxh = document.getElementById('image-maxheight-p');
        let iali = document.getElementById('image-alignment-p');
        imgd.classList.add('unavailable');
        imgc.classList.add('unavailable');
        maxh.classList.add('unavailable');
        ipos.classList.add('unavailable');
        iali.classList.add('unavailable');
        icre.classList.add('unavailable');
    } else {
        imgd.classList.remove('unavailable');
        imgc.classList.remove('unavailable');
        ipos.classList.remove('unavailable');
        icre.classList.remove('unavailable');
        HideImageSettingsForPosition();
    }
}

function HideImageSettingsForPosition() {
    let maxh = document.getElementById('image-maxheight-p');
    let iali = document.getElementById('image-alignment-p');
    let ipos = document.getElementById('image-position-p');
    let pos = GetElementValue('image-position');
    if (pos == 'token' || ipos.classList.contains('unavailable')) {
        maxh.classList.add('unavailable');
        iali.classList.add('unavailable');
    } else {
        maxh.classList.remove('unavailable');
        iali.classList.remove('unavailable');
    }
}
// #endregion Input

// #region UpdateContent
function Ustring(element) {
    element.value = GetElementValue(element.id);
    if (element.defaultvalue != element.value) element.defaultvalue = '';
}

function Usection(element) { } // not editable

function Usectionend(element) {
    element.values = [];
    switch (element.content) {
        case 'dynamic':
            let Ielement = document.getElementById(element.id);
            if (Ielement) {
                let seelementslist = JSON.parse(Ielement.getAttribute('elements'));
                seelementslist.forEach(seelementid => {
                    let e = document.getElementById(seelementid);
                    if (e) {
                        let type = e.getAttribute('elementtype');
                        switch (type) {
                            case "namedstring":
                                element.values.push(Unamedstring(seelementid, type));
                                break;
                            case "text":
                                element.values.push(Utext(seelementid, type));
                                break;
                            case "list":
                                element.values.push(Ulist(seelementid, type));
                                break;
                            case "weapon5e": // deprecated
                            case "attack5e":
                                element.values.push(Uattack5e(seelementid, type));
                                break;
                            case "spells5e": // deprecated
                                element.values.push(Uspells5e(seelementid, type));
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
            break;
        case 'static':
            break;
        default:
            break;
    }
}

function Uability5e(element) {
    element.value = GetElementValue(element.id);
    if (element.defaultvalue != element.value) element.defaultvalue = '';
}

function Uskills5e(element) {
    element.value = GetElementValue(element.id);
}

function Usenses5e(element) {
    // for now just use Istring
    return Ustring(element);
}

function Ulanguages5e(element) {
    // for now just use Istring
    return Ustring(element);
}

function Ucr5e(element) {
    element.value = GetElementValue(element.id);
}

function Unamedstring(id, type) {
    let c = GetElementValue(`${id}-caption`);
    let t = GetElementValue(`${id}-value`);
    return { "type": type, "caption": c, "value": t };
}

function Utext(id, type) {
    let v = GetElementValue(`${id}-value`);
    return { "type": type, "value": v };
}

function Ulist(id, type) {
    let listtype = '';
    let values = [];
    let d = document.getElementById(`${id}-list`);
    if (d) { listtype = d.getAttribute('contentsubtype'); };

    let s = document.getElementsByClassName(`listitem-${id}`);
    if (s.length > 0) {
        for (var i = 0; i < s.length; i++) {
            let forid = s[i].getAttribute('forid');
            switch (listtype) {
                case "ul":
                case "ol":
                    values.push(GetElementValue(`${forid}-li`));
                    break;
                case "dl":
                case "spells5e":
                    values.push({ "dt": GetElementValue(`${forid}-dt`), "dd": GetElementValue(`${forid}-dd`) });
                    break;
            }
        };
    }
    return { "type": type, "listtype": listtype, "values": values };
}

function Uattack5e(id, type) {
    let c = GetElementValue(`${id}-caption`);
    let at = GetElementValue(`${id}-attacktype`);
    let a = GetElementValue(`${id}-attack`);
    let h = GetElementValue(`${id}-hit`);
    return { "type": type, "caption": c, "attacktype": at, "attack": a, "hit": h };
}

// deprecated
function Uspells5e(id, type) {
    let c = GetElementValue(`${id}-start`);
    let t = GetElementValue(`${id}-spells`);
    return { "type": type, "caption": c, "value": t };
}

function Uimage(element) {
    element.value = GetElementSrc('image');
    element.maxheight = Number.parseInt(GetElementValue('image-maxheight'));
    element.position = GetElementValue('image-position');
    element.alignment = GetElementValue('image-alignment');
    element.credits = GetElementValue('image-credits')
}
// #endregion UpdateContent