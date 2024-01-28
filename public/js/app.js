const $ = name => document.querySelector(name);
const $$ = name => document.querySelectorAll(name);



const host = '';
// const host = 'http://192.168.40.186';

function init() {

    getUserData();
}

init();


function getCookie(name) {

    let cookies = document.cookie.split(';');

    for(let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if(cookie.startsWith(name+"=")){
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

$('#signup-form').onsubmit = async e => {
    e.preventDefault();

    $('#signup-btn').disabled = true;

    const name = $('#name-input').value;
    const dob = $('#dob-input').value;
    const deviceID = $('#device-input').value;

    try {
        
        const res = await makeFetch(host+'/account/signup', 'POST', {name, dob, deviceID});

        console.log(res);

        if(res.error) {
            $('#signup-msg-box').innerHTML = res.error;
            $('#signup-btn').disabled = false;
            return;
        }

        getUserData();

    } catch (error) {
        console.log(error);
    }
}

$('#email-form').onsubmit = async e => {
    e.preventDefault();

    $('#generate-otp-btn').disabled = true;
    $('#email-msg').innerHTML = "Requesting OTP...";

    requestOTP().then((msg) => {

        $('#welcome-section').classList.remove('email');
        $('#welcome-section').classList.add('otp');
        $('#otp-msg').innerHTML = msg;

    }).catch(err => {
        console.log(err);
        $('#generate-otp-btn').disabled = false;
        $('#email-msg').innerHTML = err;
    });

    
}

$('#otp-form').onsubmit = async e => {
    e.preventDefault();

    $('#otp-err-msg').innerHTML = "Verifying...";
    $('#otp-verify-btn').disabled = true;
    
    console.log("Verifying OTP");
        
    const email = $('#email-input').value;
    const otp = $('#otp-input').value.toString();

    try {
        
        const res = await makeFetch(host+'/account/verify', 'POST',{email, otp});

        if(res.error) {

            $('#otp-err-msg').innerHTML = res.error;
            $('#otp-verify-btn').disabled = false;
            
        } else if(res.accountComplete) {
            
            $('#otp-err-msg').innerHTML = res.message;
            $('#welcome-section').classList.remove('otp');
            getUserData();
        } else {

            $('#welcome-section').classList.remove('otp');
            $('#welcome-section').classList.add('signup');
        }

    } catch (error) {
        
        console.log(error);
    }

}

function requestOTP() {

    return new Promise(async (resolve, reject) => {
        
        console.log("requesting OTP");
        
        const email = $('#email-input').value;
        
        const requestOptions = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                email
            })
        };
    
        let response = null;
        
        try {
            
            response = await fetch(host + '/account/generate', requestOptions);
            const json = await response.json();
            if(json.error) reject(json.error);
            resolve(json.message);
            
        } catch (err) {
            console.log(err)
            reject(err);
        }
    });
} 

