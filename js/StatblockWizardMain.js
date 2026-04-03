// Copyright 2023, 2025 StatblockWizard
var selectedVersion;
const appversion = "3.1.15";

window.addEventListener('load', main, false);

function main() {
    addAppVersion();
    addVersionSelect();
    addModules();
    addSamples();
}

function addAppVersion() {
    const e = document.getElementById('appversion');
    if (!e) return;
    e.appendChild(SPAN(`v${appversion}`));
}

function addVersionSelect() {
    const v = document.getElementById('versionselect');
    if (!v) return;

    v.innerHTML = '';
    const p = P();
    const currentversionAndName = DBStatblockWizardVersionAndName();
    currentVersion = currentversionAndName.version;
    const currentName = currentversionAndName.name;

    const vs = SELECT(v, [{ "value": versionOriginal, "text": "5e" }, { "value": version2024, "text": "5.5e" }]);
    vs.id = 'versionselector';
    vs.addEventListener('change', function () {
        selectedVersion = this.value;
    });

    if (currentVersion === versionNone) {
        p.appendChild(SPAN("Currently, there is no stat block stored in this browser's local storage."));
        vs.value = version2024;
    } else {
        const versionText = currentVersion === versionOriginal ? '5e' : '5.5e';
        const span = SPAN('');
        span.appendChild(document.createTextNode('Your current stat block '));
        if (currentName !== '') {
            span.appendChild(SPAN('"' + currentName + '"', 'statblockname'));
            span.appendChild(document.createTextNode(' '));
        }
        span.appendChild(document.createTextNode(`uses the ${versionText} layout. If the version you select below is different, using the "Create or edit" or "View" buttons will replace the current stat block with the demo stat block of the selected version.`));
        p.appendChild(span);
        vs.value = currentVersion;
    }
    p.appendChild(BR());
    const s = SPAN('');
    s.appendChild(LABEL('versionselector', 'Select the version to use'));
    s.appendChild(vs);
    p.appendChild(s);
    p.appendChild(BR());
    p.appendChild(SPAN('There is no automatic conversion of stat blocks between versions.', 'note'));
    v.appendChild(p);
    selectedVersion = vs.value;
}

function addModules() {
    const e = document.getElementById('StatblockWizardModules');
    if (!e) return;

    addModuleViewer(e);
    addModuleCreator(e);
    addLicenseLink(e);
    addClearLastSaved(e);
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
    const newMainPageLink = INPUTbutton(text, accessKey, alt, className);
    addClassnames(newMainPageLink, 'mainpagelink');
    e.appendChild(newMainPageLink);

    const actions = {
        'creator': () => OpenCreator(selectedVersion),
        'viewer': () => OpenViewer(selectedVersion),
        'legal': () => window.location.replace('Legal.html')
    };

    newMainPageLink.addEventListener('click', actions[link]);
}

function addClearLastSaved(e) {
    const newMainPageLink = INPUTbutton(
        'Clear saved stat block',
        '',
        "Remove all data that was stored by this app from your browser's storage.",
        'mainpagelink'
    );
    e.appendChild(newMainPageLink);
    newMainPageLink.addEventListener('click', () => {
        DBclearStatblockWizard();
        alert('Cleared! If you close StatblockWizard now, no stored data from this App will remain.');
        addVersionSelect();
    });
}

function addSamples() {
    const d = document.getElementById('StatblockWizardSamples');
    addClassnames(d, 'center');

    d.appendChild(H2('Using the 5.5e layout'));
    d.appendChild(appendSample('GoblinWarrior', 'Goblin Warrior', 'a Goblin Warrior', 'GoblinWarrior'));
    d.appendChild(appendSample('Incubus', 'Incubus', 'an Incubus', 'Incubus', 'samplewide'));

    d.appendChild(H2('Using the 5e layout'));
    d.appendChild(appendSample('Archmage', 'Archmage', 'an Archmage', 'Archmage', 'samplewide'));
    d.appendChild(appendSample('Cat', 'Cat', 'a Cat, featuring Zipper', 'Cat', 'samplewide'));
    d.appendChild(appendSample('Cat1', 'Cat (alternate image position)', 'a Cat, featuring Zipper (alternate image position)', 'Cat1'));
}

function appendSample(filename, statblockname, statblocktext, sampleName, extracss) {
    const sample = FIGURE(
        `res/${filename}.statblockwizard.png`,
        statblockname,
        `StatblockWizard sample stat block of ${statblocktext}.`,
        'samplefigure',
        'sampleimage',
        'samplecaption'
    );
    if (extracss) addClassnames(sample, extracss);

    sample.addEventListener('click', () => {
        const samplecontent = getSampleStatblock(sampleName);
        DBsetStatblockWizard(samplecontent);
        OpenViewer(StatblockWizardVersion(samplecontent));
    });
    return sample;
}
