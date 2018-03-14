// ==UserScript==
// @name         v2ex show comment reference
// @namespace    https://www.v2ex.com/
// @version      0.1
// @description  show the previous comment referenced by "@" syntax
// @author       tqjlfmv
// @match        https://www.v2ex.com/t/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    (function () {
        // Initialization
        $("div.cell")
            .filter(function (i, c) { return c.querySelector("a.dark"); })
            .map(function (i, c) {
                c.dataset.height = $(this).css("height");
                c.dataset.padding = $(c).css("padding");
                c.style.overflowY = "hidden";
            });
    })();
    function HoverHandler(a) {
        var currentCell = a.parentElement;
        while (currentCell.className != "cell")
            currentCell = currentCell.parentElement;
        var skipped = {}, ref = currentCell.previousElementSibling;
        while (ref.querySelector("a.dark") && ref.querySelector("a.dark").innerHTML != a.innerHTML) {
            skipped[ref.id] = true;
            ref = ref.previousElementSibling;
        }

        var marginLeft = "-5em";
        if ($(ref).css("marginLeft") != "0px") {
            // restore zipped styles
            skipped = {};
            marginLeft = "";
        }

        var cells = $("div.cell").filter(function (i, c) { return c.querySelector("a.dark"); });
        var animatedCount = 0;
        function Final () {
            if (++animatedCount == cells.length) {
                ref.scrollIntoView({ block: "start", behavior: 'smooth' });
                $(ref).animate({
                    "marginLeft": marginLeft
                }, "fast");
            }
        }
        for (var i = 0; i < cells.length; ++i) {
            $(cells[i]).animate({
                "height": skipped[cells[i].id] ? "0px" : cells[i].dataset.height,
                "padding": skipped[cells[i].id] ? "1px" : cells[i].dataset.padding,
                "marginLeft": "",
                "backgroundColor": "white"
            }, 400, Final);
        }
    }
    $("div.reply_content > a")
        .filter(function (i,a){ return a.previousSibling && a.previousSibling.data == "@"; })
        .click(function (e) {
            e.preventDefault();
            HoverHandler(this);
        });
})();
