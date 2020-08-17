var sessionUser = JSON.parse(localStorage.getItem("sessionUser"));

$(document).ready(function () {
    function createUser(user) {
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://codify-dfec.restdb.io/rest/accounts",
            "method": "POST",
            "headers": {
              "content-type": "application/json",
              "x-apikey": "5f2be350a189196e40cc97df",
              "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(user)
        });
    }
    
    function User(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.favourites = [];
        this.badges = [];
    }
    
    function Course(title, desc, thumbnail, sections) {
        this.title = title;
        this.desc = desc;
        this.thumbnail = thumbnail;
        this.sections = sections;
    }

    /* function filterCourses(type) {
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://codify-dfec.restdb.io/rest/courses",
            "method": "GET",
            "headers": {
              "content-type": "application/json",
              "x-apikey": "5f2be350a189196e40cc97df",
              "cache-control": "no-cache"
            }
        })
        .done(function(res) {
            var sortedCourses = [];
            switch (type) {
                case "alphabetical":
                    for (const course of res) {
                        sortedCourses.push(`${course.title}`);
                    }
                    sortedCourses.sort();
                    break;
            }
            for (const courseTitle of sortedCourses) {
                for (const course of res) {
                    if (courseTitle == course.title) {
                        $('#explore-courses .carousel').flickity('prepend', $(`<div id="${course._id}" class="carousel-item pointer"><div class="course-card"><img src="${course.thumbnail}"><p class="course-card-title">${course.title}</p><p class="course-card-desc">${course.desc}</p></div></div>`));
                    }
                }
            }
        });
    }

    $('#btn-filter-courses').click(function () {
        filterCourses('alphabetical');
    }); */
    
    $('.carousel').flickity({
        cellAlign: 'left',
        contain: true,
        groupCells: 4,
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() > 0) {
            $('#nav-landing').addClass('nav-sticky');
        }
        else {
            $('#nav-landing').removeClass('nav-sticky');
        }
    });

    $('.password-visibility').click(function () {
        if ($('#login-password').attr('type') == 'password') {
            $(this).attr('src', 'images/icons/eye.svg');
            $('#login-password').attr('type', 'text');
        }
        else if ($('#login-password').attr('type') == 'text') {
            $(this).attr('src', 'images/icons/eye-slash.svg');
            $('#login-password').attr('type', 'password');
        }
    });
    
    $(document).on('click', '#sign-up-btn-sign-up', function () {
        if ($('#sign-up-email').val() != "" && $('#sign-up-username').val() != "" && $('#sign-up-password').val() != "") {
            // Clear all alert boxes before appending
            $('.alert').remove();
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "https://codify-dfec.restdb.io/rest/accounts",
                "method": "GET",
                "headers": {
                  "content-type": "application/json",
                  "x-apikey": "5f2be350a189196e40cc97df",
                  "cache-control": "no-cache"
                },
                "beforeSend": function () {
                    $('.loader').css('visibility', 'visible');
                }
            })
            .done(function (res) {
                $('.loader').css('visibility', 'hidden');
                let accountExists;

                $.each(res, function (key) {
                    if (res[key].email.toLowerCase() == $('#sign-up-email').val().toLowerCase() || res[key].username.toLowerCase() == $('#sign-up-username').val().toLowerCase()) {
                        accountExists = true;
                        return false;
                    }
                    accountExists = false;
                });
                if (accountExists) {
                    $('.ls-form').prepend('<div class="alert alert-danger">An account with that email or username already exists!<img class="close-alert" src="images/icons/cross.svg"></img></div>');
                    return false;
                }
                $('.ls-form').prepend('<div class="alert alert-success">Your account has been successfully created!<img class="close-alert" src="images/icons/cross.svg"></img></div>');
                let email = $('#sign-up-email').val();
                let username = $('#sign-up-username').val();
                let password = $('#sign-up-password').val();
                
                const newUser = new User(email, username, password);
                createUser(newUser);
                // Reset form if sign up is successful
                $('.ls-form form').trigger('reset');
            });
        }
        else {
            ($('#sign-up-email').val() == "") ? $('#sign-up-email').css('border-color', 'red') : $('#sign-up-email').css('border-color', '');
            ($('#sign-up-username').val() == "") ? $('#sign-up-username').css('border-color', 'red') : $('#sign-up-username').css('border-color', '');
            ($('#sign-up-password').val() == "") ? $('#sign-up-password').css('border-color', 'red') : $('#sign-up-password').css('border-color', '');
        }
    });
    
    $(document).on('click', '#login-btn-login', function () {
        // Clear all alert boxes before appending
        $('.alert').remove();

        if ($('#login-username').val() != "" && $('#login-password').val() != "") {
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "https://codify-dfec.restdb.io/rest/accounts",
                "method": "GET",
                "headers": {
                  "content-type": "application/json",
                  "x-apikey": "5f2be350a189196e40cc97df",
                  "cache-control": "no-cache"
                },
                "beforeSend": function () {
                    $('.loader').css('visibility', 'visible');
                }
            })
            .done(function (res) {
                $('.loader').css('visibility', 'hidden');

                $.each(res, function (key) {
                    if (res[key].username.toLowerCase() == $('#login-username').val().toLowerCase() && res[key].password == $('#login-password').val()) {
                        localStorage.setItem("sessionUser", JSON.stringify(res[key].username));
                        localStorage.setItem("sessionUserID", JSON.stringify(res[key]._id));
                        localStorage.setItem("sessionUserEmail", JSON.stringify(res[key].email));
                        localStorage.setItem("sessionUserFavourites", JSON.stringify(res[key].favourites));
                        localStorage.setItem("sessionUserBadges", JSON.stringify(res[key].badges));
                        window.location.assign("index.html");
                        return false;
                    }
                });
                $('.ls-form').prepend('<div class="alert alert-danger">Invalid username or password, please try again.<img class="close-alert" src="images/icons/cross.svg"></img></div>');
            });
        }
        else {
            ($('#login-username').val() == "") ? $('#login-username').css('border-color', 'red') : $('#login-username').css('border-color', '');
            ($('#login-password').val() == "") ? $('#login-password').css('border-color', 'red') : $('#login-password').css('border-color', '');
        }
    });

    $(document).on('click', '.close-alert', function () {
        $(this).parent().hide();
    });

    $(document).on('click', '.btn-logout', function () {
        localStorage.clear();
    });

    // Dynamically add sections based on number input
    $('#course-section-count').on('change keyup paste', function () {
        let base = '';
        for (var i = 1; i <= $('#course-section-count').val(); i++) {
            base += (`<section id="course-section-${i}"><h2>Section ${i}</h2><input class="video-title" type="text" placeholder="Video Title"><input class="video-desc" type="text" placeholder="Video Description"><input class="video-url" type="url" placeholder="Video URL"></section>`);
        }
        $('#course-sections').html(base);
    });

    // Upload a new course
    $(document).on('click', '#btn-upload-course', function() {
        if ($('#course-title').val() != "" && $('#course-desc').val() != "" && $('#course-thumbnail').val() != "" && $('#course-section-count').val() != "" && $('.video-title').val() != "" && $('.video-desc').val() != "" && $('.video-url').val() != "") {
            let videoTitle, videoDesc, videoURL, courseSections = [];
            for (var i = 1; i <= $('#course-section-count').val(); i++) {
                videoTitle = $(`#course-section-${i} .video-title`).val();
                videoDesc = $(`#course-section-${i} .video-desc`).val();
                videoURL = $(`#course-section-${i} .video-url`).val();
                let courseSection = {
                    "videoTitle": videoTitle,
                    "videoDesc": videoDesc,
                    "videoURL": videoURL
                }
                courseSections.push(courseSection);
            }
            const newCourse = new Course($('#course-title').val(), $('#course-desc').val(), $('#course-thumbnail').val(), courseSections);
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "https://codify-dfec.restdb.io/rest/courses",
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "x-apikey": "5f2be350a189196e40cc97df",
                    "cache-control": "no-cache"
                },
                "processData": false,
                "data": JSON.stringify(newCourse)
            })
            .done(function () {
                alert('done');
                $('#course-upload form').trigger('reset');
            });
        }
        else {
            ($('#course-title').val() == "") ? $('#course-title').css('border-color', 'red') : $('#course-title').css('border-color', '');
            ($('#course-desc').val() == "") ? $('#course-desc').css('border-color', 'red') : $('#course-desc').css('border-color', '');
            ($('#course-thumbnail').val() == "") ? $('#course-thumbnail').css('border-color', 'red') : $('#course-thumbnail').css('border-color', '');
            ($('#course-section-count').val() == "") ? $('#course-section-count').css('border-color', 'red') : $('#course-section-count').css('border-color', '');
            ($('.video-title').val() == "") ? $('.video-title').css('border-color', 'red') : $('.video-title').css('border-color', '');
            ($('.video-desc').val() == "") ? $('.video-desc').css('border-color', 'red') : $('.video-desc').css('border-color', '');
            ($('.video-url').val() == "") ? $('.video-url').css('border-color', 'red') : $('.video-url').css('border-color', '');
        }
    });

    // Load and display user-made courses
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://codify-dfec.restdb.io/rest/courses",
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "x-apikey": "5f2be350a189196e40cc97df",
          "cache-control": "no-cache"
        }
    })
    .done(function (res) {
        for (const course of res) {
            // onerror="this.src='images/xps.jpg'": https://www.quora.com/How-do-detect-if-an-image-URL-s-isn-t-able-to-load-in-browser-side-Java-script
            $('#explore-courses .carousel').flickity('prepend', $(`<div id="${course._id}" class="carousel-item pointer"><div class="course-card"><img src="${course.thumbnail}" onerror="this.src='images/xps.jpg'"><p class="course-card-title">${course.title}</p><p class="course-card-desc">${course.desc}</p></div></div>`));
        }
    });

    $(document).on('click', '.carousel-item', function () {
        window.location.assign('classroom.html');
    });

    // Show user profile upon login
    if (sessionUser != null) {
        $('nav').children('.menu').children().remove();
        $('nav').children('.menu').append(`<div class="user-profile"><img src="https://ui-avatars.com/api/?name=${sessionUser}&length=1&rounded=true&bold=true&background=3069f0&color=ffffff"><div class="dropdown-content"><a href="profile.html">View Profile</a><a href="settings.html">Settings & Privacy</a><a href="course-upload.html">Upload Courses</a><a class="btn-logout" href="index.html">Logout</a></div></div>`);
    }
});