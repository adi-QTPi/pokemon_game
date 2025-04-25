const api_url = 'https://pokeapi.co/api/v2/pokemon/';

let user_difficulty_choice;
if(!sessionStorage.getItem('user_difficulty_choice')){
    user_difficulty_choice = "moderate";
}
else{
    user_difficulty_choice = sessionStorage.getItem('user_difficulty_choice');
}

let num_loop_repeat = sessionStorage.getItem('num_loop_repeat');

//Elements/////////////////////////////
let left_half2 = document.getElementsByClassName('my-squad')[0];
let right_half2 = document.getElementsByClassName('opponent')[0];
///////////////////////////////////////

let selected_poke_obj_array = [];
let opp_poke_obj_array = [];

// let difficulty = {
//     "easy" : {
//         "low" : 0 , "high" : num_loop_repeat/3
//     },

//     "moderate" : {
//         "low" : num_loop_repeat/3 , "high" : num_loop_repeat*(2/3)
//     },

//     "hard" : {
//         "low" : num_loop_repeat*(2/3), "high" : num_loop_repeat
//     }
// }


async function objectify(){
    const session_string = sessionStorage.getItem('pokeArray');
    const selected_poke_array = JSON.parse(session_string);

    for(n of selected_poke_array){
        let temp_res = await fetch(api_url+n);
        let data = await temp_res.json();
        let obj = {"id":data.id, "name":data.name, "img_url":data["sprites"]["front_default"], "dream_world_front_img_url":data['sprites']['other']["dream_world"]["front_default"] , "gif-front":data['sprites']['other']["dream_world"]["front_default"], "gif-back":data['sprites']['other']["showdown"]["back_default"]};

        //element creation and insertion
        let new_el = document.createElement('div');
        new_el.classList.add('opp-poke-card');

        let new_el_img = document.createElement('img'); 
        new_el_img.src = obj.img_url;
        new_el.appendChild(new_el_img); 

        let new_el_poke_name = document.createElement('p'); new_el_poke_name.classList.add('opp-poke-name');
        new_el_poke_name.innerText = obj.name;
        new_el.appendChild(new_el_poke_name); 

        left_half2.appendChild(new_el);
        //

        selected_poke_obj_array.push(obj);
        console.log(selected_poke_obj_array);
    }
}

async function opp_page_render(){
    info_button_init();
    
    let battle_button = document.getElementsByClassName('redirect-battle')[0];
    battle_button.addEventListener('click', ()=>{
        battle_button.setAttribute('href', 'battle_page.html');
    })

    objectify();
    opp_poke_obj_array = await random_opp_generator(opp_poke_obj_array);

    sessionStorage.setItem('userPokeObjArray', JSON.stringify(selected_poke_obj_array));
    sessionStorage.setItem('oppPokeObjArray', JSON.stringify(opp_poke_obj_array));
}

async function random_opp_generator(opp_poke_obj_array) {
    while (opp_poke_obj_array.length<6){
        let difficulty_offset_opp = sessionStorage.getItem('difficulty_offset_opp');
        let id = 3*parseInt(getRandomIntInclusiveExclusive(1,num_loop_repeat)+difficulty_offset_opp);
        console.log(id);
        console.log(difficulty_offset_opp);
        console.log(getRandomIntInclusiveExclusive(1,num_loop_repeat));
        if(!checkIfInArrayOfObjects(id, opp_poke_obj_array)){
            let response = await fetch (api_url+(id));
            let data = await response.json();
            let opp_poke_name = data.name;
            let opp_poke_img_url = data['sprites']['front_default'];
            let opp_poke_img_url2 = data['sprites']['other']["dream_world"]["front_default"];
            

            let poke_obj = {"id":id, "name":opp_poke_name, "img_url":opp_poke_img_url, "dream_world_front_img_url":opp_poke_img_url2, "gif-front":data['sprites']['other']["dream_world"]["front_default"], "gif-back":data['sprites']['other']["showdown"]["back_default"]};
            opp_poke_obj_array.push(poke_obj);

            let new_el = document.createElement('div');
            new_el.classList.add('opp-poke-card');

            let new_el_img = document.createElement('img'); 
            new_el_img.src = opp_poke_img_url;
            new_el.appendChild(new_el_img); 

            let new_el_poke_name = document.createElement('p'); new_el_poke_name.classList.add('opp-poke-name');
            new_el_poke_name.innerText = opp_poke_name;
            new_el.appendChild(new_el_poke_name); 

            right_half2.appendChild(new_el);

            console.log(new_el);
        }
    }    
    return opp_poke_obj_array;
}

/////////////////

function info_button_init(){
    let element = document.getElementsByClassName('info-button')[0];
    let popup = document.getElementsByClassName('info-popup-hidden')[0];

    popup.classList.add('info-popup-unleashed');

    element.addEventListener('click', ()=>{
        popup.classList.add('info-popup-unleashed');
    })

    let cross_button = document.getElementsByClassName('close-button')[0];
    cross_button.addEventListener('click', ()=>{
        popup.classList.remove('info-popup-unleashed');
    })
}

// info_button_init();
opp_page_render();
// window.onload = opp_page_render;

/////////////////

//UTILS/////////////////
function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}
function getRandomIntInclusiveExclusive(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function checkIfInArrayOfObjects(value, array){
    let arr2 = [];

    for(obj of array){
        arr2.push(obj.id);
    }

    if(arr2.indexOf(value) == -1){
        return false;
    }
    else{
        return true;
    }
}
