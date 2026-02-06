// Copyright 2025 StatblockWizard

// #region 2024
function StatblockWizardDemo() {
    return GetStatblocWizardDemo2024();
}

function attacktype2024() {
    return [
        { "value": 0, "text": "Melee Attack Roll:" },
        { "value": 1, "text": "Ranged Attack Roll:" },
        { "value": 2, "text": "Melee or Ranged Attack Roll:" }
    ]
}

function attacktype2024value(fromtext) {
    let aa = attacktype2024().filter((t) => { return (t.text == fromtext) });
    return aa[0].value;
}

function savetype2024() {
    return [
        { "value": 0, "text": "Strength Saving Throw:" },
        { "value": 1, "text": "Dexterity Saving Throw:" },
        { "value": 2, "text": "Constitution Saving Throw:" },
        { "value": 3, "text": "Intelligence Saving Throw:" },
        { "value": 4, "text": "Wisdom Saving Throw:" },
        { "value": 5, "text": "Charisma Saving Throw:" }
    ]
}

function savetype2024value(fromtext) {
    let aa = savetype2024().filter((t) => { return (t.text == fromtext) });
    return aa[0].value;
}


function abilitymodifier(score) {
    let x = Math.trunc(score / 2) - 5;
    return ((x < 0) ? x.toString() : `+${x.toString()}`);
}
// #endregion 2024

// #region Versionspecific Tools
function AddHtmlTo(existing, addition, position = 'last') {
    if (addition) {
        if (addition.nodeName == '#text') {
            existing.appendChild(addition);
        } else
            if (addition.outerHTML != '') {
                if (position == 'first') {
                    let c = existing.getElementsByClassName(fullClassname('core'));
                    if (c.length > 0) {
                        c[0].insertAdjacentHTML('beforebegin', addition.outerHTML);
                        return;
                    }
                };
                existing.appendChild(addition);
            }
    }
}
// #endregion Versionspecific Tools

// #region VersionUpdate
function CurrentVersionNumber() {
    return '2024.8'; // update the standard in the Creator if required
}

function updateStatblock2024(Content) {
    let current = Content[0].version;
    while (current != CurrentVersionNumber()) {
        switch (current) {
            case "2024.1": current = updateStatblock2024v1Tov2(Content); break;
            case "2024.2": current = updateStatblock2024v2Tov3(Content); break;
            case "2024.3": current = updateStatblock2024v3Tov4(Content); break;
            case "2024.4": current = updateStatblock2024v4Tov5(Content); break;
            case "2024.5": current = updateStatblock2024v5Tov6(Content); break;
            case "2024.6": current = updateStatblock2024v6Tov7(Content); break;
            case "2024.7": current = updateStatblock2024v7Tov8(Content); break;
            default: // actually a not supported version of upgrade. Silently keep the current version
                current = CurrentVersionNumber(); // to end the loop
        }
    }
    DBsetStatblockWizard(Content);
}

function updateStatblock2024v1Tov2(Content) {
    // if no Gear entry exists, insert it right before Senses
    if (getStatblockContentElementIndex(Content, 'string', 'Gear') == -1) {
        let senses = getStatblockContentElementIndex(Content, 'senses5e', 'Senses');
        Content.splice(senses, 0, { "type": "string", "caption": "Gear", "showcaption": true, "defaultvalue": "", "css": "feature gear", "captioncss": "keyword" })
    };
    // if a Saving Throws entry exists, remove it
    let sav = getStatblockContentElementIndex(Content, 'string', 'Saving Throws');
    if (sav > -1) Content.splice(sav, 1);

    // add new columns property
    Content[0].version = "2024.2";
    Content[0].columns = 2;
    return Content[0].version;
}

function updateStatblock2024v2Tov3(Content) {
    // modify "string","AC" to "ac2024","AC"
    let ac = getStatblockContentElementIndex(Content, 'string', 'AC');
    if (ac != -1) Content[ac].type = 'ac2024';

    // update version no.
    Content[0].version = "2024.3";
    return Content[0].version;
}

function updateStatblock2024v3Tov4(Content) {
    // add "attack2024" and "save2024" to Traits section contenttypes
    let traits = getStatblockContentElementIndex(Content, 'section', 'Traits');
    if (traits != -1 && traits < Content.length) {
        // the next element should be a sectionend
        if (Content[traits + 1].type == 'sectionend') {
            Content[traits + 1].contenttypes.splice(1, 0, { "name": "saving throw", "type": "save2024" });
            Content[traits + 1].contenttypes.splice(1, 0, { "name": "attack", "type": "attack2024" });
        }
    }
    // update version no.
    Content[0].version = "2024.4";
    return Content[0].version;
}

function updateStatblock2024v4Tov5(Content) {
    // add support First and Second Failure on saving throws : add "secondvalue": "" to all values of type==save2024 in sectionends
    let i = 1;
    while (i < Content.length - 1) {
        i++;
        if (Content[i - 1].type.toLowerCase() == 'sectionend') {
            let j = 0;
            while (j < Content[i - 1].values.length) {
                if (Content[i - 1].values[j].type == 'save2024') Content[i - 1].values[j].secondfailure = '';
                j++;
            }
        }
    }

    // update version no.
    Content[0].version = "2024.5";
    return Content[0].version;
}

function updateStatblock2024v5Tov6(Content) {
    // add "legendary text" to Epic Actions section contenttypes
    let epicactions = getStatblockContentElementIndex(Content, 'section', 'Epic Actions');
    if (epicactions != -1 && epicactions < Content.length) {
        // the next element should be a sectionend
        if (Content[epicactions + 1].type == 'sectionend') {
            Content[epicactions + 1].contenttypes.splice(0, 0, { "name": "legendary text", "type": "legendarytext" });
        }
    }

    // update version no.
    Content[0].version = "2024.6";
    return Content[0].version;
}

function updateStatblock2024v6Tov7(Content) {
    // add support Hit or Miss on Attack2024 : add "hitmiss": "" to all values of type==attack2024 in sectionends
    let i = 1;
    while (i < Content.length - 1) {
        i++;
        if (Content[i - 1].type.toLowerCase() == 'sectionend') {
            let j = 0;
            while (j < Content[i - 1].values.length) {
                if (Content[i - 1].values[j].type == 'attack2024') Content[i - 1].values[j].hitmiss = '';
                j++;
            }
        }
    }
    // add hitmisscss to type=css, fortype=attack2024
    let attack2024 = getStatblockStyleElementIndex(Content, 'attack2024');
    if (attack2024 != -1 && attack2024 < Content.length) {
        Content[attack2024].hitmisscss = 'hitmiss';
    }

    // update version no.
    Content[0].version = "2024.7";
    return Content[0].version;
}

function updateStatblock2024v7Tov8(Content) {
    // add "Attribution" as last item before the "css" item for "namedstring"
    let css = getStatblockStyleElementIndex(Content, 'namedstring');
    if (css != -1) Content.splice(css, 0, { "type": "attribution", "caption": "Attribution", "defaultvalue": "", "css1": "attribution1", "css2": "StatblockWizard-attribution2" });

    // update version no.
    Content[0].version = "2024.8";
    return Content[0].version;
}
// #endregion VersionUpdate
