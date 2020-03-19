import React from "react";
import { stripIndent } from "common-tags";

exports.onRenderBody = (
  { setHeadComponents, setPostBodyComponents },
  opts
) => {
  const headComponents = [
    <link
      key="plugin-docsearch-css"
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
    />
  ];
  
  const postBodyComponents = [
    <script
      key="plugin-docsearch-js"
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"
    />,
  ];
  
  const addSpec = spec => {
    postBodyComponents.push(
      <script
        key="plugin-docsearch-initiate"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: stripIndent`
            var observer = new MutationObserver(function (mutations, instance) {
              var docuSearchElem = document.querySelector('${inputSelector}');
              if (docuSearchElem) {
                docsearch({
                  apiKey: "${spec.apiKey}",
                  indexName: "${spec.indexName}",
                  inputSelector: "${spec.inputSelector}",
                  debug: ${spec.debug === true ? "true" : "false"}
                });
                instance.disconnect(); // stop observing
                return;
              }
            });

            // start observing
            document.addEventListener("DOMContentLoaded", function() {
              observer.observe(document, {
                childList: true,
                subtree: true
              });
            });
          `
        }}
      />
    );
  };
  
  const specs = Array.isArray(opts)
    ? specs
    : [specs];

  for (const spec of specs) {
    if (spec.apiKey && spec.indexName && spec.inputSelector) {
      addSpec(spec);
    }
  }

  setHeadComponents(headComponents);
  setPostBodyComponents(postBodyComponents);
};
