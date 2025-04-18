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

function poke_card_init(element, obj_array){
    for(let i = 0; i<6; i++){
        let target = element.children[i].firstElementChild;
        target.src = obj_array[i]["dream_world_front_img_url"];
    }
} 

function page_render(){
    poke_card_init(left_battle_poke_list, user_poke_obj_array);
    poke_card_init(right_battle_poke_list, opp_poke_obj_array);
    battle_prep();
    console.log(round_history); // this has no effect of the clicky things! :(
}

let round_history = [
    {"user_poke" : "rattata" , "opp_poke" : "omaster" , "winner" : "rattata"} ,
    {"user_poke": "venomoth", "opp_poke": "omaster", "winner": "venomoth"}
];

function battle_prep(){
    let new_obj = {}; //all 3 information about that round.

    //computer random opponent
    let isAllowed = false;
    let rand_num ;

    while(!isAllowed){
        rand_num = getRandomInt0to5();
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

        for(obj2 of round_history){
            if(poke_name == obj2.user_poke){
                target_el.classList.add('used-battle-poke-card');
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
                curr_round_obj["winner"] = poke_name;
                // console.log(curr_round_obj);
                round_history.push(curr_round_obj);
                console.log(round_history);
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
}


////////////////////////////////////
window.onload = page_render;


//Utils////////////////////////////

function getRandomInt0to5() {
    return Math.floor(Math.random() * 6);
}
  