async function getUserData() {

    try {
        
        const res = await makeFetch(host+'/account/userData', 'POST', {});

        if(res.error) {
            renderLogout();
            return console.log(res.error);
        }

        if(res.name && res.deviceID) {

            renderUserData(res);
            getRealtimeData();
            console.log("user data rendered");
        } else {

            $('#welcome-section').classList.add('signup');
            $('#welcome-section').classList.remove('email');
            $('#welcome-section').classList.remove('otp');
        }


        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

async function getHistory() {

    try {
        
        const res = await makeFetch(host+'/device/dates', 'POST', {});

        if(res.error) return alert(res.error);

        console.log(res);

        document.body.classList.remove('menu-active');

        if(res.dates.length > 0) {

            $('#available-date-list').innerHTML = '';

            res.dates.forEach(date => {
                $('#available-date-list').innerHTML += `<li onclick="getSpecificDate('${date}');">${date.split('.')[0]}</li>`;
            });

            const preRenderedGraphs = $('#app').querySelectorAll('.graph-section');

            if(preRenderedGraphs) preRenderedGraphs.forEach(graph => $('#app').removeChild(graph));

            $('#history').style.display = 'block';
        } else {
            alert('No data found')
        }


    } catch (err) {
        console.log(err);
    }
}

async function getSpecificDate(date) {

    try {
        
        const res = await makeFetch(host+'/device/dates/'+date, 'POST', {});

        if(res.error) return alert(res.error);

        console.log(res);

        if(res.data.length <= 0) return alert('No data was updated');

        const preRenderedGraphs = $('#app').querySelectorAll('.graph-section');

            if(preRenderedGraphs) preRenderedGraphs.forEach(graph => $('#app').removeChild(graph));

        const section = document.createElement('section');
        section.classList.add('p-1');
        section.classList.add('graph-section');
        const h = document.createElement('h4');
        h.innerHTML = date.split('.')[0];
        section.appendChild(h);
        const graph = document.createElement('div');
        graph.classList.add('oxi-graph');
        section.appendChild(graph);
        renderGraph(res.data, graph);

        $('#app').appendChild(section);

        $('#history').style.display = 'none';

    } catch (err) {
        console.log(err);
    }
}


async function getRealtimeData() {

    try {
        
        const res = await makeFetch(host+'/device/realtime', 'POST', {});

        
        if(res.error) {
            
            if(res.status === 404) $('#no-data-found').style.display = 'block';
            $('#realtime-section').style.display = 'none';
            updateFetchingIndicator();
            setTimeout(getRealtimeData, 5000);
            return console.log(res.error);
        }
        
        console.log(res);
        
        $('#no-data-found').style.display = 'none';
        $('#realtime-timestamp').innerHTML = res.timestamp;
        $('#bpm-display').innerHTML = res.bpm;
        $('#oxygen-display').innerHTML = res.oxygen;
        
        $('#realtime-section').style.display = 'block';
        
    } catch (err) {
        
        $('#realtime-section').style.display = 'none';
        console.log(err);
    }
    updateFetchingIndicator();
    setTimeout(getRealtimeData, 5000);
}

function updateFetchingIndicator() {
    $('#realtime-indicator').classList.add('active');
        setTimeout(() => {
            $('#realtime-indicator').classList.remove('active');
        }, 100);
}

function renderLogout() {
    $('#heading-text').innerHTML = 'Welcome back!';
    $('#profile-section').classList.add('hidden');
    $('#alt-profile-section').classList.remove('hidden');
    $('#welcome-section').classList.add('email');
}

function renderUserData(data) {

    $('#profile-email').innerHTML = data.email;
    $('#profile-name').innerHTML = data.name;
    $('#profile-dob').innerHTML = data.dob;
    $('#profile-device-status').innerHTML = 'Pending';
    $('#profile-device-id').innerHTML = data.deviceID;
    $('#heading-text').innerHTML = 'Welcome '+ data.name;
    $('#profile-section').classList.remove('hidden');
    $('#alt-profile-section').classList.add('hidden');
    $('#welcome-section').classList.remove('email');
    $('#welcome-section').classList.remove('otp');
    $('#welcome-section').classList.remove('signup');
}

function makeFetch(url, method, body) {

    return new Promise((resolve, reject) => {

        fetch(url, {
            method: method,
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(body)

        }).then(res => res.json())
        .then(json => resolve(json))
        .catch(err => {
            reject(err);
        })
    })
}

function delete_cookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

function logout() {

    if(!document.cookie) return;

    delete_cookie('token');
    location.reload();
}

async function deleteAccount(){

    if(!document.cookie) return;

    const res = await makeFetch(host+'/account/delete', 'POST', {});

    if(res.error) {
        console.log(res.error);
        alert(res.error);
    }  else {
        logout();
    }
}

function renderGraph(data, elem) {

    data = data.map((data) => {
        return [data[0], parseInt(data[1]), parseInt(data[2])];
    });

    elem.classList.add("oxi-graph");
    elem.innerHTML = `<div class="layer"></div>
        <div class="display">
        <p><span class="timestamp">-</span> &nbsp; Oxygen <strong class="oxy">-</strong> &nbsp; BPM <strong class="bpm">-</strong></p>
        </div>`;

    const layer = elem.querySelector(".layer");

    data.forEach((data) => {
        layer.innerHTML += `<div class="bar" graph-data="${data}" style="--x2: ${mapNumber(data[1], 0, 200, 0, 100)}%; --x1: ${mapNumber(
            data[2],
            0,
            200,
            0,
            100
        )}%"></div>`;
    });

    let lastElem = null;

    layer.ontouchmove = (e) => {
        e.preventDefault();
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;

        const elementUnderTouch = document.elementFromPoint(touchX, touchY);

        if (elementUnderTouch && elementUnderTouch.classList.contains("bar") && elementUnderTouch.parentNode.parentNode == elem) {
            if (lastElem) lastElem.classList.remove("active");

            elementUnderTouch.classList.add("active");
            lastElem = elementUnderTouch;

            const data = elementUnderTouch.getAttribute("graph-data").split(",");

            elem.querySelector(".timestamp").innerHTML = data[0];
            elem.querySelector(".oxy").innerHTML = data[1];
            elem.querySelector(".bpm").innerHTML = data[2];
        }
    };

    function mapNumber(value, fromMin, fromMax, toMin, toMax) {
        value = Math.min(Math.max(value, fromMin), fromMax);

        const percentage = (value - fromMin) / (fromMax - fromMin);

        const result = toMin + percentage * (toMax - toMin);

        return result;
    }
}