const api_url = 'https://pokeapi.co/api/v2/pokemon/';

let num_round_record = {
    "user_win" : 0 ,
    "opp_win" : 0 ,
    
    get total(){return this.user_win + this.opp_win;}
}
sessionStorage.setItem('num_round_record_from_battle2', JSON.stringify(num_round_record));

let round_history =[];
sessionStorage.setItem('round_history', JSON.stringify(round_history));
sessionStorage.setItem('round_history_from_battle2', JSON.stringify(round_history));


//Elements//////////////////////////////
const left_half = document.getElementsByClassName('half')[0];
const right_half = document.getElementsByClassName('half')[1];
const selection_left = document.querySelector('.selection-left');
const selection_right = document.querySelector('.selection-right');   
const clear_selected_poke = document.getElementsByClassName('clear-selection-button')[0];
const battle_button = document.getElementsByClassName('battle-button')[0];
const pokedex_poke_image = document.getElementById('pokedex-poke-img');
////////////////////////////////////////

async function make_selection_screen(element, poke_id, selected_poke_array){ //poke_id can be a name also...
    let response = await fetch(api_url+poke_id);
    let json_object = await response.json();
    let poke_name = json_object.name;
    let poke_img_url = json_object['sprites']['front_default'];
    let poke_description = json_object

    // console.log(poke_name);
    // console.log(poke_img_url);

    let new_el = document.createElement('div'); new_el.classList.add('poke-card'); element.appendChild(new_el);

    let new_el_img = document.createElement('img'); new_el.appendChild(new_el_img); 
    let new_el_poke_name = document.createElement('p'); 
    new_el_poke_name.classList.add('poke-card-poke-name');
    new_el.appendChild(new_el_poke_name);

    new_el_img.src = poke_img_url;
    new_el_poke_name.innerText = poke_name;

    new_el.addEventListener('click', ()=>{
        if(new_el.classList.contains('clicked-poke-card')){
            new_el.classList.remove('clicked-poke-card');
            // new_el.id = "";
            selected_poke_array.splice((selected_poke_array.indexOf(poke_name)),1);
            console.log(selected_poke_array);

            update_selected_poke_region(selection_left,selected_poke_array);
        }
        else if(selected_poke_array.length>=6){
            // alert('! Your Squad has 6 members ! Lets Battle');

            new_el.classList.add('clicked-poke-card');
            new_el.id = poke_name;
            let eliminated = queue_filo_insert(selected_poke_array, poke_name);
            console.log(selected_poke_array);
        
            update_selected_poke_region(selection_left,selected_poke_array);

            let poke_card = document.getElementById(eliminated);
            poke_card.classList.remove('clicked-poke-card');

            return;
        }
        else{
            new_el.classList.add('clicked-poke-card');
            new_el.id = poke_name;
            selected_poke_array.push(poke_name); 
            console.log(selected_poke_array);
            update_selected_poke_region(selection_left,selected_poke_array);
        }
    })    
}

function queue_filo_insert(arr_name, new_poke_name){
    let eliminated = arr_name[0];
    for(let i = 0; i<(arr_name.length-1); i++){
        arr_name[i] = arr_name[i+1];
        console.log(` shifted ${i+1} to ${i}`);
    }
    arr_name[arr_name.length-1] = new_poke_name;
    return eliminated;
}

async function update_selected_poke_region(element, selected_poke_array){
    if(!selected_poke_array.length)element.innerHTML = `<p class="exciting-text">Select Your Pokemon !!!</p>` ;
    else{
        element.innerHTML = ``;
        for(let id of selected_poke_array){
            let response = await fetch(api_url+id);
            let json_object = await response.json();
            let poke_name = json_object.name;
            let poke_img_url = json_object['sprites']['other']["dream_world"]["front_default"];
            let new_poke_img = document.createElement('img'); new_poke_img.classList.add('selected-poke-image')
            // new_poke_img.style.transform.scaleY = "-1";
            new_poke_img.src = poke_img_url;
            element.appendChild(new_poke_img);
        }

    }
}



//////////////////////////////////////////////////

const selected_poke_array = [];

async function page_render(left_half) {

    let num_loop_repeat = 50;
    for(let i = 1; i<= 3*(num_loop_repeat) ; i+= 3){
        await make_selection_screen(left_half, i, selected_poke_array);
    }
    clear_selected_poke.addEventListener('click', ()=>{
        window.location.reload();
        console.log('reloaded');
    })

    battle_button.addEventListener('click', ()=>{
        if(selected_poke_array.length != 6){
            alert("You'll need more Poke-Power, Build a squad of 6...");
        }
        else{

            sessionStorage.setItem('pokeArray', JSON.stringify(selected_poke_array));
            window.location.href = "opp_reveal.html";

            return;
        }
    })
}

function info_button_init(){
    let element = document.getElementsByClassName('info-button')[0];
    let popup = document.getElementsByClassName('info-popup-hidden')[0];
    let background_top = document.getElementsByClassName('container')[0];
    let background_below = document.getElementsByClassName('selection-panel')[0];
    let background_full = document.getElementsByClassName('selection-page-body')[0];

    // popup.classList.add('info-popup-unleashed');

    element.addEventListener('click', ()=>{
        popup.classList.add('info-popup-unleashed');

        background_full.classList.add('background-no-scroll');
        background_top.classList.add('background-blur');
        background_below.classList.add('background-blur');

        console.log('hello');
    })

    let cross_button = document.getElementsByClassName('close-button')[0];
    cross_button.addEventListener('click', ()=>{
        popup.classList.remove('info-popup-unleashed');
        
        background_full.classList.remove('background-no-scroll');
        background_top.classList.remove('background-blur');
        background_below.classList.remove('background-blur');

        console.log(background);
    })
}

info_button_init();
page_render(left_half);

// async function opp_reveal(container, array){
    
//     for(id of array){
//         let response = await fetch(api_url+id);
//         let data = await response.json();
//         console.log(data.name);
//     }   
// }

