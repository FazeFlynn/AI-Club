## ChatGpt
```js
//hide
document.querySelector('form[data-type="unified-composer"]')?.style.setProperty('display','none','important');

//set value
(() => {
  const editor = document.querySelector('#prompt-textarea.ProseMirror');
  if (!editor) return console.log("Editor not found");

  editor.focus();

  // Clear existing content
  editor.innerHTML = "";

  // Insert text properly as paragraph
  editor.innerHTML = "<p>This is a test prompt</p>";

  // Trigger React/ProseMirror update
  editor.dispatchEvent(new InputEvent("input", { bubbles: true }));

  console.log("Text inserted");
})();


//submit
document.querySelector('[data-testid="send-button"]')?.click();

```

## Gemini
```js
// hide
document.querySelector('input-container')?.style.setProperty('display','none','important');


// set value
(() => {
  const editor = document.querySelector('.ql-editor[contenteditable="true"]');
  if (!editor) return console.log("Editor not found");

  editor.focus();

  // Select all existing content
  const range = document.createRange();
  range.selectNodeContents(editor);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  // Replace instantly
  document.execCommand("insertText", false, "This is a test prompt");

  console.log("Text inserted safely");
})();


// submit
(() => {
  const btn = document.querySelector('button.send-button.submit[aria-label="Send message"]');
  if (!btn) return console.log("Send button not found");

  btn.click();
  console.log("Send button clicked");
})();

```

## Claude
```js
// hide
(() => {
  const container = document.querySelector('[data-chat-input-container="true"]');
  if (!container) return console.log("Container not found");

  container.style.display = "none";
  console.log("Container hidden");
})();


// set value
(() => {
  const editor = document.querySelector('[data-testid="chat-input"][contenteditable="true"]');
  if (!editor) return console.log("Editor not found");

  editor.focus();

  // Clear existing content properly
  document.execCommand('selectAll', false, null);
  document.execCommand('delete', false, null);

  // Insert text like a real user
  document.execCommand('insertText', false, 'This is a test prompt');

  console.log("Text inserted");
})();


// submit
document.querySelector('button[aria-label="Send message"]:not([disabled])')?.click();


```


## Copilot
- Hide input
```js

document.querySelector('[data-testid="composer-content"]')?.style.setProperty('display','none');


// set value
document.querySelector('[data-testid="composer-input"]')?.dispatchEvent(Object.assign(document.querySelector('[data-testid="composer-input"]').value = "this is a test prompt", new Event('input', { bubbles: true })));

//VM668:1 Uncaught TypeError: Failed to execute 'dispatchEvent' on 'EventTarget': parameter 1 is not of type 'Event'.

//press enter

(() => {
  const el = document.querySelector('[data-testid="composer-input"]');
  if (!el) return;

  // React-safe value setter
  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    "value"
  ).set;

  setter.call(el, "this is a test prompt");

  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.focus();

  // Simulate real Enter key press sequence
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
})();

```


## Perplexity

```js
// hide
document.querySelector('.erp-sidecar\\:fixed')?.style.setProperty('display','none');



//set value
(() => {
  const el = document.querySelector('#ask-input');
  if (!el) return;

  el.focus();

  // Clear existing content
  document.execCommand('selectAll', false, null);
  document.execCommand('delete', false, null);

  // Insert text like real user typing
  document.execCommand('insertText', false, 'this is a test prompt');
})();


//send button
document.querySelector('button[aria-label="Submit"]')?.click();


```

## Grok
```js
//hide
document.querySelector('div.relative.w-full.px-gutter')?.style.setProperty('display','none','important');


//set value
document.querySelector('.ProseMirror') && ((el=document.querySelector('.ProseMirror')).focus(),document.execCommand('selectAll'),document.execCommand('insertText',false,'this is a test prompt'));


//submit
document.querySelector('button[type="submit"][aria-label="Submit"]')?.click();

```

