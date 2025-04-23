const api_url = 'https://pokeapi.co/api/v2/pokemon/';
const coeff_of_attack_dampness = 0.1;

//Imported data//////////////////

const session_string1 = sessionStorage.getItem('round_history');
const  round_history = JSON.parse(session_string1);

let curr_fight_record = round_history.pop();

// let curr_fight_record = {
//     "user_poke" : "4", 
//     "opp_poke" : "1" , 
//     "winner" : ""
// };

let num_round_record = {
    "user_win" : 3 ,
    "opp_win" : 1 ,
    
    get total(){return this.user_win + this.opp_win;}
};

let hp_obj = {
    //"user_hp" : , "opp_hp"
};

let user_move_info_lib = [];
let opp_move_info_lib = [];

let max_user_hp = 0; 
let max_opp_hp = 0; 

///////////////////////////////

document.getElementsByClassName('num-user-win')[0].innerText = num_round_record.user_win;
document.getElementsByClassName('num-opp-win')[0].innerText = num_round_record.opp_win;
document.getElementsByClassName('num-round')[0].innerText = `Round : ${num_round_record.total}/6`;

const floater_user_poke_hp = document.getElementsByClassName('floater-user-poke-hp')[0];
const floater_opp_poke_hp = document.getElementsByClassName('floater-opp-poke-hp')[0];
let floater_user_poke_img = document.getElementsByClassName('floater-user-poke-img')[0];
let floater_opp_poke_img = document.getElementsByClassName('floater-opp-poke-img')[0];
const match_description = document.getElementsByClassName('match-description')[0];
let left_battle_ability_list = document.getElementsByClassName('battle-ability-list')[0];
let right_battle_ability_list = document.getElementsByClassName('battle-ability-list')[1];

//fill the moves array for user

async function user_poke_ability_init(){
    
    let children = Array.from(left_battle_ability_list.children);

    //fetch user poke data
    let response = await fetch(api_url + curr_fight_record.user_poke);
    let data = await response.json();

    //fetch moves with non null power(damage)
    let offset_index = 0;

    for(let i = 0; i<(5+offset_index); i++){
        let current_card_el = children[i-offset_index]; current_card_el.style.fontSize = "0.5rem";
        let response2 = await fetch(data.moves[i].move.url);
        let data2 = await response2.json();

        if(data2.power == null){
            // console.log('gotcha ' + i);
            offset_index++;
        }
        else{
            let new_obj = {
                "move_id" : i,
                "move_name" : data2.name,
                "move_damage" : (data2.power*coeff_of_attack_dampness),
                "move_pp" : data2.pp,
                "move_flavor_text" : data2.flavor_text_entries[3].flavor_text
            }
            user_move_info_lib.push(new_obj);


            let new_el_movename = document.createElement('div');
            new_el_movename.classList.add('move-name');
            new_el_movename.innerText = `Move Name : ${new_obj.move_name}`;
    
            let new_el_damage = document.createElement('div');
            new_el_damage.classList.add('damage');
            new_el_damage.innerText = `Damage : ${new_obj.move_damage}`;
    
            let new_el_pp = document.createElement('div');
            new_el_pp.classList.add('pp');
            new_el_pp.innerText = `PP : ${new_obj.move_pp}`;
    
            current_card_el.append(new_el_movename, new_el_damage, new_el_pp);
        }
    }   

    hp_obj.user_hp = data.stats[0].base_stat; // inserted below
    max_user_hp = hp_obj.user_hp;
    floater_user_poke_hp.innerText = `User HP : ${hp_obj.user_hp}`;

    floater_user_poke_img.src = data["sprites"]["other"]["showdown"]["back_default"];

    let bottom_desc_user = document.getElementsByClassName('user-poke-details')[0];
    bottom_desc_user.innerText = data.name;

    return user_move_info_lib;
}

