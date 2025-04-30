const api_url = 'https://pokeapi.co/api/v2/pokemon/';

let num_loop_repeat = 80;
sessionStorage.setItem('num_loop_repeat', JSON.stringify(num_loop_repeat));

let difficulty_offset_user = 1; 
let difficulty_offset_opp = 1;
sessionStorage.setItem('difficulty_offset_opp', JSON.stringify(difficulty_offset_opp));

let offset_dictionary = {
    "1" : "Normal" ,
    "2" : "Moderate",
    "3" : "Strong"
}

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
    let new_el = document.createElement('div'); new_el.classList.add('poke-card'); element.appendChild(new_el);
    let new_el_img = document.createElement('img'); new_el.appendChild(new_el_img); 
    let new_el_poke_name = document.createElement('p'); 
    new_el_poke_name.classList.add('poke-card-poke-name');
    new_el.appendChild(new_el_poke_name);
    new_el_img.src = poke_img_url;
    new_el_poke_name.innerText = poke_name;

    new_el.addEventListener('click', ()=>{
        click_sound.play();
        if(new_el.classList.contains('clicked-poke-card')){
            new_el.classList.remove('clicked-poke-card');
            selected_poke_array.splice((selected_poke_array.indexOf(poke_name)),1);
            console.log(selected_poke_array);
            update_selected_poke_region(selection_left,selected_poke_array);
        }
        else if(selected_poke_array.length>=6){
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
    if(!selected_poke_array.length)element.innerHTML = `<p class="exciting-text">Selest 6 Pokemons !!!</p>` ;
    else{
        element.innerHTML = ``;
        let temp = [];
        let isProcessing = true;
        for(let id of selected_poke_array){
            let response = await fetch(api_url+id);
            let json_object = await response.json();
            let poke_name = json_object.name;
            let poke_img_url = json_object['sprites']['other']["dream_world"]["front_default"];
            let new_poke_img = document.createElement('img'); new_poke_img.classList.add('selected-poke-image')
            new_poke_img.src = poke_img_url;
            element.appendChild(new_poke_img);
        }
    }
}



//////////////////////////////////////////////////

let selected_poke_array = [];

async function page_render(left_half) {    

    if(sessionStorage.getItem('difficulty_offset_user')){
        difficulty_offset_user = sessionStorage.getItem('difficulty_offset_user');
    }

    left_half.innerHTML = ``;

    for(let i = difficulty_offset_user; i<= 3*(num_loop_repeat); i+= 3){
        await make_selection_screen(left_half, i, selected_poke_array);
    }
    clear_selected_poke.addEventListener('click',async ()=>{
        click_sound.play();
        await sleep(500);
        window.location.reload();
        console.log('reloaded');
    })

    battle_button.addEventListener('click',async ()=>{
        click_sound.play();
        if(selected_poke_array.length != 6){
            let popup = document.getElementsByClassName('battle-popup')[0];
            let popup_message = document.getElementsByClassName('result')[0];
            popup_message.innerText = `Your squad must contain 6 Pokemons...`;

            if(popup.style.display === "block"){
                popup.style.display = "none";
            }
            else{
                popup.style.display = "block";
                await sleep(2000);
                popup.style.display = "none";
            }
        }
        else{
            
            sessionStorage.setItem('pokeArray', JSON.stringify(selected_poke_array));
            await sleep(500);
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

    element.addEventListener('click', ()=>{
        click_sound.play();
        popup.classList.add('info-popup-unleashed');
        background_full.classList.add('background-no-scroll');
        background_top.classList.add('background-blur');
        background_below.classList.add('background-blur');
        console.log('hello');
    })

    let cross_button = document.getElementsByClassName('close-button')[0];
    cross_button.addEventListener('click', ()=>{
        click_sound.play();
        popup.classList.remove('info-popup-unleashed');
        
        background_full.classList.remove('background-no-scroll');
        background_top.classList.remove('background-blur');
        background_below.classList.remove('background-blur');
    })
    
    let target_arr_user = Array.from(document.getElementsByClassName('user-choosing')[0].children);
    target_arr_user[difficulty_offset_user].classList.add('info-choice-button-clicked');

    for(let i = 1; i<4; i++){
        target_arr_user[i].addEventListener('click', ()=>{
            click_sound.play();
            for(el of target_arr_user){
                el.classList.remove('info-choice-button-clicked');
            }
            if(target_arr_user[i].classList.contains('info-choice-button-clicked')){
                target_arr_user[i].classList.remove('info-choice-button-clicked');
            }
            else{
                target_arr_user[i].classList.add('info-choice-button-clicked');
            }

            difficulty_offset_user = i;
            sessionStorage.setItem('difficulty-offset-user', JSON.stringify(difficulty_offset_user));
            console.log(difficulty_offset_user);
            console.log("page rendering");
            selected_poke_array = [];
            page_render(left_half);

        })
    }
    let target_arr_opp = Array.from(document.getElementsByClassName('opp-choosing')[0].children);
    target_arr_opp[difficulty_offset_opp].classList.add('info-choice-button-clicked');

    for(let i = 1; i<4; i++){
        target_arr_opp[i].addEventListener('click', ()=>{
            click_sound.play();
            for(el of target_arr_opp){
                el.classList.remove('info-choice-button-clicked');
            }
            if(target_arr_opp[i].classList.contains('info-choice-button-clicked')){
                target_arr_opp[i].classList.remove('info-choice-button-clicked');
            }
            else{
                target_arr_opp[i].classList.add('info-choice-button-clicked');
            }

            difficulty_offset_opp = i;
            sessionStorage.setItem('difficulty_offset_opp', JSON.stringify(difficulty_offset_opp));

            let poke_strength_display_opp = document.getElementsByClassName('strength-opp')[0];
            poke_strength_display_opp.innerText = `Opp Pokemon Strength -> ${offset_dictionary[difficulty_offset_opp]}`;
        })
    }
    let poke_strength_display_user = document.getElementsByClassName('strength-user')[0];
    poke_strength_display_user.innerText = `User Pokemon Strength -> ${offset_dictionary[difficulty_offset_user]}`;
    
    let poke_strength_display_opp = document.getElementsByClassName('strength-opp')[0];
    poke_strength_display_opp.innerText = `Opp Pokemon Strength -> ${offset_dictionary[difficulty_offset_opp]}`;

    sessionStorage.setItem('difficulty_offset_opp', JSON.stringify(difficulty_offset_opp));
}

let i = 0;
let audio = new Audio('../sounds/home-page.mp3'); 
let click_sound = new Audio('../sounds/click-sound.wav');

function music_button_init(audio){
    let music_button= document.getElementsByClassName('music-button')[0];
    audio.loop = true;
    let isPlaying = true;

    music_button.addEventListener('click', ()=>{
        click_sound.play();
        if(!isPlaying){
            audio.play(); isPlaying = true;
            music_button.src = '../images/volume-button.png';
        }
        else{
            audio.pause(); isPlaying = false;
            music_button.src = '../images/mute-button.png';
        }
    })
}

function playMusicOnFirstClick(audio){
    audio.loop = true; 

    function handleFirstClick() {
        audio.play();
        document.removeEventListener('click', handleFirstClick);
    }

    document.addEventListener('click', handleFirstClick);
}


playMusicOnFirstClick(audio);
music_button_init(audio);
info_button_init();
page_render(left_half);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}