## github copilot
```js
// hide
document.querySelector('[class^="Layout-module__chatInputContainer__"]')?.style.setProperty('display','none','important');


// set value
(() => {
  const el = document.querySelector('#copilot-chat-textarea');
  if (!el) return;

  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value'
  ).set;

  setter.call(el, 'this is a test prompt');
  el.dispatchEvent(new Event('input', { bubbles: true }));
})();


//submit
document
  .querySelector('#copilot-chat-textarea')
  ?.closest('form')
  ?.querySelector('svg.octicon-paper-airplane')
  ?.closest('button')
  ?.click();

```


## v0
```js
// hide 1
document.querySelector('form[data-prompt-form="true"]')
  ?.style.setProperty('display','none','important');

// hide 2 (hides full)
document.querySelector('form[data-prompt-form="true"]')
  ?.closest('.relative.z-10.flex.w-full.flex-col')
  ?.style.setProperty('display','none','important');

// Set value
document.querySelector('[data-editor="true"] .ProseMirror') &&
((el=document.querySelector('[data-editor="true"] .ProseMirror')).focus(),
document.execCommand('selectAll'),
document.execCommand('insertText',false,'this is a test prompt'));


//submit
document.querySelector('[data-testid="prompt-form-send-button"]')?.click();

```

## Deepseek
```js
//hide
document
  .querySelector('textarea[placeholder="Message DeepSeek"]')
  ?.closest('div')
  ?.parentElement
  ?.parentElement
  ?.style.setProperty('display','none','important');

// set value
(() => {
  const el = document.querySelector('textarea[placeholder="Message DeepSeek"]');
  if (!el) return;

  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value'
  ).set;

  setter.call(el, 'this is a test prompt');
  el.dispatchEvent(new Event('input', { bubbles: true }));
})();


// submit
document
  .querySelector('svg path[d^="M8.3125 0.981587"]')
  ?.closest('[role="button"]')
  ?.click();

```

## Meta ai
```js
// hide
document
  .querySelector('[data-pagelet="KadabraPrivateComposer"]')
  ?.style.setProperty('display', 'none', 'important');


//set value
(() => {
  const editor = document.querySelector('[contenteditable="true"][role="textbox"]');
  if (!editor) return console.log("Editor not found");

  editor.focus();

  // Select all existing content
  document.execCommand("selectAll", false, null);

  // Replace instantly
  document.execCommand("insertText", false, "this is a test promt");

  // Trigger input event so React/Lexical updates state
  editor.dispatchEvent(new InputEvent("input", { bubbles: true }));

  console.log("Text inserted instantly");
})();


//submit
document.querySelector('[aria-label="Send"][role="button"]')?.click();

```

# Components

- Main Array
```js
const Options =
[
  {
    id: 'example1Id'
    name : 'Example1',
    url : 'example1.com',
    added: true,
    logo: 'logo path',
    functionsToExecuteWhenAdded: [function1, function2]
  },
  {
    id: 'example2Id'
    name : 'Example2',
    url : 'example2.com',
    added: false,
    logo: 'logo path',
    functionsToExecuteWhenAdded: [function3, function4, function5]
  }
]
```

- Current Array (Array (set - elements should not repeat) of selected (added) options dynamically)
```js
selectedOptions = 
[
  {
    id: 'example1Id'
    name : 'Example1',
    url : 'example1.com',
    added: true,
    logo: 'logo path',
    functionsToExecuteWhenAdded: [function1, function2]
  }
]

```




```js

const Options = [
  {
    id: 'example1Id',
    name: 'Example1',
    webview: example1Webview,
    functionToExecuteWhenWebViewIsReady: (
      async (webview) => {
        await waitForDomReady(webview);
        await webview.executeJavaScript(`
          console.log("Injected into Example1");
        `);
      }
    ),
    functionToInvokeWhenSubmitButtonIsClicked: (
      () => {
        console.log(`function invoked when submit button pressed`)
      }
    )
    
  }
];


this will be the Main Options what will be displayed to the users, when user selects any options then it will be added to the Selected map (avoid duplicates), and a webview will be created and then the function will be called that will execute the script as soon as DOM of that view

and when the submit button will be clicked then functionToInvokeWhenSubmitButtonIsClicked will be called for each selected OPtion in the map,

that is al i want, if you could suggest better approach than that then be my guest, make sure this should be done efficiently




