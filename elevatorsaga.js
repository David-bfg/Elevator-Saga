{
    init: function(elevators, floors) {
        var i = 0;
        var floorQueue = [];
        var activeFloorQueue = [];
        for(; i < elevators.length; i++){
          elevators[i].on("idle", function() {
              if (floorQueue.length!=0){
                  var floorNum = floorQueue.shift();
                  activeFloorQueue.push(floorNum);
                  this.goToFloor(floorNum);
              }else{
                  this.goToFloor(this.currentFloor());
              }
          });
        
          elevators[i].on("floor_button_pressed", function(floorNum) {
              var index = 0;
              for(; this.destinationQueue.length > index; index++){
                  if(this.destinationQueue[index] == floorNum){
                      return;
                  }
              }
              if(-1 == this.destinationQueue.indexOf(floorNum)){
                  this.goToFloor(floorNum);
              }
          });
            
          elevators[i].on("passing_floor", function(floorNum, direction) {
              if(this.destinationQueue[0] == floorNum){
                  return;
              }
              if(-1 != this.destinationQueue.indexOf(floorNum)){
                  var index = this.destinationQueue.indexOf(floorNum);
                  this.destinationQueue[index] = this.destinationQueue[index - 1];
                  this.goToFloor(floorNum,true);
              }
              
              var users = 0;
              for(var slot in this.userSlots){
                  if(this.userSlots[slot] != null){
                      users++;
                  }
              }
              if(this.maxPassengerCount() == users) {
                  return;
              }
              
              if(-1 != activeFloorQueue.indexOf(floorNum)) {
                  return;
              }
              if(direction == "up"){
                  var index = 0;
                  if(floors[floorNum].buttonStates.up == "activated"){
                      this.goToFloor(floorNum,true);
                      if(-1 != floorQueue.indexOf(floorNum)){
                          floorQueue.splice(floorQueue.indexOf(floorNum), 1);
                      }
                  }
              }else if (direction == "down"){
                  var index = 0;
                  if(floors[floorNum].buttonStates.down == "activated"){
                      this.goToFloor(floorNum,true);
                      if(-1 != floorQueue.indexOf(floorNum)){
                          floorQueue.splice(floorQueue.indexOf(floorNum), 1);
                      }
                  }
              }
          
          });
            
          elevators[i].on("stopped_at_floor", function(floorNum) {
              if(-1 != floorQueue.indexOf(floorNum)){
                  floorQueue.splice(floorQueue.indexOf(floorNum), 1);
              }
              if(-1 != activeFloorQueue.indexOf(floorNum)){
                  activeFloorQueue.splice(activeFloorQueue.indexOf(floorNum), 1);
              }
              if(this.destinationQueue[0]){
                  this.goingUpIndicator(floorNum <= this.destinationQueue[0]);
                  this.goingDownIndicator(this.destinationQueue[0] <= floorNum);
              }else{
                  this.goingUpIndicator(true);
                  this.goingDownIndicator(true);
              }
          });
        }
        
        var j = 0;
        for(; j < floors.length; j++){
          floors[j].on("up_button_pressed", function() {
              var floorNum = this.floorNum();
              if(-1 == floorQueue.indexOf(floorNum)){
                  floorQueue.push(floorNum);
              }
          });
          floors[j].on("down_button_pressed", function() {
              var floorNum = this.floorNum();
              if(-1 == floorQueue.indexOf(floorNum)){
                  floorQueue.push(floorNum);
              }
          });
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
