function getCountries(func) {
  const f = "borders,cca3,flags,name,population,region,subregion,capital,tld,currencies,languages";
  return fetch(`https://restcountries.com/v3.1/all?fields=${f}`).then(d => d.json()).then(func);
}
function getRegions(c) {
  return c.reduce((p, c) => {
    if (!p.includes(c.region)) p.push(c.region);
    return p;
  }, []);
}
function clazz() {
  return [...arguments].join(" ");
}
function fnull(v) {
  return !v?.length ? "(none)" : v;
}
function objformat(v, k = null) {
  return v === undefined || Object.keys(v).length === 0 ? "(none)" : Object.entries(v).map(e => k === null ? e[1] : e[1][k]).join(", ");
}
function Header(p) {
  const warudo = ["the world", "ZA WAAAARUDO", "Gensokyo", "Mementos", "your head"];
  const [warudoIndex, setWarudoIndex] = React.useState(0);
  return (
    /*#__PURE__*/
    // I might like jsx. I can write awful code so it must be good
    React.createElement("div", {
      id: "header",
      class: clazz("element-style", p.theme)
    }, /*#__PURE__*/React.createElement("div", {
      id: "header-contents"
    }, /*#__PURE__*/React.createElement("h1", {
      onClick: () => {
        setWarudoIndex((warudoIndex + 1) % warudo.length);
      }
    }, "Where in ", warudo[warudoIndex], "?"), /*#__PURE__*/React.createElement("div", {
      id: "theme-switch",
      class: p.theme,
      onClick: p.tt
    }, /*#__PURE__*/React.createElement("img", {
      class: clazz("svg", p.theme),
      src: "./images/switch-" + p.theme.split("-")[1] + ".svg"
    }), /*#__PURE__*/React.createElement("span", null, "Dark Mode"))), /*#__PURE__*/React.createElement("h1", {
      class: "antscreen"
    }, "Too cramped @_@"))
  );
}
function SearchBox(p) {
  const srch = React.useRef(null);
  function upd8() {
    const s = srch.current.value === "" ? null : srch.current.value;
    p.set(s);
  }
  function kd(e) {
    if (e.key !== "Enter") return;
    upd8();
  }
  return /*#__PURE__*/React.createElement("div", {
    id: "search-container",
    class: clazz("element-style", p.theme)
  }, /*#__PURE__*/React.createElement("img", {
    class: clazz("svg", p.theme),
    src: "./images/magnifier.svg",
    onClick: upd8
  }), /*#__PURE__*/React.createElement("input", {
    ref: srch,
    onKeyDown: kd,
    type: "text",
    id: "search",
    class: p.theme,
    placeholder: "Search for a country..."
  }));
}
function Option(p) {
  function trigger() {
    p.h(p.v, p.children);
  }
  return /*#__PURE__*/React.createElement("div", {
    class: clazz("option" + (p.c === p.v ? " selected" : ""), p.t),
    onClick: trigger
  }, /*#__PURE__*/React.createElement("span", null, p.children));
}
function FilterRegions(p) {
  const [hidden, setHidden] = React.useState(true);
  function o(v, t) {
    setHidden(true);
    p.sel.set({
      value: v,
      text: t
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    id: "filter-region",
    class: clazz("element-style", p.theme),
    onClick: () => {
      setHidden(!hidden);
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "dropdown-deco"
  }, /*#__PURE__*/React.createElement("span", null, p.sel.value.text), /*#__PURE__*/React.createElement("img", {
    class: clazz("svg", p.theme),
    src: "./images/caron.svg"
  })), hidden ? /*#__PURE__*/React.createElement(React.Fragment, null) : /*#__PURE__*/React.createElement("div", {
    class: clazz("dropdown-options", "element-style", p.theme)
  }, [[null, "Filter by Region"], ...p.reg.map(v => [v.replace(/\s+/g, "-"), v])].map(v => /*#__PURE__*/React.createElement(Option, {
    v: v[0],
    c: p.sel.value.value,
    h: o,
    t: p.theme
  }, v[1]))));
}
function CountryCard(p) {
  function sc() {
    p.dc(p.data);
  }
  return /*#__PURE__*/React.createElement("div", {
    onClick: sc,
    class: clazz("element-style button country-card", p.theme)
  }, /*#__PURE__*/React.createElement("img", {
    src: p.data.flags.svg
  }), /*#__PURE__*/React.createElement("div", {
    class: "country-details"
  }, /*#__PURE__*/React.createElement("h3", null, p.data.name.common), /*#__PURE__*/React.createElement("div", null, "Population: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, fnull(p.data.population?.toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    class: "info-padded"
  }, "Region: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, fnull(p.data.region))), /*#__PURE__*/React.createElement("div", {
    class: "info-padded"
  }, "Capital: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, fnull(p.data.capital?.join(", "))))));
}
function HomePage(p) {
  const [search, setSearch] = React.useState(null);
  function matching() {
    return p.data.filter(c => {
      let r = true;
      if (p.si.value) r = p.si.text === c.region;
      if (search) r &&= c.name.common.toLowerCase().includes(search.toLowerCase());
      return r;
    });
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    id: "home",
    class: "ui-contents"
  }, /*#__PURE__*/React.createElement("div", {
    id: "search-controls"
  }, /*#__PURE__*/React.createElement(SearchBox, {
    set: setSearch,
    theme: p.theme
  }), /*#__PURE__*/React.createElement(FilterRegions, {
    sel: {
      value: p.si,
      set: p.ss
    },
    reg: getRegions(p.data),
    theme: p.theme
  })), /*#__PURE__*/React.createElement("div", {
    id: "country-listing"
  }, matching().map(d => /*#__PURE__*/React.createElement(CountryCard, {
    data: d,
    theme: p.theme,
    dc: p.dc
  })))), /*#__PURE__*/React.createElement("p", {
    class: "antscreen"
  }, "What is this??? why is your screen so tiny :\\", /*#__PURE__*/React.createElement("br", null), "Come back with a reasonably wide screen that I can fit some elements into."));
}
function BorderCountryButton(p) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      p.dc(p.data);
    },
    class: clazz("element-style button bc-button", p.theme)
  }, p.data.name.common);
}
function CountryDetails(p) {
  // me: *typically follows good subcomponent practices*
  // also me:
  const c = p.dcState.get;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    id: "country-data",
    class: "ui-contents"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      p.dcState.set(null);
    },
    class: clazz("element-style button", p.theme),
    id: "back-button"
  }, /*#__PURE__*/React.createElement("img", {
    class: clazz("svg", p.theme),
    src: "./images/back.svg"
  }), /*#__PURE__*/React.createElement("span", null, "Back")), /*#__PURE__*/React.createElement("div", {
    id: "details-view"
  }, /*#__PURE__*/React.createElement("img", {
    src: c.flags.svg,
    alt: c.flags.alt
  }), /*#__PURE__*/React.createElement("div", {
    class: p.theme
  }, /*#__PURE__*/React.createElement("h1", {
    id: "details-header"
  }, c.name.common), /*#__PURE__*/React.createElement("div", {
    id: "details-data"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Native Name: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, objformat(c.name.nativeName, "common"))), /*#__PURE__*/React.createElement("div", null, "Population: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, fnull(c.population?.toLocaleString()))), /*#__PURE__*/React.createElement("div", null, "Region: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, fnull(c.region))), /*#__PURE__*/React.createElement("div", null, "Sub-Region: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, fnull(c.subregion))), /*#__PURE__*/React.createElement("div", null, "Capital: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, fnull(c.capital?.join(", "))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Top-level Domains: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, fnull(c.tld?.join(", ")))), /*#__PURE__*/React.createElement("div", null, "Currencies: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, objformat(c.currencies, "name"))), /*#__PURE__*/React.createElement("div", null, "Languages: ", /*#__PURE__*/React.createElement("span", {
    class: "country-info"
  }, objformat(c.languages))))), !p.bordering?.length ? /*#__PURE__*/React.createElement(React.Fragment, null) : /*#__PURE__*/React.createElement("div", {
    id: "border-countries"
  }, /*#__PURE__*/React.createElement("span", null, "Bordering Countries:"), /*#__PURE__*/React.createElement("div", null, p.bordering.map(b => /*#__PURE__*/React.createElement(BorderCountryButton, {
    theme: p.theme,
    data: b,
    dc: p.dcState.set
  }))))))), /*#__PURE__*/React.createElement("p", {
    class: "antscreen"
  }, "I don't know how you got here without the ability to browse and select countries, but please come back with a wider screen.", /*#__PURE__*/React.createElement("br", null), "This is just ridiculous."));
}
function UI(p) {
  const [theme, setTheme] = React.useState("theme-dark");
  const [hpSel, setHpSel] = React.useState({
    value: null,
    text: "Filter by Region"
  });
  const [displayedCountry, setDisplayedCountry] = React.useState(null);
  function themeTrigger() {
    // theme-dark is actually ignored since it's the default style
    // but it's the most consistent alternative to theme-light
    setTheme("theme-" + (theme.endsWith("dark") ? "light" : "dark"));
  }
  return /*#__PURE__*/React.createElement("div", {
    id: "ui",
    class: theme
  }, /*#__PURE__*/React.createElement(Header, {
    tt: themeTrigger,
    theme: theme
  }), displayedCountry === null ? /*#__PURE__*/React.createElement(HomePage, {
    theme: theme,
    data: p.data,
    si: hpSel,
    ss: setHpSel,
    dc: setDisplayedCountry
  }) : /*#__PURE__*/React.createElement(CountryDetails, {
    theme: theme,
    dcState: {
      get: displayedCountry,
      set: setDisplayedCountry
    },
    bordering: displayedCountry.borders?.map(c => p.data.find(cd => cd.cca3 === c))
  }));
}
function main() {
  const rr = ReactDOM.createRoot(document.body);
  getCountries(c => rr.render( /*#__PURE__*/React.createElement(UI, {
    data: c
  })));
}
onload = main;