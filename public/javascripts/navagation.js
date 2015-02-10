if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

$('.nav.navbar-nav > li').on("click", function(event){
    var text = $(this).text();
    if (text.toLowerCase().startsWith('welcome')==false) {
        $('.nav.navbar-nav > li').removeClass('active');
        console.log($('.nav.navbar-nav > li'));
        $(this).addClass('active');
        $('span.text-muted.tpad.welcome-title').html('» My ' +text);
        $.get("/"+text.toLowerCase().match(/\S+/g).join('_'), function(data,status){
            if(text.toLowerCase() == 'logout'){
              $('#welcome').parent().remove();
              $('#newBlog').parent().remove();
              $('#signIn').text('Signin');
            }
            $(".page_content").html(data);
            console.log(text.toLowerCase())
        });
    }
});

$('a.navbar-brand').on("click", function(event){
    $('.nav.navbar-nav > li').removeClass('active');
    $('.nav.navbar-nav > li:first-child').addClass('active');
    var text = $('.nav.navbar-nav > li:first-child').text();
    $('.span.text-muted.tpad.welcome-title').html('» My ' +text);
    $.get("/home", function(data,status){
        $(".page_content").html(data);
    });
});

