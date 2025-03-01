// Copyright 2023, 2025 StatblockWizard

// #region 5e
function StatblockWizardDemo() {
    return GetStatblocWizardDemoOriginal()
}

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

function attacktype5evalue(fromtext) {
    let aa = attacktype5e().filter((t) => { return (t.text == fromtext) });
    return aa[0].value;
}

function abilitymodifier(score) {
    let x = Math.trunc(score / 2) - 5;
    return ((x < 0) ? x.toString() : `+${x.toString()}`);
}
// #endregion 5e


// #region Tools
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
// #endregion Tools