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
        console.log(res.err);
        alert(res.err);
    }  else {
        logout();
    }
}