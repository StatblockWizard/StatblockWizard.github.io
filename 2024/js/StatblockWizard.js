// Copyright 2025 StatblockWizard

// #region 2024
function CurrentVersionNumber() {
    return '2024.3';
}

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
function updateStatblock2024(Content) {
    let current = Content[0].version;
    while (current != CurrentVersionNumber()) {
        switch (current) {
            case "2024.1": current = updateStatblock2024v1Tov2(Content); break;
            case "2024.2": current = updateStatblock2024v2Tov3(Content); break;
            default: // actually a not supported version of upgrade. Silently keep the current version
                current = CurrentVersionNumber(); // to end the loop
        }
    }
    DBsetStatblockWizard(Content);
}

function updateStatblock2024v1Tov2(Content) {
    // if no Gear entry extists, insert it right before Senses
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
// #endregion VersionUpdate
