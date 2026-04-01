const outfitFontCSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

/* Force font everywhere */

body {
  font-family: 'Outfit', sans-serif !important;
}
`;

const { ipcRenderer } = require("electron");

// const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const UA = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36`;

ipcRenderer.on("oauth-complete", (event, siteName) => {

  if (siteName === "siteA") {
    siteA.reload();
  }

  if (siteName === "siteB") {
    siteB.reload();
  }

});

function attachOAuthInterceptor(webview, siteId) {

  function handleNavigation(event) {
    const url = event.url;

    if (
      url.includes("accounts.google.com") ||
      url.includes("login.microsoftonline.com")
    ) {
      console.log("Intercepted OAuth attempt:", url);

      event.preventDefault();

      const provider = url.includes("google")
        ? "google"
        : "microsoft";

      window.authAPI.startOAuth(siteId, provider);
    }
  }

  webview.addEventListener("will-navigate", handleNavigation);
  webview.addEventListener("new-window", handleNavigation);
}

function reloadWebview(webviewElement, url) {
  if (webviewElement) {
    // webviewElement.src = "www.google.com";
    webviewElement.src = url;

    // webviewElement.load();
    console.log(`Webview reloaded with URL: ${url}`);
  }
}

const Options = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chatgpt.com/",
    onWebviewReady: "gptReady",
    onSubmit: "gptSubmit",
    onToggle: "gptToggle",
    listening: true,
    added: false

  },
  {
    id: "claude",
    name: "Claude AI",
    url: "https://claude.ai/",
    onWebviewReady: "claudeReady",
    onSubmit: "claudeSubmit",
    onToggle: "claudeToggle",
    listening: true,
    added: false
  }, {
    id: "gemini",
    name: "Google Gemini",
    url: "https://gemini.google.com/app?hl=en-IN",
    onWebviewReady: "geminiReady",
    onSubmit: "geminiSubmit",
    onToggle: "geminiToggle",
    listening: true,
    added: false
  }, {
    id: "copilot",
    name: "Microsoft Copilot",
    url: "https://copilot.microsoft.com/",
    onWebviewReady: "copilotReady",
    onSubmit: "copilotSubmit",
    onToggle: "copilotToggle",
    listening: true,
    added: false
  }, {
    id: "perplexity",
    name: "Perplexity",
    url: "https://www.perplexity.ai/",
    onWebviewReady: "perplexityReady",
    onSubmit: "perplexitySubmit",
    onToggle: "perplexityToggle",
    listening: true,
    added: false
  }, {
    id: "grok",
    name: "Grok (xAI)",
    url: "https://grok.com/",
    onWebviewReady: "grokReady",
    onSubmit: "grokSubmit",
    onToggle: "grokToggle",
    listening: true,
    added: false
  }, {
    id: "gcopilot",
    name: "GitHub Copilot",
    url: "https://github.com/copilot/",
    onWebviewReady: "gCopilotReady",
    onSubmit: "gCopilotSubmit",
    onToggle: "gCopilotToggle",
    listening: true,
    added: false
  }, {
    id: "v0",
    name: "Vercel V0",
    url: "https://v0.app/",
    onWebviewReady: "v0Ready",
    onSubmit: "v0Submit",
    onToggle: "v0Toggle",
    listening: true,
    added: false
  }, {
    id: "deepseek",
    name: "Deepseek",
    url: "https://chat.deepseek.com/",
    onWebviewReady: "deepseekReady",
    onSubmit: "deepseekSubmit",
    onToggle: "deepseekToggle",
    listening: true,
    added: false
  }, {
    id: "meta",
    name: "Meta AI",
    url: "https://www.meta.ai/",
    onWebviewReady: "metaReady",
    onSubmit: "metaSubmit",
    onToggle: "metaToggle",
    listening: true,
    added: false
  }
];




function waitForDomReady(webview) {
  return new Promise(resolve => {
    webview.addEventListener("dom-ready", resolve, { once: true });
  });
}


// function waitForDomReady(webview) {
//   return new Promise(resolve => {
//     // ✅ If already loaded → resolve immediately
//     if (!webview.isLoading()) {
//       resolve();
//       return;
//     }

//     webview.addEventListener("dom-ready", resolve, { once: true });
//   });
// }


// function waitForDomReady(webview) {
//   return new Promise(resolve => {
//     // If already loaded and has a URL → safe to proceed
//     if (webview.getURL() && !webview.isLoading()) {
//       resolve();
//       return;
//     }

//     const handler = () => {
//       webview.removeEventListener("dom-ready", handler);
//       resolve();
//     };

//     webview.addEventListener("dom-ready", handler);
//   });
// }

