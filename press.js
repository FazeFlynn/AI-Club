
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();

    const sendButton = document.querySelector(
      'button.send-button[aria-label="Send message"]'
    );

    if (sendButton && sendButton.getAttribute("aria-disabled") !== "true") {
      sendButton.click();
    }
  }
});


const input = document.querySelector('[contenteditable="true"], textarea');

input?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    document.querySelector('button.send-button')?.click();
  }
});



// =====================================================================================

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault(); // optional: prevents newline if inside a textarea

    const sendButton = document.getElementById("composer-submit-button");
    if (sendButton) {
      sendButton.click();
    }
  }
});



document.querySelector("textarea").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    document.getElementById("composer-submit-button")?.click();
  }
});




// ==============================================================================

const textarea = document.querySelector("textarea");

if (textarea) {
  textarea.value = "bla bla bla";
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}


const input = document.querySelector('[contenteditable="true"]');

if (input) {
  input.focus();
  input.textContent = "bla bla bla";

  input.dispatchEvent(new InputEvent("input", {
    bubbles: true,
    inputType: "insertText",
    data: "bla bla bla"
  }));
}


document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();

    const input = document.querySelector('[contenteditable="true"], textarea');
    const button = document.querySelector('button.send-button');

    if (input && button) {
      // autofill
      if (input.isContentEditable) {
        input.textContent = "bla bla bla";
        input.dispatchEvent(new InputEvent("input", { bubbles: true }));
      } else {
        input.value = "bla bla bla";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }

      // send
      button.click();
    }
  }
});
