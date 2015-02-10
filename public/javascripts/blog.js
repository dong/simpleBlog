// pagination
$('.page-num').on("click", function(event){
     $.get($(this).find('a').attr('href'), function(data, status){
           $(".page_content").html(data);
      });

    return false; // avoid to execute the actual submit of the form.
});

// click tag
$('a.list-group-item.blog-tag').on("click", function(event){
     $.get($(this).attr('href'), function(data, status){
           $(".page_content").html(data);
      });

    return false; // avoid to execute the actual submit of the form.
});