const toggleInputs = {

  gptToggle: async (webview) => {
    webview.executeJavaScript(`
      //  document.querySelector('form[data-type="unified-composer"]')?.style.setProperty('display','none','important');
      (() => {
  const el = document.querySelector('form[data-type="unified-composer"]');
  if (!el) {
    console.log("Composer not found");
    return;
  }

  const isHidden = getComputedStyle(el).display === "none";

  if (isHidden) {
    el.style.removeProperty("display");
    console.log("Composer shown");
  } else {
    el.style.setProperty("display", "none", "important");
    console.log("Composer hidden");
  }
})();


    `)
  },
  geminiToggle: async (webview) => {
    webview.executeJavaScript(`
      (() => {
        console.log('CAME IN GEMINI TOGGLE CONTAINER');
  const STYLE_ID = "hide-input-container-style";

  // function toggleContainer() {
    const existing = document.getElementById(STYLE_ID);

    if (existing) {
      existing.remove();
      console.log("Container shown");
    } else {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = \`
        input-container {
          display: none !important;
        }
      \`;
      document.head.appendChild(style);
      console.log("Container hidden");
    }
  // }

  // document.getElementById("toggle-btn")?.addEventListener("click", toggleContainer);
})();
    `);
  },

  claudeToggle: async (webview) => {
    webview.executeJavaScript(`
(() => {
  const el = document.querySelector('[data-hidden-by-script="true"]');
  if (el) {
    el.style.position = '';
    el.style.left = '';
    delete el.dataset.hiddenByScript;
  } else {
      const le = document
    .querySelector('[data-testid="chat-input"]')
    ?.closest('fieldset');

  if (le) {
    le.dataset.hiddenByScript = 'true';
    le.style.position = 'absolute';
    le.style.left = '-9999px';
  }
    
    }
})();
`);
  },

  perplexityToggle: async (webview) => {
    webview.executeJavaScript(`
      (() => {
  const editor = document.getElementById("ask-input");
  if (!editor) {
    console.log("ask-input not found");
    return;
  }

  const wrapper = editor.closest(".bg-raised.w-full.outline-none");
  if (!wrapper) {
    console.log("Specific wrapper not found");
    return;
  }

  const isHidden = wrapper.dataset.hidden === "true";

  if (isHidden) {
    // 🔓 Restore
    wrapper.removeAttribute("style");
    editor.removeAttribute("style");
    wrapper.dataset.hidden = "false";
    console.log("Composer shown");
  } else {
    // 🔒 Hide
    Object.assign(wrapper.style, {
      position: "fixed",
      top: "-10000px",
      left: "-10000px",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      opacity: "0",
      pointerEvents: "none",
      zIndex: "-9999"
    });

    Object.assign(editor.style, {
      position: "fixed",
      top: "-10000px",
      left: "-10000px",
      opacity: "0",
      pointerEvents: "none"
    });

    wrapper.dataset.hidden = "true";
    console.log("Composer hidden safely");
  }
})();      
      `)
  },

  copilotToggle: async (webview) => {
    console.log(`CAME IN COPILOT TOGGLE COMPOSER ba bal lb lab lb `)

    console.log("isLoading:", webview.isLoading());
    console.log("URL:", webview.getURL());
    // await waitForDomReady(webview);


    // webview.openDevTools();
    console.log(`CAME IN COPILOT TOGGLE COMPOSER after waitForDomReady`)
    webview.executeJavaScript(`


(() => {
  console.log('CAME IN TOGGLE COMPOSER copilot')
  const STYLE_ID = "hide-composer-style";

  const existingStyle = document.getElementById(STYLE_ID);

  if (existingStyle) {
    // 🔁 SHOW (remove style)
    existingStyle.remove();
    console.log("Composer shown");
  } else {
    // 🔒 HIDE (add style)
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = \`
      [data-testid="composer-content"] {
        position: fixed !important;
        top: -10000px !important;
        left: -10000px !important;
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        overflow: hidden !important;
        z-index: -9999 !important;
      }
    \`;
    document.head.appendChild(style);
    console.log("Composer hidden");
  }
})();

    `);
  },


  deepseekToggle: async (webview) => {

    webview.executeJavaScript(`
(() => {
  const ele = document
    .querySelector('textarea[placeholder="Message DeepSeek"]')
    ?.closest('div')
    ?.parentElement
    ?.parentElement;

  if (!ele) {
    console.log("Element not found");
    return;
  }

  // Toggle class
  ele.classList.toggle("hide-deepseek-composer");

  // Inject style once
  if (!document.getElementById("deepseek-toggle-style")) {
    const style = document.createElement("style");
    style.id = "deepseek-toggle-style";
    style.textContent = \`
      .hide-deepseek-composer {
        position: fixed !important;
        top: -10000px !important;
        left: -10000px !important;
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        overflow: hidden !important;
        z-index: -9999 !important;
      }
    \`;
    document.head.appendChild(style);
  }

  console.log(
    ele.classList.contains("hide-deepseek-composer")
      ? "Composer hidden"
      : "Composer visible"
  );
})();

    `)


  }

}



