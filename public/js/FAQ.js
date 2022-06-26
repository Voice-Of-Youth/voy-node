const faqArray = [
    {
        id: "faq1",
        title: "How do i create an account?",
        tags: ["writers", "write", "how to"],
        count: 0,
        answer: "Because of our user-friendly website, creating an account is simple. Simply go to the top right corner of our website and click the sign up button, and our website will walk you through the rest of the procedure.",
    },
    {
        id: "faq2",
        title: "How can i be a writer?",
        tags: ["writers", "write", "how to"],
        count: 0,
        answer: "You can be a writer by signing up as a writer and then filling out the forms for verifying who you are, after the verification process you can write on this platform. you'll also get a certificate indicating you are a writer in this platform",
    },
    {
        id: "faq3",
        title: "Can i write explicit content? ",
        tags: ["writers", "write", "how to"],
        count: 0,
        answer: "It is advised that you write age-appropriate content, however because we have a filtering system in place, it will automatically filter out unnecessary and offensive language.",
    },
    {
        id: "faq4",
        title: "Can a writer also be a reader?",
        tags: ["writers", "write", "how to"],
        count: 0,
        answer: "A writer can, of course, be a reader. A writer has all of the same benefits as a reader, but with more. By heading to our writers website, He/she will be given further alternatives to modify/write content. ",
    },
    {
        id: "faq5",
        title: "Does everyone have access to every article? ",
        tags: ["writers", "write", "how to"],
        count: 0,
        answer: "Our articles are organized by age groups. As a result, an article written for an 18-year-old can only be read by those who are that age or older. The same is true for individuals of all ages.",
    }
]


    const FaqContainer = document.getElementById("faq-container");

    faqArray.forEach(faq => {
        const content = `
        <div class="faq">
            <div class="question">
                <h3>${faq.title}</h3>

                <svg width="15" height="10" viewBox="0 0 42 25">
                    <path 
                    d="M3 3L21 21L39 3" 
                    stroke="white" 
                    stroke-width="7" 
                    stroke-linecap="round"
                    />
                </svg>
            </div>
            <div class="answer">
                <p>${faq.answer}</p>
            </div>
        </div>`

        FaqContainer.innerHTML += content;
    })

const faqs = document.querySelectorAll(".faq");

faqs.forEach((faq) => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("active");
    });
});