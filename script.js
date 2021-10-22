// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-analytics.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0wiXQy-jbhw87mD1T9JcqmPzzsdcmo18",
  authDomain: "mydatabase-c3857.firebaseapp.com",
  databaseURL: "https://mydatabase-c3857-default-rtdb.firebaseio.com",
  projectId: "mydatabase-c3857",
  storageBucket: "mydatabase-c3857.appspot.com",
  messagingSenderId: "950499506626",
  appId: "1:950499506626:web:72d617606b2e8314cabe5b",
  measurementId: "G-VBSZJGWS7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = rtdb.getDatabase(app);
const titleRef = rtdb.ref(db, "/");
//let titleref = rtdb.ref(db,"/");
var chat_app = "chatapp";
var chat_id = 'oXuPkY0wMNMaUXYEVrCb7M8tBCi2';
var chat = rtdb.child(titleRef, `/groups/${chat_app+chat_id}/messages`);
//let people = rtdb.child(type,"/human");
//rtdb.onValue(people, ss=>{
//alert(JSON.stringify(ss.val()));
//});
//let newobj = {json obj};
//rtdb.push(people,newobj);

//W3 school code complimentary color
function invertHex(hex) {
  let hexpart = hex.slice(1);
  return (
    "#" +
    Number(`0x${hexpart}` ^ 0x808080)
      .toString(16)
      .substr(0)
      .toUpperCase()
  );
}
var name;
let uid;
function show() {
  let email = $('#name').val();
  let password = $('#userpassword').val();
  //let username = document.getElementById("name").value;
  const auth = fbauth.getAuth();
  fbauth.signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    name = user.displayName;
    
    console.log('signin',name);
    let color = document.getElementById("color").value;
    let complement = invertHex(color);
    document.getElementById("heading1").style.display = "block";
    document.getElementById("heading1").innerText = "Hi, " + name + ", lets connect this world.";
    document.body.style.backgroundColor = color;
    document.getElementById("heading1").style.color = complement;
    document.getElementById("heading").style.color = complement;
    document.getElementById("name").style.backgroundColor = complement;
    document.getElementById("name").style.color = color;
    document.getElementById("color").style.backgroundColor = color;
    document.getElementById("color").style.borderColor = complement;
    document.getElementById("name").style.borderColor = complement;
      //console.log()
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });

  
}

function newpage(element) {
  //console.log("we00");
  var slideSource = document.getElementsByClassName("form1")[0];
  slideSource.classList.toggle("fade");
  //console.log("we11");
  setTimeout(function () {
    
    slideSource.style.display = "none";
    $(element).toggleClass("fade");
    
    
  }, 800);
}

//onAuthStateChanged
//var clickhandler = function () {  show();};

//document.querySelector("#name").addEventListener("click",clickhandler);
////////////////////auth-watcher////////////////////

const auth = fbauth.getAuth();
fbauth.onAuthStateChanged(auth, (user) => {
  let online = rtdb.child(titleRef, `/online`);
  if (user.displayName) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    uid = user.uid;
    name = user.displayName;
    console.log('authchange',name);
    //$('#form1').toggle();
    let ele = '.chatui';
    newpage(ele);
    //document.getElementsByClassName("chatbox")[0].classList.toggle("fade");
    update();
    update_channel();
    online_status();
    rtdb.update(online,{[name]:{[uid]:true}});
    // ...
  } else {
    // User is signed out
     //rtdb.update(online,{[name]:false});
    // ...
  }
}); 
////////////////////////////////////////////////////

var timestamp = (Date.now() / 1000) | 0;

var sendmessage = function () {
  let message = document.getElementById("chat").value;
  //let message = validator.escape( dirtymessage );
  
  timestamp = (Date.now() / 1000) | 0;
  let jsonobj = { 'name': name, 'message': message, 'timestamp': timestamp, 'edited':0 };
  //console.log(jsonobj);
  rtdb.push(chat, jsonobj);
  document.getElementById("chat").value='';
};


