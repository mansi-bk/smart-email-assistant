console.log("Content script loaded");

function findComposeToolbar() {
    const selectors=[
        '.aDh', // Gmail compose toolbar
        '.btC', // Gmail reply toolbar
        '[role="toolbar"]', // Gmail compose toolbar in dialog
        '.gU.Up'
    ];
    for(const selector of selectors){
        const toolbar=document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }
        return null;
    }
}

function createButton() {
    const button=document.createElement('div');
    button.className='T-I J-J5-Ji ao0 v7 T-I-atl L3';
    button.style.marginLeft='8px';
    button.innerHTML='AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI Reply');
    return button;

}

function getEmailContent() {
    const selectors=[
        '.h7', 
        '.a3s.aiL', // Gmail reply toolbar
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for(const selector of selectors){
        const content=document.querySelector(selector);
        if(content){
            return content.innerText.trim();
        }
        return '';
    }
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar=findComposeToolbar();
    if (!toolbar) {
        console.log("toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");
    const button=createButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {

        try {
            button.innerHTML='Generating...';
            button.disabled=true;

            const emailContent=getEmailContent();
            const response=await fetch('http://localhost:8080/api/email/generate', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        emailContent:emailContent,
                        tone: "professional"
                }
                )
            });

            if (!response.ok) {
                throw new Error(`API failed`);

            }
            const generatedReply=await response.text();
            const composeBox=document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error("Compose box not found");
            }
        }catch (error) {
            console.error(error);
            alert("Failed to generate AI reply. Please try again.");
        } finally{
            button.innerHTML='AI Reply';
            button.disabled=false;
        }

    });

    toolbar.insertBefore(button, toolbar.firstChild);

}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposedElement = addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh,.btC,[role="dialog"] ')|| node.querySelector('.aDh,.btC,[role="dialog"]'))

        );

        if(hasComposedElement) {
            console.log("Compose window detected");
            setTimeout(injectButton, 500);
    
        }
    }
});

observer.observe(document.body, { 
    childList: true,
     subtree: true
     })