const WebviewReadyHandlers = {
  gptReady: async (webview) => {

    await waitForDomReady(webview);
    // webview.openDevTools();

    webview.executeJavaScript(`
      document.documentElement.style.filter = "contrast(1.1) saturate(1)";
      document.querySelector('form[data-type="unified-composer"]')?.style.setProperty('display','none','important');
    `);
  },
  geminiReady: async (webview) => {
    await waitForDomReady(webview);
    // webview.openDevTools();
    webview.executeJavaScript(`
        // document.querySelector('input-container')?.style.setProperty('display','none','important');

        (() => {
  if (document.getElementById("hide-input-container-style")) return;

  const style = document.createElement("style");
  style.id = "hide-input-container-style";
  style.textContent = \`
    input-container {
      display: none !important;
    }
  \`;

  document.head.appendChild(style);
  console.log("input-container permanently hidden");
})();
    `);
  },

  claudeReady: async (webview) => {
    await waitForDomReady(webview);
    // webview.openDevTools();
    webview.executeJavaScript(`
(() => {
  const el = document
    .querySelector('[data-testid="chat-input"]')
    ?.closest('fieldset');

  if (el) {
    el.dataset.hiddenByScript = 'true';
    el.style.position = 'absolute';
    el.style.left = '-9999px';
  }
})();

    `);
  },

  copilotReady: async (webview) => {
    await waitForDomReady(webview);
    // webview.openDevTools();
    webview.executeJavaScript(`
        // document.querySelector('[data-testid="composer-content"]')?.style.setProperty('display','none');

//          (() => {
//    const style = document.createElement("style");
//    style.textContent = \`
//      [data-testid="composer-content"] {
//        position: fixed !important;
//        top: -10000px !important;
//        left: -10000px !important;
//        width: 1px !important;
//        height: 1px !important;
//        opacity: 0 !important;
//        pointer-events: none !important;
//        overflow: hidden !important;
//        z-index: -9999 !important;
//      }
//    \`;
//    document.head.appendChild(style);
//    console.log("Composer hidden safely via CSS");
//  })();



// document.documentElement.style.filter = "contrast(1.5)";

document.documentElement.style.filter = "contrast(1.1) saturate(.9)";

(() => {
  const STYLE_ID = "hide-composer-style";

  const existingStyle = document.getElementById(STYLE_ID);

  if (existingStyle) {
    // 🔁 SHOW (remove style)
    existingStyle.remove();
    console.log("Composer shown");
  } else {
    // 🔒 HIDE (add style)
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = \`
      [data-testid="composer-content"] {
        position: fixed !important;
        top: -10000px !important;
        left: -10000px !important;
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        overflow: hidden !important;
        z-index: -9999 !important;
      }
    \`;
    document.head.appendChild(style);
    console.log("Composer hidden");
  }
})();
    `);
  },

  perplexityReady: async (webview) => {
    await waitForDomReady(webview);
    // webview.openDevTools();
    webview.executeJavaScript(`
        // document.querySelector('.erp-sidecar\\:fixed')?.style.setProperty('display','none');


  (() => {
    const editor = document.getElementById("ask-input");
    if (!editor) {
      console.log("ask-input not found");
      return;
    }

    const wrapper = editor.closest(".bg-raised.w-full.outline-none");
    if (!wrapper) {
      console.log("Specific wrapper not found");
      return;
    }

    // Move wrapper off-screen instead of display:none
    Object.assign(wrapper.style, {
      position: "fixed",
      top: "-10000px",
      left: "-10000px",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      opacity: "0",
      pointerEvents: "none",
      zIndex: "-9999"
    });

    // Also protect the editor itself
    Object.assign(editor.style, {
      position: "fixed",
      top: "-10000px",
      left: "-10000px",
      opacity: "0",
      pointerEvents: "none"
    });

    console.log("Composer hidden safely");
  })();

    `);
  },

  grokReady: async (webview) => {
    await waitForDomReady(webview);
    await webview.executeJavaScript(`
        document.querySelector('div.relative.w-full.px-gutter')?.style.setProperty('display','none','important');
    `);
  },

  gCopilotReady: async (webview) => {
    await waitForDomReady(webview);
    await webview.executeJavaScript(`
        document.querySelector('[class^="Layout-module__chatInputContainer__"]')?.style.setProperty('display','none','important');
    `);
  },

  v0Ready: async (webview) => {
    await waitForDomReady(webview);
    await webview.executeJavaScript(`
        document.querySelector('form[data-prompt-form="true"]')
          ?.closest('.relative.z-10.flex.w-full.flex-col')
          ?.style.setProperty('display','none','important');
    `);
  },

  deepseekReady: async (webview) => {
    await waitForDomReady(webview);
    // webview.openDevTools();
    await webview.executeJavaScript(`
//        document
//            .querySelector('textarea[placeholder="Message DeepSeek"]')
//            ?.closest('div')
//            ?.parentElement
//            ?.parentElement
//            ?.style.setProperty('display','none','important');


(() => {
  const el = document
    .querySelector('textarea[placeholder="Message DeepSeek"]')
    ?.closest('div')
    ?.parentElement
    ?.parentElement;

  if (!el) {
    console.log("Element not found");
    return;
  }

  // Toggle class
  el.classList.toggle("hide-deepseek-composer");

  // Inject style once
  if (!document.getElementById("deepseek-toggle-style")) {
    const style = document.createElement("style");
    style.id = "deepseek-toggle-style";
    style.textContent = \`
      .hide-deepseek-composer {
        position: fixed !important;
        top: -10000px !important;
        left: -10000px !important;
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        overflow: hidden !important;
        z-index: -9999 !important;
      }
    \`;
    document.head.appendChild(style);
  }

  console.log(
    el.classList.contains("hide-deepseek-composer")
      ? "Composer hidden"
      : "Composer visible"
  );
})();
    `);
  },

  metaReady: async (webview) => {
    console.log(`META META METAMETA`)
    await waitForDomReady(webview);
    // webview.openDevTools();
    await webview.executeJavaScript(`
        // document.querySelector('[data-pagelet="KadabraPrivateComposer"]')?.style.setProperty('display', 'none', 'important');
    `);
  },

};


