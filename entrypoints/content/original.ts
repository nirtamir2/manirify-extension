(() => {
  "use strict";
  var e = {
      481: function (e, i, n) {
        var a =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(i, "__esModule", { value: !0 });
        var f = a(n(410));
        console.log("Emoji Autocompletion: Content script loaded"),
          (function () {
            var e = [],
              i = !1,
              n = null,
              a = 0,
              s = -1,
              d = ["github.com", "slack.com", "discord.com", "upwork.com"];
            function o() {
              var e,
                i = document.createElement("div");
              (i.style.cssText =
                "\n      position: fixed;\n      bottom: 20px;\n      right: 20px;\n      background-color: #f3ead9;\n      border: 1px solid #b0a591;\n      border-radius: 5px;\n      padding: 15px;\n      box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n      z-index: 10000;\n      max-width: 300px;\n      font-family: Arial, sans-serif;\n    "),
                (i.innerHTML =
                  '\n      <h3 style="font-size: 28px; line-height: 1.2; margin-top: 0; color: #333;">Unlock Emoji Autocomplete! 😃</h3>\n      <p style="margin-bottom: 10px; color: #666; font-size: 16px; line-height: 1.2;">\n        Enjoy Slack-style emoji shortcuts across the entire web. \n        Boost your expressiveness with just a few keystrokes!\n      </p>\n      <a id="emoji-purchase-btn"\n        href="https://flyingfridgedigital.lemonsqueezy.com/buy/44c2fd9e-aaea-4511-b3d6-2b68869363dd"\n        target="_blank" \n        style="background-color: #4CAF50;\n        color: white;\n        border: 1px solid #38813b;\n        padding: 10px 15px;\n        text-align: center;\n        text-decoration: none;\n        display: inline-block;\n        font-size: 14px;\n        margin: 4px 2px;\n        cursor: pointer;\n        border-radius: 4px;\n      ">Purchase Now →</a>\n      <button id="emoji-close-btn" style="\n        background-color: transparent;\n        color: #666;\n        border: none;\n        padding: 5px;\n        text-align: center;\n        text-decoration: none;\n        display: inline-block;\n        font-size: 14px;\n        margin: 4px 2px;\n        cursor: pointer;\n        position: absolute;\n        top: 5px;\n        right: 5px;\n      ">✕</button>\n    '),
                document.body.appendChild(i),
                null === (e = document.getElementById("emoji-close-btn")) ||
                  void 0 === e ||
                  e.addEventListener("click", function () {
                    i.style.display = "none";
                  });
            }
            chrome.runtime.sendMessage(
              { action: "checkLicense" },
              function (r) {
                chrome.runtime.lastError
                  ? (console.error(
                      "Error checking license:",
                      chrome.runtime.lastError,
                    ),
                    o())
                  : r && r.isLicensed
                    ? chrome.storage.sync.get(
                        ["whitelist", "blacklist"],
                        function (o) {
                          var r = window.location.hostname,
                            t = o.whitelist || [],
                            l = o.blacklist || [];
                          0 === l.length &&
                            chrome.storage.sync.set({ blacklist: d }),
                            (t.length > 0
                              ? t.some(function (e) {
                                  return r.includes(e);
                                })
                              : !l.some(function (e) {
                                  return r.includes(e);
                                })) &&
                              (function () {
                                var d;
                                ((d = document.createElement("link")).href =
                                  chrome.runtime.getURL("styles.css")),
                                  (d.type = "text/css"),
                                  (d.rel = "stylesheet"),
                                  (
                                    document.head || document.documentElement
                                  ).appendChild(d),
                                  (function () {
                                    console.log("Initializing emoji list");
                                    try {
                                      console.log("Raw emoji data:", f.default),
                                        (i = f.default),
                                        console.log(
                                          "Processing emoji data:",
                                          i,
                                        ),
                                        i && i.emojis
                                          ? (Object.values(i.emojis).forEach(
                                              function (i) {
                                                i.id &&
                                                  i.name &&
                                                  i.skins &&
                                                  i.skins[0] &&
                                                  i.skins[0].native &&
                                                  e.push({
                                                    id: i.id,
                                                    name: i.name.toLowerCase(),
                                                    skins: i.skins,
                                                  });
                                              },
                                            ),
                                            console.log(
                                              "Processed ".concat(
                                                e.length,
                                                " emojis",
                                              ),
                                            ),
                                            console.log(
                                              "Sample emojis:",
                                              e.slice(0, 5),
                                            ))
                                          : console.error(
                                              "Unexpected emoji data structure:",
                                              i,
                                            );
                                    } catch (e) {
                                      console.error(
                                        "Error initializing emoji list:",
                                        e,
                                      );
                                    }
                                    var i;
                                  })();
                                var o = (function () {
                                  var e = document.createElement("div");
                                  (e.id = "emoji-autocomplete-dropdown"),
                                    (e.style.cssText =
                                      "\n          position: fixed;\n          z-index: 2147483647;\n          background: white;\n          border: 1px solid rgba(0, 0, 0, 0.1);\n          border-radius: 8px;\n          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n          display: none;\n          max-height: 200px;\n          overflow-y: auto;\n          padding: 4px;\n          min-width: 200px;\n          backdrop-filter: blur(8px);\n          transition: opacity 0.1s ease-in-out;\n      ");
                                  var i = document.createElement("style");
                                  return (
                                    (i.textContent =
                                      "\n          #emoji-autocomplete-dropdown .emoji-option {\n              padding: 8px 12px;\n              cursor: pointer;\n              border-radius: 6px;\n              transition: background-color 0.1s ease-in-out;\n              display: flex;\n              align-items: center;\n              gap: 8px;\n          }\n\n          #emoji-autocomplete-dropdown .emoji-option:hover,\n          #emoji-autocomplete-dropdown .emoji-option.selected {\n              background-color: rgba(0, 0, 0, 0.05);\n          }\n\n          #emoji-autocomplete-dropdown .emoji-option.selected {\n              background-color: rgba(0, 0, 0, 0.08);\n          }\n      "),
                                    document.head.appendChild(i),
                                    document.body.appendChild(e),
                                    e
                                  );
                                })();
                                function r() {
                                  (o.style.display = "none"),
                                    (i = !1),
                                    (a = 0),
                                    console.log("Dropdown hidden");
                                }
                                function t(e) {
                                  o
                                    .querySelectorAll(".emoji-option")
                                    .forEach(function (i, n) {
                                      n === e
                                        ? (i.classList.add("selected"),
                                          i.scrollIntoView({
                                            block: "nearest",
                                          }))
                                        : i.classList.remove("selected");
                                    }),
                                    (a = e);
                                }
                                function l(e, i) {
                                  if (n) {
                                    if (
                                      n instanceof HTMLInputElement ||
                                      n instanceof HTMLTextAreaElement
                                    ) {
                                      var a = n.selectionEnd || 0;
                                      (n.value =
                                        n.value.substring(0, i) +
                                        e +
                                        n.value.substring(a)),
                                        (n.selectionStart = n.selectionEnd =
                                          i + e.length),
                                        n.focus();
                                    } else if (n.isContentEditable) {
                                      var f = window.getSelection();
                                      if (f && f.rangeCount > 0) {
                                        var s = f.getRangeAt(0),
                                          d = s.startContainer;
                                        if (d.nodeType === Node.TEXT_NODE) {
                                          var o = d,
                                            t = o.textContent || "",
                                            l = t.substring(0, i),
                                            u = t.substring(s.startOffset);
                                          o.textContent = l + e + u;
                                          var v = i + e.length;
                                          s.setStart(o, v),
                                            s.setEnd(o, v),
                                            f.removeAllRanges(),
                                            f.addRange(s);
                                        } else
                                          s.deleteContents(),
                                            s.insertNode(
                                              document.createTextNode(e),
                                            ),
                                            s.collapse(!1),
                                            f.removeAllRanges(),
                                            f.addRange(s);
                                      }
                                    }
                                    r(), console.log("Emoji inserted:", e);
                                  }
                                }
                                document.addEventListener(
                                  "input",
                                  function (f) {
                                    var d;
                                    console.log("Input event triggered");
                                    var u = f.target;
                                    if (
                                      u instanceof HTMLTextAreaElement ||
                                      u instanceof HTMLInputElement ||
                                      u.isContentEditable
                                    ) {
                                      n = u;
                                      var v = void 0,
                                        c = void 0;
                                      if (
                                        u instanceof HTMLTextAreaElement ||
                                        u instanceof HTMLInputElement
                                      )
                                        (v = u.selectionStart || 0),
                                          (c = u.value.substring(0, v));
                                      else {
                                        var m = window.getSelection();
                                        if (!(m && m.rangeCount > 0)) return;
                                        (v = (d = (function (e) {
                                          var i = e.cloneRange();
                                          i.selectNodeContents(
                                            e.startContainer.parentElement ||
                                              document.body,
                                          ),
                                            i.setEnd(
                                              e.endContainer,
                                              e.endOffset,
                                            );
                                          var n = i.toString();
                                          return [n.length, n];
                                        })(m.getRangeAt(0)))[0]),
                                          (c = d[1]);
                                      }
                                      var k = c.match(/:(\w+)$/);
                                      if (k) {
                                        console.log(
                                          "Colon syntax detected:",
                                          k[1],
                                        );
                                        var g = k[0],
                                          w = k[1];
                                        s = v - g.length;
                                        var y = e
                                          .filter(function (e) {
                                            return (
                                              e.name.includes(
                                                w.toLowerCase(),
                                              ) ||
                                              e.id.includes(w.toLowerCase())
                                            );
                                          })
                                          .slice(0, 5);
                                        if (
                                          (console.log("Filtered emojis:", y),
                                          y.length > 0)
                                        ) {
                                          var b = u.getBoundingClientRect();
                                          !(function (e, f, d) {
                                            console.log(
                                              "Showing dropdown with emojis:",
                                              d,
                                            ),
                                              (o.innerHTML = d
                                                .map(function (e, i) {
                                                  return '\n          <div class="emoji-option '
                                                    .concat(
                                                      0 === i ? "selected" : "",
                                                      '" data-emoji="',
                                                    )
                                                    .concat(
                                                      e.skins[0].native,
                                                      '" data-index="',
                                                    )
                                                    .concat(
                                                      i,
                                                      '">\n              ',
                                                    )
                                                    .concat(
                                                      e.skins[0].native,
                                                      " :",
                                                    )
                                                    .concat(
                                                      e.id,
                                                      ":\n          </div>\n      ",
                                                    );
                                                })
                                                .join("")),
                                              (o.style.visibility = "hidden"),
                                              (o.style.display = "block");
                                            var r = o.getBoundingClientRect(),
                                              u = window.innerHeight,
                                              v = window.innerWidth,
                                              c = f + r.height > u,
                                              m = e + r.width > v,
                                              k = f,
                                              g = e;
                                            c && (k = f - r.height - 10),
                                              m && (g = v - r.width - 10),
                                              (o.style.left = "".concat(
                                                g,
                                                "px",
                                              )),
                                              (o.style.top = "".concat(
                                                k,
                                                "px",
                                              )),
                                              (o.style.visibility = "visible"),
                                              (i = !0),
                                              (a = 0),
                                              o
                                                .querySelectorAll(
                                                  ".emoji-option",
                                                )
                                                .forEach(function (e) {
                                                  e.addEventListener(
                                                    "click",
                                                    function (e) {
                                                      var i =
                                                        e.target.getAttribute(
                                                          "data-emoji",
                                                        );
                                                      i && n && l(i, s);
                                                    },
                                                  ),
                                                    e.addEventListener(
                                                      "mouseover",
                                                      function (e) {
                                                        var i = e.target;
                                                        t(
                                                          parseInt(
                                                            i.getAttribute(
                                                              "data-index",
                                                            ) || "0",
                                                          ),
                                                        );
                                                      },
                                                    );
                                                });
                                          })(
                                            window.pageXOffset + b.left,
                                            window.pageYOffset + b.bottom,
                                            y,
                                          );
                                        } else r();
                                      } else r(), (s = -1);
                                    }
                                  },
                                  !0,
                                ),
                                  document.addEventListener(
                                    "keydown",
                                    function (e) {
                                      if (i) {
                                        var n =
                                          o.querySelectorAll(".emoji-option");
                                        switch (e.key) {
                                          case "ArrowDown":
                                            e.preventDefault(),
                                              e.stopPropagation(),
                                              t((a + 1) % n.length);
                                            break;
                                          case "ArrowUp":
                                            e.preventDefault(),
                                              e.stopPropagation(),
                                              t((a - 1 + n.length) % n.length);
                                            break;
                                          case "Enter":
                                            e.preventDefault(),
                                              e.stopPropagation();
                                            var f =
                                              n[a].getAttribute("data-emoji");
                                            f && l(f, s);
                                            break;
                                          case "Escape":
                                            e.preventDefault(), r();
                                        }
                                      }
                                    },
                                    !0,
                                  ),
                                  document.addEventListener(
                                    "click",
                                    function (e) {
                                      i && !o.contains(e.target) && r();
                                    },
                                    !0,
                                  ),
                                  console.log(
                                    "Emoji Autocompletion: Extension initialized for licensed user",
                                  );
                              })();
                        },
                      )
                    : (console.log(
                        "Extension not licensed. Features disabled.",
                      ),
                      o());
              },
            );
          })();
      },
      410: (e) => {
        e.exports = JSON.parse("{}");
      },
    },
    i = {};
  !(function n(a) {
    var f = i[a];
    if (void 0 !== f) return f.exports;
    var s = (i[a] = { exports: {} });
    return e[a].call(s.exports, s, s.exports, n), s.exports;
  })(481);
})();
