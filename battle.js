const session_string1 = sessionStorage.getItem('userPokeObjArray');
const  user_poke_obj_array = JSON.parse(session_string1);

const session_string2 = sessionStorage.getItem('oppPokeObjArray');
const  opp_poke_obj_array = JSON.parse(session_string2);

console.log(user_poke_obj_array);
console.log(opp_poke_obj_array);
//fetch poke-details//////////////////

const coeff_of_attack_dampness = 0.1;
sessionStorage.setItem('attack_dampness', JSON.stringify(coeff_of_attack_dampness));

const max_round = 6;
sessionStorage.setItem('max_round', JSON.stringify(max_round));

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
        let target_text = document.createElement('div');
        target_text.classList.add('battle-poke-card-text-flex');
        
        element.children[i].appendChild(target_text);
        target_text.innerText = obj_array[i]["name"];
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

// let num_user_win = num_round_record.user_win;
// let num_opp_win = num_round_record.opp_win;
// let num_total_round = num_round_record.total;

let round_history = [];

if(sessionStorage.getItem('round_history_from_battle2')){
    let intermediate = sessionStorage.getItem('round_history_from_battle2');
    round_history = JSON.parse(intermediate);
}

console.log(num_round_record);
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
    if((num_round_record.user_win+num_round_record.opp_win) === max_round){
        if(num_round_record.user_win > num_round_record.opp_win){
            alert('user has won the MATCH... Redirecting to home');
        }
        else if (num_round_record.user_win === num_round_record.opp_win){
            alert('the match is DRAW... Redirecting to home');
        }
        else{
            alert('opp has won the MATCH... Redirecting to home');
        }
        window.location.href = "index.html";
    }

    let round_num_user_win = document.getElementsByClassName('num-user-win')[0];
    let round_num_opp_win = document.getElementsByClassName('num-opp-win')[0];
    let round_num_total = document.getElementsByClassName('num-round-total')[0];

    round_num_user_win.innerText = num_round_record.user_win;
    round_num_opp_win.innerText = num_round_record.opp_win;
    round_num_total.innerText = `Rounds : ${num_round_record.user_win+num_round_record.opp_win}/${max_round}`;

    poke_card_init(left_battle_poke_list, user_poke_obj_array);
    poke_card_init(right_battle_poke_list, opp_poke_obj_array);

    // setTimeout(
    //     ()=>{
    //         if((num_round_record.user_win+num_round_record.opp_win) === max_round){
    //             if(num_round_record.user_win > num_round_record.opp_win){
    //                 alert('user has won the MATCH... Redirecting to home');
    //             }
    //             else if (num_round_record.user_win === num_round_record.opp_win){
    //                 alert('the match is DRAW... Redirecting to home');
    //             }
    //             else{
    //                 alert('opp has won the MATCH... Redirecting to home');
    //             }
    //             window.location.href = "index.html";
    //         }
    //     },0)
    

    round_history = battle_prep();
    
    // let lets_battle_button = document.getElementsByClassName('lets-battle-button-clickable')[0];
    // lets_battle_button.addEventListener('click', ()=>{

    //     window.location = "battle_page2.html";
    //     if (sessionStorage.getItem('round_history')) {
    //         sessionStorage.removeItem('round_history');
    //     }
    //     sessionStorage.setItem('round_history', JSON.stringify(round_history));
    // });
    // console.log(round_history); // this has no effect of the clicky things! :(
}

function battle_prep(){
    let new_obj = {}; //all 3 information about that round.

    //computer random opponent
    let isAllowed = false;
    let rand_num = -1;

    while(!isAllowed && round_history.length >=0){
        rand_num = getRandomInt0to5();
        if(round_history.length == 0)isAllowed = true;
        for(obj2 of round_history){
            if(opp_poke_obj_array[rand_num]["name"] === obj2.opp_poke){
                isAllowed = false;
                console.log("isallowed false"+rand_num);
                break;
            }
            else{
                isAllowed = true;
                console.log("isallowed true"+rand_num);
            }   
        }
    }

    let chosen_opp_name = opp_poke_obj_array[rand_num]["name"];
    new_obj["opp_poke"] = chosen_opp_name;

    let name = document.getElementsByClassName('name')[1];
    name.innerText = chosen_opp_name;

    let poke_img_el = document.getElementsByClassName('floater-opp-poke-img')[0];
    fetch_and_put_sprite(poke_img_el, chosen_opp_name, 'opp');

    fetch_and_put_hp(document.getElementsByClassName('hp')[1], chosen_opp_name);
    fetch_and_put_moves(document.getElementsByClassName('moves')[1], chosen_opp_name);

    round_history.push(new_obj);

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

                document.getElementsByClassName('lets-battle-button')[0].classList.add('lets-battle-button-clickable');
                let lets_battle_button = document.getElementsByClassName('lets-battle-button-clickable')[0];
                lets_battle_button.addEventListener('click', ()=>{

                    window.location = "battle_page2.html";
                    if (sessionStorage.getItem('round_history')) {
                        sessionStorage.removeItem('round_history');
                    }
                    sessionStorage.setItem('round_history', JSON.stringify(round_history));
                });

                let poke_img_el = document.getElementsByClassName('floater-user-poke-img')[0];
                fetch_and_put_sprite(poke_img_el, poke_name, 'user');

                fetch_and_put_hp(hp, poke_name);

                fetch_and_put_moves(moves_el,poke_name);

            }
        })
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

    let x = 0; let count = 0;
    while(true){
        let response2 = await fetch(data.moves[x].move.url);
        let data2 = await response2.json();

        let temp_move_name = data.moves[x].move.name;
        let temp_move_power = data2.power;
        if(temp_move_power){
            element.innerText += `\n${temp_move_name} (${temp_move_power*coeff_of_attack_dampness})`;
            count++;
        }
        if(count == 3)break;
        x++;
    }element.innerText += '...';
}

async function fetch_and_put_sprite(img_element, id, who){
    let response = await fetch(api_url+id);
    let data = await response.json();

    if(who == 'user'){
        if(data.sprites.other.showdown.back_default){
            img_url = data.sprites.other.showdown.back_default;
        } 
        else{
            img_url = data.sprites.back_default;
        }
    }
    else if(who == 'opp'){
        if(data.sprites.other.showdown.front_default){
            img_url = data.sprites.other.showdown.front_default;
        }  
        else{
            img_url = data.sprites.front_default;
        }     
    }
    img_element.src = img_url;
}


////////////////////////////////////
window.onload = page_render;


//Utils////////////////////////////

function getRandomInt0to5() {
    return Math.floor(Math.random() * 6);
}
  