(function () {

    const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

    const isDocServer =
        window.location.port === "5500";

    if (!isLocalhost || !isDocServer) return;


    function processDartBlocks() {

        const blocks = document.querySelectorAll(
            ".source pre code, .source-code pre code, .implementation pre code, pre code.language-dart"
        );


        blocks.forEach(block => {

            if (block.dataset.materialProcessed) return;

            block.dataset.materialProcessed = "true";


            if (typeof hljs !== "undefined" &&
                !block.classList.contains("hljs")) {

                hljs.highlightElement(block);

            }


            enhanceDart(block);

        });

    }



    function enhanceDart(block) {

        let html = block.innerHTML;


        /*
            Static methods:
            
            Uri.parse()
            ApiClient.get()
            ContributionReport.fromJson()
        */

        html = html.replace(
            /([A-Za-z0-9_]+)\.([A-Za-z_][A-Za-z0-9_]*)\(/g,
            '$1.<span class="dart-method">$2</span>('
        );



        /*
            Instance methods:

            .toString()
            .map()
            .where()
            .toList()
        */

        html = html.replace(
            /\.([a-zA-Z_][a-zA-Z0-9_]*)\(/g,
            '.<span class="dart-method">$1</span>('
        );



        /*
            Properties:

            response.statusCode
            response.body
            config.url
        */

        html = html.replace(
            /\.([a-zA-Z_][a-zA-Z0-9_]*)(?!\()/g,
            '.<span class="dart-property">$1</span>'
        );



        /*
            User classes:

            ContributionReport
            ApiClient
            BuildContext
            Widget
        */

        html = html.replace(
            /(?<![\w>])([A-Z][A-Za-z0-9_]*)(?![^<]*<\/span>)/g,
            '<span class="dart-class">$1</span>'
        );



        /*
            Functions:

            jsonDecode()
            getReports()
        */

        html = html.replace(
            /\b([a-zA-Z_][A-Za-z0-9_]*)\(/g,
            '<span class="dart-function">$1</span>('
        );



        block.innerHTML = html;


        applyRainbowBrackets(block);

    }



    function applyRainbowBrackets(block) {

        let depth = 0;

        const walker = document.createTreeWalker(
            block,
            NodeFilter.SHOW_TEXT
        );


        const nodes = [];

        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }


        nodes.forEach(node => {

            let output = "";


            for (const char of node.nodeValue) {

                if ("([{".includes(char)) {

                    depth++;

                    output +=
                        `<span class="bracket-${depth % 3 || 3}">${char}</span>`;

                }
                else if (")]}".includes(char)) {

                    output +=
                        `<span class="bracket-${depth % 3 || 3}">${char}</span>`;

                    depth = Math.max(0, depth - 1);

                }
                else {

                    output += char;

                }

            }


            if (output !== node.nodeValue) {

                const span = document.createElement("span");

                span.innerHTML = output;

                node.replaceWith(span);

            }

        });

    }



    processDartBlocks();



    const observer = new MutationObserver(() => {

        processDartBlocks();

    });


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );


})();