const api_url = 'https://pokeapi.co/api/v2/pokemon/';

const session_string3 = sessionStorage.getItem('attack_dampness');
const coeff_of_attack_dampness = JSON.parse(session_string3);

const session_string4 = sessionStorage.getItem('max_round');
const max_round = JSON.parse(session_string4);

//Imported data//////////////////

const session_string1 = sessionStorage.getItem('round_history');
const round_history = JSON.parse(session_string1);

const per_move_gap_time = 1500; //in ms

let curr_fight_record = round_history.pop();

// let curr_fight_record = {
//     "user_poke" : "4", 
//     "opp_poke" : "1" , 
//     "winner" : ""
// };

// let num_round_record = {
//     "user_win" : 3 ,
//     "opp_win" : 1 ,
    
//     get total(){return this.user_win + this.opp_win;}
// };

let num_round_record = {};

if(sessionStorage.getItem('num_round_record_from_battle2')){
    let intermediate = sessionStorage.getItem('num_round_record_from_battle2');
    num_round_record = JSON.parse(intermediate);
}
else{
    num_round_record = {'user_win':0, 
        'opp_win':0, 
        get total(){return this.user_win + this.opp_win;}}
}

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
document.getElementsByClassName('num-round')[0].innerText = `Round : ${num_round_record.user_win+ num_round_record.opp_win}/${max_round}`;

const floater_user_poke_hp = document.getElementsByClassName('floater-user-poke-hp')[0];
const floater_opp_poke_hp = document.getElementsByClassName('floater-opp-poke-hp')[0];
let floater_user_poke_img = document.getElementsByClassName('floater-user-poke-img')[0];
let floater_opp_poke_img = document.getElementsByClassName('floater-opp-poke-img')[0];
const bottom_user_poke_name = document.getElementsByClassName('user-poke-details')[0];
const bottom_opp_poke_name = document.getElementsByClassName('opp-poke-details')[0];
const match_description_p = document.getElementsByClassName('match-description')[0].lastElementChild;
const attack_who_to_who = document.getElementsByClassName('attack-who-to-who')[0];
let left_battle_ability_list = document.getElementsByClassName('battle-ability-list')[0];
let right_battle_ability_list = document.getElementsByClassName('battle-ability-list')[1];

//fill the moves array for user


async function user_poke_ability_init() {
    let children = Array.from(left_battle_ability_list.children);
    let response = await fetch(api_url + curr_fight_record.user_poke);
    let data = await response.json();

    let moveCount = 0;
    let moveIndex = 0;

    while (moveCount < 5 && moveIndex < data.moves.length) {
        const moveData = data.moves[moveIndex];
        moveIndex++;

        if (!moveData.move) continue;
        else if(!moveData.move.url) continue;

        let response2 = await fetch(moveData.move.url);
        let data2 = await response2.json();

        if (data2.power == null) continue;

        let new_obj = {
            "move_id": moveIndex - 1,
            "move_name": data2.name,
            "move_damage": (data2.power * coeff_of_attack_dampness),
            "move_pp": data2.pp,
            "move_flavor_text": data2.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text || 'No flavor text'
        };

        user_move_info_lib.push(new_obj);

        let current_card_el = children[moveCount];
        current_card_el.style.fontSize = "0.5rem";

        let new_el_movename = document.createElement('div');
        new_el_movename.classList.add('move-name');
        new_el_movename.innerText = `Move Name: ${new_obj.move_name}`;

        let new_el_damage = document.createElement('div');
        new_el_damage.classList.add('damage');
        new_el_damage.innerText = `Damage: ${new_obj.move_damage}`;

        let new_el_pp = document.createElement('div');
        new_el_pp.classList.add('pp');
        new_el_pp.innerText = `PP: ${new_obj.move_pp}`;

        current_card_el.append(new_el_movename, new_el_damage, new_el_pp);

        moveCount++;
    }

    hp_obj.user_hp = data.stats[0].base_stat;
    max_user_hp = hp_obj.user_hp;
    floater_user_poke_hp.innerText = `User HP: ${hp_obj.user_hp}`;
    floater_user_poke_img.src = data["sprites"]["other"]["showdown"]["back_default"];
    document.getElementsByClassName('user-poke-details')[0].innerText = data.name;

    return user_move_info_lib;
}