function update(){
rtdb.onValue(chat, (data) => {
  //name = document.getElementById("name").value;
  //console.log("hess");
  $('#heading2').text(chat_app+' '+chat_id);
  document.getElementById("chats").innerHTML = "";
  let theIds = Object.keys(data.val());
  //console.log(theIds);
  for(const element in data.val()) {
    let msg = data.val()[element];
    //console.log(element,msg)
    let msgname = validator.escape( msg.name );
    let msgmessage = validator.escape( msg.message );
    let msgedited = msg.edited;
    if (msgname == name) { 
      $("#chats").prepend(`<div class='personal'> ${msgname}  :<div class='my_msg' contenteditable = 'true' style = 'text-align: right;' data-id=${element} >${msgmessage}${msgedited?'(edited)':''}</div></div>`);
    } 
    else { let edited = msgedited?'(edited)':'';
      $("#chats").prepend(`<div class = 'other'>  ${msgname} ${' '}:${' '} ${msgmessage}  ${edited} </div>`);
    }
    $(".my_msg").off('click');
    $(".my_msg").click(msg_editor);
    
  }
});
}
//#######################updating channels######################
function goto(element){
  let next_channel = $(element.currentTarget).text();
  let owner = $(element.currentTarget).attr('data-idb');
  console.log('here',next_channel);
  chat = rtdb.child(titleRef, `/groups/${next_channel+owner}/messages`);
  chat_app = next_channel;
  chat_id = owner;
  update();
  };

function update_channel(){
let channels = rtdb.child(titleRef, `/users/${uid}/channels`);
rtdb.onValue(channels, (data) => {
  //console.log(data,data.val());
  $('#your_channels').html('Your Channels<br>');
  let chatlist = data.val();
  for(const element in chatlist) {
    //console.log(data,data.val()[element]);
    let owner = chatlist[element];
    $('#your_channels').append(`<div class='chn${owner===true?" own":" not_own"}' ${owner===true?"data-ida="+element +" data-idb="+uid:"data-ida="+element +" data-idb="+owner}>${element}</div>`);
    $('.chn').off('click');
    $(".chn").click(goto);

  }
  //$('.chn').off('click');
  //$(".chn").click(goto);
  console.log('updatechannel');
});}
//$(".chn").click(goto);

//##############################################################
//##################updating online status######################
function online_status(){
  let status = rtdb.child(titleRef,'/online');
  rtdb.onValue(status,(data)=>{
    $('#contacts').html("Users<br><button id='add'>Add User</button><button id='remove'>Remove</button>");
    let userlist = data.val();
    for(const element in userlist) {
      let online = userlist[element];
      let key = Object.keys(online);
      $('#contacts').append(`<div class='chn usr ${online[key]==true?'own':'not_own'}' data-id=${key}><input type='checkbox' class='usr' data-id=${key}>${element}${online[key]==true?'(on)':''}</div>`);
    }
    $('#add').off('click');
    $('#remove').off('click');
    $('#add').click(adduser);
    $('#remove').click(removeuser);
  });
}

//##############################################################
//##################edit_message main function##################
function editmessage(dataid,clickedElement){
  //let clickedElement = ele.currentTarget;
  let message = $(clickedElement).text();
  
  //console.log(dataid,message);
  let upd = rtdb.child(chat,dataid);
  rtdb.update(upd,{'message':`${message}`, 'edited':1});
}

function what(){
  alert(1);
}

//###########edit_message clickhandler function#################
let msg_editor = function(ele){
  let clickedElement = ele.currentTarget;
  let parentEle = $(clickedElement).parent()
  let dataid = $(clickedElement).attr('data-id');
  $('#update').remove();
  $(parentEle).prepend(`<div style='float: right;'><button id='update'>Update</button></div>`);
  let message = $(clickedElement).text();
  //console.log("hi",JSON.stringify(message));
  $('#update').click(editmessage.bind(this,dataid,clickedElement))
    
};
//###################Register New User page#####################
function register(){
  let signin = `<div class="signform" >
      <p id="heading">Enter the Details.</p>

      <input type="text" name="username" placeholder="enter username" id="createusername" maxlength="30" required /></br>
      <input type="text" name="email" placeholder="enter valid email" id="email" maxlength="30" required /></br>
      <input type="password" name="password" placeholder="password" id="password" maxlength="30" required /><span id='validity'></span></br>
      <input type="password" name="confpassword" placeholder="confirm Password" id="conf_password" maxlength="30" required /><span id='match'></span></br>
      <button id="CreateAccount" class="button"><span>Create Account</span>
        
        </button>
    <style>
    .signform {
    margin: auto;
    width: 80%;
    opacity: 0;
    text-align: center;
    position:relative;
    transition: opacity 1s;
    background:#ECE4E4;
    }
    
    .signform.fade{
        display: block;
        opacity: 1;
      }
    </style>
    </div>`
  $('body').append(signin);
  let ele = '.signform ';
  newpage(ele);
  console.log(ele);
  let valid,matching = 0;
  $('#password, #conf_password').on('keyup', function () {
    let strong=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if($('#password').val().match(strong) && $('#conf_password').val().match(strong))
      {
        $('#validity').html('Valid').css('color', 'green');
        valid = 1;
      } else
      { 
        $('#validity').html('inValid').css('color', 'green');
        valid = 0;
      }
    if ($('#password').val() == $('#conf_password').val()) {
      $('#match').html('Matching').css('color', 'green');
      matching = 1;
    } else 
      {
        $('#match').html('Not Matching').css('color', 'red');
        matching = 0;
      }
  });
  
  //#################create user function#########################
  function create_user(displayname,email,password){
    const auth = fbauth.getAuth();
    
    fbauth.createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
    
        const user = userCredential.user;
        console.log(user.uid);
        alert('account created');
        //location.reload(true);
        
        fbauth.updateProfile(auth.currentUser,{
            displayName: displayname
            })
        console.log($("createusername").val())
        let userdata = rtdb.child(titleRef, `/users/${user.uid}`);
        rtdb.update(userdata,{'channels':{chatapp:chat_id}});
        location.reload(true);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage)
        // ..
      });    
  
  };
 
 $('#CreateAccount').click(function(){
   let displayname = $("#createusername").val(); 
   console.log("create account")
    if(valid && matching)
      { let password = $('#conf_password').val();
       let email = $('#email').val();
        create_user(displayname,email,password);
        console.log(displayname,email,password,'user created')
      }else
      {
        alert('Requirement not satisfied. Remember Password length should be atleast 8 character long with atleast, 1 uppercase character,1 lowercase character, one special character and numbers ');
      }
 })//create_user.bind(this,email,password)  
  
};

