
const slateObject = {
  entityId: [],
  entityX: [],
  entityY: [],
  targetX: [],
  targetY: [],
  health: [],
};
const entity = {
  fishTank: document.querySelector("body"),
  sightRange: 500,
  spawnPoint: [200, 200],
  lastEntityId: 0,
  size: 30,
  movingSpeed: 1,
  baseHealth: 100,
  testDistance: 500,
  constructEntity: function () {
    const myEntity = document.createElement("div");
    myEntity.className = "entity";
    myEntity.classList.add("animate__animated");
    myEntity.classList.add("animate__bounceIn");
    myEntity.style.width = entity.size + "px";
    return myEntity;
  },
  spawnEntity: function () {
    const myEntity = entity.constructEntity();
    myEntity.style.top = entity.spawnPoint[0] + "px";
    myEntity.style.left = entity.spawnPoint[1] + "px";
    entity.lastEntityId++;
    myEntity.id = "entity" + entity.lastEntityId;
    // entity.selectDestination(entity.lastEntityId)
    entity.fishTank.appendChild(myEntity);
    slateObject.entityId.push(entity.lastEntityId);
    slateObject.entityX.push(entity.spawnPoint[0]);
    slateObject.entityY.push(entity.spawnPoint[1]);
    slateObject.targetX.push(entity.spawnPoint[0] + 300);
    slateObject.targetY.push(entity.spawnPoint[1] + 300);
    slateObject.health.push(entity.baseHealth);
  },
  selectDestination: function (entityId = 1) {
    const myEntity = document.querySelector("#entity" + entityId);
    // console.log(myEntity);
    const currentPosition = [
      parseInt(myEntity.style.left),
      parseInt(myEntity.style.top),
    ];
    const xMax = document.querySelector("body").offsetWidth - 50;
    const yMax = document.querySelector("body").offsetHeight - 50;
    // console.log(`X span ${xMax} \n Y span ${yMax}`);
    function getrandom(min, max) {
      return Math.random() * (max - min) + min;
    }
    const destination = [
      Math.round(
        getrandom(
          currentPosition[0] - entity.testDistance,
          currentPosition[0] + entity.testDistance
        )
      ),
      Math.round(
        getrandom(
          currentPosition[0] - entity.testDistance,
          currentPosition[0] + entity.testDistance
        )
      ),
    ];
    // On teste si c'est dans le fishTank
    if (
      destination[0] > 50 &&
      destination[0] < xMax &&
      destination[1] > 50 &&
      destination[1] < yMax
    ) {
      // console.log(destination);
      slateObject.targetX[entityId - 1] = destination[0];
      slateObject.targetY[entityId - 1] = destination[1];
    }
  },
  getDistance: function (x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;
    return Math.sqrt(x * x + y * y);
  },
  setAngle: (entityId = 1) => {
    const myEntity = document.querySelector("#entity" + entityId);
    const currentPosition = [
      parseInt(myEntity.style.left),
      parseInt(myEntity.style.top),
    ];
    const destination = [
      slateObject.targetX[entityId - 1],
      slateObject.targetY[entityId - 1],
    ];

    const angle = Math.round(
      (Math.atan(
        destination[1] - currentPosition[1],
        destination[0] - currentPosition[0]
      ) *
        180) /
        Math.PI
    );

    // myEntity.style.tranform = `rotate(${angle}deg)`;
    // myEntity.style.webkitTransform = `rotate(${angle}deg)`;
  },
  moveForward: (entityId = 1) => {
    const myEntity = document.querySelector("#entity" + entityId);
    const currentPosition = [
      parseInt(myEntity.style.left),
      parseInt(myEntity.style.top),
    ];
    const destination = [
      slateObject.targetX[entityId - 1],
      slateObject.targetY[entityId - 1],
    ];
    // const angle360 = X;
    if (currentPosition[0] < destination[0]) {
      myEntity.style.left = currentPosition[0] + entity.movingSpeed + "px";
    } else {
      myEntity.style.left = currentPosition[0] - entity.movingSpeed + "px";
    }
    if (currentPosition[1] < destination[1]) {
      myEntity.style.top = currentPosition[1] + entity.movingSpeed + "px";
    } else {
      myEntity.style.top = currentPosition[1] - entity.movingSpeed + "px";
    }
    // Update slateObject
    slateObject.entityX[entityId - 1] = currentPosition[0];
    slateObject.entityY[entityId - 1] = currentPosition[1];
    updateSlate();
    // entity.testFoodItemProximity(entityId);
  },
  regularSelectDestination: function () {
    window.setInterval(function () {
      const entities = document.querySelectorAll(".entity");
      for (i = 0; i < entities.length; i++) {
        const myEntityId = entities[i].id.replace("entity", "");
        const randomNumber = Math.round(Math.random() * 10);
        // console.log(randomNumber);
        if (randomNumber > 5) {
          entity.selectDestination(myEntityId);
        }
      }
    }, 1000);
  },
  healthDecay: function () {
    window.setInterval(function () {
      for (const myEntity in slateObject.entityId) {
        const avatarId = `#entity${parseInt(myEntity) + 1}`;
        // console.log(avatarId);
        const avatar = document.querySelector(avatarId);
        if (slateObject.health[myEntity] > 1) {
          slateObject.health[myEntity] += -1;
          // console.log(myEntity);
        } else if (slateObject.health[myEntity] === 1) {
          avatar.remove();
          slateObject.health[myEntity] = 0;
          console.log(avatarId + " deceased");
        }
      }
    }, 500);
  },
  testFoodItemProximity: function (entityId = 1) {


    console.log(`entity ${entityId} is testing`);
    const myEntity = document.querySelector("#entity" + entityId);
    const myHealth = slateObject.health[entityId - 1];
    const myPosition = [
      slateObject.entityX[entityId - 1],
      slateObject.entityY[entityId - 1],
    ];
    if (myHealth < entity.baseHealth * 0.9) {
      
      const foodItems = document.querySelectorAll(".foodItem:not(.eaten)");
      // console.log(foodItems);
      if (foodItems.length > 0) {
        for (const myFoodItem of foodItems){
          
          const position = myFoodItem.getBoundingClientRect();
          // const myFoodItemPosition = [
          //   position
          // ]
          if (entity.getDistance(myPosition[0], myPosition[1], position.left, position.top) < 100){
            // console.log(myFoodItem);
          myFoodItem.classList.add("eaten");
          slateObject.health[entityId - 1] += food.healthBenefit;
          }
        }
      }
    }

    // for (const myFoodItem in foodItems){

    //   const foodItemPosition = [
    //     window.getComputedStyle(myFoodItem).left,
    //     window.getComputedStyle(myFoodItem).top
    //   ];
    //   console.log(foodItemPosition);
    //   if (entity.getDistance(myPosition[0], myPosition[1],foodItemPosition[0], foodItemPosition [1]) < 200){

    //   }
    // };
  },
  // -----------------------------------------
  // INIT
  init: () => {
    entity.constructEntity();
    entity.spawnEntity();
    entity.selectDestination();
    entity.setAngle();
    entity.moveForward();
    entity.regularSelectDestination();
    entity.healthDecay();
    entity.testFoodItemProximity();
  },
};
entity.init();