async function opp_poke_ability_init() {
    let children = Array.from(right_battle_ability_list.children);
    let response = await fetch(api_url + curr_fight_record.opp_poke);
    let data = await response.json();

    let moveCount = 0;
    let moveIndex = 0;

    while (moveCount < 5 && moveIndex < data.moves.length) {
        const moveData = data.moves[moveIndex];
        moveIndex++;

        if (!moveData.move) continue;
        else if(!moveData.move.url) continue;

        let response2 = await fetch(moveData.move.url);
        let data2 = await response2.json();

        if (data2.power == null) continue;

        let new_obj = {
            "move_id": moveIndex - 1,
            "move_name": data2.name,
            "move_damage": (data2.power * coeff_of_attack_dampness),
            "move_pp": data2.pp,
            "move_flavor_text": data2.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text || 'No flavor text'
        };

        opp_move_info_lib.push(new_obj);

        let current_card_el = children[moveCount];
        current_card_el.style.fontSize = "0.5rem";

        let new_el_movename = document.createElement('div');
        new_el_movename.classList.add('move-name');
        new_el_movename.innerText = `Move Name: ${new_obj.move_name}`;

        let new_el_damage = document.createElement('div');
        new_el_damage.classList.add('damage');
        new_el_damage.innerText = `Damage: ${new_obj.move_damage}`;

        let new_el_pp = document.createElement('div');
        new_el_pp.classList.add('pp');
        new_el_pp.innerText = `PP: ${new_obj.move_pp}`;

        current_card_el.append(new_el_movename, new_el_damage, new_el_pp);

        moveCount++;
    }

    hp_obj.opp_hp = data.stats[0].base_stat;
    max_opp_hp = hp_obj.opp_hp;
    floater_opp_poke_hp.innerText = `Opp HP: ${hp_obj.opp_hp}`;
    floater_opp_poke_img.src = data["sprites"]["other"]["showdown"]["front_default"];
    document.getElementsByClassName('opp-poke-details')[0].innerText = data.name;

    return opp_move_info_lib;
} 

