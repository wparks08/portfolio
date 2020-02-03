var wow = new WOW();
wow.init();

var typedOptions = {
    strings: [
        "I am a Front-End De",
        "I am a Back-End Develo",
        "I am a Software Deve",
        "I am a Full-Stack Web Developer."
    ],
    typeSpeed: 80,
    backSpeed: 40,
    backDelay: 100,
    smartBackspace: true,
    startDelay: 2000
};

var typed = new Typed(".typed", typedOptions);