const readmeWindow = {
  readmeFile:"README.md",
  createReadmeWindow: function(){
    const windowElement = document.createElement("section");
    windowElement.innerHTML = `<button>Readme</button><iframe src="${this.readmeFile}" id="readMeFrame"></iframe>`;
    // windowElement.setAttribute("src", this.readmeFile);
    windowElement.setAttribute("id", "readMeContainer");
    document.querySelector("body").appendChild(windowElement);
  },
  toggleWindow: function(){
    const toggler = document.querySelector("#readMeContainer button");
    toggler.addEventListener("click",() => {
      document.querySelector("#readMeContainer").classList.toggle("expanded");
    })
  },
  init: () => {
    readmeWindow.createReadmeWindow();
    readmeWindow.toggleWindow();
    // this.createReadmeWindow();
  }
}
readmeWindow.init();
const fastRepeatingActions = window.setInterval(function () {
  const entities = document.querySelectorAll(".entity");
  // console.log(entities);
  for (i = 0; i < entities.length; i++) {
    const myEntityId = entities[i].id.replace("entity", "");
    // console.log("myent :" + myEntityId);
    // console.log("id : " + myEntityId);
    entity.moveForward(myEntityId);
    entity.setAngle(myEntityId);
    entity.testFoodItemProximity(myEntityId);
  }
}, 50);

const food = {
  maxFoodItems: 33,
  healthBenefit : 50,
  foodItem: function () {
    const foodItem = document.createElement("div");
    foodItem.className = "foodItem";
    return foodItem;
  },
  foodCreate: function () {
    const xMax = document.querySelector("body").offsetWidth;
    const yMax = document.querySelector("body").offsetHeight;
    function getrandom(min, max) {
      return Math.random() * (max - min) + min;
    }

    for (i = 0; i < food.maxFoodItems; i++) {
      const foodPosition = [
        Math.round(getrandom(50, xMax - 50)),
        Math.round(getrandom(50, yMax - 50)),
      ];
      const foodItem = food.foodItem();
      foodItem.style.left = foodPosition[0] + "px";
      foodItem.style.top = foodPosition[1] + "px";
      document.querySelector("body").appendChild(foodItem);
    }
  },
  init: () => {
    food.foodCreate();
  },
};
food.init();

// Mise à jour des items la slate
function updateSlate() {
  const slate = document.querySelector("footer");
  if (slate) {
    document.querySelector("footer").innerHTML = "";
    for (const myEntity in slateObject.entityId) {
      const subslate = document.createElement("div");
      subslate.className = "subslate";
      for (const mykey in slateObject) {
        subslate.innerHTML += `<div><span>${mykey.replace(
          "entity",
          ""
        )}</span><span>${slateObject[mykey][myEntity]}</span></div>`;
      }
      slate.appendChild(subslate);
    }
  }
}
//   Création de la slate
const createSlate = () => {
  const slate = document.createElement("footer");
  document.querySelector("body").appendChild(slate);
  updateSlate();
};
createSlate();

// Generative Button
const createGenerativeButton = () => {
  const generativeButton = document.createElement("button");
  generativeButton.innerHTML = "Generate entity";
  generativeButton.id = "generativeButton";
  document.querySelector("body").appendChild(generativeButton);
};
createGenerativeButton();
const generativeButton = document.querySelector("#generativeButton");
generativeButton.addEventListener("click", function () {
  entity.spawnEntity();
  // alert("ok");
});
