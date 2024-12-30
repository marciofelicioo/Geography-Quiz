let countries = [];
let currentCountryIndex = 0;
let score = 0;

const flagElement = document.getElementById("flag");
const optionsContainer = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score");
const counterElement = document.getElementById("counter");
const countryNameElement = document.getElementById("country-name");

async function loadCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        countries = data
            .map((country) => ({
                name: country.name?.common || "Unknown",
                capital: country.capital ? country.capital[0] : "No capital",
                flag: country.flags?.svg || ""
            }))
            .filter((country) => country.capital !== "No capital" && country.flag);
        shuffleArray(countries);
        loadCountry();
    } catch (error) {
        console.error("Failed to load countries:", error);
        feedbackElement.textContent = "Error loading country data. Please try again later or refresh the page.";
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadCountry() {
    if (currentCountryIndex < countries.length) {
        const currentCountry = countries[currentCountryIndex];
        flagElement.src = currentCountry.flag;
        countryNameElement.textContent = currentCountry.name;
        feedbackElement.textContent = "";
        generateOptions(currentCountry.capital);
        scoreElement.textContent = `Score: ${score}`;
        counterElement.textContent = `Question ${currentCountryIndex + 1} / ${countries.length}`;
    } else {
        feedbackElement.textContent = "Congratulations! You completed the game!";
        scoreElement.textContent = `Final Score: ${score} / ${countries.length}`;
        counterElement.textContent = "";
        optionsContainer.innerHTML = "";
    }
}

function generateOptions(correctCapital) {
    optionsContainer.innerHTML = "";

    const incorrectCapitals = countries
        .filter((country) => country.capital !== correctCapital)
        .map((country) => country.capital);
    shuffleArray(incorrectCapitals);
    const selectedIncorrect = incorrectCapitals.slice(0, 3);
    const options = [correctCapital, ...selectedIncorrect];
    shuffleArray(options);

    options.forEach((capital) => {
        const button = document.createElement("button");
        button.textContent = capital;
        button.classList.add("option-button"); 
        button.addEventListener("click", (event) => handleAnswer(event, capital, correctCapital));
        optionsContainer.appendChild(button);
    });
}

function handleAnswer(event, selectedCapital, correctCapital) {
    const button = event.target;
    button.blur();

    if (selectedCapital === correctCapital) {
        feedbackElement.textContent = "Correct!";
        score++;
    } else {
        feedbackElement.textContent = `Incorrect! The correct answer is ${correctCapital}.`;
    }
    currentCountryIndex++;
    setTimeout(() => {
        loadCountry();
        removeActiveStates();
    }, 2000);
}

function removeActiveStates() {
    const buttons = optionsContainer.querySelectorAll("button");
    buttons.forEach((button) => {
        button.classList.remove("active");
    });
    if (document.activeElement) {
        document.activeElement.blur();
    }
}

loadCountries();