function signout(){
  const auth = fbauth.getAuth();
  fbauth.signOut(auth).then(() => {
    // Sign-out successful.
    let online = rtdb.child(titleRef, `/online`);
    rtdb.update(online,{[name]:{[uid]:false}});
    // ..
    location.reload(true);
    
  }).catch((error) => {console.log('lolwat');
  // An error happened.
  });
}

function adduser(){
  let friend = [];
  console.log('add');
  let element = $(".usr");
  for(const ele in element){
    if(element[ele].checked){  
      friend.push($(element[ele]).attr('data-id'));
      console.log('frn',friend);
    }
    
  }
  
  //console.log('add');
  let group_metadata = rtdb.child(titleRef, `/groups/${chat_app+chat_id}/metadata/members`);
  //console.log('add');
  for(let fr of friend){
    rtdb.update(group_metadata,{[fr]:true});
    //console.log(fr,chat_id,`/groups/${chat_app+chat_id}/metadata/members`);
  }
    
  
  alert(friend,' added');
}

function removeuser(){
  console.log('rem');
  let friend;
  let element = $(".usr");
  for(const ele in element){
    if(element[ele].checked){  
      friend = $(element[ele]).attr('data-id');
      rtdb.child(titleRef, `/groups/${chat_app+chat_id}/metadata/members/${friend}`).remove();
      console.log('frn',friend);
    }
    
  }
  //let group_metadata = rtdb.child(titleRef, `/groups/${chat_id}/metadata/members`);
  //rtdb.update(group_metadata,{[friend]:true});
  alert('friends removed');
}

document.querySelector("#submit").addEventListener("click", show);
document.querySelector("#send").addEventListener("click", sendmessage);
document.querySelector("#signin").addEventListener("click", register);

$('#signout').click(signout);
//############## create channel handler and function





$('#create_channel').click(function(){
  $('#enter_channel').append(`<input type='text' placeholder="enter channel name" id='chname'/><input type='text' placeholder="enter invitation code" id='invi'/><button id='ok'>Ok</button>`).ready(()=>{
    $('#ok').click(function(){
      console.log($('#chname').val());
      let newgroup=$('#chname').val();
      let invi = $('#invi').val();
      let location;
      if(!invi){
        location=newgroup+uid;
        chat = rtdb.child(titleRef, `/groups/${location}/messages`);
        let userdata = rtdb.child(titleRef, `/users/${uid}/channels`);
        let group_metadata = rtdb.child(titleRef, `/groups/${newgroup+uid}/metadata`);      
        rtdb.update(group_metadata,{admin:uid,members:{[uid]:true}});
        rtdb.update(userdata,{[newgroup]:true});

      }
      else{
        location=newgroup+invi;
        chat = rtdb.child(titleRef, `/groups/${location}/messages`);
        let userdata = rtdb.child(titleRef, `/users/${uid}/channels`);
        rtdb.update(userdata,{[newgroup]:invi});
        //let group_metadata = rtdb.child(titleRef, `/groups/${location}/metadata`);      
        //rtdb.update(group_metadata,{admin:uid,members:{[uid]:true}});
      
    }
      
      update();
      $('#enter_channel').html('');
    });
    
    //.then()
  });
  
});
