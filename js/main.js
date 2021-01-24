const navicon = document.querySelector(".navicon");
const mobileNav = document.querySelector(".mobile-menu");
const logo = document.querySelector(".logo");
const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
const body = document.body;
const tabButtons = document.querySelectorAll(".tab-btn");
const tabSlider = document.querySelector(".tab-slider");
const accordionButtons = document.querySelectorAll(".accordion");
const submitBtn = document.querySelector("#submit");
const emailField = document.querySelector("#email");
const resultText = document.querySelector("#result");
const footerLogo = document.querySelector(".footer-logo");
const backTop = document.querySelector("#back-to-top");

navicon.addEventListener("click", toggleMobileNav)

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => moveSlider(btn));
});

accordionButtons.forEach(accordion => {
    accordion.addEventListener("click", e => {
        const clickedBtn = e.target;

        toggleAccordion(clickedBtn);
    })
})

function toggleMobileNav() {
    const naviconState = navicon.getAttribute("aria-expanded")

    if (naviconState == "false") {
        setAttrToTrue([navicon]);
        addActiveClass([logo, mobileNav, mobileNavOverlay]);
        disableScrolling();
    } else {
        setAttrToFalse([navicon]);
        removeActiveClass([logo, mobileNav, mobileNavOverlay]);
        enableScrolling();
    }
}

function setAttrToTrue(elem) {
    elem.forEach(el => el.setAttribute("aria-expanded", "true"))
}

function setAttrToFalse(elem) {
    elem.forEach(el => el.setAttribute("aria-expanded", "false"))
}

function addActiveClass(elem) {
    elem.forEach(el => el.classList.add("active"))
}

function removeActiveClass(elem) {
    elem.forEach(el => el.classList.remove("active"))
}

const disableScrolling = () => {
    body.style.height = 100 + "vh";
    body.style.overflowY = "hidden"
}

const enableScrolling = () => {
    body.style.height = "auto";
    body.style.overflowY = "auto";
}

function moveSlider(tabBtn) {
    const tabIndex = Array.from(tabButtons).indexOf(tabBtn);
    const tabWidth = 33.33;

    tabSlider.style.transform = "translateX(" + (tabIndex * -(tabWidth)) + "%)";

    updateTabState(tabBtn);
}

function updateTabState(currentBtn) {
    tabButtons.forEach(btn => btn.setAttribute("aria-selected", "false"));

    currentBtn.setAttribute("aria-selected", "true");
}

function toggleAccordion(selectedAccordion) {
    const content = selectedAccordion.nextElementSibling;
    const parentContainer = selectedAccordion.parentElement;

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        setAttrToFalse([parentContainer]);
    } else {
        //closes the unselected accordions
        accordionButtons.forEach(accordion => {
            const accordionBtn = accordion.firstElementChild;

            if (accordionBtn != selectedAccordion) {
                setAttrToFalse([accordion]);
                accordionBtn.nextElementSibling.style.maxHeight = null;
            }
        })

        content.style.maxHeight = content.scrollHeight + "px";
        setAttrToTrue([parentContainer]);
    }
}

emailField.addEventListener("input", () => {
    if (!emailField.value) {
        emailField.removeAttribute("aria-invalid");
        emailField.removeAttribute("aria-describedby");

        resultText.classList.remove("valid");
        resultText.classList.remove("error");
        resultText.textContent = "";
    }
})

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    if (emailField.value) {
        validateEmail(emailField.value);
    } else {
        showError("empty");
    }
});

function validateEmail(userEmail) {
    const emailPattern = /^([a-zA-Z]{1,})([\w \. \-]+)(\@[\w]{3,8})(\.[a-zA-Z]{2,4})(\.[a-zA-Z]{2,3})?$/;

    if (userEmail.match(emailPattern)) {
        showValid();
    } else {
        showError("invalid");
    }
}

function showError(err) {
    emailField.setAttribute("aria-invalid", "true");

    switch (err) {
        case "empty":
            emailField.setAttribute("aria-describedby", "result")
            resultText.textContent = "Please enter your email address";
            errorText();
            break;
        case "invalid":
            emailField.setAttribute("aria-describedby", "result")
            resultText.textContent = "Whoops, make sure it's an email";
            errorText();
            break;
    }

    function errorText() {
        resultText.classList.remove("valid");
        resultText.classList.add("error");
    }
}

function showValid() {
    emailField.setAttribute("aria-invalid", "false");
    emailField.setAttribute("aria-describedby", "result");

    resultText.classList.remove("error");
    resultText.classList.add("valid");

    resultText.textContent = "Valid email address";
}

footerLogo.addEventListener("click", e => {
    e.preventDefault();

    smoothScroll(".hero");
})

backTop.addEventListener("click", () => smoothScroll(".hero"));

function smoothScroll(target) {
    const targetSection = document.querySelector(target);
    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let startTime;


    function animation(currentTime) {
        if (startTime === undefined) startTime = currentTime;
        
        const timeElapsed = currentTime - startTime;
        let animate = ease(timeElapsed, startPosition, distance, duration);

        window.scrollTo(0, animate);
      
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    function ease(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

window.addEventListener("scroll", () => {
    if (window.pageYOffset > 800) {
        backTop.style.opacity = ".7";
    } else {
        backTop.style.opacity = "0";
    }
})