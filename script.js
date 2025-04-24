console.log("dom loaded")
let ul = document.getElementById("foodlist")
let apikey = "a2ee3fce4780429da9916b51aeabc6c8"
let stepsUl = document.getElementById("steps")
let tagimg = document.getElementById("img")
let input = document.getElementById("input")
  async function search(food) {
    
    try {
        let response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${food}&apiKey=${apikey}`)
        if(!response.ok){
          if(response.status == 402){
            let li = document.createElement("li")
            li.textContent = "API limit reached. Try again later"
            ul.appendChild(li)
            return
          }
            console.log(` https error : ${ response.status}`)
            
        
        }
        let data = await response.json()
        console.log(data)
        
    if( data.results.length > 1){
      data.results.forEach(food  => {
        let li = document.createElement("li")
        ul.appendChild(li)
        li.textContent = food.title
        li.style.cursor = "pointer"
        li.addEventListener("click", async ()=> {
          ul.innerHTML = " "
          let clicked = data.results.find(f => f.title == food.title)
          if(clicked){
            console.log("valid food")
            let info = {
              id : clicked.id,
              image :clicked.image
            }
            let analyzedInstructions  = await steps(info)
            let display = await displayimg (analyzedInstructions)
          }
        })

      });
      
      }
      else if (data.results.length == 1) {
       let food =  data.results[0]
       let info = {
        id : food.id,
        image : food.image
       }
     let analyzedInstructions =   await steps(info)
       await displayimg(analyzedInstructions)
     }
      else{
        let li = document.createElement("li")
         li.textContent =  "Meal isn't available "
         ul.appendChild(li)
      }
      // catch
    } catch (error) {
      console.log(error)
      let li =  document.createElement("li")
      li.textContent = "Something went wrong. Check ur connection or try again later"
    }
  }
  
 async function steps(info) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${info.id}/analyzedInstructions?apiKey=${apikey}`);
        if(!response.ok){
            console.log(`https error : ${response.status}`)
        }
        let data = await response.json()
        console.log(data)
        console.log(data[0].steps)
        let steps = data[0].steps
        steps.forEach(step => {
          let li = document.createElement("li")
          li.textContent = step.step
          stepsUl.appendChild(li)
        });
        return info.image
    } catch (error) {
        console.log(error)
    }
 }
 async function displayimg(img) {
    tagimg.src = img
 }
 
 input.addEventListener("keydown", (e)=> {
  if(e.key == "Enter"){
    let food = input.value.trim()
    if (food === "") return
    input.value = ""
    ul.innerHTML = ""
    stepsUl.innerHTML = ""
    tagimg.src = ""
    search(food)
  }
})