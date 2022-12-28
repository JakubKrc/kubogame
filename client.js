const button1 = document.querySelector('#b1');

button1.addEventListener('click', e => {

    fetch('http://127.0.0.1:3000/sendLevelData', {
        method: 'POST',
        body: JSON.stringify( { "Objects": JSON.stringify(obj), "Events": JSON.stringify(eventList) } ), //vlastne je to JSON, ktory obsahuje dva stringy, co su JSON
        headers: {                      //irituje ma, ze samotny zostringifajovany json ako string to proste neposle
          'Content-Type': 'application/json'
        }
    })
    .then(res => res)
    .catch(err => console.log(err))

    console.log("savujem level");
});

function getData(){     //???neviem preco to robi co to robi, okopcene z webu a asi nie dobra prax. chcel som dostat data von z tych async funkcii. 
    return new Promise((resolve, reject) => {//neviem ci nebude treba cely ten program dako integrovat do tych funkcii skor, ako to tlait do globalnych premennych
        fetch("http://127.0.0.1:3000/getLevelData")
            .then( res => res.json() )
            .then( data => { 
                resolve(data)
            })
            .catch(err => console.log( err))
    })
}

const button2 = document.querySelector('#b2');
button2.addEventListener('click', e => {

    getData().then (data => {
        loadedLevel = JSON.parse(data[0].Objects);    //juhu data su vonku z funkcie! dlho mi trvalo
        loadedEvents = JSON.parse(data[0].Events)
    });
    console.log("loadujem level");
    
});

const button3 = document.querySelector('#b3');
button3.addEventListener('click', e => {

    mainInterval = false;

    console.log(loadedEvents);

    obj = [];
    for(let i in loadedLevel){
        eventList = loadedEvents;
        obj[i] = eval('new ' + loadedLevel[i].type + `()`);   //zasa zly eval. ako inac dynamicky menit vytvaranie classov? da sa to cez if, ale to je hluuuuupe. a aj tak mi zostane eval v eventoch
        for (let variables in loadedLevel[i])
            obj[i][variables] = loadedLevel[i][variables];
    }

    camera.x = obj[selectedObject].x - canvas.width/2;
    camera.y = obj[selectedObject].y - canvas.height/2;
    camera.moveXspeed = 0;
    camera.moveYspeed = 0;

    mainInterval = true;

});

let loadedLevel=null;   //hm, preco definujem premenne na konci kodu? 
let loadedEvents=null;