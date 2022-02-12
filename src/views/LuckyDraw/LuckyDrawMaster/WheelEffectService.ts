// Immediately invoked function expression
// to not pollute the global scope
export function drawWheel(
  setPreview: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSpinning: React.Dispatch<React.SetStateAction<boolean>>
) {
  const wheel = document.querySelector(".wheel") as HTMLImageElement;
  const startButton = document.querySelector(".button") as HTMLButtonElement;
  let deg = 0;
  // add audio
  const music = new Audio(require("../../../assets/audio/chiecnonkydieu.mp3"));
  startButton.addEventListener("click", () => {
    if (music.paused) {
    }
    // play audio
    music.play();
    // Disable button during spin
    startButton.style.pointerEvents = "none";
    // Calculate a new rotation between 5000 and 10 000
    deg = Math.floor(5000 + Math.random() * 5000);
    // Set the transition on the wheel
    wheel.style.transition = "all 10s ease-out";
    // Rotate the wheel
    wheel.style.transform = `rotate(${deg}deg)`;
    // Apply the blur
    wheel.classList.add("blur");
  });

  wheel.addEventListener("transitionend", () => {
    // Remove blur
    wheel.classList.remove("blur");
    // Enable button when spin is over
    startButton.style.pointerEvents = "auto";
    // Need to set transition to none as we want to rotate instantly
    wheel.style.transition = "none";
    // Calculate degree on a 360 degree basis to get the "natural" real rotation
    // Important because we want to start the next spin from that one
    // Use modulus to get the rest value from 360
    const actualDeg = deg % 360;
    // Set the real rotation instantly without animation
    wheel.style.transform = `rotate(${actualDeg}deg)`;

    // alert prize
    setPreview(true);
    // enable button
    setIsSpinning(false);
    // stop audio
    music.pause();
    music.currentTime = 0;
  });
}