const SubmitHandlers = {
  gptSubmit: async (webview, prompt) => {
    webview.executeJavaScript(`
        console.log('GPT submit ran');
        //set value
        // (() => {
        //   const editor = document.querySelector('#prompt-textarea.ProseMirror');
        //   if (!editor) return console.log("Editor not found");

        //   editor.focus();

        //   // Clear existing content
        //   editor.innerHTML = "";

        //   // Insert text properly as paragraph
        //   editor.innerHTML = "<p>${JSON.stringify(prompt)}</p>";

        //   // Trigger React/ProseMirror update
        //   editor.dispatchEvent(new InputEvent("input", { bubbles: true }));

        //   //submit
        //   setTimeout(() => {
        //       document.querySelector('[data-testid="send-button"]')?.click();
        //   }, 50)

        // })();

        (() => {
  const editor = document.querySelector('#prompt-textarea.ProseMirror');
  if (!editor) return console.log("Editor not found");

  editor.focus();

  // Clear existing content safely
  editor.textContent = "";

  const promptText = ${JSON.stringify(prompt)};

  // Create paragraph properly
  const p = document.createElement("p");
  p.textContent = promptText;

  editor.innerHTML = "";
  editor.appendChild(p);

  editor.dispatchEvent(new InputEvent("input", { bubbles: true }));

  setTimeout(() => {
    document.querySelector('[data-testid="send-button"]')?.click();
  }, 50);
})();
    `);
  },
  geminiSubmit: async (webview, prompt) => {
    webview.executeJavaScript(`

    (function() {
      const editor = document.querySelector('.ql-editor[contenteditable="true"]');
      if (!editor) {
        console.log("Editor not found");
        return;
      }

      editor.focus();

      // Replace content safely
      editor.textContent = ${JSON.stringify(prompt)};

      // Notify Quill / Angular / React
      editor.dispatchEvent(new InputEvent("input", { bubbles: true }));

      console.log("Text inserted safely");

      setTimeout(() => {
        const btn = document.querySelector('button.send-button.submit[aria-label="Send message"]');
        if (!btn) {
          console.log("Send button not found");
          return;
        }

        btn.click();
        console.log("Send button clicked");
      }, 100);
    })();

     
    `);
  },

  claudeSubmit: async (webview, prompt) => {
    webview.executeJavaScript(`

     

  (() => {    
  const editor = document.querySelector('[data-testid="chat-input"][contenteditable="true"]');
  if (!editor){
    console.log("Editor not found");
    return 
  }

  editor.focus();

  // Clear existing content properly
  document.execCommand('selectAll', false, null);
  document.execCommand('delete', false, null);

  // Insert text like a real user
  document.execCommand('insertText', false, ${JSON.stringify(prompt)});

  console.log("Text inserted");

  setTimeout(() => {
    document.querySelector('button[aria-label="Send message"]:not([disabled])')?.click();
    }, 50)

})();


      
    `);
  },

  copilotSubmit: async (webview, prompt) => {
    webview.executeJavaScript(`

        // document.querySelector('[data-testid="composer-input"]')?.dispatchEvent(Object.assign(document.querySelector('[data-testid="composer-input"]').value = ${JSON.stringify(prompt)}, new Event('input', { bubbles: true })));
        // const el = document.querySelector('[data-testid="composer-input"]'); el && (el.value = ${JSON.stringify(prompt)}, el.dispatchEvent(new Event("input", { bubbles: true })));

        (() => {
const el = document.querySelector('[data-testid="composer-input"]');
if (!el) return;

const nativeSetter = Object.getOwnPropertyDescriptor(
  HTMLTextAreaElement.prototype,
  "value"
).set;

nativeSetter.call(el, ${JSON.stringify(prompt)});

el.dispatchEvent(new Event("input", { bubbles: true }));



         setTimeout(() => {

  //             const el = document.querySelector('[data-testid="composer-input"]');
  // if (!el) return;

  // // React-safe value setter
  // const setter = Object.getOwnPropertyDescriptor(
  //   HTMLTextAreaElement.prototype,
  //   "value"
  // ).set;

  // setter.call(el, 'dfssdf');

  // el.dispatchEvent(new Event("input", { bubbles: true }));
  el.focus();

  // // Simulate real Enter key press sequence
  ["keydown", "keypress", "keyup"].forEach(type => {
    el.dispatchEvent(new KeyboardEvent(type, {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    }));
  });    

    }, 50)

    })();


    `);
  },

  perplexitySubmit: async (webview, prompt) => {
    webview.executeJavaScript(`


  (() => {
  const editor = document.getElementById("ask-input");
  if (!editor) return console.log("Editor not found");

  editor.focus();

  // Clear existing content
  document.execCommand("selectAll", false, null);
  document.execCommand("delete", false, null);

  // Insert text like real typing
  document.execCommand("insertText", false,  ${JSON.stringify(prompt)});

  // Trigger update for Lexical
  editor.dispatchEvent(new InputEvent("input", { bubbles: true }));

  console.log("Text inserted successfully");



  setTimeout(() => {
  const btn = document.querySelector('button[aria-label="Submit"]');
  if (!btn) return console.log("Submit button not found");

  btn.click();
  console.log("Submit button clicked");
}, 50);




  setTimeout(async () => {
    console.log('CAME IN ASYNC TO REHIDE THE CONTAINER')

    const wait = (ms) => new Promise(res => setTimeout(res, ms));

    let newEditor = null;

    while (!newEditor) {
      newEditor = document.getElementById("ask-input");
      if (!newEditor) {
        console.log("ask-input not found, retrying...");
        await wait(500);
      }
    }

    console.log("ask-input found");

    const wrapper = newEditor.closest(".bg-raised.w-full.outline-none");
    if (!wrapper) {
      console.log("Wrapper not found");
      return;
    }

    Object.assign(wrapper.style, {
      position: "fixed",
      top: "-10000px",
      left: "-10000px",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      opacity: "0",
      pointerEvents: "none",
      zIndex: "-9999"
    });

    console.log("Composer hidden safely");

  },200);


})()


    `);
  },

  grokSubmit: async (webview, prompt) => {
    await webview.executeJavaScript(`
        document.querySelector('.ProseMirror') && ((el=document.querySelector('.ProseMirror')).focus(),document.execCommand('selectAll'),document.execCommand('insertText',false, ${prompt}));

         setTimout(() => {
document.querySelector('button[type="submit"][aria-label="Submit"]')?.click();
    },50)


    `);
  },

  gCopilotSubmit: async (webview, prompt) => {
    await webview.executeJavaScript(`

          const el = document.querySelector('#copilot-chat-textarea');
  if (!el) return;

  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value'
  ).set;

  setter.call(el, ${prompt});
  el.dispatchEvent(new Event('input', { bubbles: true }));

          setTimout(() => {
document
  .querySelector('#copilot-chat-textarea')
  ?.closest('form')
  ?.querySelector('svg.octicon-paper-airplane')
  ?.closest('button')
  ?.click();
    },50)

    `);
  },

  v0Submit: async (webview, prompt) => {
    await webview.executeJavaScript(`
        document.querySelector('[data-editor="true"] .ProseMirror') &&
((el=document.querySelector('[data-editor="true"] .ProseMirror')).focus(),
document.execCommand('selectAll'),
document.execCommand('insertText',false, ${prompt}));

 setTimeout(() => {
document.querySelector('[data-testid="prompt-form-send-button"]')?.click();
 },50)

    `);
  },

  deepseekSubmit: async (webview, prompt) => {
    console.log(`DEEPSEEK SUBMIT HANDLER, PROMPT: ${prompt}`)
    await webview.executeJavaScript(`


(() => {
  const elem = document.querySelector('textarea[placeholder="Message DeepSeek"]');


  if (!elem) return;

  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value'
  ).set;

  setter.call(elem, ${JSON.stringify(prompt)});
  elem.dispatchEvent(new Event('input', { bubbles: true }));

  setTimeout(() => {
    document
      .querySelector('svg path[d^="M8.3125 0.981587"]')
      ?.closest('[role="button"]')
      ?.click();
  }, 50);
})();


setTimeout(async () => {

  (() => {
  const el = document
    .querySelector('textarea[placeholder="Message DeepSeek"]')
    ?.closest('div')
    ?.parentElement
    ?.parentElement;

  if (!el) {
    console.log("Element not found");
    return;
  }

  // Toggle class
  el.classList.toggle("hide-deepseek-composer");

  // Inject style once
  if (!document.getElementById("deepseek-toggle-style")) {
    const style = document.createElement("style");
    style.id = "deepseek-toggle-style";
    style.textContent = \`
      .hide-deepseek-composer {
        position: fixed !important;
        top: -10000px !important;
        left: -10000px !important;
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        overflow: hidden !important;
        z-index: -9999 !important;
      }
    \`;
    document.head.appendChild(style);
  }

  console.log(
    el.classList.contains("hide-deepseek-composer")
      ? "Composer hidden"
      : "Composer visible"
  );
})();

},200);

           
    `);
  },

  metaSubmit: async (webview, prompt) => {
    // await waitForDomReady(webview)
    console.log('SUBMIT META SUBMIT META')
    webview.executeJavaScript(`

        // document.querySelector('[data-pagelet="KadabraPrivateComposer"]')?.style.setProperty('display', 'none', 'important');


//          (() => {
//     const editor = document.querySelector('[data-lexical-editor="true"][contenteditable="true"]');
//     if (!editor) return console.log("Editor not found");

//     editor.focus();
//     document.execCommand("selectAll", false, null);
//     document.execCommand("insertText", false, ${JSON.stringify(prompt)});

//     editor.dispatchEvent(new InputEvent("input", { bubbles: true }));

//         setTimeout(() => {
//       document.querySelector('[aria-label="Send"][role="button"]')?.click();
//     }, 50);
  
//   })();

(() => {
  const editor = document.querySelector('[data-lexical-editor="true"][contenteditable="true"]');
  if (!editor) return console.log("Editor not found");

  const editorInstance = editor.__lexicalEditor;
  editorInstance.update(() => {
    const text = ${prompt};
    const textNode = editorInstance._editor._node.createTextNode(text);
    editorInstance._editor._node.append(textNode);
  });

  editor.dispatchEvent(new InputEvent("input", { bubbles: true }));

  setTimeout(() => {
    document.querySelector('[aria-label="Send"][role="button"]')?.click();
  }, 50);
})();

              
        `);
  },


};


