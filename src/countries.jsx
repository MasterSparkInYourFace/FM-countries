function getCountries(func) {
    const f = "borders,cca3,flags,name,population,region,subregion,capital,tld,currencies,languages";
    return fetch(`https://restcountries.com/v3.1/all?fields=${f}`)
        .then(d => d.json()).then(func);
}

function getRegions(c) {
    return c.reduce((p, c) => {
        if (!p.includes(c.region))
            p.push(c.region);
        return p;
    }, []);
}

function clazz() {
    return [...arguments].join(" ");
}

function fnull(v) {
    return (!v?.length) ? "(none)" : v;
}

function objformat(v, k = null) {
    return (v === undefined || Object.keys(v).length === 0) ? "(none)" : Object.entries(v).map(e =>
        (k === null) ? e[1] : e[1][k]).join(", ");
}

function Header(p) {
    const warudo = [
        "the world",
        "ZA WAAAARUDO",
        "Gensokyo",
        "Mementos",
        "your head"
    ];
    const [warudoIndex, setWarudoIndex] = React.useState(0);
    return ( // I might like jsx. I can write awful code so it must be good
        <div id="header" class={clazz("element-style", p.theme)}>
            <div id="header-contents">
                <h1 onClick={() => { setWarudoIndex((warudoIndex + 1) % warudo.length); }}>
                    Where in {warudo[warudoIndex]}?</h1>
                <div id="theme-switch" class={p.theme} onClick={p.tt}>
                    <img class={clazz("svg", p.theme)}
                        src={"./images/switch-" + p.theme.split("-")[1] + ".svg"}></img>
                    <span>Dark Mode</span>
                </div>
            </div>
            <h1 class="antscreen">Too cramped @_@</h1>
        </div>
    );
}

function SearchBox(p) {
    const srch = React.useRef(null);
    function upd8() {
        const s = srch.current.value === "" ? null : srch.current.value;
        p.set(s);
    }
    function kd(e) {
        if (e.key !== "Enter")
            return;
        upd8();
    }
    return (
        <div id="search-container" class={clazz("element-style", p.theme)}>
            <img class={clazz("svg", p.theme)}
                src="./images/magnifier.svg"
                onClick={upd8}></img>
            <input ref={srch} onKeyDown={kd} type="text"
                id="search" class={p.theme}
                placeholder="Search for a country..."></input>
        </div>
    );
}

function Option(p) {
    function trigger() {
        p.h(p.v, p.children);
    }
    return (
        <div
            class={clazz("option" + (p.c === p.v ? " selected" : ""), p.t)}
            onClick={trigger}>
            <span>{p.children}</span>
        </div>
    );
}

function FilterRegions(p) {
    const [hidden, setHidden] = React.useState(true);
    function o(v, t) {
        setHidden(true);
        p.sel.set({value: v, text: t});
    }
    return (
        <div id="filter-region" class={clazz("element-style", p.theme)}
            onClick={() => { setHidden(!hidden); }}>
            <div id="dropdown-deco">
                <span>{p.sel.value.text}</span>
                <img class={clazz("svg", p.theme)} src="./images/caron.svg"></img>
            </div>
            {hidden ? <></> :
                <div class={clazz("dropdown-options", "element-style", p.theme)}>
                    {[
                        [ null, "Filter by Region" ],
                        ...p.reg.map(v => [v.replace(/\s+/g, "-"), v])
                    ].map(v =>
                        <Option v={v[0]} c={p.sel.value.value} h={o} t={p.theme}>{v[1]}</Option>)}
                </div>}
        </div>
    );
}

function CountryCard(p) {
    function sc() {
        p.dc(p.data);
    }
    return (
        <div onClick={sc} class={clazz("element-style button country-card", p.theme)}>
            <img src={p.data.flags.svg}/>
            <div class="country-details">
                <h3>{p.data.name.common}</h3>
                <div>Population: <span class="country-info">
                    {fnull(p.data.population?.toLocaleString())}</span>
                </div>
                <div class="info-padded">Region: <span class="country-info">
                    {fnull(p.data.region)}</span>
                </div>
                <div class="info-padded">Capital: <span class="country-info">
                    {fnull(p.data.capital?.join(", "))}</span>
                </div>
            </div>
        </div>
    );
}