function getRandomInteger() {
    return Math.floor(Math.random() * 5);
}
function getRandomIntInclusiveLowerExclusiveUpper(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function battle_round(){
    //user choice
    let left_battle_ability_list = document.getElementsByClassName('battle-ability-list')[0];
    let children = Array.from(left_battle_ability_list.children);
    let isProcessing = false;
    for(let i = 0; i<5; i++){
        children[i].addEventListener('click', ()=>{
            if(isProcessing == true){
                return;
            }

            for(obj of children){
                obj.classList.remove('poke-ability-card-selected');
                obj.classList.remove('poke-ability-card-clickable');
                // obj.classList.add('redirect-selection-hover');
            }

            console.log(user_move_info_lib);

            children[i].classList.add('poke-ability-card-selected');

            let hp_bar_el = document.getElementsByClassName('opp-bar')[0];
            let target_arr = children[i].lastElementChild;
            details_update(i, target_arr, floater_opp_poke_hp, match_description_p, user_move_info_lib, 'user-attack', hp_bar_el);

            bottom_user_poke_name.classList.add('active-indicator');

            //COMPUTER CHOICE/////////////////////
            isProcessing = true;
            setTimeout(()=>{
                console.log("attack in progress");

                // let comp_choose_rand_num = getRandomInteger();
                let comp_choose_rand_num = getRandomIntInclusiveLowerExclusiveUpper(0, opp_move_info_lib.length);

                let target_el = Array.from(right_battle_ability_list.children)[comp_choose_rand_num];
                target_el.classList.add('poke-ability-card-selected');
                let hp_bar_el = document.getElementsByClassName('user-bar')[0];
                if(!curr_fight_record.winner){
                    details_update(comp_choose_rand_num, target_el.lastElementChild, floater_user_poke_hp, match_description_p, opp_move_info_lib, 'opp-attack', hp_bar_el);
                }
                
                bottom_user_poke_name.classList.remove('active-indicator');
                bottom_opp_poke_name.classList.add('active-indicator');
            }, per_move_gap_time);
            

            setTimeout(()=>{
                for(let i = 0; i<5; i++){
                    let temp = Array.from(right_battle_ability_list.children)[i];
                    temp.classList.remove('poke-ability-card-selected');
                }
                for(obj of children){
                    obj.classList.remove('poke-ability-card-selected');
                }
                match_description_p.innerText = "Choose your next attack...";
                isProcessing = false;
                bottom_opp_poke_name.classList.remove('active-indicator');
                bottom_user_poke_name.classList.add('active-indicator');

                for(obj of children){
                    obj.classList.add('poke-ability-card-clickable');
                }

            }, 2*per_move_gap_time);
            
            // for(obj of children){
            //     obj.classList.add('poke-ability-card-clickable');
            // }//to add hover effect back
        })
    }
}

function update_and_store_num_round(who_win){
    num_round_record[who_win] += 1;
    sessionStorage.setItem('num_round_record_from_battle2', JSON.stringify(num_round_record));
}

async function details_update(num, pp_element, hp_element, description_element, library, who_attack, hp_bar_el){
    let pp = library[num].move_pp;

    if(pp === 0){
        alert('player tried to play an exhausted move...But other player is mercyless...');
        description_element.innerText = "Player tried to play exhausted move";
    }
    else{
        let q = 20;
        if(who_attack == 'user-attack'){
            let x = hp_obj.opp_hp;
            x -= library[num].move_damage;
            if(x<=0){
                x = 0;
            }
            hp_obj.opp_hp = x;

            if(hp_obj.opp_hp === 0 ){
                alert('user won!');
                // hp_obj.opp_hp = 0;
                hp_element.innerText = `Opp HP : ${hp_obj.opp_hp}/${max_opp_hp}`;
                q = (hp_obj.opp_hp/max_opp_hp)*100;
                hp_bar_el.style.width = `0%`;

                let poke_sprite = document.getElementsByClassName('floater-opp-poke-img')[0];

                curr_fight_record.winner = "user";
                // num_round_record.user_win += 1;
                update_and_store_num_round("user_win");
                
                
                round_history.push(curr_fight_record);
                sessionStorage.setItem('round_history_from_battle2', JSON.stringify(round_history));

                for(let i = 0; i<3; i++){
                    // poke_sprite.classList.remove('player-dead2');
                    poke_sprite.classList.add('player-dead');
                    await sleep(500);
                    poke_sprite.classList.remove('player-dead');
                    await sleep(500);
                    // poke_sprite.classList.add('player-dead2');
                }
                window.location = "battle_page.html";
                
                hp_element.innerText = `Opp HP : ${hp_obj.opp_hp}/${max_opp_hp}`;
                q = (hp_obj.opp_hp/max_opp_hp)*100;
                console.log(q);
                return;
            }
            hp_element.innerText = `Opp HP : ${hp_obj.opp_hp}/${max_opp_hp}`;
            q = (hp_obj.opp_hp/max_opp_hp)*100;
            console.log(q);

            console.log(q);
        }
    
        else if(who_attack === 'opp-attack'){
            let x = hp_obj.user_hp;
            x -= library[num].move_damage;
            if(x <= 0){
                x = 0;
            }
            hp_obj.user_hp = x;
            if(hp_obj.user_hp <= 0){
                alert('opp won!');
                hp_obj.user_hp = 0;
                hp_element.innerText = `User HP : ${hp_obj.user_hp}/${max_user_hp}`;
                curr_fight_record.winner = "opp";
                // num_round_record.opp_win += 1;

                q = (hp_obj.opp_hp/max_opp_hp)*100;
                hp_bar_el.style.width = `0%`;

                let poke_sprite = document.getElementsByClassName('floater-user-poke-img')[0];

                
                update_and_store_num_round("opp_win");
                
                round_history.push(curr_fight_record);
                sessionStorage.setItem('round_history_from_battle2', JSON.stringify(round_history));
                for(let i = 0; i<3; i++){
                    // poke_sprite.classList.remove('player-dead2');
                    poke_sprite.classList.add('player-dead');
                    await sleep(500);
                    poke_sprite.classList.remove('player-dead');
                    await sleep(500);
                    // poke_sprite.classList.add('player-dead2');
                }
                window.location = "battle_page.html";
                
                console.log(q);
                return;
            }
            hp_element.innerText = `User HP : ${hp_obj.user_hp}/${max_user_hp}`;
    
            q = (hp_obj.user_hp/max_user_hp)*100;      
            console.log(q);      
        }
    
        pp -= 1;
        library[num].move_pp = pp;
        pp_element.innerText = `PP : ${library[num].move_pp}`;
        description_element.innerText = `${library[num].move_flavor_text}`;

        hp_bar_el.style.width = `${q}%`;
    }
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