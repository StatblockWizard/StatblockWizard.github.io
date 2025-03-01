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
