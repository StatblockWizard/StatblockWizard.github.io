// Copyright 2023, 2025 StatblockWizard
var selectedVersion;
const appversion = "3.1.6";

window.addEventListener('load', main, false);

function main() {
    addAppVersion();
    addVersionSelect();
    addModules();
    addSamples();
}

function addAppVersion() {
    let e = document.getElementById('appversion');
    if (e) {
        e.appendChild(SPAN(`v${appversion}`));
    }
}

function addVersionSelect() {
    let v = document.getElementById('versionselect');
    let versionText;
    if (v) {
        v.innerHTML = '';
        let p = P();
        currentVersion = DBStatblockWizardVersion();
        let text;
        let vs = SELECT(v, [{"value": versionOriginal, "text": "5e"},{"value": version2024, "text": "5.5e"}])
        vs.setAttribute('id','versionselector');
        vs.addEventListener('change',  function () {
            selectedVersion = this.value;
        });
        switch ( currentVersion ) {
            case versionNone:
                text = "Currently, there is no stat block stored in this browser's local storage.";
                vs.value = version2024;
                break;
            default:
                switch ( currentVersion ) {
                    case versionOriginal: versionText = '5e'; break;
                    case version2024: versionText = '5.5e'; break;
                };
                text = `Your current stat block uses the ${versionText} layout. If the version you select below is different, using the "Create or edit" or "View" buttons will replace the current stat block with the demo stat block of the selected version.`;
                vs.value = currentVersion;
                break;
        };
        p.appendChild(SPAN(text));
        p.appendChild(BR());
        let s = SPAN('');
        s.appendChild(LABEL('versionselector','Select the version to use'));
        s.appendChild(vs);
        p.appendChild(s);
        p.appendChild(BR());
        p.appendChild(SPAN('There is no automatic conversion of stat blocks between versions.','note'));
        v.appendChild(p);
        selectedVersion = document.getElementById('versionselector').value;
    }
}

function addModules() {
    let e = document.getElementById('StatblockWizardModules');
    if (e) {
        addModuleViewer(e);
        addModuleCreator(e);
        addLicenseLink(e);
        addClearLastSaved(e);
    }
}

function addModuleCreator(e) {
    addMainPageLink(e, 'Create or edit a stat block', 'c', 'creator', 'Open the Creator to work on a Stat block.', 'creator');
}

function addModuleViewer(e) {
    addMainPageLink(e, 'View a stat block', 'v', 'viewer', 'Open the Viewer to see a stat block.', 'viewer');
}

function addLicenseLink(e) {
    addMainPageLink(e, 'Legal information', 'l', 'legal', 'Shows legal information.');
}

function addMainPageLink(e, text, accessKey, link, alt, className) {
    let newMainPageLink = INPUTbutton(text,accessKey, alt,className);
    addClassnames(newMainPageLink,'mainpagelink');
    e.appendChild(newMainPageLink);
    newMainPageLink.addEventListener('click', () => {
        switch (link) {
            case 'creator':
                OpenCreator(selectedVersion);
                break;
            case 'viewer':
                OpenViewer(selectedVersion);
                break;
            case 'legal':
                window.location.replace('Legal.html');
                break;
        }
    });
}

function addClearLastSaved(e) {
    let t = 'Clear saved stat block';
    let tx = "Remove all data that was stored by this app from your browser's storage.";
    let newMainPageLink = INPUTbutton(t,'', tx,'mainpagelink');
    e.appendChild(newMainPageLink);
    newMainPageLink.addEventListener('click', () => {
        DBclearStatblockWizard();
        alert('Cleared! If you close StatblockWizard now, no stored data from this App will remain.');
        addVersionSelect();
    });
}

function addSamples() {
    let d = document.getElementById('StatblockWizardSamples');
    addClassnames(d, 'center');

    d.appendChild(H2('Using the 5.5e layout'));
    d.appendChild(appendSample('Goblin%20Warrior', 'Goblin Warrior', 'a Goblin Warrior', sampleGoblinWarrior));
    d.appendChild(appendSample('Incubus', 'Incubus', 'an Incubus', sampleIncubus, 'samplewide'));

    d.appendChild(H2('Using the 5e layout'));
    d.appendChild(appendSample('Archmage', 'Archmage', 'an Archmage', sampleArchmage, 'samplewide'));
    d.appendChild(appendSample('Cat', 'Cat', 'a Cat, featuring Zipper', sampleCat, 'samplewide'));
    d.appendChild(appendSample('Cat1', 'Cat (alternate image position)', 'a Cat, featuring Zipper (alternate image position)',  sampleCat1));
}

function appendSample(filename, statblockname, statblocktext, statblockcontent, extracss) {
    let sample = FIGURE(`res/${filename}.statblockwizard.png`, statblockname, `StatblockWizard sample stat block of ${statblocktext}.`, 'samplefigure', 'sampleimage', 'samplecaption');
    if (extracss) addClassnames (sample, extracss)
    sample.addEventListener('click', () => {
        let samplecontent = statblockcontent();
        DBsetStatblockWizard(samplecontent);
        OpenViewer(StatblockWizardVersion(samplecontent));
    });
    return sample
}

function sampleArchmage() {
    return getSampleStatblock("Archmage");
}

function sampleCat() {
    return getSampleStatblock("Cat");
}

function sampleCat1() {
    return getSampleStatblock("Cat1");
}

function sampleGoblinWarrior() {
    return getSampleStatblock("GoblinWarrior");
}

function sampleIncubus() {
    return getSampleStatblock("Incubus");
}

