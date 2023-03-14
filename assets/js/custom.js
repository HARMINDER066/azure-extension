$(document).ready(function () {

    $(".flip_btn").click(function () {
        $(this).toggleClass("is_active");
        $(".flip-content").slideToggle("slow");
    });

    $(".template-popup").click(function () {
        $(".add-popup").fadeIn(500);
    });

    $(".closeing").click(function () {
        $(".popup").fadeOut(500);
    });

    $(".closed").click(function () {
        chrome.storage.local.set({ permissions: "disable" });
        $(".popup").fadeOut(500);
    });

    $(".forget-pass").click(function () {
        $('.login-screen').hide();
        $('.forgot-screen').show();
        $('.password-screen').hide();
    });

    $(".back-login").click(function () {
        $('.login-screen').show();
        $('.forgot-screen').hide();
        $('.password-screen').hide();
    });  
     $("#signup").click(function () {
        $('.signup-screen').show();
        $('.login-screen').hide();
        $('.forgot-screen').hide();
        $('.password-screen').hide();
    });  

    $(".logout-ext").click(function () {
        alert('Are you sure you want to logout');
        logout();
    });
  
    $("#login_form").validate({
        rules: {
            email:{
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        messages: {
            email:{
                required: "Email can not be empty",
                email: "Must be an email"
            },
            password: {
                required: "Password can not be empty"
            }
        },
        errorPlacement: function(error, element) {
            error.insertAfter($(element).parent());
        },
        submitHandler: function() {
            checkLogins();
            return false;
        }
    });

     $("#signup_form").validate({
        rules: {
           name:{
                required: true,
            },
            email:{
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        messages: {
          name: {
                required: "Name can not be empty"
            },
            email:{
                required: "Email can not be empty",
                email: "Must be an email"
            },
            password: {
                required: "Password can not be empty"
            }
        },
        errorPlacement: function(error, element) {
            error.insertAfter($(element).parent());
        },
        submitHandler: function() {
            registeruser();
            return false;
        }
    });

    $("#forgotpassword").validate({
      rules: {
          email:{
              required: true,
              email: true
          }
      },
      messages: {
          email:{
              required: "Email can not be empty",
              email: "Must be an email"
          },
      },
      errorPlacement: function(error, element) {
          error.insertAfter($(element).parent());
      },
      submitHandler: function() {
          sendotp();
          return false;
      }
    });
    $("#setpassword").validate({
      rules: {
        otp:{
          required: true,
        },
        password: {
            required: true
        },
        confirmpassword: {
          required: true,
          equalTo: "#password"
        }
      },
      messages: {
        email:{
              required: "Otp can not be empty"
        },
        password: {
              required: "Password can not be empty"
        },
        confirmpassword: {
            required: "Confirm Password can not be empty",
            equalTo:"Confirm Password not match with password"
        }
      },
      errorPlacement: function(error, element) {
          error.insertAfter($(element).parent());
      },
      submitHandler: function() {
          resetpassword();
          return false;
      }
    }); 
});

function checkLogins() {
    $(".login_loader").css({"display": "block"});
    var email = document.forms["login_form"]["email"].value;
    var password = document.forms["login_form"]["password"].value;
    var apiBaseUrl = custom_data.baseUrl+'api/ext_login';
    var requestOptions = {
      method: 'POST',
      redirect: 'follow'
    };

    $.ajax({
        type: "POST",
        url: apiBaseUrl,
        data: {email:email, password:password},
        dataType: 'json'
    }).done(function(response) {
        console.log(response);
        if(response.status == 200){
          toastr.success(response.msg);
          chrome.storage.local.set({jwt_token:response.apiToken});
          $(".login_loader").css({"display": "none"});
          $('.login-screen').hide();
          $('.forgot-screen').hide();
          $('.password-screen').hide();
          $('#tags-screen').show();
          $('.without-login header').hide();
        }
        else{
          $(".login_loader").css({"display": "none"});
          toastr.error(response.msg);
        }
    }).fail(function(xhr, status, error) {
        $(".login_loader").css({"display": "none"});
        toastr.error(error);
    });
}

function registeruser() {
    $(".login_loader").css({"display": "block"});
        var name = document.forms["signup_form"]["name"].value;
    var email = document.forms["signup_form"]["email"].value;
    var password = document.forms["signup_form"]["password"].value;
    var apiBaseUrl = custom_data.baseUrl+'api/registeruser';
    var requestOptions = {
      method: 'POST',
      redirect: 'follow'
    };

    $.ajax({
        type: "POST",
        url: apiBaseUrl,
        data: {name:name, email:email, password:password},
        dataType: 'json'
    }).done(function(response) {
        console.log(response);
        if(response.status == 200){
          toastr.success(response.msg);
          chrome.storage.local.set({jwt_token:response.apiToken});
          $(".login_loader").css({"display": "none"});
          $('.login-screen').show();
           $('.signup-screen').hide();
          $('.forgot-screen').hide();
          $('.password-screen').hide();
          $('#tags-screen').hide();
          $('.without-login header').hide();
        }
        else{
          $(".login_loader").css({"display": "none"});
          toastr.error(response.msg);
        }
    }).fail(function(xhr, status, error) {
        $(".login_loader").css({"display": "none"});
        toastr.error(error);
    });
}

function sendotp() {
  $(".otp_loader").css({"display": "block"});
  var email = document.forms["sendotp"]["email"].value;
    var apiBaseUrl = custom_data.baseUrl+'api/sendotp';
    console.log(apiBaseUrl);
    $.ajax({
        type: "POST",
        url: apiBaseUrl,
        data: {email:email},
        dataType: 'json'
    }).done(function(response) {
      console.log(response)
        if(response.status == 200){
             toastr.success(response.msg);
             $(".otp_loader").css({"display": "none"});
            chrome.storage.local.set({otpemail:email});
             $('.login-screen').hide();
              $('.forgot-screen').hide();
             $('.password-screen').show();
        }
        else{
          $(".otp_loader").css({"display": "none"});
          toastr.error(response.msg);
        }
    }).fail(function(xhr, status, error) {
      $(".otp_loader").css({"display": "none"});
        toastr.error(error);
    });
}

function resetpassword() {
  $(".password_loader").css({"display": "block"});
  var otp = document.forms["setpassword"]["otp"].value;
  var password = document.forms["setpassword"]["password"].value;
  var apiBaseUrl = custom_data.baseUrl+'api/setpassword';
    chrome.storage.local.get('otpemail', function(result){
      $.ajax({
        type: "POST",
        url: apiBaseUrl,
        data: {email:result.otpemail,otp:otp,password:password},
        dataType: 'json'
    }).done(function(response) {
      console.log(response)
        if(response.status == 200){
             toastr.success(response.msg);
             $(".password_loader").css({"display": "none"});
             chrome.storage.local.remove('otpemail', function(){
          });
             $('.login-screen').hide();
              $('.forgot-screen').hide();
             $('.password-screen').hide();
        }
        else{
          $(".password_loader").css({"display": "none"});
          toastr.error(response.msg);
        }
    }).fail(function(xhr, status, error) {
      $(".password_loader").css({"display": "none"});
        toastr.error(error);
    });
    });
}

// TRIGGER LOGOUT
function logout() {    
    toastr.success('Logout Successfully');
    chrome.storage.local.remove({jwt_token:''});
    chrome.runtime.reload();
    $(".login_loader").css({"display": "none"});
    $('.login-screen').show();
    $('.forgot-screen').hide();
    $('.password-screen').hide();
    $('#tags-screen').hide();
    $('.without-login header').show();
}

chrome.storage.local.get(["permissions", "jwt_token",  "otpemail"], function (result) {
    console.log(result);
    if (typeof result.permissions !== undefined || result.permissions == "") { 
        $(".terms-popup").hide(); 
    }

    if (typeof result.jwt_token != "undefined" && result.jwt_token != "") { 
        $('.login-screen').hide();
        $('.forgot-screen').hide();
        $('.password-screen').hide();
        $('#tags-screen').show();
        $('.without-login header').hide();
        fetchtag();
    }
    // else if (typeof result.otpemail !== undefined || result.otpemail == "") { 
    //     $('.login-screen').hide();
    //     $('.forgot-screen').hide();
    //     $('.password-screen').show();
    //     $('#tags-screen').hide();
    //     $('.without-login header').hide();
    // }
});


function fetchtag() {
    chrome.storage.local.get('jwt_token', function(result){
      if (typeof result.jwt_token != "undefined" && result.jwt_token != "") { 
        var authtoken = result.jwt_token;
        var apiBaseUrl = custom_data.baseUrl+'extension/getTagsWithCounter';
        console.log("hello");
            $.ajax({
          type: "POST",
          url: apiBaseUrl,
          data: {},
          headers: {"Authorization": "Bearer " + authtoken},
          dataType: 'json'
      }).done(function(response) {
          if(response.status == 200){
            $.each(response.tagDetails, function(index, element) {
                //append
                var appentag = `<div class="tags-outer">
                <div class="tags-item active">
                    <span class="tagss">`+element.name+`</span>
                    <span class="digits">`+element.users+`</span>
                </div><div class="tags-text ">`;
                
                $.each(element.tagusers, function(index, datauser) {
 appentag += `<div class="profile-items ">
     <input type="checkbox" name="">
     <img src="assets/images/profile.png">
     <span class="profiler">`+datauser+`</span>
     <button class="edit-btn border-none"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>
 </div>`
                });
              
                appentag += `</div></div>`;
                $(".tags-box").append(appentag);

                //lis += "<li>" + element.matching_full_name + "</li>"
      
              });
          //      toastr.success(response.msg);
          //      $(".password_loader").css({"display": "none"});
          //      chrome.storage.local.remove('otpemail', function(){
          //   });
          //      $('.login-screen').hide();
          //       $('.forgot-screen').hide();
          //      $('.password-screen').hide();
           }
          else{
          //   $(".password_loader").css({"display": "none"});
          //   toastr.error(response.msg);
         }
      }).fail(function(xhr, status, error) {
        $(".password_loader").css({"display": "none"});
          toastr.error(error);
      });
      } 
    });
      
  }