async function opp_poke_ability_init(){
    let children = Array.from(right_battle_ability_list.children);

    //fetch user poke data
    let response = await fetch(api_url + curr_fight_record.opp_poke);
    let data = await response.json();
    
    //fetch moves with non null power(damage)
    let offset_index = 0;

    for(let i = 0; i<(5+offset_index); i++){
        let current_card_el = children[i-offset_index]; current_card_el.style.fontSize = "0.5rem";
        let response2 = await fetch(data.moves[i].move.url);
        let data2 = await response2.json();

        if(data2.power == null){
            // console.log('gotcha ' + i);
            offset_index++;
        }
        else{
            let new_obj = {
                "move_id" : i,
                "move_name" : data2.name,
                "move_damage" : (data2.power*coeff_of_attack_dampness),
                "move_pp" : data2.pp,
                "move_flavor_text" : data2.flavor_text_entries[3].flavor_text
            }
            opp_move_info_lib.push(new_obj);

            let new_el_movename = document.createElement('div');
            new_el_movename.classList.add('move-name');
            new_el_movename.innerText = `Move Name : ${new_obj.move_name}`;
    
            let new_el_damage = document.createElement('div');
            new_el_damage.classList.add('damage');
            new_el_damage.innerText = `Damage : ${new_obj.move_damage}`;
    
            let new_el_pp = document.createElement('div');
            new_el_pp.classList.add('pp');
            new_el_pp.innerText = `PP : ${new_obj.move_pp}`;
    
            current_card_el.append(new_el_movename, new_el_damage, new_el_pp);
        }
    }

    hp_obj.opp_hp = data.stats[0].base_stat;// inserted in floater below
    max_opp_hp = hp_obj.opp_hp;
    floater_opp_poke_hp.innerText = `Opp HP : ${hp_obj.opp_hp} `;

    floater_opp_poke_img.src = data["sprites"]["other"]["showdown"]["front_default"];

    let bottom_desc_user = document.getElementsByClassName('opp-poke-details')[0];
    bottom_desc_user.innerText = data.name;

    return opp_move_info_lib;
}

function getRandomInteger() {
    return Math.floor(Math.random() * 5);
}

function battle_round(){
    //user choice
    let left_battle_ability_list = document.getElementsByClassName('battle-ability-list')[0];
    let children = Array.from(left_battle_ability_list.children);
    let isProcessing = false;
    for(let i = 0; i<5; i++){
        children[i].addEventListener('click', ()=>{
            if(isProcessing == true)return;

            for(obj of children){
                obj.classList.remove('poke-ability-card-selected');
            }
            children[i].classList.add('poke-ability-card-selected');

            let target_arr = children[i].lastElementChild;
            details_update(i, target_arr, floater_opp_poke_hp, match_description, user_move_info_lib, 'user-attack');

            //COMPUTER CHOICE/////////////////////
            isProcessing = true;
            setTimeout(()=>{
                console.log("attack in progress");

                let comp_choose_rand_num = getRandomInteger();
                let target_el = Array.from(right_battle_ability_list.children)[comp_choose_rand_num];
                target_el.classList.add('poke-ability-card-selected');
                details_update(comp_choose_rand_num, target_el.lastElementChild, floater_user_poke_hp, match_description, opp_move_info_lib, 'opp-attack');
                // isProcessing = false;
            }, 3000);
            

            setTimeout(()=>{
                for(let i = 0; i<5; i++){
                    let temp = Array.from(right_battle_ability_list.children)[i];
                    temp.classList.remove('poke-ability-card-selected');
                }
                for(obj of children){
                    obj.classList.remove('poke-ability-card-selected');
                }
                isProcessing = false;
            }, 6000);
            
        })
    }
}

function details_update(num, pp_element, hp_element, description_element, library, who_attack){

    if(who_attack == 'user-attack'){
        let x = hp_obj.opp_hp;
        x -= library[num].move_damage;
        hp_obj.opp_hp = x;
        if(hp_obj.opp_hp <= 0 ){
            hp_element.innerText = `Opp HP : ${hp_obj.opp_hp}/${max_opp_hp}`;
            alert('user won!');
            curr_fight_record.winner = "user";
            num_round_record.user_win += 1;
            
            round_history.push(curr_fight_record);
            sessionStorage.setItem('round_history_from_battle2', JSON.stringify(round_history));
            window.location = "battle_page.html";

            return;
        }
        hp_element.innerText = `Opp HP : ${hp_obj.opp_hp}/${max_opp_hp}`;
    }

    else if(who_attack == 'opp-attack'){
        let x = hp_obj.user_hp;
        x -= library[num].move_damage;
        hp_obj.user_hp = x;
        if(hp_obj.user_hp <= 0){
            hp_element.innerText = `User HP : ${hp_obj.user_hp}/${max_user_hp}`;
            alert('opp won!');
            curr_fight_record.winner = "opp";
            num_round_record.opp_win += 1;

            round_history.push(curr_fight_record);
            sessionStorage.setItem('round_history_from_battle2', JSON.stringify(round_history));
            window.location = "battle_page.html";

            return;
        }
        hp_element.innerText = `User HP : ${hp_obj.user_hp}/${max_user_hp}`;
    }

    let y = library[num].move_pp;
    y -= 1;
    library[num].move_pp = y;
    pp_element.innerText = `PP : ${library[num].move_pp}`;
    description_element.innerText = `${library[num].move_flavor_text}`;
}


//Main EXECution////////////////////

async function page_render(){
    user_move_info_lib = await user_poke_ability_init();
    // console.log(user_move_info_lib);

    opp_move_info_lib = await opp_poke_ability_init();
    // console.log(opp_move_info_lib);

    battle_round();
}
page_render();