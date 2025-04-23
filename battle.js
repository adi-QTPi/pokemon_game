const session_string1 = sessionStorage.getItem('userPokeObjArray');
const  user_poke_obj_array = JSON.parse(session_string1);

const session_string2 = sessionStorage.getItem('oppPokeObjArray');
const  opp_poke_obj_array = JSON.parse(session_string2);

console.log(user_poke_obj_array);
console.log(opp_poke_obj_array);
//fetch poke-details//////////////////

//ELEMENTS////////////////////////////
const left_battle_poke_list = document.getElementsByClassName('left-battle-poke-list')[0];
const left_battle_poke_card = document.getElementsByClassName('left-battle-poke-card');

const right_battle_poke_list = document.getElementsByClassName('right-battle-poke-list')[0];
const right_battle_poke_card = document.getElementsByClassName('right-battle-poke-card');
//////////////////////////////////////

let api_url = 'https://pokeapi.co/api/v2/pokemon/';

function poke_card_init(element, obj_array){
    for(let i = 0; i<6; i++){
        let target = element.children[i].firstElementChild;
        if(obj_array[i].length == 4){
            target.src = obj_array[i]["dream_world_front_img_url"];
        }
        else{
            target.src = obj_array[i]["img_url"];
        }
    }
} 

let num_round_record = {
    "user_win" : 0 ,
    "opp_win" : 0 ,
    
    get total(){return this.user_win + this.opp_win;}
}

if(sessionStorage.getItem('num_round_record_from_battle2')){
    let intermediate = sessionStorage.getItem('num_round_record_from_battle2');
    num_round_record = JSON.parse(intermediate);
}

let num_user_win = num_round_record.user_win;
let num_opp_win = num_round_record.opp_win;
let num_total_round = num_round_record.total;

let round_history = [];

if(sessionStorage.getItem('round_history_from_battle2')){
    let intermediate = sessionStorage.getItem('round_history_from_battle2');
    round_history = JSON.parse(intermediate);
}

console.log(round_history);

// if(sessionStorage.getItem('round_history_from_battle2')){
//     round_history = sessionStorage.getItem('round_history_from_battle2');
// }
// else{
//     round_history =[];
// }

// let round_history = [
//     // {"user_poke" : "charmander" , "opp_poke" : "wigglytuff" , "winner" : "charmander"} ,
// ];

function page_render(){
    let round_num_user_win = document.getElementsByClassName('num-user-win')[0];
    let round_num_opp_win = document.getElementsByClassName('num-opp-win')[0];
    let round_num_total = document.getElementsByClassName('num-round-total')[0];

    round_num_user_win.innerText = num_user_win;
    round_num_opp_win.innerText = num_opp_win;
    round_num_total.innerText = `Rounds : ${num_total_round}/6`;

    poke_card_init(left_battle_poke_list, user_poke_obj_array);
    poke_card_init(right_battle_poke_list, opp_poke_obj_array);
    round_history = battle_prep();
    
    let lets_battle_button = document.getElementsByClassName('lets-battle-button')[0];
    lets_battle_button.addEventListener('click', ()=>{

        window.location = "battle_page2.html";
        if (sessionStorage.getItem('round_history')) {
            sessionStorage.removeItem('round_history');
        }
        sessionStorage.setItem('round_history', JSON.stringify(round_history));
    });
    // console.log(round_history); // this has no effect of the clicky things! :(
}

function battle_prep(){
    let new_obj = {}; //all 3 information about that round.

    //computer random opponent
    let isAllowed = false;
    let rand_num = 0;

    while(!isAllowed && round_history.length >=0){
        rand_num = getRandomInt0to5();
        if(round_history.length == 0)isAllowed = true;
        for(obj2 of round_history){
            if(opp_poke_obj_array[rand_num]["name"] == obj2.opp_poke){
                isAllowed = false;
                console.log("isallowed false"+rand_num);
            }
            else{
                isAllowed = true;
                console.log("isallowed true"+rand_num);
            }   
        }
    }
    let chosen_opp_name = opp_poke_obj_array[rand_num]["name"];
    new_obj["opp_poke"] = chosen_opp_name;

    round_history.push(new_obj);

    //user's choices

    for(obj of user_poke_obj_array){
        let poke_name = obj.name;
        let array_index = user_poke_obj_array.indexOf(obj);
        let target_el = left_battle_poke_list.children[array_index];

        if(round_history.length != 0){
            for(obj2 of round_history){
                if(poke_name == obj2.user_poke){
                    target_el.classList.add('used-battle-poke-card');
                }
            }
        }

        target_el.addEventListener('click',()=>{
            if(!target_el.classList.contains('used-battle-poke-card')){
                for(divs of left_battle_poke_list.children){
                    divs.classList.remove('current-use-battle-poke-card');
                }
                target_el.classList.add('current-use-battle-poke-card');

                let curr_round_obj = round_history.pop();

                curr_round_obj["user_poke"] = poke_name;

                // curr_round_obj["winner"] = poke_name;


                // console.log(curr_round_obj);
                round_history.push(curr_round_obj);
                console.log(round_history);

                let name = document.getElementsByClassName('name')[0];
                let hp = document.getElementsByClassName('hp')[0];
                let moves_el = document.getElementsByClassName('moves')[0];
                name.innerText = curr_round_obj["user_poke"];


                fetch_and_put_hp(hp, poke_name);

                fetch_and_put_moves(moves_el,poke_name);

            }
        })
    }  
    
    let target_el2 = Array.from(right_battle_poke_list.children);
    for(element of target_el2){
        let num = target_el2.indexOf(element);
        let poke_name_in_target_el2 = opp_poke_obj_array[num].name;
        for(let i = 0; i<round_history.length; i++){
            if(round_history[i].opp_poke == poke_name_in_target_el2){
                element.classList.add('used-battle-poke-card');
            }
        }
        if(round_history[round_history.length-1].opp_poke == poke_name_in_target_el2){
            element.classList.add('current-use-battle-poke-card');
        }
    }

    return round_history;
}


async function fetch_and_put_hp(element, id){
    element.innerText = 'HP : '
    let response = await fetch(api_url+id);
    let data = await response.json();
    let base_hp = data.stats[0].base_stat;

    element.innerText += `${base_hp}`;
    // console.log(base_hp);
}

async function fetch_and_put_moves(element, id){
    element.innerText = `Attacks :`;

    let response = await fetch(api_url+id);
    let data = await response.json();

    for(let i = 0; i<3; i++){
        let temp_move_name = data.moves[i].move.name;
        element.innerText += `${temp_move_name}_`;
    }

    // console.log("armada");
    // console.log(data2);
}


////////////////////////////////////
window.onload = page_render;


//Utils////////////////////////////

function getRandomInt0to5() {
    return Math.floor(Math.random() * 6);
}
  