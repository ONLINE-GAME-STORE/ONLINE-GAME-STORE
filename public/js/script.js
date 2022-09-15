// document.addEventListener(
//   "DOMContentLoaded",
//   () => {
//     console.log("online-game-store JS imported successfully!");
//   },
//   false
// );


const starRating = document.querySelectorAll('.rating-stars')
for (let ratingBox of starRating) {
  let rating = ""
  for (i = 0; i < ratingBox.innerHTML; i++) {
    rating += "⭐️"
  }
  ratingBox.innerHTML = rating
}
console.log(starRating)