const selectedOptions = new Map();





document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const urlInput = document.getElementById('urlInput');
  // const addWebviewBtn = document.getElementById('addWebview');
  //  const sendBtn = document.querySelector('#send-btn001');
  const sendBtn = document.querySelector('#send-btn001');
  console.log(`The button is: ${sendBtn}`);
  const aiInput = document.querySelector('#ai-input');

  const someButton = document.querySelector('#some-btn');
  someButton.addEventListener('click', () => {
    console.log('Some button was clicked!');
  });


  const inputFunc = () => {
    aiInput.style.height = "auto";
    aiInput.style.height = aiInput.scrollHeight + "px";
  };
  aiInput.addEventListener("input", inputFunc);


  // Chat input dragging functionality
  const grabber = document.getElementById('grabber');
  const chatInput = document.querySelector('.chat-input');

  let chatDragState = {
    isDragging: false,
    hasBeenDragged: false,
    currentX: 0,
    currentY: 0,
    initialX: 0,
    initialY: 0,
    xOffset: 0,
    yOffset: 0
  };

  grabber.addEventListener('mousedown', chatDragStart);

  function chatDragStart(e) {
    if (e.button !== 0) return; // Only left mouse button

    e.preventDefault();
    e.stopPropagation();

    chatDragState.initialX = e.clientX - chatDragState.xOffset;
    chatDragState.initialY = e.clientY - chatDragState.yOffset;

    chatDragState.isDragging = true;
    grabber.style.cursor = 'grabbing';

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none'; // Disable pointer events on everything
    grabber.style.pointerEvents = 'auto'; // Except the grabber

    // This is the KEY - setCapture ensures all mouse events go to this element
    if (grabber.setCapture) {
      grabber.setCapture();
    }

    // Add listeners to WINDOW instead of document for even better capture
    window.addEventListener('mousemove', chatDrag, true);
    window.addEventListener('mouseup', chatDragEnd, true);
    // Also listen for when mouse leaves the window entirely
    window.addEventListener('blur', chatDragEnd, true);
  }

  function chatDrag(e) {
    if (!chatDragState.isDragging) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Calculate raw movement
    let newX = e.clientX - chatDragState.initialX;
    let newY = e.clientY - chatDragState.initialY;

    // Get current element dimensions
    const rect = chatInput.getBoundingClientRect();
    const elementWidth = rect.width;
    const elementHeight = rect.height;

    // --- VIEWPORT LIMITS ---
    const minTop = window.innerHeight * 0.03;
    const maxBottom = window.innerHeight * 0.97;
    const minLeft = window.innerWidth * 0.03;
    const maxRight = window.innerWidth * 0.97;

    // Calculate what the new position would be with transform
    // Since you have translateX(-50%), we need to account for that
    const centerX = window.innerWidth / 2; // Element is centered
    const newLeft = centerX - (elementWidth / 2) + newX;
    const newRight = centerX + (elementWidth / 2) + newX;
    const newTop = rect.top - chatDragState.yOffset + newY; // Current top minus old offset plus new offset
    const newBottom = newTop + elementHeight;

    // 🔒 Bottom lock (cannot go lower than original position)
    if (newY > 0) {
      newY = 0;
    }

    // 🔒 Top boundary
    if (newTop < minTop) {
      newY = newY + (minTop - newTop);
    }

    // 🔒 Bottom boundary (if you want to prevent going too low)
    if (newBottom > maxBottom) {
      newY = newY - (newBottom - maxBottom);
    }

    // 🔒 Left boundary
    if (newLeft < minLeft) {
      newX = newX + (minLeft - newLeft);
    }

    // 🔒 Right boundary
    if (newRight > maxRight) {
      newX = newX - (newRight - maxRight);
    }

    // Apply the constrained values
    chatDragState.currentX = newX;
    chatDragState.currentY = newY;
    chatDragState.xOffset = newX;
    chatDragState.yOffset = newY;

    chatInput.style.transform =
      `translateX(-50%) translate(${chatDragState.currentX}px, ${chatDragState.currentY}px)`;
  }

  function chatDragEnd(e) {
    if (!chatDragState.isDragging) return;

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    chatDragState.initialX = chatDragState.currentX;
    chatDragState.initialY = chatDragState.currentY;

    chatDragState.isDragging = false;
    grabber.style.cursor = 'grab';

    // Release capture
    if (document.releaseCapture) {
      document.releaseCapture();
    }

    // Re-enable everything
    document.body.style.userSelect = '';
    document.body.style.pointerEvents = '';
    grabber.style.pointerEvents = '';

    window.removeEventListener('mousemove', chatDrag, true);
    window.removeEventListener('mouseup', chatDragEnd, true);
    window.removeEventListener('blur', chatDragEnd, true);
  }

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey
    ) {
      e.preventDefault(); // optional, stops newline in inputs
      sendBtn.click();
      // this.style.height = "auto"; 
    }
  });


  sendBtn.addEventListener('click', () => {
    const testMessage = aiInput.value.trim();

    console.log(`The input text is: ${testMessage}`);

    // return

    if (!testMessage) return; // Don't send empty messages



    for (const { option, webview } of selectedOptions.values()) {

      const handler = SubmitHandlers[option.onSubmit];
      const listener = Options.find((op) => op.id == option.id);
      console.log(`Listener: ${listener}`);
      console.log(`Listener listening: ${listener.listening}`);

      if (handler && listener.listening) {
        handler(webview, testMessage);   // 🔥 pass the correct webview
      }
    }

    aiInput.value = ""
    // inputFunc();
    inputFunc();

  })


  let webviews = [];
  let dragState = {
    isActive: false,
    isDragging: false,
    dragger: null,
    leftWebview: null,
    rightWebview: null,
    startX: 0,
    leftStartWidth: 0,
    rightStartWidth: 0
  };

  let reorderState = {
    isDragging: false,
    draggedElement: null,
    draggedIndex: -1,
    placeholder: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    originalOrder: {}  // Track visual order with CSS order property
  };



  async function selectOption(optionId) {
    console.log(`CAME TO SELECT OPTION BLAB ABALBLABLABLAB`)
    if (selectedOptions.has(optionId)) return;

    const option = Options.find(opt => opt.id === optionId);
    if (!option) return;

    // ====================Starts here============================

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'webview-wrapper';
    wrapper.dataset.id = option.id;


    const style = document.createElement('style'); style.textContent = ` .webview-wrapper { transition: width 2s ease; } .webview-wrapper:hover { width: 50%; } `;
    // document.head.appendChild(style); 

    // Create the circular button
    const button = document.createElement('button');
    button.className = 'circular-button';
    button.id = `${option.id}-con-hide`;  // You can give it any ID
    // button.innerText = 'Click Me';  // Button text

    // Style the button to make it circular and position it at bottom right
    button.style.position = 'absolute';
    button.style.right = '1%';
    button.style.bottom = '1%';
    button.style.width = '25px';
    button.style.height = '25px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#ae61ed3b';
    button.style.border = '1px solid #ae61ed';
    button.style.color = 'white';
    // button.style.border = 'none';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.cursor = 'pointer';

    // Append the button to the wrapper
    wrapper.appendChild(button);





    // Create header
    const header = document.createElement('div');
    header.className = 'webview-header';
    header.innerHTML = `
            <button class="drag-handle">⋮⋮</button>
            <span class="url">${option.name}</span>
            <button id="${option.id}-reload" class="reload-btn listening-btn">
            reload
            </button>
            ${true ? `<button id="${option.id}-listening" class="listening-btn">listening</button>` : ''}
        `;

    lucide.createIcons();

    // ====================End here===============================

    const scrollbarCSS = `
        ::-webkit-scrollbar {
            width: 2px !important;
             height: 3px !important;  /* horizontal */
        }
        
        ::-webkit-scrollbar-track {
            background: transparent !important;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #ae61ed !important;
            border-radius: 2px !important;
        }
        
        * {
            scrollbar-width: 2px !important;
            scrollbar-color: #ae61ed !important;
        }
    `;


    function injectScrollbarStyles(webview) {
      webview.addEventListener('dom-ready', () => {
        webview.insertCSS(scrollbarCSS);
        // webview.insertCSS(outfitFontCSS);
        // if(option.id === 'claude'){
        // }
      });
    }


    const webview = document.createElement("webview");
    webview.id = option.id;
    webview.src = option.url;

    // attachOAuthInterceptor(webview, option.id);
    injectScrollbarStyles(webview);





    webview.setAttribute('useragent', UA);
    webview.setAttribute('partition', `persist:${option.id}`);
    webview.setAttribute('allowpopups', '');


    // await ipcRenderer.invoke('setup-session', option.id);


    wrapper.appendChild(header);
    wrapper.appendChild(webview);


    // let authIntercepted = false; // ✅ flag per webview

    // webview.addEventListener('will-navigate', (e) => {
    //   if (e.url.includes('accounts.google.com') || e.url.includes('auth0.com')) {
    //     if (!authIntercepted) {
    //       authIntercepted = true;
    //       ipcRenderer.invoke('open-google-auth', option.id);
    //     }
    //   }
    // });

    // webview.addEventListener('new-window', (e) => {
    //   if (e.url.includes('accounts.google.com') || e.url.includes('auth0.com')) {
    //     e.preventDefault();
    //     if (!authIntercepted) {
    //       authIntercepted = true;
    //       ipcRenderer.invoke('open-google-auth', option.id);
    //     }
    //   }
    // });





    // --------------


    // renderer.js - intercept Google login redirects in webviews
    webview.addEventListener('did-fail-load', (e) => {
      if (e.errorCode === -3) return; // ignore aborted navigations
    });

    webview.addEventListener('will-navigate', (e) => {
      if (e.url.includes('accounts.google.com')) {
        e.preventDefault(); // ✅ stop webview navigation
        ipcRenderer.invoke('open-google-auth', option.id);
      }
    });

    // ✅ Also catch new-window (popup) attempts
    webview.addEventListener('new-window', (e) => {
      if (e.url.includes('accounts.google.com')) {
        e.preventDefault();
        ipcRenderer.invoke('open-google-auth', option.id);
      }
    });

    // ✅ When auth done, reload the webview
    ipcRenderer.on('auth-complete', (event, tabId) => {
      if (tabId === option.id) {
        console.log(`[AUTH-COMPLETE] Reloading webview: ${tabId}`);
        webview.reload();
      }
    });

    //    // Reset flag when auth completes so user can log in again later
    // ipcRenderer.on('auth-complete', (event, tabId) => {
    //   if (tabId === option.id) {
    //     authIntercepted = false;
    //     webview.reload();
    //   }
    // });


    // Add drag handle functionality
    const dragHandle = header.querySelector('.drag-handle');
    dragHandle.addEventListener('pointerdown', (e) => startReorderDrag(e, wrapper));

    const reloadBtn = header.querySelector(`#${option.id}-reload`);
    reloadBtn.addEventListener('click', () => {
      reloadWebview(webview, option.url);
    });

    const listeningBtn = header.querySelector(`#${option.id}-listening`);
    listeningBtn.addEventListener('click', () => {
      if (option.listening) {
        option.listening = false;
        listeningBtn.textContent = `not listening`;
      } else {
        option.listening = true;
        listeningBtn.textContent = `listening`;
      }
    });



    if (true) {
      const dragger = createDragger();
      const draggerOrder = webviews.length * 2 - 1;  // Draggers have .5 order values
      dragger.style.order = draggerOrder;
      container.appendChild(dragger);
    }

    // Set initial order for this wrapper
    wrapper.style.order = webviews.length * 2;  // Wrappers: 0, 2, 4, 6, etc.
    container.appendChild(wrapper);

    // 🔥 ADD THIS - Push to webviews array
    webviews.push({
      id: option.id,
      element: wrapper,
      webview: webview,
      url: option.url
    });


    selectedOptions.set(optionId, { option, webview });

    // 🔥 Resolve handler dynamically
    const handler = WebviewReadyHandlers[option.onWebviewReady];
    if (handler) {
      handler(webview);
    }

    const toggleHandler = toggleInputs[option.onToggle]

    // Add a click event listener to the button
    button.addEventListener('click', function () {
      console.log(`${button.id} button clicked`);

      if (toggleHandler) {
        toggleHandler(webview);
        // console.log(`Toggled inputs for ${option.name}`);
        // console.log(`The webview is: ${JSON.stringify(webview,null,2)}`);
        // console.log(`The toggleHandler is: ${toggleHandler}`);
      }
      // toggleInputs.geminiInputToggle(webview);
    });

    option.added = true;

  }

  //socc
  selectOption("chatgpt");
  selectOption("gemini");
  // selectOption("claude");
  selectOption("copilot");
  selectOption("perplexity");
  selectOption("deepseek");
  // selectOption("v0");
  // selectOption("gcopilot");
  // selectOption("meta");
  // selectOption("grok");

  updateWebviewWidths();


  function startReorderDrag(e, wrapper) {
    console.log(`CAME IN START REORDER FUNCTION`);

    e.preventDefault();
    e.stopPropagation();

    const index = webviews.findIndex(w => w.element === wrapper);

    if (index === -1) {
      console.error('ERROR: Wrapper not found in webviews array!');
      return;
    }

    reorderState.isDragging = true;
    reorderState.draggedElement = wrapper;
    reorderState.draggedIndex = index;
    reorderState.pointerId = e.pointerId;

    const rect = wrapper.getBoundingClientRect();
    reorderState.offsetX = e.clientX - rect.left;
    reorderState.offsetY = e.clientY - rect.top;
    reorderState.startX = e.clientX;
    reorderState.startY = e.clientY;

    // Save current CSS order values for all wrappers
    reorderState.originalOrder = {};
    webviews.forEach((wv, idx) => {
      reorderState.originalOrder[wv.id] = parseInt(window.getComputedStyle(wv.element).order) || idx;
      wv.element.style.order = idx;  // Ensure explicit order
    });

    // Make wrapper draggable with fixed positioning (visual only)
    wrapper.classList.add('dragging-webview');
    wrapper.style.width = rect.width + 'px';
    wrapper.style.height = rect.height + 'px';
    wrapper.style.left = rect.left + 'px';
    wrapper.style.top = rect.top + 'px';
    wrapper.style.position = 'fixed';
    wrapper.style.zIndex = '9999';

    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    // Capture pointer events
    const dragHandle = e.target;
    dragHandle.setPointerCapture(e.pointerId);

    // Add listeners
    dragHandle.addEventListener('pointermove', onReorderDrag);
    dragHandle.addEventListener('pointerup', onReorderDragEnd);
    dragHandle.addEventListener('pointercancel', onReorderDragEnd);

    console.log('Started reordering webview - visual order will update via CSS order property');
  }
  function onReorderDrag(e) {
    if (!reorderState.isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    const wrapper = reorderState.draggedElement;

    // Move the visual representation (fixed element)
    wrapper.style.left = (e.clientX - reorderState.offsetX) + 'px';
    wrapper.style.top = (e.clientY - reorderState.offsetY) + 'px';

    // Find which wrapper the dragged item should swap with based on mouse position
    const draggedCenterX = e.clientX;

    webviews.forEach((wv, index) => {
      if (wv.element === wrapper) return;

      const box = wv.element.getBoundingClientRect();
      const centerX = box.left + box.width / 2;

      // If dragged item's center is beyond this wrapper's center, swap order
      if (draggedCenterX > centerX && reorderState.draggedIndex < index) {
        // Swap: move dragged earlier, move this one back
        wv.element.style.order = reorderState.draggedIndex;
        wrapper.style.order = index;
        reorderState.draggedIndex = index;
      } else if (draggedCenterX < centerX && reorderState.draggedIndex > index) {
        // Swap: move dragged later, move this one forward
        wv.element.style.order = reorderState.draggedIndex;
        wrapper.style.order = index;
        reorderState.draggedIndex = index;
      }
    });
  }

  function onReorderDragEnd(e) {
    if (!reorderState.isDragging) return;

    e.preventDefault();

    const wrapper = reorderState.draggedElement;
    const dragHandle = e.target;

    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Release pointer capture
    if (reorderState.pointerId !== undefined) {
      dragHandle.releasePointerCapture(reorderState.pointerId);
    }

    // Remove listeners from drag handle
    dragHandle.removeEventListener('pointermove', onReorderDrag);
    dragHandle.removeEventListener('pointerup', onReorderDragEnd);
    dragHandle.removeEventListener('pointercancel', onReorderDragEnd);

    // Clear visual dragging styles
    requestAnimationFrame(() => {
      wrapper.classList.remove('dragging-webview');
      wrapper.style.width = '';
      wrapper.style.height = '';
      wrapper.style.left = '';
      wrapper.style.top = '';
      wrapper.style.position = '';
      wrapper.style.zIndex = '';

      // Update webviews array order based on current CSS order values
      const orderedWebviews = [...webviews].sort((a, b) => {
        const orderA = parseInt(window.getComputedStyle(a.element).order) || webviews.indexOf(a);
        const orderB = parseInt(window.getComputedStyle(b.element).order) || webviews.indexOf(b);
        return orderA - orderB;
      });

      webviews = orderedWebviews;

      // Rebuild draggers to match new order
      rebuildDraggers();

      // Restore widths
      restoreWebviewWidths();
    });

    reorderState.isDragging = false;
    reorderState.draggedElement = null;
    reorderState.draggedIndex = -1;
    reorderState.placeholder = null;
    reorderState.pointerId = undefined;
    reorderState.originalOrder = {};

    console.log('Finished reordering webview');
  }



  // Save current widths before reordering
  // Restore widths after reordering
  function restoreWebviewWidths() {
    webviews.forEach(({ element }) => {
      if (element.dataset.savedWidth) {
        element.style.width = element.dataset.savedWidth;
        element.style.flexShrink = '0';
      }
    });
    console.log('Restored webview widths');
  }

  function rebuildDraggers() {
    // Remove all existing draggers
    const existingDraggers = container.querySelectorAll('.dragger');
    existingDraggers.forEach(d => d.remove());

    // Get wrappers sorted by their CSS order property
    const sortedWrappers = Array.from(container.children)
      .filter(child => child.classList.contains('webview-wrapper'))
      .sort((a, b) => {
        const orderA = parseInt(window.getComputedStyle(a).order) || 0;
        const orderB = parseInt(window.getComputedStyle(b).order) || 0;
        return orderA - orderB;
      });

    // Insert draggers between wrappers, each with an explicit order value
    for (let i = 0; i < sortedWrappers.length - 1; i++) {
      const dragger = createDragger();
      const orderValue = i + 0.5;  // Draggers go between integers: 0.5, 1.5, 2.5, etc.
      dragger.style.order = orderValue;
      sortedWrappers[i].insertAdjacentElement('afterend', dragger);
    }
  }



  function removeWebview(id) {
    if (webviews.length <= 2) {
      alert('Must have at least 2 webviews');
      return;
    }

    const index = webviews.findIndex(w => w.id === id);
    if (index === -1) return;

    const wrapper = webviews[index].element;

    // Remove dragger before or after
    const nextSibling = wrapper.nextElementSibling;
    const prevSibling = wrapper.previousElementSibling;

    if (nextSibling && nextSibling.classList.contains('dragger')) {
      nextSibling.remove();
    } else if (prevSibling && prevSibling.classList.contains('dragger')) {
      prevSibling.remove();
    }

    wrapper.remove();
    webviews.splice(index, 1);

    updateWebviewWidths();
    console.log('Removed webview:', id);
  }

  // ===== DRAGGER RESIZE FUNCTIONALITY =====

  function createDragger() {
    const dragger = document.createElement('div');
    dragger.className = 'dragger';

    // Use pointerdown to start dragging immediately
    dragger.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const leftWebview = dragger.previousElementSibling;
      const rightWebview = dragger.nextElementSibling;

      if (!leftWebview || !rightWebview) return;
      if (!leftWebview.classList.contains('webview-wrapper')) return;
      if (!rightWebview.classList.contains('webview-wrapper')) return;

      dragState.isDragging = true;
      dragState.pointerId = e.pointerId;
      dragState.dragger = dragger;
      dragState.leftWebview = leftWebview;
      dragState.rightWebview = rightWebview;
      dragState.startX = e.clientX;
      dragState.leftStartWidth = leftWebview.offsetWidth;
      dragState.rightStartWidth = rightWebview.offsetWidth;

      dragger.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      // Convert to pixel widths for precise control
      leftWebview.style.width = dragState.leftStartWidth + 'px';
      rightWebview.style.width = dragState.rightStartWidth + 'px';
      leftWebview.style.flexShrink = '0';
      rightWebview.style.flexShrink = '0';

      // Capture all pointer events
      dragger.setPointerCapture(e.pointerId);

      // Add listeners
      dragger.addEventListener('pointermove', onDraggerMove);
      dragger.addEventListener('pointerup', onDraggerUp);
      dragger.addEventListener('pointercancel', onDraggerUp);
    });

    return dragger;
  }

  function onDraggerMove(e) {
    if (!dragState.isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    const delta = e.clientX - dragState.startX;
    const newLeftWidth = dragState.leftStartWidth + delta;
    const newRightWidth = dragState.rightStartWidth - delta;

    // Minimum width constraint (200px)
    if (newLeftWidth < 200 || newRightWidth < 200) return;

    // Only affect adjacent webviews
    dragState.leftWebview.style.width = newLeftWidth + 'px';
    dragState.rightWebview.style.width = newRightWidth + 'px';
  }

  function onDraggerUp(e) {
    if (!dragState.isDragging) return;

    e.preventDefault();

    dragState.dragger.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Release pointer capture
    if (dragState.pointerId !== undefined) {
      dragState.dragger.releasePointerCapture(dragState.pointerId);
    }

    dragState.isDragging = false;

    // Remove listeners from dragger
    dragState.dragger.removeEventListener('pointermove', onDraggerMove);
    dragState.dragger.removeEventListener('pointerup', onDraggerUp);
    dragState.dragger.removeEventListener('pointercancel', onDraggerUp);

    // Clean up references
    dragState.dragger = null;
    dragState.leftWebview = null;
    dragState.rightWebview = null;
    dragState.pointerId = undefined;

    console.log('Dragging stopped');
  }

  function updateWebviewWidths() {
    const count = webviews.length;

    if (count === 0) return;

    // Reset all custom widths first and initialize order if not set
    webviews.forEach(({ element }, index) => {
      element.style.width = '';
      element.style.flexShrink = '';

      // Initialize order if not already set
      if (!element.style.order) {
        element.style.order = index * 2;  // Wrappers: 0, 2, 4, 6, etc.
      }
    });

    let width;
    if (count === 2) {
      width = '50%';
    } else {
      width = '45%';
    }

    webviews.forEach(({ element }) => {
      element.style.width = width;
      element.style.minWidth = count > 2 ? '100px' : '0';
    });
  }

});