function HomePage(p) {
    const [search, setSearch] = React.useState(null);
    function matching() {
        return p.data.filter(c => {
            let r = true;
            if (p.si.value)
                r = p.si.text === c.region;
            if (search)
                r &&= c.name.common.toLowerCase().includes(search.toLowerCase());
            return r;
        });
    }
    return (
        <div>
            <div id="home" class="ui-contents">
                <div id="search-controls">
                    <SearchBox set={setSearch} theme={p.theme}/>
                    <FilterRegions
                        sel={{value: p.si, set: p.ss}}
                        reg={getRegions(p.data)}
                        theme={p.theme}/>
                </div>
                <div id="country-listing">
                    {matching().map(d =>
                        <CountryCard data={d} theme={p.theme} dc={p.dc}/>)}
                </div>
            </div>
            <p class="antscreen">
                What is this??? why is your screen so tiny :\<br />
                Come back with a reasonably wide screen that I can
                fit some elements into.
            </p>
        </div>
    );
}

function BorderCountryButton(p) {
    return (
        <div onClick={() => { p.dc(p.data); }}
            class={clazz("element-style button bc-button", p.theme)}>{p.data.name.common}</div>
    );
}

function CountryDetails(p) {
    // me: *typically follows good subcomponent practices*
    // also me:
    const c = p.dcState.get;
    return (
        <div>
            <div id="country-data" class="ui-contents">
                <div onClick={() => { p.dcState.set(null); }}
                    class={clazz("element-style button", p.theme)} id="back-button">
                    <img class={clazz("svg", p.theme)} src="./images/back.svg"/>
                    <span>Back</span>
                </div>
                <div id="details-view">
                    <img src={c.flags.svg} alt={c.flags.alt}/>
                    <div class={p.theme}>
                        <h1 id="details-header">{c.name.common}</h1>
                        <div id="details-data">
                            {/* why does the design want me to split these?????? */}
                            <div>
                                <div>Native Name: <span class="country-info">{objformat(c.name.nativeName, "common")}</span></div>
                                <div>Population: <span class="country-info">{fnull(c.population?.toLocaleString())}</span></div>
                                <div>Region: <span class="country-info">{fnull(c.region)}</span></div>
                                <div>Sub-Region: <span class="country-info">{fnull(c.subregion)}</span></div>
                                <div>Capital: <span class="country-info">{fnull(c.capital)}</span></div>
                            </div>
                            <div>
                                <div>Top-level Domains: <span class="country-info">{fnull(c.tld?.join(", "))}</span></div>
                                {/* Why the hell is half of the data objects now???? */}
                                <div>Currencies: <span class="country-info">{objformat(c.currencies, "name")}</span></div>
                                <div>Languages: <span class="country-info">{objformat(c.languages)}</span></div>
                            </div>
                        </div>
                        {
                            p.bordering === undefined ? <></> :
                            <div id="border-countries">
                                <span>Bordering Countries:</span>
                                <div>
                                    {p.bordering.map(b =>
                                        <BorderCountryButton theme={p.theme} data={b} dc={p.dcState.set}/>)}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <p class="antscreen">
                I don't know how you got here without the ability to browse
                and select countries, but please come back with a wider screen.<br/>
                This is just ridiculous.
            </p>
        </div>
    );
}

function UI(p) {
    const [theme, setTheme] = React.useState("theme-dark");
    const [hpSel, setHpSel] = React.useState({value: null, text: "Filter by Region"});
    const [displayedCountry, setDisplayedCountry] = React.useState(null);
    function themeTrigger() {
        // theme-dark is actually ignored since it's the default style
        // but it's the most consistent alternative to theme-light
        setTheme("theme-" + (theme.endsWith("dark") ? "light" : "dark"));
    }
    return (
        <div id="ui" class={theme}>
            <Header tt={themeTrigger} theme={theme}/>
            {displayedCountry === null ?
                <HomePage theme={theme} data={p.data} si={hpSel} ss={setHpSel} dc={setDisplayedCountry}/> :
                <CountryDetails theme={theme}
                    dcState={{get: displayedCountry, set: setDisplayedCountry}}
                    bordering={displayedCountry.borders?.map(c =>
                        p.data.filter(cd => cd.cca3 === c)[0])}/>}
        </div>
    );
}

function main() {
    const rr = ReactDOM.createRoot(document.body);
    getCountries(c => rr.render(<UI data={c}/>));
}

onload = main;