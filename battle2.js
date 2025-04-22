const api_url = 'https://pokeapi.co/api/v2/pokemon/';

//Imported data//////////////////
let curr_fight_record = {
    "user_poke" : "nidorino", 
    "opp_poke" : "fearow" , 
    "winner" : ""
};

let num_round_record = {
    "user_win" : 3 ,
    "opp_win" : 1 ,
    
    get total(){return this.user_win + this.opp_win;}
};

let hp_obj = {
    //"user_hp" : , "opp_hp"
};

///////////////////////////////

document.getElementsByClassName('num-user-win')[0].innerText = num_round_record.user_win;
document.getElementsByClassName('num-opp-win')[0].innerText = num_round_record.opp_win;
document.getElementsByClassName('num-round')[0].innerText = `Round : ${num_round_record.total}/6`;

const floater_user_poke = document.getElementsByClassName('floater-user-poke')[0];
const floater_opp_poke = document.getElementsByClassName('floater-opp-poke')[0];

//fill the moves array for user


async function user_poke_ability_init(){
    let left_battle_ability_list = document.getElementsByClassName('battle-ability-list')[0];
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
            console.log('pakda gaya ' + i);
            offset_index++;
        }
        else{
            let new_el_movename = document.createElement('div');
            new_el_movename.classList.add('move-name');
            new_el_movename.innerText = `Move Name : ${data2.name}`;
    
            let new_el_damage = document.createElement('div');
            new_el_damage.classList.add('damage');
            new_el_damage.innerText = `Damage : ${data2.power}`;
    
            let new_el_pp = document.createElement('div');
            new_el_pp.classList.add('pp');
            new_el_pp.innerText = `PP : ${data2.pp}`;
    
            current_card_el.append(new_el_movename, new_el_damage, new_el_pp);
        }
    }   

    hp_obj.user_hp = data.stats[0].base_stat; // inserted below
    floater_user_poke.innerText = `HP : ${hp_obj.user_hp}`;
}

async function opp_poke_ability_init(){
    let right_battle_ability_list = document.getElementsByClassName('battle-ability-list')[1];
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
            console.log('pakda gaya ' + i);
            offset_index++;
        }
        else{
            let new_el_movename = document.createElement('div');
            new_el_movename.classList.add('move-name');
            new_el_movename.innerText = `Move Name : ${data2.name}`;
    
            let new_el_damage = document.createElement('div');
            new_el_damage.classList.add('damage');
            new_el_damage.innerText = `Damage : ${data2.power}`;
    
            let new_el_pp = document.createElement('div');
            new_el_pp.classList.add('pp');
            new_el_pp.innerText = `PP : ${data2.pp}`;
    
            current_card_el.append(new_el_movename, new_el_damage, new_el_pp);
        }
    }

    hp_obj.opp_hp = data.stats[0].base_stat;// inserted in floater below
    floater_opp_poke.innerText = `HP : ${hp_obj.opp_hp}`;
}


//Main EXECutino////////////////////

function page_render(){
    user_poke_ability_init();
    opp_poke_ability_init();
}
page_render();