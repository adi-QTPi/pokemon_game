const api_url = 'https://pokeapi.co/api/v2/pokemon/';

//Elements/////////////////////////////
let left_half2 = document.getElementsByClassName('my-squad')[0];
let right_half2 = document.getElementsByClassName('opponent')[0];
///////////////////////////////////////

let selected_poke_obj_array = [];
let opp_poke_obj_array = [];

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
        let id = ((3*getRandomInt(50))+1);
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

window.onload = opp_page_render;

/////////////////

//UTILS/////////////////
function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
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
