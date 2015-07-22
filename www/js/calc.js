// Script written by @jroadev

function calculate(operation){
    var a = 300
    var b = 60
    var distance = document.calc.distance.value
    var timer = document.calc.timer.value
    var result = eval((distance*a) + (timer*b))
    document.calc.resultado.value = result
  }
